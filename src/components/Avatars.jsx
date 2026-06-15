/* Cute 2D character heads used as selectable profile avatars.
   Flat, friendly, golf-flavored — drawn as inline SVG so they
   scale crisply and tint nicely on the picker's pastel backgrounds. */

const SKIN = '#F4C7A3'
const SKIN2 = '#ECB892'
const DARK = '#3A2E2A'

/* shared face: ears, head, eyes, smile, soft cheeks */
function Face({ skin = SKIN }) {
  return (
    <>
      <circle cx="21" cy="36" r="3" fill={skin} />
      <circle cx="43" cy="36" r="3" fill={skin} />
      <circle cx="32" cy="35" r="16" fill={skin} />
      <circle cx="24.5" cy="40" r="2.4" fill="#F39C82" opacity="0.55" />
      <circle cx="39.5" cy="40" r="2.4" fill="#F39C82" opacity="0.55" />
      <circle cx="27" cy="35" r="1.9" fill={DARK} />
      <circle cx="37" cy="35" r="1.9" fill={DARK} />
      <path d="M28 41 Q32 45 36 41" stroke={DARK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  )
}

export const AVATAR_IDS = ['visor', 'cap', 'shades', 'pony', 'bucket', 'senior']

function CharBody({ id }) {
  switch (id) {
    case 'visor': // brown hair + green golf visor
      return (
        <>
          <path d="M16 35 Q16 16 32 16 Q48 16 48 35 Q42 27 32 27 Q22 27 16 35Z" fill="#5B3A29" />
          <Face />
          <path d="M13 31 Q32 41 51 31 Q51 34 32 35.5 Q13 34 13 31Z" fill="#2A8A4F" />
          <rect x="17" y="23" width="30" height="8" rx="4" fill="#1E7A46" />
        </>
      )
    case 'cap': // green ball cap with side brim
      return (
        <>
          <Face />
          <path d="M19 27 Q19 13 32 13 Q47 13 48 27 Q40 23 32 23 Q25 23 19 27Z" fill="#1E7A46" />
          <path d="M10 28 Q24 32 34 28 L34 25 Q22 24 10 25 Z" fill="#16613a" />
          <circle cx="32" cy="14.5" r="1.6" fill="#16613a" />
        </>
      )
    case 'shades': // dark hair + sunglasses + grin
      return (
        <>
          <path d="M15 37 Q15 14 32 14 Q49 14 49 37 Q49 25 32 25 Q15 25 15 37Z" fill="#2E2A28" />
          <Face />
          <rect x="19" y="31" width="10" height="7" rx="3.5" fill="#26211F" />
          <rect x="35" y="31" width="10" height="7" rx="3.5" fill="#26211F" />
          <rect x="28" y="33" width="8" height="2" rx="1" fill="#26211F" />
        </>
      )
    case 'pony': // long hair + green headband
      return (
        <>
          <path d="M14 31 Q14 14 32 14 Q50 14 50 31 L49 48 Q45 41 44 33 Q44 25 32 25 Q20 25 20 33 Q19 41 15 48Z" fill="#241F1C" />
          <Face skin={SKIN2} />
          <path d="M17 27 Q32 21 47 27 Q47 22 32 21 Q17 22 17 27Z" fill="#1E7A46" />
        </>
      )
    case 'bucket': // beige bucket hat
      return (
        <>
          <Face />
          <ellipse cx="32" cy="25" rx="22" ry="6" fill="#D8C49C" />
          <path d="M20 25 Q20 12 32 12 Q44 12 44 25 Z" fill="#E8DAB9" />
          <rect x="20" y="22" width="24" height="3.5" rx="1.75" fill="#cdb78c" />
        </>
      )
    case 'senior': // gray hair + round glasses + mustache
      return (
        <>
          <path d="M16 35 Q16 17 32 17 Q48 17 48 35 Q43 28 32 28 Q21 28 16 35Z" fill="#BBB5AE" />
          <Face skin={SKIN2} />
          <circle cx="26.5" cy="35" r="4.2" fill="none" stroke="#5b5550" strokeWidth="1.4" />
          <circle cx="37.5" cy="35" r="4.2" fill="none" stroke="#5b5550" strokeWidth="1.4" />
          <path d="M30.7 35 H33.3" stroke="#5b5550" strokeWidth="1.4" />
          <path d="M27 42 Q32 45 37 42 Q33 44 32 44 Q31 44 27 42Z" fill="#9c958d" />
        </>
      )
    default:
      return <Face />
  }
}

export function Avatar({ id, size = 56 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden style={{ display: 'block' }}>
      <CharBody id={id} />
    </svg>
  )
}
