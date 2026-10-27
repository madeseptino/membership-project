import { apiRequest } from './client.js'

export function getPlans() {
  return apiRequest('/api/plans')
}