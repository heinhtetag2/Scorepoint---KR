import { useState, useRef } from 'react'
import { ArrowLeft, Wand2, X, Clock, Check, ArrowLeftRight } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { eventGroups, eventDetail as ev } from '../data/mock.js'

const TEE_TIMES = eventGroups.map((g) => g.tee)

const toGroups = (flat) => {
  const out = []
  for (let i = 0; i < flat.length; i += 4) {
    out.push({ tee: TEE_TIMES[out.length] ?? '', members: flat.slice(i, i + 4) })
  }
  return out
}

const avgHcp = (members) => (members.reduce((s, m) => s + m.hcp, 0) / members.length).toFixed(1)

export default function GroupFormation({ onBack }) {
  const { lang, pick } = useLang()
  const [groups, setGroups] = useState(eventGroups)
  const [forming, setForming] = useState(false)
  const [toast, setToast] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sel, setSel] = useState(null)            // {gi, mi} currently picked for a swap
  const [crit, setCrit] = useState({ balance: true, exclude: true, newbie: false })
  const [showSheet, setShowSheet] = useState(false)
  const [prompt, setPrompt] = useState('')        // optional free-text request for the AI
  const [cycle, setCycle] = useState(0)           // bumps each form → replays entrance animation
  const timer = useRef()

  const total = groups.reduce((n, g) => n + g.members.length, 0)

  const CRITS = [
    { id: 'balance', ko: '핸디캡 균형', en: 'Handicap balance' },
    { id: 'exclude', ko: '최근 동반자 제외', en: 'Exclude recent partners' },
    { id: 'newbie', ko: '신규 회원 배려', en: 'New-member care' },
  ]
  const toggleCrit = (id) => setCrit((c) => ({ ...c, [id]: !c[id] }))

  // Tap two players to swap their positions (across any groups).
  const tap = (gi, mi) => {
    if (!sel) { setSel({ gi, mi }); return }
    if (sel.gi === gi && sel.mi === mi) { setSel(null); return }
    setGroups((prev) => {
      const next = prev.map((g) => ({ ...g, members: [...g.members] }))
      const a = next[sel.gi].members[sel.mi]
      next[sel.gi].members[sel.mi] = next[gi].members[mi]
      next[gi].members[mi] = a
      return next
    })
    setSel(null)
    setSaved(false)   // edited after saving → allow re-saving
  }

  const generate = () => {
    setShowSheet(false)
    autoForm()
  }

  const autoForm = () => {
    if (forming) return
    setForming(true); setSel(null); setSaved(false)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const flat = groups.flatMap((g) => g.members)
      setGroups(toGroups([...flat.slice(5), ...flat.slice(0, 5)]))
      setForming(false)
      setCycle((c) => c + 1)
      setToast(true)
      setTimeout(() => setToast(false), 1800)
    }, 1400)
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center', lineHeight: 1 }}>
          <div className="title" style={{ marginBottom: 3 }}>{lang === 'ko' ? '조 편성' : 'Group formation'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{pick(ev.titleKr, ev.titleEn)}</div>
        </div>
        <button className={`icon-btn gf-magic ${forming ? 'is-forming' : ''}`} onClick={() => setShowSheet(true)}
          aria-label={lang === 'ko' ? 'AI 자동 편성' : 'AI auto-form'}
          title={lang === 'ko' ? 'AI 자동 편성' : 'AI auto-form'}>
          <Wand2 size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="screen">
        {/* Swap hint / forming indicator */}
        {forming ? (
          <div className="gf-hint is-forming">
            <Wand2 size={13} strokeWidth={2} />
            {lang === 'ko' ? 'AI가 균형있게 편성하고 있어요' : 'AI is balancing the groups'}
            <span className="gf-dots"><i /><i /><i /></span>
          </div>
        ) : (
          <div className={`gf-hint ${sel ? 'is-active' : ''}`}>
            <ArrowLeftRight size={13} strokeWidth={2} />
            {sel
              ? (lang === 'ko' ? '바꿀 선수를 한 명 더 선택하세요' : 'Pick another player to swap')
              : (lang === 'ko' ? '선수를 탭해 자리를 바꿀 수 있어요' : 'Tap players to swap positions')}
          </div>
        )}

        {/* Group cards */}
        <div className={`gf-groups ${forming ? 'is-forming' : ''}`} key={cycle}>
          {groups.map((g, gi) => (
            <div className="gf-group card" key={gi}>
              <div className="gf-group-head">
                <span className="gf-group-name">{lang === 'ko' ? `${gi + 1}조` : `Group ${gi + 1}`}</span>
                <span className="gf-group-tee num"><Clock size={12} strokeWidth={2} />{lang === 'ko' ? '1번홀' : 'Hole 1'} · {g.tee}</span>
              </div>

              <div className="gf-grid">
                {g.members.map((m, mi) => {
                  const isSel = sel && sel.gi === gi && sel.mi === mi
                  const name = lang === 'ko' ? m.nameKo : m.nameEn
                  return (
                    <button key={mi} className={`gf-card ${isSel ? 'selected' : ''}`} onClick={() => tap(gi, mi)}
                      style={{ '--gf-delay': `${(gi * 4 + mi) * 40}ms` }}>
                      <span className="gf-card-av" style={{ background: m.color }}>{name.charAt(0)}</span>
                      <span className="gf-card-info">
                        <span className="gf-card-name">{name}</span>
                        <span className="gf-card-hcp num">{lang === 'ko' ? `핸디 ${m.hcp}` : `HCP ${m.hcp}`}</span>
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="gf-foot">
                {lang === 'ko' ? '조 평균 핸디' : 'Group avg handicap'}
                <b className="num">{avgHcp(g.members)}</b>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky-cta">
          {saved ? (
            <div className="gf-saved-bar">
              <span className="gf-saved-status">
                <Check size={17} strokeWidth={2.5} />
                {lang === 'ko' ? '저장됨' : 'Saved'}
              </span>
              <button className="gf-edit-btn" onClick={() => setSaved(false)}>
                {lang === 'ko' ? '수정하기' : 'Edit'}
              </button>
            </div>
          ) : (
            <Button variant="primary" className="btn-block" onClick={() => setSaved(true)}>
              {lang === 'ko' ? '편성 저장하기' : 'Save groups'}
            </Button>
          )}
        </div>
      </div>

      {/* AI auto-form bottom sheet */}
      {showSheet && (
        <>
          <div className="sheet-scrim" onClick={() => setShowSheet(false)} />
          <div className="edit-sheet gf-sheet">
            <div className="es-grab" />
            <div className="gf-sheet-head">
              <span className="gf-sheet-title">
                {lang === 'ko' ? 'AI 자동 편성' : 'AI auto-form'}
              </span>
              <button className="gf-sheet-x" onClick={() => setShowSheet(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <p className="gf-sheet-desc">
              {lang === 'ko'
                ? '선택한 기준으로 AI가 조를 균형있게 편성해요.'
                : 'AI forms balanced groups based on the criteria you pick.'}
            </p>
            <div className="gf-crit-row gf-sheet-crit">
              {CRITS.map((c) => (
                <button key={c.id} className={`gf-crit ${crit[c.id] ? 'active' : ''}`} onClick={() => toggleCrit(c.id)}>
                  {crit[c.id] && <Check size={12} strokeWidth={2.8} />}
                  {lang === 'ko' ? c.ko : c.en}
                </button>
              ))}
            </div>
            <label className="gf-prompt-label">
              {lang === 'ko' ? '추가 요청' : 'Extra request'}
              <span className="gf-prompt-opt">{lang === 'ko' ? '선택' : 'optional'}</span>
            </label>
            <textarea
              className="gf-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder={lang === 'ko'
                ? '예) 초보자는 경험자와 같은 조로 묶어주세요'
                : 'e.g. Pair beginners with experienced players'}
            />
            <button className="gf-generate" onClick={generate}>
              <Wand2 size={17} strokeWidth={2.1} />
              {lang === 'ko' ? 'AI로 편성하기' : 'Generate with AI'}
            </button>
          </div>
        </>
      )}

      {toast && (
        <div className="app-toast" role="status">
          <Wand2 size={14} strokeWidth={2.4} />
          {lang === 'ko' ? 'AI가 균형있게 편성했어요' : 'AI balanced the groups'}
        </div>
      )}
    </>
  )
}
