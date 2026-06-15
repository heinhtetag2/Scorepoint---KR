# ScoreShot — Product Analysis & Strategy Document

A complete breakdown of **ScoreShot** — the AI golf-club operations platform — across business, UX, technical, data, and strategy lenses. Written in plain English for the whole team.

Reviewed as PM · Business Analyst · UX Designer · System Architect · Mobile Engineer · Backend Architect · Analytics Lead · Product/UX Director · CTO · Founder.

| | |
|---|---|
| **Document** | Product Analysis |
| **Product Type** | AI-powered Vertical SaaS |
| **Version** | v1.0 |
| **Date** | 2026-06-15 |
| **Audience** | Product · Design · Eng |

---

## 00 · Orientation — What kind of product is this?

Before analyzing, we name the product type — because that decides which risks and patterns matter most.

> **AI-powered Vertical SaaS** with a **B2B2C** twist and a light **fintech-adjacent** edge.

- **Why "Vertical SaaS"** — It is software sold by subscription to run one specific industry workflow: golf-club administration. Not a general tool; it knows golf (handicaps, New Peria scoring, awards).
- **Why "AI-powered"** — The core magic is OCR: read a scorecard photo and turn it into structured scores. AI removes the most painful manual step.
- **Why "B2B2C"** — We reach clubs (B) through individual golfers (C). Individuals join free; the club organizer pays for operations.
- **Why "fintech-adjacent"** — It touches money (dues and settlement) but deliberately does **not** hold funds (Model A). This avoids heavy financial regulation.

> **Plain-English note:** "OCR" = Optical Character Recognition = software that reads text/numbers from an image, the way you read a receipt photo.

---

## Contents

1. Product Breakdown
2. System Architecture
3. Hardware, Sensors & Device
4. User Flows
5. Edge Cases
6. Feature Deep Dive
7. Data & Analytics
8. Database Thinking
9. Design System Requirements
10. Senior Product Review
11. MVP Recommendation
12. How to read this document

---

## 01 · Product Breakdown — *PM · BA · UX*

### 1. The problem it solves
Running a golf society is unpaid, repetitive admin work. After every round the volunteer organizer (**"총무"**, the manager) must copy scores by hand, decide awards, split the bill, chase payments, and write a results announcement. ScoreShot automates that whole chain starting from one photo.

### 2. Target users
- **Individual golfers** (often 40s–60s) who want easy score tracking.
- **Club managers (총무)** — the power users who feel the pain most.
- **Club owners** — they create the club and pay the subscription.
- **Context:** company golf societies, CEO clubs, hobby clubs in Korea.

### 3. Why users need it
Managers burn hours per event and fear money mistakes. Members want a clean record of their game without effort. The product trades manual work for a few taps, and keeps money handling safe by never touching the funds itself.

### 4. Business goals
1. Grow free individual users as a funnel.
2. Convert club operations to paid subscription (Toss recurring).
3. Become the default operating system for golf societies.
4. Keep regulatory/operational risk low (no fund custody).

### 5. User goals
- **Member:** log scores, see progress, join events, pay dues easily.
- **Manager:** finish post-round tasks fast, no errors, no awkward money chasing.
- **Owner:** set up a club, delegate roles, control billing.

### 6. Key features
Photo → AI score entry (OCR) · Personal stats & trend · Club create + QR invite · Events & RSVP · Auto / manual grouping · New Peria scoring · Awards · Settlement + transfer link · Auto result notice · Dues (Model A) · Subscription paywall · Role switching.

### 7. Main user journey (the "killer flow")
```
Create event → Collect RSVPs → Make groups → Photo the scorecards
     → AI reads scores → New Peria ranking → Awards
     → Settle costs → Send transfer link → Auto-post results
```

### 8. Core screens
Onboarding (3) · Home · My Score (5) · Club (8) · Events (10) · Subscription & Settlement (6) · Dues (4) · Notices/MY/Settings (4). **37 screens + 2 bottom sheets** in the prototype.

### 9. MVP scope (built)
Onboarding, Home, full personal-score flow, club lifecycle, the manager killer flow, subscription paywall loop, and the dues cycle (Model A). AI/payment/scoring are realistic mock states.

### 10. Future roadmap
Real Toss billing, attendance (E5), sponsorship ledger (G2), personal ranking screen (F2), web admin dashboard (H4), then optional Model B (in-app payments).

