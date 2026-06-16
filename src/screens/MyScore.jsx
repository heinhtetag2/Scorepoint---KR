import { SlidersHorizontal, ScanLine, ChevronRight, TrendingDown } from 'lucide-react'
import { SectionHead } from '../components/ui.jsx'
import Spark from '../components/Spark.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { user, scoreTrend, myRecords } from '../data/mock.js'

const PAR = 72

export default function MyScore({ onOpenRecord, onScan }) {
  const { t, pick } = useLang()

  // Improvement = older half avg − recent half avg (lower score is better)
  const half = Math.floor(scoreTrend.length / 2)
  const mean = (arr) => arr.reduce((s, n) => s + n, 0) / arr.length
  const improved = (mean(scoreTrend.slice(0, half)) - mean(scoreTrend.slice(half))).toFixed(1)
  const toPar = (user.avg - PAR).toFixed(1)
  const bestScore = Math.min(...myRecords.map((r) => r.score))

  // Home signature: highlight the last word of a section title in brand color
  const hl = (text) => {
    const w = text.split(' ')
    if (w.length < 2) return text
    return <>{w.slice(0, -1).join(' ')} <span className="ms-hl">{w[w.length - 1]}</span></>
  }

  return (
    <>
      <div className="appbar">
        <span className="title">{t('navScore')}</span>
        <span className="actions"><SlidersHorizontal size={20} strokeWidth={1.8} /></span>
      </div>

      <div className="screen ms-screen">
        {/* Hero — average score */}
        <div className="ms-hero">
          <div className="ms-hero-label">{t('avgScore')} · {t('hcp', { h: user.handicap })}</div>
          <div className="ms-hero-figure">
            <span className="ms-hero-num num">{user.avg}</span>
            {improved > 0 && (
              <span className="ms-hero-delta">
                <TrendingDown size={13} strokeWidth={2.6} />
                {t('improveShort', { n: improved })}
              </span>
            )}
          </div>
          <div className="ms-kv">
            <div className="ms-kv-row"><span className="ms-kv-k">{t('kvBest')}</span><span className="ms-kv-v num">{user.best}</span></div>
            <div className="ms-kv-row"><span className="ms-kv-k">{t('parLabel')}</span><span className="ms-kv-v num">+{toPar}</span></div>
            <div className="ms-kv-row"><span className="ms-kv-k">{t('kvRounds')}</span><span className="ms-kv-v num">{user.games}</span></div>
          </div>
        </div>

        <div className="ms-band" />

        {/* Trend */}
        <div className="ms-trend-head">
          <span className="ms-trend-title">{hl(t('trendTitle'))}</span>
          <span className="ms-trend-badge"><TrendingDown size={13} strokeWidth={2.4} /> {t('improving')}</span>
        </div>
        <div className="ms-chart"><Spark points={scoreTrend} w={300} h={120} strokeWidth={2.6} area showLast gradId="msTrend" /></div>
        <div className="ms-axis"><span>{t('axisStart')}</span><span>{t('axisEnd')}</span></div>

        <div className="ms-band" />

        {/* Records */}
        <SectionHead title={hl(t('records'))} more={t('all')} />
        <div className="ms-recs">
          {myRecords.map((r) => {
            const d = r.score - PAR
            const isBest = r.score === bestScore
            return (
              <div className={`ms-rec ${isBest ? 'is-best' : ''}`} key={r.id} onClick={() => onOpenRecord?.(r)} role="button" tabIndex={0}>
                <div className="ms-rec-score">
                  <b className="num">{r.score}</b>
                  <span className="ms-diff num">{d >= 0 ? '+' : ''}{d}</span>
                </div>
                <div className="ms-rec-mid">
                  <div className="ms-rec-course">
                    {pick(r.course, r.courseEn)} · {pick(r.sub, r.subEn)}
                    {isBest && <span className="ms-best-tag">{t('bestRound')}</span>}
                  </div>
                  <div className="ms-rec-meta num">{r.date} · Net {r.net.toFixed(1)}</div>
                </div>
                <ChevronRight size={17} className="chev" />
              </div>
            )
          })}
        </div>

      </div>

      {/* Floating action button — score registration */}
      <button className="ms-fab" onClick={onScan}><ScanLine size={17} strokeWidth={2.2} /> {t('scoreRegister')}</button>
    </>
  )
}
