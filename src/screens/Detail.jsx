import { useState } from 'react'
import {
  ArrowLeft, Share2, CalendarClock, Wallet, Users, UsersRound, Flag, MapPin, CreditCard,
  Megaphone, Crown, User, Medal, Check, X, Link, Trophy,
  LayoutGrid, Camera, Receipt, Lock, ChevronRight, Info, ScanLine, Download, AlertTriangle,
  MoreVertical, Trash2, Pencil, UserPlus,
} from 'lucide-react'
import KakaoLogo from '../components/KakaoLogo.jsx'
import { Segmented, Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { eventDetail as ev, participants as initParticipants, eventTools, leaderboard, settlement, money, paymentMethods, partners } from '../data/mock.js'
import Scan from './Scan.jsx'
import EventVerify from './EventVerify.jsx'
import ShinperioResult from './ShinperioResult.jsx'
import AwardResults from './AwardResults.jsx'
import GroupFormation from './GroupFormation.jsx'
import EventSettle from './EventSettle.jsx'
import CreateEvent from './CreateEvent.jsx'

const ET_ICONS = { grid: UsersRound, camera: ScanLine, trophy: Trophy, receipt: Receipt }

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
function RegisterSheet({ onClose, onSuccess, lang, pick, t, e = ev }) {
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
              <ReceiptRow label={lang === 'ko' ? '행사' : 'Event'} value={pick(e.titleKr, e.titleEn)} />
              <ReceiptRow label={lang === 'ko' ? '일시' : 'Date'} value={`${pick(e.date, e.dateEn)} ${e.time}`} />
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
                  {pick(e.fee, e.feeEn)}
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
                {pick(e.titleKr, e.titleEn)}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <SummaryRow icon={<CalendarClock size={13} strokeWidth={1.9} />} text={`${pick(e.date, e.dateEn)} ${e.time}`} />
                <SummaryRow icon={<MapPin size={13} strokeWidth={1.9} />} text={pick(e.course, e.courseEn)} />
                <SummaryRow icon={<Users size={13} strokeWidth={1.9} />} text={lang === 'ko' ? `현재 ${e.joined ?? ev.joined}/${e.capacity}명 신청` : `${e.joined ?? ev.joined}/${e.capacity} joined`} />
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
                      display: 'flex', alignItems: 'center', gap: 12, outline: 'none',
                      background: sel ? 'var(--brand-weak)' : 'var(--surface)',
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
              <Info size={15} strokeWidth={2} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>
                {lang === 'ko'
                  ? '행사 3일 전까지 취소 시 전액 환불됩니다. 이후에는 환불이 불가합니다.'
                  : 'Full refund available up to 3 days before the event. No refunds after that.'}
              </p>
            </div>

            <CtaButton onClick={confirm} loading={step === 'loading'}>
              {lang === 'ko' ? `결제하기 · ${pick(e.fee, e.feeEn)}` : `Confirm & Pay ${pick(e.fee, e.feeEn)}`}
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
                background: shared === 'kakao' ? '#FEE500' : 'var(--surface-2)',
                border: shared === 'kakao' ? 'none' : '1px solid var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-2)',
              }}>
                {shared === 'kakao' ? <KakaoLogo size={20} /> : shared === 'link' ? <Link size={18} strokeWidth={2} /> : <Download size={18} strokeWidth={2} />}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, margin: 0, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    LABEON
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

              <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 14 }} />

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

              <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />

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
                icon={<KakaoLogo size={22} />}
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
                icon={<Download size={19} strokeWidth={2} />}
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

