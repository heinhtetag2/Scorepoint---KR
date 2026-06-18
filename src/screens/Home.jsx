import { useRef, useEffect } from 'react'
import {
  Search, Bell, MapPin, Star,
  Camera, Users, CalendarDays, Trophy, Wallet, ChevronRight,
  BarChart3, Lightbulb,
} from 'lucide-react'
import { SectionHead, QuickAction, Button } from '../components/ui.jsx'
import CourseIllust from '../components/CourseIllust.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { user, aiReport, events, recentMatches, banners, popularCourses } from '../data/mock.js'

const QUICK = [
  { id: 'score', key: 'qScore', Icon: Camera, color: '#16A34A', img: '/score.svg', badge: 'badgeScore', badgeDark: true },
  { id: 'club', key: 'qClub', Icon: Users, color: '#3B82F6', img: '/team.png' },
  { id: 'event', key: 'qEvent', Icon: CalendarDays, color: '#F59E0B', img: '/calendar.png', badge: 'badgeEvent' },
  { id: 'rank', key: 'qRank', Icon: Trophy, color: '#8B5CF6', img: '/trophy.png' },
]

export default function Home({ onOpenEvent, onOpenNoti, onOpenProfile, onSearch }) {
  const { t, lang, pick } = useLang()
  const bestScore = Math.min(...recentMatches.map((m) => m.score))

  // "5/2" → "5월 2일" (ko) / "May 2" (en)
  const fmtRoundDate = (d) => {
    const [mo, day] = d.split('/')
    if (lang === 'en') {
      const M = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${M[+mo]} ${day}`
    }
    return `${mo}월 ${day}일`
  }
  const PAR = 72

  // Loop carousel: clone last+first so the active card always has a card peeking both sides.
  const carouselRef = useRef(null)
  const idxRef = useRef(1)
  const bannerSlides = banners.length > 1
    ? [
        { ...banners[banners.length - 1], _i: banners.length - 1, _key: 'clone-pre' },
        ...banners.map((b, i) => ({ ...b, _i: i, _key: b.id })),
        { ...banners[0], _i: 0, _key: 'clone-post' },
      ]
    : banners.map((b, i) => ({ ...b, _i: i, _key: b.id }))

  // Center a slide by DOM index; auto-advance every 4s with a seamless loop.
  useEffect(() => {
    const el = carouselRef.current
    if (!el || banners.length <= 1) return
    const center = (idx, smooth) => {
      const target = el.querySelectorAll('.promo-banner')[idx]
      if (!target) return
      const er = el.getBoundingClientRect()
      const tr = target.getBoundingClientRect()
      el.scrollBy({ left: (tr.left + tr.width / 2) - (er.left + er.width / 2), behavior: smooth ? 'smooth' : 'auto' })
    }
    requestAnimationFrame(() => center(1, false))
    const total = banners.length
    const timer = setInterval(() => {
      idxRef.current += 1
      center(idxRef.current, true)
      if (idxRef.current >= total + 1) {
        setTimeout(() => { idxRef.current = 1; center(1, false) }, 480)
      }
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="appbar">
        <span className="brand"><img className="brand-mark" src="/logo-mark.png" alt="" />LABEON</span>
        <span className="actions">
          <span className="dot-badge" role="button" tabIndex={0} onClick={onOpenNoti}>
            <Bell size={21} strokeWidth={1.9} />
          </span>
          <span className="appbar-avatar" role="button" tabIndex={0} onClick={onOpenProfile}>
            {pick(user.name, user.nameEn).slice(0, 1)}
          </span>
        </span>
      </div>

      <div className="screen">
        <div className="greeting">
          <h2>{t('greeting')}</h2>
          <p><span className="greet-name-hl">{pick(user.nameEn, user.name)}</span> · {t('organizer')}</p>
        </div>

        {/* Promotional banner carousel (centered, peek both sides) */}
        <div className="promo-carousel" ref={carouselRef}>
          {bannerSlides.map((b) => (
            <div className="promo-banner" key={b._key} style={{ background: `url(${b.img}) center/cover, ${b.grad}` }}>
              <span className="promo-scrim" />
              <div className="promo-copy">
                <span className="promo-eyebrow">{pick(b.eyebrowKo, b.eyebrowEn)}</span>
                <h3 className="promo-title">{pick(b.titleKo, b.titleEn)}</h3>
                <button className="promo-cta">{pick(b.ctaKo, b.ctaEn)} ›</button>
              </div>
              <span className="promo-page num">{b._i + 1} / {banners.length} {t('viewAll')}</span>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="home-search" role="button" tabIndex={0} onClick={onSearch}>
          <Search size={19} strokeWidth={2} className="hs-ico" />
          <span className="hs-placeholder">{t('searchPlaceholder')}</span>
          <span className="hs-divider" />
          <span className="hs-near"><MapPin size={15} strokeWidth={2} /> {t('nearby')}</span>
        </div>

        {/* Quick actions */}
        <div className="quick-row">
          {QUICK.map((q) => (
            <button className="quick" key={q.id}>
              {q.img ? (
                <span className="q-ico q-ico-img">
                  <img
                    src={q.img}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fb) {
                        e.currentTarget.dataset.fb = '1'
                        e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Trophy/3D/trophy_3d.png'
                      }
                    }}
                  />
                  {q.badge && <span className={`q-badge${q.badgeDark ? ' q-badge--dark' : ''}`}>{t(q.badge)}</span>}
                </span>
              ) : (
                <span className="q-ico" style={{ background: q.color }}>
                  <q.Icon size={21} color="#fff" strokeWidth={2.1} />
                  {q.badge && <span className={`q-badge${q.badgeDark ? ' q-badge--dark' : ''}`}>{t(q.badge)}</span>}
                </span>
              )}
              <span className="q-label">{t(q.key)}</span>
            </button>
          ))}
        </div>

        {/* Upcoming events */}
        {(() => {
          const w = t('upcoming').split(' ')
          const head = w.slice(0, -1).join(' ')
          const last = w[w.length - 1]
          return (
            <SectionHead
              title={<>{head ? head + ' ' : ''}<span className="s-title-hl">{last}</span></>}
              more={t('all')}
            />
          )
        })()}
        {events.map((ev) => {
          const left = ev.capacity - ev.joined
          const pct = Math.round((ev.joined / ev.capacity) * 100)
          return (
            <div className="event-card event-card--upcoming" key={ev.id} onClick={() => onOpenEvent(ev.id)}>
              <CourseIllust />
              <div className="ev-title-row">
                <span className={`dday ${ev.dday > 7 ? 'soft' : ''}`}>D-{ev.dday}</span>
                {ev.mine && <span className="ev-host">{pick('주최', 'Host')}</span>}
                <div className="ev-title">{pick(ev.titleKr, ev.titleEn)}</div>
                <ChevronRight size={20} className="ev-go" />
              </div>
              <div className="ev-meta">{pick(ev.course, ev.courseEn)} · {pick(ev.date, ev.dateEn)} · {ev.time}</div>
              <div className="ev-progress">
                <div className="ev-track"><span className="ev-fill" style={{ width: `${pct}%` }} /></div>
                <div className="ev-left">
                  <span className="num">{t('joinedCount', { n: ev.joined, cap: ev.capacity })} · {pick(ev.fee, ev.feeEn)}</span>
                  {left <= 3 && <span className="urgent">{t('almostFull')}</span>}
                </div>
              </div>
            </div>
          )
        })}

        {/* Popular courses — ranked horizontal rail */}
        <SectionHead title={t('popularTitle')} more={t('region')} badge={t('trending')} />
        <div className="rank-row">
          {popularCourses.map((c) => (
            <div className="rank-card" key={c.id} style={{ background: `url(${c.img}) center/cover, ${c.grad}` }}>
              <span className="rank-scrim" />
              <span className="rank-num num">{c.rank}</span>
              <div className="rank-overlay">
                <div className="rank-name">{pick(c.name, c.nameEn)}</div>
                <div className="rank-metric num">{t('courseMetric', { n: c.rounds, region: pick(c.region, c.regionEn) })}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent matches — best highlight + performance bar */}
        {(() => {
          const w = t('recent').split(' ')
          const head = w.slice(0, -1).join(' ')
          const last = w[w.length - 1]
          return (
            <SectionHead
              title={<>{head ? head + ' ' : ''}<span className="s-title-hl">{last}</span></>}
              more={t('all')}
            />
          )
        })()}
        <div className="rm-list">
          {recentMatches.map((m) => {
            const best = m.score === bestScore
            const overPar = m.score - PAR
            return (
              <div className={`score-row rmD ${best ? 'is-best' : ''}`} key={m.id}>
                <span className="sc-num num">
                  {m.score}
                  <span className="sc-unit">{t('strokeUnit')}</span>
                </span>
                <div className="sc-mid">
                  <div className="sc-course">
                    <span className="rmD-name">{pick(m.course, m.courseEn)}</span>
                    {best && <span className="rmD-badge">{t('bestRound')}</span>}
                  </div>
                  <div className="rmD-meta">
                    <span className="rmD-date num">{fmtRoundDate(m.date)}</span>
                    <span className="rmD-dot">·</span>
                    <span className={`rmD-par num ${overPar <= 0 ? 'is-under' : ''}`}>
                      {overPar > 0 ? `+${overPar}` : overPar === 0 ? 'E' : overPar}
                    </span>
                  </div>
                </div>
                <span className="sc-net num">Net {m.net.toFixed(1)}</span>
                <ChevronRight size={17} className="chev" />
              </div>
            )
          })}
        </div>

        {/* Score analysis (bottom of page) */}
        <div className="ai-card">
          <div className="ai-head">
            <span className="lbl"><BarChart3 size={16} strokeWidth={2.2} className="ai-head-ico" />{t('aiTitle')}</span>
            <span className="more">{t('more')} ›</span>
          </div>
          <div className="ai-body">
            <div className="ai-main">
              <span className="ai-cap">{t('aiCap')}</span>
              <span className="big num">{aiReport.avg}</span>
            </div>
            <div className="ai-mini">
              <div><b className="num">{aiReport.best}</b><span>{t('best')}</span></div>
              <div><b className="num">{aiReport.games}</b><span>{t('rounds')}</span></div>
            </div>
          </div>
          <div className="ai-insight">
            <span className="ai-tag"><Lightbulb size={12} strokeWidth={2.4} />{t('tip')}</span>
            <span>{pick(aiReport.insightKr, aiReport.insightEn)}</span>
          </div>
        </div>
      </div>
    </>
  )
}
