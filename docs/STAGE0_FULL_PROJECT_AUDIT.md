# STAGE 0 — FULL PROJECT AUDIT

**Product:** THEMACHINE (repo: `pardis`)  
**Facility context (from metadata/copy):** مرکز تصویربرداری پردیس نور  
**Audit date:** 2026-07-16  
**Scope:** Read-only inspection of every app route, major component family, config, mock/API layer, tokens, and tooling.  
**Constraint:** No code changes. No redesign. Analysis and documentation only.

---

## 1. Product Summary

### What the product claims to be
From `layout.tsx` metadata, sidebar copy, labels, and mock narratives:

| Signal | Source | Claim |
|--------|--------|--------|
| Brand | `APP_NAME`, Topbar, Sidebar | **THEMACHINE** |
| Positioning | `metadata.description` | «مرکز تصویربرداری پردیس نور — AI Operating System» |
| Title | metadata | «THEMACHINE — AI Command Center» |
| Sidebar tagline | `AppSidebar` | «پردیس نور · AI OS» |
| Featured nav | `navigation.ts` | `/chat` = «گفتگو با ماشین» (AI Workspace), marked `featured` |

### Target users (inferred from UI roles and modules — not invented beyond evidence)
- **Primary persona in mock:** دکتر اخلاق‌پور — «مدیرعامل» (`mock/data/user.ts`)
- **Implied operators:** imaging-center managers, radiologists/doctors, ops staff using patients / imaging / workflows / integrations
- **Unclear without docs:** multi-tenant SaaS vs single-facility tool; billing model; clinical vs admin primary; regulatory/compliance posture

### Business goal (inferred)
Operate a **medical imaging center OS** where:
1. Staff talk to an AI (“THEMACHINE”) instead of hunting dashboards.
2. Repeated conversational requests become **workflows** (automation).
3. Workflows feed a **live dashboard** (مرکز فرمان).
4. External systems (PACS, SMS, WhatsApp, finance, etc.) connect via **Smart Integrations**.

### Product philosophy (stated in UI copy)
- Conversation → pattern detection → AI suggestion → manager approval → workflow → dashboard KPIs (`WorkflowsPage` lifecycle strip).
- Persian-first RTL product (`lang="fa"`, `dir="rtl"`, Vazirmatn, `labels.ts`: «no English in user-facing text» — **policy exists but is violated** in several places).
- AI as the “core experience” (featured chat nav + FloatingAI + AI Dock on modules).

### What is unclear (do not invent)
- No product README beyond create-next-app boilerplate — **no official PRD in repo**.
- Whether Command Center (chat-first home) or Dynamic Dashboard is the intended home: **both exist; only Dashboard is wired to `/`**.
- How real LLM/PACS/HIS integration will work — only mock delay API.
- Auth, multi-user sessions, audit trails — **absent**.

---

## 2. Architecture Summary

### Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js **16.2.10** App Router |
| UI | React **19.2.4**, Tailwind CSS **v4** (`@import "tailwindcss"`), Framer Motion |
| Data | TanStack React Query + mock `apiRequest` delay |
| State | Zustand (theme, workflows persist, nav/AI/notification stores) |
| Forms | `react-hook-form` + `zod` in **package.json but unused in src** |
| Icons | Lucide React (+ emoji in More nav config) |
| Font | Vazirmatn (Google via `next/font`) |
| Charts | Custom SVG (no Recharts/Chart.js) |
| Deploy | `ecosystem.config.cjs` → Next start port **3001** |

