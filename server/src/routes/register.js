import { Router } from 'express'
import { query, withTransaction } from '../db.js'
import { generateOrderId } from '../utils/orderId.js'
import { validateRegistration } from '../utils/validation.js'
import { cancelTransaction, createSnapTransaction } from '../midtrans.js'

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
    const cancelledResult = await client.query(
      `UPDATE transactions SET status = 'cancelled', updated_at = now()
       WHERE member_id = $1 AND status = 'pending'
       RETURNING order_id`,
      [member.id],
    )

    const orderId = generateOrderId()
    await client.query(
      `INSERT INTO transactions (order_id, member_id, plan_id, amount, expires_at)
       VALUES ($1, $2, $3, $4, now() + make_interval(mins => $5))`,
      [orderId, member.id, plan.id, plan.price, PAYMENT_WINDOW_MINUTES],
    )

    return { 
      rejected: false, 
      orderId,
      cancelledOrderIds: cancelledResult.rows.map(row => row.order_id) 
    }
  })

  if (result.rejected) {
    return res.status(409).json({
      message: 'Email ini sudah terdaftar dan keanggotaannya masih aktif.',
      errors: { email: 'Email sudah terdaftar dan masih aktif.' },
      activeUntil: result.activeUntil,
    })
  }

  // Batalkan transaksi lama di Midtrans. Kalau gagal, tetap lanjut
  // (misalnya transaksi itu memang belum pernah dibuka di Midtrans)
  await Promise.allSettled(result.cancelledOrderIds.map((id) => cancelTransaction(id)))

  let snap
  try {
    snap = await createSnapTransaction({
      orderId: result.orderId,
      amount: plan.price,
      plan,
      customer: data,
      expiryMinutes: PAYMENT_WINDOW_MINUTES,
    })
  } catch (err) {
    console.error(err)
    await query(
      `UPDATE transactions SET status = 'failed', updated_at = now() WHERE order_id = $1`,
      [result.orderId],
    )
    return res.status(502).json({ message: 'Gagal membuat pembayaran di Midtrans. Silakan coba lagi.' })
  }

  await query(
    'UPDATE transactions SET snap_token = $1, updated_at = now() WHERE order_id = $2',
    [snap.token, result.orderId],
  )

  res.status(201).json({
    orderId: result.orderId,
    snapToken: snap.token,
    redirectUrl: snap.redirectUrl,
  })
})

export default router