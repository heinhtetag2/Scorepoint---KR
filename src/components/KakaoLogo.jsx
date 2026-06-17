/* KakaoTalk brand mark — rounded chat bubble. Defaults to the brown
   used on the brand-yellow (#FEE500) background. */
export default function KakaoLogo({ size = 20, color = '#3C1E1E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 3.6c-5.2 0-9.4 3.3-9.4 7.3 0 2.6 1.7 4.9 4.4 6.2-.2.7-.7 2.5-.8 2.9-.13.5.18.5.38.37.16-.11 2.5-1.7 3.5-2.4.62.09 1.26.13 1.92.13 5.2 0 9.4-3.3 9.4-7.3S17.2 3.6 12 3.6z"/>
    </svg>
  )
}
