const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatRupiah(amount) {
  return rupiahFormatter.format(amount)
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export function formatDate(isoString) {
    return dateFormatter.format(new Date(isoString))
}

const PAYMENT_TYPE_LABELS = {
  bank_transfer: 'Virtual Account',
  echannel: 'Mandiri Bill',
  qris: 'QRIS',
  gopay: 'GoPay',
  shopeepay: 'ShopeePay',
  credit_card: 'Kartu kredit',
}

export function formatPaymentType(paymentType) {
  if (!paymentType) return '-'
  return PAYMENT_TYPE_LABELS[paymentType] ?? paymentType
}