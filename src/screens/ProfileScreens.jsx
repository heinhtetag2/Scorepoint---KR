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
<body><h1>LABEON ${t('srTitle')}</h1><p class="sub">${receiptNo}</p>
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

/* ── Policy detail shared shell ─────────────────────────────── */
function PolicyDoc({ title, onBack, children }) {
  return (
    <SubPage title={title} onBack={onBack}>
      <div style={{ padding: '4px 0 32px' }}>{children}</div>
    </SubPage>
  )
}

function PolicySection({ heading, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {heading && (
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6, letterSpacing: -0.2 }}>
          {heading}
        </p>
      )}
      <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--text-2)', letterSpacing: -0.1 }}>
        {children}
      </p>
    </div>
  )
}

function PolicyItem({ n, children }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
      <span style={{ fontSize: 13, color: 'var(--text-3)', flexShrink: 0, minWidth: 20 }}>{n}.</span>
      <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--text-2)', margin: 0 }}>{children}</p>
    </div>
  )
}

function PolicyDate({ ko, en }) {
  const { lang } = useLang()
  return (
    <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>
      {lang === 'ko' ? ko : en}
    </p>
  )
}

/* ── Terms of Service ───────────────────────────────────────── */
function TermsOfService({ onBack }) {
  const { lang } = useLang()
  const isKo = lang === 'ko'
  return (
    <PolicyDoc title={isKo ? '서비스 이용약관' : 'Terms of Service'} onBack={onBack}>
      <PolicyDate ko="시행일: 2025년 1월 1일" en="Effective: January 1, 2025" />
      <PolicySection heading={isKo ? '제1조 (목적)' : 'Article 1 — Purpose'}>
        {isKo
          ? '이 약관은 LABEON(이하 "서비스")이 제공하는 골프 스코어 기록, 이벤트 관리, 클럽 운영 서비스의 이용에 관한 기본적인 사항을 규정함을 목적으로 합니다.'
          : 'These Terms govern your use of LABEON ("Service"), including golf score tracking, event management, and club administration features provided by LABEON Inc.'}
      </PolicySection>
      <PolicySection heading={isKo ? '제2조 (정의)' : 'Article 2 — Definitions'}>
        {isKo ? (
          <>
            <PolicyItem n="①">"서비스"란 LABEON이 제공하는 모든 앱, 웹, API 기반 서비스를 말합니다.</PolicyItem>
            <PolicyItem n="②">"회원"이란 이 약관에 동의하고 서비스를 이용하는 자를 말합니다.</PolicyItem>
            <PolicyItem n="③">"콘텐츠"란 회원이 서비스 내에 게시·등록한 점수, 사진, 텍스트 등 모든 정보를 의미합니다.</PolicyItem>
          </>
        ) : (
          <>
            <PolicyItem n="1">"Service" means all apps, APIs, and web interfaces operated by LABEON Inc.</PolicyItem>
            <PolicyItem n="2">"Member" means any person who agrees to these Terms and uses the Service.</PolicyItem>
            <PolicyItem n="3">"Content" means scores, photos, text, and any other material posted by Members.</PolicyItem>
          </>
        )}
      </PolicySection>
      <PolicySection heading={isKo ? '제3조 (서비스 이용)' : 'Article 3 — Service Use'}>
        {isKo
          ? '회원은 서비스를 이용함에 있어 법령, 이 약관, 서비스 정책을 준수해야 합니다. 타인의 권리를 침해하거나 서비스의 정상적인 운영을 방해하는 행위는 금지됩니다.'
          : 'Members must comply with applicable laws, these Terms, and our policies. Acts that infringe others\' rights or disrupt the normal operation of the Service are prohibited.'}
      </PolicySection>
      <PolicySection heading={isKo ? '제4조 (회원의 의무)' : 'Article 4 — Member Obligations'}>
        {isKo ? (
          <>
            <PolicyItem n="①">타인의 개인정보를 무단으로 수집·사용하지 않을 것</PolicyItem>
            <PolicyItem n="②">허위 정보를 등록하거나 타인을 사칭하지 않을 것</PolicyItem>
            <PolicyItem n="③">서비스에 악성코드를 배포하거나 해킹을 시도하지 않을 것</PolicyItem>
            <PolicyItem n="④">상업적 목적의 광고나 스팸을 게시하지 않을 것</PolicyItem>
          </>
        ) : (
          <>
            <PolicyItem n="1">Do not collect or use others' personal information without consent.</PolicyItem>
            <PolicyItem n="2">Do not register false information or impersonate others.</PolicyItem>
            <PolicyItem n="3">Do not distribute malware or attempt unauthorized access.</PolicyItem>
            <PolicyItem n="4">Do not post commercial advertisements or spam.</PolicyItem>
          </>
        )}
      </PolicySection>
      <PolicySection heading={isKo ? '제5조 (서비스 변경 및 중단)' : 'Article 5 — Changes & Suspension'}>
        {isKo
          ? 'LABEON은 운영상 또는 기술상의 필요에 따라 서비스의 전부 또는 일부를 변경하거나 일시 중단할 수 있으며, 이에 대해 회원에게 사전 고지합니다. 단, 긴급한 경우 사후 고지할 수 있습니다.'
          : 'LABEON may modify or temporarily suspend the Service for operational or technical reasons, with prior notice to Members. In urgent cases, notice may be given after the fact.'}
      </PolicySection>
      <PolicySection heading={isKo ? '제6조 (책임의 한계)' : 'Article 6 — Limitation of Liability'}>
        {isKo
          ? 'LABEON은 천재지변, 불가항력, 서비스 점검 등 회사의 귀책사유가 없는 경우로 인한 서비스 중단에 대해 책임을 지지 않습니다. 회원이 서비스를 통해 얻은 정보로 인해 발생한 손해에 대해서도 회사는 책임을 부담하지 않습니다.'
          : 'LABEON is not liable for service interruptions caused by force majeure, scheduled maintenance, or circumstances beyond its control. LABEON is not responsible for damages arising from information obtained through the Service.'}
      </PolicySection>
      <PolicySection heading={isKo ? '제7조 (준거법 및 관할)' : 'Article 7 — Governing Law'}>
        {isKo
          ? '이 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련된 분쟁은 서울중앙지방법원을 제1심 전속 관할법원으로 합니다.'
          : 'These Terms are governed by the laws of the Republic of Korea. Disputes relating to the Service shall be subject to the exclusive jurisdiction of the Seoul Central District Court.'}
      </PolicySection>
    </PolicyDoc>
  )
}