> **Explain it like I'm new here:** Think of ScoreShot as "the manager's robot assistant for golf day." The manager takes one photo of the scoreboard, and the app does the math, picks the winners, splits the bill, and writes the group chat message. Members just get a tidy scorecard and an easy way to pay their share.

---

## 02 · System Architecture — *System Architect*

High-level picture of how the pieces talk to each other. The current build is a front-end prototype; below is the recommended production architecture.

```
          Mobile Web App (PWA)            Web Admin Dashboard
        member · manager · owner            internal ops / analytics
                  |                                   |
                  |  HTTPS / JSON                     |
                  v                                   v
        +-------------------------------------------------------+
        |                  API Server  (REST)                   |
        |  auth · clubs · events · scores · dues · billing      |
        +-------------------------------------------------------+
            |          |            |            |          |
            v          v            v            v          v
       Database   OCR Service   Scoring     Payments   Notify
       (Postgres) (AI vision)  (New Peria)  (Toss)    (push/Kakao)
            |
            v
       Object storage (scorecard & receipt images)
```

### User-side app architecture
A single PWA. One code base serves all three roles; the screen decides what to show based on the user's role and the club's subscription state. Navigation is 5 bottom tabs, each with its own screen stack (so "back" works per tab).

### Admin-side architecture
A separate desktop web dashboard (future H4) for the ScoreShot team: members, clubs, revenue, OCR success rate, payment status. Read-mostly; talks to the same API.

### Role-based architecture
Same screen, different buttons:
```
  member  ─ sees: scores, RSVP, my dues
  manager ─ sees member + : create event, grouping, results,
            scoring, settlement, dues management        (paywalled if club unpaid)
  owner   ─ sees manager + : roles, ownership transfer, billing
```

### Backend & database (recommended)

| Layer | Choice (example) | Why (simple) |
|---|---|---|
| API Server | Node/NestJS or similar | One door for the app to ask for / save data. |
| Database | PostgreSQL | Reliable store for users, clubs, scores, dues. |
| Image storage | S3-style bucket | Photos are big; keep them out of the DB. |
| OCR | Cloud vision + golf-tuned model | Turn a scorecard photo into numbers. |
| Payments | Toss Payments (billing key) | Charge the monthly subscription automatically. |
| Notifications | Push + Kakao share | Reach members where they already are. |

### APIs required (representative)
```
POST  /auth/social
GET   /me
POST  /scores:ocr
POST  /scores
POST  /clubs
POST  /clubs/:id/members
POST  /events
POST  /events/:id/groups:auto
POST  /events/:id/results:ocr
GET   /events/:id
POST  /settlements
POST  /dues/bills
PATCH /dues/:id            (confirm)
POST  /billing/subscribe
```

### Third-party services
Social login (Kakao/Naver/Google/Apple) · OCR vision API · Toss Payments · Kakao share · Push provider · Maps/golf-course directory (optional).

### What happens technically on key actions

| User action | What the system does |
|---|---|
| Photographs a scorecard | Image uploads to storage → OCR returns golf course, players, hole scores with confidence → app shows it for the user to verify → confirmed scores saved. |
| Runs New Peria | Server applies hidden-hole & correction settings to saved gross scores → returns ranks & Net → winner flagged. |
| Creates a transfer link | Server builds a payment-request URL (Toss/Kakao) for the per-person amount → app shares it; no money flows through ScoreShot. |
| Subscribes | Toss issues a billing key → server marks the club `subscribed=true` → manager features unlock. |
| Confirms a dues payment | Manager taps confirm → member status flips `pending → paid` → collection rate recalculates. |

---

## 03 · Hardware, Sensors & Device Capabilities — *Mobile Engineer · Designer*

Good news: this product is light on hardware. The only essential sensor is the camera. Everything else is optional or "nice to have".

| Capability | Used? | Where / why |
|---|---|---|
| Camera | **Essential** | The heart of the product — photograph scorecards & receipts for OCR. |
| Photo library | **Essential** | Pick an existing photo instead of shooting live. |
| Push notifications | **Recommended** | Event invites, dues reminders, payment receipts, results. |
| GPS / location | Optional | Could auto-suggest the golf course; not required for MVP. |
| Microphone | No | Not needed. |
| Bluetooth | No | Not needed (no wearables in MVP). |
| Accelerometer / Gyroscope | No | Not needed. |
| Biometric unlock | Optional | Could protect billing/owner actions later. |

