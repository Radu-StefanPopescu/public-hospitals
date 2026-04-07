import { useState, useEffect } from 'react'
import './App.css'
import RomaniaMap, { type Pin } from './RomaniaMap'

function App() {
  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/hospitals.json')
      .then((r) => r.json())
      .then((data: Pin[]) => setPins(data))
      .catch((err) => console.error('Failed to load hospitals:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Spitale Publice Romania</h1>
        {!loading && <p>{pins.length} spitale</p>}
      </header>
      <main className="app-main">
        {loading ? (
          <div className="loading">Se incarca...</div>
        ) : (
          <RomaniaMap pins={pins} />
        )}
      </main>
    </div>
  )
}

export default App
