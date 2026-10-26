import { Link, NavLink, Outlet } from 'react-router'

function navClass({ isActive }) {
  return isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
}

function Layout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
          <Link to="/" className="text-xl font-bold text-slate-800">
            Membership Project
          </Link>

          {/* Navigasi sementara untuk testing, nanti dihapus */}
          <nav className="flex flex-wrap gap-x-6 gap-y-1">
            <NavLink to="/" end className={navClass}>Daftar</NavLink>
            <NavLink to="/status/ORDER-CONTOH-123" className={navClass}>Status (contoh)</NavLink>
            <NavLink to="/admin" className={navClass}>Admin</NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout