import { useState } from 'react'
import { ArrowLeft, Check, AlertCircle } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { verifyResults } from '../data/mock.js'

const CONF_META = {
  high:  { dot: 'var(--positive)',  labelKo: '확인됨',    labelEn: 'verified' },
  check: { dot: 'var(--caution)',   labelKo: '확인 필요', labelEn: 'check' },
  ok:    { dot: null,               labelKo: null,        labelEn: null },
}

export default function EventVerify({ onBack, onNext }) {
  const { lang, pick } = useLang()
  const [results, setResults] = useState(verifyResults)

  const total = results.length
  const needCheck = results.filter(r => r.conf === 'check').length

  const updateGross = (id, val) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, gross: val } : r))
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center', lineHeight: 1 }}>
          <div className="title" style={{ marginBottom: 3 }}>{lang === 'ko' ? '결과 검증' : 'Result verification'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {lang === 'ko' ? `${total}명 인식됨 · 확인 후 저장` : `${total} people recognized · Save after confirmation`}
          </div>
        </div>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        {/* Confidence banner */}
        <div className="notice-box ev-verify-banner">
          <Check size={15} strokeWidth={2.5} style={{ flexShrink: 0, color: 'var(--positive)' }} />
          <span>
            {lang === 'ko'
              ? <>전체 인식 신뢰도 <b>94%</b>. 검증이 필요한 <b>{needCheck}개</b> 항목만 확인해주세요.</>
              : <>Overall perception confidence <b>94%</b>. Please check only <b>{needCheck}</b> {needCheck === 1 ? 'item' : 'items'} requiring verification.</>}
          </span>
        </div>

        {/* Player list */}
        <div className="card ev-verify-list">
          {results.map(r => {
            const meta = CONF_META[r.conf]
            const name = lang === 'ko' ? r.nameKo : r.nameEn
            return (
              <div className="ev-verify-row" key={r.id}>
                {/* Avatar */}
                <span className="ev-verify-av" style={{ background: r.color }}>
                  {name.charAt(0)}
                </span>
                {/* Name + label */}
                <div className="ev-verify-info">
                  <span className="ev-verify-name">{name}</span>
                  <span className="ev-verify-sub">{lang === 'ko' ? '총타 입력' : 'Gross input'}</span>
                </div>
                {/* Score — fixed width so all numbers sit in the same column */}
                {r.conf === 'check'
                  ? <input
                      className="ev-verify-input num"
                      type="text"
                      inputMode="numeric"
                      value={r.gross}
                      onChange={e => updateGross(r.id, +e.target.value)}
                    />
                  : <span className="ev-verify-score num">{r.gross}</span>}
                {/* Badge */}
                {r.conf === 'ok' ? (
                  <span className="ev-verify-badge is-ok"><Check size={13} strokeWidth={2.8} /></span>
                ) : (
                  <span className={`ev-verify-badge is-${r.conf}`}>
                    <span className="ev-badge-dot" style={{ background: meta.dot }} />
                    {lang === 'ko' ? meta.labelKo : meta.labelEn}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className="sticky-cta">
          <button className="btn btn-primary btn-block" onClick={onNext}>
            {lang === 'ko' ? '일괄 저장 · 신페리오 계산' : 'Batch Save · Shinperio Calculation'}
          </button>
        </div>
      </div>
    </>
  )
}
