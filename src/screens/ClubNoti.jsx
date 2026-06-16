import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

export default function ClubNoti({ onBack }) {
  const { t } = useLang()
  const [prefs, setPrefs] = useState({ round: true, settle: true, notice: true, member: false })
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }))

  const ITEMS = [
    { id: 'round', label: t('cnRound') },
    { id: 'settle', label: t('cnSettle') },
    { id: 'notice', label: t('cnNotice') },
    { id: 'member', label: t('cnMember') },
  ]

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('csNoti')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        <div className="list cs-list">
          {ITEMS.map((it) => (
            <div className="list-row" key={it.id}>
              <span className="lr-label">{it.label}</span>
              <button className={`toggle ${prefs[it.id] ? 'on' : ''}`} onClick={() => toggle(it.id)} aria-pressed={prefs[it.id]}>
                <span className="toggle-knob" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
