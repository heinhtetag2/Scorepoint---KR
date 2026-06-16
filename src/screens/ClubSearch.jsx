import { useState } from 'react'
import { ArrowLeft, Search, X, MapPin, ChevronRight } from 'lucide-react'
import ClubAvatar from '../components/ClubAvatar.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs, recommendedClubs, searchRecent, searchPopular, searchRegions } from '../data/mock.js'

const COLORS = ['#0A7A37', '#3B82F6', '#8B5CF6', '#E2571F', '#0EA5A0']

export default function ClubSearch({ onBack, onOpenClub, onNearby }) {
  const { t, pick } = useLang()
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState(searchRecent)
  const q = query.trim()

  const allClubs = [
    ...clubs.map((c) => ({ ...c, mine: true })),
    ...recommendedClubs.map((c) => ({ ...c, mine: false })),
  ]
  const cName = (c) => pick(c.nameKr, c.nameEn)
  const cRegion = (c) => (c.regionKr ? pick(c.regionKr, c.regionEn) : '')
  const match = (s) => s.toLowerCase().includes(q.toLowerCase())

  const pool = [...new Set([...searchPopular, ...allClubs.map(cName), ...searchRegions])]
  const suggestions = q ? pool.filter(match).slice(0, 6) : []
  const results = q ? allClubs.filter((c) => match(cName(c)) || match(cRegion(c))) : []

  // highlight the matched substring in brand colour
  const hl = (text) => {
    if (!q) return text
    const i = text.toLowerCase().indexOf(q.toLowerCase())
    if (i < 0) return text
    return <>{text.slice(0, i)}<span className="sg-hl">{text.slice(i, i + q.length)}</span>{text.slice(i + q.length)}</>
  }

  return (
    <>
      <div className="search-bar">
        <div className="search-field">
          <button className="search-back" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchPlaceholder')} />
          {q && <button className="search-x" onClick={() => setQuery('')} aria-label="Clear"><X size={17} /></button>}
        </div>
      </div>

      {q ? (
        <div className="screen search-results">
          {suggestions.map((s) => (
            <button className="sg-row" key={s} onClick={() => setQuery(s)}>
              <Search size={17} className="sg-ico" />
              <span className="sg-text">{hl(s)}</span>
              {searchPopular.includes(s) && <span className="sg-badge">{t('searchHot')}</span>}
            </button>
          ))}

          {results.map((c, i) => (
            <button className="sg-row sg-club" key={`${c.id}-${i}`} onClick={() => onOpenClub?.(c)}>
              <ClubAvatar img={c.img} icon={c.icon} color={COLORS[i % COLORS.length]} size={34} radius={10} />
              <span className="sg-text">
                <span className="sg-club-name">{hl(cName(c))}</span>
                <small>{cRegion(c) ? `${cRegion(c)} · ` : ''}{t('clubsMembers', { n: c.members })}</small>
              </span>
            </button>
          ))}

          {!suggestions.length && !results.length && (
            <div className="search-empty">{t('searchEmpty', { q })}</div>
          )}
        </div>
      ) : (
        <div className="screen search-idle">
          <button className="search-near" onClick={onNearby}><MapPin size={16} strokeWidth={2.1} /> {t('searchNearby')} <ChevronRight size={15} /></button>

          {recent.length > 0 && (
            <div className="search-block">
              <div className="search-head">
                <span className="search-head-t">{t('searchRecentTitle')}</span>
                <button className="search-clear" onClick={() => setRecent([])}>{t('searchClearAll')}</button>
              </div>
              <div className="chip-wrap">
                {recent.map((r) => (
                  <span className="recent-chip" key={r}>
                    <button className="recent-chip-text" onClick={() => setQuery(r)}>{r}</button>
                    <button className="recent-chip-x" onClick={() => setRecent((list) => list.filter((x) => x !== r))} aria-label="Remove"><X size={13} /></button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="search-block">
            <div className="search-head"><span className="search-head-t">{t('searchPopularTitle')}</span></div>
            <div className="sp-grid">
              {searchPopular.map((term, i) => (
                <button className="sp-item" key={term} onClick={() => setQuery(term)}>
                  <span className={`sp-rank ${i < 3 ? 'top' : ''}`}>{i + 1}</span>
                  <span className="sp-term">{term}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="search-block">
            <div className="search-head"><span className="search-head-t">{t('searchRegionsTitle')}</span></div>
            <div className="chip-wrap">
              {searchRegions.map((rg) => (
                <button className="region-chip" key={rg} onClick={() => setQuery(rg)}>{rg}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
