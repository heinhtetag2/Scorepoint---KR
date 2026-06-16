import { useState } from 'react'
import { ArrowLeft, Crown } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubs, clubMembers } from '../data/mock.js'

export default function ClubMembers({ club, onBack }) {
  const { t, pick } = useLang()
  const c = club || clubs[0]
  const organizer = c.role === '총무'
  const [members, setMembers] = useState(clubMembers)
  const remove = (id) => setMembers((m) => m.filter((x) => x.id !== id))

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('csMembersMng')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
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
