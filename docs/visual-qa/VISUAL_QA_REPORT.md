# Visual QA Report — THEMACHINE (Premium Polish)

**Date:** 2026-07-16  
**App:** `http://127.0.0.1:3001` (PM2 `pardis`)  
**Scope:** Full route pass — desktop / tablet / mobile · light / dark · overlays  
**Screenshots:** [`docs/visual-qa/before/`](./before/) (54 captures)  
**Constraint:** Visual / UX consistency only — no IA, route, or workflow redesign

---

## Coverage

| Area | Captured |
|------|----------|
| Home, Chat (+ response), Patients (+214), Doctors (+rezaei) | ✓ |
| Imaging, Workflows (+detail +studio), Integrations | ✓ |
| Analytics (+metric), stubs (appointments→automation) | ✓ |
| Command palette, More drawer | ✓ |
| Dark desktop sample set | ✓ |
| Tablet + mobile sample set | ✓ |

---

## Findings

### Critical

| ID | Screenshot | Problem | Suggested Fix |
|----|------------|---------|---------------|
| C1 | `01-home-desktop-dark.png`, `03-patients-desktop-dark.png` | Dark mode secondary labels (`text-muted` / category chips) fall below readable contrast on elevated cards; widgets feel washed out. | Raise `.dark` `--text-muted` / `--text-tertiary`; strengthen `--border`; use `text-secondary` for category chips. |
| C2 | `01-home-desktop-light.png`, `19-more-drawer-desktop-light.png` | Home widget sparklines + hairline borders make KPI cards look empty / low-craft (near-invisible chart ink). | Increase sparkline opacity/stroke; slightly stronger card border/shadow; bump category chip contrast. |

### High

| ID | Screenshot | Problem | Suggested Fix |
|----|------------|---------|---------------|
| H1 | All (sidebar footer) | Theme control shows **Moon + «روشن»** in light (and often Sun + «تیره» in dark) — icon implies destination, label implies current → persistent confusion. | Icon matches **current** mode (Sun/روشن, Moon/تیره); keep cycle behavior. |
| H2 | `02-chat-desktop-light.png`, `02b-chat-with-response-desktop-light.png` | Slash row exposes English `/workflow`, `/dashboard`, … against Persian-first policy; mono Latin commands feel like a template leak. | Show Persian labels (`ورک‌فلو`, `داشبورد`, …); keep query payloads. |
| H3 | `04-doctors-desktop-light.png`, mock AI copy | English leak **«redistribute»** in doctor AI insight / doctor card footer. | Replace with Persian («توزیع مجدد»). |
| H4 | `02-chat-*`, `PremiumChatInput` | Hint **«Shift+Enter»** Latin-only in Persian UI. | Persianize to «Shift+Enter خط جدید» → «Shift+Enter برای خط جدید» or «خط جدید با Shift و Enter». |
| H5 | Capture scripts / palette | Command palette backdrop can remain if Escape path races AnimatePresence; blocks clicks (seen in automation). | Ensure AppShell Escape always closes palette; sync `open` state; optional `useEffect` Escape inside palette. |
| H6 | `01-home-desktop-dark.png` | Widget category chips use `uppercase` + muted token — poor for Persian + dark contrast. | Drop `uppercase`; use `text-text-secondary` + `bg-bg-subtle`. |
| H7 | Stub modules e.g. `09-appointments`, `08-analytics` | Empty states feel sparse vs module density elsewhere; description mentions English «Demo». | Tighten EmptyState surface (solid border, better hierarchy); Persianize copy. |

### Medium

