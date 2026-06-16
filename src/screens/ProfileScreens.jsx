import { useState, useRef, useEffect } from 'react'
import {
  ArrowLeft, Camera, ChevronRight, Check, CreditCard, Plus, Minus, Pencil,
  Headphones, Phone, MessageSquareText, FileText, Star,
  BarChart3, CalendarDays, Wallet, Ticket, Banknote, MessageCircle,
  Crown, RefreshCw, Receipt, Download,
} from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { Button } from '../components/ui.jsx'
import { Avatar, AVATAR_IDS } from '../components/Avatars.jsx'
import { fmtBirth } from './Onboarding.jsx'
import {
  user, account, badges, tiers, tierBenefits, pointHistory, paymentMethods,
  paymentHistory, notiPrefs, faqs, policies, money,
  subscription, subPlans, subHistory,
} from '../data/mock.js'

const BENEFIT_ICON = { report: BarChart3, event: CalendarDays, settle: Wallet, coupon: Ticket }

/* Shared pushed-page shell: back-arrow app bar + scroll area. */
export function SubPage({ title, onBack, children, footer }) {
  return (
    <>
      <div className="appbar sub-appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{title}</span>
        <span style={{ width: 28 }} />
      </div>
      <div className="screen sub-screen">{children}</div>
      {footer}
    </>
  )
}

/* Reusable toggle switch. */
function Switch({ on, onClick }) {
  return (
    <button className={`switch ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on} role="switch">
      <span className="switch-knob" />
    </button>
  )
}

const HCP_BANDS = [
  { id: 'beginner', ko: '입문', en: 'Beginner' },
  { id: 'novice', ko: '초급', en: 'Novice' },
  { id: 'mid', ko: '중급', en: 'Intermediate' },
  { id: 'advanced', ko: '상급', en: 'Advanced' },
]
const REGIONS = [
  { id: 'capital', ko: '수도권', en: 'Capital' },
  { id: 'chungcheong', ko: '충청', en: 'Chungcheong' },
  { id: 'yeongnam', ko: '영남', en: 'Yeongnam' },
  { id: 'honam', ko: '호남', en: 'Honam' },
  { id: 'gangwon', ko: '강원', en: 'Gangwon' },
  { id: 'jeju', ko: '제주', en: 'Jeju' },
]
const GENDERS = [
  { id: 'male', ko: '남성', en: 'Male' },
  { id: 'female', ko: '여성', en: 'Female' },
  { id: 'none', ko: '비공개', en: 'Undisclosed' },
]

/* Focused single-field editor (opened when tapping an editable info row). */
function FieldEditor({ cfg, onDone }) {
  const { t, pick } = useLang()
  const [val, setVal] = useState(cfg.value)
  return (
    <SubPage title={t(cfg.label)} onBack={() => onDone(false)}>
      <div className="pe-field" style={{ marginTop: 10 }}>
        <label className="ob-label">{t(cfg.label)}</label>
        {cfg.type === 'chips' ? (
          <div className="ob-chip-wrap">
            {cfg.options.map((o) => (
              <button key={o.id} className={`ob-chip ${val === o.id ? 'active' : ''}`} onClick={() => setVal(o.id)}>
                {pick(o.ko, o.en)}
              </button>
            ))}
          </div>
        ) : (
          <input
            className="ob-input"
            value={val}
            onChange={(e) => setVal(cfg.format ? cfg.format(e.target.value) : e.target.value)}
            placeholder={cfg.ph ? t(cfg.ph) : undefined}
            maxLength={cfg.max || 40}
            inputMode={cfg.format ? 'numeric' : undefined}
            autoFocus
          />
        )}
      </div>
      <button className="ob-btn ob-btn-primary ob-btn-block" style={{ marginTop: 24 }} onClick={() => { cfg.set(val); onDone(true) }}>
        {t('peSave')}
      </button>
    </SubPage>
  )
}

/* Selectable avatar faces + pastel background swatches (Kakao-style picker). */
const AVATARS = AVATAR_IDS
const BG_COLORS = ['#F8C8D4', '#FAD9A8', '#F6EBA0', '#CDE9BE', '#C3D6FA', '#D9CDF3']

/* ── 프로필 편집 (swipeable avatar carousel + background picker) ─ */
export function AvatarPicker({ emoji, bg, name, onSave, onCancel }) {
  const { t } = useLang()
  // Slide 0 = default "your photo" text avatar (camera badge); slides 1+ = preset avatars.
  const SLIDES = ['default', ...AVATARS]
  const [idx, setIdx] = useState(emoji ? AVATARS.indexOf(emoji) + 1 : 0)
  const [color, setColor] = useState(bg || BG_COLORS[3])
  const railRef = useRef(null)
  const save = () => (idx === 0 ? onSave(null, null) : onSave(AVATARS[idx - 1], color))

  const centerOf = (el, slide) => slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2

  // center the initial avatar without animation
  useEffect(() => {
    const el = railRef.current
    if (el && el.children[idx]) el.scrollLeft = centerOf(el, el.children[idx])
  }, [])

  // pick the slide nearest the rail center as you swipe
  const onScroll = () => {
    const el = railRef.current
    if (!el) return
    const c = el.scrollLeft + el.clientWidth / 2
    let best = 0, bestD = Infinity
    Array.from(el.children).forEach((s, i) => {
      const d = Math.abs((s.offsetLeft + s.offsetWidth / 2) - c)
      if (d < bestD) { bestD = d; best = i }
    })
    if (best !== idx) setIdx(best)
  }

  const pick = (i) => {
    const el = railRef.current
    if (el && el.children[i]) el.scrollTo({ left: centerOf(el, el.children[i]), behavior: 'smooth' })
    setIdx(i)
  }

  return (
    <SubPage
      title={t('peAvatarTitle')}
      onBack={onCancel}
      footer={(
        <div className="ap-foot">
          <button className="ob-btn ob-btn-primary ob-btn-block" onClick={save}>
            {t('peComplete')}
          </button>
        </div>
      )}
    >
      <div className="ap-carousel" ref={railRef} onScroll={onScroll}>
        {SLIDES.map((a, i) => (
          <div
            key={a}
            className={`ap-slide ${i === idx ? 'active' : ''} ${i === 0 ? 'ap-slide-default' : ''}`}
            style={i === 0 ? undefined : { background: color }}
            onClick={() => pick(i)}
          >
            {i === 0
              ? <span className="ap-slide-initial">{name.trim().slice(0, 1) || '🙂'}</span>
              : <Avatar id={a} size={90} />}
            {i === idx && i === 0 && <span className="ap-cam"><Camera size={16} strokeWidth={2.2} /></span>}
          </div>
        ))}
      </div>

      <div className="ap-name">{name}<Pencil size={13} strokeWidth={2.2} /></div>

      <div className="ap-swatches">
        {BG_COLORS.map((c) => (
          <button
            key={c}
            className={`ap-swatch ${color === c ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label="background color"
          >
            {color === c && <Check size={18} strokeWidth={3} />}
          </button>
        ))}
      </div>

      <div className="ap-notice">
        <div className="ap-notice-title">{t('peNoticeTitle')}</div>
        <ul>
          <li>{t('peNotice1')}</li>
          <li>{t('peNotice2')}</li>
        </ul>
      </div>
    </SubPage>
  )
}

