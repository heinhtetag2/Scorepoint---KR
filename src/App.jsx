import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import BottomNav from './components/BottomNav.jsx'
import Home from './screens/Home.jsx'
import MyScore from './screens/MyScore.jsx'
import Profile from './screens/Profile.jsx'
import Detail from './screens/Detail.jsx'
import RecordDetail from './screens/RecordDetail.jsx'
import Scan from './screens/Scan.jsx'
import ScanReview from './screens/ScanReview.jsx'
import Events from './screens/Events.jsx'
import CreateEvent from './screens/CreateEvent.jsx'
import Clubs from './screens/Clubs.jsx'
import ClubDetail from './screens/ClubDetail.jsx'
import ClubCreate from './screens/ClubCreate.jsx'
import ClubSearch from './screens/ClubSearch.jsx'
import HomeSearch from './screens/HomeSearch.jsx'
import NearbyClubs from './screens/NearbyClubs.jsx'
import ClubSettings from './screens/ClubSettings.jsx'
import CreateRound from './screens/CreateRound.jsx'
import ClubMembers from './screens/ClubMembers.jsx'
import ClubNoti from './screens/ClubNoti.jsx'
import Notifications from './screens/Notifications.jsx'
import Onboarding from './screens/Onboarding.jsx'
import ChangelogBot from './components/ChangelogBot.jsx'
import { scannedRound, clubs as seedClubs, eventList as seedEvents } from './data/mock.js'
import { useLang } from './i18n/LanguageContext.jsx'

