import { formatDate } from '../utils/format.js'
import MemberStatusBadge from './MemberStatusBadge.jsx'

function MembersTable({ members }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Nama</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Email</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">No. HP</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Aktif sampai</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Terdaftar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {members.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                Tidak ada data anggota.
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id}>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{member.name}</td>
                <td className="whitespace-nowrap px-4 py-3">{member.email}</td>
                <td className="whitespace-nowrap px-4 py-3">{member.phone}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <MemberStatusBadge status={member.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {member.activeUntil ? formatDate(member.activeUntil) : '-'}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{formatDate(member.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default MembersTable