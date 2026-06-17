import { useState } from 'react'

/* Tiny inline-SVG sparkline. Lower golf scores are better, so a downward
   line reads as improvement. Pure presentational, theme-color aware.
   Pass `area` to fill the region under the line; `showLast` to mark the
   latest point with a glow dot and a value bubble.
   Pass `interactive` to make every point tappable — the value bubble and
   guide line snap to the selected point (defaults to the latest). */
export default function Spark({
  points, color = 'var(--brand)', w = 132, h = 36, strokeWidth = 2,
  area = false, showLast = false, gradId = 'spark', interactive = false, onSelect,
}) {
  const [sel, setSel] = useState(points.length - 1)
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (w - 4) + 2
    const y = h - 6 - ((p - min) / span) * (h - 16)
    return [x, y]
  })
  const d = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const areaD = area
    ? `${d} L ${coords[coords.length - 1][0].toFixed(1)} ${h} L ${coords[0][0].toFixed(1)} ${h} Z`
    : null

  // active point: the tapped one when interactive, otherwise the latest
  const active = interactive ? Math.min(sel, points.length - 1) : points.length - 1
  const ap = coords[active]
  const av = points[active]
  const showBubble = showLast || interactive

  // value bubble placed above the active point, clamped within bounds
  const bw = 30, bh = 19
  const bx = Math.max(2, Math.min(w - bw - 2, ap[0] - bw / 2))
  const by = ap[1] - bh - 9 < 2 ? ap[1] + 9 : ap[1] - bh - 9

  const pick = (i) => { setSel(i); onSelect && onSelect(i, points[i]) }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none"
      style={interactive ? { touchAction: 'manipulation' } : undefined} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={areaD} fill={`url(#${gradId})`} stroke="none" />}
      <path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />

      {interactive && (
        <>
          {/* guide line down to the baseline at the active point */}
          <line x1={ap[0]} y1={ap[1] + 4} x2={ap[0]} y2={h} stroke={color} strokeWidth="1" strokeDasharray="2 3" opacity="0.35" />
          {/* a small dot on every point so the line reads as a series */}
          {coords.map(([x, y], i) => i !== active && (
            <circle key={i} cx={x} cy={y} r="2.4" fill={color} opacity="0.45" />
          ))}
        </>
      )}

      {showBubble ? (
        <>
          <circle cx={ap[0]} cy={ap[1]} r="7" fill={color} opacity="0.16" />
          <circle cx={ap[0]} cy={ap[1]} r="3.6" fill="#fff" stroke={color} strokeWidth={strokeWidth} />
          <rect x={bx} y={by} width={bw} height={bh} rx="6" fill={color} />
          <text x={bx + bw / 2} y={by + bh / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">{av}</text>
        </>
      ) : (
        <circle cx={ap[0]} cy={ap[1]} r="3.2" fill="#fff" stroke={color} strokeWidth={strokeWidth} />
      )}

      {/* full-height tap targets per point — placed last so they sit on top */}
      {interactive && coords.map(([x], i) => {
        const colW = w / points.length
        return (
          <rect key={`hit-${i}`} x={x - colW / 2} y={0} width={colW} height={h}
            fill="transparent" style={{ cursor: 'pointer' }}
            onPointerDown={() => pick(i)} onClick={() => pick(i)} />
        )
      })}
    </svg>
  )
}
