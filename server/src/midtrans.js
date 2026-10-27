const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true'
const SNAP_BASE_URL = IS_PRODUCTION ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com'
const CORE_API_BASE_URL = IS_PRODUCTION ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com'

if (!process.env.MIDTRANS_SERVER_KEY) {
  console.warn('PERINGATAN: MIDTRANS_SERVER_KEY belum diisi di file .env')
}

function authHeader() {
  const encoded = Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')
  return `Basic ${encoded}`
}

async function midtransPost(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => null)
  return { response, data }
}

export async function createSnapTransaction({ orderId, amount, plan, customer, expiryMinutes }) {
  const { response, data } = await midtransPost(`${SNAP_BASE_URL}/snap/v1/transactions`, {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    item_details: [
      {
        id: `PLAN-${plan.id}`,
        price: amount,
        quantity: 1,
        name: `Keanggotaan ${plan.name}`,
      },
    ],
    customer_details: {
      first_name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
    expiry: {
      unit: 'minutes',
      duration: expiryMinutes,
    },
  })

  if (!response.ok) {
    const detail = data?.error_messages?.join(', ') ?? 'tanpa keterangan'
    throw new Error(`Midtrans Snap error ${response.status}: ${detail}`)
  }

  return { token: data.token, redirectUrl: data.redirect_url }
}

export async function cancelTransaction(orderId) {
  const { data } = await midtransPost(`${CORE_API_BASE_URL}/v2/${encodeURIComponent(orderId)}/cancel`)
  console.log(`Midtrans cancel ${orderId}: ${data?.status_code} ${data?.status_message}`)
  return data
}