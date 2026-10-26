const STATUS_STYLES = {
  pending: { label: 'Menunggu pembayaran', className: 'bg-amber-100 text-amber-800' },
  paid: { label: 'Berhasil', className: 'bg-green-100 text-green-800' },
  failed: { label: 'Gagal', className: 'bg-red-100 text-red-800' },
  expired: { label: 'Kedaluwarsa', className: 'bg-slate-200 text-slate-700' },
  cancelled: { label: 'Dibatalkan', className: 'bg-slate-200 text-slate-700' },
  refunded: { label: 'Dana dikembalikan', className: 'bg-slate-200 text-slate-700' },
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? { label: status, className: 'bg-slate-200 text-slate-700' }

  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${style.className}`}>
      {style.label}
    </span>
  )
}

export default StatusBadge