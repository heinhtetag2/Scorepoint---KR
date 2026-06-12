/* Tiny inline-SVG sparkline. Lower golf scores are better, so a downward
   line reads as improvement. Pure presentational, theme-color aware.
   Pass `area` to fill the region under the line; `showLast` to mark the
   latest point with a glow dot and a value bubble. */
export default function Spark({
  points, color = 'var(--brand)', w = 132, h = 36, strokeWidth = 2,
  area = false, showLast = false, gradId = 'spark',
}) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (w - 4) + 2
    const y = h - 6 - ((p - min) / span) * (h - 16)
    return [x, y]
  })
  const d = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const last = coords[coords.length - 1]
  const lastVal = points[points.length - 1]
  const areaD = area
    ? `${d} L ${last[0].toFixed(1)} ${h} L ${coords[0][0].toFixed(1)} ${h} Z`
    : null

  // value bubble placed above the last point, clamped within bounds
  const bw = 30, bh = 19
  const bx = Math.max(2, Math.min(w - bw - 2, last[0] - bw / 2))
  const by = last[1] - bh - 9 < 2 ? last[1] + 9 : last[1] - bh - 9

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={areaD} fill={`url(#${gradId})`} stroke="none" />}
      <path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {showLast ? (
        <>
          <circle cx={last[0]} cy={last[1]} r="7" fill={color} opacity="0.16" />
          <circle cx={last[0]} cy={last[1]} r="3.6" fill="#fff" stroke={color} strokeWidth={strokeWidth} />
          <rect x={bx} y={by} width={bw} height={bh} rx="6" fill={color} />
          <text x={bx + bw / 2} y={by + bh / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">{lastVal}</text>
        </>
      ) : (
        <circle cx={last[0]} cy={last[1]} r="3.2" fill="#fff" stroke={color} strokeWidth={strokeWidth} />
      )}
    </svg>
  )
}
