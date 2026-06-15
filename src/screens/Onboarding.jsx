import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, Check, MapPin, Smartphone, Camera, User } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

/* Brand glyphs — official KakaoTalk bubble & Apple logo, drawn in currentColor. */
const KakaoIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden {...props}>
    <path d="M12 3C6.48 3 2 6.54 2 10.9c0 2.82 1.87 5.29 4.68 6.68-.15.53-.96 3.3-.99 3.52 0 0-.02.17.09.23.11.07.24.02.24.02.31-.04 3.58-2.35 4.15-2.75.59.08 1.2.13 1.83.13 5.52 0 10-3.54 10-7.9S17.52 3 12 3z" />
  </svg>
)
const AppleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden {...props}>
    <path d="M17.05 12.04c-.03-2.6 2.12-3.84 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-1.72-.92-2.83-.9-1.46.02-2.8.85-3.55 2.16-1.51 2.62-.39 6.5 1.08 8.63.72 1.04 1.58 2.21 2.71 2.17 1.09-.04 1.5-.7 2.82-.7 1.31 0 1.69.7 2.83.68 1.17-.02 1.91-1.06 2.63-2.11.83-1.21 1.17-2.38 1.19-2.44-.03-.01-2.28-.88-2.31-3.48M14.54 4.6c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.56-1.23" />
  </svg>
)

const UNSPLASH = (id) => `https://images.unsplash.com/photo-${id}?w=1200&q=82&auto=format&fit=crop&crop=entropy`

/* Value-prop slides — full-bleed, high-res golf scenery, one feature each. */
const SLIDES = [
  // Scenic fairway at golden hour — the hero opener.
  { id: 's1', eyebrow: 'obSlide1Eyebrow', title: 'obSlide1Title', sub: 'obSlide1Sub',
    img: UNSPLASH('1535131749006-b7f58c99034b'), grad: 'linear-gradient(165deg,#0d5c2e,#2f9e6f)' },
  // Sweeping course aerial — community / events feel.
  { id: 's2', eyebrow: 'obSlide2Eyebrow', title: 'obSlide2Title', sub: 'obSlide2Sub',
    img: UNSPLASH('1500932334442-8761ee4810a7'), grad: 'linear-gradient(165deg,#155e4f,#3a86d6)' },
  // Ball + putter on the green — close, tactile, ties to scoring/settlement.
  { id: 's3', eyebrow: 'obSlide3Eyebrow', title: 'obSlide3Title', sub: 'obSlide3Sub',
    img: UNSPLASH('1587174486073-ae5e5cff23aa'), grad: 'linear-gradient(165deg,#1f5e3a,#0d5c2e)' },
]

/* Skill-band picker — bilingual labels keep meaning consistent across KO/EN. */
const HCP_BANDS = [
  { id: 'beginner', ko: '입문', en: 'Beginner', subKo: '100타+', subEn: '100+' },
  { id: 'novice', ko: '초급', en: 'Novice', subKo: '90타대', subEn: '90s' },
  { id: 'mid', ko: '중급', en: 'Intermediate', subKo: '80타대', subEn: '80s' },
  { id: 'advanced', ko: '상급', en: 'Advanced', subKo: '70타대', subEn: '70s' },
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
  { id: 'male', koKey: 'genderMale' },
  { id: 'female', koKey: 'genderFemale' },
  { id: 'none', koKey: 'genderNone' },
]

/* Korean date format: digits → YYYY.MM.DD (auto-inserts dots as you type). */
export const fmtBirth = (s) => {
  const d = s.replace(/\D/g, '').slice(0, 8)
  return [d.slice(0, 4), d.slice(4, 6), d.slice(6, 8)].filter(Boolean).join('.')
}

/* Selectable avatar faces + pastel background swatches. */
const AVATARS = ['😀', '😎', '🙂', '👩', '🧑', '🧓', '🏌️']
const BG_COLORS = ['#F8C8D4', '#FAD9A8', '#F6EBA0', '#CDE9BE', '#BFC7D1', '#C3D6FA', '#D9CDF3']

