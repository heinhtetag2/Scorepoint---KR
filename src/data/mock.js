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

/* Rich event feed for the 일정(Event) tab — list + detail + create.
   status: 'scheduled' | 'ended'. */
export const eventList = [
  {
    id: 'ev1', status: 'scheduled', dday: 6,
    clubKo: '타고플러스 골프클럽', clubEn: 'Tago Plus Golf Club',
    titleKo: '2026년 6월 정기모임', titleEn: 'June 2026 Monthly Meeting',
    courseKo: '남서울CC', courseEn: 'Namseoul CC', subKo: '동코스', subEn: 'East Course',
    date: '2026-06-15', time: '08:00', fee: 150000, capacity: 32,
    joined: 24, absent: 3, mood: 2,
  },
  {
    id: 'ev2', status: 'ended',
    clubKo: '타고플러스 골프클럽', clubEn: 'Tago Plus Golf Club',
    titleKo: '5월 정기 라운딩', titleEn: 'May Regular Rounding',
    courseKo: '레이크힐스CC', courseEn: 'Lakehills GC', subKo: '', subEn: '',
    date: '2026-05-18', time: '07:30', fee: 130000, capacity: 28,
    joined: 24, absent: 4, mood: 5,
  },
  {
    id: 'ev3', status: 'ended',
    clubKo: '타고플러스 골프클럽', clubEn: 'Tago Plus Golf Club',
    titleKo: '창립기념 컨퍼런스', titleEn: 'Founding Anniversary Conference',
    courseKo: '베어크리크GC', courseEn: 'Bear Creek GC', subKo: '', subEn: '',
    date: '2026-04-06', time: '08:30', fee: 180000, capacity: 36,
    joined: 32, absent: 4, mood: 6,
  },
]

/* Attendees on the event detail, grouped by status.
   status: 'present' (출석) | 'absent' (불참) | 'mood' (분위기 — left a reaction). */
export const eventAttendees = [
  { id: 'ea1', nameKo: '문양희', nameEn: 'Moon Yang-hee', color: '#0A7A37', status: 'present' },
  { id: 'ea2', nameKo: '홍길동', nameEn: 'Hong Gil-dong', color: '#1E8E5A', status: 'present' },
  { id: 'ea3', nameKo: '김철수', nameEn: 'Kim Cheol-su', color: '#C77B3B', status: 'present' },
  { id: 'ea4', nameKo: '박영희', nameEn: 'Park Young-hee', color: '#3B82F6', status: 'present' },
  { id: 'ea5', nameKo: '이민수', nameEn: 'Lee Min-soo', color: '#8B5CF6', status: 'present' },
  { id: 'ea6', nameKo: '정해성', nameEn: 'Jeong Hae-seong', color: '#2563EB', status: 'present' },
  { id: 'eb1', nameKo: '윤서연', nameEn: 'Yoon Seo-yeon', color: '#94A3B8', status: 'absent' },
  { id: 'eb2', nameKo: '강도현', nameEn: 'Kang Do-hyun', color: '#94A3B8', status: 'absent' },
  { id: 'eb3', nameKo: '한지우', nameEn: 'Han Ji-woo', color: '#94A3B8', status: 'absent' },
  { id: 'ec1', nameKo: '오지호', nameEn: 'Oh Ji-ho', color: '#0EA5A0', status: 'mood', emoji: '😊' },
  { id: 'ec2', nameKo: '장미래', nameEn: 'Jang Mi-rae', color: '#E2571F', status: 'mood', emoji: '🔥' },
]

/* Organizer tools for an event (kept for reuse; not currently rendered). */
export const eventTools = [
  { id: 'group', icon: 'grid', titleKo: '조 편성', titleEn: 'Group formation', subKo: '4인 1조 · AI 자동 편성', subEn: '4 per team · AI auto formation' },
  { id: 'results', icon: 'camera', titleKo: '결과 등록', titleEn: 'Register results', subKo: '성적표 사진 > 일괄 등록', subEn: 'Report card photo > Bulk registration' },
  { id: 'awards', icon: 'trophy', titleKo: '신페리오 계산 · 시상', titleEn: 'Shinperio Calculation · Awards', subKo: '순위 계산 후 시상', subEn: 'Awards after ranking calculation' },
  { id: 'settle', icon: 'receipt', titleKo: '정산 · 이체', titleEn: 'Settlement · Transfer', subKo: '영수증 촬영 > 1인당 자동 계산', subEn: 'Photo receipt > Auto per-person', locked: true },
]

