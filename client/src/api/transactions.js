// SEMENTARA: data palsu untuk membangun tampilan sebelum backend siap.
// Nanti isi fungsi ini diganti dengan fetch(`/api/status/${orderId}`), tanpa mengubah komponen.
const PENDING_DURATION_MS = 10000
const firstSeenAt = new Map()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getTransactionStatus(orderId) {
  console.log('Cek status:', orderId)
  await wait(600) // pura-pura menunggu jawaban server

  if (orderId.includes('NOTFOUND')) {
    throw new Error('Transaksi tidak ditemukan.')
  }

  if (!firstSeenAt.has(orderId)) {
    firstSeenAt.set(orderId, Date.now())
  }
  const elapsed = Date.now() - firstSeenAt.get(orderId)

  let status = elapsed < PENDING_DURATION_MS ? 'pending' : 'paid'
  if (orderId.includes('FAILED')) status = 'failed'
  if (orderId.includes('EXPIRED')) status = 'expired'

  const activeUntil =
    status === 'paid' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null

  return {
    orderId,
    status,
    memberName: 'Budi Santoso',
    planName: 'Bulanan',
    amount: 100000,
    activeUntil,
  }
}