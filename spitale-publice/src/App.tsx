import { useState, useEffect } from 'react'
import './index.css'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { RomaniaMap } from './features/map'
import type { Pin } from './types/hospital'
import { TEXT } from './constants/text'

export const App = () => {
  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)

  const styles = {
    root: 'flex flex-col h-screen w-screen',
    main: 'flex-1 min-h-0',
    loading: 'flex items-center justify-center h-full text-slate-500 text-sm',
  }

  useEffect(() => {
    fetch('/hospitals.json')
      .then((r) => r.json())
      .then((data: Pin[]) => setPins(data))
      .catch((err) => console.error('Failed to load hospitals:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.root}>
      <Header hospitalCount={loading ? undefined : pins.length} />
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>{TEXT.loading}</div>
        ) : (
          <RomaniaMap pins={pins} />
        )}
      </main>
      <Footer />
    </div>
  )
}
