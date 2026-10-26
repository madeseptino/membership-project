import { formatDate, formatPaymentType, formatRupiah } from '../utils/format.js'
import StatusBadge from './StatusBadge.jsx'

function TransactionsTable({ transactions }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Order ID</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Anggota</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Paket</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Total</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Metode</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Dibuat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                Tidak ada data transaksi.
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.orderId} className={transaction.needsRefund ? 'bg-red-50' : undefined}>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{transaction.orderId}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <p className="font-medium text-slate-800">{transaction.memberName}</p>
                  <p className="text-xs text-slate-400">{transaction.memberEmail}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3">{transaction.planName}</td>
                <td className="whitespace-nowrap px-4 py-3">{formatRupiah(transaction.amount)}</td>
                <td className="whitespace-nowrap px-4 py-3">{formatPaymentType(transaction.paymentType)}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={transaction.status} />
                    {transaction.needsRefund && (
                      <span className="whitespace-nowrap rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                        Perlu refund
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">{formatDate(transaction.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionsTable