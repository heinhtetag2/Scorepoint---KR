/* Small reusable, theme-agnostic UI primitives.
   Every visual property comes from CSS custom properties, so these
   render correctly under any of the three themes with zero changes. */

export function Card({ children, className = '', ...rest }) {
  return <div className={`card ${className}`} {...rest}>{children}</div>
}

export function Button({ variant = 'primary', children, className = '', ...rest }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function SectionHead({ title, more, badge }) {
  return (
    <div className="section-head">
      <span className="s-head-left">
        <span className="s-title">{title}</span>
        {badge && <span className="s-badge">{badge}</span>}
      </span>
      {more && <span className="s-more">{more} ›</span>}
    </div>
  )
}

export function Badge({ kind = 'role', children }) {
  return <span className={`badge badge-${kind}`}>{children}</span>
}

export function QuickAction({ icon, label, onClick }) {
  return (
    <button className="quick" onClick={onClick}>
      <span className="q-ico">{icon}</span>
      <span className="q-label">{label}</span>
    </button>
  )
}

export function Segmented({ items, value, onChange }) {
  return (
    <div className="seg">
      {items.map((it) => (
        <button
          key={it.id}
          className={`seg-item ${value === it.id ? 'active' : ''}`}
          onClick={() => onChange(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}
