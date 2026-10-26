import { useState } from 'react'
import AdminDashboard from '../components/AdminDashboard.jsx'
import AdminLoginForm from '../components/AdminLoginForm.jsx'

const TOKEN_KEY = 'adminToken'

function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY))

  function handleLogin(newToken) {
    sessionStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  }

  function handleLogout() {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  if (!token) {
    return <AdminLoginForm onLogin={handleLogin} />
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />
}

export default AdminPage