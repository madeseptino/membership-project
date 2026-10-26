const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Nomor HP Indonesia: diawali 08, 628, atau +628, total 10–13 digit
const PHONE_PATTERN = /^(\+62|62|0)8[0-9]{8,11}$/

export function validateRegistration(form, selectedPlanId) {
  const errors = {}

  if (!selectedPlanId) {
    errors.plan = 'Pilih salah satu paket.'
  }
  if (form.name.trim().length < 3) {
    errors.name = 'Nama minimal 3 karakter.'
  }
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Format email tidak valid.'
  }
  if (!PHONE_PATTERN.test(form.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Nomor HP tidak valid. Contoh: 081234567890'
  }

  return errors
}