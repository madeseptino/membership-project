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
    const fallbackMessage = [502, 503, 504].includes(response.status)
      ? 'Server sedang tidak dapat dihubungi. Silakan coba beberapa saat lagi.'
      : 'Terjadi kesalahan. Silakan coba lagi.'
    const message = data?.message ?? fallbackMessage

    const error = new Error(message)
    error.status = response.status
    error.errors = data?.errors
    throw error
  }

  return data
}