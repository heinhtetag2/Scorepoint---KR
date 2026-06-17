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

function NineTable({ label, pars, holes, start, t }) {
  const parSum = pars.reduce((a, b) => a + b, 0)
  const scoreSum = holes.reduce((a, b) => a + b, 0)
  return (
    <div className="rd-nine">
      <div className="rd-grid">
        <div className="rd-grid-row rd-grid-head">
          <span className="rd-cell rd-cell-k">{t('rdHole')}</span>
          {holes.map((_, i) => <span className="rd-cell num" key={i}>{start + i}</span>)}
          <span className="rd-cell rd-cell-tot">{label}</span>
        </div>
        <div className="rd-grid-row">
          <span className="rd-cell rd-cell-k">{t('rdParRow')}</span>
          {pars.map((p, i) => <span className="rd-cell num rd-par" key={i}>{p}</span>)}
          <span className="rd-cell num rd-par rd-cell-tot">{parSum}</span>
        </div>
        <div className="rd-grid-row">
          <span className="rd-cell rd-cell-k">{t('rdScoreRow')}</span>
          {holes.map((s, i) => (
            <span className={`rd-cell num rd-mark ${holeClass(s, pars[i])}`} key={i}>{s}</span>
          ))}
          <span className="rd-cell num rd-cell-tot rd-tot-score">{scoreSum}</span>
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
          <svg className="rd-illust" viewBox="0 0 260 150" preserveAspectRatio="none" fill="none" aria-hidden="true">
            {/* sun + rays */}
            <circle cx="38" cy="34" r="12" fill="currentColor" opacity="0.5" />
            <path d="M38 13 V7 M16 34 H10 M22 18 L18 14 M22 50 L18 54 M54 18 L58 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.38" />
            {/* birds */}
            <path d="M104 26 Q108 22 112 26 Q116 22 120 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M132 34 Q135 31 138 34 Q141 31 144 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            {/* cloud */}
            <ellipse cx="206" cy="28" rx="18" ry="6" fill="currentColor" opacity="0.2" />
            {/* hills — three layers, full width */}
            <path d="M0 96 Q60 70 130 88 Q200 104 260 82 L260 150 L0 150 Z" fill="currentColor" opacity="0.26" />
            <path d="M0 114 Q70 86 150 102 Q212 114 260 96 L260 150 L0 150 Z" fill="currentColor" opacity="0.44" />
            <path d="M0 132 Q80 108 162 120 Q220 128 260 112 L260 150 L0 150 Z" fill="currentColor" />
            {/* bunker */}
            <ellipse cx="86" cy="128" rx="16" ry="4.5" fill="currentColor" opacity="0.3" />
            {/* flag on the green */}
            <path d="M198 74 V118" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            <path d="M198 74 L220 81 L198 88 Z" fill="currentColor" />
            {/* golf ball */}
            <circle cx="150" cy="120" r="4" fill="currentColor" opacity="0.9" />
            {/* trees + bush */}
            <path d="M26 124 V106" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
            <circle cx="26" cy="100" r="9" fill="currentColor" opacity="0.78" />
            <path d="M48 126 V114" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.78" />
            <circle cx="48" cy="109" r="6.5" fill="currentColor" opacity="0.66" />
          </svg>
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
          <NineTable label={t('rdOut')} start={1} pars={HOLE_PARS.slice(0, 9)} holes={holes.slice(0, 9)} t={t} />
          <div className="rd-divider" />
          <NineTable label={t('rdIn')} start={10} pars={HOLE_PARS.slice(9)} holes={holes.slice(9)} t={t} />
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
