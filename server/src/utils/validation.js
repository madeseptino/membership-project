const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^(\+62|62|0)8[0-9]{8,11}$/

export function validateRegistration(body) {
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const phone = typeof body?.phone === 'string' ? body.phone.replace(/[\s-]/g, '') : ''
  const planId = Number(body?.planId)

  const errors = {}
  if (!Number.isInteger(planId) || planId <= 0) {
    errors.plan = 'Pilih salah satu paket.'
  }
  if (name.length < 3 || name.length > 100) {
    errors.name = 'Nama harus 3–100 karakter.'
  }
  if (email.length > 255 || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Format email tidak valid.'
  }
  if (!PHONE_PATTERN.test(phone)) {
    errors.phone = 'Nomor HP tidak valid. Contoh: 081234567890'
  }

  return { errors, data: { name, email, phone, planId } }
}