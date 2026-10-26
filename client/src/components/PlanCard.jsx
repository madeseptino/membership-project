import { formatRupiah } from '../utils/format.js'

function PlanCard({ plan, selected, onSelect }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(plan.id)}
      className={`text-left rounded-xl border-2 p-5 transition ${
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <p className="text-sm font-medium text-slate-500">{plan.name}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{formatRupiah(plan.price)}</p>
      <p className="mt-1 text-sm text-slate-500">Aktif {plan.durationDays} hari</p>
    </button>
  )
}

export default PlanCard