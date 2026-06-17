import { useState } from 'react'
import { ArrowLeft, Share2, Trophy, Ribbon, Target, Ruler, Star, CircleDot, Receipt } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { awardResults, eventDetail as ev } from '../data/mock.js'
import EventSettle from './EventSettle.jsx'
import ResultNotice from './ResultNotice.jsx'

const ICON_MAP = {
  trophy: Trophy,
  ribbon: Ribbon,
  circle: CircleDot,
  zap:    Ruler,
  target: Target,
  star:   Star,
}

// green tier = podium prize awards, neutral tier = fun/special awards
const ROW_TIER = { green: 'tier-green', white: 'tier-neutral' }

export default function AwardResults({ onBack, onDone, onImmersiveChange }) {
  const { lang, pick } = useLang()
  const [sub, setSub] = useState(null)

  if (sub === 'settle') return <EventSettle onBack={() => setSub(null)} onDone={onDone} onImmersiveChange={onImmersiveChange} />
  if (sub === 'notice') return <ResultNotice onBack={() => setSub(null)} onDone={onDone} />

  const champion = awardResults[0]
  const rest = awardResults.slice(1)

  const champName   = lang === 'ko' ? champion.nameKo : champion.nameEn
  const champCat    = lang === 'ko' ? champion.catKo : champion.catEn
  const champDetail = lang === 'ko' ? champion.detailKo : champion.detailEn
  const champPrize  = lang === 'ko' ? champion.prizeKo : champion.prizeEn

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center', lineHeight: 1 }}>
          <div className="title" style={{ marginBottom: 3 }}>{lang === 'ko' ? '시상 결과' : 'Award results'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{pick(ev.titleKr, ev.titleEn)}</div>
        </div>
        <button className="icon-btn" aria-label="Share"><Share2 size={19} strokeWidth={1.8} /></button>
      </div>

      <div className="screen">
        {/* Champion spotlight */}
        <div className="aw-champion">
          <div className="aw-champion-eyebrow">
            <Trophy size={14} strokeWidth={2.2} />
            {champCat}
          </div>
          <div className="aw-champion-body">
            <span className="aw-champion-av" style={{ background: champion.color || '#0A7A37' }}>
              {champName.charAt(0)}
            </span>
            <div className="aw-champion-info">
              <span className="aw-champion-name">{champName}</span>
              <span className="aw-champion-detail">{champDetail}</span>
            </div>
            {champPrize && <span className="aw-champion-prize">{champPrize}</span>}
          </div>
          <span className="aw-champion-deco" />
        </div>

        {/* Other recipients */}
        <div className="section-head">
          <span className="s-head-left"><span className="s-title">{lang === 'ko' ? '수상 내역' : 'Recipients'}</span></span>
        </div>
        <div className="card aw-list">
          {rest.map(award => {
            const Icon = ICON_MAP[award.icon] || Trophy
            const tier = ROW_TIER[award.tier] || 'tier-neutral'
            const name = lang === 'ko' ? award.nameKo : award.nameEn
            const cat = lang === 'ko' ? award.catKo : award.catEn
            const detail = lang === 'ko' ? award.detailKo : award.detailEn
            const prize = lang === 'ko' ? award.prizeKo : award.prizeEn

            return (
              <div className="aw-row" key={award.id}>
                <span className={`aw-row-ico ${tier}`}><Icon size={19} strokeWidth={1.9} /></span>
                <div className="aw-row-body">
                  <span className={`aw-row-cat ${tier}`}>{cat}</span>
                  <span className="aw-row-name">{name}</span>
                  <span className="aw-row-detail">{detail}</span>
                </div>
                {prize && <span className="aw-row-prize">{prize}</span>}
              </div>
            )
          })}
        </div>

        {/* Dual CTA */}
        <div className="sticky-cta aw-dual-cta">
          <button className="btn btn-ghost aw-settle-btn" onClick={() => setSub('settle')}>
            <Receipt size={16} strokeWidth={1.9} />
            {lang === 'ko' ? '정산' : 'Settle'}
          </button>
          <button className="btn btn-primary aw-notice-btn" onClick={() => setSub('notice')}>
            {lang === 'ko' ? '결과 공지 만들기' : 'Create result notice'}
          </button>
        </div>
      </div>
    </>
  )
}
