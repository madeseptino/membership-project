import { useState } from 'react'
import { loginAdmin } from '../api/admin.js'
import Button from './Button.jsx'
import Input from './Input.jsx'

function AdminLoginForm({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    setPassword(event.target.value)
    setError(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!password) {
      setError('Password wajib diisi.')
      return
    }

    setIsSubmitting(true)
    try {
      const { token } = await loginAdmin(password)
      onLogin(token)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-bold text-slate-800">Login Admin</h1>
      <p className="mt-2 text-sm text-slate-500">Masukkan password untuk membuka dashboard.</p>

      <div className="mt-6">
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={handleChange}
          error={error}
          autoComplete="current-password"
        />
      </div>

      <div className="mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </Button>
      </div>

      <p className="mt-4 text-xs text-slate-400">Password sementara (mock): admin123</p>
    </form>
  )
}

export default AdminLoginForm