export const scoreTrend = [88, 86, 87, 84, 85, 82, 83, 80, 82, 79]

export const myRecords = [
  { id: 'r1', score: 82, net: 70.0, course: '남서울CC', courseEn: 'Namseoul CC', sub: '동코스', subEn: 'East Course', date: '2026-06-02' },
  { id: 'r2', score: 85, net: 73.0, course: '레이크사이드', courseEn: 'Lakeside', sub: '제우스', subEn: 'Zeus', date: '2026-05-24' },
  { id: 'r3', score: 84, net: 72.0, course: '베어크리크', courseEn: 'Bear Creek', sub: '크릭', subEn: 'Creek', date: '2026-05-11' },
  { id: 'r4', score: 88, net: 76.0, course: '남서울CC', courseEn: 'Namseoul CC', sub: '서코스', subEn: 'West Course', date: '2026-04-28' },
  { id: 'r5', score: 79, net: 71.0, course: '레이크사이드', courseEn: 'Lakeside', sub: '아폴로', subEn: 'Apollo', date: '2026-04-18' },
]

/* Standard par-72 layout (front 36 / back 36) used for every record's scorecard. */
export const HOLE_PARS = [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 5]

/* Build a believable 18-hole scorecard whose strokes sum EXACTLY to `gross`.
   Deterministic from `seed` (record index) so a given record always renders the
   same card. Plants 2 birdies for realism, then fills bogeys/doubles to hit gross. */
export function buildScorecard(gross, seed = 0) {
  const holes = HOLE_PARS.slice()
  const birdieCand = HOLE_PARS.map((p, i) => (p >= 4 ? i : -1)).filter((i) => i >= 0)
  const b1 = birdieCand[(seed * 2 + 1) % birdieCand.length]
  let b2 = birdieCand[(seed * 2 + 5) % birdieCand.length]
  if (b2 === b1) b2 = birdieCand[(seed * 2 + 6) % birdieCand.length]
  const birdies = new Set([b1, b2])
  holes[b1] -= 1
  holes[b2] -= 1

  let need = gross - 72 + 2 // strokes to add back after the two birdies
  let idx = seed % 18
  let guard = 0
  while (need > 0 && guard < 1000) {
    if (!birdies.has(idx) && holes[idx] - HOLE_PARS[idx] < 2) {
      holes[idx] += 1
      need -= 1
    }
    idx = (idx + 1) % 18
    guard += 1
  }

  const tally = { eagle: 0, birdie: 0, par: 0, bogey: 0, double: 0 }
  holes.forEach((s, i) => {
    const d = s - HOLE_PARS[i]
    if (d <= -2) tally.eagle += 1
    else if (d === -1) tally.birdie += 1
    else if (d === 0) tally.par += 1
    else if (d === 1) tally.bogey += 1
    else tally.double += 1
  })

  const out = holes.slice(0, 9).reduce((a, b) => a + b, 0)
  const inn = holes.slice(9).reduce((a, b) => a + b, 0)
  return { holes, out, in: inn, tally }
}

export const recentMatches = [
  { id: 'm1', score: 82, net: 70.0, course: '남서울CC', courseEn: 'Namseoul CC', date: '5/2' },
  { id: 'm2', score: 79, net: 71.0, course: '레이크사이드', courseEn: 'Lakeside', date: '4/18' },
  { id: 'm3', score: 85, net: 72.5, course: '제이드팰리스', courseEn: 'Jade Palace', date: '4/3' },
]

/* The round a fresh scan "recognizes" — used by the scan review screen. */
export const scannedRound = {
  id: 'scan1', score: 83, net: 71.5,
  course: '남서울CC', courseEn: 'Namseoul CC', sub: '동코스', subEn: 'East Course',
  date: '2026-06-16',
}

/* The user's saved playing partners (golf friends / club mates). Source for the
   companion picker. The scanned round's companions are the first three of these. */