/* ── Privacy Policy ─────────────────────────────────────────── */
function PrivacyPolicy({ onBack }) {
  const { lang } = useLang()
  const isKo = lang === 'ko'
  return (
    <PolicyDoc title={isKo ? '개인정보 처리방침' : 'Privacy Policy'} onBack={onBack}>
      <PolicyDate ko="시행일: 2025년 1월 1일" en="Effective: January 1, 2025" />
      <PolicySection heading={isKo ? '수집하는 개인정보 항목' : 'Information We Collect'}>
        {isKo
          ? 'LABEON은 서비스 제공을 위해 다음 정보를 수집합니다: 이름, 이메일 주소, 전화번호, 프로필 사진, 골프 스코어 및 라운드 기록, 클럽 활동 정보, 기기 정보(OS, 기기 모델, 앱 버전), 서비스 이용 기록(접속 일시, IP 주소).'
          : 'LABEON collects: name, email address, phone number, profile photo, golf scores and round history, club activity, device information (OS, model, app version), and service usage logs (access time, IP address).'}
      </PolicySection>
      <PolicySection heading={isKo ? '개인정보 수집 및 이용 목적' : 'Why We Collect It'}>
        {isKo ? (
          <>
            <PolicyItem n="①">회원 가입 및 본인 확인</PolicyItem>
            <PolicyItem n="②">골프 스코어 기록 및 통계 제공</PolicyItem>
            <PolicyItem n="③">이벤트·클럽 서비스 운영</PolicyItem>
            <PolicyItem n="④">고객 문의 응대 및 공지사항 전달</PolicyItem>
            <PolicyItem n="⑤">서비스 개선 및 신규 서비스 개발</PolicyItem>
          </>
        ) : (
          <>
            <PolicyItem n="1">Member registration and identity verification</PolicyItem>
            <PolicyItem n="2">Golf score recording and statistics</PolicyItem>
            <PolicyItem n="3">Event and club service operation</PolicyItem>
            <PolicyItem n="4">Customer support and notifications</PolicyItem>
            <PolicyItem n="5">Service improvement and new feature development</PolicyItem>
          </>
        )}
      </PolicySection>
      <PolicySection heading={isKo ? '개인정보 보유 및 이용 기간' : 'Retention Period'}>
        {isKo
          ? '회원 탈퇴 시까지 보유합니다. 단, 관계 법령에 의해 보존 의무가 있는 경우에는 해당 기간 동안 보관합니다. 전자상거래 관련 기록은 5년, 접속 로그는 3개월 보관됩니다.'
          : 'Data is retained until account deletion. Records required by law are kept for the applicable period: e-commerce records for 5 years, access logs for 3 months.'}
      </PolicySection>
      <PolicySection heading={isKo ? '개인정보 제3자 제공' : 'Third-Party Sharing'}>
        {isKo
          ? 'LABEON은 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 다만, 회원의 사전 동의가 있거나 법령에 근거한 경우에는 예외로 합니다.'
          : 'LABEON does not share personal information with third parties without consent, except as required by law or with prior member agreement.'}
      </PolicySection>
      <PolicySection heading={isKo ? '개인정보 처리 위탁' : 'Processing Entrusted to Third Parties'}>
        {isKo
          ? 'LABEON은 서비스 운영을 위해 일부 업무를 외부 전문업체에 위탁합니다: Amazon Web Services (서버 호스팅 및 데이터 저장), Google Firebase (푸시 알림), Sentry (오류 추적).'
          : 'LABEON entrusts certain operations to third parties: Amazon Web Services (hosting & storage), Google Firebase (push notifications), Sentry (error tracking).'}
      </PolicySection>
      <PolicySection heading={isKo ? '회원의 권리' : 'Your Rights'}>
        {isKo
          ? '회원은 언제든지 본인의 개인정보를 조회·수정할 수 있으며, 수집·이용에 대한 동의를 철회할 수 있습니다. 개인정보 삭제 요청은 앱 내 설정 > 계정 > 회원 탈퇴를 통해 진행하거나 고객센터로 문의하시기 바랍니다.'
          : 'Members may view, edit, or withdraw consent for their personal information at any time. To request deletion, use Settings → Account → Delete Account, or contact our support team.'}
      </PolicySection>
      <PolicySection heading={isKo ? '개인정보 보호 책임자' : 'Privacy Officer'}>
        {isKo
          ? '개인정보 처리방침에 관한 문의는 아래로 연락하시기 바랍니다.\n이름: 김도현 / 직책: 개인정보 보호 책임자\n이메일: privacy@labeon.kr'
          : 'For privacy inquiries, contact us at:\nName: Dohyun Kim / Title: Privacy Officer\nEmail: privacy@labeon.kr'}
      </PolicySection>
    </PolicyDoc>
  )
}

