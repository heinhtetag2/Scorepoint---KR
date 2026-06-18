import { useState, useEffect, useRef } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'

/* ============================================================
   LABEON — marketing landing page (the product's front door).
   Tells the photo → score → settle story, introduces the app
   to new users, offers App Store / Play Store download, then
   hands off to the live prototype via the portal picker.
   ============================================================ */

const COPY = {
  ko: {
    nav_demo: '데모 보기', nav_download: '다운로드', nav_features: '기능',
    anno: '새로워진 AI 캐디, LABEON을 소개합니다.', anno_cta: '둘러보기',
    badge: 'AI 골프 모임 비서',
    h1a: '사진 한 장으로 끝나는',
    h1b: '골프 모임 운영',
    sub: '스코어카드를 찍으면 AI가 점수를 읽고, 조 편성·시상·정산까지 알아서. 총무의 3시간이 15분이 됩니다.',
    cta_primary: '무료로 시작하기',
    cta_ghost: '기능 둘러보기',
    trust: '개인 점수 기록은 무료 · 결제는 보관하지 않는 송금 링크 방식',
    stats: [
      { v: '15분', l: '라운드 후 정리 시간' },
      { v: '98%', l: '스코어 인식 정확도' },
      { v: '1탭', l: '자동 조 편성' },
      { v: '0원', l: '보관하는 회비' },
    ],
    sc_kicker: '사용 방법',
    sc_title: '라운드가 끝나면, 3분이면 끝',
    sc_sub: '복잡한 설정 없이 — 찍고, 확인하고, 공유하면 됩니다.',
    rows: [
      { tag: '스캔', t: '사진으로 스코어 입력', d: '태블릿이든 종이 스코어카드든 카메라로 한 번. AI가 홀별 점수를 자동으로 읽어 정리합니다.',
        b: ['태블릿·종이 모두 인식', '홀별 점수 자동 구조화', '잘못 읽은 숫자만 탭으로 수정'] },
      { tag: '운영', t: '탭 한 번으로 조 편성', d: '핸디캡 균형까지 맞춰 AI가 조를 자동 편성. 드래그로 손쉽게 조정하고 결과 메시지를 자동 생성합니다.',
        b: ['핸디 균형 자동 매칭', '드래그로 즉시 조정', '카톡 공유용 결과 메시지'] },
      { tag: '정산', t: '정산은 송금 링크로', d: '영수증을 찍으면 비용을 1/n로 나눠 1인당 금액을 계산. 자금은 보관하지 않고 송금 링크만 발행합니다.',
        b: ['영수증 스캔 + 1/n 자동', '1인당 금액 즉시 계산', '돈은 절대 보관하지 않음'] },
    ],
    steps_kicker: '작동 방식',
    steps_title: '찍고, 채점하고, 정산하고',
    step1_t: '스캔', step1_d: '태블릿·종이 스코어카드를 카메라로 한 번. AI OCR이 점수를 구조화합니다.',
    step2_t: '채점', step2_d: '신페리오·핸디캡 자동 계산. 시상과 순위가 즉시 정리됩니다.',
    step3_t: '정산', step3_d: '비용을 1/n로 나누고 송금 링크 생성. 돈은 절대 보관하지 않습니다.',
    feat_kicker: '왜 LABEON인가',
    feat_title: '모임 운영의 모든 잡일을 하나로',
    f1_t: '사진 → 점수', f1_d: '스코어카드 사진만 찍으면 끝. 손으로 옮겨 적을 필요가 없습니다.',
    f2_t: '총무의 로봇', f2_d: '조 편성, 순위 계산, 비용 분배, 결과 메시지까지 자동 생성.',
    f3_t: '안전한 돈 관리', f3_d: '자금을 보관하지 않고 송금 링크만 발행 — 믿을 수 있는 구조.',
    f4_t: '한국 골프 맥락', f4_d: '총무·회사 모임·동호회. 신페리오와 핸디캡을 이해합니다.',
    dl_kicker: '지금 시작하기',
    dl_title: '오늘 라운드부터\nLABEON과 함께',
    dl_sub: 'iOS와 Android에서 무료로 다운로드하세요.',
    dl_note: 'iOS 14+ · Android 8+ · 개인 사용 무료',
    uc_kicker: '누구를 위한 앱',
    uc_title: '모임의 모든 역할에 딱 맞게',
    uc_sub: '총무부터 멤버까지 — 각자에게 필요한 것만.',
    uc: [
      { role: '총무', t: '잡일에서 해방', d: '조 편성·시상·정산을 자동으로. 라운드 후 3시간이 15분으로 줄어듭니다.' },
      { role: '클럽 오너', t: '한눈에 파악', d: '누가 왔고, 누가 냈고, 라운드가 어떻게 진행되는지 실시간으로 확인하세요.' },
      { role: '멤버', t: '간편하게 참여', d: '내 스코어를 보고 회비를 한 번에. 복잡한 과정 없이 탭 몇 번이면 끝.' },
    ],
    cta_title: '직접 사용해 볼까요?',
    cta_sub: '설치 없이 라이브 프로토타입을 바로 둘러보세요.',
    cta_btn: '앱 둘러보기',
    foot: '클라이언트 UX 테스트용 고충실도 프로토타입',
  },
  en: {
    nav_demo: 'View demo', nav_download: 'Download', nav_features: 'Features',
    anno: 'Introducing LABEON, your AI golf caddie.', anno_cta: 'Explore',
    badge: 'AI caddie for golf societies',
    h1a: 'Run the whole outing',
    h1b: 'from a single photo',
    sub: 'Snap the scorecard — AI reads the scores and handles grouping, awards and settlement. A manager’s 3 hours become 15 minutes.',
    cta_primary: 'Get started free',
    cta_ghost: 'Explore features',
    trust: 'Personal scoring is free · Settlement uses transfer links — we never hold funds',
    stats: [
      { v: '15 min', l: 'post-round wrap-up' },
      { v: '98%', l: 'scan accuracy' },
      { v: '1 tap', l: 'auto grouping' },
      { v: '$0', l: 'funds we hold' },
    ],
    sc_kicker: 'How to use it',
    sc_title: 'When the round ends, you’re done in 3 minutes',
    sc_sub: 'No fiddly setup — snap, confirm, share.',
    rows: [
      { tag: 'Scan', t: 'Enter scores with a photo', d: 'Tablet terminal or paper card — one photo. AI reads each hole and structures the whole scorecard for you.',
        b: ['Reads tablet & paper cards', 'Auto-structures hole-by-hole', 'Tap to fix any misread digit'] },
      { tag: 'Operate', t: 'Form groups in one tap', d: 'AI builds balanced foursomes by handicap. Drag to adjust, then auto-generate a result message to share.',
        b: ['Handicap-balanced matching', 'Drag to adjust instantly', 'Ready-to-share result message'] },
      { tag: 'Settle', t: 'Settlement via transfer links', d: 'Snap the receipt, split n-ways, and get each person’s amount. We issue transfer links and never hold the money.',
        b: ['Receipt scan + n-way split', 'Per-person amount instantly', 'We never hold the funds'] },
    ],
    steps_kicker: 'How it works',
    steps_title: 'Snap it, score it, settle it',
    step1_t: 'Snap', step1_d: 'One photo of the tablet or paper scorecard. AI OCR structures every score.',
    step2_t: 'Score', step2_d: 'New Peria and handicaps calculated automatically. Awards and rankings, instantly.',
    step3_t: 'Settle', step3_d: 'Split costs n-ways and generate transfer links. We never touch the money.',
    feat_kicker: 'Why LABEON',
    feat_title: 'Every post-round chore, in one app',
    f1_t: 'Photo → Score', f1_d: 'Just photograph the scorecard. No more typing numbers by hand.',
    f2_t: 'The manager’s robot', f2_d: 'Auto group formation, ranking math, cost splits and a ready-to-send result message.',
    f3_t: 'Safe with money', f3_d: 'We issue transfer links instead of holding funds — trust by design.',
    f4_t: 'Built for Korean golf', f4_d: 'Managers, company outings, hobby clubs. It understands New Peria and handicaps.',
    dl_kicker: 'Get started',
    dl_title: 'Start your next round\nwith LABEON',
    dl_sub: 'Download free on iOS and Android.',
    dl_note: 'iOS 14+ · Android 8+ · Free for personal use',
    uc_kicker: 'Who it’s for',
    uc_title: 'A fit for every role in the club',
    uc_sub: 'From the manager to the members — just what each one needs.',
    uc: [
      { role: 'Organizer', t: 'Freed from the busywork', d: 'Grouping, awards and settlement, automated. 3 hours after a round become 15 minutes.' },
      { role: 'Club owner', t: 'See everything at a glance', d: 'Who showed up, who paid, and how the round is going — all in real time.' },
      { role: 'Member', t: 'Join in, effortlessly', d: 'Check your scores and pay dues in one tap. No fuss, just a few taps.' },
    ],
    cta_title: 'Want to try it yourself?',
    cta_sub: 'Explore the live prototype right now — no install needed.',
    cta_btn: 'Explore the app',
    foot: 'High-fidelity prototype for client UX testing',
  },
}

