import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import BottomNav from './components/BottomNav.jsx'
import Home from './screens/Home.jsx'
import MyScore from './screens/MyScore.jsx'
import Profile from './screens/Profile.jsx'
import Detail from './screens/Detail.jsx'
import Notifications from './screens/Notifications.jsx'
import Onboarding from './screens/Onboarding.jsx'
import ChangelogBot from './components/ChangelogBot.jsx'
import { useLang } from './i18n/LanguageContext.jsx'

/* ScoreShot — Kakao-style direction (single, locked design) with KO/EN toggle. */
export default function App() {
  const { t, lang, setLang } = useLang()
  const [onboarded, setOnboarded] = useState(false)
  const [obImmersive, setObImmersive] = useState(true)
  const [profilePushed, setProfilePushed] = useState(false)
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

  const isPushed = screen === 'detail' || screen === 'noti' || profilePushed
  const content =
    screen === 'home' ? <Home onOpenEvent={openEvent} onOpenNoti={() => setScreen('noti')} onOpenProfile={() => handleNav('my', 'profile')} /> :
    screen === 'myscore' ? <MyScore /> :
    screen === 'profile' ? <Profile onPushedChange={setProfilePushed} /> :
    screen === 'noti' ? <Notifications onBack={() => handleNav('home', 'home')} /> :
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

      {/* Onboarding gates the app on first launch → no tab bar until done */}
      {onboarded ? (
        /* Detail is a pushed page → no bottom tab bar */
        <PhoneFrame nav={isPushed ? null : <BottomNav navKey={navKey} onNav={handleNav} />}>
          {content}
        </PhoneFrame>
      ) : (
        <PhoneFrame nav={null} immersive={obImmersive}>
          <Onboarding onDone={() => setOnboarded(true)} onIntroChange={setObImmersive} />
        </PhoneFrame>
      )}

      <ChangelogBot />
    </div>
  )
}
