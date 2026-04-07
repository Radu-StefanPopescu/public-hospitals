import { useEffect, useRef, useState } from 'react'

const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'

type Status = 'idle' | 'sending' | 'success' | 'error'

type Props = {
  open: boolean
  onClose: () => void
}

export function FeedbackModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Reset state each time modal opens
  useEffect(() => {
    if (open) {
      setEmail('')
      setMessage('')
      setStatus('idle')
    }
  }, [open])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, message }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-[9999] flex items-center justify-center
        bg-black/40 backdrop-blur-sm"
    >
      {/* Panel */}
      <div className="relative w-full max-w-md mx-4 rounded-xl
        bg-white shadow-2xl border border-slate-200
        flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4
          border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Feedback / Raportați o problemă
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Trimiteți-ne un mesaj și vă răspundem în cel mai scurt timp.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-0.5 p-1.5 rounded-lg text-slate-400
              hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0
                1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75
                0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full
                bg-green-50 border border-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="currentColor" className="w-6 h-6 text-green-500">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75
                    0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75
                    0 0 1 1.05-.143Z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Mesaj trimis!</p>
                <p className="mt-1 text-sm text-slate-500">
                  Mulțumim pentru feedback. Vă vom răspunde pe email.
                </p>
              </div>
              <button onClick={onClose}
                className="mt-2 px-4 py-2 rounded-lg text-sm font-medium
                  bg-slate-900 text-white hover:bg-slate-700 transition-colors">
                Închide
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="fb-email">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adresa@email.com"
                  className="w-full px-3 py-2 rounded-lg text-sm
                    border border-slate-300 bg-white text-slate-900
                    placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-shadow"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="fb-message">
                  Mesaj <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="fb-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descrieți problema sau sugestia dvs..."
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none
                    border border-slate-300 bg-white text-slate-900
                    placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-shadow"
                />
              </div>

              {/* Error */}
              {status === 'error' && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200
                  rounded-lg px-3 py-2">
                  A apărut o eroare. Vă rugăm să încercați din nou.
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600
                    hover:bg-slate-100 transition-colors">
                  Anulează
                </button>
                <button type="submit" disabled={status === 'sending'}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                    text-sm font-medium text-white bg-slate-900
                    hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed
                    transition-colors">
                  {status === 'sending' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/>
                      </svg>
                      Se trimite…
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                        fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M2.87 2.298a.75.75 0 0 0-.812 1.022l1.656 4.017a.75.75 0 0 0
                          .624.453l4.726.617-4.726.617a.75.75 0 0 0-.624.453l-1.656 4.017a.75.75
                          0 0 0 .812 1.022l11.25-4.5a.75.75 0 0 0 0-1.394l-11.25-4.5Z"/>
                      </svg>
                      Trimite feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
