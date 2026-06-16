import { useState } from 'react'
import {
  ArrowLeft, Share2, CalendarClock, Wallet, Users, Flag, MapPin, CreditCard,
  Megaphone, Crown, User, Medal, Check, X, Link, Trophy,
} from 'lucide-react'
import { Segmented, Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { eventDetail as ev, participants as initParticipants, leaderboard, settlement, money, paymentMethods } from '../data/mock.js'

const MEDAL_COLORS = ['#E0A100', '#9AA0AC', '#C77B3B']

/* ── Shared primitives ───────────────────────────────────────── */
function SheetScrim({ onClick }) {
  return <div className="sheet-scrim" onClick={onClick} />
}

function SheetWrap({ children }) {
  return (
    <div className="edit-sheet" style={{ borderRadius: '22px 22px 0 0', padding: '10px 20px 28px' }}>
      <div className="es-grab" />
      {children}
    </div>
  )
}

function CtaButton({ onClick, disabled, loading, children }) {
  return (
    <button onClick={!loading && !disabled ? onClick : undefined} disabled={disabled}
      style={{
        width: '100%', height: 52, borderRadius: 'var(--btn-radius)', border: 'none',
        background: disabled ? 'var(--surface-2)' : 'var(--brand)',
        color: disabled ? 'var(--text-3)' : '#fff',
        fontFamily: 'var(--font)', fontWeight: 700, fontSize: 16, letterSpacing: -0.3,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: loading ? 0.8 : 1, transition: 'opacity .15s',
        flexShrink: 0,
      }}>
      {loading ? <SpinnerRing /> : children}
    </button>
  )
}

function SpinnerRing() {
  return (
    <span style={{
      display: 'inline-block', width: 20, height: 20, borderRadius: '50%',
      border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
      animation: 'spin .7s linear infinite',
    }} />
  )
}

function SummaryRow({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{text}</span>
    </div>
  )
}

function SectionLabel({ label }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', marginBottom: 8, letterSpacing: 0.2, textTransform: 'uppercase' }}>
      {label}
    </p>
  )
}

function ReceiptRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      paddingBottom: last ? 0 : 8, marginBottom: last ? 0 : 8,
      borderBottom: last ? 'none' : '1px solid var(--line)',
    }}>
      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{value}</span>
    </div>
  )
}

