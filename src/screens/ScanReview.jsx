import { useState } from 'react'
import { ArrowLeft, Check, Pencil, Minus, Plus, ChevronRight, ChevronLeft, Search } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { scannedRound, roundCompanions, partners, popularCourses, buildScorecard, HOLE_PARS } from '../data/mock.js'

const PAR = 72
/* Holes the recognizer is unsure about — surfaced for the user to verify. */
const CHECK = new Set([5, 12])
const EMPTY = new Set()
const sum = (arr) => arr.reduce((a, b) => a + b, 0)
const pad = (n) => String(n).padStart(2, '0')

const COURSES = popularCourses.map((c) => ({ ko: c.name, en: c.nameEn, sub: c.region, subEn: c.regionEn }))
const LAYOUTS = [
  { ko: '동코스', en: 'East Course' }, { ko: '서코스', en: 'West Course' },
  { ko: '남코스', en: 'South Course' }, { ko: '북코스', en: 'North Course' },
]
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/* Shared bottom sheet shell (scrim + slide-up panel). */
function Sheet({ title, onClose, footer, children }) {
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

function ListSheet({ title, options, selected, onPick, onClose }) {
  const { pick } = useLang()
  return (
    <Sheet title={title} onClose={onClose}>
      <div className="pick-list">
        {options.map((o, i) => {
          const sel = pick(o.ko, o.en) === pick(selected.ko, selected.en)
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

function MultiSheet({ title, options, selected, onConfirm, onClose }) {
  const { t, pick } = useLang()
  const [sel, setSel] = useState(selected)            // array of {ko,en}; customs allowed
  const [query, setQuery] = useState('')
  const q = query.trim()
  const has = (o) => sel.some((s) => s.ko === o.ko)
  const toggle = (o) => setSel((s) => (has(o) ? s.filter((x) => x.ko !== o.ko) : [...s, o]))
  // typed-in names that aren't part of the saved roster
  const customs = sel.filter((s) => !options.some((o) => o.ko === s.ko))
  const visible = [...customs, ...options].filter((o) => !q || pick(o.ko, o.en).toLowerCase().includes(q.toLowerCase()) || o.ko.includes(q))
  const exact = [...options, ...sel].some((o) => o.ko === q || o.en.toLowerCase() === q.toLowerCase())
  const addCustom = () => { setSel((s) => [...s, { ko: q, en: q }]); setQuery('') }
  return (
    <Sheet
      title={title}
      onClose={onClose}
      footer={<Button variant="primary" className="btn-block" onClick={() => onConfirm(sel)}>{t('svConfirm')}</Button>}
    >
      <div className="pick-search">
        <Search size={16} strokeWidth={2} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('svSearchAdd')} />
      </div>
      <div className="pick-list">
        {q && !exact && (
          <button className="pick-row pick-add" onClick={addCustom}>
            <span className="pick-add-ico"><Plus size={14} strokeWidth={3} /></span>
            <span className="pick-add-text">{t('svAddName', { name: q })}</span>
          </button>
        )}
        {!q && <div className="pick-recent-label">{t('svRecent')}</div>}
        {visible.map((o, i) => {
          const on = has(o)
          return (
            <button key={o.ko + i} className={`pick-row ${on ? 'is-sel' : ''}`} onClick={() => toggle(o)}>
              <span className="pick-name">{pick(o.ko, o.en)}</span>
              <span className={`pick-check ${on ? 'on' : ''}`}>{on && <Check size={13} strokeWidth={3} />}</span>
            </button>
          )
        })}
      </div>
    </Sheet>
  )
}

function CalendarSheet({ value, onPick, onClose }) {
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

function NineEdit({ label, pars, holes, start, sub, editing, active, check, onCell, t }) {
  return (
    <div className="rd-nine">
      <div className="rd-nine-head"><span>{label}</span><span className="num">{sub}</span></div>
      <div className={`rd-grid ${editing ? 'is-editing' : ''}`}>
        <div className="rd-grid-row rd-grid-head">
          <span className="rd-cell rd-cell-k">{t('rdHole')}</span>
          {holes.map((_, i) => <span className="rd-cell num" key={i}>{start + i}</span>)}
        </div>
        <div className="rd-grid-row">
          <span className="rd-cell rd-cell-k">{t('rdParRow')}</span>
          {pars.map((p, i) => <span className="rd-cell num rd-par" key={i}>{p}</span>)}
        </div>
        <div className="rd-grid-row">
          <span className="rd-cell rd-cell-k">{t('rdScoreRow')}</span>
          {holes.map((s, i) => {
            const idx = start - 1 + i
            const cls = `rd-cell num sv-edit ${check.has(idx) ? 'is-check' : ''} ${active === idx ? 'is-active' : ''}`
            return editing
              ? <button className={cls} key={i} onClick={() => onCell(idx)}>{s}</button>
              : <span className={cls} key={i}>{s}</span>
          })}
        </div>
      </div>
    </div>
  )
}

export default function ScanReview({ onBack, onRegister, manual = false }) {
  const { t, pick } = useLang()
  const r = scannedRound
  const [holes, setHoles] = useState(() => (manual ? [...HOLE_PARS] : buildScorecard(r.score, 2).holes))
  const [editing, setEditing] = useState(false)
  const [active, setActive] = useState(null) // hole index being edited

  // Editable round fields. Manual entry starts blank (user picks); scan review is
  // pre-filled with what was recognized from the card.
  const [course, setCourse] = useState(manual ? null : { ko: r.course, en: r.courseEn })
  const [layout, setLayout] = useState(manual ? null : { ko: r.sub, en: r.subEn })
  const [date, setDate] = useState(r.date)
  const [companions, setCompanions] = useState(() => (manual ? [] : roundCompanions.map((c) => ({ ko: c.name, en: c.nameEn }))))
  const [picker, setPicker] = useState(null)

  const cellEditing = manual || editing
  const checkSet = manual ? EMPTY : CHECK

  const out = sum(holes.slice(0, 9))
  const inn = sum(holes.slice(9))
  const total = out + inn
  const toPar = total - PAR

  const info = [
    { key: 'course', k: t('svCourse'), v: course ? pick(course.ko, course.en) : t('svCoursePlace'), empty: !course },
    { key: 'layout', k: t('svLayout'), v: layout ? pick(layout.ko, layout.en) : t('svLayoutPlace'), empty: !layout },
    { key: 'date', k: t('svDate'), v: date, empty: false },
    { key: 'companion', k: manual ? `${t('svCompanion')} (${t('svOptional')})` : t('svCompanion'), v: companions.length ? companions.map((c) => pick(c.ko, c.en)).join(', ') : t('svCompanionPlace'), empty: !companions.length },
  ]

  const bump = (d) => setHoles((h) => h.map((s, i) => (i === active ? Math.max(1, Math.min(12, s + d)) : s)))
  const rel = (s, par) => {
    const d = s - par
    if (d <= -2) return pick('이글', 'Eagle')
    if (d === -1) return t('rdBirdie')
    if (d === 0) return t('rdParCount')
    if (d === 1) return t('rdBogey')
    return pick('더블보기+', 'Double+')
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{manual ? t('svEntryTitle') : t('svTitle')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        {manual ? (
          <div className="notice-box sv-ok sv-editing"><Pencil size={15} strokeWidth={2.2} /><span>{t('svInputHint')}</span></div>
        ) : editing ? (
          <div className="notice-box sv-ok sv-editing"><Pencil size={15} strokeWidth={2.2} /><span>{t('svEditHint')}</span></div>
        ) : (
          <div className="notice-box sv-ok"><Check size={16} strokeWidth={2.6} /><span>{t('svRecognized')}</span></div>
        )}

        <div className="section-head"><span className="s-head-left"><span className="s-title">{t('svRound')}</span></span></div>
        <div className="card sv-info-card">
          {info.map((row) => (
            <div className={`sv-row ${manual ? 'is-pick' : ''}`} key={row.key} onClick={manual ? () => setPicker(row.key) : undefined}>
              <span className="sv-row-k">{row.k}</span>
              <span className={`sv-row-v ${row.empty ? 'is-empty' : ''}`}>{row.v}</span>
              {manual && <ChevronRight size={16} className="sv-row-chev" />}
            </div>
          ))}
        </div>

        <div className="section-head">
          <span className="s-head-left"><span className="s-title">{manual ? t('svScoresManual') : t('svScores')}</span></span>
          {!manual && !editing && <span className="s-more sv-check-hint">{t('svCheck', { n: CHECK.size })}</span>}
        </div>
        <div className="card rd-card">
          <NineEdit label={t('rdOut')} sub={out} start={1} pars={HOLE_PARS.slice(0, 9)} holes={holes.slice(0, 9)} editing={cellEditing} active={active} check={checkSet} onCell={setActive} t={t} />
          <div className="rd-divider" />
          <NineEdit label={t('rdIn')} sub={inn} start={10} pars={HOLE_PARS.slice(9)} holes={holes.slice(9)} editing={cellEditing} active={active} check={checkSet} onCell={setActive} t={t} />
          <div className="rd-total">
            <span className="rd-total-k">{t('rdTotal')}</span>
            <span className="rd-total-v num">{total} <em>({toPar >= 0 ? '+' : ''}{toPar})</em></span>
          </div>
        </div>

        {manual ? (
          <div className="sticky-cta">
            <Button variant="primary" className="btn-block" onClick={onRegister}>{t('svRegister')}</Button>
          </div>
        ) : editing ? (
          <div className="sticky-cta">
            <Button variant="primary" className="btn-block" onClick={() => { setEditing(false); setActive(null) }}>{t('svDone')}</Button>
          </div>
        ) : (
          <div className="sticky-cta sv-cta">
            <Button variant="ghost" className="sv-cta-edit" onClick={() => setEditing(true)}><Pencil size={15} strokeWidth={2} /> {t('svCorrect')}</Button>
            <Button variant="primary" onClick={onRegister}>{t('svRegister')}</Button>
          </div>
        )}
      </div>

      {active !== null && (
        <>
          <div className="sheet-scrim" onClick={() => setActive(null)} />
          <div className="edit-sheet">
            <div className="es-grab" />
            <div className="es-title">{t('esHole', { n: active + 1 })} · {t('esPar', { p: HOLE_PARS[active] })}</div>
            <div className="es-stepper">
              <button className="es-step" onClick={() => bump(-1)} aria-label="minus"><Minus size={20} strokeWidth={2.4} /></button>
              <div className="es-val">
                <span className="es-num num">{holes[active]}</span>
                <span className="es-rel">{rel(holes[active], HOLE_PARS[active])}</span>
              </div>
              <button className="es-step" onClick={() => bump(1)} aria-label="plus"><Plus size={20} strokeWidth={2.4} /></button>
            </div>
            <Button variant="primary" className="btn-block" onClick={() => setActive(null)}>{t('svConfirm')}</Button>
          </div>
        </>
      )}

      {picker === 'course' && <ListSheet title={t('svCourse')} options={COURSES} selected={course || {}} onPick={(c) => { setCourse(c); setPicker(null) }} onClose={() => setPicker(null)} />}
      {picker === 'layout' && <ListSheet title={t('svLayout')} options={LAYOUTS} selected={layout || {}} onPick={(l) => { setLayout(l); setPicker(null) }} onClose={() => setPicker(null)} />}
      {picker === 'date' && <CalendarSheet value={date} onPick={(d) => { setDate(d); setPicker(null) }} onClose={() => setPicker(null)} />}
      {picker === 'companion' && <MultiSheet title={t('svCompanion')} options={partners} selected={companions} onConfirm={(list) => { setCompanions(list); setPicker(null) }} onClose={() => setPicker(null)} />}
    </>
  )
}
