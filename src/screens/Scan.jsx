import { useState } from 'react'
import { X, Images, Pencil, Lightbulb } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

/* Score-capture scanner. Two modes — the in-cart 스코어 단말기 (tablet/report
   card) and the paper 스코어카드 — each with its own guide frame + hint. */
export default function Scan({ onBack, onCaptured, onManual }) {
  const { t } = useLang()
  const [mode, setMode] = useState('tablet')
  const [busy, setBusy] = useState(false)

  const MODES = [
    { id: 'tablet', label: t('scanTablet') },
    { id: 'card', label: t('scanCard') },
  ]
  const hint = mode === 'tablet' ? t('scanHintTablet') : t('scanHintCard')

  const capture = () => {
    if (busy) return
    setBusy(true)
    setTimeout(() => onCaptured?.(mode), 1300) // simulate recognition
  }

  return (
    <div className="scan-screen">
      <div className="scan-top">
        <button className="scan-x" onClick={onBack} aria-label="Close"><X size={22} /></button>
        <span className="scan-title">{t('scoreRegister')}</span>
        <span className="scan-x" aria-hidden style={{ visibility: 'hidden' }}><X size={22} /></span>
      </div>

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

      <div className="scan-view">
        <div className="scan-auto"><Lightbulb size={13} strokeWidth={2} /> {t('scanTip')}</div>

        <div className={`scan-frame is-${mode}`}>
          <span className="scan-corner tl" /><span className="scan-corner tr" />
          <span className="scan-corner bl" /><span className="scan-corner br" />
          <div className="scan-mock" aria-hidden>
            {mode === 'tablet' ? (
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
        <button className="scan-aux" onClick={onManual}>
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
