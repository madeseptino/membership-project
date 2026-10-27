import { apiRequest } from './client.js'

export function getTransactionStatus(orderId) {
  return apiRequest(`/api/status/${encodeURIComponent(orderId)}`)
}