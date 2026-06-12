/* Static mock content for the ScoreShot prototype (no backend). Bilingual EN/KR. */

export const user = {
  name: '문양희',
  nameEn: 'Moon Yang-hee',
  role: '총무',
  roleEn: 'Organizer',
  handicap: 12,
  avg: 84.2,
  best: 78,
  games: 42,
  trend: -2,
  joinedYears: 2,
}

export const aiReport = {
  avg: 84.2,
  best: 78,
  games: 42,
  insightKr: '퍼팅에서 평균 2.3타 손실 중 — 다음 라운드는 그린 주변 집중!',
  insightEn: 'Losing 2.3 strokes on putting — focus around the green next round.',
}

export const events = [
  {
    id: 'e1', dday: 3, status: '모집중',
    titleKr: '5월 정기 라운드', titleEn: 'May Monthly Round',
    course: '남서울CC', courseEn: 'Namseoul CC',
    date: '5/14 (화)', dateEn: 'Tue 5/14', time: '07:30',
    joined: 18, capacity: 20, fee: '8만원', feeEn: '₩80,000',
  },
  {
    id: 'e2', dday: 12, status: '모집중',
    titleKr: '회사 친선 대회', titleEn: 'Company Friendly Cup',
    course: '레이크사이드', courseEn: 'Lakeside',
    date: '5/23 (목)', dateEn: 'Thu 5/23', time: '06:50',
    joined: 9, capacity: 24, fee: '12만원', feeEn: '₩120,000',
  },
]

export const scoreTrend = [88, 86, 87, 84, 85, 82, 83, 80, 82, 79]

export const myRecords = [
  { id: 'r1', score: 82, net: 70.0, course: '남서울CC', courseEn: 'Namseoul CC', sub: '동코스', subEn: 'East Course', date: '2026-06-02' },
  { id: 'r2', score: 85, net: 73.0, course: '레이크사이드', courseEn: 'Lakeside', sub: '제우스', subEn: 'Zeus', date: '2026-05-24' },
  { id: 'r3', score: 84, net: 72.0, course: '베어크리크', courseEn: 'Bear Creek', sub: '크릭', subEn: 'Creek', date: '2026-05-11' },
  { id: 'r4', score: 88, net: 76.0, course: '남서울CC', courseEn: 'Namseoul CC', sub: '서코스', subEn: 'West Course', date: '2026-04-28' },
  { id: 'r5', score: 79, net: 71.0, course: '레이크사이드', courseEn: 'Lakeside', sub: '아폴로', subEn: 'Apollo', date: '2026-04-18' },
]

export const recentMatches = [
  { id: 'm1', score: 82, net: 70.0, course: '남서울CC', courseEn: 'Namseoul CC', date: '5/2' },
  { id: 'm2', score: 79, net: 71.0, course: '레이크사이드', courseEn: 'Lakeside', date: '4/18' },
  { id: 'm3', score: 85, net: 72.5, course: '제이드팰리스', courseEn: 'Jade Palace', date: '4/3' },
]