/* ── 내 정보 관리 (Kakao-style sectioned account page) ───────── */
export function ProfileEdit({ onBack }) {
  const { t, pick } = useLang()
  const [name, setName] = useState(pick(user.name, user.nameEn))
  const [skill, setSkill] = useState('mid')
  const [region, setRegion] = useState('capital')
  const [intro, setIntro] = useState(pick(account.introKo, account.introEn))
  const [phone, setPhone] = useState(account.phone)
  const [birth, setBirth] = useState('')
  const [gender, setGender] = useState('')
  const [avatar, setAvatar] = useState(null)        // chosen emoji (null → name initial)
  const [avatarBg, setAvatarBg] = useState(null)    // chosen bg color
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(false)
  const toastTimer = useRef()
  const flash = () => {
    setToast(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(false), 1800)
  }

  const EDITORS = {
    name: { label: 'peName', type: 'input', value: name, set: setName, max: 20 },
    phone: { label: 'pePhone', type: 'input', value: phone, set: setPhone, max: 13 },
    intro: { label: 'peIntro', type: 'input', value: intro, set: setIntro, max: 40 },
    skill: { label: 'peHcp', type: 'chips', options: HCP_BANDS, value: skill, set: setSkill },
    region: { label: 'peRegion', type: 'chips', options: REGIONS, value: region, set: setRegion },
    birth: { label: 'peBirth', type: 'input', value: birth, set: setBirth, max: 10, ph: 'birthPh', format: fmtBirth },
    gender: { label: 'peGender', type: 'chips', options: GENDERS, value: gender, set: setGender },
  }
  if (editing === 'avatar') {
    return (
      <AvatarPicker
        emoji={avatar}
        bg={avatarBg}
        name={name}
        onCancel={() => setEditing(null)}
        onSave={(em, color) => { setAvatar(em); setAvatarBg(color); setEditing(null); flash() }}
      />
    )
  }
  if (editing) {
    return <FieldEditor cfg={EDITORS[editing]} onDone={(saved) => { setEditing(null); if (saved) flash() }} />
  }

  const sk = HCP_BANDS.find((b) => b.id === skill)
  const rg = REGIONS.find((r) => r.id === region)
  const gd = GENDERS.find((g) => g.id === gender)
  const skillLabel = pick(sk.ko, sk.en)
  const regionLabel = pick(rg.ko, rg.en)
  const genderLabel = gd ? pick(gd.ko, gd.en) : ''

  return (
    <SubPage
      title={t('peTitle')}
      onBack={onBack}
      footer={toast && (
        <div className="app-toast" role="status"><Check size={15} strokeWidth={2.8} />{t('peSaved')}</div>
      )}
    >
      {/* avatar hero → opens 프로필 편집 picker */}
      <div className="pe2-hero">
        <div className="pe-avatar-wrap" style={{ margin: 0, cursor: 'pointer' }} onClick={() => setEditing('avatar')}>
          <span className="pe-avatar" style={avatarBg ? { background: avatarBg } : undefined}>
            {avatar ? <Avatar id={avatar} size={46} /> : (name.trim().slice(0, 1) || '🙂')}
          </span>
          <span className="pe-avatar-edit"><Pencil size={13} strokeWidth={2.4} /></span>
        </div>
        <div className="pe2-name">{name}</div>
      </div>

      {/* 기본정보 */}
      <div className="pe2-group-label">{t('peBasic')}</div>
      <div className="info-rows">
        <div className="info-row">
          <span className="info-k">{t('peMemberNo')}</span>
          <span className="info-v num">{account.memberNo}</span>
          <button className="info-action">{t('peCopy')}</button>
        </div>
        <div className="info-row" onClick={() => setEditing('phone')}>
          <span className="info-k">{t('pePhone')}</span>
          <span className="info-v num">{phone}</span>
          <span className="info-action blue">{t('peChange')}</span>
        </div>
        <div className="info-row">
          <span className="info-k">{t('peEmail')}</span>
          <span className="info-v">{account.email}</span>
        </div>
      </div>

      {/* 골프 프로필 */}
      <div className="pe2-group-label">{t('peGolf')}</div>
      <div className="info-rows">
        <div className="info-row" onClick={() => setEditing('name')}>
          <span className="info-k">{t('peName')}</span>
          <span className="info-v">{name}</span>
          <ChevronRight size={17} className="chev" />
        </div>
        <div className="info-row" onClick={() => setEditing('skill')}>
          <span className="info-k">{t('peHcp')}</span>
          <span className="info-v">{skillLabel}</span>
          <ChevronRight size={17} className="chev" />
        </div>
        <div className="info-row" onClick={() => setEditing('region')}>
          <span className="info-k">{t('peRegion')}</span>
          <span className="info-v">{regionLabel}</span>
          <ChevronRight size={17} className="chev" />
        </div>
        <div className="info-row" onClick={() => setEditing('intro')}>
          <span className="info-k">{t('peIntro')}</span>
          <span className="info-v">{intro}</span>
          <ChevronRight size={17} className="chev" />
        </div>
      </div>

      {/* 부가정보 */}
      <div className="pe2-group-label">{t('peExtra')}</div>
      <div className="info-rows">
        <div className="info-row" onClick={() => setEditing('birth')}>
          <span className="info-k">{t('peBirth')}</span>
          <span className={`info-v ${birth ? '' : 'muted'}`}>{birth || t('peEmpty')}</span>
          <ChevronRight size={17} className="chev" />
        </div>
        <div className="info-row" onClick={() => setEditing('gender')}>
          <span className="info-k">{t('peGender')}</span>
          <span className={`info-v ${genderLabel ? '' : 'muted'}`}>{genderLabel || t('peEmpty')}</span>
          <ChevronRight size={17} className="chev" />
        </div>
      </div>
    </SubPage>
  )
}

