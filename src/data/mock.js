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