/* ── Location Service Terms ─────────────────────────────────── */
function LocationTerms({ onBack }) {
  const { lang } = useLang()
  const isKo = lang === 'ko'
  return (
    <PolicyDoc title={isKo ? '위치기반 서비스 약관' : 'Location Service Terms'} onBack={onBack}>
      <PolicyDate ko="시행일: 2025년 1월 1일" en="Effective: January 1, 2025" />
      <PolicySection heading={isKo ? '위치기반 서비스 개요' : 'Overview'}>
        {isKo
          ? 'LABEON은 위치정보의 보호 및 이용 등에 관한 법률에 따라 회원의 위치 정보를 수집·이용합니다. 이 약관은 위치기반 서비스 이용에 관한 사항을 규정합니다.'
          : 'LABEON collects and uses location data in accordance with applicable law. These Terms govern the use of location-based services within the app.'}
      </PolicySection>
      <PolicySection heading={isKo ? '수집하는 위치 정보' : 'Location Data Collected'}>
        {isKo ? (
          <>
            <PolicyItem n="①">GPS 기반 현재 위치 (위도·경도)</PolicyItem>
            <PolicyItem n="②">골프 라운드 경로 및 이동 거리</PolicyItem>
            <PolicyItem n="③">가까운 골프 클럽 및 코스 감지</PolicyItem>
          </>
        ) : (
          <>
            <PolicyItem n="1">GPS-based current location (latitude & longitude)</PolicyItem>
            <PolicyItem n="2">Round route and distance tracking</PolicyItem>
            <PolicyItem n="3">Nearby golf club and course detection</PolicyItem>
          </>
        )}
      </PolicySection>
      <PolicySection heading={isKo ? '위치 정보 이용 목적' : 'Purpose of Use'}>
        {isKo ? (
          <>
            <PolicyItem n="①">주변 골프장 및 클럽 검색 및 추천</PolicyItem>
            <PolicyItem n="②">라운드 중 홀별 거리 및 코스 가이드 제공</PolicyItem>
            <PolicyItem n="③">스코어 자동 등록 시 위치 기반 코스 인식</PolicyItem>
            <PolicyItem n="④">이벤트 장소 확인 및 경로 안내</PolicyItem>
          </>
        ) : (
          <>
            <PolicyItem n="1">Search and recommend nearby golf courses</PolicyItem>
            <PolicyItem n="2">Hole distance and course guidance during rounds</PolicyItem>
            <PolicyItem n="3">Location-based course recognition for automatic score logging</PolicyItem>
            <PolicyItem n="4">Event venue confirmation and directions</PolicyItem>
          </>
        )}
      </PolicySection>
      <PolicySection heading={isKo ? '위치 정보 보유 기간' : 'Retention Period'}>
        {isKo
          ? '위치 정보는 서비스 제공 목적 달성 후 즉시 파기하는 것을 원칙으로 합니다. 단, 라운드 기록에 포함된 위치 데이터는 회원 요청 시까지 보관됩니다.'
          : 'Location data is deleted immediately after the purpose is fulfilled. Location data embedded in round records is retained until the member requests deletion.'}
      </PolicySection>
      <PolicySection heading={isKo ? '위치 정보 제3자 제공' : 'Third-Party Sharing'}>
        {isKo
          ? '회원의 위치 정보는 원칙적으로 제3자에게 제공되지 않습니다. 단, 회원의 동의가 있거나 법령에 근거한 경우에는 예외로 합니다.'
          : 'Location data is not shared with third parties without consent, except as required by law.'}
      </PolicySection>
      <PolicySection heading={isKo ? '위치 서비스 동의 철회' : 'Withdrawing Consent'}>
        {isKo
          ? '회원은 언제든지 기기 설정에서 위치 권한을 거부하거나 앱 내 설정에서 위치 서비스 사용을 비활성화할 수 있습니다. 위치 서비스를 비활성화하면 일부 기능이 제한될 수 있습니다.'
          : 'Members may revoke location permissions at any time in device settings or disable location services within the app. Some features may be limited without location access.'}
      </PolicySection>
    </PolicyDoc>
  )
}

