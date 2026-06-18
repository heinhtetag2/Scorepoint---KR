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
  const [pinnedStory, setPinnedStory] = useState(null)   // clicked story card stays expanded
  const [useTab, setUseTab] = useState(0)                // active "how to use it" tab
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
    { img: '/cards/scan.png', icon: ICONS.camera, title: L('스코어 스캔', 'Score scan'), sub: L('사진 한 장으로 점수 입력', 'Scores from one photo') },
    { img: '/cards/grouping.png', icon: ICONS.robot, title: L('조 편성', 'Grouping'), sub: L('핸디 균형 자동 편성', 'Balanced auto-grouping') },
    { img: '/cards/awards.png', icon: DECO_TROPHY, title: L('시상 · 순위', 'Awards'), sub: L('신페리오 순위와 시상', 'Rankings & awards') },
    { img: '/cards/settlement.png', icon: ICONS.shield, title: L('정산', 'Settlement'), sub: L('1/n 송금 링크 정산', 'n-way transfer links') },
    { img: '/cards/schedule.png', icon: ICON_CAL, title: L('일정', 'Schedule'), sub: L('라운드 일정과 알림', 'Rounds & reminders') },
    { img: '/cards/rounds.png', icon: ICON_CHART, title: L('라운드 기록', 'Rounds'), sub: L('스코어 추이 한눈에', 'Score trends at a glance') },
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

        {/* Golf line-art illustrations flanking the hero copy */}
        <div className="lp-hero-illus" aria-hidden="true">
          <svg className="lp-illus lp-illus-l" viewBox="0 0 220 220" fill="none">
            <circle cx="110" cy="110" r="104" stroke="currentColor" strokeWidth="2" strokeDasharray="2 11" />
            <circle cx="110" cy="110" r="70" stroke="currentColor" strokeWidth="2" />
            <circle cx="110" cy="110" r="36" stroke="currentColor" strokeWidth="2" strokeDasharray="2 9" />
            <circle cx="110" cy="110" r="7" fill="currentColor" />
          </svg>
          <svg className="lp-illus lp-illus-r" viewBox="0 0 160 240" fill="none">
            <path d="M34 230V20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M34 26h104l-22 26 22 26H34" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
            <circle cx="34" cy="232" r="6" fill="currentColor" />
          </svg>
          <svg className="lp-illus lp-illus-arc" viewBox="0 0 320 120" fill="none">
            <path d="M6 112 C 90 -20 230 -20 314 112" stroke="currentColor" strokeWidth="2" strokeDasharray="3 9" />
            <circle cx="314" cy="112" r="7" fill="currentColor" />
          </svg>
          <svg className="lp-illus lp-illus-ball" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="2.4" />
            <circle cx="60" cy="42" r="3.4" fill="currentColor" /><circle cx="44" cy="54" r="3.4" fill="currentColor" /><circle cx="76" cy="54" r="3.4" fill="currentColor" />
            <circle cx="52" cy="70" r="3.4" fill="currentColor" /><circle cx="68" cy="70" r="3.4" fill="currentColor" /><circle cx="60" cy="60" r="3.4" fill="currentColor" />
          </svg>
          <svg className="lp-illus lp-illus-tee" viewBox="0 0 120 160" fill="none">
            <path d="M20 18 C 60 70 60 70 100 150" stroke="currentColor" strokeWidth="2" strokeDasharray="3 9" strokeLinecap="round" />
            <circle cx="20" cy="16" r="8" fill="currentColor" />
            <path d="M92 150h16M100 150v-14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>


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
                        <div className="lp-mcard-label">
                          <span className="lp-mcard-title">{m.icon}{m.title}</span>
                          <span className="lp-mcard-sub">{m.sub}</span>
                        </div>
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

      {/* ── Feature spotlight (below hero) ──────────────── */}
      <section className="lp-spot">
        <div className="lp-spot-head">
          <div className="lp-spot-left">
            <h2 className="lp-spot-h2">
              <span className="lp-spot-accent">{L('스코어 스캔', 'Score scan')}</span>
              <span>{L('사진 한 장이면 입력 끝', 'Scoring, done in one photo')}</span>
            </h2>
          </div>
          <button className="lp-spot-cta" onClick={() => scrollTo('features')}>{L('기능 둘러보기', 'Explore features')}</button>
        </div>
        <div className="lp-spot-media">
          <img src="/cards/spotlight.jpg" alt={L('LABEON 스코어 스캔 화면', 'LABEON score scan screen')} loading="lazy" />
        </div>
      </section>

      {/* ── How to use it — tabbed use cases ────────────── */}
      {(() => {
        const TABS = [
          { tab: L('스코어 스캔', 'Score scan'), img: '/cards/scan.png', bullets: [
            { h: L('사진 한 장으로 입력', 'Capture in one shot'), d: L('태블릿 단말기든 종이 스코어카드든, 카메라로 한 번 촬영하면 모든 홀의 점수가 자동으로 입력됩니다.', 'Whether it’s a tablet terminal or a paper card, one photo enters every hole’s score automatically.') },
            { h: L('홀별 자동 정리', 'Structured automatically'), d: L('AI OCR이 홀별 점수를 인식해 OUT·IN·합계까지 표 형태로 깔끔하게 구조화합니다.', 'AI OCR reads each hole and structures it into a clean table — OUT, IN and totals included.') },
            { h: L('검토는 탭 한 번', 'Review with a tap'), d: L('잘못 인식된 숫자만 화면에서 탭해 바로 수정할 수 있어 검토 시간이 거의 들지 않습니다.', 'Only misread digits need a tap to fix, so reviewing takes almost no time.') },
          ]},
          { tab: L('조 편성', 'Grouping'), img: '/cards/grouping.png', bullets: [
            { h: L('핸디캡 균형 매칭', 'Handicap-balanced'), d: L('참가자의 핸디캡을 고려해 실력이 고르게 분포되도록 AI가 조를 자동으로 편성합니다.', 'AI forms groups automatically, balancing skill across foursomes using each player’s handicap.') },
            { h: L('드래그로 즉시 조정', 'Drag to rearrange'), d: L('편성된 조는 멤버를 끌어다 놓는 것만으로 즉시 변경되어 현장 상황에 유연하게 대응합니다.', 'Drag a member to instantly reshuffle groups and adapt to whatever happens on the day.') },
            { h: L('결과 메시지 공유', 'Shareable result'), d: L('확정된 조 편성을 카카오톡 등으로 바로 공유할 수 있는 메시지를 자동으로 생성합니다.', 'A ready-to-send message is generated so you can share the final lineup in a tap.') },
          ]},
          { tab: L('시상 · 순위', 'Awards'), img: '/cards/awards.png', bullets: [
            { h: L('신페리오 자동 계산', 'New Peria scoring'), d: L('신페리오 방식과 핸디캡을 반영해 네트 순위를 자동으로 계산하고 정렬합니다.', 'Net rankings are computed and sorted automatically using New Peria and handicaps.') },
            { h: L('시상 항목 한 번에', 'Every award sorted'), d: L('우승부터 니어리스트, 롱기스트까지 모든 시상 항목을 한 화면에서 정리합니다.', 'From the winner to nearest-pin and longest-drive, every award is organized on one screen.') },
            { h: L('결과 메시지 생성', 'Result message'), d: L('시상 결과를 멤버들에게 바로 공유할 수 있도록 정리된 메시지를 자동으로 만들어 줍니다.', 'A tidy results message is created automatically, ready to share with every member.') },
          ]},
          { tab: L('정산', 'Settlement'), img: '/cards/settlement.png', bullets: [
            { h: L('영수증 1/n 분배', 'Split from receipts'), d: L('영수증을 촬영하면 총비용을 인원수에 맞춰 자동으로 1/n 분배합니다.', 'Photograph a receipt and the total is split evenly across the group, automatically.') },
            { h: L('1인당 금액 즉시 계산', 'Instant per-person'), d: L('참가 인원과 항목을 반영해 1인당 부담 금액을 즉시 계산해 보여 줍니다.', 'Each person’s share is calculated instantly from the headcount and line items.') },
            { h: L('안전한 송금 링크', 'Secure transfer link'), d: L('자금을 직접 보관하지 않고 송금 링크만 발행해 안전하고 투명하게 정산합니다.', 'We never hold funds — only transfer links are issued, keeping settlement safe and transparent.') },
          ]},
          { tab: L('일정', 'Schedule'), img: '/cards/schedule.png', bullets: [
            { h: L('라운드 일정 공유', 'Share the round'), d: L('다음 라운드의 날짜와 장소를 모든 멤버에게 한 번에 공유합니다.', 'Share the date and venue of the next round with every member at once.') },
            { h: L('참석 현황 관리', 'Track attendance'), d: L('누가 참석하는지 실시간으로 확인하고 인원을 손쉽게 관리합니다.', 'See who’s coming in real time and manage headcount with ease.') },
            { h: L('자동 알림 발송', 'Automatic reminders'), d: L('라운드 전 자동으로 알림을 발송해 참석 누락과 노쇼를 방지합니다.', 'Reminders go out automatically before the round to prevent missed tee times and no-shows.') },
          ]},
        ]
        const t = TABS[useTab]
        return (
          <section className="lp-use" id="use">
            <div className="lp-use-head">
              <p className="lp-kicker">{c.sc_kicker}</p>
              <h2 className="lp-h2">{L('한 번 찍으면, 나머지는 자동으로', 'Snap once — the rest is automatic')}</h2>
            </div>
            <div className="lp-tabs" role="tablist">
              {TABS.map((x, i) => (
                <button key={i} role="tab" aria-selected={useTab === i}
                  className={`lp-tab ${useTab === i ? 'on' : ''}`} onClick={() => setUseTab(i)}>
                  {x.tab}
                </button>
              ))}
            </div>
            <div className="lp-tab-panel" key={useTab}>
              <div className="lp-tab-copy">
                <ul className="lp-tab-list">
                  {t.bullets.map((b, j) => (
                    <li key={j}><strong>{b.h}</strong> · {b.d}</li>
                  ))}
                </ul>
                <button className="lp-tab-cta" onClick={() => scrollTo('download')}>{c.cta_btn}</button>
              </div>
              <div className="lp-tab-media"><img src={t.img} alt={t.tab} /></div>
            </div>
          </section>
        )
      })()}

      {/* ── Why LABEON (featured story, Zoom-style) ─────── */}
      <section className="lp-story-sec" id="features">
        <div className="lp-ratings">
          <p className="lp-ratings-title">{L('전국의 골프 모임이 신뢰합니다', 'Trusted by golf societies nationwide')}</p>
          <div className="lp-trustlogos">
            {['그린필드 CC', '파인밸리 GC', '한라 CC', '레이크사이드', '스카이72', '남서울 CC'].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className="lp-ratings-row">
            {[
              { v: '4.8/5', s: 5, icon: 'apple', l: L('App Store · 1.2천+ 평가', 'App Store · 1.2k+ ratings') },
              { v: '4.7/5', s: 4, icon: 'play', l: L('Google Play · 980+ 평가', 'Google Play · 980+ ratings') },
              { v: '98%', s: 5, icon: 'check', l: L('추천 만족도 · 총무 설문', 'Would recommend · manager survey') },
            ].map((r, i) => (
              <div className="lp-rating" key={i}>
                <span className="lp-rating-v num">{r.v}</span>
                <span className="lp-rating-stars">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <svg key={n} className={n < r.s ? 'on' : ''} width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9l-5.8 3.07 1.1-6.47L2.6 9.35l6.5-.95L12 2.5Z"/></svg>
                  ))}
                </span>
                <span className="lp-rating-l">{RATING_ICON[r.icon]}{r.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lp-story-head">
          <p className="lp-story-kicker">{L('총무들의 이야기', 'Customer stories')}</p>
          <h2 className="lp-story-h2">{L('복잡했던 모임 운영, 이렇게 달라졌어요', 'Running a society, made simple')}</h2>
        </div>
        <div className="lp-story-row">
          <article className="lp-story-feature">
            <img src="/cards/grouping.png" alt="" loading="lazy" />
            <div className="lp-story-ov" aria-hidden="true" />
            <div className="lp-story-content">
              <img className="lp-story-mark" src="/logo-wordmark.svg" alt="LABEON" />
              <h3>{L('총무의 3시간이 15분이 되었습니다', 'A manager’s 3 hours became 15 minutes')}</h3>
              <div className="lp-story-quote">
                <p>{L('“사진 한 장이면 점수 입력부터 조 편성, 정산까지 자동으로 끝나요. 라운드 후 정리에 쓰던 시간이 사라졌습니다.”', '“One photo handles scoring, grouping and settlement automatically — the post-round busywork is simply gone.”')}</p>
                <p className="lp-story-by">{L('— 김총무 · 그린필드 CC 동호회', '— Kim, Greenfield CC society')}</p>
              </div>
            </div>
          </article>
          {[
            { img: '/cards/scan.png', k: L('스캔', 'Scan'), t: L('스코어 스캔', 'Score scan'),
              d: L('사진 한 장으로 홀별 점수를 자동 인식합니다.', 'AI reads every hole from a single photo.'),
              b: [L('태블릿·종이 스코어카드 모두 인식', 'Reads tablet & paper cards'), L('홀별 점수 자동 구조화', 'Auto-structures hole by hole'), L('오인식한 숫자만 탭으로 수정', 'Tap to fix any misread')] },
            { img: '/cards/awards.png', k: L('시상', 'Awards'), t: L('시상 · 순위', 'Awards'),
              d: L('신페리오·핸디캡으로 순위와 시상을 자동 계산합니다.', 'Rankings and awards, auto-calculated by handicap.'),
              b: [L('신페리오 점수 자동 계산', 'New Peria auto-scoring'), L('순위와 수상 즉시 정리', 'Instant leaderboard'), L('시상 결과 메시지 생성', 'Ready-to-share results')] },
            { img: '/cards/schedule.png', k: L('일정', 'Schedule'), t: L('일정 관리', 'Schedule'),
              d: L('다음 라운드 일정과 알림을 한 곳에서 관리합니다.', 'Plan rounds and reminders in one place.'),
              b: [L('라운드 일정 공유', 'Share round schedules'), L('참석 여부 한눈에 체크', 'Track attendance at a glance'), L('알림 자동 발송', 'Automatic reminders')] },
          ].map((s, i) => (
            <article
              className={`lp-story-thumb ${pinnedStory === i ? 'is-pinned' : ''}`}
              key={i} tabIndex={0} role="button" aria-pressed={pinnedStory === i}
              onClick={() => setPinnedStory(pinnedStory === i ? null : i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPinnedStory(pinnedStory === i ? null : i) } }}>
              <img src={s.img} alt="" loading="lazy" />
              <div className="lp-story-thumb-tint" aria-hidden="true" />
              <span className="lp-story-thumb-lbl">{s.t}</span>
              <div className="lp-story-thumb-open">
                <div className="lp-story-thumb-top">
                  <span className="lp-story-thumb-k">{s.k}</span>
                  <h4>{s.t}</h4>
                </div>
                <div className="lp-story-thumb-btm">
                  <p>{s.d}</p>
                  <ul className="lp-story-thumb-list">
                    {s.b.map((x, j) => (
                      <li key={j}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
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

      {/* ── Who it's for — bento grid ───────────────────── */}
      <section className="lp-uc" id="who">
        <div className="lp-uc-head">
          <p className="lp-kicker">{c.uc_kicker}</p>
          <h2 className="lp-h2">{c.uc_title}</h2>
          <p className="lp-uc-sub">{c.uc_sub}</p>
        </div>
        <div className="lp-bento">
          <article className="lp-bento-card lp-bento-tall">
            <div className="lp-bento-copy">
              <span className="lp-bento-role">{L('총무', 'Organizer')}</span>
              <h3>{L('잡일에서 해방', 'Freed from the busywork')}</h3>
              <p>{L('조 편성·시상·정산을 자동으로. 라운드 후 3시간이 15분으로 줄어듭니다.', 'Grouping, awards and settlement, automated. 3 hours after a round become 15 minutes.')}</p>
            </div>
            <span className="lp-bento-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </article>

          <article className="lp-bento-card lp-bento-tall">
            <div className="lp-bento-copy">
              <span className="lp-bento-role">{L('클럽 오너', 'Club owner')}</span>
              <h3>{L('한눈에 파악', 'See everything at a glance')}</h3>
              <p>{L('누가 왔고, 누가 냈고, 라운드가 어떻게 진행되는지 실시간으로 확인하세요.', 'Who showed up, who paid, and how the round is going — all in real time.')}</p>
            </div>
            <span className="lp-bento-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </article>

          <article className="lp-bento-card">
            <div className="lp-bento-copy">
              <span className="lp-bento-role">{L('멤버', 'Member')}</span>
              <h3>{L('간편하게 참여', 'Join in, effortlessly')}</h3>
              <p>{L('내 스코어를 보고 회비를 한 번에. 복잡한 과정 없이 탭 몇 번이면 끝.', 'Check your scores and pay dues in one tap. No fuss, just a few taps.')}</p>
            </div>
            <span className="lp-bento-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </article>

          <article className="lp-bento-card">
            <div className="lp-bento-copy">
              <span className="lp-bento-role">{L('게스트', 'Guest')}</span>
              <h3>{L('초대만으로 OK', 'Just an invite away')}</h3>
              <p>{L('앱 설치 없이 링크로 참여하고, 조 편성과 결과를 바로 확인합니다.', 'Join by link with no install, and see groupings and results right away.')}</p>
            </div>
            <span className="lp-bento-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </article>
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
        <div className="lp-foot-top">
          <div className="lp-foot-brand-col">
            <img className="lp-foot-wordmark" src="/logo-wordmark.svg" alt="LABEON" />
            <p className="lp-foot-tag">{L('사진 한 장으로 끝나는 골프 모임 운영.', 'Run the whole golf outing from a single photo.')}</p>
            <div className="lp-foot-contact">
              <span className="lp-foot-contact-label">{L('문의', 'Get in touch')}</span>
              <a href="mailto:hello@labeon.app">hello@labeon.app</a>
            </div>
            <div className="lp-foot-social">
              {[
                { l: 'Instagram', d: 'M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.95 4.95.06 1.3.07 1.7.07 4.78s0 3.5-.07 4.78c-.15 3.25-1.7 4.8-4.95 4.95-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-3.3-.15-4.8-1.7-4.95-4.95C2.08 15.5 2.07 15.1 2.07 12s0-3.5.07-4.78C2.29 3.97 3.84 2.42 7.1 2.27 8.4 2.21 8.8 2.2 12 2.2Zm0 3.65A6.15 6.15 0 1 0 18.15 12 6.15 6.15 0 0 0 12 5.85Zm0 10.15A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.4-10.55a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z' },
                { l: 'X', d: 'M17.5 3h3.2l-7 8 8.2 10.9h-6.4l-5-6.6-5.8 6.6H1.5l7.5-8.6L1 3h6.6l4.6 6.1L17.5 3Zm-1.1 17h1.8L7.7 4.8H5.8L16.4 20Z' },
                { l: 'YouTube', d: 'M23 12s0-3.2-.4-4.8a2.5 2.5 0 0 0-1.8-1.8C19.2 5 12 5 12 5s-7.2 0-8.8.4A2.5 2.5 0 0 0 1.4 7.2C1 8.8 1 12 1 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C4.8 19 12 19 12 19s7.2 0 8.8-.4a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12Zm-13 3.5v-7l6 3.5-6 3.5Z' },
              ].map((s) => (
                <a key={s.l} href="#" aria-label={s.l} onClick={(e) => e.preventDefault()}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </div>

          <nav className="lp-foot-cols" aria-label="Footer">
            {[
              { h: L('제품', 'Product'), links: [
                { t: L('기능', 'Features'), go: () => scrollTo('features') },
                { t: L('사용 방법', 'How it works'), go: () => scrollTo('use') },
                { t: L('다운로드', 'Download'), go: () => scrollTo('download') },
                { t: L('라이브 데모', 'Live demo'), go: enterApp },
                { t: L('요금 안내', 'Pricing') },
              ]},
              { h: L('회사', 'Company'), links: [
                { t: L('소개', 'About') }, { t: L('블로그', 'Blog') }, { t: L('채용', 'Careers') },
                { t: L('파트너십', 'Partners') }, { t: L('보도자료', 'Press') },
              ]},
              { h: L('지원', 'Support'), links: [
                { t: L('고객센터', 'Help center') }, { t: L('사용 가이드', 'Guides') },
                { t: L('자주 묻는 질문', 'FAQ') }, { t: L('공지사항', 'Notices') }, { t: L('서비스 상태', 'Status') },
              ]},
            ].map((col) => (
              <div className="lp-foot-col" key={col.h}>
                <h4>{col.h}</h4>
                <ul>
                  {col.links.map((lk) => (
                    <li key={lk.t}>
                      <button className="lp-foot-link" onClick={lk.go || undefined}>{lk.t}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="lp-foot-bottom">
          <span>© 2026 LABEON · {c.foot}</span>
          <div className="lp-foot-legal">
            {[L('이용약관', 'Terms'), L('개인정보처리방침', 'Privacy'), L('위치기반서비스', 'Location'), L('쿠키 설정', 'Cookies')].map((x) => (
              <a key={x} href="#" onClick={(e) => e.preventDefault()}>{x}</a>
            ))}
          </div>
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

/* Brand glyphs for the trust-ratings labels */
const RATING_ICON = {
  apple: (
    <svg className="lp-rating-ic" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.04c-.03-2.6 2.12-3.84 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-1.72-.92-2.83-.9-1.46.02-2.8.85-3.55 2.16-1.51 2.62-.39 6.5 1.08 8.63.72 1.04 1.58 2.21 2.71 2.17 1.09-.04 1.5-.7 2.82-.7 1.31 0 1.69.7 2.83.68 1.17-.02 1.91-1.06 2.63-2.11.83-1.21 1.17-2.38 1.19-2.44-.03-.01-2.28-.88-2.31-3.48M14.54 4.6c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.56-1.23"/></svg>
  ),
  play: (
    <svg className="lp-rating-ic" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.6 2.4c-.25.26-.4.66-.4 1.18v16.84c0 .52.15.92.4 1.18l.06.05L13.1 12.1v-.2L3.66 2.35l-.06.05Z" fill="#34A853"/>
      <path d="M16.3 15.3l-3.2-3.2v-.2l3.2-3.2.07.04 3.79 2.15c1.08.61 1.08 1.62 0 2.24l-3.79 2.15-.07.04Z" fill="#FBBC04"/>
      <path d="M16.37 15.26 13.1 12 3.6 21.6c.36.37.94.42 1.6.05l11.17-6.39Z" fill="#EA4335"/>
      <path d="M16.37 8.74 5.2 2.35c-.66-.37-1.24-.32-1.6.05L13.1 12l3.27-3.26Z" fill="#4285F4"/>
    </svg>
  ),
  check: (
    <svg className="lp-rating-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#198754"/><path d="M8 12.4l2.6 2.6L16 9.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
}

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