/* ── Cancel registration confirm sheet ───────────────────────── */
function CancelSheet({ onClose, onConfirm, lang, pick }) {
  const [loading, setLoading] = useState(false)

  function confirm() {
    setLoading(true)
    setTimeout(() => onConfirm(), 1000)
  }

  return (
    <>
      <SheetScrim onClick={loading ? undefined : onClose} />
      <SheetWrap>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--negative-weak)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, flexShrink: 0,
          }}>
            <AlertTriangle size={28} strokeWidth={2.2} color="var(--negative)" />
          </div>
          <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.4, margin: 0 }}>
            {lang === 'ko' ? '참가를 취소하시겠어요?' : 'Cancel registration?'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8, marginBottom: 22, textAlign: 'center', lineHeight: 1.6 }}>
            {lang === 'ko'
              ? `참가가 취소되고 배정된 조에서 제외됩니다.\n참가비 ${pick(ev.fee, ev.feeEn)}은 전액 환불돼요.`
              : `Your spot and group assignment will be released.\n${pick(ev.fee, ev.feeEn)} will be fully refunded.`}
          </p>

          <button onClick={!loading ? confirm : undefined} disabled={loading} style={{
            width: '100%', height: 52, borderRadius: 'var(--btn-radius)', border: 'none',
            background: 'var(--negative)', color: '#fff', marginBottom: 8,
            fontFamily: 'var(--font)', fontWeight: 700, fontSize: 16, letterSpacing: -0.3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.8 : 1, flexShrink: 0,
          }}>
            {loading ? <SpinnerRing /> : (lang === 'ko' ? '참가 취소하기' : 'Cancel registration')}
          </button>
          <button onClick={!loading ? onClose : undefined} style={{
            width: '100%', height: 48, borderRadius: 'var(--btn-radius)', border: 'none', background: 'none',
            color: 'var(--text-2)', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15,
            cursor: 'pointer', flexShrink: 0,
          }}>
            {lang === 'ko' ? '돌아가기' : 'Keep my spot'}
          </button>
        </div>
      </SheetWrap>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

/* ── Event options menu (three-dot) ──────────────────────────── */
function EventMenuSheet({ onClose, onShare, onEdit, onDelete, lang }) {
  return (
    <>
      <SheetScrim onClick={onClose} />
      <SheetWrap>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button className="ev-menu-row" onClick={onShare}>
            <Share2 size={19} strokeWidth={1.9} />
            <span>{lang === 'ko' ? '공유하기' : 'Share'}</span>
          </button>
          <button className="ev-menu-row" onClick={onEdit}>
            <Pencil size={19} strokeWidth={1.9} />
            <span>{lang === 'ko' ? '행사 정보 수정' : 'Edit event'}</span>
          </button>
          <button className="ev-menu-row is-danger" onClick={onDelete}>
            <Trash2 size={19} strokeWidth={1.9} />
            <span>{lang === 'ko' ? '행사 삭제' : 'Delete event'}</span>
          </button>
        </div>
      </SheetWrap>
    </>
  )
}

/* ── Delete event confirm sheet ──────────────────────────────── */
function DeleteEventSheet({ onClose, onConfirm, lang }) {
  const [loading, setLoading] = useState(false)
  function confirm() {
    setLoading(true)
    setTimeout(() => onConfirm(), 1000)
  }
  return (
    <>
      <SheetScrim onClick={loading ? undefined : onClose} />
      <SheetWrap>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--negative-weak)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, flexShrink: 0,
          }}>
            <AlertTriangle size={28} strokeWidth={2.2} color="var(--negative)" />
          </div>
          <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.4, margin: 0 }}>
            {lang === 'ko' ? '행사를 삭제하시겠어요?' : 'Delete this event?'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8, marginBottom: 22, textAlign: 'center', lineHeight: 1.6 }}>
            {lang === 'ko'
              ? `참가자 ${ev.joined}명에게 취소 알림이 전송되며,\n삭제 후에는 되돌릴 수 없어요.`
              : `A cancellation notice goes to ${ev.joined} participants.\nThis cannot be undone.`}
          </p>
          <button onClick={!loading ? confirm : undefined} disabled={loading} style={{
            width: '100%', height: 52, borderRadius: 'var(--btn-radius)', border: 'none',
            background: 'var(--negative)', color: '#fff', marginBottom: 8,
            fontFamily: 'var(--font)', fontWeight: 700, fontSize: 16, letterSpacing: -0.3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.8 : 1, flexShrink: 0,
          }}>
            {loading ? <SpinnerRing /> : (lang === 'ko' ? '삭제하기' : 'Delete')}
          </button>
          <button onClick={!loading ? onClose : undefined} style={{
            width: '100%', height: 48, borderRadius: 'var(--btn-radius)', border: 'none', background: 'none',
            color: 'var(--text-2)', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15, cursor: 'pointer', flexShrink: 0,
          }}>
            {lang === 'ko' ? '돌아가기' : 'Keep event'}
          </button>
        </div>
      </SheetWrap>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

