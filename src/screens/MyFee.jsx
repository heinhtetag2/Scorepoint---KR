import { useState, useRef } from 'react'
import { ArrowLeft, Check, Info } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { myFees, money } from '../data/mock.js'

const STATUS = {
  pending: { cls: 'is-pending', label: 'feeStPending' },
  unpaid: { cls: 'is-unpaid', label: 'feeStUnpaid' },
  paid: { cls: 'is-paid', label: 'feeStPaid' },
}

/* 내 회비 — a member's own dues / billing details. */
export default function MyFee({ onBack }) {
  const { t, pick, lang } = useLang()
  const [items, setItems] = useState(() => myFees.items.map((i) => ({ ...i })))
  const [toast, setToast] = useState(false)
  const toastTimer = useRef()

  const unpaidTotal = items.filter((i) => i.status === 'unpaid').reduce((s, i) => s + i.amount, 0)
  const hasUnpaid = unpaidTotal > 0

  // Paying transfers every 'unpaid' item to 'pending' (awaiting organizer confirmation),
  // which empties the unpaid total → the hero flips to the cleared state and the CTA hides.
  const payAll = () => {
    setItems((xs) => xs.map((i) => (i.status === 'unpaid' ? { ...i, status: 'pending' } : i)))
    setToast(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(false), 2000)
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{t('feeTitle')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        {/* Total unpaid hero */}
        <div className={`fee-hero ${hasUnpaid ? '' : 'is-clear'}`}>
          <span className="fee-hero-label">{hasUnpaid ? t('feeTotalUnpaid') : t('feeAllPaid')}</span>
          {hasUnpaid && (
            <span className="fee-hero-num num">{unpaidTotal.toLocaleString()}<em>{t('feeUnit')}</em></span>
          )}
          <span className="fee-hero-meta">
            {pick(myFees.payerKo, myFees.payerEn)} · {pick(myFees.methodKo, myFees.methodEn)}
          </span>
        </div>

        {/* Billing details */}
        <div className="section-head"><span className="s-head-left"><span className="s-title">{t('feeBillingTitle')}</span></span></div>
        <div className="fee-list">
          {items.map((it) => {
            const st = STATUS[it.status]
            return (
              <div className="fee-card" key={it.id}>
                <div className="fee-card-top">
                  <span className="fee-cat">{pick(it.catKo, it.catEn)}</span>
                  <span className={`fee-status ${st.cls}`}><span className="fee-dot" />{t(st.label)}</span>
                </div>
                <div className="fee-card-mid">
                  <div className="fee-card-txt">
                    <span className="fee-name">{pick(it.titleKo, it.titleEn)}</span>
                    <span className="fee-due num">
                      {it.status === 'paid' && it.paidOn ? t('feePaidOn', { date: it.paidOn }) : t('feeDue', { date: it.due })}
                    </span>
                  </div>
                  <span className={`fee-amt num ${it.status === 'paid' ? 'is-paid' : ''}`}>{money(it.amount, lang)}</span>
                </div>
                {it.noteKo && it.status !== 'paid' && (
                  <div className="fee-note-row"><Info size={14} strokeWidth={2} /><span>{pick(it.noteKo, it.noteEn)}</span></div>
                )}
              </div>
            )
          })}
        </div>

        {hasUnpaid && (
          <div className="sticky-cta">
            <Button variant="primary" className="btn-block" onClick={payAll}>
              {t('feePay')} · {money(unpaidTotal, lang)}
            </Button>
          </div>
        )}
      </div>

      {toast && <div className="app-toast" role="status"><Check size={15} strokeWidth={2.8} />{t('feePaidToast')}</div>}
    </>
  )
}
