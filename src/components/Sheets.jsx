import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (n) => String(n).padStart(2, '0')

/* Shared bottom-sheet shell (scrim + slide-up panel). */
export function Sheet({ title, onClose, footer, children }) {
  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="edit-sheet pick-sheet">
        <div className="es-grab" />
        {title && <div className="es-title">{title}</div>}
        {children}
        {footer}
      </div>
    </>
  )
}

/* Single-select list sheet. Options: [{ko,en, sub?, subEn?}]. */
export function ListSheet({ title, options, selected, onPick, onClose }) {
  const { pick } = useLang()
  return (
    <Sheet title={title} onClose={onClose}>
      <div className="pick-list">
        {options.map((o, i) => {
          const sel = selected && pick(o.ko, o.en) === pick(selected.ko, selected.en)
          return (
            <button key={i} className={`pick-row ${sel ? 'is-sel' : ''}`} onClick={() => onPick(o)}>
              <span className="pick-name">{pick(o.ko, o.en)}{o.sub && <small>{pick(o.sub, o.subEn)}</small>}</span>
              {sel && <Check size={18} strokeWidth={2.4} />}
            </button>
          )
        })}
      </div>
    </Sheet>
  )
}

/* Month calendar sheet. value: 'YYYY-MM-DD'. */
export function CalendarSheet({ value, onPick, onClose }) {
  const { pick } = useLang()
  const [y, setY] = useState(() => +value.slice(0, 4))
  const [m, setM] = useState(() => +value.slice(5, 7) - 1)
  const firstDow = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const dow = pick(['일', '월', '화', '수', '목', '금', '토'], ['S', 'M', 'T', 'W', 'T', 'F', 'S'])
  const prev = () => (m === 0 ? (setY(y - 1), setM(11)) : setM(m - 1))
  const next = () => (m === 11 ? (setY(y + 1), setM(0)) : setM(m + 1))
  return (
    <Sheet onClose={onClose}>
      <div className="cal-head">
        <button className="cal-nav" onClick={prev} aria-label="Previous month"><ChevronLeft size={20} /></button>
        <span className="cal-title">{pick(`${y}년 ${m + 1}월`, `${MONTHS_EN[m]} ${y}`)}</span>
        <button className="cal-nav" onClick={next} aria-label="Next month"><ChevronRight size={20} /></button>
      </div>
      <div className="cal-grid cal-dow-row">
        {dow.map((d, i) => <span key={i} className="cal-dow">{d}</span>)}
      </div>
      <div className="cal-grid cal-days">
        {cells.map((d, i) => {
          if (!d) return <span key={i} className="cal-cell" />
          const ds = `${y}-${pad(m + 1)}-${pad(d)}`
          return <button key={i} className={`cal-cell cal-day ${ds === value ? 'is-sel' : ''}`} onClick={() => onPick(ds)}>{d}</button>
        })}
      </div>
    </Sheet>
  )
}