### Folder map (actual)
```
src/
  app/                 # thin route files → page components
  components/
    ai-workspace/      # /chat experience + canvases
    command-center/    # largely ORPHANED alternate home
    core/              # design-system primitives
    dashboard/         # live / home dashboard
    modules/           # patients, doctors, imaging, workflows, studio, integrations, analytics
    shell/             # AppShell, Sidebar, Topbar, palette, FloatingAI, Dock(unused)
    motion/            # MotionProvider, PageTransition
    ui/                # re-export PremiumButton → core
  config/              # app, nav, labels, workflow configs, query keys
  features/            # thin React Query hooks (patients, doctors, imaging, modules, shell)
  hooks/               # AI workspace, command center, live dashboard, studio, shortcuts
  lib/                 # ai-engine, motion, persian, analytics, widgets, deprecated re-exports
  mock/data/           # all demo content
  services/api/        # mock API facade
  shared/              # QueryProvider, ThemeProvider, QueryState
  store/               # zustand stores
  types/               # domain types
public/media/          # avatars, doctors, imaging SVGs/JPGs, demo videos
```

### Routing pattern
- Almost all routes are client-rendered page components wrapped in `AppShell`.
- Detail routes (`patients/[id]`, `doctors/[id]`) use server `page.tsx` + mock API + `notFound()`.
- **No `middleware.ts`.** No auth gates.
- `next.config.ts` is empty defaults.

### Data / AI architecture
- **AI is 100% simulated:** `processAIQuery()` in `lib/ai-engine.ts` pattern-matches Persian strings against mock suggestion tables; no network LLM call.
- Conversations/canvases are local React state (`useAIWorkspace`); not persisted except workflows via Zustand persist.
- API layer is a deliberate swap point: `apiRequest(handler)` + 350ms delay (`API_CONFIG.mockDelayMs`).

### Architectural tensions
1. **Two homes:** `CommandCenterPage` (immersive AI-first) vs `DashboardPage`/`DynamicDashboard` (widget dashboard). Only the latter is routed.
2. **Two IA metaphors:** “AI OS / conversation” vs classic module CRUD explorer (`ModuleHero` + cards + AI Dock sidebar).
3. **Dead surface area:** ~1.3k LOC command-center components mostly unused; `Dock.tsx` unused; `OperationsCenter`, `DashboardChatBox` unused.
4. **Stores half-wired:** `useAIContextStore`, `useNotificationStore` defined but essentially unused; theme Moon button has **no `onClick`**.

---

## 3. Screen Inventory

Legend: **Real** = substantive UI beyond EmptyState stub. **Stub** = `ModuleScaffold` “به‌زودی”.

### Primary experiences

#### 1) مرکز فرمان (Home)
| Field | Detail |
|-------|--------|
| **Route** | `/` |
| **Purpose** | Live ops dashboard: hero widgets from workflows, insight strip, summary/workflows tabs |
| **Main components** | `DashboardPage` → `AppShell(dashboard)` → `DynamicDashboard`, `DynamicWidgetCard`, `useLiveDashboard`, workflow store |
| **Weaknesses** | Not AI-first despite product claim; “Live” badge in English; search bar opens command palette but copy says “ask AI by clicking widgets” — mixed mental models |
| **Missing** | Narrative briefing from Command Center; real-time backend; actionable alert deep-links consistency |
| **UX** | Dashboard-feeling home contradicts “AI OS”; FloatingAI hidden on `/` |
| **Visual** | Dense widget grid; ambient glow OK; hierarchy competes with sidebar |
| **AI** | Indirect: widgets can link toward chat/analytics; no conversational control of surface |
| **Nav flow** | Sidebar “مرکز فرمان” → home; chat CTA in header |

#### 2) گفتگو با ماشین (AI Workspace)
| Field | Detail |
|-------|--------|
| **Route** | `/chat` (`?q=` supported) |
| **Purpose** | Featured AI conversation: hero empty state, streaming replies, canvases, workflow suggestions, history |
| **Main components** | `AIWorkspacePage`, `useAIWorkspace`, `PremiumChatInput`, `AICanvas/*`, `ConversationHistoryPanel`, `LivingCore`, `WorkflowSuggestionNotification` |
| **Weaknesses** | Mock AI only; mixed EN labels in `formatLabels` (Timeline/Workflow/Dashboard); canvas buried inside message stream |
| **Missing** | Persistence of chats; real tools/actions; multi-modal upload; shared context with other pages |
| **UX** | Strongest AI feeling in product; history panel + conversation can feel split; ContextPanel exists as code path but density varies |
| **Visual** | ChatGPT-like layout on `#eef0f3`; premium input; LivingCore identity |
| **AI** | Center — pattern match + simulated thinking/streaming + workflow detection demo |
| **Nav flow** | Featured nav, “گفتگوی جدید”, FloatingAI, Topbar sparkles, `/chat?q=` |

