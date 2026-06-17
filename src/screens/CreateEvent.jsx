import { useState } from 'react'
import { ArrowLeft, ChevronRight, Bell } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { CalendarSheet } from '../components/Sheets.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'

/* 일정 만들기 / 수정 — create or edit an event and notify the club. */
export default function CreateEvent({ onBack, onCreate, edit = false, initial = null }) {
  const { t, lang } = useLang()
  const [name, setName] = useState(initial?.name ?? '')
  const [course, setCourse] = useState(initial?.course ?? '')
  const [date, setDate] = useState(initial?.date ?? '2026-06-15')
  const [time, setTime] = useState(initial?.time ?? '')
  const [fee, setFee] = useState(initial?.fee ?? '')
  const [cap, setCap] = useState(initial?.cap ?? '')
  const [picker, setPicker] = useState(false)

  const valid = name.trim() && course.trim() && date

  const handleCreate = () => {
    if (!valid) return
    const today = new Date()
    const eventDate = new Date(date)
    const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
    const newEvent = {
      id: initial?.id ?? `ev-${Date.now()}`,
      status: diffDays > 0 ? 'scheduled' : 'ended',
      dday: Math.max(0, diffDays),
      titleKo: name.trim(), titleEn: name.trim(),
      courseKo: course.trim(), courseEn: course.trim(),
      subKo: '', subEn: '',
      date, time: time || '08:00',
      fee: fee ? parseInt(fee, 10) : 0,
      capacity: cap ? parseInt(cap, 10) : 20,
      joined: initial?.joined ?? 0, absent: 0, mood: 0,
      mine: true,   // events the user creates are theirs
    }
    onCreate(newEvent)
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{edit ? (lang === 'ko' ? '행사 수정' : 'Edit event') : t('ceTitle')}</span>
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

        <div className="notice-box ce-notice"><Bell size={16} strokeWidth={1.9} /><span>{edit ? (lang === 'ko' ? '수정한 내용이 참가자에게 안내돼요.' : 'Changes will be shared with participants.') : t('ceNotice')}</span></div>

        <div className="sticky-cta">
          <Button variant="primary" className="btn-block" disabled={!valid} onClick={handleCreate}>{edit ? (lang === 'ko' ? '저장하기' : 'Save changes') : t('ceCreate')}</Button>
        </div>
      </div>

      {picker && <CalendarSheet value={date} onPick={(d) => { setDate(d); setPicker(false) }} onClose={() => setPicker(false)} />}
    </>
  )
}
