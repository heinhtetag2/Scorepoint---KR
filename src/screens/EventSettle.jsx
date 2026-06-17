import { useState, useRef } from 'react'
import { ArrowLeft, Check, Plus, ScanLine, X, Trash2 } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { settlement, eventDetail as ev, money } from '../data/mock.js'
import Scan from './Scan.jsx'

const CATS = [
  { ko: '식대', en: 'Meals' },
  { ko: '캐디피', en: 'Caddie fee' },
  { ko: '음료', en: 'Drinks' },
  { ko: '대여료', en: 'Rental' },
  { ko: '기타', en: 'Other' },
]

/* ── Add-expense bottom sheet (scan or manual) ───────────────── */
function AddSheet({ onClose, onAdd, onScan, scanned, lang }) {
  const [cat, setCat] = useState(scanned?.cat ?? null)
  const [amt, setAmt] = useState(scanned?.amount ? String(scanned.amount) : '')
  const valid = cat && Number(amt) > 0

  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="edit-sheet">
        <div className="es-grab" />
        <div className="sp-calc-head">
          <span className="es-title" style={{ flex: 1, textAlign: 'left' }}>
            {lang === 'ko' ? '영수증 추가' : 'Add expense'}
          </span>
          <button className="sp-calc-x" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        {/* Scan shortcut */}
        <button className="settle-scan-btn" onClick={onScan}>
          <ScanLine size={20} strokeWidth={1.9} />
          <span>{lang === 'ko' ? '영수증 스캔으로 자동 입력' : 'Scan receipt to auto-fill'}</span>
        </button>
        {scanned && (
          <div className="settle-scan-note">
            <Check size={13} strokeWidth={2.6} />
            {lang === 'ko' ? '영수증에서 금액을 인식했어요' : 'Amount recognized from receipt'}
          </div>
        )}

        <div className="settle-or"><span>{lang === 'ko' ? '또는 직접 입력' : 'or enter manually'}</span></div>

        {/* Category chips */}
        <div className="field-label" style={{ marginBottom: 8 }}>{lang === 'ko' ? '항목' : 'Category'}</div>
        <div className="settle-cat-row">
          {CATS.map((c) => (
            <button
              key={c.en}
              className={`settle-cat ${cat?.en === c.en ? 'active' : ''}`}
              onClick={() => setCat(c)}
            >{lang === 'ko' ? c.ko : c.en}</button>
          ))}
        </div>

        {/* Amount */}
        <div className="field-label" style={{ margin: '16px 0 8px' }}>{lang === 'ko' ? '금액' : 'Amount'}</div>
        <div className="settle-amt-field">
          <span className="settle-amt-won">₩</span>
          <input
            className="settle-amt-input num"
            inputMode="numeric"
            value={amt ? Number(amt).toLocaleString() : ''}
            onChange={(e) => setAmt(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0"
          />
        </div>

        <Button
          variant="primary"
          className="btn-block"
          style={{ marginTop: 20, opacity: valid ? 1 : 0.5 }}
          onClick={() => valid && onAdd({ label: cat.ko, labelEn: cat.en, amount: -Number(amt), type: 'out' })}
        >
          {lang === 'ko' ? '추가하기' : 'Add expense'}
        </Button>
      </div>
    </>
  )
}

/* 정산 — event money breakdown + per-person settle, with add-receipt. */
export default function EventSettle({ onBack, onDone, onImmersiveChange }) {
  const { t, lang, pick } = useLang()
  const [rows, setRows] = useState(settlement.rows)
  const [showAdd, setShowAdd] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(null)
  const [done, setDone] = useState(false)
  const timer = useRef()

  const people = ev.capacity
  const surplus = rows.reduce((s, r) => s + r.amount, 0)
  const perPerson = Math.round(surplus / people)
  const isCustom = (i) => i >= settlement.rows.length

  // Receipt scan → recognize amount → return to add sheet pre-filled.
  const openScan = () => { setScanning(true); onImmersiveChange?.(true) }
  const closeScan = () => { setScanning(false); onImmersiveChange?.(false) }
  if (scanning) {
    return (
      <Scan
        variant="receipt"
        onBack={closeScan}
        onCaptured={() => { setScanned({ amount: 45000, cat: CATS[0] }); closeScan() }}
      />
    )
  }

  const addRow = (row) => {
    setRows((xs) => [...xs, row])
    setShowAdd(false)
    setScanned(null)
  }
  const removeRow = (idx) => setRows((xs) => xs.filter((_, i) => i !== idx))

  const close = () => {
    setDone(true)
    timer.current = setTimeout(() => onDone?.(), 1300)
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center', lineHeight: 1 }}>
          <div className="title" style={{ marginBottom: 3 }}>{lang === 'ko' ? '정산' : 'Settlement'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{pick(ev.titleKr, ev.titleEn)}</div>
        </div>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        {/* Balance hero */}
        <div className="settle-hero">
          <span className="settle-hero-deco settle-hero-deco-1" />
          <span className="settle-hero-deco settle-hero-deco-2" />
          <span className="settle-hero-label">{lang === 'ko' ? '정산 잔액' : 'Balance'}</span>
          <span className="settle-hero-num num">{surplus >= 0 ? '+' : '−'}{money(Math.abs(surplus), lang)}</span>
          <span className="settle-hero-meta">
            {lang === 'ko'
              ? `${surplus >= 0 ? '흑자' : '적자'} · ${people}명 참가`
              : `${surplus >= 0 ? 'Surplus' : 'Deficit'} · ${people} participants`}
          </span>
        </div>

        {/* Breakdown ledger */}
        <div className="section-head"><span className="s-head-left"><span className="s-title">{lang === 'ko' ? '내역' : 'Breakdown'}</span></span></div>
        <div className="card ledger">
          {rows.map((row, i) => (
            <div className="ledger-row" key={i}>
              <span className="lr-k">
                {pick(row.label, row.labelEn)}
                {isCustom(i) && (
                  <button className="settle-row-del" onClick={() => removeRow(i)} aria-label="Remove">
                    <Trash2 size={13} strokeWidth={2} />
                  </button>
                )}
              </span>
              <span className="lr-a num">{row.amount > 0 ? '+' : ''}{money(row.amount, lang)}</span>
            </div>
          ))}
          <div className="ledger-bal">
            <span className="lb-k">{t('balance')}</span>
            <span className="lb-v">
              <b className="num">{money(surplus, lang)}</b>
              <em>{surplus >= 0 ? t('surplusTag') : (lang === 'ko' ? '적자' : 'deficit')}</em>
            </span>
          </div>
        </div>

        {/* Add receipt */}
        <button className="settle-add" onClick={() => { setScanned(null); setShowAdd(true) }}>
          <Plus size={16} strokeWidth={2.4} />
          {lang === 'ko' ? '영수증 추가' : 'Add receipt'}
        </button>

        {/* Per-person refund */}
        <div className="settle-split">
          <span className="settle-split-k">{lang === 'ko' ? (perPerson >= 0 ? '1인당 환급' : '1인당 추가 부담') : (perPerson >= 0 ? 'Refund per person' : 'Extra per person')}</span>
          <span className="settle-split-v num">{money(Math.abs(perPerson), lang)}</span>
        </div>

        <div className="sticky-cta">
          {done ? (
            <button disabled className="btn btn-block settle-done">
              <Check size={18} strokeWidth={2.5} />
              {lang === 'ko' ? '정산 마감 완료' : 'Settlement closed'}
            </button>
          ) : (
            <Button variant="primary" className="btn-block" onClick={close}>
              {lang === 'ko' ? '정산 마감하기' : 'Close settlement'}
            </Button>
          )}
        </div>
      </div>

      {showAdd && (
        <AddSheet
          lang={lang}
          scanned={scanned}
          onClose={() => { setShowAdd(false); setScanned(null) }}
          onScan={openScan}
          onAdd={addRow}
        />
      )}

      {done && (
        <div className="app-toast" role="status">
          <Check size={15} strokeWidth={2.8} />
          {lang === 'ko' ? '정산이 마감되었어요' : 'Settlement closed'}
        </div>
      )}
    </>
  )
}