#### 3) ورک‌فلو (Workflows list)
| Field | Detail |
|-------|--------|
| **Route** | `/workflows` |
| **Purpose** | List/filter imaging-center workflows; tell THEMACHINE learning lifecycle story |
| **Main components** | `WorkflowsPage`, `WorkflowCard`, `ModuleHero`, categories |
| **Weaknesses** | Hero + lifecycle + cards = long scroll marketing; AI Dock not used here (unlike other modules) |
| **Missing** | Create-from-scratch UX clarity; empty/error states for store hydrate |
| **UX** | Good narrative; category filters OK |
| **Visual** | Coherent with core Card |
| **AI** | Narrative + AI-sourced badges; creation path via chat |
| **Nav flow** | Primary nav → detail `/workflows/[id]` → studio |

#### 4) Workflow Detail
| Field | Detail |
|-------|--------|
| **Route** | `/workflows/[id]` |
| **Purpose** | Deep process view: health, simulation, execution map, charts, AI insight, timeline |
| **Main components** | `WorkflowDetailPage` (~613 LOC), detail/* charts & maps |
| **Weaknesses** | Very large page component; information overload risk |
| **Missing** | Edit-in-place vs studio handoff clarity for all users |
| **AI** | `ProcessAIInsight` present (panel, not controlling UI) |
| **Nav flow** | → `/workflows/[id]/studio` |

#### 5) Workflow Studio
| Field | Detail |
|-------|--------|
| **Route** | `/workflows/[id]/studio` |
| **Purpose** | Node-graph editor: library, canvas, inspector, minimap, AI generate modal, AI assistant |
| **Main components** | `WorkflowStudioPage`, `useWorkflowStudio`, studio/* |
| **Weaknesses** | Custom canvas (not React Flow); AI assistant fake success message; Moon control likely decorative |
| **AI** | Side panel + generate modal — simulated |
| **Nav flow** | Immersive-ish studio; returns to detail/list |

#### 6) اتصالات (Smart Integrations)
| Field | Detail |
|-------|--------|
| **Route** | `/integrations` |
| **Purpose** | Catalog of system connectors with categories, search, enable toggles, smart suggestions |
| **Main components** | `SmartIntegrationsPage`, `IntegrationCard`, `IntegrationsSections`, mock integrations |
| **Weaknesses** | Local state only; logos have many hardcoded hexes |
| **AI** | Suggestion banner; “THEMACHINE AI” as an integration card — meta |
| **Nav flow** | Primary nav |

### Clinical / ops modules (Real)

#### 7) بیماران `/patients`
- **Purpose:** Patient explorer with filter + cards + AI Dock  
- **Components:** `PatientsPage`, `PatientCard`, `ModuleHero`, `SmartFilter`, React Query  
- **AI:** Static `aiSummary` + Dock suggestions (some route to chat); filter is string match not NLU  
- **Weaknesses:** “Natural language filter” copy overpromises; Module template feels dashboardy  

#### 8) پرونده بیمار `/patients/[id]`
- **Purpose:** Rich patient dossier (timeline, media, AI command input)  
- **Components:** `PatientProfilePage`, `CommandInput`, `MediaPreview`  
- **AI:** CommandInput present — still mock engine if wired like CC  
- **Weaknesses:** Large bespoke layout diverges from ModuleShell pattern  

#### 9) پزشکان `/doctors` + `/doctors/[id]`
- Similar ModuleShell list + profile; AI Dock; media for doctors  

#### 10) تصویربرداری `/imaging`
- Study list + dynamic `ImagingViewer` + `AIAnalysisPanel` + devices  
- **AI:** Mock findings/confidence on selected study — strongest clinical AI *display* outside chat  
- Viewer is SVG/photo demo, not DICOM  

#### 11) تحلیل متریک `/analytics/[metricId]`
- **Real detail page** with charts (`AnalyticsDetailPage`)  
- Linked from dashboard widgets  

### Stub modules (`ModuleScaffold` → EmptyState «به‌زودی»)

| Route | Nav | Notes |
|-------|-----|--------|
| `/appointments` | More | Stub + AI Dock |
| `/reports` | More | Stub |
| `/analytics` | More | **List is stub**; detail route is real — IA hole |
| `/financial` | More | Stub |
| `/knowledge` | More | Stub |
| `/users` | More | Stub |
| `/roles` | More | Stub |
| `/notifications` | More | Stub (Topbar bell still links here) |
| `/settings` | More | Stub |
| `/automation` | **Not in navigation.ts** | Orphan stub route |

### Orphan / unused screens (exist in code, not routed)
| Component | Status |
|-----------|--------|
| `CommandCenterPage` | Complete alternate home — **not imported by any `app/` page** |
| `SplashScreen`, `FloatingMetrics`, `AICore`, `AISummary`, `AISuggestions`, `HealthStatus`, `IntegrationsStatus`, `LiveTimeline`, `QuickActions` | Only reachable via CommandCenter or self — effectively dead |
| `OperationsCenter` | Dashboard ops concept — unused |
| `DashboardChatBox` | Unused |
| `Dock` | Replaced by `AppSidebar` — unused |
| `WorkflowEditorPage` | Present in modules/workflows — confirm routing: studio uses `WorkflowStudioPage` instead |

### Navigation structure (as shipped)
```
Primary (sidebar):  /  |  /chat*  |  /workflows  |  /integrations
More drawer:        patients, doctors, imaging, appointments, reports,
                    analytics, financial, knowledge, users, roles,
                    notifications, settings
*featured
```

---

## 4. Component Inventory

### Core design system (`components/core`)
| Component | Role | Consistency |
|-----------|------|-------------|
| `Button` / `PremiumButton` alias | Variants primary/ghost/subtle/ai | Good; PremiumButton deprecated alias |
| `AIButton` | Floating sparkles → `/chat` | Fixed `left-8` (LTR position in RTL app) |
| `Card` | Many semantic variants (patient, ai, finance…) | Variants often look identical (same border/bg) |
| `Input` / `TextArea` | Forms | Used lightly |
| `Status` | Tone badges | Shared |
| `AIInsight` / `AIThinking` | AI chrome | Duplicated thin wrappers in command-center & ai-workspace |
| `SmartList` | List pattern | Limited adoption |
| `Timeline` | Event timeline | Parallel custom timelines elsewhere |
| `EmptyState` | Stub & empty | Used well for stubs |
| `Skeleton` | Loading | Used with QueryState |
| `StoryMetric` | Metric storytelling | Mostly command-center (dead path) |
| `Overlay` (Drawer, FloatingPanel, Toast, Avatar) | Overlays | Partial adoption |
| `MediaPreview` | Images/video | Patients, doctors, canvases |

### Shell
| Component | Used? | Notes |
|-----------|-------|-------|
| `AppShell` | Yes | Dual mode: dashboard vs standard; immersive for CC (unused) |
| `AppSidebar` | Yes | Brand, profile, primary nav, workflows, fake conversations, More, broken theme |
| `Topbar` | Non-dashboard | Search → palette; chat; notifications; profile |
| `CommandPalette` | Yes | Mock items; soft zoom motion |
| `MoreDrawer` / `MobileNav` | Yes | Emoji nav items |
| `FloatingAI` | Yes | Hidden on `/` and `/chat` |
| `Dock` | **No** | Dead |

### AI Workspace
ChatHero, PremiumChatInput, QuickCommands, SuggestedActionPills, StreamingText, ThinkingState, MemoryContextChip, ConversationPanel/History, Context/Today panels, DashboardGenerationCard, WorkflowSuggestion*, canvas set (Welcome/Patient/Revenue/PatientsToday/MriReady/Workflow/Report).

### Command Center (mostly dead)
LivingCore (**alive** — reused in chat), CommandInput (**alive** — patient profile), rest orphaned with CommandCenterPage.

### Dashboard
DynamicDashboard, widgets (Dynamic/Premium), charts (SVG), operations/* (unused OperationsCenter), StatTile, WorkflowInsightsPanel, DashboardChatBox (unused).

### Modules
Patients/Doctors/Imaging/Integrations/Workflows/Workflow-studio/Analytics as above; shared ModuleHero + AIDock + SmartFilter.

### Motion
`lib/motion.ts` springs (comments forbid linear — partially true); CSS keyframes breathe/float/shimmer; `prefers-reduced-motion` respected in globals + Button.

### Consistency verdict
- **Tokens exist** and many surfaces use `bg-bg-*`, `text-text-*`, `primary`.
- **Breakages:** hardcoded `#eef0f3`, `#ffffff`, rgba shadows, IntegrationLogo hexes, emoji vs Lucide mix, English crumbs (“Live”, “Demo”, formatLabels EN).
- **Multiple AI entry points** with different chrome: FloatingAI, Topbar sparkles, AI Dock, ModuleHero summary, CommandInput, Studio AIAssistant — not one coherent “OS agent.”

---

## 5. UX Audit

### Confusing navigation
- Primary = 4 items; clinical work lives under “⋯ بیشتر” — easy to miss for daily imaging ops.
- `/analytics` stub vs `/analytics/[id]` rich — users from dashboard land on detail; More → analytics is empty.
- `/automation` exists but not in nav (duplicate concept with workflows).
- Sidebar “گفتگوها” all link to `/chat` without conversation IDs — fake continuity.
- Theme “ظاهر” button does nothing.

### Hierarchy / density
- Module pages: Hero (title + AI paragraph) + filter + card grid + sticky AI Dock → **dashboard pattern**, high chrome.
- Workflow detail / studio: high information density without progressive disclosure.
- Home DynamicDashboard: widget grid reads as BI, not OS.

### Too many clicks
- Patients → More → Patients → card → profile → ask AI → chat (context may not carry).
- Stub modules: click → empty “به‌زودی” with Dock suggestions that often don’t navigate usefully.

### Dead spaces / imbalance
- Stub EmptyState leaves large empty main column.
- Dashboard search affordance vs palette vs chat CTA — three “ask” metaphors.

### Onboarding
- No first-run tour; SplashScreen unused.
- ChatHero is the closest onboarding.

### Feedback
- React Query loading/error via QueryState — good on real modules.
- AI thinking/streaming — good theater; actions like “ساخت گزارش” largely non-functional beyond local state.
- Notification unread store hardcoded `12` — not wired to UI count reliably (bell → stub page).

### Generic patterns
- ModuleShell template repeated → SaaS admin feel.
- Chat layout familiar (ChatGPT-class) — fine, but canvases underused as “OS surfaces.”

### Missing AI feeling (outside `/chat`)
- Most pages: static Persian “AI summary” banner, not generative control.
- AI Dock suggestions often set filter text or no-op buttons without `href`.

---

## 6. Visual Audit

Judged against premium product bars (Apple/Linear/Stripe/Raycast/Attio/Awwwards) **without copying them**.

| Criterion | Assessment |
|-----------|------------|
| **Hierarchy** | Uneven: chat/studio stronger; stubs weak; home widgets compete equally |
| **Whitespace** | Module pages over-air with 36px titles + AI card; studio denser |
| **Motion** | Thoughtful springs + reduced-motion; risk of over-animation (blur page transitions, breathe) |
| **Composition** | Sidebar 280px + content solid; chat centered max-w-3xl calm |
| **Balance** | RTL generally OK; AIButton `left-8` fights RTL; palette centered LTR-style |
| **Elegance** | Medical blue primary `#2d5a7b` is restrained — good; glass/noise ambient OK |
| **Originality** | LivingCore + workflow-from-chat story = distinctive; ModuleScaffold = generic |
| **Premium** | Tokens and motion aim premium; English “Live”, emoji More nav, empty stubs undercut |
| **Identity** | “THEMACHINE” + پردیس نور present; still reads half OS / half admin panel |

### Weak points
1. Dual visual systems: dashboard `#eef0f3` shell vs `bg-machine` modules.
2. Card variants that don’t differentiate.
3. Emoji in More drawer vs Lucide elsewhere.
4. Dead Command Center was more “hero AI identity” than current home — identity split.
5. Hardcoded whites (`bg-white`) ignore dark tokens even if dark class applied.

---

## 7. AI Audit (most important)

### Verdict
**Closer to a dashboard (and module suite) pretending to have AI — with one strong AI theater surface (`/chat`) — than a true AI Operating System.**

### Evidence it is NOT a real AI OS yet
1. **No LLM / tool-calling backend** — `processAIQuery` is local string matching + mock tables.
2. **Home is a widget dashboard**, not a command surface (`CommandCenterPage` abandoned).
3. **AI does not control most interfaces** — pages don’t reconfigure from model output; canvases are preset React trees keyed by `CanvasType`.
4. **AI Dock / ModuleHero summaries are static copy** from `moduleMetaMock`.
5. **Cross-page memory is fake** — `getMemoryContext` mock; chats not shared with sidebar conversation list.
6. **Actions are theatrical** — report/save/VIP node messages without durable system effects (except workflow accept → Zustand add).
7. **Imaging “AI analysis”** is embedded mock JSON on studies.

### Evidence it ASPIRES to AI OS
- Branding and metadata.
- Featured chat route; FloatingAI; workflow detection from conversation patterns.
- Dynamic dashboard widgets derived from workflow definitions.
- Studio AI assistant / generate modal concepts.
- ProcessAIInsight, AIAnalysisPanel, LivingCore identity object.

### Pages where AI is NOT the center
`/`, `/patients`, `/patients/[id]` (partial), `/doctors*`, `/imaging` (panel only), `/integrations`, `/workflows*` (narrative/tools but UI is process editor), all stubs, `/analytics/[id]` (BI charts).

### Pages where AI SHOULD control UI (per product claim) but does not
| Page | Should | Does |
|------|--------|------|
| `/` | Command surface / narrative OS | Widget dashboard |
| Module explorers | NL → living filtered workspace | String filter + static Dock |
| `/imaging` | AI-driven triage queue | Manual select + static analysis card |
| `/integrations` | Agent proposes/connects | Manual toggles |
| Notifications/Settings | Agent-managed | Stub |
| Analytics list | AI-composed brief | Stub empty |

### AI surfaces inventory
1. Full chat workspace + canvases  
2. Floating AI button  
3. Topbar sparkles  
4. Module AI Dock + hero summary  
5. Command palette (search + AI-ish items)  
6. Imaging AIAnalysisPanel  
7. Workflow ProcessAIInsight  
8. Studio AIAssistant + AIGenerateModal  
9. Patient CommandInput  
10. Dashboard “ask via widget” copy  

---

## 8. Performance Audit

| Area | Finding | Score |
|------|---------|-------|
| Bundle | Framer Motion ubiquitous; large mock data modules; custom studio canvas | 6/10 |
| Images | `next/image` usage not audited as primary; JPGs + large duplicate MP4s in `/public/media/videos` (~2.8MB × 4 identical sizes) | 4/10 |
| Code splitting | ImagingViewer `dynamic(..., ssr:false)` — good | 7/10 |
| Data | Mock delay 350ms everywhere — artificial; no caching strategy beyond RQ defaults | 6/10 |
| Re-renders | Large client pages (WorkflowDetail 613, Editor 638) | 5/10 |
| Fonts | Single Vazirmatn family — fine | 8/10 |
| **Overall performance posture** | | **5.5/10** |

---

## 9. Accessibility Audit

| Area | Finding |
|------|---------|
| Focus | Global `:focus-visible` in CSS — good |
| Landmarks | Sidebar `aria-label`, dialogs `aria-modal` — partial |
| Icons | Many icon-only buttons have `aria-label` in shell |
| Motion | `prefers-reduced-motion` handled |
| Contrast | Tertiary/muted text may fail on subtle backgrounds — needs visual QA |
| Keyboard | Command palette; Escape closes drawers; full palette keyboard nav incomplete (list not roving tabindex) |
| RTL | Structural RTL; some absolute `left-*` positioning |
| Live regions | AI streaming not announced to SR |
| **Score** | **5/10** |

---

## 10. Code Audit

| Dimension | Notes | Score |
|-----------|-------|-------|
| **Architecture** | Clear App Router + features/services/mock split; orphaned CC branch | 6/10 |
| **Scalability** | Mock-centric; no auth/API contracts for multi-tenant | 4/10 |
| **Maintainability** | Dead code + mega-pages hurt | 5/10 |
| **Reusability** | Core + ModuleShell good; many one-offs | 6/10 |
| **Naming** | Generally clear Persian product + English code | 7/10 |
| **Typing** | Strict TS; solid `types/` | 8/10 |
| **Performance** | See §8 | 5/10 |
| **Component size** | Several 400–600+ LOC files | 4/10 |
| **Folder structure** | Sensible; `lib/modules-data` deprecated re-export clutter | 7/10 |
| **Technical debt** | Orphan CC, unused deps (RHF/zod), unused stores, Dock | 4/10 |
| **Mock API** | Clean `apiRequest` seam — intentional | 8/10 |
| **Future backend** | Services layer ready for swap; AI engine not | 6/10 |
| **Overall code** | | **5.5/10** |

Unused dependencies: `@hookform/resolvers`, `react-hook-form`, `zod` (no imports).

---

## 11. Critical Problems

1. **Product identity split:** AI OS branding vs dashboard home; Command Center built then disconnected.
2. **AI is simulated end-to-end** while marketed as THEMACHINE / AI OS — trust risk for demos beyond theater.
3. **~Half of More-nav destinations are stubs** (“به‌زودی”) — broken IA for a “full OS.”
4. **Analytics list stub vs detail real** — navigation trap.
5. **Large dead code surface** (command-center suite, Dock, OperationsCenter) — confusion for future contributors.
6. **Theme toggle non-functional** despite dark tokens + ThemeProvider.
7. **No auth / middleware / multi-user** — not production-ready clinically.
8. **Chat context not shared** across shell “گفتگوها” / FloatingAI / modules.

---

## 12. Medium Problems

1. English leaks vs declared Persian-only policy (`Live`, Demo copy, formatLabels, nav subtitles in config).
2. AIButton fixed to `left-8` in RTL layout.
3. AI Dock suggestions often non-actionable.
4. `useAIContextStore` / `useNotificationStore` unused.
5. Card variants over-specified but under-differentiated.
6. Workflow detail/studio complexity without progressive disclosure.
7. Duplicate video assets / heavy media.
8. README still create-next-app — onboarding debt.
9. `/automation` orphan route.
10. Patient/doctor profiles diverge strongly from ModuleShell.

---

## 13. Minor Problems

1. `PremiumButton` triple path (`core`, `ui` re-export, alias).
2. Multiple `AIThinking` wrappers.
3. Hardcoded `#eef0f3` instead of `--bg-layer-2`.
4. Emoji + Lucide inconsistency.
5. Command palette recent items are static slice.
6. Empty `documents/` media folder.
7. package scripts port 3001 vs README 3000.
8. `labels.ts` policy comment vs `navigation.ts` English subtitles.

---

## 14. Missed Opportunities

1. Wire **CommandCenterPage** (or its ideas) as true home — narrative + command + dynamic surface.
2. Make **canvases the OS desktop** (persistent right pane / full takeover), not chat attachments only.
3. Carry **conversation → module** deep links with filters/state.
4. Unify **one agent chrome** (not Dock + Floating + Studio chat + Hero banners).
5. Persist conversations; connect sidebar list to real IDs.
6. Use RHF/zod for settings/users/roles when built.
7. Real imaging viewer pipeline storyboard (even mock DICOM stages).
8. Dark mode as a deliberate second visual identity (tokens already half-ready).

---

## 15. Quick Wins

1. Remove or hide stub routes from More nav until ready (or mark clearly).
2. Fix theme Moon → `setTheme` cycle.
3. Delete or quarantine dead Command Center imports *after approval* — or reattach to `/`.
4. Replace English “Live” / formatLabels with Persian.
5. Fix AIButton positioning for RTL (`start-8`).
6. Point analytics More item to first metric or dashboard widgets.
7. Wire notification badge to store or remove fake count.
8. Align README port/docs with product reality.

---

## 16. Long-Term Improvements

1. Real AI gateway (tools: search patients, create workflow, query PACS status).
2. Auth, roles, audit log for clinical context.
3. Backend for workflows, integrations runtime, notifications.
4. Design-system consolidation + Storybook.
5. Split mega-pages; reduce orphan code.
6. True AI OS shell: conversation-primary chrome, modules as tools the agent opens.
7. Accessibility pass + SR live regions for AI.
8. Performance: media pipeline, route-level code splitting for studio.

---

## 17. Redesign Priorities (guidance only — not executing)

**P0 — Product truth**  
Decide: AI Operating System vs Imaging Admin Suite. Align home, nav, and AI depth to that decision.

**P1 — AI spine**  
One agent surface that can open canvases/modules/workflows; kill decorative AI that doesn’t act.

**P2 — Finish or cut stubs**  
Ship appointments/reports/notifications or remove from IA.

**P3 — Visual identity lock**  
One background system, one icon language, Persian-only UI, living brand core on home.

**P4 — Code health**  
Remove dead CC/Dock/ops duplicates; shrink pages; formalize API contracts.

---

## 18. Final Score

| Category | Score (/10) |
|----------|-------------|
| Product clarity | 5 |
| Information architecture | 4 |
| AI experience (promise vs delivery) | 3 |
| UX | 5 |
| Visual design | 6 |
| Design system consistency | 6 |
| Accessibility | 5 |
| Performance | 5.5 |
| Code quality | 5.5 |
| Backend readiness | 4 |
| **Weighted overall** | **~5.0 / 10** |

### One-line verdict
**An ambitious Persian RTL imaging-center prototype with a polished mock AI chat and strong workflow story — currently structured and felt primarily as a multi-module dashboard with AI theater, not yet as an AI Operating System.**

---

## Appendix A — Route ↔ Implementation matrix

| Route | Implementation |
|-------|----------------|
| `/` | Real — DynamicDashboard |
| `/chat` | Real — AIWorkspacePage |
| `/workflows` | Real |
| `/workflows/[id]` | Real |
| `/workflows/[id]/studio` | Real |
| `/integrations` | Real |
| `/patients` | Real |
| `/patients/[id]` | Real |
| `/doctors` | Real |
| `/doctors/[id]` | Real |
| `/imaging` | Real |
| `/analytics/[metricId]` | Real |
| `/analytics` | Stub |
| `/appointments` | Stub |
| `/reports` | Stub |
| `/financial` | Stub |
| `/knowledge` | Stub |
| `/users` | Stub |
| `/roles` | Stub |
| `/notifications` | Stub |
| `/settings` | Stub |
| `/automation` | Stub (not in nav) |

## Appendix B — Explicit non-assumptions

- No claim about real hospital deployment status.
- No claim about intended final home (Command Center vs Dashboard) beyond what code wires today.
- No claim about LLM vendor, DICOM conformance, or HIS/PACS contracts — **not present in repo**.
- Scores are auditor judgment from code/UI structure, not user testing.

---

*End of Stage 0 audit. Awaiting approval before any code change.*