/* ── Open-source Licenses ───────────────────────────────────── */
const OSS_LIST = [
  { name: 'React', version: '18.3.1', license: 'MIT', author: 'Meta Platforms, Inc.' },
  { name: 'Vite', version: '5.4.11', license: 'MIT', author: 'Evan You & Vite contributors' },
  { name: 'Lucide React', version: '0.462.0', license: 'ISC', author: 'Lucide contributors' },
  { name: 'react-dom', version: '18.3.1', license: 'MIT', author: 'Meta Platforms, Inc.' },
  { name: 'esbuild', version: '0.21.5', license: 'MIT', author: 'Evan Wallace' },
  { name: 'rollup', version: '4.24.0', license: 'MIT', author: 'Lukas Taegert-Atkinson' },
  { name: 'postcss', version: '8.4.47', license: 'MIT', author: 'Andrey Sitnik' },
  { name: 'autoprefixer', version: '10.4.20', license: 'MIT', author: 'Andrey Sitnik' },
]

function OpenSourceLicenses({ onBack }) {
  const { lang } = useLang()
  const isKo = lang === 'ko'
  const [expanded, setExpanded] = useState(null)

  const MIT_TEXT = `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.`

  const ISC_TEXT = `Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.\n\nTHE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE.`

  return (
    <PolicyDoc title={isKo ? '오픈소스 라이선스' : 'Open-source Licenses'} onBack={onBack}>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16, lineHeight: 1.6 }}>
        {isKo
          ? 'LABEON은 아래의 오픈소스 소프트웨어를 사용합니다.'
          : 'LABEON uses the following open-source software.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {OSS_LIST.map((lib) => (
          <div key={lib.name}
            style={{ background: 'var(--surface)', borderRadius: expanded === lib.name ? 12 : 10, overflow: 'hidden', transition: 'border-radius .2s' }}>
            <button
              onClick={() => setExpanded(expanded === lib.name ? null : lib.name)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: -0.2 }}>{lib.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '2px 0 0', letterSpacing: -0.1 }}>v{lib.version} · {lib.author}</p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: 'var(--brand)',
                background: 'color-mix(in srgb, var(--brand) 12%, transparent)',
                borderRadius: 6, padding: '3px 8px', letterSpacing: 0.2,
              }}>{lib.license}</span>
              <ChevronRight size={15} style={{
                color: 'var(--text-3)',
                transform: expanded === lib.name ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform .2s',
              }} />
            </button>
            {expanded === lib.name && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--divider)' }}>
                <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.7, marginTop: 12, whiteSpace: 'pre-wrap', fontFamily: 'monospace', letterSpacing: 0 }}>
                  {lib.license === 'ISC' ? ISC_TEXT : MIT_TEXT}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </PolicyDoc>
  )
}

/* ── 약관 및 정책 ────────────────────────────────────────────── */
export function Terms({ onBack }) {
  const { t, pick } = useLang()
  const [page, setPage] = useState(null)

  if (page === 'pl1') return <TermsOfService onBack={() => setPage(null)} />
  if (page === 'pl2') return <PrivacyPolicy onBack={() => setPage(null)} />
  if (page === 'pl3') return <LocationTerms onBack={() => setPage(null)} />
  if (page === 'pl4') return <OpenSourceLicenses onBack={() => setPage(null)} />

  return (
    <SubPage title={t('mTerms')} onBack={onBack}>
      <div className="list" style={{ marginTop: 6 }}>
        {policies.map((p) => (
          <div className="list-row" key={p.id} onClick={() => setPage(p.id)} style={{ cursor: 'pointer' }}>
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
