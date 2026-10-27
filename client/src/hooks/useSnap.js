import { useEffect, useState } from 'react'

const SNAP_SCRIPT_URL =
  import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'
const SCRIPT_ID = 'midtrans-snap-script'

export function useSnap() {
  const [isReady, setIsReady] = useState(() => Boolean(window.snap))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (window.snap) return

    let script = document.getElementById(SCRIPT_ID)
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = SNAP_SCRIPT_URL
      script.async = true
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY)
      document.body.appendChild(script)
    }

    function handleLoad() {
      setIsReady(true)
    }
    function handleError() {
      setError('Gagal memuat sistem pembayaran. Coba matikan ad blocker lalu muat ulang halaman.')
    }

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)
    return () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
    }
  }, [])

  function pay(token, callbacks) {
    window.snap.pay(token, callbacks)
  }

  return { isReady, error, pay }
}