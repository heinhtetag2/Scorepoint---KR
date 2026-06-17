/* Faint golf-course flag illustration used as a card background graphic.
   Same artwork as the detail hero (.dh-illust). Color/opacity come from CSS. */
export default function CourseIllust({ className = 'ec-illust' }) {
  return (
    <svg className={className} viewBox="0 0 140 140" fill="none" aria-hidden="true">
      <path d="M100 22 V102" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 24 L134 35 L100 47 Z" fill="currentColor" />
      <ellipse cx="100" cy="106" rx="27" ry="8" fill="currentColor" opacity="0.4" />
      <path d="M14 104 Q56 44 98 26" stroke="currentColor" strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" />
      <circle cx="14" cy="104" r="4.5" fill="currentColor" />
    </svg>
  )
}
