import { useEffect, useRef, useState } from 'react'
import { CheckIcon } from '../../../assets/icons/CheckIcon'
import { CloseIcon } from '../../../assets/icons/CloseIcon'
import { SendIcon } from '../../../assets/icons/SendIcon'
import { SpinnerIcon } from '../../../assets/icons/SpinnerIcon'
import { FORMSPREE_URL } from '../../../constants/config'
import { TEXT } from '../../../constants/text'

type Status = 'idle' | 'sending' | 'success' | 'error'

interface FeedbackModalProps {
  open: boolean
  onClose: () => void
}

export const FeedbackModal = ({ open, onClose }: FeedbackModalProps) => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)

  const styles = {
    overlay: 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm',
    panel: 'relative w-full max-w-md mx-4 rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col',
    header: 'flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100',
    title: 'text-base font-semibold text-slate-900',
    subtitle: 'mt-0.5 text-sm text-slate-500',
    closeBtn: 'ml-4 mt-0.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors',
    body: 'px-6 py-5',
    successWrap: 'flex flex-col items-center gap-3 py-6 text-center',
    successIcon: 'flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border border-green-200',
    successTitle: 'font-semibold text-slate-800',
    successBody: 'mt-1 text-sm text-slate-500',
    successBtn: 'mt-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 transition-colors',
    form: 'flex flex-col gap-4',
    fieldWrap: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-slate-700',
    required: 'text-red-500',
    input: 'w-full px-3 py-2 rounded-lg text-sm border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow',
    textarea: 'w-full px-3 py-2 rounded-lg text-sm resize-none border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow',
    errorMsg: 'text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2',
    actions: 'flex items-center justify-end gap-2 pt-1',
    cancelBtn: 'px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors',
    submitBtn: 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors',
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setEmail('')
      setMessage('')
      setStatus('idle')
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className={styles.overlay}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{TEXT.modalTitle}</h2>
            <p className={styles.subtitle}>{TEXT.modalSubtitle}</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className={styles.body}>
          {status === 'success' ? (
            <div className={styles.successWrap}>
              <div className={styles.successIcon}>
                <CheckIcon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className={styles.successTitle}>{TEXT.successTitle}</p>
                <p className={styles.successBody}>{TEXT.successBody}</p>
              </div>
              <button onClick={onClose} className={styles.successBtn}>
                {TEXT.buttonClose}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="fb-email">
                  {TEXT.labelEmail} <span className={styles.required}>*</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={TEXT.placeholderEmail}
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="fb-message">
                  {TEXT.labelMessage} <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="fb-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={TEXT.placeholderMessage}
                  className={styles.textarea}
                />
              </div>

              {status === 'error' && (
                <p className={styles.errorMsg}>{TEXT.errorBody}</p>
              )}

              <div className={styles.actions}>
                <button type="button" onClick={onClose} className={styles.cancelBtn}>
                  {TEXT.buttonCancel}
                </button>
                <button type="submit" disabled={status === 'sending'} className={styles.submitBtn}>
                  {status === 'sending' ? (
                    <>
                      <SpinnerIcon className="w-4 h-4 animate-spin" />
                      {TEXT.buttonSending}
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-3.5 h-3.5" />
                      {TEXT.buttonSend}
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
