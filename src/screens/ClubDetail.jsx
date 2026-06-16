import { useState } from 'react'
import { ArrowLeft, Settings, ChevronRight, Crown, Plus, UserPlus, CheckCircle2, AlertCircle, MessageCircle, MessageSquare, Share2 } from 'lucide-react'
import { Segmented, Button } from '../components/ui.jsx'
import ClubAvatar from '../components/ClubAvatar.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs, clubMembers, partners, events, settlement, money } from '../data/mock.js'

const COLORS = ['#0A7A37', '#3B82F6', '#8B5CF6', '#E2571F', '#0EA5A0']

export default function ClubDetail({ club, onBack, onOpenEvent, onSettings, onNewRound }) {
  const { t, lang, pick } = useLang()
  const [tab, setTab] = useState('schedule')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [invited, setInvited] = useState(new Set())
  const c = club || clubs[0]
  const ci = Math.max(0, clubs.findIndex((x) => x.id === c.id))
  const organizer = c.role === '총무'
  const unpaid = clubMembers.filter((m) => !m.paid)
  const toggleInvite = (k) => setInvited((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n })

  const TABS = [
    { id: 'schedule', label: t('cdSchedule') },
    { id: 'members', label: t('cdMembersTab') },
    { id: 'settle', label: t('cdSettleTab') },
  ]

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{pick(c.nameKr, c.nameEn)}</span>
        <button className="icon-btn" aria-label="Settings" onClick={onSettings}><Settings size={19} strokeWidth={1.8} /></button>
      </div>

      <div className="screen">
        {/* Club header */}
        <div className="card cd-hero">
          <ClubAvatar img={c.img} icon={c.icon} color={COLORS[ci % COLORS.length]} size={44} radius={13} />
          <div className="cd-hero-main">
            <div className="cd-hero-name">
              {pick(c.nameKr, c.nameEn)}
              {organizer
                ? <span className="badge badge-role"><Crown size={11} strokeWidth={2.4} /> {t('organizer')}</span>
                : <span className="badge badge-soft">{t('member')}</span>}
            </div>
            <div className="cd-hero-stats num">
              <span>{t('clubsMembers', { n: c.members })}</span>
              <span className="cc-dot">·</span>
              <span>{t('cdRounds', { n: events.length })}</span>
            </div>
          </div>
        </div>

        <Segmented items={TABS} value={tab} onChange={setTab} />

        {tab === 'schedule' && (
          <>
            <div className="section-head"><span className="s-head-left"><span className="s-title">{t('cdUpcoming')}</span></span></div>
            {events.map((ev) => {
              const left = ev.capacity - ev.joined
              const pct = Math.round((ev.joined / ev.capacity) * 100)
              return (
                <div className="event-card" key={ev.id} onClick={() => onOpenEvent?.(ev.id)}>
                  <div className="ev-title-row">
                    <span className={`dday ${ev.dday > 7 ? 'soft' : ''}`}>D-{ev.dday}</span>
                    <div className="ev-title">{pick(ev.titleKr, ev.titleEn)}</div>
                    <ChevronRight size={20} className="ev-go" />
                  </div>
                  <div className="ev-meta">{pick(ev.course, ev.courseEn)} · {pick(ev.date, ev.dateEn)} · {ev.time}</div>
                  <div className="ev-progress">
                    <div className="ev-track"><span className="ev-fill" style={{ width: `${pct}%` }} /></div>
                    <div className="ev-left">
                      <span className="num">{t('joinedCount', { n: ev.joined, cap: ev.capacity })} · {pick(ev.fee, ev.feeEn)}</span>
                      {left <= 3 && <span className="urgent">{t('almostFull')}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {tab === 'members' && (
          <div className="card cd-list">
            {clubMembers.map((m) => (
              <div className="cd-mem" key={m.id}>
                <span className="cd-mem-av">{pick(m.nameKr, m.nameEn).charAt(0)}</span>
                <span className="cd-mem-name">
                  {pick(m.nameKr, m.nameEn)}
                  {m.me && <span className="cd-me">{t('rdMe')}</span>}
                </span>
                {m.role === '총무'
                  ? <span className="badge badge-role"><Crown size={11} strokeWidth={2.4} /> {t('organizer')}</span>
                  : <span className="cd-mem-hcp num">{t('cdHcp', { h: m.handicap })}</span>}
              </div>
            ))}
          </div>
        )}

        {tab === 'settle' && (
          <>
            <div className={`notice-box cd-settle-status ${unpaid.length ? 'is-warn' : 'is-ok'}`}>
              {unpaid.length
                ? <><AlertCircle size={16} strokeWidth={2.2} /><span>{t('cdSettleWarn', { n: unpaid.length })}</span></>
                : <><CheckCircle2 size={16} strokeWidth={2.2} /><span>{t('cdSettleOk')}</span></>}
            </div>

            {unpaid.length > 0 && (
              <div className="card cd-list">
                {clubMembers.map((m) => (
                  <div className="cd-mem" key={m.id}>
                    <span className="cd-mem-av">{pick(m.nameKr, m.nameEn).charAt(0)}</span>
                    <span className="cd-mem-name">{pick(m.nameKr, m.nameEn)}</span>
                    {m.paid
                      ? <span className="badge badge-paid">{t('cdPaidTag')}</span>
                      : <span className="badge badge-unpaid">{t('cdUnpaidTag')}</span>}
                  </div>
                ))}
              </div>
            )}

            <div className="card ledger">
              <div className="ledger-head">{t('settleSummary')}</div>
              {settlement.rows.map((row, i) => (
                <div className="ledger-row" key={i}>
                  <span className="lr-k">{pick(row.label, row.labelEn)}</span>
                  <span className="lr-a num">{row.amount > 0 ? '+' : ''}{money(row.amount, lang)}</span>
                </div>
              ))}
              <div className="ledger-bal">
                <span className="lb-k">{t('balance')}</span>
                <span className="lb-v"><b className="num">{money(settlement.balance, lang)}</b><em>{t('surplusTag')}</em></span>
              </div>
            </div>
          </>
        )}

        <div className="sticky-cta">
          {organizer
            ? <Button variant="primary" className="btn-block" onClick={onNewRound}><Plus size={16} strokeWidth={2.2} style={{ marginRight: 6, verticalAlign: '-3px' }} />{t('cdNewRound')}</Button>
            : <Button variant="ghost" className="btn-block" onClick={() => setInviteOpen(true)}><UserPlus size={16} strokeWidth={2} style={{ marginRight: 6, verticalAlign: '-3px' }} />{t('cdInvite')}</Button>}
        </div>
      </div>

      {inviteOpen && (
        <>
          <div className="sheet-scrim" onClick={() => setInviteOpen(false)} />
          <div className="edit-sheet invite-sheet">
            <div className="es-grab" />
            <div className="es-title">{t('cdInvite')}</div>
            <div className="invite-sub">{t('inviteSub', { club: pick(c.nameKr, c.nameEn) })}</div>

            <div className="invite-link">
              <span className="invite-link-text">scoreshot.kr/c/{c.id}</span>
              <button className="invite-copy" onClick={() => setCopied(true)}>{copied ? t('inviteCopied') : t('inviteCopy')}</button>
            </div>

            <div className="invite-share">
              <button className="invite-method"><span className="invite-method-ico kakao"><MessageCircle size={22} strokeWidth={2} /></span><span className="invite-method-l">{t('inviteKakao')}</span></button>
              <button className="invite-method"><span className="invite-method-ico sms"><MessageSquare size={21} strokeWidth={2} /></span><span className="invite-method-l">{t('inviteSms')}</span></button>
              <button className="invite-method"><span className="invite-method-ico more"><Share2 size={20} strokeWidth={2} /></span><span className="invite-method-l">{t('inviteMore')}</span></button>
            </div>

            <div className="invite-friends-label">{t('inviteFriends')}</div>
            <div className="invite-list">
              {partners.map((p) => {
                const sent = invited.has(p.ko)
                return (
                  <div className="invite-row" key={p.ko}>
                    <span className="invite-av">{pick(p.ko, p.en).charAt(0)}</span>
                    <span className="invite-name">{pick(p.ko, p.en)}</span>
                    <button className={`invite-btn ${sent ? 'is-sent' : ''}`} onClick={() => toggleInvite(p.ko)}>{sent ? t('inviteSent') : t('inviteSend')}</button>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