export default function Onboarding({ onDone, onIntroChange }) {
  const { t, pick } = useLang()
  const [step, setStep] = useState('intro')      // intro · login · profile · done
  const [slide, setSlide] = useState(0)

  // The intro step is full-bleed → let the frame float a transparent status bar.
  useEffect(() => { onIntroChange?.(step === 'intro') }, [step, onIntroChange])

  // Done step plays its success animation, then hands off to Home automatically.
  const doneRef = useRef(onDone)
  doneRef.current = onDone
  useEffect(() => {
    if (step !== 'done') return
    const id = setTimeout(() => doneRef.current(), 2000)
    return () => clearTimeout(id)
  }, [step])
  const [name, setName] = useState('')
  const [hcp, setHcp] = useState('mid')
  const [region, setRegion] = useState('capital')
  const [birth, setBirth] = useState('')
  const [gender, setGender] = useState('')
  const [avatarEmoji, setAvatarEmoji] = useState(null)
  const [avatarBg, setAvatarBg] = useState(null)
  const [showPicker, setShowPicker] = useState(false)

  const lastSlide = slide === SLIDES.length - 1
  const displayName = name.trim() || pick('회원', 'there')

  /* ── Intro carousel ─────────────────────────────────────── */
  if (step === 'intro') {
    const s = SLIDES[slide]
    return (
      <div className="ob ob-intro" style={{ background: `url(${s.img}) center/cover, ${s.grad}` }}>
        <span className="ob-intro-scrim" />
        <div className="ob-intro-top">
          <span className="ob-wordmark">ScoreShot</span>
          <button className="ob-skip" onClick={onDone}>{t('obSkip')}</button>
        </div>

        <div className="ob-intro-body">
          <span className="ob-eyebrow">{t(s.eyebrow)}</span>
          <h2 className="ob-slide-title">{t(s.title)}</h2>
          <p className="ob-slide-sub">{t(s.sub)}</p>
        </div>

        <div className="ob-intro-foot">
          <div className="ob-dots">
            {SLIDES.map((sl, i) => (
              <button
                key={sl.id}
                className={`ob-dot ${i === slide ? 'active' : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="ob-btn ob-btn-primary"
            onClick={() => (lastSlide ? setStep('login') : setSlide((i) => i + 1))}
          >
            {lastSlide ? t('obStart') : t('obNext')}
          </button>
        </div>
      </div>
    )
  }

  /* ── Social login ───────────────────────────────────────── */
  if (step === 'login') {
    return (
      <div className="ob ob-login">
        <div className="ob-login-hero">
          <h2 className="ob-login-title">{t('obLoginTitle')}</h2>
          <p className="ob-login-sub">{t('obLoginSub')}</p>
        </div>

        <div className="ob-login-actions">
          <button className="ob-sso ob-sso-kakao" onClick={() => setStep('profile')}>
            <KakaoIcon className="ob-sso-ico" />
            {t('obKakao')}
          </button>
          <button className="ob-sso ob-sso-apple" onClick={() => setStep('profile')}>
            <AppleIcon className="ob-sso-ico" />
            {t('obApple')}
          </button>
          <button className="ob-sso ob-sso-phone" onClick={() => setStep('profile')}>
            <Smartphone className="ob-sso-ico" size={17} strokeWidth={2} />
            {t('obPhone')}
          </button>
          <p className="ob-terms">{t('obTerms')}</p>
        </div>
      </div>
    )
  }

  /* ── Profile setup ──────────────────────────────────────── */
  if (step === 'profile') {
    return (
      <div className="ob ob-form">
        <div className="ob-form-head">
          <button className="ob-back" onClick={() => setStep('login')} aria-label="back">
            <ChevronLeft size={22} strokeWidth={2.2} />
          </button>
        </div>

        <h2 className="ob-form-title">{t('obProfileTitle')}</h2>
        <p className="ob-form-sub">{t('obProfileSub')}</p>

        <div className="ob-avatar-wrap" onClick={() => setShowPicker((v) => !v)} style={{ cursor: 'pointer' }}>
          <span className="ob-avatar" style={avatarBg ? { background: avatarBg } : undefined}>
            {avatarEmoji || (name.trim() ? name.trim().slice(0, 1) : <User size={32} strokeWidth={1.8} />)}
          </span>
          <span className="ob-avatar-edit"><Camera size={15} strokeWidth={2.2} /></span>
        </div>

        {showPicker && (
          <div className="ob-avatar-picker">
            <div className="ob-ap-row">
              {AVATARS.map((a) => (
                <button key={a} type="button" className={`ap-emoji ${avatarEmoji === a ? 'active' : ''}`} onClick={() => setAvatarEmoji(a)}>{a}</button>
              ))}
            </div>
            <div className="ob-ap-swatches">
              {BG_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`ap-swatch ${avatarBg === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setAvatarBg(c)}
                  aria-label="background color"
                >
                  {avatarBg === c && <Check size={16} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="ob-field">
          <label className="ob-label">{t('obName')}</label>
          <input
            className="ob-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('obNamePh')}
            maxLength={20}
          />
        </div>

        <div className="ob-field">
          <label className="ob-label">{t('obHcp')}</label>
          <div className="ob-band-grid">
            {HCP_BANDS.map((b) => (
              <button
                key={b.id}
                className={`ob-band ${hcp === b.id ? 'active' : ''}`}
                onClick={() => setHcp(b.id)}
              >
                <span className="ob-band-name">{pick(b.ko, b.en)}</span>
                <span className="ob-band-sub num">{pick(b.subKo, b.subEn)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ob-field">
          <label className="ob-label">{t('obRegion')}</label>
          <div className="ob-chip-wrap">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                className={`ob-chip ${region === r.id ? 'active' : ''}`}
                onClick={() => setRegion(r.id)}
              >
                {region === r.id && <MapPin size={13} strokeWidth={2.4} />}
                {pick(r.ko, r.en)}
              </button>
            ))}
          </div>
        </div>

        <div className="ob-field">
          <label className="ob-label">{t('peBirth')}</label>
          <input
            className="ob-input"
            value={birth}
            onChange={(e) => setBirth(fmtBirth(e.target.value))}
            placeholder={t('birthPh')}
            maxLength={10}
            inputMode="numeric"
          />
        </div>

        <div className="ob-field">
          <label className="ob-label">{t('peGender')}</label>
          <div className="ob-chip-wrap">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                className={`ob-chip ${gender === g.id ? 'active' : ''}`}
                onClick={() => setGender(g.id)}
              >
                {t(g.koKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="ob-form-foot">
          <button className="ob-btn ob-btn-primary ob-btn-block" onClick={() => setStep('done')}>
            {t('obComplete')}
          </button>
        </div>
      </div>
    )
  }

  /* ── Done (auto-advances to Home after the animation) ───── */
  return (
    <div className="ob ob-done">
      <div className="ob-done-body">
        <span className="ob-check-wrap">
          <span className="ob-check-ring" />
          <span className="ob-check"><Check size={40} strokeWidth={3} /></span>
        </span>
        <h2 className="ob-done-title">{t('obDoneTitle')}</h2>
        <p className="ob-done-sub">{t('obDoneSub', { name: displayName })} ⛳</p>
      </div>
    </div>
  )
}