/* ── Registration bottom sheet ───────────────────────────────── */
function RegisterSheet({ onClose, onSuccess, lang, pick, t }) {
  const [payId, setPayId] = useState(paymentMethods.find(p => p.primary)?.id ?? paymentMethods[0].id)
  const [step, setStep] = useState('form') // 'form' | 'loading' | 'success'
  const assignedGroup = 'G3'
  const selectedMethod = paymentMethods.find(p => p.id === payId)

  function confirm() {
    setStep('loading')
    setTimeout(() => setStep('success'), 1400)
  }

  function done() {
    onSuccess({ group: assignedGroup, method: selectedMethod })
  }

  return (
    <>
      <SheetScrim onClick={step === 'success' ? done : onClose} />
      <SheetWrap>

        {/* ── Success state ── */}
        {step === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--positive-weak)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'regPop .35s cubic-bezier(.34,1.56,.64,1)',
              marginBottom: 14, flexShrink: 0,
            }}>
              <Check size={30} strokeWidth={2.5} color="var(--positive)" />
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.4, margin: 0 }}>
              {lang === 'ko' ? '참가 신청 완료!' : 'Registration Complete!'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6, marginBottom: 20 }}>
              {lang === 'ko' ? `${assignedGroup}조에 배정되었습니다` : `You've been assigned to ${assignedGroup}`}
            </p>

            <div style={{ width: '100%', background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
              <ReceiptRow label={lang === 'ko' ? '행사' : 'Event'} value={pick(ev.titleKr, ev.titleEn)} />
              <ReceiptRow label={lang === 'ko' ? '일시' : 'Date'} value={`${pick(ev.date, ev.dateEn)} ${ev.time}`} />
              <ReceiptRow label={lang === 'ko' ? '조' : 'Group'} value={assignedGroup} />
              <ReceiptRow label={lang === 'ko' ? '결제' : 'Payment'} value={lang === 'ko' ? selectedMethod.nameKo : selectedMethod.nameEn} last />
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderTop: '1px solid var(--line)', marginTop: 10, paddingTop: 10,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>
                  {lang === 'ko' ? '결제 금액' : 'Total paid'}
                </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--positive)', letterSpacing: -0.3 }} className="num">
                  {pick(ev.fee, ev.feeEn)}
                </span>
              </div>
            </div>

            {/* fixed-height button, no flex:1 stretch */}
            <button onClick={done} style={{
              width: '100%', height: 52, borderRadius: 'var(--btn-radius)', border: 'none',
              background: 'var(--brand)', color: '#fff',
              fontFamily: 'var(--font)', fontWeight: 700, fontSize: 16, letterSpacing: -0.3,
              cursor: 'pointer', flexShrink: 0,
            }}>
              {lang === 'ko' ? '확인' : 'Done'}
            </button>
          </div>
        )}

        {/* ── Form / Loading ── */}
        {step !== 'success' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <button onClick={onClose} style={{ border: 'none', background: 'none', padding: 2, cursor: 'pointer', color: 'var(--text-3)' }}>
                <X size={20} />
              </button>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', letterSpacing: -0.2 }}>
                {lang === 'ko' ? '참가 신청' : 'Registration'}
              </span>
              <span style={{ width: 24 }} />
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px', marginBottom: 18 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-1)', margin: '0 0 8px', letterSpacing: -0.3 }}>
                {pick(ev.titleKr, ev.titleEn)}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <SummaryRow icon={<CalendarClock size={13} strokeWidth={1.9} />} text={`${pick(ev.date, ev.dateEn)} ${ev.time}`} />
                <SummaryRow icon={<MapPin size={13} strokeWidth={1.9} />} text={pick(ev.course, ev.courseEn)} />
                <SummaryRow icon={<Users size={13} strokeWidth={1.9} />} text={lang === 'ko' ? `현재 ${ev.joined}/${ev.capacity}명 신청` : `${ev.joined}/${ev.capacity} joined`} />
              </div>
            </div>

            <SectionLabel label={lang === 'ko' ? '배정 정보' : 'Assignment'} />
            <div style={{
              background: 'var(--surface)', border: '1.5px solid var(--line)',
              borderRadius: 12, padding: '13px 16px', marginBottom: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{lang === 'ko' ? '배정 조' : 'Assigned group'}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand)', background: 'var(--brand-weak)', borderRadius: 8, padding: '3px 10px' }}>
                {assignedGroup}
              </span>
            </div>

            <SectionLabel label={lang === 'ko' ? '결제 수단' : 'Payment method'} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {paymentMethods.map((pm) => {
                const sel = payId === pm.id
                return (
                  <button key={pm.id} onClick={() => setPayId(pm.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: sel ? 'color-mix(in srgb, var(--brand) 6%, var(--surface))' : 'var(--surface)',
                      border: `1.5px solid ${sel ? 'var(--brand)' : 'var(--line)'}`,
                      borderRadius: 12, padding: '13px 14px', cursor: 'pointer', transition: 'border-color .15s, background .15s',
                    }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${sel ? 'var(--brand)' : 'var(--line)'}`,
                      background: sel ? 'var(--brand)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
                    }}>
                      {sel && <Check size={11} strokeWidth={3} color="#fff" />}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: -0.2 }}>
                        {lang === 'ko' ? pm.nameKo : pm.nameEn}
                      </p>
                      {pm.tail && (
                        <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '2px 0 0' }}>
                          {lang === 'ko' ? `끝번호 ${pm.tail}` : `···· ${pm.tail}`}
                        </p>
                      )}
                    </div>
                    {pm.primary && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', background: 'var(--brand-weak)', borderRadius: 6, padding: '2px 7px' }}>
                        {lang === 'ko' ? '기본' : 'Default'}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 13px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>📋</span>
              <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>
                {lang === 'ko'
                  ? '행사 3일 전까지 취소 시 전액 환불됩니다. 이후에는 환불이 불가합니다.'
                  : 'Full refund available up to 3 days before the event. No refunds after that.'}
              </p>
            </div>

            <CtaButton onClick={confirm} loading={step === 'loading'}>
              {lang === 'ko' ? `결제하기 · ${pick(ev.fee, ev.feeEn)}` : `Confirm & Pay ${pick(ev.fee, ev.feeEn)}`}
            </CtaButton>
          </>
        )}
      </SheetWrap>

      <style>{`
        @keyframes regPop { 0%{transform:scale(0.5);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

/* ── Close Settlement & Share sheet ──────────────────────────── */
function CloseSettleSheet({ onClose, lang, pick }) {
  const [step, setStep] = useState('preview') // 'preview' | 'loading' | 'done'
  const [shared, setShared] = useState(null)

  function share(channel) {
    setShared(channel)
    setStep('loading')
    setTimeout(() => setStep('done'), 1200)
  }

  const top3 = leaderboard.slice(0, 3)

  return (
    <>
      <SheetScrim onClick={step === 'done' ? onClose : onClose} />
      <SheetWrap>

        {/* ── Done state ── */}
        {step === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--positive-weak)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'regPop .35s cubic-bezier(.34,1.56,.64,1)',
              marginBottom: 14, flexShrink: 0,
            }}>
              <Check size={30} strokeWidth={2.5} color="var(--positive)" />
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.4, margin: 0 }}>
              {lang === 'ko' ? '정산이 마감되었습니다' : 'Settlement Closed'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6, marginBottom: 24 }}>
              {lang === 'ko' ? '결과가 참가자들에게 공유되었습니다' : 'Results have been shared with participants'}
            </p>
            <div style={{
              width: '100%', background: 'var(--surface-2)', borderRadius: 14,
              padding: '14px 16px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: shared === 'kakao' ? '#FEE500' : 'var(--surface)',
                border: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>
                {shared === 'kakao' ? '💬' : shared === 'link' ? '🔗' : '📷'}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>
                  {shared === 'kakao'
                    ? (lang === 'ko' ? '카카오톡으로 공유됨' : 'Shared via KakaoTalk')
                    : shared === 'link'
                    ? (lang === 'ko' ? '링크가 복사됨' : 'Link copied')
                    : (lang === 'ko' ? '이미지가 저장됨' : 'Image saved')}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '2px 0 0' }}>
                  {pick(ev.titleKr, ev.titleEn)} · {pick(ev.date, ev.dateEn)}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: '100%', height: 52, borderRadius: 'var(--btn-radius)', border: 'none',
              background: 'var(--brand)', color: '#fff',
              fontFamily: 'var(--font)', fontWeight: 700, fontSize: 16, letterSpacing: -0.3,
              cursor: 'pointer', flexShrink: 0,
            }}>
              {lang === 'ko' ? '확인' : 'Done'}
            </button>
          </div>
        )}

        {/* ── Preview state ── */}
        {step !== 'done' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <button onClick={onClose} style={{ border: 'none', background: 'none', padding: 2, cursor: 'pointer', color: 'var(--text-3)' }}>
                <X size={20} />
              </button>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', letterSpacing: -0.2 }}>
                {lang === 'ko' ? '정산 마감 · 결과 공유' : 'Close & Share Results'}
              </span>
              <span style={{ width: 24 }} />
            </div>

            {/* Result card preview */}
            <div style={{
              background: 'linear-gradient(135deg, #0A7A37 0%, #1a9e4a 100%)',
              borderRadius: 16, padding: '18px 16px', marginBottom: 16, color: '#fff',
            }}>
              {/* card header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, margin: 0, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    ScoreShot
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 800, margin: '3px 0 0', letterSpacing: -0.3 }}>
                    {pick(ev.titleKr, ev.titleEn)}
                  </p>
                  <p style={{ fontSize: 12, opacity: 0.75, margin: '3px 0 0' }}>
                    {pick(ev.date, ev.dateEn)} · {pick(ev.course, ev.courseEn)}
                  </p>
                </div>
                <Trophy size={28} strokeWidth={1.5} style={{ opacity: 0.6 }} />
              </div>

              {/* divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 14 }} />

              {/* top 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {top3.map((r, i) => (
                  <div key={r.rank} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>
                      {['🥇', '🥈', '🥉'][i]}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>
                      {pick(r.nameKr, r.nameEn)}
                    </span>
                    <span style={{ fontSize: 12, opacity: 0.8, marginRight: 8 }} className="num">
                      Net {r.net.toFixed(1)}
                    </span>
                    <span style={{
                      fontSize: 13, fontWeight: 800,
                      background: 'rgba(255,255,255,0.18)',
                      borderRadius: 8, padding: '3px 9px', letterSpacing: -0.2,
                    }} className="num">
                      {pick(r.prize, r.prizeEn)}
                    </span>
                  </div>
                ))}
              </div>

              {/* divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />

              {/* settlement total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  {lang === 'ko' ? `총 참가 ${ev.capacity}명` : `${ev.capacity} participants`}
                </span>
                <span style={{ fontSize: 12, opacity: 0.75 }} className="num">
                  {lang === 'ko' ? `잔여 ${money(settlement.balance, lang)}` : `Surplus ${money(settlement.balance, lang)}`}
                </span>
              </div>
            </div>

            {/* share channels */}
            <SectionLabel label={lang === 'ko' ? '공유 채널' : 'Share via'} />
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <ShareChip
                emoji="💬"
                label={lang === 'ko' ? '카카오톡' : 'KakaoTalk'}
                bg="#FEE500" color="#3C1E1E"
                onClick={() => share('kakao')}
                loading={step === 'loading' && shared === 'kakao'}
              />
              <ShareChip
                icon={<Link size={18} strokeWidth={2} />}
                label={lang === 'ko' ? '링크 복사' : 'Copy link'}
                bg="var(--surface-2)" color="var(--text-1)"
                onClick={() => share('link')}
                loading={step === 'loading' && shared === 'link'}
              />
              <ShareChip
                emoji="📷"
                label={lang === 'ko' ? '이미지 저장' : 'Save image'}
                bg="var(--surface-2)" color="var(--text-1)"
                onClick={() => share('image')}
                loading={step === 'loading' && shared === 'image'}
              />
            </div>

            <CtaButton onClick={() => share('kakao')} loading={step === 'loading'}>
              {lang === 'ko' ? '정산 마감 · 결과 공유하기' : 'Close Settlement & Share'}
            </CtaButton>
          </>
        )}
      </SheetWrap>

      <style>{`
        @keyframes regPop { 0%{transform:scale(0.5);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

function ShareChip({ emoji, icon, label, bg, color, onClick, loading }) {
  return (
    <button onClick={onClick}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '12px 8px', borderRadius: 14, border: 'none',
        background: bg, cursor: loading ? 'default' : 'pointer',
        opacity: loading ? 0.6 : 1, transition: 'opacity .15s',
      }}>
      <span style={{ fontSize: 22, lineHeight: 1, color }}>
        {emoji || <span style={{ color }}>{icon}</span>}
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: -0.1, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  )
}

/* ── Main screen ─────────────────────────────────────────────── */
export default function Detail({ onBack }) {
  const { t, lang, pick } = useLang()
  const [tab, setTab] = useState('info')
  const [showRegister, setShowRegister] = useState(false)
  const [showSettle, setShowSettle] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [participants, setParticipants] = useState(initParticipants)
  const [joinedCount, setJoinedCount] = useState(ev.joined)

  const TABS = [
    { id: 'info', label: t('tabInfo') },
    { id: 'people', label: t('tabPeople') },
    { id: 'rank', label: t('tabRank') },
  ]

  function handleRegisterSuccess({ group }) {
    setRegistered(true)
    setShowRegister(false)
    setJoinedCount(c => c + 1)
    setParticipants(prev => [
      ...prev,
      { id: 'me', nameKr: '나', nameEn: 'Me', role: '', group: parseInt(group.replace('G', '')), paid: false, isMe: true },
    ])
    setTab('people')
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{pick(ev.titleKr, ev.titleEn)}</span>
        <button className="icon-btn" aria-label="Share"><Share2 size={19} strokeWidth={1.8} /></button>
      </div>

      <div className="screen">
        {/* Hero */}
        <div className="card detail-hero">
          <div className="dh-chips">
            <span className="dday">D-{ev.dday}</span>
            <span className="ev-status">{t('open')}</span>
          </div>
          <div className="dh-title">{pick(ev.course, ev.courseEn)}</div>
          <div className="dh-row"><CalendarClock size={15} strokeWidth={1.9} /><b>{pick(ev.date, ev.dateEn)} {ev.time}</b></div>
          <div className="dh-row"><Wallet size={15} strokeWidth={1.9} />{t('feeLine', { fee: pick(ev.fee, ev.feeEn), note: pick(ev.feeNote, ev.feeNoteEn) })}</div>
          <div className="dh-row"><Users size={15} strokeWidth={1.9} /><b className="num">{t('joinedLine', { n: joinedCount, cap: ev.capacity })}</b></div>
        </div>

        <Segmented items={TABS} value={tab} onChange={setTab} />

        {tab === 'info' && (
          <>
            <div className="card info-block">
              <div className="ib-row"><span className="ib-ico"><Flag size={15} strokeWidth={1.9} /></span><span className="ib-k">{t('rowFormat')}</span><span className="ib-v">{pick(ev.formatKr, ev.formatEn)} · {pick(ev.groupKr, ev.groupEn)}</span></div>
              <div className="ib-row"><span className="ib-ico"><MapPin size={15} strokeWidth={1.9} /></span><span className="ib-k">{t('rowCourse')}</span><span className="ib-v">{pick(ev.course, ev.courseEn)} · {t('viewMap')}</span></div>
              <div className="ib-row"><span className="ib-ico"><CreditCard size={15} strokeWidth={1.9} /></span><span className="ib-k">{t('rowFee')}</span><span className="ib-v num">{pick(ev.fee, ev.feeEn)} · {pick(ev.feeNote, ev.feeNoteEn)}</span></div>
            </div>
            <div className="notice-box"><Megaphone size={16} strokeWidth={1.9} /><span>{pick(ev.noticeKr, ev.noticeEn)}</span></div>
          </>
        )}

        {tab === 'people' && (
          <div className="list">
            {participants.map((p) => (
              <div className="p-row" key={p.id}
                style={p.isMe ? { background: 'color-mix(in srgb, var(--brand) 5%, transparent)', borderRadius: 10 } : {}}>
                <span className="pr-av">
                  {p.role === '총무'
                    ? <Crown size={15} strokeWidth={2} color="var(--caution)" />
                    : <User size={15} strokeWidth={1.9} style={p.isMe ? { color: 'var(--brand)' } : {}} />}
                </span>
                <span className="pr-name">
                  {pick(p.nameKr, p.nameEn)}
                  {p.role === '총무' && <span className="badge badge-role">{t('organizer')}</span>}
                  {p.isMe && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', background: 'var(--brand-weak)', borderRadius: 6, padding: '2px 6px', marginLeft: 6 }}>
                      {lang === 'ko' ? '나' : 'You'}
                    </span>
                  )}
                </span>
                <span className="pr-group num">{t('group', { g: p.group })}</span>
                {p.paid
                  ? <span className="badge badge-paid">{t('paid')}</span>
                  : <span className="badge badge-unpaid">{t('unpaid')}</span>}
              </div>
            ))}
          </div>
        )}

        {tab === 'rank' && (
          <>
            <div className="list">
              {leaderboard.map((r) => (
                <div className="lb-row" key={r.rank}>
                  <span className="lb-rank">
                    {r.rank <= 3 ? <Medal size={19} strokeWidth={2} color={MEDAL_COLORS[r.rank - 1]} /> : <span className="num">{r.rank}</span>}
                  </span>
                  <span className="lb-name">{pick(r.nameKr, r.nameEn)}</span>
                  <span className="lb-net num">Net {r.net.toFixed(1)}</span>
                  <span className="lb-prize num">{pick(r.prize, r.prizeEn)}</span>
                </div>
              ))}
            </div>

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
                <span className="lb-v">
                  <b className="num">{money(settlement.balance, lang)}</b>
                  <em>{t('surplusTag')}</em>
                </span>
              </div>
            </div>
          </>
        )}

        <div className="sticky-cta">
          {tab === 'rank' ? (
            <Button variant="primary" className="btn-block" onClick={() => setShowSettle(true)}>
              {t('ctaClose')}
            </Button>
          ) : registered ? (
            <button disabled style={{
              width: '100%', height: 52, borderRadius: 'var(--btn-radius)', border: 'none',
              background: 'var(--positive-weak)', color: 'var(--positive)',
              fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'default',
            }}>
              <Check size={18} strokeWidth={2.5} />
              {lang === 'ko' ? '참가 신청 완료' : 'Registered'}
            </button>
          ) : (
            <Button variant="primary" className="btn-block" onClick={() => setShowRegister(true)}>
              {t('ctaRegister', { fee: pick(ev.fee, ev.feeEn) })}
            </Button>
          )}
        </div>
      </div>

      {showRegister && (
        <RegisterSheet
          onClose={() => setShowRegister(false)}
          onSuccess={handleRegisterSuccess}
          lang={lang} pick={pick} t={t}
        />
      )}

      {showSettle && (
        <CloseSettleSheet
          onClose={() => setShowSettle(false)}
          lang={lang} pick={pick}
        />
      )}
    </>
  )
}
