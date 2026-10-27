import { query, withTransaction } from './db.js'
import { getTransactionStatus } from './midtrans.js'

// Terjemahkan status Midtrans ke status aplikasi kita
export function mapMidtransStatus(transactionStatus, fraudStatus) {
  switch (transactionStatus) {
    case 'settlement':
      return 'paid'
    case 'capture':
      return fraudStatus === 'accept' ? 'paid' : 'pending'
    case 'pending':
      return 'pending'
    case 'deny':
    case 'failure':
      return 'failed'
    case 'cancel':
      return 'cancelled'
    case 'expire':
      return 'expired'
    case 'refund':
    case 'partial_refund':
    case 'chargeback':
    case 'partial_chargeback':
      return 'refunded'
    default:
      return null
  }
}

// Terapkan data status dari Midtrans ke database.
// Dipakai oleh endpoint status sekarang, dan oleh webhook nanti.
export async function applyMidtransStatus(payload) {
  const newStatus = mapMidtransStatus(payload.transaction_status, payload.fraud_status)

  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `SELECT t.id, t.member_id, t.amount, t.status, p.duration_days
       FROM transactions t
       JOIN plans p ON p.id = t.plan_id
       WHERE t.order_id = $1
       FOR UPDATE OF t`,
      [payload.order_id],
    )
    const transaction = rows[0]
    if (!transaction) {
      return { ok: false, reason: 'not_found' }
    }

    if (Number(payload.gross_amount) !== transaction.amount) {
      console.warn(
        `Nominal tidak cocok untuk ${payload.order_id}: Midtrans ${payload.gross_amount}, database ${transaction.amount}`,
      )
      return { ok: false, reason: 'amount_mismatch' }
    }

    await client.query(
      `UPDATE transactions
       SET midtrans_status = $1, payment_type = $2, raw_notification = $3, updated_at = now()
       WHERE id = $4`,
      [payload.transaction_status, payload.payment_type ?? null, payload, transaction.id],
    )

    // Status tidak dikenal, sama dengan sekarang, atau "pending" (tidak boleh menimpa status lain)
    if (!newStatus || newStatus === transaction.status || newStatus === 'pending') {
      return { ok: true, status: transaction.status }
    }

    // Transaksi yang sudah lunas hanya boleh berubah menjadi refunded
    if (transaction.status === 'paid' && newStatus !== 'refunded') {
      return { ok: true, status: transaction.status }
    }

    if (newStatus === 'paid') {
      const memberResult = await client.query(
        'SELECT active_until FROM members WHERE id = $1 FOR UPDATE',
        [transaction.member_id],
      )
      const activeUntil = memberResult.rows[0].active_until
      const isAlreadyActive = activeUntil && new Date(activeUntil) > new Date()

      if (isAlreadyActive) {
        // Pembayaran ganda: catat sebagai lunas, tapi masa aktif tidak ditambah
        await client.query(
          `UPDATE transactions SET status = 'paid', paid_at = now(), needs_refund = true WHERE id = $1`,
          [transaction.id],
        )
      } else {
        await client.query(
          `UPDATE transactions SET status = 'paid', paid_at = now() WHERE id = $1`,
          [transaction.id],
        )
        await client.query(
          `UPDATE members
           SET active_until = now() + make_interval(days => $1), updated_at = now()
           WHERE id = $2`,
          [transaction.duration_days, transaction.member_id],
        )
      }
      return { ok: true, status: 'paid' }
    }

    await client.query('UPDATE transactions SET status = $1 WHERE id = $2', [newStatus, transaction.id])
    return { ok: true, status: newStatus }
  })
}

// Tanyakan status ke Midtrans, lalu terapkan ke database
export async function syncWithMidtrans(orderId) {
  const data = await getTransactionStatus(orderId)

  if (data?.status_code === '404') {
    // Belum ada di Midtrans (user belum memilih metode bayar). Kalau batas waktunya lewat, tandai kedaluwarsa
    await query(
      `UPDATE transactions SET status = 'expired', updated_at = now()
       WHERE order_id = $1 AND status = 'pending' AND expires_at < now()`,
      [orderId],
    )
    return
  }

  if (data?.transaction_status) {
    await applyMidtransStatus(data)
  }
}