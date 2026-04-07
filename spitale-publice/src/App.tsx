import { useState, useEffect } from 'react'
import './index.css'
import RomaniaMap, { type Pin } from './RomaniaMap'
import { Footer } from './Footer'

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
    <div className="flex flex-col h-screen w-screen">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-slate-950 border-b border-slate-800 z-[1000]">
        {/* Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            className="w-4 h-4 text-blue-400">
            <path fillRule="evenodd"
              d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
              clipRule="evenodd" />
          </svg>
        </div>

        {/* Title */}
        <div className="flex items-baseline gap-2.5">
          <span className="text-sm font-semibold tracking-tight text-white">
            Spitale Publice
          </span>
          <span className="text-xs text-slate-500">Romania</span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Count badge */}
        {!loading && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
            text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            {pins.length} spitale
          </span>
        )}
      </header>

      {/* ── Map ─────────────────────────────────────────── */}
      <main className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            Se încarcă…
          </div>
        ) : (
          <RomaniaMap pins={pins} />
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <Footer />
    </div>
  )
}

export default App
