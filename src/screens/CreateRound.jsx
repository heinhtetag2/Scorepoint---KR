import { useState } from 'react'
import { ArrowLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { ListSheet, CalendarSheet } from '../components/Sheets.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { popularCourses, roundFormats } from '../data/mock.js'

const COURSES = popularCourses.map((c) => ({ ko: c.name, en: c.nameEn, sub: c.region, subEn: c.regionEn }))
const LAYOUTS = [
  { ko: '동코스', en: 'East Course' }, { ko: '서코스', en: 'West Course' },
  { ko: '남코스', en: 'South Course' }, { ko: '북코스', en: 'North Course' },
]

export default function CreateRound({ onBack, onCreate }) {
  const { t, pick } = useLang()
  const [name, setName] = useState('')
  const [course, setCourse] = useState(null)
  const [layout, setLayout] = useState(null)
  const [date, setDate] = useState('2026-06-16')
  const [time, setTime] = useState('')
  const [cap, setCap] = useState(16)
  const [fee, setFee] = useState('')
  const [format, setFormat] = useState('newperio')
  const [picker, setPicker] = useState(null)

  const valid = course && date

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('cdNewRound')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        <div className="field">
          <label className="field-label">{t('crName')}</label>
          <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('crNamePlace')} />
        </div>

        <div className="field">
          <label className="field-label">{t('svCourse')}</label>
          <button className={`field-select ${picker === 'course' ? 'is-open' : ''}`} onClick={() => setPicker('course')}>
            <span className={course ? '' : 'is-empty'}>{course ? pick(course.ko, course.en) : t('svCoursePlace')}</span>
            <ChevronRight size={17} className="chev" />
          </button>
        </div>

        <div className="field">
          <label className="field-label">{t('svLayout')}</label>
          <button className={`field-select ${picker === 'layout' ? 'is-open' : ''}`} onClick={() => setPicker('layout')}>
            <span className={layout ? '' : 'is-empty'}>{layout ? pick(layout.ko, layout.en) : t('svLayoutPlace')}</span>
            <ChevronRight size={17} className="chev" />
          </button>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">{t('svDate')}</label>
            <button className={`field-select ${picker === 'date' ? 'is-open' : ''}`} onClick={() => setPicker('date')}>
              <span className="num">{date}</span>
            </button>
          </div>
          <div className="field">
            <label className="field-label">{t('crTime')}</label>
            <input className="field-input num" value={time} onChange={(e) => setTime(e.target.value)} placeholder={t('crTimePlace')} />
          </div>
        </div>

        <div className="field">
          <label className="field-label">{t('crCapacity')}</label>
          <div className="cap-stepper">
            <button className="cap-btn" onClick={() => setCap((n) => Math.max(2, n - 1))} aria-label="minus"><Minus size={18} strokeWidth={2.4} /></button>
            <span className="cap-val num">{cap}<em>{t('unitPeople')}</em></span>
            <button className="cap-btn" onClick={() => setCap((n) => Math.min(40, n + 1))} aria-label="plus"><Plus size={18} strokeWidth={2.4} /></button>
          </div>
        </div>

        <div className="field">
          <label className="field-label">{t('crFee')}</label>
          <div className="field-affix">
            <input className="field-input num" value={fee} onChange={(e) => setFee(e.target.value.replace(/[^0-9]/g, ''))} placeholder={t('crFeePlace')} inputMode="numeric" />
            <span className="field-unit">{t('unitWon')}</span>
          </div>
        </div>

        <div className="field">
          <label className="field-label">{t('crFormat')}</label>
          <div className="type-grid type-grid-3">
            {roundFormats.map((f) => (
              <button key={f.id} className={`type-chip ${format === f.id ? 'active' : ''}`} onClick={() => setFormat(f.id)}>
                <span className="type-label">{pick(f.ko, f.en)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sticky-cta">
          <Button variant="primary" className="btn-block" disabled={!valid} onClick={onCreate}>{t('crCreate')}</Button>
        </div>
      </div>

      {picker === 'course' && <ListSheet title={t('svCourse')} options={COURSES} selected={course} onPick={(c) => { setCourse(c); setPicker(null) }} onClose={() => setPicker(null)} />}
      {picker === 'layout' && <ListSheet title={t('svLayout')} options={LAYOUTS} selected={layout} onPick={(l) => { setLayout(l); setPicker(null) }} onClose={() => setPicker(null)} />}
      {picker === 'date' && <CalendarSheet value={date} onPick={(d) => { setDate(d); setPicker(null) }} onClose={() => setPicker(null)} />}
    </>
  )
}