/* ── Player invite sheet (host only) — invite members or add a guest ─ */
function PlayerInviteSheet({ onClose, onAddGuest, e = ev, lang, pick, t }) {
  const [mode, setMode] = useState('invite')   // 'invite' | 'guest'
  const [invited, setInvited] = useState(() => new Set())
  const toggle = (k) => setInvited((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n })

  // guest registration form
  const [gName, setGName] = useState('')
  const [gContact, setGContact] = useState('')
  const [gRec, setGRec] = useState('')
  const [gConsent, setGConsent] = useState(false)
  const guestValid = gName.trim().length > 0 && gConsent

  function submitGuest() {
    onAddGuest?.({ name: gName.trim(), contact: gContact.trim(), recommender: gRec.trim() })
    onClose()
  }

  return (
    <>
      <SheetScrim onClick={onClose} />
      <SheetWrap>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={onClose} style={{ border: 'none', background: 'none', padding: 2, cursor: 'pointer', color: 'var(--text-3)' }}>
            <X size={20} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', letterSpacing: -0.2 }}>
            {mode === 'invite' ? t('hostInviteTitle') : t('guestTitle')}
          </span>
          <span style={{ width: 24 }} />
        </div>

        {/* mode toggle — app design-system tabs */}
        <div style={{ marginBottom: 16 }}>
          <Segmented
            items={[{ id: 'invite', label: t('inviteMembersTab') }, { id: 'guest', label: t('guestTab') }]}
            value={mode}
            onChange={setMode}
          />
        </div>

        {mode === 'invite' ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', margin: '0 0 14px' }}>
              {t('hostInviteSub', { event: pick(e.titleKr, e.titleEn) })}
            </p>
            <div className="invite-list">
              {partners.map((p) => {
                const sent = invited.has(p.ko)
                return (
                  <div className="invite-row" key={p.ko}>
                    <span className="invite-av">{pick(p.ko, p.en).charAt(0)}</span>
                    <span className="invite-name">{pick(p.ko, p.en)}</span>
                    <button className={`invite-btn ${sent ? 'is-sent' : ''}`} onClick={() => toggle(p.ko)}>
                      {sent ? t('inviteSent') : t('inviteSend')}
                    </button>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: 18 }}>
              <CtaButton onClick={onClose}>
                {invited.size > 0 ? t('hostInvited', { n: invited.size }) : (lang === 'ko' ? '완료' : 'Done')}
              </CtaButton>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', margin: '0 0 16px' }}>
              {t('guestSub')}
            </p>
            <div className="field">
              <label className="field-label">{t('guestName')}</label>
              <input className="field-input" value={gName} onChange={(ev) => setGName(ev.target.value)} placeholder={t('guestNamePlace')} />
            </div>
            <div className="field">
              <label className="field-label">{t('guestContact')}</label>
              <input className="field-input" value={gContact} onChange={(ev) => setGContact(ev.target.value)} placeholder="010-0000-0000" inputMode="tel" />
            </div>
            <div className="field">
              <label className="field-label">{t('guestRecommender')}</label>
              <input className="field-input" value={gRec} onChange={(ev) => setGRec(ev.target.value)} placeholder={t('guestRecommenderPlace')} />
            </div>
            <button className="guest-consent" onClick={() => setGConsent((v) => !v)}>
              <span className={`gc-box ${gConsent ? 'on' : ''}`}>{gConsent && <Check size={13} strokeWidth={3} color="#fff" />}</span>
              <span className="gc-text">{t('guestConsent')}</span>
            </button>
            <div style={{ marginTop: 18 }}>
              <CtaButton onClick={submitGuest} disabled={!guestValid}>{t('guestAdd')}</CtaButton>
            </div>
          </>
        )}
      </SheetWrap>
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
export default function Detail({ onBack, onImmersiveChange, event, onDelete }) {
  const { t, lang, pick } = useLang()
  const [subScreen, setSubScreen] = useState(null)

  const goSub = (s) => { setSubScreen(s); onImmersiveChange?.(s === 'evScan') }
  const leaveScan = (next) => { setSubScreen(next); onImmersiveChange?.(false) }
  const [tab, setTab] = useState('info')
  const [showRegister, setShowRegister] = useState(false)
  const [showSettle, setShowSettle] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [toast, setToast] = useState(null)
  const [registered, setRegistered] = useState(false)
  const [participants, setParticipants] = useState(initParticipants)
  const [joinedCount, setJoinedCount] = useState(event?.joined ?? ev.joined)

  // Hero/title/info reflect the card that was opened; format/notice fall back to
  // the rich sample so every event reads completely.
  const fmtMd = (iso) => { const [, m, d] = String(iso).split('-'); return `${+m}/${+d}` }
  const ed = event ? {
    ...ev,
    titleKr: event.titleKo, titleEn: event.titleEn,
    course: event.courseKo, courseEn: event.courseEn,
    date: fmtMd(event.date), dateEn: fmtMd(event.date), time: event.time,
    fee: `${event.fee / 10000}만원`, feeEn: `₩${Number(event.fee).toLocaleString()}`,
    capacity: event.capacity, dday: event.dday,
  } : ev

  // Host view: the signed-in user created this event (carries the 주최/Host tag).
  // Hosts don't register — they get RSVP stats and player-invite controls instead.
  const isHost = !!event?.mine
  const hostStats = {
    attending: event?.joined ?? ev.joined,
    absent: event?.absent ?? 0,
    pending: event?.mood ?? Math.max(0, (event?.capacity ?? ev.capacity) - (event?.joined ?? ev.joined) - (event?.absent ?? 0)),
  }

  // Rankings/settlement only make sense once the round has been played — show
  // that tab on past events only, not on upcoming ones still gathering players.
  const isPast = event?.status === 'ended'
  const TABS = [
    { id: 'info', label: t('tabInfo') },
    { id: 'people', label: t('tabPeople') },
    ...(isPast ? [{ id: 'rank', label: t('tabRank') }] : []),
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

  function handleCancelRegistration() {
    setRegistered(false)
    setShowCancel(false)
    setJoinedCount(c => Math.max(0, c - 1))
    setParticipants(prev => prev.filter(p => !p.isMe))
  }

  function handleAddGuest(guest) {
    setJoinedCount(c => c + 1)
    setParticipants(prev => [
      ...prev,
      { id: 'guest' + prev.length, nameKr: guest.name, nameEn: guest.name, role: '', group: Math.floor(prev.length / 4) + 1, paid: false, guest: true },
    ])
    setTab('people')
    flashToast(lang === 'ko' ? '게스트가 추가되었어요' : 'Guest added')
  }

  function flashToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  function handleShare() {
    setShowMenu(false)
    flashToast(lang === 'ko' ? '행사 링크가 복사되었어요' : 'Event link copied')
  }

  if (subScreen === 'groups')    return <GroupFormation onBack={() => setSubScreen(null)} />
  if (subScreen === 'evScan')    return <Scan onBack={() => leaveScan(null)} onCaptured={() => leaveScan('evVerify')} />
  if (subScreen === 'evVerify')  return <EventVerify onBack={() => goSub('evScan')} onNext={() => setSubScreen('shinperio')} />
  if (subScreen === 'shinperio') return <ShinperioResult onBack={() => setSubScreen('evVerify')} onNext={() => setSubScreen('awards')} />
  if (subScreen === 'awards')    return <AwardResults onBack={() => setSubScreen('shinperio')} onDone={() => { setSubScreen(null); setTab('info') }} onImmersiveChange={onImmersiveChange} />
  if (subScreen === 'settle')    return <EventSettle onBack={() => setSubScreen(null)} onDone={() => { setSubScreen(null); setTab('rank') }} onImmersiveChange={onImmersiveChange} />
  if (subScreen === 'edit')      return (
    <CreateEvent
      edit
      initial={{
        id: event?.id ?? ev.id,
        name: pick(ed.titleKr, ed.titleEn),
        course: pick(ed.course, ed.courseEn),
        date: event?.date ?? '2026-05-14',
        time: ed.time,
        fee: String(ed.feeEn).replace(/[^0-9]/g, ''),
        cap: String(ed.capacity),
        joined: joinedCount,
      }}
      onBack={() => setSubScreen(null)}
      onCreate={() => { setSubScreen(null); flashToast(lang === 'ko' ? '행사 정보를 수정했어요' : 'Event updated') }}
    />
  )

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{pick(ed.titleKr, ed.titleEn)}</span>
        <button className="icon-btn" aria-label={lang === 'ko' ? '더보기' : 'More'} onClick={() => setShowMenu(true)}>
          <MoreVertical size={20} strokeWidth={1.9} />
        </button>
      </div>

      <div className="screen">
        {/* Hero */}
        <div className="card detail-hero">
          <svg className="dh-illust" viewBox="0 0 140 140" fill="none" aria-hidden="true">
            <path d="M100 22 V102" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M100 24 L134 35 L100 47 Z" fill="currentColor" />
            <ellipse cx="100" cy="106" rx="27" ry="8" fill="currentColor" opacity="0.4" />
            <path d="M14 104 Q56 44 98 26" stroke="currentColor" strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" />
            <circle cx="14" cy="104" r="4.5" fill="currentColor" />
          </svg>
          <div className="dh-chips">
            <span className="dday">D-{ed.dday}</span>
            <span className="ev-status">{t('open')}</span>
            {isHost && <span className="ev-host-chip"><Crown size={11} strokeWidth={2.4} /> {t('hostTag')}</span>}
          </div>
          <div className="dh-title">{pick(ed.course, ed.courseEn)}</div>
          <div className="dh-row"><CalendarClock size={15} strokeWidth={1.9} /><b>{pick(ed.date, ed.dateEn)} {ed.time}</b></div>
          <div className="dh-row"><Wallet size={15} strokeWidth={1.9} />{t('feeLine', { fee: pick(ed.fee, ed.feeEn), note: pick(ev.feeNote, ev.feeNoteEn) })}</div>
          <div className="dh-row"><Users size={15} strokeWidth={1.9} /><b className="num">{t('joinedLine', { n: joinedCount, cap: ed.capacity })}</b></div>
        </div>

        <Segmented items={TABS} value={tab} onChange={setTab} />

        {tab === 'info' && (
          <>
            {/* Host-only: RSVP overview at a glance */}
            {isHost && (
              <div className="card ev-host-stats">
                <div className="ehs-tile">
                  <span className="ehs-num num">{hostStats.attending}</span>
                  <span className="ehs-label">{t('hostAttending')}</span>
                </div>
                <div className="ehs-tile">
                  <span className="ehs-num num">{hostStats.absent}</span>
                  <span className="ehs-label">{t('hostAbsent')}</span>
                </div>
                <div className="ehs-tile">
                  <span className="ehs-num num">{hostStats.pending}</span>
                  <span className="ehs-label">{t('hostMood')}</span>
                </div>
              </div>
            )}
            <div className="card info-block">
              <div className="ib-row"><span className="ib-ico"><Flag size={15} strokeWidth={1.9} /></span><span className="ib-k">{t('rowFormat')}</span><span className="ib-v">{pick(ev.formatKr, ev.formatEn)} · {pick(ev.groupKr, ev.groupEn)}</span></div>
              <div className="ib-row"><span className="ib-ico"><MapPin size={15} strokeWidth={1.9} /></span><span className="ib-k">{t('rowCourse')}</span><span className="ib-v">{pick(ed.course, ed.courseEn)} · {t('viewMap')}</span></div>
              <div className="ib-row"><span className="ib-ico"><CreditCard size={15} strokeWidth={1.9} /></span><span className="ib-k">{t('rowFee')}</span><span className="ib-v num">{pick(ed.fee, ed.feeEn)} · {pick(ev.feeNote, ev.feeNoteEn)}</span></div>
            </div>
            <div className="notice-box"><Megaphone size={16} strokeWidth={1.9} /><span>{pick(ev.noticeKr, ev.noticeEn)}</span></div>

            {/* General Affairs Tools — host/organizer only */}
            {isHost && <>
            <div className="section-head">
              <span className="s-head-left"><span className="s-title">{t('edToolsTitle')}</span></span>
            </div>
            <div className="card et-list">
              {eventTools.map((tool) => {
                const Icon = ET_ICONS[tool.icon] || Flag
                return (
                  <button className={`list-row et-row ${tool.locked ? 'et-row--locked' : ''}`} key={tool.id}
                    onClick={tool.locked ? undefined : tool.id === 'group' ? () => setSubScreen('groups') : tool.id === 'results' ? () => goSub('evScan') : tool.id === 'awards' ? () => setSubScreen('shinperio') : tool.id === 'settle' ? () => setSubScreen('settle') : undefined}
                  >
                    <span className="et-icon-box"><Icon size={18} strokeWidth={1.8} /></span>
                    <span className="et-body">
                      <span className="et-title">{pick(tool.titleKo, tool.titleEn)}</span>
                      <span className="et-sub">{pick(tool.subKo, tool.subEn)}</span>
                    </span>
                    {tool.locked
                      ? <span className="et-lock-badge"><Lock size={11} strokeWidth={2.2} />{lang === 'ko' ? '준비중' : 'Soon'}</span>
                      : <ChevronRight size={17} className="chev" />}
                  </button>
                )
              })}
            </div>
            </>}
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
                  {p.guest && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--point)', background: 'color-mix(in srgb, var(--point) 12%, #fff)', borderRadius: 6, padding: '2px 6px', marginLeft: 6 }}>
                      {t('guestBadge')}
                    </span>
                  )}
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
                  <span className="lb-prize-slot">
                    {pick(r.prize, r.prizeEn) && <span className="lb-prize num">{pick(r.prize, r.prizeEn)}</span>}
                  </span>
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

        {/* Bottom action — rank tab closes settlement; the host invites players from
            the Players tab; players register on upcoming events. */}
        {(tab === 'rank' || (isHost && tab === 'people') || (!isHost && !isPast)) && (
          <div className="sticky-cta">
            {tab === 'rank' ? (
              <Button variant="primary" className="btn-block" onClick={() => setShowSettle(true)}>
                {t('ctaClose')}
              </Button>
            ) : isHost ? (
              <Button variant="primary" className="btn-block" onClick={() => setShowInvite(true)}>
                <UserPlus size={16} strokeWidth={2} style={{ marginRight: 6, verticalAlign: '-3px' }} />{t('hostInvite')}
              </Button>
            ) : registered ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{
                  flex: 1, height: 52, borderRadius: 'var(--btn-radius)',
                  background: 'var(--positive-weak)', color: 'var(--positive)',
                  fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <Check size={18} strokeWidth={2.5} />
                  {lang === 'ko' ? '참가 신청 완료' : 'Registered'}
                </span>
                <button onClick={() => setShowCancel(true)} style={{
                  flexShrink: 0, height: 52, padding: '0 18px', borderRadius: 'var(--btn-radius)',
                  border: '1.5px solid color-mix(in srgb, var(--negative) 40%, transparent)',
                  background: 'var(--negative-weak)', color: 'var(--negative)',
                  fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15, letterSpacing: -0.2, cursor: 'pointer',
                }}>
                  {lang === 'ko' ? '참가 취소' : 'Cancel'}
                </button>
              </div>
            ) : (
              <Button variant="primary" className="btn-block" onClick={() => setShowRegister(true)}>
                {t('ctaRegister', { fee: pick(ed.fee, ed.feeEn) })}
              </Button>
            )}
          </div>
        )}
      </div>

      {showRegister && (
        <RegisterSheet
          e={ed}
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

      {showCancel && (
        <CancelSheet
          onClose={() => setShowCancel(false)}
          onConfirm={handleCancelRegistration}
          lang={lang} pick={pick}
        />
      )}

      {showInvite && (
        <PlayerInviteSheet
          e={ed}
          onClose={() => setShowInvite(false)}
          onAddGuest={handleAddGuest}
          lang={lang} pick={pick} t={t}
        />
      )}

      {showMenu && (
        <EventMenuSheet
          onClose={() => setShowMenu(false)}
          onShare={handleShare}
          onEdit={() => { setShowMenu(false); setSubScreen('edit') }}
          onDelete={() => { setShowMenu(false); setShowDelete(true) }}
          lang={lang}
        />
      )}

      {showDelete && (
        <DeleteEventSheet
          onClose={() => setShowDelete(false)}
          onConfirm={() => { setShowDelete(false); onDelete ? onDelete() : onBack() }}
          lang={lang}
        />
      )}

      {toast && (
        <div className="app-toast" role="status">
          <Check size={14} strokeWidth={2.6} />
          {toast}
        </div>
      )}
    </>
  )
}
