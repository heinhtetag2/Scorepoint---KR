import { useState } from 'react'
import {
  ArrowLeft, Settings, ChevronRight, Crown, Plus, UserPlus,
  CheckCircle2, AlertCircle, MessageCircle, MessageSquare, Share2,
  Shield, Users, MapPin, Lock, CalendarDays,
} from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs, clubMembersFull, clubRanking, eventList, settlement, money, partners } from '../data/mock.js'

/* ── Role badge ──────────────────────────────────────────────── */
const ROLE_STYLE = {
  owner:      { bg: '#FFF3DC', color: '#B45309', label: { ko: '오너', en: 'Owner' } },
  general:    { bg: '#DCFCE7', color: '#15803D', label: { ko: '총무', en: 'General Affairs' } },
  management: { bg: '#EDE9FE', color: '#7C3AED', label: { ko: '운영진', en: 'Management' } },
  member:     { bg: 'transparent', color: 'var(--text-3)', label: { ko: 'member', en: 'member' } },
}

function RoleBadge({ roleKey, lang }) {
  const s = ROLE_STYLE[roleKey] || ROLE_STYLE.member
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
      background: s.bg, color: s.color, flexShrink: 0, border: roleKey === 'member' ? '1px solid var(--line)' : 'none',
    }}>
      {lang === 'ko' ? s.label.ko : s.label.en}
    </span>
  )
}

/* ── Member avatar circle ────────────────────────────────────── */
function MemberAvatar({ initials, color, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: size * 0.3, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>
        {initials}
      </span>
    </div>
  )
}

/* ── Landscape golf banner ───────────────────────────────────── */
function GolfBanner() {
  return (
    <div style={{
      height: 130, position: 'relative', overflow: 'hidden', flexShrink: 0,
      background: 'linear-gradient(180deg, #C8E6C9 0%, #A5D6A7 30%, #81C784 55%, #4CAF50 75%, #388E3C 100%)',
      margin: '0 calc(-1 * var(--pad))',
    }}>
      {/* sky */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #B3E5FC 0%, #C8E6C9 45%, transparent 70%)' }} />
      {/* sun */}
      <div style={{ position: 'absolute', top: 18, right: 40, width: 32, height: 32, borderRadius: '50%', background: '#FDD835', opacity: 0.9 }} />
      {/* far hill */}
      <div style={{
        position: 'absolute', bottom: 30, left: '-10%', right: '-10%', height: 70,
        background: '#66BB6A', borderRadius: '50% 50% 0 0 / 40% 40% 0 0',
      }} />
      {/* near hill */}
      <div style={{
        position: 'absolute', bottom: 0, left: '-20%', right: '-20%', height: 55,
        background: '#388E3C', borderRadius: '50% 50% 0 0 / 60% 60% 0 0',
      }} />
      {/* trees left */}
      <div style={{ position: 'absolute', bottom: 30, left: 24 }}>
        <div style={{ width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: '22px solid #2E7D32', marginBottom: 0 }} />
        <div style={{ width: 6, height: 8, background: '#1B5E20', margin: '0 auto' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 26, left: 46 }}>
        <div style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '17px solid #1B5E20', marginBottom: 0 }} />
        <div style={{ width: 4, height: 6, background: '#1B5E20', margin: '0 auto' }} />
      </div>
      {/* trees right */}
      <div style={{ position: 'absolute', bottom: 28, right: 28 }}>
        <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '20px solid #2E7D32', marginBottom: 0 }} />
        <div style={{ width: 5, height: 7, background: '#1B5E20', margin: '0 auto' }} />
      </div>
      {/* flag pin */}
      <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ width: 2, height: 30, background: '#fff', margin: '0 auto' }} />
        <div style={{ width: 12, height: 8, background: '#FF5722', position: 'absolute', top: 0, left: 2, clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
        <div style={{ width: 10, height: 3, background: '#fff', borderRadius: 2, margin: '-1px auto 0' }} />
      </div>
    </div>
  )
}

