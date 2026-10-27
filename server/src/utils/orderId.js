import { randomBytes } from 'node:crypto'

export function generateOrderId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const random = randomBytes(3).toString('hex').toUpperCase()
  return `MBR-${date}-${random}`
}