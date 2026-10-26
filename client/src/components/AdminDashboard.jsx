import { useEffect, useState } from 'react'
import { getMembers, getTransactions } from '../api/admin.js'
import Button from './Button.jsx'
import Input from './Input.jsx'
import MembersTable from './MembersTable.jsx'
import TransactionsTable from './TransactionsTable.jsx'

function AdminDashboard({ token, onLogout }) {
  const [members, setMembers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('members')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const [membersData, transactionsData] = await Promise.all([
          getMembers(token),
          getTransactions(token),
        ])
        if (ignore) return
        setMembers(membersData)
        setTransactions(transactionsData)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [token])

  const keyword = search.trim().toLowerCase()
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(keyword) || member.email.toLowerCase().includes(keyword),
  )
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.orderId.toLowerCase().includes(keyword) ||
      transaction.memberName.toLowerCase().includes(keyword) ||
      transaction.memberEmail.toLowerCase().includes(keyword),
  )
  const refundCount = transactions.filter((transaction) => transaction.needsRefund).length

  const tabs = [
    { id: 'members', label: 'Anggota', count: filteredMembers.length },
    { id: 'transactions', label: 'Transaksi', count: filteredTransactions.length },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin</h1>
        <Button variant="secondary" onClick={onLogout}>
          Keluar
        </Button>
      </div>

      {refundCount > 0 && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Ada <strong>{refundCount}</strong> transaksi pembayaran ganda yang perlu di-refund manual
          lewat dashboard Midtrans.
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <div className="w-full sm:w-72">
          <Input
            id="search"
            label="Cari"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nama, email, atau order ID"
          />
        </div>
      </div>

      <div className="mt-4">
        {error ? (
          <p className="rounded-lg bg-white p-6 text-red-600 shadow-sm">{error}</p>
        ) : isLoading ? (
          <div className="flex items-center gap-3 text-slate-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            Memuat data...
          </div>
        ) : activeTab === 'members' ? (
          <MembersTable members={filteredMembers} />
        ) : (
          <TransactionsTable transactions={filteredTransactions} />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard