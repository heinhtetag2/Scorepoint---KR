import { useState } from 'react'
import { ArrowLeft, MapPin, Check } from 'lucide-react'
import ClubAvatar from '../components/ClubAvatar.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { nearbyClubs } from '../data/mock.js'

const COLORS = ['#0A7A37', '#3B82F6', '#8B5CF6', '#E2571F', '#0EA5A0']

export default function NearbyClubs({ onBack, onOpenClub }) {
  const { t, pick } = useLang()
  const [joined, setJoined] = useState(new Set())
  const toggleJoin = (id) => setJoined((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('nearbyTitle')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        {/* Current location bar */}
        <div className="nb-loc">
          <MapPin size={15} strokeWidth={2.1} />
          <span className="nb-loc-name">{t('nearbyLoc')}</span>
          <button className="nb-loc-change">{t('nearbyChange')}</button>
        </div>

        <div className="card rec-card">
          {nearbyClubs.map((c, i) => {
            const isJoined = joined.has(c.id)
            return (
              <div className="rec-row" key={c.id}>
                <button className="rec-tap" onClick={() => onOpenClub?.(c)}>
                  <ClubAvatar img={c.img} icon={c.icon} color={COLORS[i % COLORS.length]} size={34} radius={10} />
                  <div className="rec-main">
                    <div className="rec-name">{pick(c.nameKr, c.nameEn)}</div>
                    <div className="rec-meta">
                      <span className="nb-km num">{t('nearbyKm', { km: c.km })}</span>
                      <span className="cc-dot">·</span>
                      <span className="num">{pick(c.regionKr, c.regionEn)} · {t('clubsMembers', { n: c.members })}</span>
                    </div>
                  </div>
                </button>
                <button className={`rec-join ${isJoined ? 'is-joined' : ''}`} onClick={(e) => { e.stopPropagation(); toggleJoin(c.id) }}>
                  {isJoined ? <><Check size={13} strokeWidth={2.6} /> {t('clubsJoined')}</> : t('clubsJoin')}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