export default function Landing({ onEnter, onBack }) {
  const { lang, setLang } = useLang()
  const c = COPY[lang] || COPY.ko

  // Nav is transparent over the hero banner, then turns solid once scrolled.
  const scrollerRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [annoOpen, setAnnoOpen] = useState(true)
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 12)
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-scrolling card carousel (right → left), with arrows + dot indicators
  const carRef = useRef(null)
  const pausedRef = useRef(false)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const CARD_COUNT = 6
  const carStride = () => {
    const first = carRef.current?.querySelector('.lp-mcard')
    return first ? first.offsetWidth + 18 : 318
  }
  useEffect(() => {
    const el = carRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf
    const tick = () => {
      const half = el.scrollWidth / 2
      if (!pausedRef.current && !reduce && half > 0) {
        el.scrollLeft += 0.5
        if (el.scrollLeft >= half) el.scrollLeft -= half
      }
      if (half > 0) {
        const idx = ((Math.round((el.scrollLeft % half) / carStride())) % CARD_COUNT + CARD_COUNT) % CARD_COUNT
        if (idx !== activeRef.current) { activeRef.current = idx; setActive(idx) }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const carNudge = (dir) => carRef.current?.scrollBy({ left: dir * carStride(), behavior: 'smooth' })
  const carGoTo = (i) => carRef.current?.scrollTo({ left: i * carStride(), behavior: 'smooth' })

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const scrollToTop = () => scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  const enterApp = () => onEnter('kakao')   // enter the live prototype with the default design

  const L = (ko, en) => (lang === 'ko' ? ko : en)
  // Product showcase cards for the auto-scrolling marquee at the bottom of the hero
  const MCARDS = [
    { img: '/cards/scan.png', icon: ICONS.camera, title: L('스코어 스캔', 'Score scan') },
    { img: '/cards/grouping.png', icon: ICONS.robot, title: L('조 편성', 'Grouping') },
    { img: '/cards/awards.png', icon: DECO_TROPHY, title: L('시상 · 순위', 'Awards') },
    { img: '/cards/settlement.png', icon: ICONS.shield, title: L('정산', 'Settlement') },
    { img: '/cards/schedule.png', icon: ICON_CAL, title: L('일정', 'Schedule') },
    { img: '/cards/rounds.png', icon: ICON_CHART, title: L('라운드 기록', 'Rounds') },
  ]

  return (
    <div className="lp" ref={scrollerRef}>
      {/* Back to portal picker — floating, kept out of the nav */}
      {onBack && (
        <button className="lp-back-float" onClick={onBack} aria-label={lang === 'ko' ? '포털 선택' : 'Portals'}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>{lang === 'ko' ? '포털' : 'Portals'}</span>
        </button>
      )}

      {/* ── Nav ─────────────────────────────────────────── */}
      <header className={`lp-nav ${scrolled ? 'scrolled' : 'on-hero'}`}>
        <div className="lp-nav-in">
          <div className="lp-nav-left">
            <button className="lp-logo-btn" onClick={scrollToTop} aria-label={lang === 'ko' ? '맨 위로' : 'Back to top'}>
              <img className="lp-logo" src="/logo-wordmark.svg" alt="LABEON" />
            </button>
          </div>
          <nav className="lp-nav-right">
            <button className="lp-nav-link" onClick={() => scrollTo('features')}>{c.nav_features}</button>
            <button className="lp-nav-link" onClick={() => scrollTo('download')}>{c.nav_download}</button>
            <div className="lp-lang" role="group" aria-label="Language">
              <button className={lang === 'ko' ? 'on' : ''} onClick={() => setLang('ko')}>KO</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            </div>
            <button className="lp-nav-cta" onClick={enterApp}>{c.nav_demo}</button>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-glow" aria-hidden="true" />


        {/* Announcement bar — sits on the banner, just below the nav */}
        {annoOpen && (
          <div className="lp-anno" role="region" aria-label={c.anno}>
            <div className="lp-anno-main">
              <span className="lp-anno-text">{c.anno}</span>
              <button className="lp-anno-cta" onClick={() => scrollTo('features')}>{c.anno_cta}</button>
            </div>
            <button className="lp-anno-x" onClick={() => setAnnoOpen(false)} aria-label={lang === 'ko' ? '닫기' : 'Dismiss'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
            </button>
          </div>
        )}
        <div className="lp-hero-in">
          <div className="lp-hero-copy">
            <h1 className="lp-h1">
              {c.h1a}<br />
              <span className="lp-h1-accent">{c.h1b}</span>
            </h1>
            <p className="lp-sub">{c.sub}</p>
            <div className="lp-cta-row">
              <button className="lp-btn-primary" onClick={() => scrollTo('download')}>
                {c.cta_primary}
              </button>
              <button className="lp-btn-ghost" onClick={() => scrollTo('features')}>{c.cta_ghost}</button>
            </div>
          </div>
        </div>

        {/* Stats strip — hidden for now
        <div className="lp-stats">
          {c.stats.map((s, i) => (
            <div className="lp-stat" key={i}>
              <span className="lp-stat-v num">{s.v}</span>
              <span className="lp-stat-l">{s.l}</span>
            </div>
          ))}
        </div>
        */}

        {/* Auto-scrolling product card carousel (right → left, slow) */}
        <div className="lp-carousel"
             onMouseEnter={() => { pausedRef.current = true }}
             onMouseLeave={() => { pausedRef.current = false }}
             onFocusCapture={() => { pausedRef.current = true }}
             onBlurCapture={() => { pausedRef.current = false }}>
          <div className="lp-car-stage">
            <button className="lp-car-arrow left" onClick={() => carNudge(-1)} aria-label={L('이전', 'Previous')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="lp-marquee" ref={carRef}>
              <div className="lp-marquee-row">
                {[0, 1].map((set) => (
                  <div className="lp-marquee-set" key={set}>
                    {MCARDS.map((m, i) => (
                      <article className="lp-mcard" key={i} tabIndex={0}>
                        <img className="lp-mcard-img" src={m.img} alt="" loading="lazy" />
                        <div className="lp-mcard-label">{m.icon}<span>{m.title}</span></div>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <button className="lp-car-arrow right" onClick={() => carNudge(1)} aria-label={L('다음', 'Next')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="lp-dots" role="tablist">
            {MCARDS.map((_, i) => (
              <button key={i} className={`lp-dot ${i === active ? 'on' : ''}`} onClick={() => carGoTo(i)} aria-label={`${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How to use it — showcase ────────────────────── */}
      <section className="lp-showcase">
        <div className="lp-show-head">
          <p className="lp-kicker">{c.sc_kicker}</p>
          <h2 className="lp-h2">{c.sc_title}</h2>
          <p className="lp-show-sub">{c.sc_sub}</p>
        </div>
        {c.rows.map((r, i) => (
          <div className={`lp-show-row ${i % 2 ? 'reverse' : ''}`} key={i}>
            <div className="lp-show-copy">
              <span className="lp-show-tag">{`0${i + 1} · ${r.tag}`}</span>
              <h3>{r.t}</h3>
              <p>{r.d}</p>
              <ul className="lp-show-list">
                {r.b.map((b, j) => (
                  <li key={j}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lp-show-art" aria-hidden="true">{MOCKS[i]}</div>
          </div>
        ))}
      </section>

      {/* ── Features grid ───────────────────────────────── */}
      <section className="lp-features" id="features">
        <p className="lp-kicker">{c.feat_kicker}</p>
        <h2 className="lp-h2">{c.feat_title}</h2>
        <div className="lp-feat-grid">
          {[
            { i: 'camera', t: c.f1_t, d: c.f1_d },
            { i: 'robot', t: c.f2_t, d: c.f2_d },
            { i: 'shield', t: c.f3_t, d: c.f3_d },
            { i: 'flag', t: c.f4_t, d: c.f4_d },
          ].map((f) => (
            <div className="lp-feat" key={f.t}>
              <span className="lp-feat-ic">{ICONS[f.i]}</span>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works (3 steps) ──────────────────────── */}
      <section className="lp-steps">
        <p className="lp-kicker">{c.steps_kicker}</p>
        <h2 className="lp-h2">{c.steps_title}</h2>
        <div className="lp-steps-grid">
          {[
            { n: '01', t: c.step1_t, d: c.step1_d },
            { n: '02', t: c.step2_t, d: c.step2_d },
            { n: '03', t: c.step3_t, d: c.step3_d },
          ].map((s) => (
            <div className="lp-step" key={s.n}>
              <span className="lp-step-n">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who it's for (use cases) ────────────────────── */}
      <section className="lp-uc" id="who">
        <p className="lp-kicker">{c.uc_kicker}</p>
        <h2 className="lp-h2">{c.uc_title}</h2>
        <p className="lp-uc-sub">{c.uc_sub}</p>
        <div className="lp-uc-grid">
          {c.uc.map((u, i) => (
            <div className="lp-uc-card" key={i}>
              <span className="lp-uc-ic">{UC_ICONS[i]}</span>
              <span className="lp-uc-role">{u.role}</span>
              <h3>{u.t}</h3>
              <p>{u.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Download (App Store / Play Store) — bottom ──── */}
      <section className="lp-download" id="download">
        <div className="lp-dl-card">
          <div className="lp-dl-copy">
            <p className="lp-kicker on-dark">{c.dl_kicker}</p>
            <h2 className="lp-h2 on-dark">{c.dl_title}</h2>
            <p className="lp-dl-sub">{c.dl_sub}</p>
            <div className="lp-stores">
              <AppStoreBadge />
              <PlayStoreBadge />
            </div>
            <p className="lp-dl-note">{c.dl_note}</p>
          </div>
          <div className="lp-dl-art" aria-hidden="true">
            <div className="lp-qr">
              <div className="lp-qr-grid">{Array.from({ length: 64 }).map((_, i) => <span key={i} className={QR[i] ? 'on' : ''} />)}</div>
            </div>
            <span className="lp-qr-cap">{lang === 'ko' ? 'QR 스캔으로 바로 설치' : 'Scan to install'}</span>
          </div>
        </div>
      </section>

      <footer className="lp-foot">
        <div className="lp-foot-brand">
          <img className="lp-foot-logo" src="/logo-mark.png" alt="" aria-hidden="true" />
          <span>© 2026 LABEON · {c.foot}</span>
        </div>
        <div className="lp-foot-stores">
          <AppStoreBadge small />
          <PlayStoreBadge small />
        </div>
      </footer>
    </div>
  )
}

/* ── Store badges ──────────────────────────────────────── */
function AppStoreBadge({ small }) {
  return (
    <a className={`store-badge ${small ? 'sm' : ''}`} role="button" tabIndex={0} aria-label="Download on the App Store">
      <svg className="store-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.04c-.03-2.6 2.12-3.84 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-1.72-.92-2.83-.9-1.46.02-2.8.85-3.55 2.16-1.51 2.62-.39 6.5 1.08 8.63.72 1.04 1.58 2.21 2.71 2.17 1.09-.04 1.5-.7 2.82-.7 1.31 0 1.69.7 2.83.68 1.17-.02 1.91-1.06 2.63-2.11.83-1.21 1.17-2.38 1.19-2.44-.03-.01-2.28-.88-2.31-3.48M14.54 4.6c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.56-1.23"/></svg>
      <span className="store-txt"><small>Download on the</small><strong>App Store</strong></span>
    </a>
  )
}
function PlayStoreBadge({ small }) {
  return (
    <a className={`store-badge ${small ? 'sm' : ''}`} role="button" tabIndex={0} aria-label="Get it on Google Play">
      <svg className="store-ic" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.6 2.4c-.25.26-.4.66-.4 1.18v16.84c0 .52.15.92.4 1.18l.06.05L13.1 12.1v-.2L3.66 2.35l-.06.05Z" fill="#34A853"/>
        <path d="M16.3 15.3l-3.2-3.2v-.2l3.2-3.2.07.04 3.79 2.15c1.08.61 1.08 1.62 0 2.24l-3.79 2.15-.07.04Z" fill="#FBBC04"/>
        <path d="M16.37 15.26 13.1 12 3.6 21.6c.36.37.94.42 1.6.05l11.17-6.39Z" fill="#EA4335"/>
        <path d="M16.37 8.74 5.2 2.35c-.66-.37-1.24-.32-1.6.05L13.1 12l3.27-3.26Z" fill="#4285F4"/>
      </svg>
      <span className="store-txt"><small>GET IT ON</small><strong>Google Play</strong></span>
    </a>
  )
}

/* Decorative QR pattern (deterministic, not a real code) */
const QR = (() => {
  const a = Array.from({ length: 64 }, (_, i) => ((i * 37 + (i % 7) * 13 + ((i / 8) | 0) * 5) % 3) === 0)
  ;[0, 1, 6, 7, 8, 15, 48, 55, 56, 57, 62, 63].forEach((i) => (a[i] = true)) // corner finders
  return a
})()

/* ── App-screen mockups for the showcase rows ─────────── */
const MOCKS = [
  // 0 · Scan
  (
    <div className="sc-mock">
      <div className="sc-scan">
        <span className="sc-br tl" /><span className="sc-br tr" /><span className="sc-br bl" /><span className="sc-br br" />
        <div className="sc-card">
          <div className="sc-card-h"><span className="sc-ball" />Eagle Hills CC</div>
          {[['1','2','3','4','5','6'], ['4','5','3','4','6','4']].map((r, i) => (
            <div className={`sc-grid ${i ? '' : 'head'}`} key={i}>{r.map((x, j) => <span key={j}>{x}</span>)}</div>
          ))}
          <div className="sc-line" />
        </div>
      </div>
      <div className="sc-chip"><span className="sc-dot" />AI 인식 완료 · 18홀</div>
    </div>
  ),
  // 1 · Grouping
  (
    <div className="sc-mock">
      <div className="sc-panel">
        <div className="sc-panel-h">조 편성 · 4조<span className="sc-pill">HCP 균형</span></div>
        {[['#0A7A37','#3182F6','#C9A227','#E2571F'],['#03C75A','#4F46E5','#E8682E','#2B6394'],['#0F5132','#E5484D','#1E7A46','#9A5418'],['#2A7D46','#3182F6','#C9A227','#6B7077']].map((g, i) => (
          <div className="sc-foursome" key={i}>
            <span className="sc-g-no">{i + 1}조</span>
            <span className="sc-avatars">{g.map((col, j) => <span key={j} style={{ background: col }} />)}</span>
            <span className="sc-bal" />
          </div>
        ))}
      </div>
    </div>
  ),
  // 2 · Settlement
  (
    <div className="sc-mock">
      <div className="sc-panel">
        <div className="sc-panel-h">정산 · 8명<span className="sc-pill green">1/n</span></div>
        {[['김총무', '42,000'], ['이대표', '42,000'], ['박프로', '38,500']].map(([n, a], i) => (
          <div className="sc-settle-row" key={i}><span>{n}</span><strong className="num">₩{a}</strong></div>
        ))}
        <div className="sc-settle-total"><span>총 8명</span><strong className="num">₩336,000</strong></div>
        <div className="sc-send">송금 링크 보내기</div>
      </div>
    </div>
  ),
]

const UC_ICONS = [
  // Organizer — clipboard / automation
  (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M9 4.5h6V7H9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8.5 12l2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  // Owner — dashboard / overview
  (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M8 15v-3M12 15V9M16 15v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  // Member — person
  (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
]

/* Glyphs for marquee cards */
const ICON_CAL = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M4 9.5h16M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
)
const ICON_CHART = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><rect x="6" y="11" width="3" height="5" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="11" y="7" width="3" height="9" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="16" y="13" width="3" height="3" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg>
)

/* Trophy glyph for the hero decoration */
const DECO_TROPHY = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M7 6H4.5v1.5A3 3 0 0 0 7 10.4M17 6h2.5v1.5a3 3 0 0 1-2.5 2.9M10 13.5h4M9 20h6M12 13.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
)

const ICONS = {
  camera: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2l.9-1.6A1.5 1.5 0 0 1 8.9 3.6h6.2c.55 0 1.05.3 1.3.8L17.3 6h1.2A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.8"/></svg>
  ),
  robot: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="11" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8V4M9 4h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="13" r="1.3" fill="currentColor"/><circle cx="15" cy="13" r="1.3" fill="currentColor"/></svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  flag: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 21V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M6 5h11l-2 3 2 3H6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
  ),
}
