import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import BottomNav from './components/BottomNav.jsx'
import Home from './screens/Home.jsx'
import MyScore from './screens/MyScore.jsx'
import Profile from './screens/Profile.jsx'
import Detail from './screens/Detail.jsx'
import { useLang } from './i18n/LanguageContext.jsx'

/* ScoreShot — Kakao-style direction (single, locked design) with KO/EN toggle. */
export default function App() {
  const { t, lang, setLang } = useLang()
  const [screen, setScreen] = useState('home')
  const [navKey, setNavKey] = useState('home')

  const handleNav = (key, target) => {
    setNavKey(key)
    setScreen(target)
  }
  const openEvent = () => {
    setScreen('detail')
    setNavKey('event')
  }

  const isDetail = screen === 'detail'
  const content =
    screen === 'home' ? <Home onOpenEvent={openEvent} /> :
    screen === 'myscore' ? <MyScore /> :
    screen === 'profile' ? <Profile /> :
    <Detail onBack={() => handleNav('home', 'home')} />

  return (
    <div className="app-shell">
      <header className="app-head">
        <h1>ScoreShot</h1>
        <p>{t('tagline')}</p>
        <div className="lang-toggle" role="group" aria-label="Language">
          <button className={lang === 'ko' ? 'active' : ''} onClick={() => setLang('ko')}>한국어</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
        </div>
      </header>

      {/* Detail is a pushed page → no bottom tab bar */}
      <PhoneFrame nav={isDetail ? null : <BottomNav navKey={navKey} onNav={handleNav} />}>
        {content}
      </PhoneFrame>
    </div>
  )
}
