import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export default function WeatherModule() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [city, setCity] = useState('London')

  async function loadWeather(targetCity) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/weather?city=${encodeURIComponent(targetCity)}`)
      if (!res.ok) throw new Error('Failed to fetch weather')
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message || 'Error fetching weather')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadWeather(city) }, [])

  return (
    <section className="section">
      <div className="row">
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="City (e.g., London)" />
        <button className="primary" onClick={() => loadWeather(city)} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && <div className="card" style={{ borderColor: '#dc2626' }}>Error: {error}</div>}

      {data && (
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="muted">City</div>
              <div>{data.city}</div>
            </div>
            <div>
              <div className="muted">Temperature</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{Math.round(data.temperature)}°C</div>
            </div>
            <div>
              <div className="muted">Condition</div>
              <div>{data.condition}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}


