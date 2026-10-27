import { Router } from 'express'
import { query } from '../db.js'
import { syncWithMidtrans } from '../payments.js'

const router = Router()

async function findTransaction(orderId) {
  const result = await query(
    `SELECT t.order_id, t.status, t.amount, m.name AS member_name, m.active_until, p.name AS plan_name
     FROM transactions t
     JOIN members m ON m.id = t.member_id
     JOIN plans p ON p.id = t.plan_id
     WHERE t.order_id = $1`,
    [orderId],
  )
  return result.rows[0]
}

router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params

  let transaction = await findTransaction(orderId)
  if (!transaction) {
    return res.status(404).json({ message: 'Transaksi tidak ditemukan.' })
  }

  // Cadangan sebelum webhook terpasang: tanyakan langsung ke Midtrans selama masih pending
  if (transaction.status === 'pending') {
    try {
      await syncWithMidtrans(orderId)
      transaction = await findTransaction(orderId)
    } catch (err) {
      console.error(`Gagal cek status ${orderId} ke Midtrans:`, err)
    }
  }

  res.json({
    orderId: transaction.order_id,
    status: transaction.status,
    memberName: transaction.member_name,
    planName: transaction.plan_name,
    amount: transaction.amount,
    activeUntil: transaction.status === 'paid' ? transaction.active_until : null,
  })
})

export default router