import { useState, useRef } from 'react'
import { ArrowLeft, Trophy, Check, Link as LinkIcon } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import KakaoLogo from '../components/KakaoLogo.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { shinperioRanking, eventDetail as ev } from '../data/mock.js'

const MEDALS = ['🥇', '🥈', '🥉']

/* 결과 공지 만들기 — compose & share the event result announcement. */
export default function ResultNotice({ onBack, onDone }) {
  const { lang, pick } = useLang()
  const [msg, setMsg] = useState(lang === 'ko'
    ? '수고하셨습니다! 다음 모임에서 또 만나요 🏌️'
    : 'Great round, everyone! See you next time 🏌️')
  const [posted, setPosted] = useState(false)
  const timer = useRef()

  // Post → brief success confirmation → return to the event (flow complete).
  const post = () => {
    setPosted(true)
    timer.current = setTimeout(() => onDone?.(), 1300)
  }

  const top3 = shinperioRanking.slice(0, 3)

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center', lineHeight: 1 }}>
          <div className="title" style={{ marginBottom: 3 }}>{lang === 'ko' ? '결과 공지 만들기' : 'Create result notice'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{pick(ev.titleKr, ev.titleEn)}</div>
        </div>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        <div className="section-head"><span className="s-head-left"><span className="s-title">{lang === 'ko' ? '미리보기' : 'Preview'}</span></span></div>

        {/* Shareable result card */}
        <div className="rn-card">
          <span className="rn-deco rn-deco-1" />
          <span className="rn-deco rn-deco-2" />
          <div className="rn-card-head">
            <span className="rn-brand">ScoreShot</span>
            <Trophy size={22} strokeWidth={1.6} className="rn-card-trophy" />
          </div>
          <div className="rn-card-title">{pick(ev.titleKr, ev.titleEn)}</div>
          <div className="rn-card-sub">{pick(ev.date, ev.dateEn)} · {pick(ev.course, ev.courseEn)}</div>

          <div className="rn-divider" />

          {top3.map((r, i) => (
            <div className="rn-rank" key={r.rank}>
              <span className="rn-medal">{MEDALS[i]}</span>
              <span className="rn-name">{lang === 'ko' ? r.nameKo : r.nameEn}</span>
              <span className="rn-net num">Net {r.net}</span>
            </div>
          ))}

          {msg.trim() && <div className="rn-msg">{msg}</div>}
        </div>

        {/* Editable message */}
        <div className="section-head"><span className="s-head-left"><span className="s-title">{lang === 'ko' ? '공지 메시지' : 'Message'}</span></span></div>
        <textarea
          className="rn-input"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={2}
          placeholder={lang === 'ko' ? '한마디 남겨보세요' : 'Add a message'}
        />

        {/* Share row */}
        <div className="rn-share">
          <button className="rn-share-btn kakao"><KakaoLogo size={19} /><span>{lang === 'ko' ? '카카오톡' : 'KakaoTalk'}</span></button>
          <button className="rn-share-btn"><LinkIcon size={18} strokeWidth={2} /><span>{lang === 'ko' ? '링크 복사' : 'Copy link'}</span></button>
        </div>

        <div className="sticky-cta">
          {posted ? (
            <button disabled className="btn btn-block settle-done">
              <Check size={18} strokeWidth={2.5} />
              {lang === 'ko' ? '공지를 올렸어요' : 'Notice posted'}
            </button>
          ) : (
            <Button variant="primary" className="btn-block" onClick={post}>
              {lang === 'ko' ? '클럽에 공지 올리기' : 'Post to club'}
            </Button>
          )}
        </div>
      </div>

      {posted && (
        <div className="app-toast" role="status">
          <Check size={15} strokeWidth={2.8} />
          {lang === 'ko' ? '클럽에 공지를 올렸어요' : 'Posted to the club'}
        </div>
      )}
    </>
  )
}
