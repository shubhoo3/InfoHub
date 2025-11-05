import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  async function convert() {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/api/currency?amount=${encodeURIComponent(amount)}`)
      if (!res.ok) throw new Error('Failed to convert')
      const json = await res.json()
      setResult(json)
    } catch (e) {
      setError(e.message || 'Error converting')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="row">
        <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
        <span className="muted">INR</span>
        <button className="primary" onClick={convert} disabled={loading}>{loading ? 'Converting…' : 'Convert'}</button>
      </div>

      {error && <div className="card" style={{ borderColor: '#dc2626' }}>Error: {error}</div>}
      {result && (
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-around' }}>
            <div>
              <div className="muted">USD</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>${result.usd.toFixed(2)}</div>
            </div>
            <div>
              <div className="muted">EUR</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>€{result.eur.toFixed(2)}</div>
            </div>
          </div>
          <div className="muted" style={{ marginTop: 8 }}>Rate source: exchangerate.host</div>
        </div>
      )}
    </section>
  )
}


