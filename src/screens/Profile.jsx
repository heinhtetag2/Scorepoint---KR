import {
  Settings, User, Flag, Bell, Wallet, Globe, CircleHelp, LogOut, ChevronRight,
} from 'lucide-react'
import { SectionHead } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { user, clubs } from '../data/mock.js'

const SETTINGS = [
  { id: 's1', key: 'setNoti', Icon: Bell },
  { id: 's2', key: 'setPay', Icon: Wallet, accent: true },
  { id: 's3', key: 'setLang', Icon: Globe, langValue: true },
  { id: 's4', key: 'setHelp', Icon: CircleHelp },
]

export default function Profile() {
  const { t, lang, pick, toggle } = useLang()

  return (
    <>
      <div className="appbar">
        <span className="title">{t('navMy')}</span>
        <span className="actions"><Settings size={20} strokeWidth={1.8} /></span>
      </div>

      <div className="screen">
        {/* Identity */}
        <div className="card profile-card">
          <div className="avatar"><User size={26} strokeWidth={1.8} /></div>
          <div>
            <div className="p-name">
              {pick(user.name, user.nameEn)}
              <span className="handi num">{t('hcp', { h: user.handicap })}</span>
            </div>
            <div className="p-sub">{t('profileSub', { name: pick(user.nameEn, user.name), y: user.joinedYears })}</div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="card stat-strip">
          <div className="stat"><div className="st-val num">{user.avg}</div><div className="st-lbl">{t('avg')}</div></div>
          <div className="stat"><div className="st-val num">{user.best}</div><div className="st-lbl">{t('best')}</div></div>
          <div className="stat"><div className="st-val num">{user.games}</div><div className="st-lbl">{t('rounds')}</div></div>
        </div>

        {/* Clubs */}
        <SectionHead title={t('myClubs', { n: clubs.length })} more={t('all')} />
        <div className="list">
          {clubs.map((c) => (
            <div className="club-row" key={c.id}>
              <div className="cr-ico"><Flag size={17} strokeWidth={1.9} /></div>
              <div className="cr-name">
                {pick(c.nameKr, c.nameEn)}
                <small>{t('membersN', { n: c.members, role: c.roleEn })}</small>
              </div>
              {c.role === '총무' && <span className="badge badge-role">{t('organizer')}</span>}
              {c.unpaid > 0 && <span className="badge badge-unpaid num">{t('unpaidN', { n: c.unpaid })}</span>}
            </div>
          ))}
        </div>

        {/* Settings */}
        <SectionHead title={t('settings')} />
        <div className="list">
          {SETTINGS.map((s) => (
            <div
              className="list-row"
              key={s.id}
              onClick={s.langValue ? toggle : undefined}
              style={s.langValue ? { cursor: 'pointer' } : undefined}
            >
              <s.Icon size={18} strokeWidth={1.8} className={`lr-ico ${s.accent ? 'accent' : ''}`} />
              <span className="lr-label">{t(s.key)}</span>
              {s.langValue && <span className="lr-value accent">{lang === 'ko' ? '한국어' : 'English'}</span>}
              <ChevronRight size={17} className="chev" />
            </div>
          ))}
          <div className="list-row danger">
            <LogOut size={18} strokeWidth={1.8} className="lr-ico danger" />
            <span className="lr-label">{t('logout')}</span>
          </div>
        </div>
      </div>
    </>
  )
}
