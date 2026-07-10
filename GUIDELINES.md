# Layout Recreation Guidelines

Reference: fintech landing page. Recreate **layout only** (shapes, positions, sizes, section order). Do **not** match colors or photography.

---

## Part 1 — Spatial description (no metaphors)

The page is a **vertical stack of 5 sections** inside a centered content column with equal left/right page margins. Between sections there is a large empty gap. Almost every block is a **rectangle with large rounded corners** (roughly 24–40px radius). Buttons are **stadium shapes** (fully rounded short ends).

### Section 1 — Hero (top of page)

**Outer shape:** one horizontal band containing **two rectangles of equal width and equal height**, placed side by side with a small gap between them. Together they form the first viewport’s main content. Approximate height: tall — roughly **70–90% of the viewport height**, not a short strip.

#### Left rectangle (content)

Internal layout, top → bottom:

1. **Top edge row** (full width of this rectangle):
   - Left: brand wordmark (small–medium height).
   - Right: one stadium button (“Get Your Card” + right arrow).
   - Vertical alignment: top; horizontal: space-between.

2. **Middle block** (vertically centered in the remaining space between top row and bottom row):
   - Small label (short width, low height) above the headline.
   - Headline: 3 lines, very large type, uppercase, left-aligned, high line-height compression.
   - One short paragraph under the headline (medium type, ~2–3 lines).
   - One stadium button under the paragraph (“Apply for Free” + right arrow), left-aligned, larger than the top-right button.

3. **Bottom edge row** (full width):
   - Left group: 3 overlapping circles (avatars) + star row + short review text, in one horizontal cluster.
   - Right group: one large numeral (“89M+”) above a short caption (“Card holders worldwide”).
   - Horizontal: space-between; both groups sit on the bottom padding line.

#### Right rectangle (media)

Same outer height/width as the left rectangle.

1. **Top edge row:**
   - Left: horizontal text links in one row (Features, Security, Pricing, FAQ), small type, even spacing.
   - Right: hamburger icon made of **2 short horizontal lines** (not 3).
   - Horizontal: space-between.

2. **Fill:** the rest of the rectangle is one image that covers the full area (object-fit cover), clipped by the large corner radius.

3. **Overlay:** a **smaller rounded rectangle** floating near the **bottom-center** of the media rectangle (not full width). Inside it, left-to-right or stacked:
   - Semi-circle / arc gauge on the left.
   - Large currency figure.
   - Small percentage with up indicator.
   This overlay sits **on top of** the image, inset from the bottom edge by padding.

**Narrow screens:** the two hero rectangles stack — left above right — each becoming full content width; internal rows stay the same.

---

### Section 2 — About

**Top:** small stadium/pill label (“About Us”) at the **left** of the content column (not centered).

**Main block:** two columns under the label.

| | Left column (~40% width) | Right column (~60% width) |
| --- | --- | --- |
| Top | Small circle icon | — |
| Middle | Short paragraph | One large bold paragraph (bigger type than left body; roughly same vertical span as left icon + paragraph + stats) |
| Bottom | Two stats in a **2-column subgrid**: “24/7 AI Monitoring” \| “50+ Currencies Supported” (large type, short labels) | — |

**Below both columns:** one **full-width rounded rectangle** (image). Height: roughly **medium–tall** (shorter than hero cards, wider than tall). Overlays on this image only:
- **Top-right:** circular play control.
- **Bottom-left:** small rounded notification card (“Money Received” + amount + time).

---

### Section 3 — Features (“Everything You Need”)

**Header block (centered, full content width):**
1. Small centered label.
2. Centered uppercase headline, **2 lines**, large type.
3. One centered stadium button under the headline.

**Block A — wide showcase card (full content width):**
- One rounded rectangle.
- **Left ~40–45%:** portrait/product image, full height of the card.
- **Right ~55–60%:** vertical list of **3 accordion rows**.
  - Row 1 collapsed (title only).
  - Row 2 expanded (title + short body text).
  - Row 3 collapsed (title only).
- Card height: medium; image and accordion share the same card height.

**Block B — three equal cards (full content width):**
- Horizontal row of **3 rectangles**, equal width, equal height, equal gaps.
- Each card, top → bottom: title → short paragraph → graphic area at the bottom (receipt / line chart / Face ID UI).
- Card aspect: taller than wide (portrait-ish cards).

---

### Section 4 — Partner (“Your Trusted Financial Partner”)

**Header row (full content width):**
- Left: large uppercase headline (1–2 lines).
- Right: one stadium button, vertically aligned with the headline.
- Layout: space-between on one row.

**Block A — two equal cards:**
- Two rounded rectangles, **50% / 50%**, same height, side by side.
- **Left card:** title + short body at top; map-style graphic filling the lower portion; small floating UI chips on the graphic.
- **Right card:** large numeral at top (“95K+”); short uppercase line under it; person/phone image filling the lower portion.

**Block B — three compact cards:**
- Row of **3 equal-width** short rounded rectangles (lower height than Block A).
- Each: small icon (left or top) + bold title + one sentence.
- Aspect: wide and short (landscape).

---

### Section 5 — Trust / testimonials

