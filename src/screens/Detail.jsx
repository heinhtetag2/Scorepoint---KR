import { useState } from 'react'
import {
  ArrowLeft, Share2, CalendarClock, Wallet, Users, Flag, MapPin, CreditCard,
  Megaphone, Crown, User, Medal,
} from 'lucide-react'
import { Segmented, Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { eventDetail as ev, participants, leaderboard, settlement, money } from '../data/mock.js'

const MEDAL = ['#E0A100', '#9AA0AC', '#C77B3B']

export default function Detail({ onBack }) {
  const { t, lang, pick } = useLang()
  const [tab, setTab] = useState('info')

  const TABS = [
    { id: 'info', label: t('tabInfo') },
    { id: 'people', label: t('tabPeople') },
    { id: 'rank', label: t('tabRank') },
  ]

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{pick(ev.titleKr, ev.titleEn)}</span>
        <button className="icon-btn" aria-label="Share"><Share2 size={19} strokeWidth={1.8} /></button>
      </div>

      <div className="screen">
        {/* Hero */}
        <div className="card detail-hero">
          <div className="dh-chips">
            <span className="dday">D-{ev.dday}</span>
            <span className="ev-status">{t('open')}</span>
          </div>
          <div className="dh-title">{pick(ev.course, ev.courseEn)}</div>
          <div className="dh-row"><CalendarClock size={15} strokeWidth={1.9} /><b>{pick(ev.date, ev.dateEn)} {ev.time}</b></div>
          <div className="dh-row"><Wallet size={15} strokeWidth={1.9} />{t('feeLine', { fee: pick(ev.fee, ev.feeEn), note: pick(ev.feeNote, ev.feeNoteEn) })}</div>
          <div className="dh-row"><Users size={15} strokeWidth={1.9} /><b className="num">{t('joinedLine', { n: ev.joined, cap: ev.capacity })}</b></div>
        </div>

        <Segmented items={TABS} value={tab} onChange={setTab} />

        {tab === 'info' && (
          <>
            <div className="card info-block">
              <div className="ib-row"><span className="ib-ico"><Flag size={15} strokeWidth={1.9} /></span><span className="ib-k">{t('rowFormat')}</span><span className="ib-v">{pick(ev.formatKr, ev.formatEn)} · {pick(ev.groupKr, ev.groupEn)}</span></div>
              <div className="ib-row"><span className="ib-ico"><MapPin size={15} strokeWidth={1.9} /></span><span className="ib-k">{t('rowCourse')}</span><span className="ib-v">{pick(ev.course, ev.courseEn)} · {t('viewMap')}</span></div>
              <div className="ib-row"><span className="ib-ico"><CreditCard size={15} strokeWidth={1.9} /></span><span className="ib-k">{t('rowFee')}</span><span className="ib-v num">{pick(ev.fee, ev.feeEn)} · {pick(ev.feeNote, ev.feeNoteEn)}</span></div>
            </div>
            <div className="notice-box"><Megaphone size={16} strokeWidth={1.9} /><span>{pick(ev.noticeKr, ev.noticeEn)}</span></div>
          </>
        )}

        {tab === 'people' && (
          <div className="list">
            {participants.map((p) => (
              <div className="p-row" key={p.id}>
                <span className="pr-av">{p.role === '총무' ? <Crown size={15} strokeWidth={2} color="var(--caution)" /> : <User size={15} strokeWidth={1.9} />}</span>
                <span className="pr-name">{pick(p.nameKr, p.nameEn)}{p.role === '총무' && <span className="badge badge-role">{t('organizer')}</span>}</span>
                <span className="pr-group num">{t('group', { g: p.group })}</span>
                {p.paid ? <span className="badge badge-paid">{t('paid')}</span> : <span className="badge badge-unpaid">{t('unpaid')}</span>}
              </div>
            ))}
          </div>
        )}

        {tab === 'rank' && (
          <>
            <div className="list">
              {leaderboard.map((r) => (
                <div className="lb-row" key={r.rank}>
                  <span className="lb-rank">
                    {r.rank <= 3 ? <Medal size={19} strokeWidth={2} color={MEDAL[r.rank - 1]} /> : <span className="num">{r.rank}</span>}
                  </span>
                  <span className="lb-name">{pick(r.nameKr, r.nameEn)}</span>
                  <span className="lb-net num">Net {r.net.toFixed(1)}</span>
                  <span className="lb-prize num">{pick(r.prize, r.prizeEn)}</span>
                </div>
              ))}
            </div>

            <div className="card ledger">
              <div className="ledger-head">{t('settleSummary')}</div>
              {settlement.rows.map((row, i) => (
                <div className="ledger-row" key={i}>
                  <span className="lr-k">{pick(row.label, row.labelEn)}</span>
                  <span className="lr-a num">{row.amount > 0 ? '+' : ''}{money(row.amount, lang)}</span>
                </div>
              ))}
              <div className="ledger-bal">
                <span className="lb-k">{t('balance')}</span>
                <span className="lb-v">
                  <b className="num">{money(settlement.balance, lang)}</b>
                  <em>{t('surplusTag')}</em>
                </span>
              </div>
            </div>
          </>
        )}

        <div className="sticky-cta">
          {tab === 'rank'
            ? <Button variant="primary" className="btn-block">{t('ctaClose')}</Button>
            : <Button variant="primary" className="btn-block">{t('ctaRegister', { fee: pick(ev.fee, ev.feeEn) })}</Button>}
        </div>
      </div>
    </>
  )
}
