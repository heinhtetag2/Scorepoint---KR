import { useLang } from '../i18n/LanguageContext.jsx'

/* ============================================================
   LABEON — entry gate. Shown first on every load/refresh.
   The visitor chooses one of two portals: the marketing
   Website, or the live mobile App prototype.
   ============================================================ */

const COPY = {
  ko: {
    tagline: '한국형 골프 스코어 · 모임 운영 앱',
    choose: '어디로 입장하시겠어요?',
    sub: '두 개의 포털 중 하나를 선택하세요.',
    web_t: '웹사이트',
    web_d: '제품 소개와 핵심 기능을 둘러보세요.',
    web_tag: '소개 · 랜딩',
    app_t: '모바일 앱',
    app_d: '라이브 프로토타입으로 직접 사용해 보세요.',
    app_tag: '라이브 프로토타입',
    enter: '입장',
    foot: '클라이언트 UX 테스트용 고충실도 프로토타입',
  },
  en: {
    tagline: 'Korean golf scoring · club operations app',
    choose: 'Where would you like to enter?',
    sub: 'Pick one of the two portals.',
    web_t: 'Website',
    web_d: 'Explore the product story and core features.',
    web_tag: 'Marketing · Landing',
    app_t: 'Mobile App',
    app_d: 'Try the live prototype hands-on.',
    app_tag: 'Live prototype',
    enter: 'Enter',
    foot: 'High-fidelity prototype for client UX testing',
  },
}

export default function PortalGate({ onPick }) {
  const { lang, setLang } = useLang()
  const c = COPY[lang] || COPY.ko

  const Arrow = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  )

  return (
    <div className="gate">
      <div className="gate-glow" aria-hidden="true" />

      <div className="gate-top">
        <img className="gate-logo" src="/logo-wordmark.svg" alt="LABEON" />
        <p className="gate-tagline">{c.tagline}</p>
        <div className="gate-lang" role="group" aria-label="Language">
          <button className={lang === 'ko' ? 'on' : ''} onClick={() => setLang('ko')}>한국어</button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
        </div>
      </div>

      <div className="gate-head">
        <h1>{c.choose}</h1>
        <p>{c.sub}</p>
      </div>

      <div className="gate-cards">
        {/* Website portal */}
        <button className="gate-card web" onClick={() => onPick('landing')}>
          <span className="gate-ic">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/><path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" stroke="currentColor" strokeWidth="1.7"/></svg>
          </span>
          <span className="gate-tag">{c.web_tag}</span>
          <span className="gate-card-t">{c.web_t}</span>
          <span className="gate-card-d">{c.web_d}</span>
          <span className="gate-go">{c.enter} <Arrow /></span>
        </button>

        {/* App portal */}
        <button className="gate-card app" onClick={() => onPick('app')}>
          <span className="gate-ic">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="7" y="2.5" width="10" height="19" rx="2.6" stroke="currentColor" strokeWidth="1.7"/><path d="M10.5 5.2h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M11 18.6h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </span>
          <span className="gate-tag">{c.app_tag}</span>
          <span className="gate-card-t">{c.app_t}</span>
          <span className="gate-card-d">{c.app_d}</span>
          <span className="gate-go">{c.enter} <Arrow /></span>
        </button>
      </div>

      <footer className="gate-foot">© 2026 LABEON · {c.foot}</footer>
    </div>
  )
}
