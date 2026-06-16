import { useState } from 'react'
import { ArrowLeft, Crown } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs, clubMembers, pendingApplicants } from '../data/mock.js'

export default function ClubMembers({ club, onBack }) {
  const { t, lang, pick } = useLang()
  const c = club || clubs[0]
  const organizer = c.role === '총무'
  const [members, setMembers] = useState(clubMembers)
  const [pending, setPending] = useState(pendingApplicants)
  const [actionMap, setActionMap] = useState({})

  const remove = (id) => setMembers((m) => m.filter((x) => x.id !== id))

  function approve(id) {
    setActionMap(m => ({ ...m, [id]: 'approved' }))
    setTimeout(() => setPending(p => p.filter(x => x.id !== id)), 500)
  }

  function refuse(id) {
    setActionMap(m => ({ ...m, [id]: 'refused' }))
    setTimeout(() => setPending(p => p.filter(x => x.id !== id)), 500)
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('csMembersMng')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">

        {/* ── Pending applications (NEW) ── */}
        {pending.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.3 }}>
                {lang === 'ko' ? '가입 신청' : 'Application for Membership'}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 800, color: '#fff',
                background: 'var(--negative)', borderRadius: '50%',
                width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{pending.length}</span>
            </div>

            <div className="card cd-list">
              {pendingApplicants.map((pa) => {
                const action = actionMap[pa.id]
                if (action && !pending.find(p => p.id === pa.id)) return null
                return (
                  <div className="cd-mem" key={pa.id} style={{ opacity: action ? 0.5 : 1, transition: 'opacity .3s' }}>
                    <span className="cd-mem-av" style={{ background: pa.color, color: '#fff' }}>
                      {(lang === 'ko' ? pa.nameKr : pa.nameEn).charAt(0)}
                    </span>
                    <span className="cd-mem-name" style={{ flex: 1 }}>
                      <span style={{ display: 'block' }}>{lang === 'ko' ? pa.nameKr : pa.nameEn}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 400 }}>
                        {lang === 'ko' ? '방금 신청함' : 'Just applied'}
                      </span>
                    </span>
                    {action ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: action === 'approved' ? 'var(--positive)' : 'var(--negative)' }}>
                        {action === 'approved' ? (lang === 'ko' ? '승인됨' : 'Approved') : (lang === 'ko' ? '거절됨' : 'Refused')}
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button onClick={() => refuse(pa.id)}
                          style={{
                            padding: '6px 12px', borderRadius: 9,
                            border: '1.5px solid var(--line)', background: 'var(--surface)',
                            fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
                            color: 'var(--text-2)', cursor: 'pointer',
                          }}>
                          {lang === 'ko' ? '거절' : 'refusal'}
                        </button>
                        <button onClick={() => approve(pa.id)}
                          style={{
                            padding: '6px 12px', borderRadius: 9,
                            border: 'none', background: 'var(--brand)',
                            fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700,
                            color: '#fff', cursor: 'pointer',
                          }}>
                          {lang === 'ko' ? '승인' : 'approval'}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Member list — original + count heading ── */}
        <div className="cm-count">{t('cmCount', { n: members.length })}</div>
        <div className="card cd-list">
          {members.map((m) => (
            <div className="cd-mem" key={m.id}>
              <span className="cd-mem-av">{pick(m.nameKr, m.nameEn).charAt(0)}</span>
              <span className="cd-mem-name">
                {pick(m.nameKr, m.nameEn)}
                {m.me && <span className="cd-me">{t('rdMe')}</span>}
              </span>
              {m.role === '총무'
                ? <span className="badge badge-role"><Crown size={11} strokeWidth={2.4} /> {t('organizer')}</span>
                : organizer && !m.me
                  ? <button className="cm-remove" onClick={() => remove(m.id)}>{t('cmRemove')}</button>
                  : <span className="cd-mem-hcp num">{t('cdHcp', { h: m.handicap })}</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