| ID | Screenshot | Problem | Suggested Fix |
|----|------------|---------|---------------|
| M1 | Non-chat routes | Featured nav purple dot on «گفتگو با ماشین» reads like an **active** indicator when another route is open. | Soften to ring/badge «AI» or only show on home idle; reduce visual weight. |
| M2 | `02b-chat-with-response-desktop-light.png` | Mid-stream reply leaves large empty canvas; first tokens (`درخواست شما را`) look unfinished. | Ensure stream completes visibly; slightly denser thinking chrome. |
| M3 | `05-imaging-desktop-light.png` | Viewer uses illustrative anatomy art (not clinical grayscale) — demo-acceptable but weak medical craft. | Prefer grayscale imaging asset if available (no layout change). |
| M4 | `07-integrations-desktop-light.png` | Very long card grid; secondary text tiny; filter chips dense. | Slightly larger card meta type; consistent chip height. |
| M5 | `06c-workflow-studio-*` | Studio chrome density OK; English node names (Radiology PACS, DICOM Import) mix with Persian. | Prefer Persian labels where already available in node defs. |
| M6 | Mobile `01-home-mobile-light.png` | Stats row can wrap tightly; muted «زنده» badge low contrast. | Stronger live badge contrast; keep single-column widgets. |
| M7 | `19-more-drawer-*` | Large empty region below module grid. | Reduce min-height / tighten vertical padding (no IA change). |
| M8 | Patient profile footer | Tags like Deep Learning / NLP / PACS if present as English chips. | Persianize or remove decorative English tags. |

### Low

| ID | Screenshot | Problem | Suggested Fix |
|----|------------|---------|---------------|
| L1 | Topbar | `⌘K` Latin shortcut hint (acceptable for power users). | Optional: keep; or add Persian aria only. |
| L2 | Values like `۴۸.۲M` | Latin `M` suffix mixed with Persian digits. | Use «میلیون» / «م» consistently. |
| L3 | Tables / dense lists | Imaging study list OK; hover could be clearer. | Slightly stronger `hover:bg-bg-subtle`. |
| L4 | Motion | Generally soft springs; occasional layout settle on route change. | Already reduced blur — leave unless CLS reappears. |

---

## Priority order for fixes

1. Dark + light contrast tokens (C1, C2, H6)  
2. Theme toggle clarity (H1)  
3. Persianize chat commands + copy leaks (H2–H4, H7)  
4. Palette Escape reliability (H5)  
5. Featured-dot confusion (M1)  
6. Empty state polish (H7)  
7. Remaining Medium/Low polish  

---

## Out of scope (per brief)

- No route / IA / workflow redesign  
- No business-logic changes beyond copy/token/visual classes  
- Stub modules remain stubs — only visual empty-state quality  

---

## Status

- [x] Before screenshots (`docs/visual-qa/before/` — 54 files)
- [x] Critical / High fixes applied (see below)
- [x] After screenshots (`docs/visual-qa/after/`)
- [x] Verify: no Critical or High remain

### Fix log (Critical / High)

| ID | Fix |
|----|-----|
| C1 | Dark tokens: stronger text-secondary/tertiary/muted + borders |
| C2 | Widget borders `border-strong`, sparkline opacity/stroke ↑, category chips readable |
| H1 | Theme icon matches **current** mode (Sun/روشن, Moon/تیره) |
| H2 | Chat quick commands Persianized (`ورک‌فلو`, `داشبورد`, …) |
| H3 | «redistribute» → «توزیع مجدد» |
| H4 | Shift+Enter hint Persianized |
| H5 | Escape closes CommandPalette (AppShell + palette listener); verified backdrop clears |
| H6 | Removed `uppercase` on Persian category chips; secondary color |
| H7 | EmptyState solid surface; stub copy Persianized |

### Residual (Medium / Low — accepted)

- M3 Imaging illustrative asset (not clinical grayscale) — asset choice, not layout
- M5 Studio English integration node names (PACS/DICOM) — domain acronyms
- L1 ⌘K Latin shortcut — intentional
- L2 `۴۸.۲M` Latin M suffix — minor numeral convention

### Follow-up from code-location map (same pass)

Additional Critical/High items closed after the location audit:
- Empty workflow-detection assistant messages now have Persian content
- Hardcoded `#fafbfc` chat surfaces → design tokens (`bg-bg-layer-1`)
- Welcome canvas no longer suppressed after replies
- Stub routes: stronger «بیشتر» active state; layoutId highlight cleared when more-nav is active
- Remaining English specialty/copy leaks (`PACS`, `Workflow`, `۴۸.۲M` → `۴۸٫۲ میلیون`)


