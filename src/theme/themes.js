/**
 * Theme token system for the ScoreShot style test.
 *
 * Two FAMILIES of design directions:
 *  - family: 'classic'  → Kakao / Toss / Naver. Same shared screens, re-skinned.
 *  - family: 'concept'  → Caddie / Index. Independent layouts + Lucide icons.
 *
 * Each theme is a flat map of CSS custom properties applied to the phone root,
 * so switching swaps every token at once and the whole UI re-skins instantly.
 *
 * SHARED STATUS colors come from the Apollo design-token catalog so semantic
 * meaning (paid / unpaid / urgent / AI) stays consistent across every brand skin.
 */

/* Status colors — Apollo-derived, darkened to meet WCAG AA (4.5:1) for small text. */
const STATUS = {
  '--positive': '#2A7D46',
  '--positive-weak': '#e7f3ea',
  '--negative': '#C0392B',
  '--negative-weak': '#fdecea',
  '--caution': '#9A5418',
  '--caution-weak': '#f9f1ed',
  '--info': '#2B6394',
  '--ai-bg': '#f3effb',
  '--ai-text': '#3a2769',
}

export const THEMES = {
  /* ── Style 1 · Kakao-like ──────────────────────────────────────── */
  kakao: {
    key: 'kakao', label: 'Kakao', subtitle: '친근한', family: 'classic', accentDemo: '#00B843',
    vars: {
      ...STATUS,
      '--brand': '#0A7A37', '--brand-weak': '#E5F4EA', '--on-brand': '#ffffff', '--point': '#E2571F',
      '--text-1': '#1A1D21', '--text-2': '#4B5159', '--text-3': '#6B7077',
      '--line': '#E6E8EB', '--page': '#FFFFFF', '--surface': '#FFFFFF', '--surface-2': '#F2F4F3',
      '--card-radius': '16px', '--btn-radius': '12px', '--chip-radius': '10px',
      '--pad': '20px', '--gap': '12px',
      '--card-border': '1px solid #E4E7EC', '--card-shadow': 'none',
      '--fs-display': '26px', '--fs-title': '18px', '--fs-body': '15px', '--fs-label': '13px', '--fs-cap': '11.5px',
      '--w-bold': '800', '--w-title': '700', '--btn-h': '52px', '--row-h': '60px',
    },
  },

  /* ── Style 2 · Toss-like ───────────────────────────────────────── */
  toss: {
    key: 'toss', label: 'Toss', subtitle: '미니멀', family: 'classic', accentDemo: '#3182F6',
    vars: {
      ...STATUS,
      '--brand': '#3182F6', '--brand-weak': '#EAF2FF', '--on-brand': '#ffffff', '--point': '#FF5A3C',
      '--text-1': '#191F28', '--text-2': '#4E5968', '--text-3': '#8B95A1',
      '--line': '#F2F4F6', '--page': '#F7F8FA', '--surface': '#FFFFFF', '--surface-2': '#F2F4F6',
      '--card-radius': '16px', '--btn-radius': '14px', '--chip-radius': '10px',
      '--pad': '20px', '--gap': '12px',
      '--card-border': '1px solid #F2F4F6', '--card-shadow': 'none',
      '--fs-display': '30px', '--fs-title': '17px', '--fs-body': '15px', '--fs-label': '13px', '--fs-cap': '11px',
      '--w-bold': '700', '--w-title': '600', '--btn-h': '54px', '--row-h': '58px',
    },
  },

  /* ── Style 3 · Naver-like ──────────────────────────────────────── */
  naver: {
    key: 'naver', label: 'Naver', subtitle: '고밀도', family: 'classic', accentDemo: '#03C75A',
    vars: {
      ...STATUS,
      '--brand': '#03C75A', '--brand-weak': '#E6F8EE', '--on-brand': '#ffffff', '--point': '#FF3B30',
      '--text-1': '#1A1A1A', '--text-2': '#555B62', '--text-3': '#8A8F96',
      '--line': '#ECEDEF', '--page': '#F5F6F7', '--surface': '#FFFFFF', '--surface-2': '#F5F6F7',
      '--card-radius': '8px', '--btn-radius': '8px', '--chip-radius': '8px',
      '--pad': '14px', '--gap': '8px',
      '--card-border': '1px solid #ECEDEF', '--card-shadow': 'none',
      '--fs-display': '22px', '--fs-title': '15.5px', '--fs-body': '13.5px', '--fs-label': '12px', '--fs-cap': '10.5px',
      '--w-bold': '800', '--w-title': '700', '--btn-h': '46px', '--row-h': '48px',
    },
  },

  /* ── Concept A · Caddie — warm Korean utility, round-lifecycle ─── */
  caddie: {
    key: 'caddie', label: 'Caddie', subtitle: 'Concept A', family: 'concept', isNew: true, accentDemo: '#1E7A46',
    vars: {
      ...STATUS,
      '--brand': '#1E7A46', '--brand-weak': '#E8F3EC', '--on-brand': '#ffffff', '--point': '#E8682E',
      '--text-1': '#211F1C', '--text-2': '#5C5A55', '--text-3': '#9A968E',
      '--line': '#ECEAE4', '--page': '#F6F4EF', '--surface': '#FFFFFF', '--surface-2': '#F1EFE9',
      '--card-radius': '16px', '--btn-radius': '14px', '--chip-radius': '999px',
      '--pad': '18px', '--gap': '12px',
      '--card-border': '0px solid transparent', '--card-shadow': '0 2px 10px rgba(40,34,28,0.06)',
      '--fs-display': '28px', '--fs-title': '17px', '--fs-body': '15px', '--fs-label': '13px', '--fs-cap': '11.5px',
      '--w-bold': '800', '--w-title': '700', '--btn-h': '52px', '--row-h': '56px',
    },
  },

  /* ── Concept B · Index — premium system UI, number-led grid ────── */
  index: {
    key: 'index', label: 'Index', subtitle: 'Concept B', family: 'concept', isNew: true, accentDemo: '#4F46E5',
    vars: {
      ...STATUS,
      '--brand': '#4F46E5', '--brand-weak': '#EEEFFE', '--on-brand': '#ffffff', '--point': '#E5484D',
      '--text-1': '#111317', '--text-2': '#5B616E', '--text-3': '#9AA0AC',
      '--line': '#EEF0F3', '--page': '#FBFBFD', '--surface': '#FFFFFF', '--surface-2': '#F4F5F8',
      '--card-radius': '18px', '--btn-radius': '12px', '--chip-radius': '8px',
      '--pad': '20px', '--gap': '12px',
      '--card-border': '1px solid #EEF0F3', '--card-shadow': 'none',
      '--fs-display': '44px', '--fs-title': '16px', '--fs-body': '15px', '--fs-label': '13px', '--fs-cap': '11px',
      '--w-bold': '700', '--w-title': '600', '--btn-h': '54px', '--row-h': '56px',
    },
  },
}

export const THEME_ORDER = ['kakao', 'toss', 'naver', 'caddie', 'index']

export const homeKeyFor = (key) =>
  key === 'caddie' ? 'cd-home' : key === 'index' ? 'ix-home' : 'home'