**Header (centered):**
1. Small centered label (“Testimonials”).
2. Centered uppercase headline, 1–2 lines.

**Card row:** three rounded rectangles in one row, **same outer height**, **unequal widths**:
- **Left (~22–28%):** large numeral (“70K+”) + short supporting text. Mostly empty space; content top-weighted.
- **Middle (~44–50%):** wide quote card — large quotation mark, paragraph, brand mark near bottom or side.
- **Right (~22–28%):** portrait image filling most of the card; brand wordmark near the **top** of the card.

---

## Part 2 — Spec for an LLM (machine-oriented)

### Global geometry

```
page
└── content-column (max-width constrained, centered, horizontal padding)
    ├── section-1-hero
    ├── gap-lg
    ├── section-2-about
    ├── gap-lg
    ├── section-3-features
    ├── gap-lg
    ├── section-4-partner
    └── gap-lg
        └── section-5-trust
```

| Property | Value |
| --- | --- |
| Card corner radius | 24–40px on major containers |
| Button shape | stadium (border-radius: 9999px) |
| Section vertical gap | ~4–6rem |
| Intra-section card gap | ~1–1.5rem |
| Large card padding | ~2–4rem |
| Headline style | heavy sans, often ALL CAPS, multi-line |
| Label style | small pill or micro-label above H1/H2 |
| CTA | stadium + optional trailing right-arrow icon |

### Section 1 — Hero

```
grid: 2 columns, 1fr 1fr, gap ~1–1.5rem
height: ~70–90vh (tall)
children: [left-card, right-card]  // equal size
```

**left-card**
```
display: flex; flex-direction: column; justify-content: space-between
padding: large
┌ row: [logo] ………… [secondary-cta]
│
│ stack (flex-grow, justify center):
│   label
│   h1 (3 lines)
│   p
│   primary-cta
│
└ row: [avatars+stars+reviews] …… [stat 89M+ / caption]
```

**right-card**
```
position: relative; overflow: hidden
┌ row (z-index above image): [nav links] …… [hamburger 2-lines]
│
│ img: absolute inset 0; object-fit: cover
│
└ overlay-card: absolute; bottom: padding; horizontal-center
    contents: [arc-gauge] [amount] [% change]
```

### Section 2 — About

```
label: left-aligned pill
grid: 2 columns ~0.4fr 0.6fr, gap ~2rem
left:  icon → p → (stat | stat)
right: large bold paragraph (matches left block height)
below: full-width media card
  overlays: play (top-right), toast (bottom-left)
```

### Section 3 — Features

```
header: text-align center
  label → h2 (2 lines) → cta

showcase: 1 card, grid 0.42fr 0.58fr
  left: image full height
  right: accordion × 3 (middle expanded)

grid-3: 1fr 1fr 1fr
  each: title → body → bottom graphic
  card orientation: portrait
```

### Section 4 — Partner

```
header-row: space-between
  h2 (left) | cta (right)

grid-2: 1fr 1fr
  left: title, body, map graphic + floating chips
  right: big stat, short line, photo lower half

grid-3: 1fr 1fr 1fr
  each: icon + title + one sentence
  card orientation: landscape / short
```

### Section 5 — Trust

```
header: text-align center
  label → h2

grid-3: ~0.25fr 0.5fr 0.25fr  (middle wider)
  left:   big stat + text
  middle: quote mark + testimonial + logo
  right:  logo top + portrait fill
  equal height across the three
```

### Component list (exact set)

1. Wordmark  
2. Stadium button (± arrow)  
3. Micro label / pill tag  
4. Display headline  
5. Body paragraph  
6. Avatar stack + stars + review count  
7. Stat (numeral + caption)  
8. Inline text nav + 2-line hamburger  
9. Full-bleed image in rounded card  
10. Floating metric overlay (gauge + amount + %)  
11. Circle icon  
12. Accordion (3 items, 1 open)  
13. Feature card (title + body + bottom graphic)  
14. Map showcase card  
15. Compact icon+title+sentence card  
16. Quote testimonial card  
17. Portrait brand card  
18. Media overlays: toast, play button  

### Must match

- [ ] Hero = **two equal tall rounded cards**, not one full-width banner  
- [ ] Nav is **inside** the right hero card top edge  
- [ ] Logo + secondary CTA are **inside** the left hero card top edge  
- [ ] About = left label + 2-col (icon/text/2 stats | bold copy) + full-width media with 2 overlays  
- [ ] Features = centered header → wide 2-col accordion card → 3 equal portrait cards  
- [ ] Partner = H2|CTA row → 2 equal cards → 3 short cards  
- [ ] Trust = centered header → 3 cards, **middle wider**, equal height  
- [ ] Large radius on containers; stadium CTAs; generous padding  

### Must not invent

- Separate top nav bar above the hero cards  
- Extra sections (footer, pricing table, logo cloud) beyond the 5  
- Sharp small-radius cards as the default  
- Color/photo matching as a success criterion  

---

## One-line structure

`[2 equal tall cards] → [about 2-col + full media] → [centered header + wide accordion + 3 cards] → [H2|CTA + 2 cards + 3 short cards] → [centered header + 3 cards middle-wide]`
