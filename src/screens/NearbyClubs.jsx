import { useState } from 'react'
import { ArrowLeft, MapPin, Check, X } from 'lucide-react'
import ClubAvatar from '../components/ClubAvatar.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { nearbyClubs } from '../data/mock.js'

const COLORS = ['#0A7A37', '#3B82F6', '#8B5CF6', '#E2571F', '#0EA5A0']

const LOCATIONS = [
  { ko: '서울 강서구', en: 'Gangseo, Seoul', region: '서울' },
  { ko: '서울 송파구', en: 'Songpa, Seoul', region: '서울' },
  { ko: '서울 강남구', en: 'Gangnam, Seoul', region: '서울' },
  { ko: '경기 성남시', en: 'Seongnam', region: '경기' },
  { ko: '경기 분당구', en: 'Bundang', region: '경기' },
  { ko: '경기 수원시', en: 'Suwon', region: '경기' },
  { ko: '인천 연수구', en: 'Yeonsu, Incheon', region: '인천' },
  { ko: '강원 춘천시', en: 'Chuncheon', region: '강원' },
  { ko: '부산 해운대구', en: 'Haeundae, Busan', region: '부산' },
  { ko: '제주시', en: 'Jeju City', region: '제주' },
]

const REGIONS = ['서울', '경기', '인천', '강원', '부산', '제주']

function LocationSheet({ current, onPick, onClose }) {
  const { pick } = useLang()
  const [region, setRegion] = useState(current.region || '서울')
  const filtered = LOCATIONS.filter((l) => l.region === region)

  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="edit-sheet pick-sheet loc-sheet">
        <div className="es-grab" />
        <div className="loc-sheet-head">
          <span className="es-title" style={{ margin: 0 }}>지역 변경</span>
          <button className="loc-sheet-x" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Region tab row */}
        <div className="loc-region-row">
          {REGIONS.map((r) => (
            <button
              key={r}
              className={`loc-region-btn ${region === r ? 'active' : ''}`}
              onClick={() => setRegion(r)}
            >{r}</button>
          ))}
        </div>

        {/* District list */}
        <div className="pick-list">
          {filtered.map((loc) => {
            const isSel = pick(loc.ko, loc.en) === pick(current.ko, current.en)
            return (
              <button
                key={loc.ko}
                className={`pick-row ${isSel ? 'is-sel' : ''}`}
                onClick={() => onPick(loc)}
              >
                <span className="pick-name">{pick(loc.ko, loc.en)}</span>
                {isSel && <Check size={18} strokeWidth={2.4} />}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default function NearbyClubs({ onBack, onOpenClub }) {
  const { t, pick } = useLang()
  const [joined, setJoined] = useState(new Set())
  const [location, setLocation] = useState(LOCATIONS[0])
  const [showPicker, setShowPicker] = useState(false)

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
          <span className="nb-loc-name">{pick(location.ko, location.en)}</span>
          <button className="nb-loc-change" onClick={() => setShowPicker(true)}>{t('nearbyChange')}</button>
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

      {showPicker && (
        <LocationSheet
          current={location}
          onPick={(loc) => { setLocation(loc); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  )
}
