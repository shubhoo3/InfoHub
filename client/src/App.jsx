import { useState } from 'react'
import WeatherModule from './components/WeatherModule.jsx'
import CurrencyConverter from './components/CurrencyConverter.jsx'
import QuoteGenerator from './components/QuoteGenerator.jsx'

const tabs = [
  { key: 'weather', label: 'Weather' },
  { key: 'currency', label: 'Currency' },
  { key: 'quotes', label: 'Quotes' }
]

export default function App() {
  const [activeTab, setActiveTab] = useState('weather')

  return (
    <div className="app">
      <header className="header">
        <h1>InfoHub</h1>
        <p className="subtitle">Weather · Currency · Quotes</p>
      </header>

      <nav className="tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={activeTab === t.key ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {activeTab === 'weather' && <WeatherModule />}
        {activeTab === 'currency' && <CurrencyConverter />}
        {activeTab === 'quotes' && <QuoteGenerator />}
      </main>

    </div>
  )
}


