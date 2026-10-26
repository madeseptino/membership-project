const MEMBER_STATUS_STYLES = {
  active: { label: 'Aktif', className: 'bg-green-100 text-green-800' },
  expired: { label: 'Kedaluwarsa', className: 'bg-slate-200 text-slate-700' },
  inactive: { label: 'Belum aktif', className: 'bg-amber-100 text-amber-800' },
}

function MemberStatusBadge({ status }) {
  const style = MEMBER_STATUS_STYLES[status] ?? { label: status, className: 'bg-slate-200 text-slate-700' }

  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${style.className}`}>
      {style.label}
    </span>
  )
}

export default MemberStatusBadge