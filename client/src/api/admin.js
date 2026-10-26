// SEMENTARA: login palsu sebelum backend siap.
// Password asli nanti disimpan di server/.env dan dicek oleh backend, BUKAN di kode frontend.
const MOCK_PASSWORD = 'admin123'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function loginAdmin(password) {
  await wait(800)

  if (password !== MOCK_PASSWORD) {
    throw new Error('Password salah.')
  }

  return { token: 'mock-admin-token' }
}

function daysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

// Nanti status anggota dihitung oleh backend dari kolom active_until
function getMemberStatus(activeUntil) {
  if (!activeUntil) return 'inactive'
  return new Date(activeUntil) > new Date() ? 'active' : 'expired'
}

const MOCK_MEMBERS = [
  { id: 1, name: 'Budi Santoso', email: 'budi@gmail.com', phone: '081234567890', activeUntil: daysFromNow(25), createdAt: daysFromNow(-5) },
  { id: 2, name: 'Siti Rahma', email: 'siti@gmail.com', phone: '085711112222', activeUntil: daysFromNow(-3), createdAt: daysFromNow(-183) },
  { id: 3, name: 'Andi Pratama', email: 'andi@gmail.com', phone: '089633334444', activeUntil: null, createdAt: daysFromNow(-1) },
]

const MOCK_TRANSACTIONS = [
  { orderId: 'MBR-20261022-A1B2C3', memberName: 'Budi Santoso', memberEmail: 'budi@gmail.com', planName: 'Bulanan', amount: 100000, status: 'paid', paymentType: 'bank_transfer', needsRefund: false, createdAt: daysFromNow(-5) },
  { orderId: 'MBR-20261022-D4E5F6', memberName: 'Budi Santoso', memberEmail: 'budi@gmail.com', planName: 'Bulanan', amount: 100000, status: 'paid', paymentType: 'qris', needsRefund: true, createdAt: daysFromNow(-5) },
  { orderId: 'MBR-20260427-G7H8I9', memberName: 'Siti Rahma', memberEmail: 'siti@gmail.com', planName: '6 Bulan', amount: 300000, status: 'paid', paymentType: 'gopay', needsRefund: false, createdAt: daysFromNow(-183) },
  { orderId: 'MBR-20261026-J1K2L3', memberName: 'Andi Pratama', memberEmail: 'andi@gmail.com', planName: 'Tahunan', amount: 500000, status: 'expired', paymentType: 'bank_transfer', needsRefund: false, createdAt: daysFromNow(-1) },
  { orderId: 'MBR-20261027-M4N5O6', memberName: 'Andi Pratama', memberEmail: 'andi@gmail.com', planName: 'Bulanan', amount: 100000, status: 'pending', paymentType: null, needsRefund: false, createdAt: daysFromNow(0) },
]

export async function getMembers(token) {
  await wait(700)
  if (!token) throw new Error('Sesi admin tidak valid. Silakan login ulang.')
  return MOCK_MEMBERS.map((member) => ({ ...member, status: getMemberStatus(member.activeUntil) }))
}

export async function getTransactions(token) {
  await wait(900)
  if (!token) throw new Error('Sesi admin tidak valid. Silakan login ulang.')
  return MOCK_TRANSACTIONS
}