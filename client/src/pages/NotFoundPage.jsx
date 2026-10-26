import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-slate-800">404</h1>
      <p className="text-slate-500 mt-2">Halaman tidak ditemukan.</p>
      <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">
        Kembali ke halaman pendaftaran
      </Link>
    </div>
  )
}

export default NotFoundPage