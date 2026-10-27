import { useEffect, useState } from 'react'
import { getPlans } from '../api/plans.js'
import { registerMember } from '../api/register.js'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import PlanCard from '../components/PlanCard.jsx'
import { formatRupiah } from '../utils/format.js'
import { validateRegistration } from '../utils/validation.js'

const initialForm = { name: '', email: '', phone: '' }

function RegisterPage() {
  const [plans, setPlans] = useState([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [plansError, setPlansError] = useState(null)
  const [selectedPlanId, setSelectedPlanId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    let ignore = false

    getPlans()
      .then((data) => {
        if (!ignore) setPlans(data)
      })
      .catch((err) => {
        if (!ignore) setPlansError(err.message)
      })
      .finally(() => {
        if (!ignore) setIsLoadingPlans(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId)

  function handleSelectPlan(planId) {
    setSelectedPlanId(planId)
    setErrors((prev) => ({ ...prev, plan: undefined }))
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError(null)

    const newErrors = validateRegistration(form, selectedPlanId)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const { orderId } = await registerMember({ planId: selectedPlanId, ...form })
      // Sementara: tampilkan order ID. Di langkah 5C diganti dengan popup pembayaran Midtrans
      alert(`Pendaftaran tersimpan. Order ID: ${orderId}`)
    } catch (err) {
      if (err.errors) setErrors(err.errors)
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="text-2xl font-bold text-slate-800">Daftar Keanggotaan</h1>
      <p className="text-slate-500 mt-2">Pilih paket, lalu isi data diri kamu.</p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800">1. Pilih paket</h2>

        {isLoadingPlans ? (
          <div className="mt-4 flex items-center gap-3 text-slate-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            Memuat paket...
          </div>
        ) : plansError ? (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{plansError}</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={plan.id === selectedPlanId}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
        )}

        {errors.plan && <p className="mt-2 text-sm text-red-600">{errors.plan}</p>}
      </section>

      <section className="mt-8 max-w-lg">
        <h2 className="text-lg font-semibold text-slate-800">2. Data diri</h2>
        <div className="mt-4 space-y-4">
          <Input
            id="name"
            label="Nama lengkap"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="nama@email.com"
            autoComplete="email"
          />
          <Input
            id="phone"
            label="Nomor HP"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="081234567890"
            autoComplete="tel"
          />
        </div>
      </section>

      <div className="mt-8 max-w-lg">
        <p className="text-sm text-slate-600 mb-3">
          {selectedPlan ? (
            <>
              Paket terpilih: <strong>{selectedPlan.name}</strong> ({formatRupiah(selectedPlan.price)})
            </>
          ) : (
            'Belum ada paket yang dipilih.'
          )}
        </p>
        {submitError && (
          <p className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Lanjut ke pembayaran'}
        </Button>
      </div>
    </form>
  )
}

export default RegisterPage