- **Battery impact** — Low. Camera bursts are short; no GPS tracking or background sensors. Image upload is the main cost — compress before sending.
- **Privacy implications** — Camera + photos = sensitive permission. Guest registration and dues collect personal data → need clear consent (already in the design) and a privacy policy.
- **Possible vs not** — Possible now: camera OCR, push, share. Not possible/needed: Bluetooth scoring devices, motion swing analysis — out of scope.
- **MVP recommendation** — Ship with camera + photo library + push. Treat GPS, biometrics as fast-follows. Skip mic/Bluetooth/motion entirely — they add permission friction with no payoff for this audience.

> **PWA note:** a Progressive Web App can use the camera and push on modern phones, but native iOS push needs the user to "Add to Home Screen". If push proves critical, consider a thin native wrapper later.

---

## 04 · User Flows — *Senior UX Designer*

**First-time experience (onboarding)**
```
Open app → Splash (value promise) → Social login →
Create profile (name, optional handicap) → Home
```

**Happy path — personal score (member)**
```
Home → tap "Score entry" → Camera → shoot
  → AI analyzing (4 steps) → Verify result → Save → appears in list
```

**Happy path — manager killer flow**
```
Create event → RSVPs → Groups → Photo scorecard
  → Verify 32 players → New Peria → Awards
  → Settlement → Transfer link → Auto notice
```

**Conversion path — subscription**
```
Manager taps a locked feature → Paywall sheet → Plans
  → Toss payment → club unlocked → back to club (badge changes)
```

**Money path — dues (Model A)**
```
Manager: create bill → send  ||  Member: My Dues → Pay
  → copy account / Toss / Kakao → "I sent it" (status = pending)
  → Manager confirms → status = paid → collection rate updates
```

| Path type | Example in ScoreShot |
|---|---|
| Alternative path | Member RSVPs "absent" or "waiting" instead of "attend"; manager builds groups manually instead of AI. |
| Edge path | OCR confidence low → user fixes a "확인필요" field inline before saving. |
| Failure path | Photo unreadable → re-shoot prompt; payment fails → retry on Toss screen. |
| Returning user | Lands on Home with AI insight + upcoming event; one tap to log a new round. |
| Role journeys | Member = play & pay; Manager = run events & money; Owner = setup, delegation, billing. |

---

## 05 · Edge Cases — *Senior UX Designer*

For each: user experience, system response & UI, then message / recovery / prevention.

| Edge case | System response & UI | Message · recovery · prevention |
|---|---|---|
| No internet | Detect offline; show banner; queue the action. | "인터넷 연결을 확인해 주세요." Retry. **Prevent:** cache last data, allow draft. |
| App/page load fails | Splash fallback + retry. | "잠시 후 다시 시도해 주세요." **Recover:** reload. **Prevent:** bundled splash. |
| OCR can't read photo | Return low confidence; keep user on verify screen. | "사진을 다시 찍어 주세요." **Recover:** re-shoot / manual. **Prevent:** corner guides. |
| Camera permission denied | Block capture, explain why. | "카메라 권한이 필요해요." Deep-link to settings. **Prevent:** ask in context. |
| Notifications denied | Fall back to in-app + Kakao share. | Soft re-ask later. **Prevent:** explain value before OS prompt. |
| Payment failure (Toss) | Stay on payment; show reason. | "결제에 실패했어요. 다른 카드로 시도해 주세요." **Recover:** retry. **Prevent:** validate first. |
| Empty list / no data | Friendly placeholder + primary CTA. | "아직 등록한 경기가 없어요." **Prevent:** guide to first action. |
| Server error | Graceful toast, keep input. | "문제가 발생했어요." **Recover:** auto-retry. **Prevent:** input autosave. |
| User switches device | Server is source of truth; re-login restores. | Social re-auth. **Prevent:** never keep critical state only on device. |
| Owner leaves club | Block until ownership transferred. | "새 소유자를 먼저 지정해 주세요." Guard screen. **Prevent:** existing transfer gate. |
| Cancel halfway | Discard safely; confirm only if data entered. | "작성 중인 내용을 취소할까요?" **Prevent:** confirm on unsaved input only. |
| Subscription lapses | Re-lock manager features; data read-only. | Upsell banner returns. **Prevent:** pre-renewal reminder. |

---

## 06 · Feature Deep Dive — *Product Manager*

