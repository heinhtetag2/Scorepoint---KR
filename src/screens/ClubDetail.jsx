import { useState } from 'react'
import { ArrowLeft, Settings, ChevronRight, Crown, Plus, UserPlus, CheckCircle2, AlertCircle, MessageCircle, MessageSquare, Share2, Lock, Check, MoreVertical, Trash2, CalendarDays, ShieldCheck, Landmark } from 'lucide-react'
import { Segmented, Button } from '../components/ui.jsx'
import ClubAvatar from '../components/ClubAvatar.jsx'
import CourseIllust from '../components/CourseIllust.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs, clubMembers, clubMembersFull, clubRanking, clubBilling, partners, events, settlement, money, pendingApplicants } from '../data/mock.js'

const COLORS = ['#0A7A37', '#3B82F6', '#8B5CF6', '#E2571F', '#0EA5A0']
const MEDAL_COLORS = ['#E0A100', '#9AA0AC', '#C77B3B']

/* ── Role badge (added for member tab) ──────────────────────── */
const ROLE_STYLE = {
  owner:      { bg: '#FFF3DC', color: '#B45309', label: { ko: '오너', en: 'Owner' } },
  general:    { bg: '#DCFCE7', color: '#15803D', label: { ko: '총무', en: 'General Affairs' } },
  management: { bg: '#EDE9FE', color: '#7C3AED', label: { ko: '운영진', en: 'Management' } },
  member:     { bg: 'transparent', color: 'var(--text-3)', label: { ko: '멤버', en: 'Member' }, border: true },
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

/* ── Create membership fee item (organizer) ──────────────────── */
const FEE_TYPES = [
  { id: 'annual',  ko: '연회비', en: 'Annual fee' },
  { id: 'monthly', ko: '월회비', en: 'Monthly fee' },
  { id: 'event',   ko: '행사비', en: 'Event fee' },
]

function CreateFeeScreen({ clubName, onBack, onSubmit, lang, t, pick }) {
  const [type, setType] = useState('annual')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [due, setDue] = useState('')
  const [target, setTarget] = useState('all')
  const [sel, setSel] = useState(new Set())
  const [msg, setMsg] = useState('')

  const onAmount = (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, '')
    setAmount(digits ? Number(digits).toLocaleString('en-US') : '')
  }
  const toggleSel = (id) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const valid = name.trim() && amount && (target === 'all' || sel.size > 0)

  const submit = () => {
    if (!valid) return
    const num = Number(amount.replace(/[^0-9]/g, '')) || 0
    const cat = FEE_TYPES.find((x) => x.id === type)
    const md = due ? due.slice(5).replace('-', '/') : ''
    onSubmit({
      id: 'b' + Date.now(),
      kind: type,
      catKo: cat.ko, catEn: cat.en,
      titleKo: name.trim(), titleEn: name.trim(),
      amount: num,
      dueKo: md ? `${md}까지` : '상시',
      dueEn: md ? `Due ${md}` : 'Anytime',
      scopeKo: target === 'all' ? '전체 멤버' : `선택 ${sel.size}명`,
      scopeEn: target === 'all' ? 'All members' : `${sel.size} selected`,
    })
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('cdFeeCreate')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        <p className="create-fee-sub">{clubName}</p>

        {/* Fee type */}
        <div className="field">
          <label className="field-label">{t('cdFeeType')}</label>
          <div className="seg-pills">
            {FEE_TYPES.map((ft) => (
              <button key={ft.id} className={`seg-pill ${type === ft.id ? 'active' : ''}`} onClick={() => setType(ft.id)}>
                {pick(ft.ko, ft.en)}
              </button>
            ))}
          </div>
        </div>

        {/* Item name */}
        <div className="field">
          <label className="field-label">{t('cdFeeName')}</label>
          <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('cdFeeNamePh')} />
        </div>

        {/* Amount */}
        <div className="field">
          <label className="field-label">{t('cdFeeAmount')}</label>
          <div className="input-wrap">
            <input className="field-input num" inputMode="numeric" value={amount} onChange={onAmount} placeholder="200,000" />
            <span className="input-suffix">{lang === 'ko' ? '원' : 'won'}</span>
          </div>
        </div>

        {/* Deadline — custom-styled field over a native date picker */}
        <div className="field">
          <label className="field-label">{t('cdFeeDeadline')}</label>
          <div className="field-input field-date">
            <span className={`field-date-text num ${due ? '' : 'is-empty'}`}>
              {due ? due.replace(/-/g, '. ') : t('cdFeeDeadlinePh')}
            </span>
            <CalendarDays size={18} strokeWidth={1.9} className="field-date-ico" />
            <input
              type="date"
              className="field-date-native"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
              aria-label={t('cdFeeDeadline')}
            />
          </div>
        </div>

        {/* Target */}
        <div className="field">
          <label className="field-label">{t('cdFeeTarget')}</label>
          <div className="seg-pills">
            <button className={`seg-pill ${target === 'all' ? 'active' : ''}`} onClick={() => setTarget('all')}>{t('cdFeeAll')}</button>
            <button className={`seg-pill ${target === 'sel' ? 'active' : ''}`} onClick={() => setTarget('sel')}>{t('cdFeeSelected')}</button>
          </div>
          {target === 'sel' && (
            <>
              <p className="create-fee-sub" style={{ margin: '2px 2px 0' }}>
                {sel.size > 0 ? t('cdFeeSelectedN', { n: sel.size }) : t('cdFeePickHint')}
              </p>
              <div className="card cd-list fee-pick">
                {clubMembers.map((m, i) => {
                  const on = sel.has(m.id)
                  return (
                    <button type="button" className="cd-mem fee-pick-row" key={m.id} onClick={() => toggleSel(m.id)}>
                      <span className="cd-mem-av cd-mem-av--color" style={{ background: COLORS[i % COLORS.length] }}>
                        {pick(m.nameKr, m.nameEn).charAt(0)}
                      </span>
                      <span className="cd-mem-name">{pick(m.nameKr, m.nameEn)}</span>
                      <span className={`fee-pick-check ${on ? 'on' : ''}`}>{on && <Check size={13} strokeWidth={3} />}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Message */}
        <div className="field">
          <label className="field-label">{t('cdFeeMsg')}<span className="field-optional">{t('cdFeeOptional')}</span></label>
          <textarea className="field-input field-area" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t('cdFeeMsgPh')} />
        </div>

        <div className="sticky-cta">
          <Button variant="primary" className="btn-block" disabled={!valid} onClick={submit}>{t('cdFeeSend')}</Button>
        </div>
      </div>
    </>
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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

        <div className="ms-divider" />

        {!confirmRemove ? (
          <>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', margin: '0 0 8px', letterSpacing: 0.2, textTransform: 'uppercase' }}>
              {lang === 'ko' ? '관리' : 'Manage'}
            </p>
            <button onClick={() => setConfirmRemove(true)} className="ms-remove-link">
              <Trash2 size={16} strokeWidth={2} />
              {lang === 'ko' ? '클럽에서 내보내기' : 'Remove from club'}
            </button>
          </>
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

/* ── Transfer ownership sheet (owner only) ───────────────────── */
function TransferOwnerSheet({ members, onClose, onConfirm, lang, t, pick }) {
  const [sel, setSel] = useState(null)
  const candidates = members.filter((m) => m.roleKey !== 'owner')
  const picked = candidates.find((m) => m.id === sel)
  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="edit-sheet" style={{ borderRadius: '22px 22px 0 0', padding: '10px 20px 28px' }}>
        <div className="es-grab" />
        <div className="es-title">{t('cdTransferTitle')}</div>
        <p className="invite-sub" style={{ marginBottom: 14 }}>{t('cdTransferPick')}</p>
        <div className="transfer-list">
          {candidates.map((m) => {
            const on = sel === m.id
            return (
              <button type="button" key={m.id} className={`cd-mem transfer-row ${on ? 'on' : ''}`} onClick={() => setSel(m.id)}>
                <MemberAvatar name={lang === 'ko' ? m.nameKr : m.nameEn} color={m.color} size={38} />
                <span className="cd-mem-name" style={{ flex: 1 }}>{lang === 'ko' ? m.nameKr : m.nameEn}</span>
                <span className={`fee-pick-check ${on ? 'on' : ''}`}>{on && <Check size={13} strokeWidth={3} />}</span>
              </button>
            )
          })}
        </div>
        <button
          className="btn btn-primary btn-block owner-confirm"
          disabled={!sel}
          onClick={() => onConfirm(sel)}
        >
          {picked ? t('cdTransferConfirm', { name: pick(picked.nameKr, picked.nameEn) }) : t('cdTransferCta')}
        </button>
      </div>
    </>
  )
}

/* ── Remittance (club account) settings sheet ────────────────── */
function RemitSheet({ remit, onClose, onSave, lang, t }) {
  const [bankKo, setBankKo] = useState(remit.bankKo)
  const [bankEn, setBankEn] = useState(remit.bankEn)
  const [acct, setAcct] = useState(remit.acct)
  const [holderKo, setHolderKo] = useState(remit.holderKo)
  const [holderEn, setHolderEn] = useState(remit.holderEn)
  const valid = (lang === 'ko' ? bankKo : bankEn).trim() && acct.trim() && (lang === 'ko' ? holderKo : holderEn).trim()
  const save = () => valid && onSave({ ...remit, bankKo, bankEn, acct, holderKo, holderEn })
  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="edit-sheet" style={{ borderRadius: '22px 22px 0 0', padding: '10px 20px 28px' }}>
        <div className="es-grab" />
        <div className="es-title">{t('cdRemitSheetTitle')}</div>
        <p className="invite-sub" style={{ marginBottom: 16 }}>{t('cdRemitSheetSub')}</p>

        <div className="field" style={{ marginBottom: 14 }}>
          <label className="field-label">{t('cdRemitBank')}</label>
          {lang === 'ko'
            ? <input className="field-input" value={bankKo} onChange={(e) => setBankKo(e.target.value)} />
            : <input className="field-input" value={bankEn} onChange={(e) => setBankEn(e.target.value)} />}
        </div>
        <div className="field" style={{ marginBottom: 14 }}>
          <label className="field-label">{t('cdRemitAcct')}</label>
          <input className="field-input num" inputMode="numeric" value={acct} onChange={(e) => setAcct(e.target.value)} />
        </div>
        <div className="field" style={{ marginBottom: 22 }}>
          <label className="field-label">{t('cdRemitHolder')}</label>
          {lang === 'ko'
            ? <input className="field-input" value={holderKo} onChange={(e) => setHolderKo(e.target.value)} />
            : <input className="field-input" value={holderEn} onChange={(e) => setHolderEn(e.target.value)} />}
        </div>

        <button className="btn btn-primary btn-block" disabled={!valid} onClick={save}>{t('cdRemitSave')}</button>
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
  const [feeMembers, setFeeMembers] = useState(clubMembers)
  const [billItems, setBillItems] = useState(clubBilling)
  const [confirmMode, setConfirmMode] = useState(false)
  const [createFee, setCreateFee] = useState(false)
  const [toast, setToast] = useState(null)
  const [transferOpen, setTransferOpen] = useState(false)
  const [remitOpen, setRemitOpen] = useState(false)
  const [remit, setRemit] = useState({ bankKo: '국민은행', bankEn: 'KB Kookmin', acct: '123456-78-901234', holderKo: '타고플러스 골프회', holderEn: 'Tago Plus Golf Club' })
  const c = club || clubs[0]
  const ci = Math.max(0, clubs.findIndex((x) => x.id === c.id))
  const organizer = c.role === '총무'
  const unpaid = feeMembers.filter((m) => !m.paid)
  // Collection summary — keyed to the active due (newest billing item)
  const dues = billItems[0]
  const paidCount = feeMembers.length - unpaid.length
  const collectRate = Math.round((paidCount / feeMembers.length) * 100)
  const totalBill = feeMembers.length * dues.amount
  const collected = paidCount * dues.amount
  const outstanding = totalBill - collected
  const toggleInvite = (k) => setInvited((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n })
  const setMemberRole = (id, roleKey) => setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, roleKey } : m)))
  const removeMember = (id) => { setMembers((ms) => ms.filter((m) => m.id !== id)); setManageMember(null) }
  const flashToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1800) }
  const togglePaid = (id) => setFeeMembers((ms) => ms.map((m) => (m.id === id ? { ...m, paid: !m.paid } : m)))
  const addFeeItem = (item) => {
    setBillItems((items) => [item, ...items])
    setCreateFee(false)
    flashToast(lang === 'ko' ? '청구서를 보냈어요' : 'Bill sent to members')
  }
  const transferOwnership = (id) => {
    const next = members.find((m) => m.id === id)
    setMembers((ms) => ms.map((m) => (
      m.id === id ? { ...m, roleKey: 'owner' } : m.roleKey === 'owner' ? { ...m, roleKey: 'general' } : m
    )))
    setTransferOpen(false)
    flashToast(t('cdTransferDone', { name: pick(next?.nameKr, next?.nameEn) }))
  }
  const saveRemit = (next) => { setRemit(next); setRemitOpen(false); flashToast(t('cdRemitSaved')) }

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

  if (createFee) {
    return (
      <CreateFeeScreen
        clubName={pick(c.nameKr, c.nameEn)}
        onBack={() => setCreateFee(false)}
        onSubmit={addFeeItem}
        lang={lang} t={t} pick={pick}
      />
    )
  }

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
            <button className="cd-new-round" onClick={onNewRound}>
              <Plus size={17} strokeWidth={2.4} />
              {lang === 'ko' ? '라운드 만들기' : 'New round'}
            </button>
          </>
        )}

        {/* ── Members tab — role badges + handicap + avg; owners can manage ── */}
        {tab === 'members' && (
          <>
            {/* Full member management — role/remove inline below, plus join requests */}
            <button className="cd-manage-row" onClick={onMemberMng}>
              <span className="cmr-body">
                <span className="cmr-title">{t('csMembersMng')}</span>
                <span className="cmr-sub">{lang === 'ko' ? '역할 변경 · 가입 신청 관리' : 'Roles · join requests'}</span>
              </span>
              {pendingApplicants.length > 0 && <span className="cmr-badge num">{pendingApplicants.length}</span>}
              <ChevronRight size={17} className="chev" />
            </button>
            <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '2px 2px 8px' }}>
              {lang === 'ko' ? '멤버를 탭해 역할을 바꾸거나 내보낼 수 있어요' : 'Tap a member to change their role or remove them'}
            </p>
            <div className="card cd-list">
              {members.map((m) => {
                const manageable = m.roleKey !== 'owner'
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

            {/* Ownership — owner-only, intentionally set apart as a sensitive action */}
            {organizer && (
              <>
                <div className="section-head"><span className="s-head-left"><span className="s-title">{t('cdOwnership')}</span></span></div>
                <button className="owner-row" onClick={() => setTransferOpen(true)}>
                  <span className="owner-row-ico"><ShieldCheck size={17} strokeWidth={2} /></span>
                  <span className="owner-row-body">
                    <span className="owner-row-title">{t('cdTransferTitle')}</span>
                    <span className="owner-row-desc">{t('cdTransferDesc')}</span>
                  </span>
                  <ChevronRight size={17} className="chev" />
                </button>
              </>
            )}
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
            <div className="card" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0A7A37 0%, #1a9e4a 100%)', padding: '20px 12px 0', marginBottom: 4 }}>
              {/* decorative golf scene behind the podium */}
              <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', color: '#fff', opacity: 0.09, pointerEvents: 'none' }}>
                {/* rolling fairway curves */}
                <path d="M-10 70 Q90 30 180 70 T340 70" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M-10 120 Q110 80 220 120 T350 120" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* flag + pin on a mound, top-right */}
                <path d="M286 18 V70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M286 20 L312 28 L286 38 Z" fill="currentColor" />
                <ellipse cx="286" cy="72" rx="20" ry="5" fill="currentColor" opacity="0.5" />
                {/* dotted ball trajectory toward the pin */}
                <path d="M30 150 Q150 60 282 56" stroke="currentColor" strokeWidth="2.5" strokeDasharray="1 12" strokeLinecap="round" fill="none" />
                {/* scattered golf balls */}
                <circle cx="30" cy="150" r="5" fill="currentColor" />
                <circle cx="250" cy="180" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="60" cy="40" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
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

        {/* ── Settlement tab — dues collection & billing ── */}
        {tab === 'settle' && (
          <>
            <div className={`notice-box cd-settle-status ${unpaid.length ? 'is-warn' : 'is-ok'}`}>
              <span className="cd-ss-msg">
                {unpaid.length
                  ? <><AlertCircle size={16} strokeWidth={2.2} /><span>{t('cdSettleWarn', { n: unpaid.length })}</span></>
                  : <><CheckCircle2 size={16} strokeWidth={2.2} /><span>{t('cdSettleOk')}</span></>}
              </span>
              {unpaid.length > 0 && organizer && (
                <button className="cd-remind" onClick={() => flashToast(t('cdRemindSent'))}>{t('cdRemind')}</button>
              )}
            </div>

            {/* Collection summary — collected of total, with what's left to chase */}
            <div className="card collect-card">
              <svg className="collect-illust" viewBox="0 0 140 140" fill="none" aria-hidden="true">
                <ellipse cx="86" cy="116" rx="54" ry="12" fill="currentColor" opacity="0.4" />
                <path d="M72 38 V108" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M72 40 L106 51 L72 62 Z" fill="currentColor" />
                <ellipse cx="44" cy="108" rx="16" ry="5" fill="currentColor" />
                <ellipse cx="44" cy="100" rx="16" ry="5" fill="currentColor" opacity="0.7" />
                <ellipse cx="44" cy="92" rx="16" ry="5" fill="currentColor" opacity="0.5" />
              </svg>
              <div className="collect-top">
                <span className="collect-label">{t('cdCollectRate')}</span>
                <span className="collect-pct num">{collectRate}%</span>
              </div>
              <div className="collect-amount">
                <b className="num">{money(collected, lang)}</b>
                <span className="collect-amount-total num">/ {money(totalBill, lang)}</span>
              </div>
              <div className="collect-bar">
                <span className="collect-bar-fill" style={{ width: `${collectRate}%` }} />
              </div>
              <div className="collect-foot">
                <span className="collect-foot-paid">
                  <CheckCircle2 size={13} strokeWidth={2.4} />
                  {t('cdCollectRatio', { paid: paidCount, total: clubMembers.length })}
                </span>
                {outstanding > 0 && (
                  <span className="collect-foot-due">
                    {t('cdOutstanding')} <b className="num">{money(outstanding, lang)}</b>
                  </span>
                )}
              </div>
            </div>

            {/* Remittance account — where members send dues */}
            {organizer ? (
              <button className="remit-row" onClick={() => setRemitOpen(true)}>
                <span className="remit-ico"><Landmark size={17} strokeWidth={1.9} /></span>
                <span className="remit-body">
                  <span className="remit-label">{t('cdRemitTitle')}</span>
                  <span className="remit-acct num">{pick(remit.bankKo, remit.bankEn)} · {remit.acct}</span>
                </span>
                <ChevronRight size={17} className="chev" />
              </button>
            ) : (
              <div className="remit-row is-static">
                <span className="remit-ico"><Landmark size={17} strokeWidth={1.9} /></span>
                <span className="remit-body">
                  <span className="remit-label">{t('cdRemitTitle')}</span>
                  <span className="remit-acct num">{pick(remit.bankKo, remit.bankEn)} · {remit.acct}</span>
                </span>
              </div>
            )}

            {/* Billing items */}
            <div className="section-head">
              <span className="s-head-left"><span className="s-title">{t('cdBillItems')}</span></span>
            </div>
            <div className="card bill-list">
              {billItems.map((b) => (
                <div className="bill-row" key={b.id}>
                  <span className="bill-body">
                    <span className="bill-title">{pick(b.titleKo, b.titleEn)}</span>
                    <span className="bill-meta">
                      <span className={`cat-badge cat-${b.kind}`}>{pick(b.catKo, b.catEn)}</span>
                      <span className="bill-scope">{pick(b.scopeKo, b.scopeEn)}</span>
                    </span>
                  </span>
                  <span className="bill-right">
                    <span className="bill-amt num">{money(b.amount, lang)}</span>
                    <span className="bill-due num">{pick(b.dueKo, b.dueEn)}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Membership payment status */}
            <div className="section-head">
              <span className="s-head-left">
                <span className="s-title">{t('cdPayStatus')}</span>
                <span className="s-count num">{feeMembers.length}</span>
              </span>
              {confirmMode && organizer && (
                <span className="s-more s-more--hint">{t('cdFeeConfirmHint')}</span>
              )}
            </div>
            <div className="card cd-list">
              {[...feeMembers]
                .sort((a, b) => Number(a.paid) - Number(b.paid))
                .map((m, i) => (
                  <div className="cd-mem cd-mem--pay" key={m.id}>
                    <span className="cd-mem-av cd-mem-av--color" style={{ background: COLORS[i % COLORS.length] }}>
                      {pick(m.nameKr, m.nameEn).charAt(0)}
                    </span>
                    <span className="cd-mem-name">{pick(m.nameKr, m.nameEn)}</span>
                    {confirmMode && organizer ? (
                      <button
                        className={`fee-confirm ${m.paid ? 'is-cancel' : ''}`}
                        onClick={() => togglePaid(m.id)}
                      >
                        {m.paid ? t('cdFeeCancel') : t('cdFeeConfirmAction')}
                      </button>
                    ) : (
                      <span className={`pay-badge ${m.paid ? 'is-paid' : 'is-unpaid'}`}>
                        <span className="pb-dot" />{m.paid ? t('cdPaidTag') : t('cdUnpaidTag')}
                      </span>
                    )}
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
                <span className="lb-v"><b className="num">{money(settlement.balance, lang)}</b><em>{t('surplusTag')}</em></span>
              </div>
            </div>

            {organizer && <div className="fee-dock-spacer" aria-hidden />}
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

      {/* Floating organizer dock — only on the Settlement tab, hidden while a sheet is open */}
      {tab === 'settle' && organizer && !remitOpen && (
        <div className="fee-dock">
          <button className="btn fee-dock-btn is-primary" onClick={() => setCreateFee(true)}>
            <Plus size={18} strokeWidth={2.6} />{t('cdFeeAdd')}
          </button>
          <button
            className={`btn fee-dock-btn is-ghost ${confirmMode ? 'is-active' : ''}`}
            onClick={() => setConfirmMode((v) => !v)}
          >
            <Check size={17} strokeWidth={2.6} />{confirmMode ? t('cdFeeDone') : t('cdFeeConfirm')}
          </button>
        </div>
      )}

      {manageMember && (
        <MemberManageSheet
          member={members.find((m) => m.id === manageMember.id) || manageMember}
          onClose={() => setManageMember(null)}
          onSetRole={setMemberRole}
          onRemove={removeMember}
          lang={lang}
        />
      )}

      {transferOpen && (
        <TransferOwnerSheet
          members={members}
          onClose={() => setTransferOpen(false)}
          onConfirm={transferOwnership}
          lang={lang} t={t} pick={pick}
        />
      )}

      {remitOpen && (
        <RemitSheet
          remit={remit}
          onClose={() => setRemitOpen(false)}
          onSave={saveRemit}
          lang={lang} t={t}
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

      {toast && (
        <div className="app-toast" role="status">
          <Check size={14} strokeWidth={2.6} />
          {toast}
        </div>
      )}
    </>
  )
}