/* ── Rank podium ─────────────────────────────────────────────── */
function Podium({ top3, lang, pick }) {
  const ORDER = [1, 0, 2] // left=2nd, center=1st, right=3rd
  const HEIGHTS = [80, 104, 64]
  const COLORS = ['#C0C0C0', '#FFD700', '#CD7F32']
  const CROWN_COLOR = '#E0A100'

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0A7A37 0%, #1a9e4a 100%)',
      borderRadius: 16, padding: '20px 16px 0', marginBottom: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
        {ORDER.map((idx, col) => {
          const r = top3[idx]
          if (!r) return null
          const isFirst = idx === 0
          return (
            <div key={r.rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              {isFirst && (
                <div style={{ marginBottom: 4 }}>
                  <Crown size={16} color={CROWN_COLOR} />
                </div>
              )}
              {r.initials ? (
                <MemberAvatar initials={r.initials} color={r.color} size={isFirst ? 52 : 42} />
              ) : (
                <div style={{ width: isFirst ? 52 : 42, height: isFirst ? 52 : 42, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{pick(r.nameKr, r.nameEn).charAt(0)}</span>
                </div>
              )}
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '6px 0 2px', letterSpacing: -0.2 }}>
                {pick(r.nameKr, r.nameEn)}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px' }} className="num">
                {r.scoreLabel || `${r.score}`}
              </p>
              {/* podium block */}
              <div style={{
                width: '100%', height: HEIGHTS[col],
                background: COLORS[col], borderRadius: '8px 8px 0 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: 'rgba(0,0,0,0.25)' }}>{r.rank}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main screen ─────────────────────────────────────────────── */
export default function ClubDetail({ club, onBack, onOpenEvent, onSettings, onNewRound, onMemberMng }) {
  const { t, lang, pick } = useLang()
  const [tab, setTab] = useState('member')
  const [rankPeriod, setRankPeriod] = useState('monthly')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [invited, setInvited] = useState(new Set())

  const c = club || clubs[0]
  const isOrganizer = c.role === '총무'
  const trialDays = 23
  const top3 = clubRanking.slice(0, 3)
  const rest = clubRanking.slice(3)

  const TABS = [
    { id: 'member', label: t('cdTabMember') },
    { id: 'event', label: t('cdTabEvent') },
    { id: 'ranking', label: t('cdTabRanking') },
    { id: 'fee', label: t('cdTabFee') },
  ]

  const RANK_PERIODS = [
    { id: 'monthly', label: t('cdRankMonthly') },
    { id: 'branch', label: t('cdRankBranch') },
    { id: 'annual', label: t('cdRankAnnual') },
  ]

  const toggleInvite = (k) => setInvited((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n })

  return (
    <>
      <div className="appbar" style={{ position: 'relative', zIndex: 2 }}>
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span style={{ flex: 1 }} />
        <button className="icon-btn" aria-label="Settings" onClick={onSettings}><Settings size={19} strokeWidth={1.8} /></button>
      </div>

      <div className="screen" style={{ paddingTop: 0, gap: 0 }}>
        {/* Landscape banner */}
        <GolfBanner />

        {/* Club identity */}
        <div style={{ padding: '14px var(--pad) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.4, margin: 0, flex: 1 }}>
              {pick(c.nameKr, c.nameEn)}
            </h2>
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#92400E',
              background: '#FEF3C7', borderRadius: 20, padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
              {t('cdDaysLeft', { n: trialDays })}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-2)' }}>
              <Users size={13} strokeWidth={1.8} />
              {lang === 'ko' ? `멤버 ${clubMembersFull.length}명` : `Member ${clubMembersFull.length}`}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-2)' }}>
              <MapPin size={13} strokeWidth={1.8} />
              {t('cdLocation')}
            </span>
          </div>

          {/* Trial banner */}
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            background: '#FFFBEB', border: '1px solid #FDE68A',
            borderRadius: 12, padding: '11px 14px', marginBottom: 14,
            cursor: 'pointer', textAlign: 'left',
          }}>
            <Crown size={15} strokeWidth={2} color="#F59E0B" />
            <span style={{ flex: 1, fontSize: 13, color: '#92400E', fontWeight: 500 }}>
              {lang === 'ko'
                ? `무료 체험 ${trialDays}일 남음 · 지금 구독하기`
                : `${trialDays} days left of free trial · Subscribe now`}
            </span>
            <ChevronRight size={15} color="#F59E0B" />
          </button>

          {/* Quick action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <button onClick={onNewRound} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              height: 44, borderRadius: 12,
              background: 'var(--brand-weak)', border: '1.5px solid var(--brand)',
              color: 'var(--brand)', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14,
              cursor: 'pointer',
            }}>
              <Shield size={15} strokeWidth={2} />
              {t('cdCreateEvent')}
              <span style={{ fontSize: 15 }}>🔒</span>
            </button>
            <button onClick={() => onMemberMng?.()} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              height: 44, borderRadius: 12,
              background: 'var(--surface-2)', border: '1.5px solid var(--line)',
              color: 'var(--text-1)', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14,
              cursor: 'pointer',
            }}>
              <Users size={15} strokeWidth={2} />
              {t('cdMemberMng')}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', marginBottom: 0 }}>
          {TABS.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              style={{
                flex: 1, padding: '10px 4px', border: 'none', background: 'none',
                fontFamily: 'var(--font)', fontSize: 13, fontWeight: tab === tb.id ? 700 : 500,
                color: tab === tb.id ? 'var(--brand)' : 'var(--text-3)',
                borderBottom: tab === tb.id ? '2px solid var(--brand)' : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
              }}>
              {tb.label}
              {tb.id === 'fee' && <Lock size={11} strokeWidth={2.5} />}
            </button>
          ))}
        </div>

        {/* ── member tab ── */}
        {tab === 'member' && (
          <div style={{ padding: '8px var(--pad)' }}>
            {clubMembersFull.map((m) => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 0', borderBottom: '1px solid var(--line)',
              }}>
                <MemberAvatar initials={m.initials} color={m.color} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: -0.2 }}>
                    {pick(m.nameKr, m.nameEn)}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '3px 0 0' }} className="num">
                    {lang === 'ko' ? `핸디캡 ${m.handicap} · 평균 ${m.avg}` : `Handicap ${m.handicap} · Average ${m.avg}`}
                  </p>
                </div>
                <RoleBadge roleKey={m.roleKey} lang={lang} />
              </div>
            ))}
          </div>
        )}

        {/* ── event tab ── */}
        {tab === 'event' && (
          <div style={{ padding: '8px var(--pad)' }}>
            {eventList.map((ev) => (
              <div key={ev.id} onClick={() => onOpenEvent?.(ev.id)}
                style={{
                  background: 'var(--surface)', borderRadius: 14,
                  border: '1px solid var(--line)', padding: '14px 16px',
                  marginBottom: 10, cursor: 'pointer',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
                    background: ev.status === 'scheduled' ? 'color-mix(in srgb, var(--positive) 12%, transparent)' : 'var(--surface-2)',
                    color: ev.status === 'scheduled' ? 'var(--positive)' : 'var(--text-3)',
                  }}>
                    {ev.status === 'scheduled' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--positive)' }} />}
                    {ev.status === 'scheduled'
                      ? (lang === 'ko' ? '예정' : 'expected')
                      : (lang === 'ko' ? '종료' : 'end')}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{ev.date}</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 6px', letterSpacing: -0.3 }}>
                  {lang === 'ko' ? ev.titleKo : ev.titleEn}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={12} strokeWidth={1.8} color="var(--text-3)" />
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {lang === 'ko' ? ev.courseKo : ev.courseEn}
                    {' · '}
                    {lang === 'ko' ? `${ev.joined}명 참가` : `${ev.joined} attendees`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ranking tab ── */}
        {tab === 'ranking' && (
          <div style={{ padding: '12px var(--pad)' }}>
            {/* period toggle */}
            <div style={{
              display: 'flex', background: 'var(--surface-2)', borderRadius: 12,
              padding: 3, marginBottom: 12,
            }}>
              {RANK_PERIODS.map((p) => (
                <button key={p.id} onClick={() => setRankPeriod(p.id)}
                  style={{
                    flex: 1, padding: '8px 4px', border: 'none', borderRadius: 9,
                    background: rankPeriod === p.id ? 'var(--surface)' : 'transparent',
                    boxShadow: rankPeriod === p.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    fontFamily: 'var(--font)', fontSize: 13,
                    fontWeight: rankPeriod === p.id ? 700 : 500,
                    color: rankPeriod === p.id ? 'var(--text-1)' : 'var(--text-3)',
                    cursor: 'pointer', transition: 'all .15s',
                  }}>{p.label}</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginBottom: 12 }}>
              {t('cdRankNote')}
            </p>

            <Podium top3={top3} lang={lang} pick={pick} />

            <div style={{ marginTop: 4 }}>
              {rest.map((r) => (
                <div key={r.rank} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', borderBottom: '1px solid var(--line)',
                }}>
                  <span style={{ width: 24, fontWeight: 700, fontSize: 15, color: 'var(--text-3)', textAlign: 'center' }} className="num">
                    {r.rank}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: -0.2 }}>
                      {pick(r.nameKr, r.nameEn)}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '2px 0 0' }}>
                      {lang === 'ko' ? `핸디캡 ${r.handicap}` : `Handicap ${r.handicap}`}
                    </p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)' }} className="num">
                    {r.score} {lang === 'ko' ? '타' : 'strokes'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── membership fee tab (locked) ── */}
        {tab === 'fee' && (
          <div style={{ padding: '40px var(--pad)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Lock size={28} strokeWidth={1.8} color="#F59E0B" />
            </div>
            <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', margin: '0 0 8px', letterSpacing: -0.3 }}>
              {t('cdFeeLockedTitle')}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65, margin: '0 0 28px', maxWidth: 280 }}>
              {t('cdFeeLockedDesc')}
            </p>
            <button style={{
              padding: '13px 36px', borderRadius: 'var(--btn-radius)', border: 'none',
              background: 'var(--brand)', color: '#fff',
              fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              {t('cdFeeLockedCta')}
            </button>
          </div>
        )}

        <div style={{ height: 90 }} />
      </div>

      {/* Invite sheet */}
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
                    <button className={`invite-btn ${sent ? 'is-sent' : ''}`} onClick={() => toggleInvite(p.ko)}>
                      {sent ? t('inviteSent') : t('inviteSend')}
                    </button>
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
