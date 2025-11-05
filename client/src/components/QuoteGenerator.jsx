import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export default function QuoteGenerator() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quote, setQuote] = useState(null)

  async function getQuote() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/quote`)
      if (!res.ok) throw new Error('Failed to fetch quote')
      const json = await res.json()
      setQuote(json)
    } catch (e) {
      setError(e.message || 'Error fetching quote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="row">
        <button className="primary" onClick={getQuote} disabled={loading}>{loading ? 'Loading…' : 'Get Quote'}</button>
      </div>
      {error && <div className="card" style={{ borderColor: '#dc2626' }}>Error: {error}</div>}
      {quote && (
        <div className="card">
          <div style={{ fontSize: 18 }}>&ldquo;{quote.content}&rdquo;</div>
          <div className="muted" style={{ marginTop: 6 }}>— {quote.author || 'Unknown'}</div>
        </div>
      )}
    </section>
  )
}


