import { ArrowLeft, Share2, CalendarDays, MapPin } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { user, myRecords, roundCompanions, buildScorecard, HOLE_PARS } from '../data/mock.js'

const PAR = 72

/* Golf convention class per hole vs par → drives the cell shape/colour. */
function holeClass(stroke, par) {
  const d = stroke - par
  if (d <= -2) return 'is-eagle'
  if (d === -1) return 'is-birdie'
  if (d === 0) return 'is-par'
  if (d === 1) return 'is-bogey'
  return 'is-double'
}

function NineTable({ label, pars, holes, start, sub, t }) {
  return (
    <div className="rd-nine">
      <div className="rd-nine-head">
        <span>{label}</span>
        <span className="num">{sub}</span>
      </div>
      <div className="rd-grid">
        <div className="rd-grid-row rd-grid-head">
          <span className="rd-cell rd-cell-k">{t('rdHole')}</span>
          {holes.map((_, i) => <span className="rd-cell num" key={i}>{start + i}</span>)}
        </div>
        <div className="rd-grid-row">
          <span className="rd-cell rd-cell-k">{t('rdParRow')}</span>
          {pars.map((p, i) => <span className="rd-cell num rd-par" key={i}>{p}</span>)}
        </div>
        <div className="rd-grid-row">
          <span className="rd-cell rd-cell-k">{t('rdScoreRow')}</span>
          {holes.map((s, i) => (
            <span className={`rd-cell num rd-mark ${holeClass(s, pars[i])}`} key={i}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RecordDetail({ record, onBack }) {
  const { t, pick } = useLang()
  const r = record || myRecords[0]
  const seed = Math.max(0, myRecords.findIndex((m) => m.id === r.id))
  const { holes, out, in: inn, tally } = buildScorecard(r.score, seed)

  const toPar = r.score - PAR
  const isBest = r.score === Math.min(...myRecords.map((m) => m.score))

  // Companion comparison — merge the signed-in user in, rank by gross ascending.
  const players = [
    { id: 'me', name: user.name, nameEn: user.nameEn, gross: r.score, me: true },
    ...roundCompanions,
  ]
    .sort((a, b) => a.gross - b.gross)
    .map((p, i) => ({ ...p, rank: i + 1, diff: p.gross - r.score }))

  const summary = [
    { k: 'eagle', label: t('rdEagle'), n: tally.eagle },
    { k: 'birdie', label: t('rdBirdie'), n: tally.birdie },
    { k: 'par', label: t('rdParCount'), n: tally.par },
    { k: 'bogey', label: t('rdBogey'), n: tally.bogey },
    { k: 'double', label: t('rdDouble'), n: tally.double },
  ]

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{pick(r.course, r.courseEn)}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        {/* Hero — gross score, to-par, net */}
        <div className="card rd-hero">
          <div className="rd-hero-top">
            <div className="rd-hero-meta">
              <div className="rd-hero-row"><CalendarDays size={14} strokeWidth={1.9} /><span className="num">{r.date}</span></div>
              <div className="rd-hero-row"><MapPin size={14} strokeWidth={1.9} />{pick(r.course, r.courseEn)} · {pick(r.sub, r.subEn)}</div>
            </div>
            {isBest && <span className="rd-best">{t('bestRound')}</span>}
          </div>

          <div className="rd-figure">
            <span className="rd-gross num">{r.score}</span>
            <span className={`rd-topar num ${toPar <= 0 ? 'is-under' : ''}`}>{toPar >= 0 ? '+' : ''}{toPar}</span>
          </div>

          <div className="rd-kv">
            <div className="rd-kv-item"><span className="rd-kv-k">{t('rdGross')}</span><span className="rd-kv-v num">{r.score}</span></div>
            <div className="rd-kv-item"><span className="rd-kv-k">{t('rdNet')}</span><span className="rd-kv-v num">{r.net.toFixed(1)}</span></div>
            <div className="rd-kv-item"><span className="rd-kv-k">{t('rdHcpApplied')}</span><span className="rd-kv-v num">{user.handicap}</span></div>
          </div>
        </div>

        {/* Scorecard */}
        <div className="section-head"><span className="s-head-left"><span className="s-title">{t('rdScorecard')}</span></span></div>
        <div className="card rd-card">
          <NineTable label={t('rdOut')} sub={out} start={1} pars={HOLE_PARS.slice(0, 9)} holes={holes.slice(0, 9)} t={t} />
          <div className="rd-divider" />
          <NineTable label={t('rdIn')} sub={inn} start={10} pars={HOLE_PARS.slice(9)} holes={holes.slice(9)} t={t} />
          <div className="rd-total">
            <span className="rd-total-k">{t('rdTotal')}</span>
            <span className="rd-total-v num">{r.score} <em>({toPar >= 0 ? '+' : ''}{toPar})</em></span>
          </div>
        </div>

        {/* Round summary */}
        <div className="section-head"><span className="s-head-left"><span className="s-title">{t('rdSummary')}</span></span></div>
        <div className="card rd-summary">
          {summary.map((s) => (
            <div className="rd-sum-item" key={s.k}>
              <span className={`rd-dot rd-${s.k}`} />
              <span className="rd-sum-n num">{s.n}</span>
              <span className="rd-sum-l">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Companion comparison — ranked playing partners */}
        <div className="section-head"><span className="s-head-left"><span className="s-title">{t('rdCompare')}</span></span></div>
        <div className="card rd-cmp">
          {players.map((p) => {
            const nm = pick(p.name, p.nameEn)
            return (
              <div className={`rd-cmp-row ${p.me ? 'is-me' : ''}`} key={p.id}>
                <span className="rd-cmp-rank num">{p.rank}</span>
                <span className="rd-cmp-av" aria-hidden>{nm.trim().charAt(0)}</span>
                <span className="rd-cmp-name">
                  {nm}
                  {p.me && <span className="rd-cmp-me">{t('rdMe')}</span>}
                </span>
                {!p.me && (
                  <span className={`rd-cmp-diff num ${p.diff < 0 ? 'is-up' : ''}`}>
                    {p.diff > 0 ? '+' : ''}{p.diff}
                  </span>
                )}
                <span className="rd-cmp-score num">{t('rdStrokes', { n: p.gross })}</span>
              </div>
            )
          })}
        </div>

        {/* AI one-liner — reuses the brand-weak notice pattern */}
        <div className="notice-box rd-ai">
          <span className="rd-ai-tag">{t('rdAiNote')}</span>
          <span>{t('rdAiBody', { birdie: tally.birdie + tally.eagle, bogey: tally.bogey })}</span>
        </div>

        <div className="sticky-cta">
          <Button variant="primary" className="btn-block"><Share2 size={16} strokeWidth={2.1} style={{ marginRight: 7, verticalAlign: '-3px' }} />{t('rdShare')}</Button>
        </div>
      </div>
    </>
  )
}