/* ScoreShot — Kakao-style direction (single, locked design) with KO/EN toggle. */
export default function App() {
  const { t, lang, setLang } = useLang()
  const [onboarded, setOnboarded] = useState(false)
  const [obImmersive, setObImmersive] = useState(true)
  const [profilePushed, setProfilePushed] = useState(false)
  const [screen, setScreen] = useState('home')
  const [navKey, setNavKey] = useState('home')
  const [record, setRecord] = useState(null)
  const [club, setClub] = useState(null)
  const [clubs, setClubs] = useState(seedClubs)
  const [evList, setEvList] = useState(seedEvents)
  const [detailFrom, setDetailFrom] = useState('home')   // where the shared event Detail was opened from
  const [openedEvent, setOpenedEvent] = useState(null)   // the list event currently open in Detail (for delete)
  const [detailImmersive, setDetailImmersive] = useState(false)

  const addClub = (c) => { setClubs((prev) => [c, ...prev]); handleNav('club', 'club') }
  const removeClub = (id) => { setClubs((prev) => prev.filter((c) => c.id !== id)); handleNav('club', 'club') }
  const addEvent = (ev) => { setEvList((prev) => [ev, ...prev]); handleNav('event', 'events') }
  const deleteEvent = (id) => { setEvList((prev) => prev.filter((e) => e.id !== id)); setDetailImmersive(false); handleNav('event', 'events') }

  const handleNav = (key, target) => {
    setNavKey(key)
    setScreen(target)
  }
  // Both Home and the Events tab open the same event Detail page; remember the origin for Back.
  const openEvent = (id) => { setOpenedEvent(evList.find((e) => e.id === id) ?? null); setDetailFrom('home'); setNavKey('event'); setScreen('detail') }
  const openEventItem = (ev) => { setOpenedEvent(ev ?? null); setDetailFrom('events'); setNavKey('event'); setScreen('detail') }

  const openRecord = (r) => { setRecord(r); setScreen('record') }
  const openClub = (c) => { setClub(c); setScreen('clubDetail') }
  const isPushed = screen === 'detail' || screen === 'noti' || screen === 'record' || screen === 'scan' || screen === 'scanReview' || screen === 'manual' || screen === 'clubDetail' || screen === 'clubCreate' || screen === 'clubSearch' || screen === 'nearby' || screen === 'clubSettings' || screen === 'createRound' || screen === 'clubEdit' || screen === 'clubMembers' || screen === 'clubNoti' || screen === 'eventCreate' || screen === 'search' || profilePushed
  const content =
    screen === 'home' ? <Home onOpenEvent={openEvent} onOpenNoti={() => setScreen('noti')} onOpenProfile={() => handleNav('my', 'profile')} onSearch={() => setScreen('search')} /> :
    screen === 'search' ? <HomeSearch onBack={() => handleNav('home', 'home')} onOpenEvent={openEvent} onNearby={() => setScreen('nearby')} /> :
    screen === 'myscore' ? <MyScore onOpenRecord={openRecord} onScan={() => setScreen('scan')} /> :
    screen === 'events' ? <Events events={evList} onOpen={openEventItem} onCreate={() => setScreen('eventCreate')} onDelete={(id) => setEvList((prev) => prev.filter((e) => e.id !== id))} /> :
    screen === 'eventCreate' ? <CreateEvent onBack={() => handleNav('event', 'events')} onCreate={addEvent} /> :
    screen === 'club' ? <Clubs clubs={clubs} onOpenClub={openClub} onCreate={() => setScreen('clubCreate')} onSearch={() => setScreen('clubSearch')} /> :
    screen === 'clubSearch' ? <ClubSearch onBack={() => setScreen('club')} onOpenClub={openClub} onNearby={() => setScreen('nearby')} /> :
    screen === 'nearby' ? <NearbyClubs onBack={() => setScreen('clubSearch')} onOpenClub={openClub} /> :
    screen === 'clubDetail' ? <ClubDetail club={club} onBack={() => handleNav('club', 'club')} onOpenEvent={openEvent} onSettings={() => setScreen('clubSettings')} onNewRound={() => setScreen('createRound')} onMemberMng={() => setScreen('clubMembers')} /> :
    screen === 'clubSettings' ? <ClubSettings club={club} onBack={() => setScreen('clubDetail')} onEdit={() => setScreen('clubEdit')} onMembers={() => setScreen('clubMembers')} onNoti={() => setScreen('clubNoti')} onLeave={() => removeClub(club?.id)} /> :
    screen === 'clubEdit' ? <ClubCreate edit club={club} onBack={() => setScreen('clubSettings')} onCreate={() => setScreen('clubSettings')} /> :
    screen === 'clubMembers' ? <ClubMembers club={club} onBack={() => setScreen('clubDetail')} /> :
    screen === 'clubNoti' ? <ClubNoti onBack={() => setScreen('clubSettings')} /> :
    screen === 'createRound' ? <CreateRound onBack={() => setScreen('clubDetail')} onCreate={() => setScreen('clubDetail')} /> :
    screen === 'clubCreate' ? <ClubCreate onBack={() => setScreen('club')} onCreate={addClub} /> :
    screen === 'record' ? <RecordDetail record={record} onBack={() => handleNav('my', 'myscore')} /> :
    screen === 'scan' ? <Scan onBack={() => handleNav('my', 'myscore')} onCaptured={() => setScreen('scanReview')} onManual={() => setScreen('manual')} /> :
    screen === 'scanReview' ? <ScanReview onBack={() => setScreen('scan')} onRegister={() => openRecord(scannedRound)} /> :
    screen === 'manual' ? <ScanReview manual onBack={() => setScreen('scan')} onRegister={() => openRecord(scannedRound)} /> :
    screen === 'profile' ? <Profile onPushedChange={setProfilePushed} /> :
    screen === 'noti' ? <Notifications onBack={() => handleNav('home', 'home')} /> :
    <Detail
      event={openedEvent}
      onDelete={openedEvent ? () => deleteEvent(openedEvent.id) : undefined}
      onBack={() => { setDetailImmersive(false); detailFrom === 'events' ? handleNav('event', 'events') : handleNav('home', 'home') }}
      onImmersiveChange={setDetailImmersive}
    />

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
        <PhoneFrame nav={isPushed ? null : <BottomNav navKey={navKey} onNav={handleNav} />} immersive={screen === 'scan' || detailImmersive}>
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
