import { useState } from 'react'
import { ArrowLeft, Settings, ChevronRight, Crown, Plus, UserPlus, CheckCircle2, AlertCircle, MessageCircle, MessageSquare, Share2, Lock, Check, MoreVertical, Trash2 } from 'lucide-react'
import { Segmented, Button } from '../components/ui.jsx'
import ClubAvatar from '../components/ClubAvatar.jsx'
import CourseIllust from '../components/CourseIllust.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs, clubMembers, clubMembersFull, clubRanking, partners, events, settlement, money } from '../data/mock.js'

const COLORS = ['#0A7A37', '#3B82F6', '#8B5CF6', '#E2571F', '#0EA5A0']
const MEDAL_COLORS = ['#E0A100', '#9AA0AC', '#C77B3B']

/* ── Role badge (added for member tab) ──────────────────────── */
const ROLE_STYLE = {
  owner:      { bg: '#FFF3DC', color: '#B45309', label: { ko: '오너', en: 'Owner' } },
  general:    { bg: '#DCFCE7', color: '#15803D', label: { ko: '총무', en: 'General Affairs' } },
  management: { bg: '#EDE9FE', color: '#7C3AED', label: { ko: '운영진', en: 'Management' } },
  member:     { bg: 'transparent', color: 'var(--text-3)', label: { ko: 'member', en: 'member' }, border: true },
}

function RoleBadge({ roleKey, lang }) {
  const s = ROLE_STYLE[roleKey] || ROLE_STYLE.member
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8, flexShrink: 0,
      background: s.bg, color: s.color,
      border: s.border ? '1px solid var(--line)' : 'none',
    }}>
      {lang === 'ko' ? s.label.ko : s.label.en}
    </span>
  )
}

/* ── Member avatar (uses first char of name) ─────────────────── */
function MemberAvatar({ name, color, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: Math.round(size * 0.38), fontWeight: 700, color: '#fff' }}>
        {(name || '?').charAt(0)}
      </span>
    </div>
  )
}

