import { useState } from 'react'
import { ArrowLeft, ChevronRight, Bell } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { CalendarSheet } from '../components/Sheets.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'

/* 일정 만들기 — create an event and notify the club. */
export default function CreateEvent({ onBack, onCreate }) {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [date, setDate] = useState('2026-06-15')
  const [time, setTime] = useState('')
  const [fee, setFee] = useState('')
  const [cap, setCap] = useState('')
  const [picker, setPicker] = useState(false)

  const valid = name.trim() && course.trim() && date

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('ceTitle')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        <div className="field">
          <label className="field-label">{t('ceName')}</label>
          <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('ceNamePh')} />
        </div>

        <div className="field">
          <label className="field-label">{t('ceCourse')}</label>
          <input className="field-input" value={course} onChange={(e) => setCourse(e.target.value)} placeholder={t('ceCoursePh')} />
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">{t('ceDate')}</label>
            <button className={`field-select ${picker ? 'is-open' : ''}`} onClick={() => setPicker(true)}>
              <span className="num">{date}</span>
              <ChevronRight size={17} className="chev" />
            </button>
          </div>
          <div className="field">
            <label className="field-label">{t('ceHour')}</label>
            <input className="field-input num" value={time} onChange={(e) => setTime(e.target.value)} placeholder="08:00" />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">{t('ceFee')}</label>
            <div className="field-affix">
              <input className="field-input num" value={fee} onChange={(e) => setFee(e.target.value.replace(/[^0-9]/g, ''))} placeholder="150,000" inputMode="numeric" />
              <span className="field-unit">{t('unitWon')}</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">{t('ceCap')}</label>
            <div className="field-affix">
              <input className="field-input num" value={cap} onChange={(e) => setCap(e.target.value.replace(/[^0-9]/g, ''))} placeholder="32" inputMode="numeric" />
              <span className="field-unit">{t('unitPeople')}</span>
            </div>
          </div>
        </div>

        <div className="notice-box ce-notice"><Bell size={16} strokeWidth={1.9} /><span>{t('ceNotice')}</span></div>

        <div className="sticky-cta">
          <Button variant="primary" className="btn-block" disabled={!valid} onClick={onCreate}>{t('ceCreate')}</Button>
        </div>
      </div>

      {picker && <CalendarSheet value={date} onPick={(d) => { setDate(d); setPicker(false) }} onClose={() => setPicker(false)} />}
    </>
  )
}
