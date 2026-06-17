import { useState } from 'react'
import { Search, Plus, ChevronRight, Crown, Check } from 'lucide-react'
import { SectionHead } from '../components/ui.jsx'
import ClubAvatar from '../components/ClubAvatar.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs as seedClubs, recommendedClubs } from '../data/mock.js'

const COLORS = ['#0A7A37', '#3B82F6', '#8B5CF6', '#E2571F', '#0EA5A0']

export default function Clubs({ clubs = seedClubs, onOpenClub, onCreate, onSearch }) {
  const { t, pick } = useLang()
  const [joined, setJoined] = useState(new Set())
  const toggleJoin = (id) => setJoined((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  // highlight the last word of a section title in brand color (Home/MyScore signature)
  const hl = (text) => {
    const w = text.split(' ')
    if (w.length < 2) return text
    return <>{w.slice(0, -1).join(' ')} <span className="s-title-hl">{w[w.length - 1]}</span></>
  }

  return (
    <>
      <div className="appbar">
        <span className="title">{t('navClub')}</span>
        <span className="actions">
          <span role="button" tabIndex={0} onClick={onSearch}><Search size={20} strokeWidth={1.9} /></span>
        </span>
      </div>

      <div className="screen">
        {/* Banner — golf-club themed graphic (hidden for now) */}
        {false && (
          <div className="club-banner">
            <div className="cb-copy">
              <span className="cb-eyebrow">{t('clubsPromoCount', { n: clubs.length })}</span>
              <h3 className="cb-title">{t('clubsPromoTitle')}</h3>
            </div>
            <img className="cb-art" src="/team.png" alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
        )}

        {/* My clubs */}
        <SectionHead title={hl(t('clubsMine'))} more={t('all')} />
        <div className="club-list">
          {clubs.map((c, i) => {
            const organizer = c.role === '총무'
            const next = pick(c.nextKr, c.nextEn)
            return (
              <div className="club-card" key={c.id} onClick={() => onOpenClub?.(c)} role="button" tabIndex={0}>
                <ClubAvatar img={c.img} icon={c.icon} color={COLORS[i % COLORS.length]} size={38} radius={11} />
                <div className="cc-main">
                  <div className="cc-name-row">
                    {organizer && <Crown size={13} strokeWidth={2.4} className="cc-crown" />}
                    <span className="cc-name">{pick(c.nameKr, c.nameEn)}</span>
                  </div>
                  <div className="cc-meta">
                    {c.unpaid > 0 && <><span className="cc-settle">{t('clubsSettle', { n: c.unpaid })}</span><span className="cc-dot">·</span></>}
                    <span className="num">{t('clubsMembers', { n: c.members })}</span>
                    <span className="cc-dot">·</span>
                    <span className={next ? '' : 'muted'}>{next || t('clubsNoSchedule')}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="cc-chev" />
              </div>
            )
          })}
        </div>

        {/* Discover */}
        <SectionHead title={hl(t('clubsRecommend'))} />
        <div className="card rec-card">
          {recommendedClubs.map((rc, i) => {
            const isJoined = joined.has(rc.id)
            return (
              <div className="rec-row" key={rc.id}>
                <button className="rec-tap" onClick={() => onOpenClub?.(rc)}>
                  <ClubAvatar img={rc.img} icon={rc.icon} color={COLORS[(i + 2) % COLORS.length]} size={34} radius={10} />
                  <div className="rec-main">
                    <div className="rec-name">{pick(rc.nameKr, rc.nameEn)}</div>
                    <div className="rec-meta"><span className="num">{pick(rc.regionKr, rc.regionEn)} · {t('clubsMembers', { n: rc.members })}</span></div>
                  </div>
                </button>
                <button className={`rec-join ${isJoined ? 'is-joined' : ''}`} onClick={(e) => { e.stopPropagation(); toggleJoin(rc.id) }}>
                  {isJoined ? <><Check size={13} strokeWidth={2.6} /> {t('clubsJoined')}</> : t('clubsJoin')}
                </button>
              </div>
            )
          })}
        </div>

        {/* Floating create-club button */}
        <button className="evt-fab" onClick={onCreate}>
          <Plus size={17} strokeWidth={2.4} /> {t('clubsCreate')}
        </button>
      </div>
    </>
  )
}