| Feature | Purpose / benefit | Tech & risks | MVP | Future |
|---|---|---|---|---|
| Photo → score (OCR) | Kills manual entry; the "wow". Core differentiator & retention. | Vision OCR + verify UI. Risk: accuracy on messy cards. | **Must** | Putting / segment insights. |
| Personal stats | Top-of-funnel engagement. | Simple charts. Risk: thin without history. | **Must** | Deeper trends. |
| Club + QR invite | Network growth loop. Viral acquisition. | QR/link, roles. Risk: spam/abuse. | **Must** | Approval rules, discovery. |
| Events & RSVP | Organize rounds. Drives paid usage. | CRUD + notify. Risk: low. | **Must** | Waitlist auto-promote. |
| Grouping (AI/manual) | Saves fiddly admin. Stickiness. | Balance algorithm. Risk: "unfair" perception. | **Must** | Constraints memory, tee-time. |
| New Peria scoring | Removes disputes. Golf-specific moat. | Deterministic calc. Risk: wrong settings. | **Must** | More formats (Callaway…). |
| Awards | Celebrates the day. Shareable joy. | Derived from results. Risk: low. | **Should** | Custom awards, photos. |
| Settlement + link | Ends payment chasing. Premium hook. | Per-person calc + link. Risk: money trust. | **Must** | Per-person status tracking. |
| Auto notice | Writes the group message. Delight. | Template fill. Risk: tone. | **Should** | Editable / AI copy. |
| Dues (Model A) | Tracks money safely. Manager value, no custody. | Status machine. Risk: manual-confirm friction. | **Must** | Reminders, history, exemptions. |
| Subscription paywall | Monetization — the revenue. | Toss billing key. Risk: too aggressive = churn. | **Must** | Trials, annual, coupons. |
| Role switching | Shows permission model. Sales/demo tool. | Context state. Risk: none (demo). | **Demo** | Real invites & audit log. |

> **"Idempotent"** = doing the same action twice has the same effect as once — so a double-tap never charges or records twice.

---

## 07 · Data & Analytics — *Product Analytics Lead*

What to measure so we know the product is healthy and the funnel converts. "Event" here = a tracked user action, not a golf event.

### Event tracking plan

| Event name | Trigger | User | Key properties | Why it matters |
|---|---|---|---|---|
| `app_opened` | App launch | all | source, role | Base activity / DAU. |
| `signup_completed` | Profile created | new | provider | Top-of-funnel growth. |
| `onboarding_completed` | Reaches Home | new | filled_handicap | Activation quality. |
| `score_capture_started` | Camera opened | member | mode | Top of core-value funnel. |
| `score_saved` | Verify → Save | member | confidence, edits | Activation; OCR quality. |
| `club_created` | Club made | owner | region | Supply side of network. |
| `member_joined` | Join approved | member | via (qr/search) | Viral loop strength. |
| `event_created` | Event saved | manager | fee, cap | Manager engagement. |
| `peria_calculated` | Run New Peria | manager | players | Killer-flow depth. |
| `settlement_link_created` | Transfer link made | manager | per_person | Premium value proof. |
| `paywall_viewed` | Paywall sheet opens | manager | trigger | Conversion funnel top. |
| `subscription_started` | Toss success | owner | plan | Revenue conversion. |
| `dues_bill_sent` | Bill issued | manager | type, amount | Money-feature adoption. |
| `dues_marked_sent` | "I sent it" | member | bill_id | Member-side completion. |
| `dues_confirmed` | Manager confirms | manager | bill_id | Collection completion. |
| `error_occurred` | Any failure | all | type, screen | Reliability / friction. |
| `notification_opened` | Push tapped | all | kind | Re-engagement value. |
| `reactivated` | Return after 14d+ | all | days_away | Retention recovery. |

### KPIs & funnels
- **North-star** — Events fully run in ScoreShot (RSVP → results → settlement). It proves real workflow value, not just sign-ups.
- **Conversion funnel** — `paywall_viewed → plans → subscription_started`. Track drop-off at each step; A/B the trial offer.
- **Activation funnel** — `signup → onboarding → first score_saved` (member) / first `event_created` (manager).
- **Health metrics** — OCR success rate, OCR edit rate, error rate, dues collection rate, MRR, churn.
- **Retention** — D1/D7/D30 by role · seasonal (golf is weather/season-driven). **Engagement** — rounds logged / month, events / club / month.

---

## 08 · Database Thinking — *Backend Architect*

An ERD-style sketch. "ERD" = Entity-Relationship Diagram = a map of data tables and how they link.

