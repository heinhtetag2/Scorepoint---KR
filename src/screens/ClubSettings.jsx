import { useState } from 'react'
import { ArrowLeft, ChevronRight, Pencil, Bell, LogOut, Trash2 } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs } from '../data/mock.js'

export default function ClubSettings({ club, onBack, onEdit, onMembers, onNoti, onLeave }) {
  const { t, pick } = useLang()
  const [confirm, setConfirm] = useState(false)
  const c = club || clubs[0]
  const organizer = c.role === '총무'

  const manage = [
    { id: 'edit', icon: Pencil, label: t('csEdit'), onClick: onEdit },
  ]

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('csTitle')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        {/* Management actions are organizer-only — a member who joined from
            Discover sees just Notifications + Leave. */}
        {organizer && (
          <>
            <div className="section-head"><span className="s-head-left"><span className="s-title">{t('csManageSec')}</span></span></div>
            <div className="list cs-list">
              {manage.map((row) => (
                <button className="list-row" key={row.id} onClick={row.onClick}>
                  <span className="lr-ico"><row.icon size={17} strokeWidth={1.9} /></span>
                  <span className="lr-label">{row.label}</span>
                  <ChevronRight size={16} className="chev" />
                </button>
              ))}
            </div>
          </>
        )}

        <div className="section-head"><span className="s-head-left"><span className="s-title">{t('csGeneralSec')}</span></span></div>
        <div className="list cs-list">
          <button className="list-row" onClick={onNoti}>
            <span className="lr-ico"><Bell size={17} strokeWidth={1.9} /></span>
            <span className="lr-label">{t('csNoti')}</span>
            <span className="lr-value accent">{t('csOn')}</span>
            <ChevronRight size={16} className="chev" />
          </button>
        </div>

        <div className="list cs-list" style={{ marginTop: '8px' }}>
          <button className="list-row danger" onClick={() => setConfirm(true)}>
            <span className="lr-ico danger">{organizer ? <Trash2 size={17} strokeWidth={1.9} /> : <LogOut size={17} strokeWidth={1.9} />}</span>
            <span className="lr-label">{organizer ? t('csDelete') : t('csLeave')}</span>
          </button>
        </div>
      </div>

      {confirm && (
        <>
          <div className="dialog-scrim" onClick={() => setConfirm(false)} />
          <div className="dialog">
            <div className="dialog-title">{organizer ? t('deleteTitle') : t('leaveTitle')}</div>
            <div className="dialog-body">{organizer ? t('deleteBody') : t('leaveBody')}</div>
            <div className="dialog-actions">
              <Button variant="secondary" onClick={() => setConfirm(false)}>{t('commonCancel')}</Button>
              <Button variant="danger" onClick={() => { setConfirm(false); onLeave?.() }}>{organizer ? t('csDelete') : t('csLeave')}</Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
