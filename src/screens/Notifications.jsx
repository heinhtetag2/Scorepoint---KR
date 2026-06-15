import { useState } from 'react'
import {
  ArrowLeft, CalendarDays, Wallet, BarChart3, Trophy, Users, Bell, Megaphone,
} from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { notifications, notificationHistory } from '../data/mock.js'

/* Category → glyph + accent. Colors echo Home quick-actions & status tokens. */
const TYPE = {
  event: { Icon: CalendarDays, color: '#F59E0B', bg: '#FEF4E3' },
  settle: { Icon: Wallet, color: '#2A7D46', bg: '#E7F3EA' },
  score: { Icon: BarChart3, color: '#16A34A', bg: '#E6F6EC' },
  rank: { Icon: Trophy, color: '#8B5CF6', bg: '#F1ECFD' },
  club: { Icon: Users, color: '#3B82F6', bg: '#E9F1FE' },
}

/* Filter tabs map each chip to the notification types it surfaces. */
const TABS = [
  { id: 'all', label: 'notiTabAll', types: null },
  { id: 'event', label: 'notiTabEvent', types: ['event', 'rank'] },
  { id: 'settle', label: 'notiTabSettle', types: ['settle'] },
  { id: 'score', label: 'notiTabScore', types: ['score'] },
  { id: 'club', label: 'notiTabClub', types: ['club'] },
]

/* Renders one notification row (shared by the list & history views). */
function NotiRow({ n, unread, pick }) {
  const ty = TYPE[n.type] || { Icon: Megaphone, color: 'var(--text-2)', bg: 'var(--surface-2)' }
  return (
    <div className={`noti-item ${unread ? 'unread' : ''}`}>
      <span className="noti-ico" style={{ background: ty.bg, color: ty.color }}>
        <ty.Icon size={19} strokeWidth={2} />
      </span>
      <div className="noti-main">
        <div className="noti-title-row">
          <span className="noti-title">{pick(n.titleKo, n.titleEn)}</span>
          {unread && <span className="noti-dot" />}
        </div>
        <div className="noti-body">{pick(n.bodyKo, n.bodyEn)}</div>
        <div className="noti-time">{pick(n.timeKo, n.timeEn)}</div>
      </div>
    </div>
  )
}

export default function Notifications({ onBack }) {
  const { t, pick } = useLang()
  const [view, setView] = useState('list')  // list · history
  const [tab, setTab] = useState('all')
  const [read, setRead] = useState(false)   // "mark all read" clears every unread dot
  const [tip, setTip] = useState(true)      // one-time coachmark on the history link

  const active = TABS.find((x) => x.id === tab)
  const items = active.types ? notifications.filter((n) => active.types.includes(n.type)) : notifications
  const anyUnread = !read && notifications.some((n) => n.unread)

  /* ── 지난 알림 (history) ─────────────────────────────────── */
  if (view === 'history') {
    const months = [...new Set(notificationHistory.map((h) => h.monthKo))]
    return (
      <>
        <div className="appbar">
          <button className="icon-btn" onClick={() => setView('list')} aria-label="Back"><ArrowLeft size={20} /></button>
          <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('notiHistoryTitle')}</span>
          <span style={{ width: 28 }} />
        </div>
        <div className="screen noti2-screen">
          {months.map((m) => {
            const monthItems = notificationHistory.filter((h) => h.monthKo === m)
            return (
              <div key={m}>
                <div className="noti2-section"><span>{pick(m, monthItems[0].monthEn)}</span></div>
                <div className="noti-list">
                  {monthItems.map((n) => <NotiRow key={n.id} n={n} unread={false} pick={pick} />)}
                </div>
              </div>
            )
          })}
          <p className="noti2-foot">{t('notiHistoryNote')}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="noti2-head">
        <div className="noti2-nav">
          <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        </div>

        <div className="noti2-title-row">
          <h1 className="noti2-title">{t('notiTitle')}</h1>
          <div className="noti2-log-wrap">
            <button className="noti2-log" onClick={() => { setTip(false); setView('history') }}>{t('notiHistory')}</button>
            {tip && (
              <button className="noti2-tip" onClick={() => setTip(false)}>{t('notiTip')}</button>
            )}
          </div>
        </div>

        <div className="noti2-tabs">
          {TABS.map((x) => (
            <button
              key={x.id}
              className={`noti2-tab ${tab === x.id ? 'active' : ''}`}
              onClick={() => setTab(x.id)}
            >
              {t(x.label)}
              {x.id === 'all' && anyUnread && <span className="noti2-tab-dot" />}
            </button>
          ))}
        </div>
      </div>

      <div className="screen noti2-screen">
        <div className="noti2-section">
          <span>{t('notiMine')}</span>
          <button className="noti2-readall" onClick={() => setRead(true)} disabled={!anyUnread}>
            {t('notiReadAll')}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="noti2-empty">
            <span className="noti2-empty-logo"><Bell size={26} strokeWidth={1.8} /></span>
            <p>{t('notiEmpty')}</p>
          </div>
        ) : (
          <>
            <div className="noti-list">
              {items.map((n) => {
                const ty = TYPE[n.type] || { Icon: Megaphone, color: 'var(--text-2)', bg: 'var(--surface-2)' }
                const unread = n.unread && !read
                return (
                  <div className={`noti-item ${unread ? 'unread' : ''}`} key={n.id}>
                    <span className="noti-ico" style={{ background: ty.bg, color: ty.color }}>
                      <ty.Icon size={19} strokeWidth={2} />
                    </span>
                    <div className="noti-main">
                      <div className="noti-title-row">
                        <span className="noti-title">{pick(n.titleKo, n.titleEn)}</span>
                        {unread && <span className="noti-dot" />}
                      </div>
                      <div className="noti-body">{pick(n.bodyKo, n.bodyEn)}</div>
                      <div className="noti-time">{pick(n.timeKo, n.timeEn)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="noti2-foot">{t('notiAutoDelete')}</p>
          </>
        )}
      </div>
    </>
  )
}
