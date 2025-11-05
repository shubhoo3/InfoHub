const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// 1) Quote API - start with mock data, optionally call external API
const mockQuotes = [
  { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { content: 'Whether you think you can or you think you can’t, you’re right.', author: 'Henry Ford' },
  { content: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
  { content: 'Well begun is half done.', author: 'Aristotle' },
  { content: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' }
]

app.get('/api/quote', async (_req, res) => {
  try {
    // Try Quotable first for freshness; fall back to mock if it fails
    try {
      const q = await axios.get('https://api.quotable.io/random', { timeout: 4000 })
      return res.json({ content: q.data.content, author: q.data.author })
    } catch (_e) {
      const q = mockQuotes[Math.floor(Math.random() * mockQuotes.length)]
      return res.json(q)
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch quote' })
  }
})

// 2) Weather API
// Uses OpenWeatherMap (metric). Requires WEATHER_API_KEY in .env
// Accepts ?city=CityName (default London)
app.get('/api/weather', async (req, res) => {
  const city = (req.query.city || process.env.WEATHER_CITY || 'London').toString()
  const apiKey = process.env.WEATHER_API_KEY

  if (!apiKey) {
    return res.status(501).json({ error: 'WEATHER_API_KEY not set. Add it to server/.env' })
  }

  try {
    const url = 'https://api.openweathermap.org/data/2.5/weather'
    const { data } = await axios.get(url, {
      params: { q: city, appid: apiKey, units: 'metric' },
      timeout: 6000
    })
    const simplified = {
      city: data.name,
      temperature: data.main?.temp,
      condition: data.weather?.[0]?.description || 'N/A'
    }
    return res.json(simplified)
  } catch (err) {
    const status = err.response?.status || 500
    return res.status(status).json({ error: 'Failed to fetch weather' })
  }
})

// 3) Currency API
// Accepts ?amount=NUMBER (INR)
// Uses exchangerate.host (free) to fetch INR->USD/EUR rates
app.get('/api/currency', async (req, res) => {
  const amount = parseFloat((req.query.amount || '0').toString())
  if (Number.isNaN(amount) || amount < 0) {
    return res.status(400).json({ error: 'amount must be a non-negative number' })
  }
  try {
    // Primary source
    const { data } = await axios.get('https://api.exchangerate.host/latest', {
      params: { base: 'INR', symbols: 'USD,EUR' },
      timeout: 6000
    })
    let usdRate = data?.rates?.USD
    let eurRate = data?.rates?.EUR

    // Fallback source if primary missing/invalid
    if (typeof usdRate !== 'number' || typeof eurRate !== 'number') {
      const alt = await axios.get('https://open.er-api.com/v6/latest/INR', { timeout: 6000 })
      usdRate = alt.data?.rates?.USD
      eurRate = alt.data?.rates?.EUR
    }

    if (typeof usdRate !== 'number' || typeof eurRate !== 'number') {
      return res.status(502).json({ error: 'Invalid rate data' })
    }

    return res.json({ usd: amount * usdRate, eur: amount * eurRate })
  } catch (_err) {
    return res.status(500).json({ error: 'Failed to fetch exchange rates' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})


