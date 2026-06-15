import { useState, useEffect } from 'react'
import {
  Pencil, ChevronRight, Wallet, Crown, Award, Bell, Globe, Headphones,
  FileText, Info, LogOut,
} from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { user, account } from '../data/mock.js'
import {
  ProfileEdit, Points, Badges, Membership, Payments,
  NotificationSettings, LanguageSettings, CustomerCenter, Terms,
} from './ProfileScreens.jsx'

/* Grouped menu — each row routes to a pushed sub-screen (or shows a value). */
const MENU = [
  {
    group: 'pGroupActivity',
    rows: [
      { id: 'pay', key: 'mPay', Icon: Wallet, to: 'pay' },
      { id: 'tier', key: 'mTier', Icon: Crown, to: 'tier', valueKey: 'tier' },
      { id: 'badges', key: 'mBadges', Icon: Award, to: 'badges' },
    ],
  },
  {
    group: 'pGroupSettings',
    rows: [
      { id: 'noti', key: 'mNoti', Icon: Bell, to: 'noti' },
      { id: 'lang', key: 'mLang', Icon: Globe, to: 'lang', valueKey: 'lang' },
    ],
  },
  {
    group: 'pGroupSupport',
    rows: [
      { id: 'help', key: 'mHelp', Icon: Headphones, to: 'help' },
      { id: 'terms', key: 'mTerms', Icon: FileText, to: 'terms' },
      { id: 'version', key: 'mVersion', Icon: Info, value: '1.0.0' },
    ],
  },
]

export default function Profile({ onPushedChange }) {
  const { t, lang, pick } = useLang()
  const [sub, setSub] = useState(null)
  const [coach, setCoach] = useState(true)

  // Tell the shell to hide the bottom nav while a sub-screen is open.
  useEffect(() => {
    onPushedChange?.(sub !== null)
    return () => onPushedChange?.(false)
  }, [sub, onPushedChange])

  const back = () => setSub(null)
  if (sub === 'edit') return <ProfileEdit onBack={back} />
  if (sub === 'pay') return <Payments onBack={back} />
  if (sub === 'tier') return <Membership onBack={back} />
  if (sub === 'badges') return <Badges onBack={back} />
  if (sub === 'points') return <Points onBack={back} />
  if (sub === 'noti') return <NotificationSettings onBack={back} />
  if (sub === 'lang') return <LanguageSettings onBack={back} />
  if (sub === 'help') return <CustomerCenter onBack={back} />
  if (sub === 'terms') return <Terms onBack={back} />

  const valueFor = (vk) =>
    vk === 'tier' ? pick(account.tierKo, account.tierEn) :
    vk === 'lang' ? (lang === 'ko' ? '한국어' : 'English') : null

  const STATS = [
    { id: 'points', label: t('pPoints'), value: account.points.toLocaleString(), to: 'points' },
    { id: 'coupons', label: t('pCoupons'), value: t('pCouponsN', { n: account.coupons }), to: null },
    { id: 'tier', label: t('pTier'), value: pick(account.tierKo, account.tierEn), to: 'tier' },
    { id: 'badges', label: t('pBadges'), value: account.badges, to: 'badges' },
  ]

  return (
    <>
      <div className="appbar">
        <span className="title">{t('profileTitle')}</span>
      </div>

      <div className="screen profile-screen">
        {/* Identity header → edit */}
        <div className="pf-head" onClick={() => setSub('edit')}>
          <div className="pf-avatar-wrap">
            <span className="pf-avatar">{pick(user.name, user.nameEn).slice(0, 1)}</span>
            <span className="pf-avatar-edit"><Pencil size={12} strokeWidth={2.4} /></span>
          </div>
          <div className="pf-id">
            <div className="pf-name">
              {pick(user.name, user.nameEn)}
              <span className="handi num">{t('hcp', { h: user.handicap })}</span>
            </div>
            <div className="pf-sub">{pick(account.introKo, account.introEn)}</div>
          </div>
          <ChevronRight size={20} className="pf-go" />
          {coach && (
            <button className="pf-coach" onClick={(e) => { e.stopPropagation(); setCoach(false) }}>
              {t('profileEditCoach')}
            </button>
          )}
        </div>

        {/* Quick stats */}
        <div className="pf-stats">
          {STATS.map((s, i) => (
            <button
              key={s.id}
              className="pf-stat"
              onClick={() => s.to && setSub(s.to)}
            >
              <span className="pf-stat-val num">{s.value}</span>
              <span className="pf-stat-lbl">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Promo */}
        <div className="pf-promo" onClick={() => setSub('tier')}>
          <div className="pf-promo-txt">
            <span className="pf-promo-eyebrow">{pick(account.tierKo, account.tierEn)} {t('pTier')}</span>
            <span className="pf-promo-title">{pick('등급 혜택 4가지 받는 중', '4 tier benefits active')}</span>
          </div>
          <ChevronRight size={18} className="pf-go" />
        </div>

        {/* Grouped menu */}
        {MENU.map((grp) => (
          <div className="pf-menu-group" key={grp.group}>
            <div className="pf-menu-label">{t(grp.group)}</div>
            <div className="list">
              {grp.rows.map((r) => (
                <div
                  className="list-row"
                  key={r.id}
                  onClick={r.to ? () => setSub(r.to) : undefined}
                  style={r.to ? { cursor: 'pointer' } : undefined}
                >
                  <r.Icon size={18} strokeWidth={1.8} className="lr-ico" />
                  <span className="lr-label">{t(r.key)}</span>
                  {r.valueKey && <span className="lr-value">{valueFor(r.valueKey)}</span>}
                  {r.value && <span className="lr-value num">{r.value}</span>}
                  {r.to && <ChevronRight size={17} className="chev" />}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout — quiet centered link */}
        <button className="pf-logout">
          <LogOut size={16} strokeWidth={1.9} />
          {t('logout')}
        </button>

        {/* Business footer */}
        <div className="pf-footer">
          <span>{t('pBizFooter')}</span>
          <span className="pf-footer-sep" />
          <span>{t('pBizInfo')}</span>
        </div>
      </div>
    </>
  )
}
