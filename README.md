# ScoreShot · Korean UI Style Test

Mobile-first React prototype that renders **the same app in 3 Korean design systems** for A/B/C client testing.

- **Style 1 — Kakao** (friendly, rounded, soft shadow)
- **Style 2 — Toss** (minimal, premium, big numbers, flat)
- **Style 3 — Naver** (dense, information-heavy, compact)

3 styles × 3 screens (**Home / Profile / Detail**) = 9 screens. Switching a style re-skins the entire UI instantly.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the build
```

## How the theme system works

- Each theme in `src/theme/themes.js` is a flat map of **CSS custom properties** (color, radius, spacing, type scale, shadow, density).
- `ThemeContext` holds the active key; `PhoneFrame` injects `theme.vars` as inline style on `.phone` and stamps `data-theme`.
- Every component in `src/styles/global.css` reads those variables, so one `setTheme()` call swaps the whole look — no per-component branching for styling.
- A few **structural** differences (Naver chip row + 2-col tiles, Toss big-number hero) are handled by `theme.key` checks in `screens/Home.jsx`.
- **Status/feedback colors** (paid / unpaid / D-day / AI) are shared across all themes, sourced from the Apollo design-token catalog so meaning stays consistent while brand identity changes.

## Structure

```
src/
  components/   PhoneFrame, StyleSwitcher, BottomNav, ui (Card/Button/Badge/…)
  screens/      Home, Profile, Detail
  theme/        themes.js (3 token sets), ThemeContext.jsx
  data/         mock.js (bilingual EN/KR golf-club content)
  styles/       global.css (token-driven component layer)
```

Product context: **ScoreShot** — AI golf scorecard scanning + club/event/settlement (신페리오) for the Korean market. Personas, flows and Mobbin references documented separately.
