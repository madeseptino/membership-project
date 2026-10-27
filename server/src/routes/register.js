import { Router } from 'express'
import { query, withTransaction } from '../db.js'
import { generateOrderId } from '../utils/orderId.js'
import { validateRegistration } from '../utils/validation.js'

const PAYMENT_WINDOW_MINUTES = 60
const router = Router()

router.post('/', async (req, res) => {
  const { errors, data } = validateRegistration(req.body)
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Data pendaftaran tidak valid.', errors })
  }

  const planResult = await query(
    'SELECT id, name, price FROM plans WHERE id = $1 AND is_active = true',
    [data.planId],
  )
  const plan = planResult.rows[0]
  if (!plan) {
    return res.status(400).json({
      message: 'Paket tidak tersedia.',
      errors: { plan: 'Paket tidak tersedia.' },
    })
  }

  const result = await withTransaction(async (client) => {
    // Pastikan baris anggota ada, lalu kunci baris itu supaya
    // dua pendaftaran bersamaan dengan email yang sama tidak saling tabrak
    await client.query(
      `INSERT INTO members (name, email, phone) VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [data.name, data.email, data.phone],
    )
    const memberResult = await client.query(
      'SELECT id, active_until FROM members WHERE email = $1 FOR UPDATE',
      [data.email],
    )
    const member = memberResult.rows[0]

    if (member.active_until && new Date(member.active_until) > new Date()) {
      return { rejected: true, activeUntil: member.active_until }
    }

    await client.query(
      'UPDATE members SET name = $1, phone = $2, updated_at = now() WHERE id = $3',
      [data.name, data.phone, member.id],
    )

    // Batalkan transaksi pending lama (pembatalan di Midtrans ditambahkan di langkah 5B)
    await client.query(
      `UPDATE transactions SET status = 'cancelled', updated_at = now()
       WHERE member_id = $1 AND status = 'pending'`,
      [member.id],
    )

    const orderId = generateOrderId()
    await client.query(
      `INSERT INTO transactions (order_id, member_id, plan_id, amount, expires_at)
       VALUES ($1, $2, $3, $4, now() + make_interval(mins => $5))`,
      [orderId, member.id, plan.id, plan.price, PAYMENT_WINDOW_MINUTES],
    )

    return { rejected: false, orderId }
  })

  if (result.rejected) {
    return res.status(409).json({
      message: 'Email ini sudah terdaftar dan keanggotaannya masih aktif.',
      errors: { email: 'Email sudah terdaftar dan masih aktif.' },
      activeUntil: result.activeUntil,
    })
  }

  res.status(201).json({ orderId: result.orderId })
})

export default router