/* ── 포인트 ──────────────────────────────────────────────────── */
export function Points({ onBack }) {
  const { t, pick, lang } = useLang()
  return (
    <SubPage title={t('pPoints')} onBack={onBack}>
      <div className="sub-hero">
        <span className="sub-hero-label">{t('ptBalance')}</span>
        <span className="sub-hero-num num">{account.points.toLocaleString()}<em>{t('ptUnit')}</em></span>
      </div>
      <div className="section-head"><span className="s-title">{t('ptHistory')}</span></div>
      <div className="kv-list">
        {pointHistory.map((p) => (
          <div className="kv-row" key={p.id}>
            <div className="kv-main">
              <span className="kv-title">{pick(p.titleKo, p.titleEn)}</span>
              <span className="kv-sub num">{p.date}</span>
            </div>
            <span className={`kv-amt num ${p.amount > 0 ? 'plus' : ''}`}>
              {p.amount > 0 ? `+${p.amount}` : p.amount}{t('ptUnit')}
            </span>
          </div>
        ))}
      </div>
    </SubPage>
  )
}

/* ── 나의 배지 ───────────────────────────────────────────────── */
export function Badges({ onBack }) {
  const { t, pick } = useLang()
  const earned = badges.filter((b) => b.earned).length
  return (
    <SubPage title={t('mBadges')} onBack={onBack}>
      <div className="badge-count num">{t('bgEarned', { n: earned, total: badges.length })}</div>
      <div className="badge-grid">
        {badges.map((b) => (
          <div className={`badge-cell ${b.earned ? '' : 'locked'}`} key={b.id}>
            <span className="badge-emoji">{b.emoji}</span>
            <span className="badge-name">{pick(b.nameKo, b.nameEn)}</span>
            {!b.earned && <span className="badge-lock">{t('bgLocked')}</span>}
          </div>
        ))}
      </div>
    </SubPage>
  )
}

