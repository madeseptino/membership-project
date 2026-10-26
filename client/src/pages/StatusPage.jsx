import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getTransactionStatus } from '../api/transactions.js'
import StatusBadge from '../components/StatusBadge.jsx'
import { formatDate, formatRupiah } from '../utils/format.js'

const POLL_INTERVAL_MS = 3000
const FINAL_STATUSES = ['paid', 'failed', 'expired', 'cancelled', 'refunded']
const RETRY_STATUSES = ['failed', 'expired', 'cancelled']

const STATUS_DESCRIPTIONS = {
  pending: 'Selesaikan pembayaran sesuai instruksi. Halaman ini akan diperbarui otomatis.',
  paid: 'Pembayaran diterima. Keanggotaan kamu sudah aktif.',
  failed: 'Pembayaran ditolak. Silakan coba daftar lagi.',
  expired: 'Batas waktu pembayaran sudah lewat. Silakan daftar lagi.',
  cancelled: 'Transaksi ini dibatalkan.',
  refunded: 'Pembayaran untuk transaksi ini sudah dikembalikan.',
}

function DetailRow({ label, children }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{children}</dd>
    </div>
  )
}

function StatusPage() {
  const { orderId } = useParams()
  const [transaction, setTransaction] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    let timeoutId

    async function load() {
      try {
        const data = await getTransactionStatus(orderId)
        if (ignore) return
        setTransaction(data)
        setError(null)

        if (!FINAL_STATUSES.includes(data.status)) {
          timeoutId = setTimeout(load, POLL_INTERVAL_MS)
        }
      } catch (err) {
        if (!ignore) setError(err.message)
      }
    }

    load()

    return () => {
      ignore = true
      clearTimeout(timeoutId)
    }
  }, [orderId])

  if (error) {
    return (
      <div className="max-w-lg rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Status Pembayaran</h1>
        <p className="mt-2 text-red-600">{error}</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Kembali ke halaman pendaftaran
        </Link>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="flex items-center gap-3 text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        Memuat status pembayaran...
      </div>
    )
  }

  return (
    <div className="max-w-lg rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Status Pembayaran</h1>
        <StatusBadge status={transaction.status} />
      </div>
      <p className="mt-2 text-slate-600">{STATUS_DESCRIPTIONS[transaction.status]}</p>

      {transaction.status === 'pending' && (
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          Memeriksa status setiap {POLL_INTERVAL_MS / 1000} detik...
        </p>
      )}

      <dl className="mt-6 divide-y divide-slate-100 text-sm">
        <DetailRow label="Order ID">
          <span className="font-mono">{transaction.orderId}</span>
        </DetailRow>
        <DetailRow label="Nama">{transaction.memberName}</DetailRow>
        <DetailRow label="Paket">{transaction.planName}</DetailRow>
        <DetailRow label="Total">{formatRupiah(transaction.amount)}</DetailRow>
        {transaction.activeUntil && (
          <DetailRow label="Aktif sampai">{formatDate(transaction.activeUntil)}</DetailRow>
        )}
      </dl>

      {RETRY_STATUSES.includes(transaction.status) && (
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Daftar lagi
        </Link>
      )}
    </div>
  )
}

export default StatusPage