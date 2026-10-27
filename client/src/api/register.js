import { apiRequest } from './client.js'

export function registerMember(payload) {
  return apiRequest('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}