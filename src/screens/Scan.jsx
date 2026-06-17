import { useState } from 'react'
import { X, Images, Pencil, Lightbulb } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

/* Capture scanner. Score variant has two modes — the in-cart 스코어 단말기
   (tablet) and paper 스코어카드. Receipt variant scans an expense receipt:
   single mode, no tabs, receipt-shaped frame. */
export default function Scan({ onBack, onCaptured, onManual, variant = 'score' }) {
  const { t, lang } = useLang()
  const isReceipt = variant === 'receipt'
  const [mode, setMode] = useState('tablet')
  const [busy, setBusy] = useState(false)

  const MODES = [
    { id: 'tablet', label: t('scanTablet') },
    { id: 'card', label: t('scanCard') },
  ]
  const title = isReceipt ? (lang === 'ko' ? '영수증 스캔' : 'Receipt scan') : t('scoreRegister')
  const hint = isReceipt
    ? (lang === 'ko' ? '영수증을 프레임 안에 맞춰주세요' : 'Fit the receipt inside the frame')
    : (mode === 'tablet' ? t('scanHintTablet') : t('scanHintCard'))
  const frameClass = isReceipt ? 'is-receipt' : `is-${mode}`

  const capture = () => {
    if (busy) return
    setBusy(true)
    setTimeout(() => onCaptured?.(mode), 1300) // simulate recognition
  }

  return (
    <div className="scan-screen">
      <div className="scan-top">
        <button className="scan-x" onClick={onBack} aria-label="Close"><X size={22} /></button>
        <span className="scan-title">{title}</span>
        <span className="scan-x" aria-hidden style={{ visibility: 'hidden' }}><X size={22} /></span>
      </div>

      {!isReceipt && (
        <div className="scan-seg" role="tablist">
          {MODES.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              className={`scan-seg-item ${mode === m.id ? 'active' : ''}`}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      <div className="scan-view">
        <div className="scan-auto"><Lightbulb size={13} strokeWidth={2} /> {t('scanTip')}</div>

        <div className={`scan-frame ${frameClass}`}>
          <span className="scan-corner tl" /><span className="scan-corner tr" />
          <span className="scan-corner bl" /><span className="scan-corner br" />
          <div className="scan-mock" aria-hidden>
            {isReceipt ? (
              <div className="scan-mock-receipt">
                {Array.from({ length: 7 }).map((_, i) => <span key={i} className="smr-row" />)}
              </div>
            ) : mode === 'tablet' ? (
              <div className="scan-mock-tablet">
                {Array.from({ length: 4 }).map((_, i) => <span key={i} className="smt-row" />)}
              </div>
            ) : (
              <div className="scan-mock-card">
                {Array.from({ length: 10 }).map((_, i) => <span key={i} className="smc-col" />)}
              </div>
            )}
          </div>
          <div className="scan-laser" />
        </div>

        <div className="scan-hint">{hint}</div>
      </div>

      <div className="scan-controls">
        <button className="scan-aux">
          <span className="scan-aux-ico"><Images size={20} strokeWidth={1.9} /></span>
          <span className="scan-aux-l">{t('scanGallery')}</span>
        </button>
        <button className="scan-shutter" aria-label="Capture" onClick={capture}><span /></button>
        {/* Manual entry hidden when no handler (e.g. event result bulk scan) */}
        <button className="scan-aux" onClick={onManual}
          style={onManual ? undefined : { visibility: 'hidden', pointerEvents: 'none' }}>
          <span className="scan-aux-ico"><Pencil size={19} strokeWidth={1.9} /></span>
          <span className="scan-aux-l">{t('scanManual')}</span>
        </button>
      </div>

      {busy && (
        <div className="scan-processing">
          <span className="scan-spinner" />
          <span className="scan-proc-label">{t('scanProcessing')}</span>
        </div>
      )}
    </div>
  )
}
