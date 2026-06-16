import { Flag, Building2, Zap, Sunrise, Target, Bike, Users } from 'lucide-react'

/* Graphic avatar for a club — a representative photo, falling back to a
   relevant white icon on the club's coloured tile if the image fails. */
const ICONS = { flag: Flag, building: Building2, zap: Zap, sunrise: Sunrise, target: Target, bike: Bike }

export default function ClubAvatar({ img, icon, color, size = 38, radius = 11 }) {
  const Ico = ICONS[icon] || Users
  return (
    <span className="club-av" style={{ background: color, width: size, height: size, borderRadius: radius }}>
      {img
        ? <img src={img} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        : <Ico size={Math.round(size * 0.5)} color="#fff" strokeWidth={2.1} />}
    </span>
  )
}