```
User
 ├── Profile (handicap, avg)
 ├── Memberships ── Club ── Subscription
 │                   ├── Events ── Groups, Results, Awards
 │                   ├── DuesBills ── DuesStatus (per member)
 │                   └── Notices
 ├── Rounds ── HoleScores
 └── Notifications / Settings
```

| Table | Purpose | Main fields | Relationships |
|---|---|---|---|
| users | A person | id, name, provider | 1—N rounds |
| clubs | A golf society | id, name, region, owner_id, plan | 1—N memberships, events |
| memberships | User ↔ club + role | user_id, club_id, role, status | N—1 user, N—1 club |
| subscriptions | Billing state per club | club_id, plan, status, trial_ends, billing_key | 1—1 club |
| rounds | A personal game | id, user_id, course, date, gross, net | 1—N hole_scores |
| hole_scores | Per-hole detail | round_id, hole, par, strokes | N—1 round |
| events | A club outing | id, club_id, course, date, fee, cap | 1—N rsvps, groups, results |
| rsvps | Attendance | event_id, user_id, status | N—1 event |
| results | Per-player event score | event_id, user_id, gross, hcp, net, rank | N—1 event |
| dues_bills | A charge | id, club_id, type, amount, due | 1—N dues_status |
| dues_status | Per-member payment | bill_id, user_id, state (paid/pending/unpaid/exempt) | N—1 bill, N—1 user |
| settlements | Event cost split | event_id, items[], sponsor, per_person | 1—1 event |
| notices | Club announcements | id, club_id, title, body, pinned | N—1 club |
| events_log | Analytics events | name, user_id, props, ts | append-only |

> **Notes:** Images live in object storage (URLs in DB); the analytics log is append-only and can move to a warehouse; per-club data partitions cleanly as clubs grow.

---

## 09 · Design System Requirements — *Senior Product Designer*

Inventory of screens, components and their states. (Full tokens are in the separate 기획서/명세서; summarized here.)

| Category | Component / Screen | Purpose | States | Notes |
|---|---|---|---|---|
| Button | btn (primary/dark/gold/ghost/soft/danger) | Actions & CTAs | default · active · disabled | 16px, ≥44px tall. |
| Input | input / textarea / Field | Data entry | default · focus · error · filled | Big text for 중장년. |
| Search | search bar + filter chips | Find clubs | empty · typing · results · no-result | Region filters. |
| Card | card / card pad | Group content | default · pressable | 0.5–1px border, 12px radius. |
| List | ListRow | Rows of items | default · active · with-badge | icon/lead/title/sub/right. |
| Tabs | club detail tabs / Seg | Switch views | active · inactive | Role adds "회비" tab. |
| Bottom nav | 5-tab bar | Top navigation | active · inactive | Per-tab stack. |
| Modal / Sheet | Sheet, PaywallSheet, DuesPaySheet | Focused tasks | open · closing | Slide-up, dimmed back. |
| Toast | Toast | Confirmations | show · auto-dismiss | Non-blocking. |
| Badge / Pill | Pill, RoleBadge | Status & role | green/gold/amber/red/gray | Lock = amber "구독 필요". |
| Empty state | list placeholders | Guide first action | — | Icon + line + CTA. |
| Loading | spinner, dots, step-loader | OCR / payment waits | analyzing · processing | Add skeletons in prod. |
| Error | inline + toast | Failures | field-error · screen-error | Plain-Korean copy. |
| Profile | Avatar, MY header | Identity | initial · image | Colored initials fallback. |

- **Tokens** — Deep green `#0F5132`, green `#198754`, gold `#C9A227`, bg `#F8F9FA`, text `#1A1A1A`. Pretendard. 8/12/16px radius.
- **Accessibility** — 16px base, ≥44px targets, ≥4.5:1 contrast, clear focus rings. Built for older eyes & fingers.
- **Responsive** — Mobile-first 390×844, single column. Admin (future) is desktop-only.
- **Gaps to add for production** — Loading skeletons, full empty-state set, and a consistent error-pattern library — these are thin in the prototype and matter a lot for a trustworthy feel.

---

## 10 · Senior Product Review — *Director · CTO · Founder*

A critical look. The honest job here is to challenge decisions, not cheer them.