const UNSPLASH = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=75&auto=format&fit=crop`

export const banners = [
  { id: 'b1', eyebrowKo: '여름 시즌 추천', eyebrowEn: 'Summer picks', titleKo: '시원한 여름 골프 일정', titleEn: 'Cool summer rounds', ctaKo: '일정 둘러보기', ctaEn: 'Browse events', img: UNSPLASH('1587174486073-ae5e5cff23aa'), grad: 'linear-gradient(160deg,#3a86d6,#6cae7d)' },
  { id: 'b2', eyebrowKo: '새로운 모임', eyebrowEn: 'New clubs', titleKo: '우리 동네 골프 모임 찾기', titleEn: 'Find local golf clubs', ctaKo: '모임 보기', ctaEn: 'Explore clubs', img: UNSPLASH('1592919505780-303950717480'), grad: 'linear-gradient(160deg,#2f9e6f,#8fd0a8)' },
  { id: 'b3', eyebrowKo: 'AI 스코어 분석', eyebrowEn: 'AI analysis', titleKo: '내 약점 홀 분석 받기', titleEn: 'Find your weak holes', ctaKo: '분석 보기', ctaEn: 'View analysis', img: UNSPLASH('1593111774240-d529f12cf4bb'), grad: 'linear-gradient(160deg,#4f46e5,#9aa6ee)' },
]

export const popularCourses = [
  { id: 'k1', rank: 1, name: '남서울CC', nameEn: 'Namseoul CC', region: '경기 성남', regionEn: 'Seongnam', rounds: 24, img: UNSPLASH('1500932334442-8761ee4810a7'), grad: 'linear-gradient(160deg,#3a86d6,#6cae7d)' },
  { id: 'k2', rank: 2, name: '레이크사이드', nameEn: 'Lakeside', region: '경기 용인', regionEn: 'Yongin', rounds: 19, img: UNSPLASH('1535131749006-b7f58c99034b'), grad: 'linear-gradient(160deg,#2f9e6f,#7fc59a)' },
  { id: 'k3', rank: 3, name: '제이드팰리스', nameEn: 'Jade Palace', region: '강원 춘천', regionEn: 'Chuncheon', rounds: 15, img: UNSPLASH('1611374243147-44a702c2d44c'), grad: 'linear-gradient(160deg,#e0913c,#f0bd6a)' },
  { id: 'k4', rank: 4, name: '스카이72', nameEn: 'Sky72', region: '인천 중구', regionEn: 'Incheon', rounds: 12, img: UNSPLASH('1592919505780-303950717480'), grad: 'linear-gradient(160deg,#5b6fb0,#8aa0d8)' },
]

export const clubs = [
  { id: 'c1', nameKr: '강남골프회', nameEn: 'Gangnam Golf', role: '회원', roleEn: 'Member', members: 42, unpaid: 0 },
  { id: 'c2', nameKr: '회사동호회', nameEn: 'Company Club', role: '총무', roleEn: 'Organizer', members: 28, unpaid: 2 },
  { id: 'c3', nameKr: '주말번개', nameEn: 'Weekend Lightning', role: '회원', roleEn: 'Member', members: 16, unpaid: 0 },
]

export const eventDetail = {
  id: 'e1', dday: 3, status: '모집중',
  titleKr: '5월 정기 라운드', titleEn: 'May Monthly Round',
  course: '남서울CC', courseEn: 'Namseoul CC',
  date: '5/14 (화)', dateEn: 'Tue 5/14', time: '07:30',
  joined: 18, capacity: 20, fee: '8만원', feeEn: '₩80,000',
  feeNote: '그린피 + 상금 포함', feeNoteEn: 'green fee + prize',
  noticeKr: '7시까지 클럽하우스 집합 · 4인 1조 신페리오',
  noticeEn: 'Meet at clubhouse by 7AM · New Peoria, 4 per group',
  formatKr: '신페리오 (New Peoria)', formatEn: 'New Peoria',
  groupKr: '4인 1조', groupEn: '4 per group',
}

export const participants = [
  { id: 'p1', nameKr: '김총무', nameEn: 'Kim', role: '총무', group: 1, paid: true },
  { id: 'p2', nameKr: '문양희', nameEn: 'Moon', role: '회원', group: 1, paid: true },
  { id: 'p3', nameKr: '박철수', nameEn: 'Park', role: '회원', group: 2, paid: false },
  { id: 'p4', nameKr: '이영희', nameEn: 'Lee', role: '회원', group: 2, paid: true },
  { id: 'p5', nameKr: '정민수', nameEn: 'Jung', role: '회원', group: 3, paid: false },
]

export const leaderboard = [
  { rank: 1, nameKr: '문양희', nameEn: 'Moon', net: 68.0, gross: 80, prize: '+5만', prizeEn: '+₩50k' },
  { rank: 2, nameKr: '김총무', nameEn: 'Kim', net: 70.0, gross: 82, prize: '+3만', prizeEn: '+₩30k' },
  { rank: 3, nameKr: '이영희', nameEn: 'Lee', net: 71.5, gross: 85, prize: '+1만', prizeEn: '+₩10k' },
  { rank: 4, nameKr: '박철수', nameEn: 'Park', net: 73.0, gross: 86, prize: '', prizeEn: '' },
]

export const settlement = {
  balance: 80000,
  rows: [
    { label: '참가비 수입 (20명)', labelEn: 'Entry fees (20)', amount: 1600000, type: 'in' },
    { label: '그린피 (20명)', labelEn: 'Green fee (20)', amount: -1200000, type: 'out' },
    { label: '상금 지급', labelEn: 'Prize payout', amount: -270000, type: 'out' },
    { label: '식대', labelEn: 'Meals', amount: -50000, type: 'out' },
  ],
}

/* Locale-aware currency. ko: "80,000원"  ·  en: "₩80,000" (sign preserved). */
export const money = (n, lang = 'ko') => {
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n).toLocaleString('en-US')
  return lang === 'en' ? `${sign}₩${abs}` : `${n.toLocaleString('ko-KR')}원`
}
