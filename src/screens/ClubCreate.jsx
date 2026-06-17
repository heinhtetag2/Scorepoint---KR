import { useState } from 'react'
import { ArrowLeft, ChevronRight, Check, ImagePlus, Flag, Building2, Users, Zap } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { clubTypes, regions, partners } from '../data/mock.js'

/* club-type chip icons (replaces emoji) */
const TYPE_ICON = { regular: Flag, company: Building2, friends: Users, open: Zap }

const SAMPLE_IMG = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=900&q=75&auto=format&fit=crop'

export default function ClubCreate({ onBack, onCreate, edit = false, club }) {
  const { t, pick } = useLang()
  const [name, setName] = useState(edit && club ? pick(club.nameKr, club.nameEn) : '')
  const [type, setType] = useState('regular')
  const [region, setRegion] = useState(null)
  const [img, setImg] = useState(edit && club ? club.img : null)
  const [regionOpen, setRegionOpen] = useState(false)
  const [invited, setInvited] = useState(() => new Set())

  const toggleInvite = (k) => setInvited((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n })

  const valid = name.trim().length > 0

  // map the selected type chip to a club avatar icon
  const TYPE_ICON = { regular: 'flag', company: 'building', friends: 'users', open: 'zap' }

  const submit = () => {
    if (edit) { onCreate?.(); return }
    const nm = name.trim()
    onCreate?.({
      id: 'c' + Date.now(),
      nameKr: nm, nameEn: nm,
      role: '총무', roleEn: 'Organizer',
      members: 1 + invited.size, unpaid: 0,
      nextKr: '', nextEn: '',
      icon: TYPE_ICON[type] || 'flag',
      img: img || null,
      regionKr: region ? region.ko : '', regionEn: region ? region.en : '',
    })
  }

  return (
    <>
      <div className="appbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{edit ? t('csEdit') : t('clubsCreate')}</span>
        <span className="icon-btn" aria-hidden style={{ visibility: 'hidden' }}><ArrowLeft size={20} /></span>
      </div>

      <div className="screen">
        {/* Cover image */}
        <div className="field">
          <label className="field-label">{t('ccImage')}</label>
          <button className="img-field" onClick={() => setImg((v) => (v ? null : SAMPLE_IMG))}>
            {img
              ? <img className="img-preview" src={img} alt="" />
              : <div className="img-empty"><ImagePlus size={24} strokeWidth={1.8} /><span>{t('ccImageAdd')}</span></div>}
          </button>
        </div>

        {/* Name */}
        <div className="field">
          <label className="field-label">{t('ccName')}</label>
          <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('ccNamePlace')} />
        </div>

        {/* Type — chip selector */}
        <div className="field">
          <label className="field-label">{t('ccType')}</label>
          <div className="type-grid">
            {clubTypes.map((ct) => {
              const Ico = TYPE_ICON[ct.id] || Flag
              return (
                <button key={ct.id} className={`type-chip ${type === ct.id ? 'active' : ''}`} onClick={() => setType(ct.id)}>
                  <span className="type-ico"><Ico size={19} strokeWidth={1.9} /></span>
                  <span className="type-label">{pick(ct.ko, ct.en)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Region — opens a picker (visual) */}
        <div className="field">
          <label className="field-label">{t('ccRegion')}</label>
          <button className={`field-select ${regionOpen ? 'is-open' : ''}`} onClick={() => setRegionOpen(true)}>
            <span className={region ? '' : 'is-empty'}>{region ? pick(region.ko, region.en) : t('ccRegionPlace')}</span>
            <ChevronRight size={17} className="chev" />
          </button>
        </div>

        {/* Description */}
        <div className="field">
          <label className="field-label">{t('ccDesc')}</label>
          <textarea className="field-input field-area" rows={3} placeholder={t('ccDescPlace')} />
        </div>

        {/* Invite members — pick saved partners to add on creation */}
        {!edit && (
          <div className="field">
            <label className="field-label">{t('ccInvite')}</label>
            <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '0 2px 8px' }}>
              {invited.size > 0 ? t('ccInviteCount', { n: invited.size }) : t('ccInviteHint')}
            </p>
            <div className="card cd-list">
              {partners.map((p) => {
                const sel = invited.has(p.ko)
                return (
                  <div className="invite-row" key={p.ko}>
                    <span className="invite-av">{pick(p.ko, p.en).charAt(0)}</span>
                    <span className="invite-name">{pick(p.ko, p.en)}</span>
                    <button className={`invite-btn ${sel ? 'is-sent' : ''}`} onClick={() => toggleInvite(p.ko)}>
                      {sel ? t('inviteSent') : t('inviteSend')}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="sticky-cta">
          <Button variant="primary" className="btn-block" disabled={!valid} onClick={submit}>{edit ? t('commonSave') : t('ccCreate')}</Button>
        </div>
      </div>

      {regionOpen && (
        <>
          <div className="sheet-scrim" onClick={() => setRegionOpen(false)} />
          <div className="edit-sheet pick-sheet">
            <div className="es-grab" />
            <div className="es-title">{t('ccRegion')}</div>
            <div className="pick-list">
              {regions.map((rg) => {
                const sel = region && region.ko === rg.ko
                return (
                  <button key={rg.ko} className={`pick-row ${sel ? 'is-sel' : ''}`} onClick={() => { setRegion(rg); setRegionOpen(false) }}>
                    <span className="pick-name">{pick(rg.ko, rg.en)}</span>
                    {sel && <Check size={18} strokeWidth={2.4} />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
