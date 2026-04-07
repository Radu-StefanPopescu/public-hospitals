import { useState } from 'react'
import { FeedbackModal } from './FeedbackModal'

const GITHUB_URL = 'https://github.com/transparenta-eu'
const LINKEDIN_URL = 'https://linkedin.com/company/transparenta-eu'
const DATASET_URL = 'https://data.gov.ro/dataset'

function Dot() {
  return <span className="text-slate-300 select-none px-0.5">·</span>
}

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <footer className="flex-shrink-0 flex items-center justify-between flex-wrap
        gap-y-2 gap-x-6 px-6 py-4
        bg-white border-t border-slate-200
        text-xs text-slate-500 z-[1000]">

        {/* Left: brand + links */}
        <div className="flex items-center flex-wrap gap-y-1">
          <span className="font-semibold text-slate-800 tracking-tight text-sm mr-3">
            SpitalePublice
          </span>

          <div className="flex items-center flex-wrap gap-y-1 text-xs">
            <a href={DATASET_URL} target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-800 transition-colors">
              Date: data.gov.ro
            </a>
            <Dot />
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-800 transition-colors">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                  0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                  -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                  .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                  -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0
                  1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
                  1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
                  1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
            <Dot />
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-800 transition-colors">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M0 1.146C0 .514.53 0 1.175 0h13.65C15.47 0 16 .513 16 1.146v13.708
                  c0 .633-.53 1.146-1.175 1.146H1.175C.53 16 0 15.487 0 14.854V1.146zm4.943
                  12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248
                  -.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521
                  1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431
                  .568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22
                  -1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54
                  0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Right: copyright + feedback button */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          <span className="text-slate-400 text-xs">
            © 2026 SpitalePublice. Toate drepturile rezervate.
          </span>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-medium text-slate-700
              bg-slate-50 ring-1 ring-slate-200
              hover:bg-slate-100 hover:ring-slate-300 hover:text-slate-900
              transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
              fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd"
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652
                0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
                clipRule="evenodd"/>
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0
                2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
            </svg>
            Feedback / Raportați o problemă
          </button>
        </div>
      </footer>

      <FeedbackModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
