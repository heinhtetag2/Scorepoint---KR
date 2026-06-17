import { useState } from 'react'
import { ArrowLeft, Info, Trophy, X } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { shinperioRanking, shinperioCalc, eventDetail as ev } from '../data/mock.js'

/* ── 계산 방식 (how Shinperio was calculated) bottom sheet ───── */
function CalcSheet({ onClose, lang }) {
  const c = shinperioCalc
  const hidden = new Set(c.hiddenHoles)
  const step1 = c.hiddenSum * c.multiplier           // 90
  const step2 = step1 - c.parTotal                   // 18
  const step3 = +(step2 * c.correction).toFixed(1)   // 14.4

  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="edit-sheet">
        <div className="es-grab" />
        <div className="sp-calc-head">
          <span className="es-title" style={{ flex: 1, textAlign: 'left' }}>
            {lang === 'ko' ? '신페리오 계산 방식' : 'How Shinperio is calculated'}
          </span>
          <button className="sp-calc-x" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        {/* One plain sentence */}
        <p className="sp-calc-intro">
          {lang === 'ko'
            ? <>숨은 홀 <b>12개</b>의 점수로 핸디캡을 정해요.</>
            : <><b>12</b> hidden holes set each player's handicap.</>}
        </p>

        {/* Hole grid — front / back nine */}
        {[[1, 9, lang === 'ko' ? '전반' : 'OUT'], [10, 18, lang === 'ko' ? '후반' : 'IN']].map(([from, to, lbl]) => (
          <div className="sp-calc-nine" key={lbl}>
            <span className="sp-calc-nine-lbl">{lbl}</span>
            <div className="sp-calc-grid">
              {Array.from({ length: to - from + 1 }, (_, i) => from + i).map(h => (
                <span key={h} className={`sp-calc-hole num ${hidden.has(h) ? 'is-hidden' : ''}`}>{h}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="sp-calc-legend">
          <span className="sp-calc-dot" />
          {lang === 'ko' ? '계산에 사용된 홀' : 'Used for the handicap'}
        </div>

        {/* Result */}
        <div className="sp-calc-out">
          <div className="sp-calc-out-main">
            <span className="sp-calc-out-lbl">{lang === 'ko' ? '내 핸디캡' : 'Handicap'}</span>
            <span className="sp-calc-out-hcp num">{step3}</span>
          </div>
          <span className="sp-calc-out-net num">Net 75.6 = Gross 90 − {step3}</span>
        </div>
      </div>
    </>
  )
}

export default function ShinperioResult({ onBack, onNext }) {
  const { lang, pick } = useLang()
  const [showCalc, setShowCalc] = useState(false)
  const winner = shinperioRanking[0]
  const winnerName = lang === 'ko' ? winner.nameKo : winner.nameEn

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center', lineHeight: 1 }}>
          <div className="title" style={{ marginBottom: 3 }}>{lang === 'ko' ? '신페리오 계산 결과' : 'Sinperio calculation result'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{pick(ev.titleKr, ev.titleEn)}</div>
        </div>
        <button className="icon-btn" aria-label="Calculation method" onClick={() => setShowCalc(true)}><Info size={20} strokeWidth={1.9} /></button>
      </div>

      <div className="screen">
        {/* Winner spotlight card */}
        <div className="sp-winner-card">
          <div className="sp-winner-eyebrow">
            <Trophy size={14} strokeWidth={2} />
            {lang === 'ko' ? '우승' : 'Winning'}
          </div>
          <div className="sp-winner-body">
            <span className="sp-winner-av" style={{ background: winner.color }}>
              {winnerName.charAt(0)}
            </span>
            <div className="sp-winner-info">
              <span className="sp-winner-name">{winnerName}</span>
              <span className="sp-winner-scores num">
                Gross {winner.gross}
                <span className="sp-score-sep">·</span>
                HCP {winner.hcp}
                <span className="sp-score-net"> Net {winner.net}</span>
              </span>
            </div>
          </div>
          <span className="sp-winner-deco" />
        </div>

        {/* Rankings table */}
        <div className="card sp-table">
          <div className="sp-table-head">
            <span className="sp-th-rank">{lang === 'ko' ? '순위' : 'ranking'}</span>
            <span className="sp-th-name">{lang === 'ko' ? '이름' : 'name'}</span>
            <span className="sp-th-num">Gross</span>
            <span className="sp-th-num">HCP</span>
            <span className="sp-th-num">Net</span>
          </div>

          {shinperioRanking.map(r => {
            const name = lang === 'ko' ? r.nameKo : r.nameEn
            return (
              <div className={`sp-table-row ${r.rank === 1 ? 'is-first' : ''}`} key={r.rank}>
                <span className={`sp-td-rank num ${r.rank <= 3 ? 'top' : ''}`}>{r.rank}</span>
                <span className="sp-td-name">
                  <span className="sp-row-av" style={{ background: r.color }}>{name.charAt(0)}</span>
                  <span>{name}</span>
                </span>
                <span className="sp-td-num num muted">{r.gross}</span>
                <span className="sp-td-num num muted">{r.hcp}</span>
                <span className="sp-td-num num bold">{r.net}</span>
              </div>
            )
          })}
        </div>

        <div className="sticky-cta">
          <button className="sp-award-cta" onClick={onNext}>
            <Trophy size={17} strokeWidth={2} />
            {lang === 'ko' ? '시상 결과 보기' : 'View Award Results'}
          </button>
        </div>
      </div>

      {showCalc && <CalcSheet onClose={() => setShowCalc(false)} lang={lang} />}
    </>
  )
}
