import { HospitalIcon } from '../../../assets/icons/HospitalIcon'
import { TEXT } from '../../../constants/text'

interface HeaderProps {
  hospitalCount?: number
}

export const Header = ({ hospitalCount }: HeaderProps) => {
  const styles = {
    root: 'flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-slate-950 border-b border-slate-800 z-[1000]',
    iconWrap: 'flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20',
    titleWrap: 'flex items-baseline gap-2.5',
    title: 'text-sm font-semibold tracking-tight text-white',
    region: 'text-xs text-slate-500',
    divider: 'h-4 w-px bg-slate-800 mx-1',
    badge: 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20',
    badgeDot: 'w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse',
  }

  return (
    <header className={styles.root}>
      <div className={styles.iconWrap}>
        <HospitalIcon className="w-4 h-4 text-blue-400" />
      </div>

      <div className={styles.titleWrap}>
        <span className={styles.title}>{TEXT.appName}</span>
        <span className={styles.region}>{TEXT.appRegion}</span>
      </div>

      <div className={styles.divider} />

      {hospitalCount !== undefined && (
        <span className={styles.badge}>
          <span className={styles.badgeDot} />
          {TEXT.hospitalsCount(hospitalCount)}
        </span>
      )}
    </header>
  )
}
