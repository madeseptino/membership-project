export async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = [502, 503, 504].includes(response.status)
      ? 'Server sedang tidak dapat dihubungi. Silakan coba beberapa saat lagi.'
      : (data?.message ?? 'Terjadi kesalahan. Silakan coba lagi.')

    const error = new Error(message)
    error.status = response.status
    error.errors = data?.errors
    throw error
  }

  return data
}