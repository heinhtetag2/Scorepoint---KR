import { Plus, ChevronRight } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import CourseIllust from '../components/CourseIllust.jsx'

const fmtMd = (d) => d.slice(5).replace('-', '/')                 // '2026-06-15' → '06/15'

/* Standard event card — same layout as Home's 다가오는 행사. */
function EventCard({ ev, onOpen }) {
  const { t, pick } = useLang()
  const ended = ev.status === 'ended'
  const left = ev.capacity - ev.joined
  const pct = Math.round((ev.joined / ev.capacity) * 100)
  const meta = `${pick(ev.courseKo, ev.courseEn)} · ${fmtMd(ev.date)} · ${ev.time}`
  const fee = pick(`${ev.fee / 10000}만원`, `₩${ev.fee.toLocaleString()}`)

  return (
    <div className={`event-card ${ended ? 'event-card--past' : 'event-card--upcoming'}`} onClick={() => onOpen?.(ev)} role="button" tabIndex={0}>
      <CourseIllust />
      <div className="ev-title-row">
        {ended
          ? <span className="dday done">{t('evEnded')}</span>
          : <span className={`dday ${ev.dday > 7 ? 'soft' : ''}`}>D-{ev.dday}</span>}
        {ev.mine && <span className="ev-host">{pick('주최', 'Host')}</span>}
        <div className="ev-title">{pick(ev.titleKo, ev.titleEn)}</div>
        <ChevronRight size={20} className="ev-go" />
      </div>
      <div className="ev-meta">{meta}</div>

      {ended ? (
        <div className="ev-foot-past">
          <span className="num">{t('evAttendeesN', { n: ev.joined })} · {fee}</span>
        </div>
      ) : (
        <div className="ev-progress">
          <div className="ev-track"><span className="ev-fill" style={{ width: `${pct}%` }} /></div>
          <div className="ev-left">
            <span className="num">{t('joinedCount', { n: ev.joined, cap: ev.capacity })} · {fee}</span>
            {left <= 3 && <span className="urgent">{t('almostFull')}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

/* 일정(Event) tab — scheduled + past events with a create FAB. */
export default function Events({ events = [], onOpen, onCreate, onDelete }) {
  const { t } = useLang()
  const scheduled = events.filter((e) => e.status === 'scheduled')
  const past = events.filter((e) => e.status === 'ended')

  return (
    <>
      <div className="appbar">
        <span className="title">{t('navEvent')}</span>
      </div>

      <div className="screen evt-screen">
        {scheduled.length > 0 && (
          <>
            <div className="evt-sec">{t('evScheduled')}</div>
            {scheduled.map((ev) => <EventCard key={ev.id} ev={ev} onOpen={onOpen} />)}
          </>
        )}

        <div className="evt-sec">{t('evPast')}</div>
        {past.map((ev) => <EventCard key={ev.id} ev={ev} onOpen={onOpen} />)}

        <button className="evt-fab" onClick={onCreate}>
          <Plus size={17} strokeWidth={2.4} /> {t('evCreate')}
        </button>
      </div>
    </>
  )
}
