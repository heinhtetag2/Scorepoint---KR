import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

/* Meta "what changed today" assistant for the prototype shell.
   A floating button toggles a chat-style modal that lists the day's UI updates. */
const CHANGELOG = [
  {
    icon: '🎬', titleKo: '온보딩', titleEn: 'Onboarding',
    ko: ['인트로 캐러셀 + 소셜 로그인(카카오·애플·전화)', '프로필 설정: 아바타·핸디캡·평균타수·생년월일·성별', '완료 화면 애니메이션 후 홈으로 자동 이동'],
    en: ['Intro carousel + social login (Kakao/Apple/phone)', 'Profile setup: avatar, handicap, avg score, DOB, gender', 'Animated "done" → auto-advances to Home'],
  },
  {
    icon: '🔔', titleKo: '알림', titleEn: 'Notifications',
    ko: ['상단 큰 제목 + 필터 탭(전체/행사/정산/스코어/모임)', '"내 소식" 목록 · 모두 읽기 · 코치마크 툴팁', '지난 알림(히스토리) 페이지 추가'],
    en: ['Large title + filter tabs (All/Events/Settle/Scores/Clubs)', '"My updates" list · mark-all-read · coachmark tip', 'Added 지난 알림 (history) page'],
  },
  {
    icon: '👤', titleKo: '내 정보', titleEn: 'Profile',
    ko: ['헤더 + 퀵스탯 + 등급 프로모 + 그룹 메뉴', '홈 우상단을 실제 사용자 아바타로 변경', '로그아웃은 가운데 텍스트 링크로'],
    en: ['Header + quick stats + tier promo + grouped menu', 'Home top-right is now a real user avatar', 'Logout is a quiet centered link'],
  },
  {
    icon: '🖼️', titleKo: '프로필 편집', titleEn: 'Edit profile',
    ko: ['좌우 스와이프 아바타 캐러셀(2D 캐릭터)', '배경 색상 선택(흰색 외곽선 선택 표시)', '내 정보 관리: 항목별 편집 + 저장 토스트'],
    en: ['Swipeable avatar carousel (2D characters)', 'Background color picker (white-outline selected)', '내 정보 관리: per-field edit + save toast'],
  },
  {
    icon: '💳', titleKo: '등급 · 결제', titleEn: 'Tier & payments',
    ko: ['등급·혜택: 멤버십 카드 + 골프 등급 사다리', '결제수단 추가 화면 + 편집/삭제 기능'],
    en: ['Tier card with golf-score ladder', 'Add payment method screen + edit/remove'],
  },
  {
    icon: '⚙️', titleKo: '시스템 정리', titleEn: 'System polish',
    ko: ['iOS 상태바 재구성(5G·와이파이·배터리)', '생년월일 자동 포맷(YYYY.MM.DD)', '스위치·토스트 등 공통 컴포넌트 추가'],
    en: ['Rebuilt iOS status bar (5G/wifi/battery)', 'Auto date format (YYYY.MM.DD)', 'New shared Switch / toast components'],
  },
]

export default function ChangelogBot() {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const ko = lang === 'ko'

  return (
    <>
      <button className="cl-fab" onClick={() => setOpen((v) => !v)}>
        <Sparkles size={17} strokeWidth={2.2} />
        {ko ? '오늘의 업데이트' : "Today's updates"}
      </button>

      {open && (
        <div className="cl-overlay" onClick={() => setOpen(false)}>
          <div className="cl-panel" onClick={(e) => e.stopPropagation()}>
            <header className="cl-head">
              <span className="cl-bot"><Sparkles size={16} strokeWidth={2.4} /></span>
              <div className="cl-head-txt">
                <strong>{ko ? 'ScoreShot 업데이트 봇' : 'ScoreShot update bot'}</strong>
                <span>{ko ? '오늘 작업한 UI 변경 내역' : "Today's UI changes"}</span>
              </div>
              <button className="cl-close" onClick={() => setOpen(false)} aria-label="close"><X size={18} /></button>
            </header>

            <div className="cl-body">
              <div className="cl-msg user">{ko ? '오늘 뭐가 바뀌었어요?' : 'What changed today?'}</div>
              <div className="cl-msg bot">{ko ? '안녕하세요! 오늘 작업한 변경 내역이에요 👇' : "Hi! Here's everything I worked on today 👇"}</div>

              {CHANGELOG.map((g) => (
                <div className="cl-msg bot cl-card" key={g.titleEn}>
                  <div className="cl-card-title">{g.icon} {ko ? g.titleKo : g.titleEn}</div>
                  <ul>{(ko ? g.ko : g.en).map((line, i) => <li key={i}>{line}</li>)}</ul>
                </div>
              ))}

              <div className="cl-msg bot">{ko ? '더 바꾸고 싶은 게 있으면 말씀해 주세요! 🙌' : 'Tell me what to change next! 🙌'}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
