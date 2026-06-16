import { useState } from 'react'
import { ArrowLeft, Check, X } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs, clubMembersFull, pendingApplicants } from '../data/mock.js'

const ROLE_STYLE = {
  owner:      { bg: '#FFF3DC', color: '#B45309', label: { ko: '오너', en: 'Owner' } },
  general:    { bg: '#DCFCE7', color: '#15803D', label: { ko: '총무', en: 'General Affairs' } },
  management: { bg: '#EDE9FE', color: '#7C3AED', label: { ko: '운영진', en: 'Management' } },
  member:     { bg: 'transparent', color: 'var(--text-3)', label: { ko: 'member', en: 'member' } },
}

function RoleBadge({ roleKey, lang }) {
  const s = ROLE_STYLE[roleKey] || ROLE_STYLE.member
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8, flexShrink: 0,
      background: s.bg, color: s.color,
      border: roleKey === 'member' ? '1px solid var(--line)' : 'none',
    }}>
      {lang === 'ko' ? s.label.ko : s.label.en}
    </span>
  )
}

function MemberAvatar({ initials, color, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: size * 0.3, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>
        {initials}
      </span>
    </div>
  )
}

export default function ClubMembers({ club, onBack }) {
  const { t, lang, pick } = useLang()
  const c = club || clubs[0]

  const [pending, setPending] = useState(pendingApplicants)
  const [members, setMembers] = useState(clubMembersFull)
  const [actionMap, setActionMap] = useState({}) // id → 'approved' | 'refused'

  function approve(id) {
    const applicant = pending.find(p => p.id === id)
    setActionMap(m => ({ ...m, [id]: 'approved' }))
    setTimeout(() => {
      setPending(p => p.filter(x => x.id !== id))
      if (applicant) {
        setMembers(m => [...m, {
          ...applicant,
          id: `cf${Date.now()}`,
          roleKey: 'member', handicap: '--', avg: '--', paid: false,
        }])
      }
    }, 600)
  }

  function refuse(id) {
    setActionMap(m => ({ ...m, [id]: 'refused' }))
    setTimeout(() => {
      setPending(p => p.filter(x => x.id !== id))
    }, 500)
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>
          {lang === 'ko' ? '멤버 관리' : 'Member Management'}
        </span>
        <span style={{ width: 36 }} />
      </div>

      <div className="screen">

        {/* ── Pending applications ── */}
        {pending.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', margin: 0, letterSpacing: -0.3 }}>
                {lang === 'ko' ? '가입 신청' : 'Application for Membership'}
              </h3>
              <span style={{
                fontSize: 12, fontWeight: 800, color: '#fff',
                background: 'var(--negative)', borderRadius: '50%',
                width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {pending.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {pendingApplicants.map((pa) => {
                const action = actionMap[pa.id]
                const isGone = !pending.find(p => p.id === pa.id) && action
                if (isGone) return null
                return (
                  <div key={pa.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 0', borderBottom: '1px solid var(--line)',
                    opacity: action ? 0.5 : 1, transition: 'opacity .3s',
                  }}>
                    <MemberAvatar initials={pa.initials} color={pa.color} size={46} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: -0.2 }}>
                        {lang === 'ko' ? pa.nameKr : pa.nameEn}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '3px 0 0' }}>
                        {lang === 'ko' ? '방금 신청함' : 'Just applied'}
                      </p>
                    </div>
                    {action === 'approved' ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--positive)' }}>
                        {lang === 'ko' ? '승인됨' : 'Approved'}
                      </span>
                    ) : action === 'refused' ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--negative)' }}>
                        {lang === 'ko' ? '거절됨' : 'Refused'}
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button onClick={() => refuse(pa.id)}
                          style={{
                            padding: '7px 14px', borderRadius: 10,
                            border: '1.5px solid var(--line)', background: 'var(--surface)',
                            fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
                            color: 'var(--text-2)', cursor: 'pointer',
                          }}>
                          {lang === 'ko' ? '거절' : 'refusal'}
                        </button>
                        <button onClick={() => approve(pa.id)}
                          style={{
                            padding: '7px 14px', borderRadius: 10,
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

        {/* ── Member list ── */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', margin: '8px 0 12px', letterSpacing: -0.3 }}>
            {lang === 'ko' ? `회원 ${members.length}명` : `Member ${members.length}`}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {members.map((m) => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 0', borderBottom: '1px solid var(--line)',
              }}>
                {m.initials && m.color
                  ? <MemberAvatar initials={m.initials} color={m.color} size={44} />
                  : (
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                        {(lang === 'ko' ? m.nameKr : m.nameEn || '').charAt(0)}
                      </span>
                    </div>
                  )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: -0.2 }}>
                    {lang === 'ko' ? (m.nameKr || m.nameKo) : (m.nameEn || m.nameKr || '')}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '3px 0 0' }}>
                    {m.handicap !== '--'
                      ? (lang === 'ko' ? `핸디 ${m.handicap} · Active` : `Handy ${m.handicap} · Active`)
                      : (lang === 'ko' ? '신규 멤버' : 'New member')}
                  </p>
                </div>
                <RoleBadge roleKey={m.roleKey || 'member'} lang={lang} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 40 }} />
      </div>
    </>
  )
}
