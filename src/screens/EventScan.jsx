import { useState } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import Scan from './Scan.jsx'

export default function EventScan({ onBack, onNext }) {
  const { lang } = useLang()
  const [showCam, setShowCam] = useState(false)

  // When camera is open, render Scan fullscreen (immersive dark UI)
  if (showCam) {
    return (
      <Scan
        onBack={() => setShowCam(false)}
        onCaptured={() => onNext()}
        onManual={() => onNext()}
      />
    )
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>
          {lang === 'ko' ? '이벤트 결과 등록' : 'Register event results'}
        </span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        <div className="card ev-scan-card">
          <div className="ev-scan-icon-wrap">
            <Camera size={32} strokeWidth={1.7} />
          </div>
          <p className="ev-scan-title">
            {lang === 'ko' ? '단체 성적표 사진' : 'Group report card photo'}
          </p>
          <p className="ev-scan-desc">
            {lang === 'ko'
              ? '캐디 단말기 또는 클럽하우스 성적표를\n사진으로 찍으면 전체 성적이 등록돼요.'
              : 'If you take a picture of the caddie tablet\nor the clubhouse scorecard,\nyour entire score is registered.'}
          </p>
          <div className="ev-scan-preview">
            <span className="ev-scan-preview-label">
              {lang === 'ko' ? '단체 성적표 미리보기' : 'group report card preview'}
            </span>
          </div>
        </div>
      </div>

      <div className="sticky-cta">
        <button className="btn btn-primary btn-block ev-scan-cta" onClick={() => setShowCam(true)}>
          <Camera size={17} strokeWidth={2.1} />
          {lang === 'ko' ? '촬영 후 일괄 등록' : 'Shoot and Bulk Register'}
        </button>
      </div>
    </>
  )
}