/* ── 등급 · 혜택 ─────────────────────────────────────────────── */
export function Membership({ onBack }) {
  const { t, pick } = useLang()
  const cur = account.tierLevel - 1                       // 0-indexed current tier
  const pct = (cur / (tiers.length - 1)) * 100
  const nextTier = tiers[Math.min(cur + 1, tiers.length - 1)]

  return (
    <SubPage title={t('tierTitle')} onBack={onBack}>
      <div className="tier-card">
        <div className="tier-top">
          <span className="tier-eyebrow">{t('tierEyebrow')}</span>
        </div>
        <div className="tier-cap">{t('tierCur')}</div>
        <div className="tier-name-row">
          <span className="tier-name">{pick(account.tierKo, account.tierEn)}</span>
          <span className="tier-name-en">{account.tierEn}</span>
        </div>
        <div className="tier-ladder">
          <span className="tier-ladder-line"><span className="tier-ladder-fill" style={{ width: `${pct}%` }} /></span>
          {tiers.map((tr, i) => (
            <div key={tr.id} className={`tier-step ${i < cur ? 'done' : ''} ${i === cur ? 'current' : ''}`}>
              <span className="tier-dot" />
              <span className="tier-step-lbl">{pick(tr.ko, tr.en)}</span>
            </div>
          ))}
        </div>
        <div className="tier-next num">{t('tierNextNamed', { tier: pick(nextTier.ko, nextTier.en), n: 4 })}</div>
      </div>

      <div className="section-head"><span className="s-title">{t('tierBenefitsTitle')}</span></div>
      <div className="benefit-list">
        {tierBenefits.map((b) => {
          const Icon = BENEFIT_ICON[b.icon] || Check
          return (
            <div className="benefit-row" key={b.id}>
              <span className="benefit-ico"><Icon size={19} strokeWidth={2} /></span>
              <div className="benefit-txt">
                <span className="benefit-title">{pick(b.ko, b.en)}</span>
                <span className="benefit-sub">{pick(b.subKo, b.subEn)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </SubPage>
  )
}

/* ── 요금제 (rate-plan picker) ───────────────────────────────── */
export function RatePlans({ onBack, currentId = subscription.planId, onPay }) {
  const { t, pick } = useLang()
  const [sel, setSel] = useState(currentId)
  const selPlan = subPlans.find((p) => p.id === sel)
  const isCurrent = sel === currentId

  return (
    <SubPage
      title={t('rpTitle')}
      onBack={onBack}
      footer={(
        <div className="ap-foot">
          <button
            className="ob-btn ob-btn-primary ob-btn-block"
            disabled={isCurrent}
            style={isCurrent ? { opacity: 0.5 } : undefined}
            onClick={() => onPay?.(sel)}
          >
            {isCurrent ? t('rpCurrentCta') : t('rpPayNamed', { plan: pick(selPlan.nameKo, selPlan.nameEn) })}
          </button>
        </div>
      )}
    >
      <p className="rp-lead">{t('rpSubtitle')}</p>
      <div className="plan-list">
        {subPlans.map((p) => {
          const active = sel === p.id
          const feats = pick(p.featsKo, p.featsEn)
          return (
            <button key={p.id} className={`plan-card ${active ? 'active' : ''}`} onClick={() => setSel(p.id)}>
              {p.suggested && <span className="plan-suggest">{t('rpSuggested')}</span>}
              <div className="plan-head">
                <div className="plan-head-txt">
                  <span className="plan-seg">{pick(p.segKo, p.segEn)}</span>
                  <span className="plan-name">{pick(p.nameKo, p.nameEn)}</span>
                </div>
                <span className={`plan-radio ${active ? 'on' : ''}`}>{active && <Check size={13} strokeWidth={3} />}</span>
              </div>
              <div className="plan-price num">
                {p.price === 0 ? t('rpFree') : <>{p.price.toLocaleString()}<em>{t('rpPerMonth')}</em></>}
              </div>
              <ul className="plan-feats">
                {feats.map((f) => (
                  <li key={f}><Check size={15} strokeWidth={2.6} className="plan-feat-ico" />{f}</li>
                ))}
              </ul>
              {p.id === currentId && <span className="plan-current">{t('rpInUse')}</span>}
            </button>
          )
        })}
      </div>
    </SubPage>
  )
}

/* A single receipt, reached by tapping a row in the receipt list. */
function SubReceiptDetail({ item, onBack }) {
  const { t, pick, lang } = useLang()
  const total = item.amount
  const supply = Math.round(total / 1.1)
  const vat = total - supply
  const receiptNo = `SS-${item.date.replace(/-/g, '')}-${subscription.cardTail}`
  const itemName = pick(item.planKo, item.planEn)
  const method = `${pick(subscription.cardKo, subscription.cardEn)} ·· ${subscription.cardTail}`
  const rows = [
    { k: t('srItem'), v: itemName },
    { k: t('srDate'), v: item.date, num: true },
    { k: t('srMethod'), v: method },
    { k: t('srNo'), v: receiptNo, num: true },
  ]

  // Build a printable HTML receipt and download it as a file.
  const download = () => {
    const row = (k, v, strong) => `<tr><td>${k}</td><td style="text-align:right${strong ? ';font-weight:700;color:#0A7A37' : ''}">${v}</td></tr>`
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${t('srTitle')} ${receiptNo}</title>
<style>body{font-family:-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;max-width:420px;margin:32px auto;padding:0 20px;color:#1A1D21}
h1{font-size:18px;margin:0 0 4px}.sub{color:#6B7077;font-size:13px;margin:0 0 20px}
.amt{font-size:26px;font-weight:800;letter-spacing:-1px;margin:18px 0 6px}.paid{display:inline-block;font-size:12px;font-weight:700;color:#0A7A37;background:#E5F4EA;padding:3px 10px;border-radius:999px}
table{width:100%;border-collapse:collapse;margin-top:20px}td{padding:9px 0;font-size:14px;border-bottom:1px solid #EFEFEF}td:first-child{color:#6B7077}
.tot td{border-top:2px solid #1A1D21;border-bottom:none;padding-top:12px;font-weight:700}</style></head>
<body><h1>ScoreShot ${t('srTitle')}</h1><p class="sub">${receiptNo}</p>
<div class="amt">${money(total, lang)}</div><span class="paid">${t('srPaidStatus')}</span>
<table><tr><td>${t('srItem')}</td><td style="text-align:right">${itemName}</td></tr>
${row(t('srDate'), item.date)}${row(t('srMethod'), method)}${row(t('srNo'), receiptNo)}
${row(t('srSupply'), money(supply, lang))}${row(t('srVat'), money(vat, lang))}
<tr class="tot"><td>${t('srTotal')}</td><td style="text-align:right;color:#0A7A37">${money(total, lang)}</td></tr></table>
</body></html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${receiptNo}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <SubPage
      title={t('srTitle')}
      onBack={onBack}
      footer={(
        <div className="ap-foot">
          <button className="ob-btn ob-btn-primary ob-btn-block" onClick={download}>
            <Download size={17} strokeWidth={2.2} style={{ marginRight: 6, verticalAlign: '-3px' }} />{t('srDownload')}
          </button>
        </div>
      )}
    >
      <div className="sub-hero sr-hero">
        <span className="sub-hero-label">{t('srTotal')}</span>
        <span className="sub-hero-num num">{money(total, lang)}</span>
        <span className="badge badge-role" style={{ marginTop: 12, display: 'inline-flex' }}>{t('srPaidStatus')}</span>
      </div>
      <div className="info-rows" style={{ marginTop: 14 }}>
        {rows.map((r) => (
          <div className="info-row" key={r.k}>
            <span className="info-k">{r.k}</span>
            <span className={`info-v ${r.num ? 'num' : ''}`}>{r.v}</span>
          </div>
        ))}
      </div>
      <div className="kv-list" style={{ marginTop: 14 }}>
        <div className="kv-row"><div className="kv-main"><span className="kv-title">{t('srSupply')}</span></div><span className="kv-amt num">{money(supply, lang)}</span></div>
        <div className="kv-row"><div className="kv-main"><span className="kv-title">{t('srVat')}</span></div><span className="kv-amt num">{money(vat, lang)}</span></div>
        <div className="kv-row sr-total"><div className="kv-main"><span className="kv-title">{t('srTotal')}</span></div><span className="kv-amt num">{money(total, lang)}</span></div>
      </div>
    </SubPage>
  )
}

/* Read-only receipt list reached from 결제 내역 · 영수증. */
function SubReceipts({ onBack }) {
  const { t, pick, lang } = useLang()
  const [sel, setSel] = useState(null)
  if (sel) return <SubReceiptDetail item={sel} onBack={() => setSel(null)} />
  return (
    <SubPage title={t('subReceiptTitle')} onBack={onBack}>
      <p className="rp-lead">{t('subReceiptNote')}</p>
      <div className="list">
        {subHistory.map((h) => (
          <div className="list-row" key={h.id} style={{ cursor: 'pointer' }} onClick={() => setSel(h)}>
            <Receipt size={18} strokeWidth={1.8} className="lr-ico" />
            <div className="sub-act-txt">
              <span className="lr-label">{pick(h.planKo, h.planEn)}</span>
              <span className="sub-act-sub num">{h.date} · {money(h.amount, lang)}</span>
            </div>
            <span className="lr-value accent">{t('subReceiptOne')}</span>
            <ChevronRight size={17} className="chev" />
          </div>
        ))}
      </div>
    </SubPage>
  )
}

/* ── 구독 관리 (subscription management) ─────────────────────── */
export function Subscription({ onBack }) {
  const { t, pick, lang } = useLang()
  const [planId, setPlanId] = useState(subscription.planId)
  const [card, setCard] = useState(subscription.cardTail)
  const [view, setView] = useState(null)          // 'plans' | 'pay' | 'receipt'
  const [confirm, setConfirm] = useState(false)    // cancel dialog
  const [ending, setEnding] = useState(false)      // subscription set to end
  const [toast, setToast] = useState(false)
  const toastTimer = useRef()
  const flash = () => { setToast(true); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(false), 1800) }
  const plan = subPlans.find((p) => p.id === planId)

  if (view === 'plans') {
    return <RatePlans onBack={() => setView(null)} currentId={planId} onPay={(id) => { setPlanId(id); setEnding(false); setView(null) }} />
  }
  if (view === 'pay') {
    return (
      <AddPaymentMethod
        onBack={() => setView(null)}
        onAdd={(m) => { if (m.tail) setCard(m.tail); setView(null); flash() }}
      />
    )
  }
  if (view === 'receipt') return <SubReceipts onBack={() => setView(null)} />

  const ACTIONS = [
    { id: 'plan', Icon: RefreshCw, label: t('subPlanChange'), sub: t('subPlanChangeSub'), onClick: () => setView('plans') },
    { id: 'pay', Icon: CreditCard, label: t('subPayMethod'), onClick: () => setView('pay') },
    { id: 'receipt', Icon: Receipt, label: t('subReceipt'), onClick: () => setView('receipt') },
  ]

  return (
    <SubPage
      title={t('subTitle')}
      onBack={onBack}
      footer={toast && (<div className="app-toast" role="status"><Check size={15} strokeWidth={2.8} />{t('subCardChanged')}</div>)}
    >
      {/* current plan hero */}
      <div className={`tier-card sub-card ${ending ? 'is-ending' : ''}`}>
        <div className="tier-top">
          <span className="sub-card-eyebrow"><Crown size={14} strokeWidth={2.4} />{pick(plan.nameKo, plan.nameEn)}</span>
          <span className="sub-pill">{ending ? t('subEndingPill') : t('subInUse')}</span>
        </div>
        <div className="sub-card-price num">
          {plan.price === 0 ? t('rpFree') : <>{plan.price.toLocaleString()}<em>{t('subPerMonth')}</em></>}
        </div>
        <div className="sub-card-meta num">
          {ending ? t('subEndingNote', { date: subscription.nextDate }) : t('subNext', { date: subscription.nextDate, tail: card })}
        </div>
      </div>

      {/* manage actions */}
      <div className="list" style={{ marginTop: 14 }}>
        {ACTIONS.map((a) => (
          <div className="list-row" key={a.id} onClick={a.onClick} style={{ cursor: 'pointer' }}>
            <a.Icon size={18} strokeWidth={1.8} className="lr-ico" />
            <div className="sub-act-txt">
              <span className="lr-label">{a.label}</span>
              {a.sub && <span className="sub-act-sub">{a.sub}</span>}
            </div>
            <ChevronRight size={17} className="chev" />
          </div>
        ))}
      </div>

      {/* billing history */}
      <div className="section-head"><span className="s-title">{t('subHistoryTitle')}</span></div>
      <div className="kv-list">
        {subHistory.map((h) => (
          <div className="kv-row" key={h.id}>
            <div className="kv-main">
              <span className="kv-title">{pick(h.planKo, h.planEn)}</span>
              <span className="kv-sub num">{h.date}</span>
            </div>
            <span className="kv-amt num">{money(h.amount, lang)}</span>
          </div>
        ))}
      </div>

      {!ending && <button className="sub-cancel" onClick={() => setConfirm(true)}>{t('subCancel')}</button>}

      {confirm && (
        <>
          <div className="dialog-scrim" onClick={() => setConfirm(false)} />
          <div className="dialog">
            <div className="dialog-title">{t('subCancelTitle')}</div>
            <div className="dialog-body">{t('subCancelBody')}</div>
            <div className="dialog-actions">
              <Button variant="secondary" onClick={() => setConfirm(false)}>{t('subKeep')}</Button>
              <Button variant="danger" onClick={() => { setConfirm(false); setEnding(true) }}>{t('subCancelDo')}</Button>
            </div>
          </div>
        </>
      )}
    </SubPage>
  )
}

/* 결제 수단 추가 — choose a type, register a card */
const PAY_TYPES = [
  { id: 'card', label: 'payTypeCard', Icon: CreditCard },
  { id: 'pay', label: 'payTypePay', Icon: MessageCircle },
  { id: 'bank', label: 'payTypeBank', Icon: Banknote },
]
const BANKS = [
  { id: 'shinhan', ko: '신한', en: 'Shinhan' },
  { id: 'kb', ko: '국민', en: 'KB' },
  { id: 'woori', ko: '우리', en: 'Woori' },
  { id: 'hana', ko: '하나', en: 'Hana' },
  { id: 'nh', ko: '농협', en: 'NH' },
  { id: 'kakao', ko: '카카오뱅크', en: 'KakaoBank' },
  { id: 'toss', ko: '토스뱅크', en: 'Toss' },
]
function AddPaymentMethod({ onBack, onAdd }) {
  const { t, pick } = useLang()
  const [type, setType] = useState('card')
  const [num, setNum] = useState('')
  const [exp, setExp] = useState('')
  const [bank, setBank] = useState(null)
  const [acct, setAcct] = useState('')

  const make = () => {
    const id = `pm-${num.slice(-4) || acct.slice(-4) || type}-${num.length + exp.length + acct.length}`
    if (type === 'pay') return { id, kind: 'pay', nameKo: '카카오페이', nameEn: 'KakaoPay', tail: '', primary: false }
    if (type === 'bank') {
      const b = BANKS.find((x) => x.id === bank)
      return { id, kind: 'bank', nameKo: `${b.ko}은행`, nameEn: `${b.en} Bank`, tail: acct.slice(-4), primary: false }
    }
    return { id, kind: 'card', nameKo: t('payNewCard'), nameEn: 'New card', tail: num.replace(/\D/g, '').slice(-4) || '0000', primary: false }
  }
  const valid =
    type === 'card' ? num.replace(/\D/g, '').length >= 8 :
    type === 'bank' ? (bank && acct.length >= 6) :
    true

  return (
    <SubPage
      title={t('payAddTitle')}
      onBack={onBack}
      footer={(
        <div className="ap-foot">
          <button className="ob-btn ob-btn-primary ob-btn-block" disabled={!valid} style={!valid ? { opacity: 0.5 } : undefined} onClick={() => onAdd(make())}>
            {t('payRegister')}
          </button>
        </div>
      )}
    >
      <div className="pe-field" style={{ marginTop: 8 }}>
        <div className="ob-chip-wrap">
          {PAY_TYPES.map((p) => (
            <button key={p.id} className={`ob-chip ${type === p.id ? 'active' : ''}`} onClick={() => setType(p.id)}>
              <p.Icon size={14} strokeWidth={2} />{t(p.label)}
            </button>
          ))}
        </div>
      </div>

      {type === 'card' && (
        <>
          <div className="pe-field">
            <label className="ob-label">{t('payCardNo')}</label>
            <input
              className="ob-input num"
              value={num}
              onChange={(e) => setNum(e.target.value.replace(/[^\d ]/g, '').slice(0, 19))}
              placeholder={t('payCardNoPh')}
              inputMode="numeric"
            />
          </div>
          <div className="pe-field">
            <label className="ob-label">{t('payExpiry')}</label>
            <input
              className="ob-input num"
              value={exp}
              onChange={(e) => setExp(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
              placeholder={t('payExpiryPh')}
              inputMode="numeric"
            />
          </div>
        </>
      )}

      {type === 'bank' && (
        <>
          <div className="pe-field">
            <label className="ob-label">{t('payBankPick')}</label>
            <div className="ob-chip-wrap">
              {BANKS.map((b) => (
                <button key={b.id} className={`ob-chip ${bank === b.id ? 'active' : ''}`} onClick={() => setBank(b.id)}>
                  {pick(b.ko, b.en)}
                </button>
              ))}
            </div>
          </div>
          <div className="pe-field">
            <label className="ob-label">{t('payAcctNo')}</label>
            <input
              className="ob-input num"
              value={acct}
              onChange={(e) => setAcct(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder={t('payAcctPh')}
              inputMode="numeric"
            />
          </div>
        </>
      )}

      {type === 'pay' && (
        <div className="pay-note">
          <span className="pay-note-ico"><MessageCircle size={20} strokeWidth={2} /></span>
          <div className="pay-note-txt">
            <span className="pay-note-title">{t('payPayNoteTitle')}</span>
            <span className="pay-note-sub">{t('payPayNote')}</span>
          </div>
        </div>
      )}
    </SubPage>
  )
}

/* ── 결제 · 정산 ─────────────────────────────────────────────── */
export function Payments({ onBack }) {
  const { t, pick, lang } = useLang()
  const [methods, setMethods] = useState(() => paymentMethods.map((m) => ({ ...m })))
  const [edit, setEdit] = useState(false)
  const [adding, setAdding] = useState(false)

  if (adding) {
    return (
      <AddPaymentMethod
        onBack={() => setAdding(false)}
        onAdd={(m) => { setMethods((ms) => [...ms, m]); setAdding(false) }}
      />
    )
  }
  const remove = (id) => setMethods((ms) => {
    const next = ms.filter((m) => m.id !== id)
    if (next.length && !next.some((m) => m.primary)) next[0].primary = true   // keep a default
    if (next.length <= 1) setEdit(false)
    return next
  })

  return (
    <SubPage title={t('mPay')} onBack={onBack}>
      <div className="section-head">
        <span className="s-title">{t('payMethods')}</span>
        {methods.length > 0 && (
          <button className="se-edit" onClick={() => setEdit((v) => !v)}>{edit ? t('payDone') : t('payEdit')}</button>
        )}
      </div>
      <div className="list">
        {methods.map((m) => (
          <div className="list-row" key={m.id}>
            {edit && (
              <button className="pm-del" onClick={() => remove(m.id)} aria-label="remove"><Minus size={14} strokeWidth={3} /></button>
            )}
            <CreditCard size={18} strokeWidth={1.8} className="lr-ico" />
            <span className="lr-label">{pick(m.nameKo, m.nameEn)}{m.tail ? ` ·· ${m.tail}` : ''}</span>
            {!edit && m.primary && <span className="badge badge-role">{t('payPrimary')}</span>}
          </div>
        ))}
        {!edit && (
          <div className="list-row" style={{ cursor: 'pointer' }} onClick={() => setAdding(true)}>
            <Plus size={18} strokeWidth={2} className="lr-ico accent" />
            <span className="lr-label" style={{ color: 'var(--brand)', fontWeight: 700 }}>{t('payAdd')}</span>
          </div>
        )}
      </div>

      <div className="section-head"><span className="s-title">{t('payHistory')}</span></div>
      <div className="kv-list">
        {paymentHistory.map((p) => (
          <div className="kv-row" key={p.id}>
            <div className="kv-main">
              <span className="kv-title">{pick(p.titleKo, p.titleEn)}</span>
              <span className="kv-sub num">{p.date} · {pick(p.methodKo, p.methodEn)}</span>
            </div>
            <span className={`kv-amt num ${p.amount > 0 ? 'plus' : ''}`}>{money(p.amount, lang)}</span>
          </div>
        ))}
      </div>
    </SubPage>
  )
}

/* ── 알림 설정 ───────────────────────────────────────────────── */
export function NotificationSettings({ onBack }) {
  const { t, pick } = useLang()
  const [push, setPush] = useState(true)
  const [prefs, setPrefs] = useState(() => notiPrefs.map((p) => ({ ...p })))
  const toggle = (id) => setPrefs((ps) => ps.map((p) => (p.id === id ? { ...p, on: !p.on } : p)))

  return (
    <SubPage title={t('mNoti')} onBack={onBack}>
      <div className="list" style={{ marginTop: 6 }}>
        <div className="list-row">
          <span className="lr-label" style={{ fontWeight: 700 }}>{t('nsPush')}</span>
          <Switch on={push} onClick={() => setPush((v) => !v)} />
        </div>
      </div>
      <div className="section-head"><span className="s-title">{t('nsCategories')}</span></div>
      <div className={`list ${push ? '' : 'list-disabled'}`}>
        {prefs.map((p) => (
          <div className="list-row" key={p.id}>
            <span className="lr-label">{pick(p.labelKo, p.labelEn)}</span>
            <Switch on={push && p.on} onClick={() => push && toggle(p.id)} />
          </div>
        ))}
      </div>
    </SubPage>
  )
}

/* ── 언어 설정 ───────────────────────────────────────────────── */
export function LanguageSettings({ onBack }) {
  const { t, lang, setLang } = useLang()
  const OPTS = [{ id: 'ko', label: t('lsKo') }, { id: 'en', label: t('lsEn') }]
  return (
    <SubPage title={t('lsTitle')} onBack={onBack}>
      <div className="list" style={{ marginTop: 6 }}>
        {OPTS.map((o) => (
          <div className="list-row" key={o.id} onClick={() => setLang(o.id)} style={{ cursor: 'pointer' }}>
            <span className="lr-label">{o.label}</span>
            {lang === o.id && <Check size={19} strokeWidth={2.6} className="lr-ico accent" style={{ marginRight: 0 }} />}
          </div>
        ))}
      </div>
    </SubPage>
  )
}

/* ── 고객센터 ────────────────────────────────────────────────── */
export function CustomerCenter({ onBack }) {
  const { t, pick } = useLang()
  return (
    <SubPage title={t('mHelp')} onBack={onBack}>
      <div className="help-actions">
        <button className="help-action">
          <MessageSquareText size={20} strokeWidth={1.9} />
          <span>{t('helpContact')}</span>
        </button>
        <button className="help-action">
          <Phone size={20} strokeWidth={1.9} />
          <span>{t('helpCall')}</span>
        </button>
      </div>
      <div className="section-head"><span className="s-title">{t('helpFaq')}</span></div>
      <div className="list">
        {faqs.map((f) => (
          <div className="list-row" key={f.id}>
            <Headphones size={17} strokeWidth={1.8} className="lr-ico" />
            <span className="lr-label">{pick(f.qKo, f.qEn)}</span>
            <ChevronRight size={17} className="chev" />
          </div>
        ))}
      </div>
    </SubPage>
  )
}

/* ── 약관 및 정책 ────────────────────────────────────────────── */
export function Terms({ onBack }) {
  const { t, pick } = useLang()
  return (
    <SubPage title={t('mTerms')} onBack={onBack}>
      <div className="list" style={{ marginTop: 6 }}>
        {policies.map((p) => (
          <div className="list-row" key={p.id}>
            <FileText size={17} strokeWidth={1.8} className="lr-ico" />
            <span className="lr-label">{pick(p.ko, p.en)}</span>
            <ChevronRight size={17} className="chev" />
          </div>
        ))}
      </div>
      <div className="list" style={{ marginTop: 12 }}>
        <div className="list-row">
          <Star size={17} strokeWidth={1.8} className="lr-ico" />
          <span className="lr-label">{t('mVersion')}</span>
          <span className="lr-value num">1.0.0</span>
        </div>
      </div>
    </SubPage>
  )
}