| Area | Issue | Why it matters | Recommendation |
|---|---|---|---|
| OCR accuracy | Whole value rests on reading messy scorecards/tablets. | If it's wrong often, trust collapses on day one. | Invest early; always keep human verify; measure edit-rate. |
| Manual dues confirm | Model A needs the manager to confirm each payment. | Friction; managers may revert to a group chat. | Make confirm one tap; add bulk confirm & reminders. |
| Seasonality | Golf is seasonal & weather-driven. | Winter churn; MRR dips. | Annual plans, off-season value (stats, planning). |
| Payer ≠ user | Owner pays; members get most daily value. | Willingness-to-pay sits with one person. | Sell the manager's time-savings hard; ROI framing. |
| Paywall timing | Locking too early kills goodwill. | Managers bounce before seeing value. | Generous trial; let them feel the killer flow first. |
| Money trust | Even Model A links to money. | One bad story spreads in clubs fast. | Keep "we don't handle funds" message; never custody in MVP. |
| Demo role toggle | Great for demo, dangerous if shipped literally. | Users could self-escalate permissions. | Replace with real invites/audit before launch. |
| Scope creep | Sponsorship, attendance, admin all tempting. | Dilutes focus from the killer flow. | Delay P2/P3; nail OCR → Peria → settle first. |

- **Biggest risks** — UX: OCR errors. Tech: OCR + payment reliability. Business: single-payer willingness & seasonal churn.
- **Chance of success** — Solid for a focused niche: a real, painful, repeated workflow with a clear payer. Success hinges on OCR quality + trust.
- **Add / remove** — **Add:** bulk dues confirm, trials, annual. **Remove/Delay:** web admin, sponsorship ledger, in-app payments.

---

## 11 · MVP Recommendation — *Startup Product Strategist*

The smallest version that proves the core bet: **managers will pay to run their golf day in one app.**

| Priority | Feature | Reason |
|---|---|---|
| **Must Have** | Photo → score OCR with verify | The entire reason to exist; the "wow". |
| **Must Have** | Killer flow: event → grouping → results → New Peria → settlement | This is the workflow managers will pay for. |
| **Must Have** | Club + roles + QR invite | Container for everything + growth loop. |
| **Must Have** | Subscription paywall (Toss) | No revenue without it. |
| **Must Have** | Dues Model A + "we don't handle funds" | Manager value while staying out of regulation. |
| **Should Have** | Personal stats, awards, auto notice | Engagement & delight; not the core bet. |
| **Could Have** | Attendance (E5), personal ranking (F2) | Nice, but the flow works without them. |
| **Not Now** | Web admin (H4), sponsorship ledger (G2), Model B in-app payments | Heavy, risky, or regulatory; delay until traction. |

- **Can be manual at first** — OCR can fall back to manual entry; dues confirmation is manual by design; notices are template-based. Automate later once volume justifies it.
- **Risky to build too early** — In-app payment custody (legal), web admin (low user value early), complex auto-grouping constraints.

**MVP launch checklist**
- [ ] OCR accuracy ≥ target on the verify-and-edit flow
- [ ] Toss billing live
- [ ] Privacy policy + consent
- [ ] Empty/loading/error states
- [ ] Push + Kakao share
- [ ] Analytics events firing

- **Success criteria** — A club runs ≥1 full event end-to-end; manager converts after trial; OCR edit-rate low; dues collection rate rises vs. their old method.
- **Test first with real users** — Sit with 3–5 managers on an actual round day. Watch the photo → score → settle → notice flow. Did it save time? Did they trust it? Would they pay?

---

## 12 · How to read this document — *Closing*

A quick guide so any teammate — designer, engineer, or founder — can find what they need.

| You are… | Read first | What you'll get |
|---|---|---|
| New designer | §1, §4, §9 | What it is, how users move, what to design. |
| Engineer | §2, §8, §3 | Architecture, data, device needs. |
| PM / Founder | §6, §10, §11 | Features, risks, what to build first. |
| Analyst | §7 | What to measure and why. |

**One-paragraph summary**
ScoreShot is an AI-powered vertical SaaS that turns a golf society's post-round admin into a few taps, starting from a single photo. Individuals use it free; club owners pay a subscription to unlock manager tools. It deliberately avoids holding money (Model A) to stay simple and low-risk. The whole bet rests on two things: OCR that members trust, and a killer flow — event → results → settlement → notice — that saves the manager real time. Build those two brilliantly first; delay everything else.

> **The single most important sentence:** If the photo-to-score step is fast and accurate, ScoreShot wins its niche. If it isn't, nothing else matters.

---

*ScoreShot — AI golf-club operations platform · Product Analysis v1.0 · 2026-06-15*