/* ── Member management sheet (owner only) ────────────────────── */
const MANAGE_ROLES = [
  { key: 'general',    ko: '총무',   en: 'General Affairs' },
  { key: 'management', ko: '운영진', en: 'Management' },
  { key: 'member',     ko: '멤버',   en: 'Member' },
]
function MemberManageSheet({ member, onClose, onSetRole, onRemove, lang }) {
  const [confirmRemove, setConfirmRemove] = useState(false)
  const name = lang === 'ko' ? member.nameKr : member.nameEn
  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="edit-sheet" style={{ borderRadius: '22px 22px 0 0', padding: '10px 20px 28px' }}>
        <div className="es-grab" />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <MemberAvatar name={name} color={member.color} size={44} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.3 }}>{name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }} className="num">
              {lang === 'ko' ? `핸디캡 ${member.handicap} · 평균 ${member.avg}` : `Handicap ${member.handicap} · Avg ${member.avg}`}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', margin: '0 0 8px', letterSpacing: 0.2, textTransform: 'uppercase' }}>
          {lang === 'ko' ? '역할' : 'Role'}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {MANAGE_ROLES.map((r) => {
            const active = member.roleKey === r.key
            return (
              <button key={r.key} className={`gf-crit ${active ? 'active' : ''}`} onClick={() => onSetRole(member.id, r.key)}>
                {active && <Check size={12} strokeWidth={2.8} />}
                {lang === 'ko' ? r.ko : r.en}
              </button>
            )
          })}
        </div>

        {!confirmRemove ? (
          <button onClick={() => setConfirmRemove(true)} style={{
            width: '100%', height: 50, borderRadius: 'var(--btn-radius)', cursor: 'pointer',
            border: '1.5px solid color-mix(in srgb, var(--negative) 40%, transparent)',
            background: 'var(--negative-weak)', color: 'var(--negative)',
            fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15, letterSpacing: -0.2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}>
            <Trash2 size={17} strokeWidth={2} />
            {lang === 'ko' ? '클럽에서 내보내기' : 'Remove from club'}
          </button>
        ) : (
          <div>
            <p style={{ fontSize: 13.5, color: 'var(--text-2)', textAlign: 'center', margin: '0 0 12px', lineHeight: 1.5 }}>
              {lang === 'ko' ? `${name}님을 클럽에서 내보낼까요?` : `Remove ${name} from the club?`}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmRemove(false)} style={{
                flex: 1, height: 50, borderRadius: 'var(--btn-radius)', cursor: 'pointer',
                border: '1.5px solid var(--line)', background: 'var(--surface)', color: 'var(--text-2)',
                fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15,
              }}>
                {lang === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button onClick={() => onRemove(member.id)} style={{
                flex: 1, height: 50, borderRadius: 'var(--btn-radius)', border: 'none', cursor: 'pointer',
                background: 'var(--negative)', color: '#fff',
                fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15,
              }}>
                {lang === 'ko' ? '내보내기' : 'Remove'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function ClubDetail({ club, onBack, onOpenEvent, onSettings, onNewRound, onMemberMng }) {
  const { t, lang, pick } = useLang()
  const [tab, setTab] = useState('schedule')
  const [rankPeriod, setRankPeriod] = useState('monthly')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [invited, setInvited] = useState(new Set())
  const [members, setMembers] = useState(clubMembersFull)
  const [manageMember, setManageMember] = useState(null)
  const c = club || clubs[0]
  const ci = Math.max(0, clubs.findIndex((x) => x.id === c.id))
  const organizer = c.role === '총무'
  const unpaid = clubMembers.filter((m) => !m.paid)
  const toggleInvite = (k) => setInvited((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n })
  const setMemberRole = (id, roleKey) => setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, roleKey } : m)))
  const removeMember = (id) => { setMembers((ms) => ms.filter((m) => m.id !== id)); setManageMember(null) }

  const TABS = [
    { id: 'schedule', label: t('cdSchedule') },
    { id: 'members', label: t('cdMembersTab') },
    { id: 'ranking', label: lang === 'ko' ? '랭킹' : 'Ranking' },
    { id: 'settle', label: t('cdSettleTab') },
  ]

  const RANK_PERIODS = [
    { id: 'monthly', label: lang === 'ko' ? '월간' : 'Monthly' },
    { id: 'branch', label: lang === 'ko' ? '지부' : 'branch' },
    { id: 'annual', label: lang === 'ko' ? '연간' : 'Annual' },
  ]

  const top3 = clubRanking.slice(0, 3)
  const rest = clubRanking.slice(3)

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{pick(c.nameKr, c.nameEn)}</span>
        <button className="icon-btn" aria-label="Settings" onClick={onSettings}><Settings size={19} strokeWidth={1.8} /></button>
      </div>

      <div className="screen">
        {/* Club header — original unchanged */}
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

        {/* ── Schedule tab — original unchanged ── */}
        {tab === 'schedule' && (
          <>
            <div className="section-head"><span className="s-head-left"><span className="s-title">{t('cdUpcoming')}</span></span></div>
            {events.map((ev) => {
              const left = ev.capacity - ev.joined
              const pct = Math.round((ev.joined / ev.capacity) * 100)
              return (
                <div className="event-card event-card--upcoming" key={ev.id} onClick={() => onOpenEvent?.(ev.id)}>
                  <CourseIllust />
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
            {organizer && (
              <button className="cd-new-round" onClick={onNewRound}>
                <Plus size={17} strokeWidth={2.4} />
                {lang === 'ko' ? '라운드 만들기' : 'New round'}
              </button>
            )}
          </>
        )}

        {/* ── Members tab — role badges + handicap + avg; owners can manage ── */}
        {tab === 'members' && (
          <>
            {organizer && (
              <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '2px 2px 8px' }}>
                {lang === 'ko' ? '멤버를 탭해 역할을 바꾸거나 내보낼 수 있어요' : 'Tap a member to change their role or remove them'}
              </p>
            )}
            <div className="card cd-list">
              {members.map((m) => {
                const manageable = organizer && m.roleKey !== 'owner'
                return (
                  <div className="cd-mem" key={m.id} style={{ gap: 10, cursor: manageable ? 'pointer' : 'default' }}
                    onClick={manageable ? () => setManageMember(m) : undefined}>
                    <MemberAvatar name={lang === 'ko' ? m.nameKr : m.nameEn} color={m.color} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="cd-mem-name" style={{ marginBottom: 2 }}>
                        {lang === 'ko' ? m.nameKr : m.nameEn}
                      </div>
                      <div className="cd-mem-hcp num" style={{ fontSize: 12, color: 'var(--text-3)' }}>
                        {lang === 'ko' ? `핸디캡 ${m.handicap} · 평균 ${m.avg}` : `Handicap ${m.handicap} · Average ${m.avg}`}
                      </div>
                    </div>
                    <RoleBadge roleKey={m.roleKey} lang={lang} />
                    {manageable && <MoreVertical size={17} strokeWidth={2} style={{ color: 'var(--text-3)', flexShrink: 0 }} />}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ── Ranking tab ── */}
        {tab === 'ranking' && (
          <>
            {/* period toggle — Option A: compact outline pill */}
            <div className="sub-seg-a">
              {RANK_PERIODS.map((p) => (
                <button key={p.id} className={`sub-seg-a-item ${rankPeriod === p.id ? 'active' : ''}`} onClick={() => setRankPeriod(p.id)}>{p.label}</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginBottom: 10 }}>
              {lang === 'ko' ? '평균 타수 기준 · 낮을수록 높은 순위' : 'Based on average strokes · Lower is higher'}
            </p>

            {/* podium */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #0A7A37 0%, #1a9e4a 100%)', padding: '20px 12px 0', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
                {[1, 0, 2].map((idx, col) => {
                  const r = top3[idx]
                  if (!r) return null
                  const isFirst = idx === 0
                  const blockH = [80, 104, 64][col]
                  const blockColor = ['#C0C0C0', '#FFD700', '#CD7F32'][col]
                  const name = lang === 'ko' ? r.nameKr : r.nameEn
                  return (
                    <div key={r.rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      {isFirst && <Crown size={16} color="#E0A100" style={{ marginBottom: 4 }} />}
                      <MemberAvatar name={name} color={r.color || '#666'} size={isFirst ? 52 : 42} />
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '6px 0 2px', letterSpacing: -0.2 }}>{name}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px' }} className="num">
                        {r.score}{lang === 'ko' ? '타' : ' strokes'}
                      </p>
                      <div style={{ width: '100%', height: blockH, background: blockColor, borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: 'rgba(0,0,0,0.2)' }}>{r.rank}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* rest of list */}
            <div className="card cd-list">
              {rest.map((r) => (
                <div className="cd-mem" key={r.rank}>
                  <span style={{ width: 24, fontWeight: 700, fontSize: 15, color: 'var(--text-3)', textAlign: 'center', flexShrink: 0 }} className="num">{r.rank}</span>
                  <span className="cd-mem-name" style={{ flex: 1 }}>{lang === 'ko' ? r.nameKr : r.nameEn}</span>
                  <span className="cd-mem-hcp num" style={{ color: 'var(--text-3)', fontSize: 12 }}>
                    {lang === 'ko' ? `핸디캡 ${r.handicap}` : `Handicap ${r.handicap}`}
                  </span>
                  <span className="cd-mem-hcp num" style={{ minWidth: 70, textAlign: 'right', color: 'var(--text-2)' }}>
                    {r.score}{lang === 'ko' ? '타' : ' strokes'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Settlement tab — original unchanged ── */}
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

        {/* CTA — invite lives on the Members tab; round creation is inline on Schedule */}
        {tab === 'members' && (
          <div className="sticky-cta">
            <Button variant="primary" className="btn-block" onClick={() => setInviteOpen(true)}>
              <UserPlus size={16} strokeWidth={2} style={{ marginRight: 6, verticalAlign: '-3px' }} />{t('cdInvite')}
            </Button>
          </div>
        )}
      </div>

      {manageMember && (
        <MemberManageSheet
          member={members.find((m) => m.id === manageMember.id) || manageMember}
          onClose={() => setManageMember(null)}
          onSetRole={setMemberRole}
          onRemove={removeMember}
          lang={lang}
        />
      )}

      {/* Invite sheet — original unchanged */}
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
