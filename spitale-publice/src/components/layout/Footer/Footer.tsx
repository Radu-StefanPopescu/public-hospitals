import { useState } from 'react'
import { GitHubIcon } from '../../../assets/icons/GitHubIcon'
import { LinkedInIcon } from '../../../assets/icons/LinkedInIcon'
import { MailIcon } from '../../../assets/icons/MailIcon'
import { FeedbackModal } from '../../../features/feedback'
import { APP_VERSION, GIT_COMMIT, DATASET_URL, GITHUB_URL, LINKEDIN_URL } from '../../../constants/config'
import { TEXT } from '../../../constants/text'

const Dot = () => {
  const styles = { root: 'text-slate-300 select-none px-0.5' }
  return <span className={styles.root}>·</span>
}

export const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const styles = {
    root: 'flex-shrink-0 flex items-center justify-between flex-wrap gap-y-2 gap-x-6 px-6 py-4 bg-white border-t border-slate-200 text-xs text-slate-500 z-[1000]',
    left: 'flex items-center flex-wrap gap-y-1',
    brand: 'font-semibold text-slate-800 tracking-tight text-sm mr-3',
    links: 'flex items-center flex-wrap gap-y-1 text-xs',
    link: 'hover:text-slate-800 transition-colors',
    iconLink: 'inline-flex items-center gap-1 hover:text-slate-800 transition-colors',
    right: 'flex items-center flex-wrap gap-x-3 gap-y-1',
    copyright: 'text-slate-400 text-xs',
    version: 'font-mono text-slate-300 text-xs tabular-nums',
    feedbackBtn: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100 hover:ring-slate-300 hover:text-slate-900 transition-all',
  }

  return (
    <>
      <footer className={styles.root}>
        <div className={styles.left}>
          <span className={styles.brand}>SpitalePublice</span>
          <div className={styles.links}>
            <a href={DATASET_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {TEXT.dataSource}
            </a>
            <Dot />
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
              <GitHubIcon className="w-3.5 h-3.5" />
              {TEXT.github}
            </a>
            <Dot />
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
              <LinkedInIcon className="w-3.5 h-3.5" />
              {TEXT.linkedin}
            </a>
          </div>
        </div>

        <div className={styles.right}>
          <span className={styles.version}>{APP_VERSION}:{GIT_COMMIT}</span>
          <Dot />
          <span className={styles.copyright}>{TEXT.copyright}</span>
          <button onClick={() => setModalOpen(true)} className={styles.feedbackBtn}>
            <MailIcon className="w-3.5 h-3.5" />
            {TEXT.feedbackButton}
          </button>
        </div>
      </footer>

      <FeedbackModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
