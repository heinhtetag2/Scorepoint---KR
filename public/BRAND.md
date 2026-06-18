# LABEON — Brand & Logo Assets

The mark fuses the product's core pun: a golf **shot** + a camera **shot**.
A **gold scan/viewfinder frame** (the photo + OCR) wraps a **white golf ball**
(the subject) on the **deep-green** brand tile — the moment LABEON is built
around: *photo → score*.

## Colors

| Token | Hex | Use |
|---|---|---|
| Brand green (deep) | `#0F5132` | Primary tile, ink wordmark, `theme-color` |
| Green | `#198754` | Gradient top, accents |
| Gold | `#C9A227` | Scan brackets, "Shot" in wordmark |
| Page bg | `#F8F9FA` | App background |
| Ink | `#1A1A1A` | Body text |

Type: **Pretendard** (already loaded in the app).

## Files

| File | What | Where to use |
|---|---|---|
| `logo.svg` | Primary app-icon mark (rounded tile) | Favicon, in-app, anywhere |
| `logo-wordmark.svg` | Horizontal lockup (mark + "LABEON") | Headers, decks, README |
| `logo-dark.svg` | Mark on near-black tile | Dark backgrounds / dark mode |
| `logo-mono.svg` | Single-color, uses `currentColor` | Stamps, watermarks, print, tinting |
| `logo-maskable.svg` | Full-bleed, mark in safe zone | PWA maskable source |
| `manifest.webmanifest` | PWA manifest | Linked from `index.html` |

### PNG exports — `public/icons/`

- `icon-512/192/180/152/120/96/64/48/32.png` — app icon (brand green), transparent
- `icon-maskable-512/192.png` — PWA maskable (full-bleed)
- `icon-dark-512.png`, `icon-mono-512.png` — variant references
- `wordmark.png` — 1040×256 transparent lockup

## Usage notes

- **Clear space:** keep at least the width of one scan-bracket around the mark.
- **Min size:** the mark stays legible down to 32px; below that use `logo-mono.svg`.
- **Don't** recolor the tile, stretch, add shadows beyond the built-in ones, or
  put the standard mark on a busy/low-contrast background (use the mono version).

## Re-rendering PNGs

PNGs are generated from the SVGs with headless Chrome (no extra deps):

```bash
chrome --headless=new --default-background-color=00000000 \
  --window-size=512,512 --screenshot=out.png wrap.html   # wrap.html sizes the <img>
```