export const partners = [
  { ko: '김민준', en: 'Kim Min-jun' },
  { ko: '박서준', en: 'Park Seo-jun' },
  { ko: '이도윤', en: 'Lee Do-yoon' },
  { ko: '최유나', en: 'Choi Yu-na' },
  { ko: '정해인', en: 'Jung Hae-in' },
  { ko: '한지우', en: 'Han Ji-woo' },
]

/* Playing partners for a round — fixed gross scores. The signed-in user
   (myRecords[].score) is merged in and the four are ranked at render time. */
export const roundCompanions = [
  { id: 'cp1', name: '김민준', nameEn: 'Kim Min-jun', avatar: 'cap', gross: 80 },
  { id: 'cp2', name: '박서준', nameEn: 'Park Seo-jun', avatar: 'shades', gross: 86 },
  { id: 'cp3', name: '이도윤', nameEn: 'Lee Do-yoon', avatar: 'senior', gross: 90 },
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

export const account = {
  points: 1240, coupons: 2,
  tierKo: '버디', tierEn: 'Birdie', tierLevel: 3,
  badges: 6,
  memberNo: 'SS-26-0612',
  phone: '010-1234-5678', email: 'yang-hee@scoreshot.kr',
  introKo: '주말 골퍼 · 베스트 78타', introEn: 'Weekend golfer · best 78',
}

export const badges = [
  { id: 'bd1', emoji: '🏁', nameKo: '첫 라운드', nameEn: 'First Round', earned: true },
  { id: 'bd2', emoji: '⛳', nameKo: '베스트 갱신', nameEn: 'New Best', earned: true },
  { id: 'bd3', emoji: '🔥', nameKo: '3연속 라운드', nameEn: 'Hot Streak', earned: true },
  { id: 'bd4', emoji: '👑', nameKo: '대회 우승', nameEn: 'Champion', earned: true },
  { id: 'bd5', emoji: '🎯', nameKo: '파 세이브', nameEn: 'Par Saver', earned: true },
  { id: 'bd6', emoji: '🦅', nameKo: '이글', nameEn: 'Eagle', earned: true },
  { id: 'bd7', emoji: '🕳️', nameKo: '홀인원', nameEn: 'Hole-in-One', earned: false },
  { id: 'bd8', emoji: '💯', nameKo: '언더파', nameEn: 'Under Par', earned: false },
]

/* Golf-score themed membership ladder; current tier = account.tierLevel (1-indexed). */
export const tiers = [
  { id: 'bogey', ko: '보기', en: 'Bogey' },
  { id: 'par', ko: '파', en: 'Par' },
  { id: 'birdie', ko: '버디', en: 'Birdie' },
  { id: 'eagle', ko: '이글', en: 'Eagle' },
  { id: 'albatross', ko: '알바트로스', en: 'Albatross' },
]

export const tierBenefits = [
  { id: 't1', icon: 'report', ko: '스코어 분석 리포트 무제한', en: 'Unlimited score reports', subKo: 'AI 약점 분석을 횟수 제한 없이', subEn: 'AI weak-spot analysis, no limits' },
  { id: 't2', icon: 'event', ko: '행사 우선 신청 24시간', en: '24h early event sign-up', subKo: '인기 라운드를 먼저 신청하세요', subEn: 'Grab popular rounds first' },
  { id: 't3', icon: 'settle', ko: '정산 수수료 면제', en: 'No settlement fees', subKo: '모임 정산 수수료 0원', subEn: 'Zero fees on club settlement' },
  { id: 't4', icon: 'coupon', ko: '월 1회 그린피 할인 쿠폰', en: 'Monthly green-fee coupon', subKo: '매달 자동으로 지급돼요', subEn: 'Issued automatically each month' },
]

export const pointHistory = [
  { id: 'ph1', titleKo: '5월 정기 라운드 참가', titleEn: 'Joined May Monthly Round', amount: 200, date: '06/02' },
  { id: 'ph2', titleKo: '스코어 등록 보너스', titleEn: 'Score log bonus', amount: 50, date: '05/24' },
  { id: 'ph3', titleKo: '베스트 스코어 달성', titleEn: 'New best score', amount: 100, date: '05/11' },
  { id: 'ph4', titleKo: '그린피 쿠폰 교환', titleEn: 'Redeemed green-fee coupon', amount: -500, date: '05/02' },
  { id: 'ph5', titleKo: '친구 초대 적립', titleEn: 'Friend referral', amount: 300, date: '04/20' },
]

export const paymentMethods = [
  { id: 'pm1', kind: 'card', nameKo: '신한카드', nameEn: 'Shinhan Card', tail: '1234', primary: true },
  { id: 'pm2', kind: 'pay', nameKo: '카카오페이', nameEn: 'KakaoPay', tail: '', primary: false },
]

export const paymentHistory = [
  { id: 'py1', titleKo: '5월 정기 라운드 참가비', titleEn: 'May round entry fee', amount: -80000, date: '2026.06.02', methodKo: '신한카드', methodEn: 'Shinhan Card' },
  { id: 'py2', titleKo: '회사 친선 대회 참가비', titleEn: 'Friendly cup entry fee', amount: -120000, date: '2026.05.23', methodKo: '카카오페이', methodEn: 'KakaoPay' },
  { id: 'py3', titleKo: '정산 환급 (베어크리크)', titleEn: 'Settlement refund (Bear Creek)', amount: 15000, date: '2026.05.12', methodKo: '계좌입금', methodEn: 'Bank transfer' },
]

export const notiPrefs = [
  { id: 'np1', labelKo: '행사·일정 알림', labelEn: 'Events & schedule', on: true },
  { id: 'np2', labelKo: '정산·결제 알림', labelEn: 'Settlement & payments', on: true },
  { id: 'np3', labelKo: '스코어 분석 리포트', labelEn: 'Score reports', on: true },
  { id: 'np4', labelKo: '모임 소식', labelEn: 'Club updates', on: false },
  { id: 'np5', labelKo: '마케팅·혜택 알림', labelEn: 'Marketing & offers', on: false },
]

export const faqs = [
  { id: 'f1', qKo: '스코어카드는 어떻게 스캔하나요?', qEn: 'How do I scan a scorecard?' },
  { id: 'f2', qKo: '신페리오 정산은 어떻게 계산되나요?', qEn: 'How is New Peoria settlement calculated?' },
  { id: 'f3', qKo: '핸디캡은 어떻게 산정되나요?', qEn: 'How is my handicap calculated?' },
  { id: 'f4', qKo: '모임 총무 권한을 넘길 수 있나요?', qEn: 'Can I transfer organizer rights?' },
  { id: 'f5', qKo: '참가비 환불 규정이 궁금해요', qEn: 'What is the refund policy?' },
]

export const policies = [
  { id: 'pl1', ko: '서비스 이용약관', en: 'Terms of Service' },
  { id: 'pl2', ko: '개인정보 처리방침', en: 'Privacy Policy' },
  { id: 'pl3', ko: '위치기반 서비스 약관', en: 'Location Service Terms' },
  { id: 'pl4', ko: '오픈소스 라이선스', en: 'Open-source Licenses' },
]

/* ── Club feature subscription (구독 관리 / 요금제) ──────────────
   The user is on "Club Premium". planId matches one of subPlans below. */
export const subscription = {
  planId: 'premium',
  price: 99000,
  nextDate: '2026-07-09',
  cardKo: '신한카드', cardEn: 'Shinhan Card', cardTail: '1234',
}

/* Three tiers for the rate-plan picker. price 0 = free. */
export const subPlans = [
  {
    id: 'free', price: 0,
    segKo: '개인 골퍼', segEn: 'Individual golfer',
    nameKo: 'Free', nameEn: 'Free',
    featsKo: ['개인 스코어 무제한', 'AI 성적표 인식', '개인 랭킹·통계'],
    featsEn: ['Unlimited personal score', 'AI report-card recognition', 'Individual rankings & stats'],
  },
  {
    id: 'basic', price: 29000,
    segKo: '소규모 모임', segEn: 'Small club',
    nameKo: 'Club Basic', nameEn: 'Club Basic',
    featsKo: ['멤버 100명까지', '행사·조편성·신페리오', '회비·정산 관리', '공지 자동 생성'],
    featsEn: ['Up to 100 members', 'Events · grouping · New Peoria', 'Membership fee & settlement', 'Auto announcement generation'],
  },
  {
    id: 'premium', price: 99000, suggested: true,
    segKo: '기업·대형 골프 모임', segEn: 'Corporate & large clubs',
    nameKo: 'Club Premium', nameEn: 'Club Premium',
    featsKo: ['멤버 무제한', '기본 전체 기능', '전담 운영 지원', '브랜드 모임 페이지'],
    featsEn: ['Unlimited membership', 'All core features', 'Dedicated ops support', 'Branded club page'],
  },
]

/* Monthly billing history for the subscription. */
export const subHistory = [
  { id: 'sb1', planKo: 'Club Premium', planEn: 'Club Premium', amount: 99000, date: '2026-06-01' },
  { id: 'sb2', planKo: 'Club Premium', planEn: 'Club Premium', amount: 99000, date: '2026-05-01' },
  { id: 'sb3', planKo: 'Club Basic', planEn: 'Club Basic', amount: 29000, date: '2026-04-01' },
]

export const clubs = [
  { id: 'c1', nameKr: '강남골프회', nameEn: 'Gangnam Golf', role: '회원', roleEn: 'Member', members: 42, unpaid: 0, nextKr: '6월 14일 (토) 라운드', nextEn: 'Round · Sat Jun 14', icon: 'flag', img: UNSPLASH('1500932334442-8761ee4810a7') },
  { id: 'c2', nameKr: '회사동호회', nameEn: 'Company Club', role: '총무', roleEn: 'Organizer', members: 28, unpaid: 2, nextKr: '6월 20일 (목) 라운드', nextEn: 'Round · Thu Jun 20', icon: 'building', img: UNSPLASH('1611374243147-44a702c2d44c') },
  { id: 'c3', nameKr: '주말번개', nameEn: 'Weekend Lightning', role: '회원', roleEn: 'Member', members: 16, unpaid: 0, nextKr: '', nextEn: '', icon: 'zap', img: UNSPLASH('1535131749006-b7f58c99034b') },
]

/* The signed-in member's own dues for a club (내 회비 / billing details).
   status: 'pending' (awaiting organizer confirmation) | 'unpaid' | 'paid'. */
export const myFees = {
  payerKo: '문양희', payerEn: 'Moon Yang-hee',
  methodKo: '클럽 계좌로 직접 이체', methodEn: 'Direct transfer to club account',
  items: [
    {
      id: 'fee1', catKo: '연회비', catEn: 'Annual fee',
      titleKo: '2026 연회비', titleEn: '2026 Annual Fee',
      amount: 200000, due: '2026-05-31', status: 'pending',
      noteKo: '총무 확인 후 완료로 처리돼요.', noteEn: 'Marked complete after the organizer confirms.',
    },
    {
      id: 'fee2', catKo: '행사비', catEn: 'Event fee',
      titleKo: '6월 정기모임 참가비', titleEn: 'June Monthly Meeting Fee',
      amount: 150000, due: '2026-06-13', status: 'unpaid',
    },
    {
      id: 'fee3', catKo: '연회비', catEn: 'Annual fee',
      titleKo: '2025 연회비', titleEn: '2025 Annual Fee',
      amount: 200000, due: '2025-05-31', status: 'paid', paidOn: '2025-05-20',
    },
  ],
}

/* Members of a club — used by the club detail 멤버 / 정산 tabs. */
export const clubMembers = [
  { id: 'cm1', nameKr: '김총무', nameEn: 'Kim Chong-mu', role: '총무', handicap: 8, paid: true },
  { id: 'cm2', nameKr: '문양희', nameEn: 'Moon Yang-hee', role: '회원', handicap: 12, paid: true, me: true },
  { id: 'cm3', nameKr: '박서준', nameEn: 'Park Seo-jun', role: '회원', handicap: 15, paid: false },
  { id: 'cm4', nameKr: '이도윤', nameEn: 'Lee Do-yoon', role: '회원', handicap: 10, paid: true },
  { id: 'cm5', nameKr: '최유나', nameEn: 'Choi Yu-na', role: '회원', handicap: 18, paid: true },
  { id: 'cm6', nameKr: '정해인', nameEn: 'Jung Hae-in', role: '회원', handicap: 14, paid: false },
  { id: 'cm7', nameKr: '한지우', nameEn: 'Han Ji-woo', role: '회원', handicap: 21, paid: true },
  { id: 'cm8', nameKr: '오세훈', nameEn: 'Oh Se-hun', role: '회원', handicap: 9, paid: true },
]

/* Extended club members — used by the new ClubDetail (member/ranking tabs) */
export const clubMembersFull = [
  { id: 'cf1', nameKr: '문양희', nameEn: 'Moon Yang-hee', initials: 'door', color: '#0A7A37', roleKey: 'owner', handicap: 12, avg: 84.2, paid: true },
  { id: 'cf2', nameKr: '홍길동', nameEn: 'Hong Gil-dong', initials: 'red', color: '#E2571F', roleKey: 'general', handicap: 9, avg: 82.0, paid: true },
  { id: 'cf3', nameKr: '김철수', nameEn: 'Kim Cheol-su', initials: 'awee', color: '#9A7D3A', roleKey: 'management', handicap: 16, avg: 88.4, paid: true },
  { id: 'cf4', nameKr: '박영희', nameEn: 'Park Young-hee', initials: 'Gour', color: '#3B82F6', roleKey: 'member', handicap: 20, avg: 91.2, paid: true },
  { id: 'cf5', nameKr: '이민수', nameEn: 'Lee Min-soo', initials: 'this', color: '#8B5CF6', roleKey: 'member', handicap: 24, avg: 95.0, paid: true },
  { id: 'cf6', nameKr: '정해성', nameEn: 'Jeong Hae-seong', initials: 'fect', color: '#0EA5A0', roleKey: 'member', handicap: 14, avg: 86.1, paid: false },
  { id: 'cf7', nameKr: '최윤아', nameEn: 'Choi Yoon-ah', initials: 'Choi', color: '#E91E8C', roleKey: 'member', handicap: 18, avg: 90.3, paid: true },
  { id: 'cf8', nameKr: '강대호', nameEn: 'Kang Dae-ho', initials: 'river', color: '#4CAF50', roleKey: 'member', handicap: 11, avg: 83.5, paid: true },
]

/* Club ranking — sorted by avg strokes ascending */
export const clubRanking = [
  { rank: 1, nameKr: '홍길동', nameEn: 'Hong Gil-dong', initials: 'red', color: '#E2571F', handicap: 9, score: 82.0, scoreLabel: '82 hits' },
  { rank: 2, nameKr: '강대호', nameEn: 'Kang Dae-ho', initials: 'river', color: '#4CAF50', handicap: 11, score: 83.5, scoreLabel: '83.5 strokes' },
  { rank: 3, nameKr: '문양희', nameEn: 'Moon Yang-hee', initials: 'door', color: '#0A7A37', handicap: 12, score: 84.2, scoreLabel: '84.2 Ta' },
  { rank: 4, nameKr: '정해성', nameEn: 'Jeong Hae-seong', handicap: 14, score: 86.1 },
  { rank: 5, nameKr: '김철수', nameEn: 'Kim Cheol-su', handicap: 16, score: 88.4 },
  { rank: 6, nameKr: '최윤아', nameEn: 'Choi Yoon-ah', handicap: 18, score: 90.3 },
  { rank: 7, nameKr: '박영희', nameEn: 'Park Young-hee', handicap: 20, score: 91.2 },
  { rank: 8, nameKr: '이민수', nameEn: 'Lee Min-soo', handicap: 24, score: 95.0 },
]

/* Pending membership applicants */
export const pendingApplicants = [
  { id: 'pa1', nameKr: '서지훈', nameEn: 'Seo Ji-hoon', initials: 'west', color: '#3B82F6' },
  { id: 'pa2', nameKr: '오현진', nameEn: 'Oh Hyun-jin', initials: 'oh', color: '#E91E8C' },
]

/* Korean regions (시·도) for the region picker. */
export const regions = [
  { ko: '서울', en: 'Seoul' }, { ko: '경기', en: 'Gyeonggi' }, { ko: '인천', en: 'Incheon' },
  { ko: '강원', en: 'Gangwon' }, { ko: '충북', en: 'Chungbuk' }, { ko: '충남', en: 'Chungnam' },
  { ko: '대전', en: 'Daejeon' }, { ko: '전북', en: 'Jeonbuk' }, { ko: '전남', en: 'Jeonnam' },
  { ko: '광주', en: 'Gwangju' }, { ko: '경북', en: 'Gyeongbuk' }, { ko: '경남', en: 'Gyeongnam' },
  { ko: '대구', en: 'Daegu' }, { ko: '울산', en: 'Ulsan' }, { ko: '부산', en: 'Busan' },
  { ko: '제주', en: 'Jeju' },
]

/* Round formats for the create-round page. */
export const roundFormats = [
  { id: 'newperio', ko: '신페리오', en: 'New Peoria' },
  { id: 'stroke', ko: '스트로크', en: 'Stroke play' },
  { id: 'fourball', ko: '포볼', en: 'Fourball' },
]

/* Club types for the create-club page. */
export const clubTypes = [
  { id: 'regular', ko: '정기 모임', en: 'Regular', emoji: '⛳' },
  { id: 'company', ko: '회사 동호회', en: 'Company', emoji: '🏢' },
  { id: 'friends', ko: '친구 모임', en: 'Friends', emoji: '🍻' },
  { id: 'open', ko: '오픈 번개', en: 'Open meetup', emoji: '⚡' },
]

/* Clubs near the user, sorted by distance — the "내 주변 모임" page. */
export const nearbyClubs = [
  { id: 'nb1', nameKr: '한강 라이더스', nameEn: 'Hangang Riders', regionKr: '서울 강서', regionEn: 'Gangseo, Seoul', members: 54, km: 1.2, icon: 'bike', img: UNSPLASH('1500932334442-8761ee4810a7') },
  { id: 'nb2', nameKr: '주말번개', nameEn: 'Weekend Lightning', regionKr: '서울 송파', regionEn: 'Songpa, Seoul', members: 16, km: 2.4, icon: 'zap', img: UNSPLASH('1535131749006-b7f58c99034b') },
  { id: 'nb3', nameKr: '새벽 골퍼스', nameEn: 'Dawn Golfers', regionKr: '경기 성남', regionEn: 'Seongnam', members: 31, km: 5.8, icon: 'sunrise', img: UNSPLASH('1593111774240-d529f12cf4bb') },
  { id: 'nb4', nameKr: '그린피 모임', nameEn: 'Green Fee Club', regionKr: '경기 분당', regionEn: 'Bundang', members: 27, km: 7.1, icon: 'flag', img: UNSPLASH('1611374243147-44a702c2d44c') },
  { id: 'nb5', nameKr: '시니어 클럽', nameEn: 'Senior Club', regionKr: '인천 연수', regionEn: 'Incheon', members: 22, km: 12.3, icon: 'target', img: UNSPLASH('1500932334442-8761ee4810a7') },
]

/* Search hub seed data (모임 검색). */
export const searchRecent = ['강남골프회', '성남', '레이크사이드']
export const searchPopular = ['남서울CC', '강남골프회', '성남', '주말번개', '레이크사이드', '회사동호회']
export const searchRegions = ['서울', '경기', '강원', '인천', '부산', '제주']

/* Clubs the user could join — shown in the 모임 hub's discover section. */
export const recommendedClubs = [
  { id: 'rc1', nameKr: '한강 라이더스', nameEn: 'Hangang Riders', regionKr: '서울 강서', regionEn: 'Seoul', members: 54, tagKr: '주말 라운드', tagEn: 'Weekend', icon: 'bike', img: UNSPLASH('1500932334442-8761ee4810a7') },
  { id: 'rc2', nameKr: '새벽 골퍼스', nameEn: 'Dawn Golfers', regionKr: '경기 성남', regionEn: 'Seongnam', members: 31, tagKr: '새벽 번개', tagEn: 'Early bird', icon: 'sunrise', img: UNSPLASH('1593111774240-d529f12cf4bb') },
  { id: 'rc3', nameKr: '시니어 클럽', nameEn: 'Senior Club', regionKr: '인천 연수', regionEn: 'Incheon', members: 22, tagKr: '시니어', tagEn: 'Senior', icon: 'target', img: UNSPLASH('1611374243147-44a702c2d44c') },
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

export const notifications = [
  { id: 'n1', type: 'event', unread: true, timeKo: '오늘 09:32', timeEn: 'Today 09:32',
    titleKo: '5월 정기 라운드 마감 임박', titleEn: 'May Monthly Round closing soon',
    bodyKo: '남은 자리 2석 · D-3, 서둘러 신청하세요.', bodyEn: '2 spots left · D-3 — register soon.' },
  { id: 'n2', type: 'settle', unread: true, timeKo: '오늘 08:10', timeEn: 'Today 08:10',
    titleKo: '정산이 완료되었어요', titleEn: 'Settlement complete',
    bodyKo: '회사 친선 대회 · 잔액 8만원 흑자', bodyEn: 'Company Friendly Cup · ₩80,000 surplus' },
  { id: 'n3', type: 'score', unread: false, timeKo: '오늘 07:45', timeEn: 'Today 07:45',
    titleKo: '새 스코어 분석 리포트가 도착했어요', titleEn: 'Your new score report is ready',
    bodyKo: '최근 10경기 평균 84.2타 · 퍼팅 개선 필요', bodyEn: 'Avg 84.2 over 10 rounds · putting needs work' },
  { id: 'n4', type: 'rank', unread: false, timeKo: '어제', timeEn: 'Yesterday',
    titleKo: '5월 정기 라운드 순위가 확정됐어요', titleEn: 'May round rankings are final',
    bodyKo: '문양희님 1위 · 신페리오 Net 68.0', bodyEn: 'Moon 1st · New Peoria Net 68.0' },
  { id: 'n5', type: 'club', unread: false, timeKo: '6월 12일', timeEn: 'Jun 12',
    titleKo: '박철수님이 회사동호회에 가입했어요', titleEn: 'Park joined Company Club',
    bodyKo: '이제 28명이 함께하고 있어요.', bodyEn: 'Now 28 members strong.' },
  { id: 'n6', type: 'event', unread: false, timeKo: '6월 10일', timeEn: 'Jun 10',
    titleKo: '회사 친선 대회 참가 신청이 시작됐어요', titleEn: 'Sign-ups open: Company Friendly Cup',
    bodyKo: '레이크사이드 · 5/23 (목) 06:50', bodyEn: 'Lakeside · Thu 5/23 06:50' },
]

/* Older, already-read notifications shown on the "지난 알림" history page. */
export const notificationHistory = [
  { id: 'h1', type: 'settle', monthKo: '6월', monthEn: 'June', timeKo: '6월 03일', timeEn: 'Jun 03',
    titleKo: '4월 정기 라운드 정산 완료', titleEn: 'April round settled',
    bodyKo: '잔액 5만원 흑자 · 회비로 이월', bodyEn: '₩50,000 surplus carried over' },
  { id: 'h2', type: 'score', monthKo: '6월', monthEn: 'June', timeKo: '6월 01일', timeEn: 'Jun 01',
    titleKo: '5월 스코어 분석 리포트', titleEn: 'May score report',
    bodyKo: '평균 85.1타 · 드라이버 안정화', bodyEn: 'Avg 85.1 · driver stabilizing' },
  { id: 'h3', type: 'event', monthKo: '5월', monthEn: 'May', timeKo: '5월 20일', timeEn: 'May 20',
    titleKo: '봄맞이 라운드가 종료됐어요', titleEn: 'Spring round has ended',
    bodyKo: '참가해주셔서 감사합니다.', bodyEn: 'Thanks for joining.' },
  { id: 'h4', type: 'club', monthKo: '5월', monthEn: 'May', timeKo: '5월 11일', timeEn: 'May 11',
    titleKo: '이영희님이 강남골프회에 가입했어요', titleEn: 'Lee joined Gangnam Golf',
    bodyKo: '함께 라운드를 즐겨보세요.', bodyEn: 'Say hello and play a round.' },
  { id: 'h5', type: 'rank', monthKo: '5월', monthEn: 'May', timeKo: '5월 04일', timeEn: 'May 04',
    titleKo: '4월 친선전 순위가 확정됐어요', titleEn: 'April friendly rankings final',
    bodyKo: '문양희님 2위 · Net 70.5', bodyEn: 'Moon 2nd · Net 70.5' },
]

/* Locale-aware currency. ko: "80,000원"  ·  en: "₩80,000" (sign preserved). */
export const money = (n, lang = 'ko') => {
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n).toLocaleString('en-US')
  return lang === 'en' ? `${sign}₩${abs}` : `${n.toLocaleString('ko-KR')}원`
}
