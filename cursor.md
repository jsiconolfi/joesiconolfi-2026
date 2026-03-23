# Cursor Rules — joesiconolfi.com

## Project identity

This is a personal portfolio site for Joe Siconolfi, Staff Design Engineer at Cohere. The site is not a brochure — it IS the proof of concept. Every interaction should demonstrate AI-native design engineering, not describe it. The swirl animation (code-to-design metaphor) is a core brand element and must be preserved across refactors.

## Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode, no `any` unless explicitly justified)
- **Styling**: Tailwind CSS v3 — utility-first, no inline styles except for dynamic values (e.g. animation keyframe percentages)
- **Animation**: Framer Motion (`framer-motion@12`) for page transitions and component-level animation, CSS for the swirl/background
- **Fonts**: Loaded via `next/font/google` — **IBM Plex Mono** only (weights 100–700, normal + italic, CSS var `--font-mono`). All type roles use IBM Plex Mono, differentiated by weight and size. No other fonts.
- **AI integration**: Anthropic SDK (`@anthropic-ai/sdk`) for the prompt bar / conversational layer
- **Deployment**: Vercel

## File structure conventions

```
src/
  app/                  # Next.js App Router pages
  components/
    ui/                 # Primitive, reusable components (Button, Card, etc.)
    sections/           # Page sections (Hero, Work, Lab, Timeline, etc.)
    layout/             # Nav, Footer, wrappers
  lib/                  # Utilities, helpers, constants
  hooks/                # Custom React hooks
  styles/               # Global CSS, Tailwind config extensions
  types/                # Shared TypeScript types and interfaces
  content/              # Static content as typed TS objects (no CMS yet)
```

## Next.js 15+ rules

- **Dynamic route `params` are Promises.** Any page component receiving `params` must type it as `Promise<{ ... }>` and `await` it before use. The page function itself must be `async`. This applies to all `/app/**/[slug]/page.tsx` files. Synchronous access to `params` works in static builds but breaks under Turbopack dev mode.

```tsx
// Correct pattern (Next.js 15+)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // ...
}
```

- `searchParams` follows the same rule — type as `Promise<{ [key: string]: string | string[] | undefined }>` and await.

## TypeScript rules

- Strict mode on. No implicit `any`.
- All component props must have explicit interfaces, defined above the component.
- Use `type` for unions and primitives, `interface` for component props and object shapes.
- Server components are default. Add `'use client'` only when needed (event handlers, hooks, browser APIs).
- All API route handlers must have typed request/response shapes.

## Component rules

- One component per file. Filename matches the exported component name in PascalCase.
- Props interface named `[ComponentName]Props`.
- No default exports from `lib/` or `hooks/` — named exports only. Components use default exports.
- Keep components small and composable. If a component exceeds ~150 lines, look for a split.
- Sections (Hero, Work, Lab, etc.) live in `components/sections/` and are assembled in `app/page.tsx`.

## Tailwind rules

- Use Tailwind utility classes exclusively for styling.
- Custom design tokens (colors, fonts, spacing) must be defined in `tailwind.config.ts` — no magic numbers in className strings.
- Dark mode via the `dark:` variant — the site is dark by default, light mode is opt-in.
- Responsive breakpoints: mobile-first. `sm:` `md:` `lg:` in that order.
- Animation classes that need values beyond what Tailwind provides go in `@layer utilities` in `globals.css`.
- Never use `!important`.

## Design language (enforce this on every UI decision)

### Typography hierarchy
- **Display / hero headlines**: monospace font, large, confident — this is the code-aesthetic
- **Section headlines**: monospace, medium weight
- **Pull-quotes / philosophy statements**: editorial serif, used sparingly
- **Body text**: clean sans-serif, comfortable reading size (16px base)
- **Labels / metadata / nav**: monospace, small, uppercase with tracking

### Color
All values extracted directly from the existing site CSS — do not deviate from these in `tailwind.config.ts`:

```
bg.primary:    #161a22  — body background, canvas base (the real site value)
bg.secondary:  #0e1015  — menu overlays, deeper surfaces
bg.card:       #282e39  — card borders, info card backgrounds
border.subtle: #323337  — form inputs, dividers
border.strong: #515255  — buttons, stronger borders

text.primary:  #ffffff  — primary copy
text.secondary:#eeeeee  — nav, logo, secondary labels  
text.muted:    #aaaaaa  — body copy on dark, contact text
text.hint:     #999999  — section titles, captions
text.faint:    #555555  — scroll-top decorative lines

accent.warm:   #c4ae91  — link hover state (the site's one warm accent — preserve this exactly)
```

No purple gradients on white. No generic AI aesthetics. The warm accent `#c4ae91` is the only accent color on the current site and should remain the primary interactive accent unless explicitly extended.

### Motion principles
- The swirl animation is the hero — slow, considered, purposeful
- Text resolves/assembles on load rather than fading in generically
- Scroll-triggered reveals using Framer Motion `whileInView`
- Every animation must earn its place: does it teach something or guide attention? If not, remove it
- Respect `prefers-reduced-motion` on every animated element

### Interaction grammar (apply consistently across all sections)
Three depth levels, one pattern:
1. **Glance** — visible at rest, no interaction required
2. **Expand** — hover or click reveals the next layer inline, never a full page nav
3. **Immerse** — a secondary CTA inside the expanded state goes deep (full case study, artifact view)

This grammar must be consistent across Work, Philosophy, Lab, and Timeline sections.

## The swirl

The swirl is a canvas/WebGL animation that represents the moment code becomes design. Rules:
- Never remove or hide it on load
- It should respond subtly to user interaction (cursor proximity, prompt bar activity) but never distract
- Keep it in its own isolated component: `components/ui/Swirl.tsx`
- Performance: must not block main thread. Use `requestAnimationFrame` or offscreen canvas if needed.
- On mobile, a simplified CSS version is acceptable
- **DPR is capped at 1.5** (`Math.min(window.devicePixelRatio ?? 1, 1.5)`) — saves 30% canvas fill ops on Retina; difference is invisible at the character sizes used (Session 30)
- **Canvas has `style={{ willChange: 'contents' }}`** — tells the browser it updates every frame, gets its own compositor layer so canvas repaints don't invalidate other layers (Session 30)
- Do NOT remove the DPR cap or `willChange: 'contents'` — they are load-bearing for compositor layering

## Dot grid components (Session 10)

Two RAF-loop dot grid components live in `src/components/ui/`:

### HiDotGrid (`src/components/ui/HiDotGrid.tsx`)
- 5×5 grid spelling "HI" — H in cols 0–2, I in col 4, col 3 is the gap
- `HI_PATTERN` array defines the letterform — do not modify
- Continuous hue-shifting shimmer wave drifts left to right across active dots
- Hue clamped to 20–80deg (warm amber/gold) — never goes full rainbow
- Active dots pulse scale at wave peak (`v > 0.75`)
- Inactive dots: `rgba(196,174,145,0.06)` — near invisible
- Runs continuously from mount — no hover trigger
- Used in the nav "Chat with me" button: `<HiDotGrid dotSize={4} gap={2.5} speed={1.2} />`
- Props: `dotSize`, `gap`, `speed`, `className`

### SwirlDotGrid (`src/components/ui/SwirlDotGrid.tsx`)
- Configurable cols×rows grid with rotating sweep arm mimicking the main swirl
- Pre-computes angle/radius for each dot; sweep trail is `TRAIL = 1.8` radians
- Trail dots colorize with hue offset; off-trail dots fade to `rgba(196,174,145,0.06)`
- Used inside `AssistantAvatar` when `thinking={true}`: `cols={4} rows={4} dotSize={3} gap={2} speed={0.055}`
- Rendered inside the avatar circle — `overflow-hidden` on the circle clips it
- Props: `cols`, `rows`, `dotSize`, `gap`, `speed`, `className`

### Shared rules for both
- No external animation libraries — pure RAF loop (`requestAnimationFrame`)
- Dots built imperatively with `document.createElement('span')` — no React re-renders per frame
- `rafRef` typed as `useRef<number | undefined>(undefined)` — cleanup on unmount
- `prefers-reduced-motion`: static snapshot state, no animation

## AI / chat panel (Session 7 — updated Session 11)

The prompt bar has been replaced by a full `ChatPanel` component — the primary interface of the homepage. Rules:
- `src/components/ui/ChatPanel.tsx` — the main deliverable, centered in the viewport
- Panel dimensions: `w-full max-w-2xl h-[75vh]` — large, not a widget
- Glass treatment uses **inline styles only** (not Tailwind backdrop-blur classes):
  - Outer panel: `backgroundColor: rgba(22,26,34,0.7)`, `backdropFilter: blur(5px)`, `boxShadow: 0 8px 32px rgba(0,0,0,0.3)`, `border: 1px solid rgba(255,255,255,0.06)`
  - Header / input bar: `backgroundColor: rgba(14,16,21,0.8)`, `borderBottom/Top: 1px solid rgba(255,255,255,0.06)`
  - User message bubble: `rgba(255,255,255,0.08)` bg, `rgba(255,255,255,0.1)` border, `borderRadius: 16px 16px 4px 16px`
  - Suggestion chips: `rgba(255,255,255,0.04)` bg, `rgba(255,255,255,0.12)` border, `borderRadius: 20px`
- Terminal chrome header: macOS traffic-light dots (white/15 placeholder) + `portfolio.navigator`
- AI avatar: logo image in a small circle (`/logo-update.svg`)
- Input bar: `>` prompt prefix in `#00ff9f` (terminal green), free-form input, up-arrow send button
- ID generation: use `useRef` counter (not `Date.now()`) — react-hooks/purity rule is strict

### Animated greeting stream on load (Session 11–13, updated Session 33)

Three-phase load sequence on every page visit:
1. **Thinking** (1500ms) — `AssistantAvatar thinking={true}` (SwirlDotGrid animates inside the circle) + `<ThinkingText />` inline to the right, vertically centered. `isLoading: true`. Each character of "thinking..." has a staggered shimmer via `thinking-shimmer` CSS keyframe.
2. **Streaming** — `isLoading` flips false; avatar crossfades to icon (`opacity 0.4s ease`); `GREETING` streams character by character at `STREAM_SPEED = 28` ms/char; a `2px × 13px` `#00ff9f` cursor blinks at `0.8s step-end`.
3. **Complete** — 300ms after last character: `streamingContent` clears, full message lands in `messages`.

State shape:
- `isLoading` — controls initial thinking phase (starts `true`, becomes `false` after 1500ms)
- `streamingContent` — string being built during phase 2
- `isResponseLoading` — separate state for subsequent AI response loading (does NOT interfere with initial load)

Color rules:
- `#00ff9f` (`accent.terminal`) appears ONLY on: blinking cursor, `>` prompt prefix, chip hover states
- Do not use `accent.warm` for interactive terminal states — that color is for nav/link hovers only

### AssistantAvatar (Session 13)

`AssistantAvatar` accepts a `thinking` prop and crossfades between two layers inside the same `w-9 h-9` circle:
- `thinking={true}`: SwirlDotGrid (`4×4`, `dotSize={3}`, `gap={2}`, `speed={0.055}`) fades in; avatar icon fades out
- `thinking={false}`: avatar icon fades in; SwirlDotGrid fades out
- Both layers use `opacity` + `transition: opacity 0.4s ease` — CSS only, no Framer Motion
- Circle is `overflow-hidden` — the grid is clipped by the circle boundary, no explicit sizing needed
- Circle size is fixed at `w-9 h-9` (36×36px) — never resize it
- The avatar icon itself (`/logo-update.svg`, `18×18`) is unchanged

### Suggestion chips — persistent bar only (Session 12)

Chips appear exclusively in the persistent bar directly above the input field. They do NOT appear inline inside message bubbles.
- `Message` interface has no `chips` field — chips are not message-level data
- The persistent bar always shows the same fixed set: `my work`, `my experience`, `about me`, `my resume`, `contact`
- Do not add chips to assistant messages when implementing AI responses — the bar handles navigation, messages handle conversation

CSS:
- `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }` defined in `globals.css` (above `@layer utilities`)
- Cursor animation: `animation: 'blink 0.8s step-end infinite'` — sharp on/off, not a fade
- `@keyframes thinking-shimmer { 0%/100% { color: #555555 } 50% { color: #aaaaaa } }` in `globals.css` — used by `ThinkingText` component; 1.6s ease-in-out infinite, 80ms stagger per character

### ThinkingText component (Session 33)

`ThinkingText` is a module-scoped functional component in `ChatPanel.tsx`:
- Splits `'thinking...'` into individual characters pre-computed in `THINKING_CHARS` (module-level constant)
- Each `<span>` gets `animation: 'thinking-shimmer 1.6s ease-in-out infinite'` + `animationDelay: ${i * 80}ms`
- Only `animationDelay` is inline (it's dynamic per character) — the keyframe itself lives in `globals.css`
- Used in both thinking states: initial page load (`isLoading: true`) and subsequent response loading (`isResponseLoading: true`)
- Do NOT add external animation libraries for this — it is pure CSS keyframe + stagger

## Floating project cards (Sessions 14–23 — current state)

Ten project cards float around the chat panel with gentle sine-wave drift, and dock to staging zones when the AI references a project or a card is clicked.

**Files:**
- `src/content/projects.ts` — `Project` interface + `PROJECTS` array (10 entries)
- `src/components/ui/OrbitalCard.tsx` — floating card with drift animation + staging lerp
- `src/components/ui/OrbitalSystem.tsx` — mounts 10 cards, computes home positions + staging zones; `z-10`

Z-index stack: Swirl `z-0` → OrbitalSystem `z-10` → PageTransitionWrapper `z-10/z-20` → NavWrapper `z-40` → TabBar `z-50` → ChatOverlay `z-50`

**Project interface (Session 20, updated Session 34):** `id`, `name`, `role`, `keywords` (required) + optional `image?: string` (static thumbnail path in `/public/projects/`) + optional `video?: string` (mp4 path — lazy video, plays on hover/active) + optional `url?: string` (case study URL). All 10 projects now have `url` set to `/work/[slug]` as of Session 34. Three projects have `video` set: `waypoint`, `channel`, `seudo`.

**Card visual (Session 20, updated Session 25):** terminal window — traffic lights `#ff5f57`/`#febc2e`/`#28c840`, dark chrome header (`rgba(14,16,21,0.9)`), `[id].exe` title, 120px image area (placeholder grid when no asset), one line of copy (`project.role`), footer label. Idle `opacity: 0.6`, hovered `opacity: 0.85`, active `opacity: 1`. Static `#00ff9f` beacon on active.

**Hover state (Session 25):** `hovered` boolean state. On hover: `opacity: 0.85`, `zIndex: 12`, border brightens to `rgba(255,255,255,0.2)`, card scales `1.02x` (suppressed when `active`). Active state always overrides hover visually.

**Performance — Session 30 rewrites:**
- **Position updates are direct DOM** (`cardRef.current.style.left/top`) — `setDisplayPos` state was eliminated. This removes ~600 React state updates/second (60fps × 10 cards) from the reconciler.
- **Opacity + zIndex are imperative** on both hover and activation — set directly on `cardRef` in mouse handlers and the activation/deactivation callbacks.
- `hoveredRef` mirrors `hovered` state for use in async callbacks (deactivation timer needs hover state without stale closure issues).
- **Video play/pause is imperative** — `playVideo()` and `pauseVideo()` are called directly from hover handlers and activation logic. The `useEffect` watching `hovered/active` for video was removed. `videoPlayingRef` guards against double-play.
- **Collision check staggered** — `frameCountRef.current % 3 === cardIndex % 3` runs collision detection every 3rd frame per card (staggered so different cards check on different frames). Saves 66% of collision compute; imperceptible visually since positions change slowly.
- `willChange: 'transform, left, top'` on the outer wrapper — promotes to compositor layer, position updates bypass paint.
- `activeRef.current` is now set directly in the signal handler (not via `useEffect` watching `active` state). The sync `useEffect` was removed.

**Click handling (Session 25):** `handleClick` uses `useRouter` from `next/navigation`. If `project.url` exists: internal paths → `router.push()`, external URLs (start with `http`) → `window.open(..., '_blank', 'noopener noreferrer')`. If no URL: fires `portfolio:query` CustomEvent (chat fallback — every card is always interactive).

**Card footer (Session 25):** small label below `project.role`. No URL: `case study coming soon` at rest → `ask me about this →` on hover. With URL: `view case study →` in `#00ff9f` on hover, dim at rest. Font: 9px mono, uppercase, `0.08em` tracking.

**Media rendering (Session 23, updated Session 27):** `project.image` → raw `<img>` at rest (static thumbnail). `project.video` → `<video preload="none">` — lazy, plays on hover or chat activation (`hovered || active`), pauses and resets on leave. Image and video are separate fields. `onError` on `<img>` falls back to placeholder grid. `preload="none"` required on all videos. Old autoPlay `isVideo` detection removed. Raw `<img>` (not `next/image`) is intentional — documented with `eslint-disable` comment.

**Position system (Session 22 — replaces elliptical orbital math):**
- `HOME_POSITIONS` array — 10 fixed positions as `{ xPct, yPct }` viewport fractions. Converted to px as `xPct * viewport.w` / `yPct * viewport.h`. Layout: 3 left, 3 right, 2 top, 2 bottom — none overlap the chat panel.
- `DRIFT_CONFIGS` array — per-card `{ xAmp, yAmp, xSpeed, ySpeed, phase }`. Drift: `sin(elapsed * xSpeed + phase) * xAmp` on X, `cos(elapsed * ySpeed + phase * 1.3) * yAmp` on Y. Amplitudes ±14–24px — floating feel, never leaves quadrant.
- No elliptical math, no radius calculations, no convergence problems.

**Viewport clamping (Session 23 — added to OrbitalSystem):**
- `clampHome(xPct, yPct, vw, vh)` — clamps each home position so the card's full 220×160 footprint stays within the viewport. `EDGE_PAD = 12`. Applied to every card on mount and resize.
- Cards near viewport edges (top/bottom strips at 6%/92% yPct, left/right columns at 6–10%/86–90% xPct) are nudged inward so they're always fully visible.

**Velocity + damping physics (Session 32 — replaces all prior stateless position models):**
- `posRef` and `velRef` — `useRef({ x: 0, y: 0 })`. Persist between frames, never trigger renders. `lerpRef` and `frameCountRef` removed.
- **Spring** (`SPRING = 0.018`): `vx += (targetX - x) * SPRING` — card follows drift target gently.
- **Damping** (`DAMPING = 0.82`): velocity × 0.82 every frame — any oscillation decays to zero in ~0.5s.
- **Collision repulsion** adds impulse to velocity (`REPULSE = 0.6`), not position. `MIN_DIST = 240`. Runs every frame (no stagger needed — damping handles smoothing).
- **Edge repulsion** adds impulse to velocity. `EDGE_MARGIN = 130px`, `EDGE_FORCE = 0.4`. Proportional to how far inside the margin the card is.
- **Staging**: lerp at `0.06` directly to slot. Velocity bled at `0.85x` per frame.
- **Hard safety clamp** (`HARD_MARGIN = 20px`) — fires only if card exits viewport entirely. Does not interact with normal physics. Do NOT remove it.
- `SPRING` ≤ 0.025. `DAMPING` between 0.78–0.88. Do NOT reintroduce `px = homeX + driftX` as the base position each frame.

**Activation — two triggers:**
1. Chat keyword match → `portfolio:project-active` CustomEvent → card activates
2. Card click → `portfolio:query` CustomEvent `{ query: 'tell me about [name]' }` → ChatPanel auto-submits
- Side picked by `homeX < window.innerWidth / 2` (home position, not current drift position)
- `lerpRef` `0 → 1` at `0.06`/frame → lerps from drift position to staging slot
- After 4000ms: `active` false, `chosenSlotRef` cleared → `lerpRef` drains back → card returns to drift
- Active: border `rgba(0,255,159,0.3)`, static `#00ff9f` beacon

**Staging zones (Session 22):** `CARD_H = 160`, `STAGE_GAP = 12`. 5 slots per side, `16px` gap from panel edge. `id="chat-panel"` on `ChatPanel` root div.

**OrbitalCard props (Session 23 additions):** `cardIndex: number`, `onPositionUpdate: (index, x, y) => void`, `positionsRef: React.MutableRefObject<Array<{x,y}>>`. Both `CARD_W = 220` and `CARD_H = 160` are defined as module-level constants in `OrbitalCard.tsx`.

**Project shuffle (Session 24):** `shuffleArray<T>()` (Fisher-Yates, module scope) shuffles `PROJECTS` once via `useMemo(() => shuffleArray(PROJECTS), [])` inside `OrbitalSystem`. The render iterates `shuffledProjects` — different order on every page load, stable for the session. `PROJECTS` in `projects.ts` is never mutated. Do not replace `useMemo` with `useState` or `useEffect` — that would cause a flash of unshuffled content.

**Do NOT reintroduce elliptical orbital math.** Home positions are fixed viewport percentages.
**Do NOT change `lerpRef` factor (`0.06`), traffic light colors, or card visual design.**

**Project assets (Session 23):** `/public/projects/` — current files on disk:
- MP4 (video): `waypoint.mp4`, `sherpa.mp4`, `waypoint-sync.mp4`, `channelai.mp4`, `statespace.mp4`, `seudo.mp4`, `kernel.mp4`, `cohere-labs.mp4`
- Static: `mushroom.jpg`, `wafer.png`
- Unused: `north.mp4` (no matching project)
Placeholder grid renders when `image` is undefined or `onError` fires.

Do NOT modify `Swirl.tsx`, `SwirlDotGrid.tsx`, or `HiDotGrid.tsx`.

## Background color (Session 36)

`#161a22` must be set in **two places**:
1. `src/app/globals.css`: `html, body { background-color: #161a22; margin: 0; padding: 0; }` — initial paint before JS
2. `src/app/layout.tsx` body inline style: `backgroundColor: '#161a22'` — hydrated state

Never use `#0e1015` on `<body>` — that's the panel/overlay color. Never use `#000000`. Since Swirl/OrbitalSystem/Nav moved to layout in Session 35, page components no longer control the background; these two locations are the sole source of truth.

## Tab bar system (Session 39)

Persistent browser-like tab bar visible on all `/work/*` routes.

**Files:**
- `src/context/TabContext.tsx` — `TabProvider`, `useTabs()` hook. `Tab` interface: `{ slug, name, exe }`.
- `src/components/layout/TabBar.tsx` — renders tab strip. Exports `TAB_BAR_HEIGHT = 38`.
- `src/components/layout/NavWrapper.tsx` — wraps `Nav`, shifts `top` by `TAB_BAR_HEIGHT` on `/work/*`.

**Tab context rules:**
- `openTab` max 10 tabs (`tabs.length >= 10` guard). If tab already exists, no-op.
- `closeTab` uses `historyRef` (LRU order) to find the most recently active remaining tab. Last tab closed → `router.push('/work')`, state cleared.
- Tab state is in-memory context only — never URL params, never localStorage.

**TabBar layout (Session 43):**
- `hoveredTab: string | null` — tracks which tab body is hovered (bg tint + close button reveal)
- `hoveredClose: string | null` — tracks which close button is hovered (circle bg + color)
- Tab inner order: `[traffic lights — active only] [label flex:1] [× close button]`
- Traffic lights (`#ff5f57`/`#febc2e`/`#28c840`, 9px) on active tab only — decorative, no close action on red dot
- `×` button: 16px circle, always mounted. `opacity: 1` when active or tab is hovered; `opacity: 0` at rest on inactive tabs. `e.stopPropagation()` on click + mouseenter/mouseleave prevents bubbling to tab click. Circle bg `rgba(255,255,255,0.12)` on hover.
- Inactive tab on hover: `rgba(255,255,255,0.03)` bg, label brightens to `rgba(255,255,255,0.55)`
- **Do NOT** put close action on the red traffic light — `×` button handles close for all tabs

**TabBar constants:**
- `TAB_BAR_HEIGHT = 38` — used in TabBar, NavWrapper, PageTransitionWrapper. Do NOT change this value without updating all three.
- Tab `z-index: 50` — same level as ChatOverlay but renders behind it (ChatOverlay is rendered after in DOM order).
- Background: `rgba(10,12,16,0.98)` — slightly darker than panel overlays.

**Nav changes (Session 39, updated Session 44):**
- `Nav.tsx` no longer has `fixed` positioning — `NavWrapper` owns all positioning.
- `NavWrapper` wraps Nav in a `position: fixed` div, shifting `top` by `TAB_BAR_HEIGHT` on all `/work` pages.
- **Session 42:** Transition updated from `'top 0.3s ease'` to `'top 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)'` — matches the ease-out-quart used in page transitions. Nav slides smoothly rather than snapping.
- **Session 44:** `hasChrome = pathname.startsWith('/work') || pathname === '/about'` — `/about` also has a sticky terminal chrome header so the nav must shift down there too.
- **Session 46:** `top` is now driven by `useState(0)` + `useEffect`. The nav always mounts at `top: 0` and animates to `TAB_BAR_HEIGHT` after a 60ms delay. Without this, `pathname`-derived `top` renders synchronously on mount so the CSS transition has no prior value to animate from. `useState(0)` initial value is intentional — do NOT initialize to `hasChrome ? TAB_BAR_HEIGHT : 0`. The `setTimeout` delay must stay in the 50–100ms range.

**Do NOT:**
- Store tab state in localStorage or URL params
- Render TabBar on non-`/work/*` routes
- Change `TAB_BAR_HEIGHT` without updating all three consumers

Z-index stack (Session 39): Swirl `z-0` → OrbitalSystem `z-10` → PageTransitionWrapper `z-10/z-20` → NavWrapper `z-40` → TabBar `z-50` → ChatOverlay `z-50`

## Page layout (Session 7 — updated Session 39)

Homepage is a fixed overlay composition — no scrollable hero section.

**Root layout (`src/app/layout.tsx`) — updated Session 39:**
- `Swirl`, `OrbitalSystem`, `TabBar`, `ChatProvider`, `NavWrapper`, `PageTransitionWrapper`, and `ChatOverlay` all live here — persistent across all navigation
- `TabProvider` wraps everything (outermost)
- `Swirl`: `fixed inset-0 z-0`
- `OrbitalSystem`: `fixed inset-0 z-10 pointer-events-none overflow-hidden`
- `TabBar`: `fixed top-0 z-50` — visible only on `/work/*`
- `NavWrapper`: `fixed z-40` — shifts `top` by `TAB_BAR_HEIGHT` on work pages; inside `ChatProvider`
- `PageTransitionWrapper`: wraps `{children}` — `top: TAB_BAR_HEIGHT` on work pages, `top: 0` on homepage
- `ChatOverlay`: inside `ChatProvider`, `z-50`

**Homepage (`src/app/page.tsx`) — updated Session 35:**
- Only contains ChatPanel wrapper + name block — NO Swirl, OrbitalSystem, or Nav (those moved to layout)
- ChatPanel wrapper: `fixed inset-0 flex items-center justify-center z-20 px-4 py-20 pointer-events-none`
- ChatPanel root div has `id="chat-panel"` and `pointer-events-auto`
- Name block: `fixed bottom-8 left-8 z-10 pointer-events-none`

**PageTransitionWrapper (`src/components/layout/PageTransitionWrapper.tsx`, Session 35):**
- `AnimatePresence mode="wait" initial={false}` — exits before enters; no animation on first load
- `key={pathname}` on `motion.div` — triggers transition on route change
- `data-scroll-container` on motion.div — `useEffect` resets `scrollTop = 0` on pathname change
- Homepage: `zIndex: 10, backgroundColor: 'transparent', pointerEvents: 'none'`
- Case study: `zIndex: 20, backgroundColor: 'rgba(14,16,21,0.97)', pointerEvents: 'auto', overflowY: 'auto'`
- Transition: `duration: 0.45`, `ease: [0.25, 0.46, 0.45, 0.94]` (ease-out-quart)
- Case study direction `'up'`: enter from above (`y: '-100vh'`), exit downward (`y: '100vh'`)
- Homepage direction `'down'`: enter from below (`y: '100vh'`), exit upward (`y: '-100vh'`)

**OrbitalSystem (updated Session 35):**
- Uses `usePathname` — pathname is a dependency on the measure `useEffect`
- Runs immediate `measure()` + delayed `measure()` at 600ms on each pathname change
- Delayed measure ensures `chat-panel` element is found after the 450ms transition animation completes
- Cards stay rendered (behind opaque overlay) on case study pages — no visibility toggle needed

## Nav (Session 7 — updated Session 33)

`src/components/layout/Nav.tsx` — pill nav, frosted glass, centered top, `'use client'`:
- Links left to right: `case studies` (dropdown) / `about` / `timeline` / `the lab` / "Chat with me" button
- Order: `<CaseStudiesDropdown />` → `about` (href="/about") → `timeline` (href="#timeline") → `the lab` (href="#lab") → Chat with me button
- "lab" is gone — only "the lab" exists. `about` links to `/about` (not yet built). `timeline` and `the lab` are in-page anchors for future sections.
- The `work` link was replaced in Session 27 with `<CaseStudiesDropdown />` — a button that opens a `320px` frosted-glass dropdown with 4 featured projects + hover-play video thumbnails
- Glass: inline styles (`backdropFilter: blur(12px)`, `backgroundColor: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.1)`)
- All type: `font-mono text-xs font-light`, hover → `accent.warm`
- "Chat with me" button at the right: warm amber pill containing `<HiDotGrid dotSize={4} gap={2.5} speed={1.2} />`, border brightens on hover — grid animates continuously regardless of hover

**CaseStudiesDropdown (`src/components/ui/CaseStudiesDropdown.tsx`, Session 27, updated Session 40):**
- "See all case studies" footer row: `onClick` now calls `router.push('/work')` (Session 40). Previously only closed the dropdown.
- Opens on **hover**, not click. `onMouseEnter` on the wrapper div sets `open: true`; `onMouseLeave` starts a 120ms `closeTimer` before setting `open: false`. Moving cursor from trigger into the panel clears the timer, keeping it open.
- `closeTimer` typed as `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)`
- Button trigger is a non-interactive label (`cursor: 'default'`, no `onClick`)
- Chevron: SVG path draws a downward-pointing chevron (∨) at rest. Open: `rotate(180deg)` → points up (∧).
- Panel: `320px` wide, `rgba(14,16,21,0.97)` + `blur(12px)`, `borderRadius: 12px`, `zIndex: 50`
- Panel positioning: `top: calc(100% + 20px)`, `left: 0` — left-aligns to trigger left edge, 20px gap below nav
- Rows: `CaseStudyThumbnail` (64×48px) + name + description + arrow (when URL present)
- "Browse / See all case studies" footer row
- No outside-click or Escape handlers — hover-only open/close
- **Row hover debounce (Session 30):** `hoverTimerRef` with 50ms delay on `setHoveredId` — eliminates flicker from fast cursor sweeps across rows. `onMouseLeave` cancels timer and clears immediately (no delay on leave). Applied to all rows including the "Browse" footer row.

**CaseStudyThumbnail (`src/components/ui/CaseStudyThumbnail.tsx`, Session 27, updated Session 30):**
- 64×48px container with `overflow: hidden`
- **Zero `useState`** — all interaction via refs + direct DOM manipulation (Session 30)
- `wrapperRef` + `videoRef` + `playingRef` + `seekingRef` — all imperative
- `mouseenter`/`mouseleave` registered via `useEffect` with `{ passive: true }` — browser doesn't wait for JS before scrolling
- `playingRef` guard prevents double-play on fast hover switching
- Deferred `currentTime = 0` reset via `requestAnimationFrame` — avoids seek collision when cursor sweeps quickly
- Border color updated directly on the DOM element (`wrapper.style.borderColor`) — no React re-render
- `willChange: 'transform'` + `transform: 'translateZ(0)'` on both wrapper and video — separate compositor layers, isolated from swirl canvas compositing

**Featured projects content (`src/content/featured-projects.ts`, Session 27, updated Session 34):**
- `FeaturedProject` interface: `id`, `name`, `description`, `video` (required mp4 path), `url?`
- `image` field removed — all assets are mp4, no separate static thumbnail needed
- 4 entries: Waypoint (`waypoint.mp4`), Wafer (`wafer.mp4`), Channel AI (`channelai.mp4`), Seudo AI (`seudo.mp4`)
- All 4 now have `url` set to `/work/[slug]` — routes are live as of Session 34

## Work index page (Session 40)

`/work` renders a grid of all 10 case studies.

**Files:**
- `src/app/work/page.tsx` — thin route, renders `<WorkGrid />`
- `src/components/case-study/WorkGrid.tsx` — `'use client'` grid component

**WorkGrid rules:**
- **Sticky terminal chrome header (Session 41):** `position: sticky, top: 0, zIndex: 40`, `rgba(10,12,16,0.98)` + `blur(12px)`, `padding: 10px 20px`. Traffic lights 12px circles (`#ff5f57`/`#febc2e`/`#28c840`). Window title: `case-studies.exe`. Red dot: `onClick → router.push('/')` (always goes to homepage, not `router.back()`). Yellow/green: hover shows `−`/`+` glyphs, no action. Hover state via `useState` booleans (`closeHovered`, `yellowHovered`, `greenHovered`).
- Terminal chrome cards (traffic lights `#ff5f57`/`#febc2e`/`#28c840`) — identical to orbital cards
- Thumbnails use `preload="metadata"` (not `preload="none"`) so the first frame paints as a poster without autoplay
- `<video>` elements in WorkGrid: `muted playsInline loop preload="metadata"` — no `autoPlay`
- Raw `<img>` requires `eslint-disable-next-line @next/next/no-img-element` (same exception as OrbitalCard)
- Responsive grid: `repeat(auto-fill, minmax(280px, 1fr))`, `gap: 16`
- No `textTransform: uppercase` on the "case study" label at the bottom of each card
- Content padding: `64px 48px 120px` (top accounts for sticky chrome header, not nav)
- PageTransitionWrapper treats `/work` as a content page: dark bg `rgba(14,16,21,0.97)`, z-20, scrollable, `top: 0` (no tab bar offset — tab bar only renders on `/work/*`)

**PageTransitionWrapper update (Session 40):**
- `isContentPage = isCaseStudy || isWorkIndex` where `isWorkIndex = pathname === '/work'`
- `isCaseStudy = pathname.startsWith('/work/')` — unchanged, still used for `top: TAB_BAR_HEIGHT` offset
- Direction logic updated: `pathname.startsWith('/work')` (without trailing slash) catches both `/work` and `/work/*`
- `/work` index: dark bg, scrollable, z-20, pointer-events auto, `top: 0`

## Case study pages (Session 34)

Dynamic pages at `/work/[slug]` for all 10 projects.

**Files:**
- `src/content/case-studies.ts` — `CaseStudy` interface, `CASE_STUDIES` array (10 entries), `getCaseStudy(slug)`, `getAllSlugs()`
- `src/app/work/[slug]/page.tsx` — async server component, `generateStaticParams` for 10 slugs, `notFound()` for unknowns. **Next.js 15+:** `params` is typed as `Promise<{ slug: string }>` and must be `await`ed before use.
- `src/components/case-study/CaseStudyView.tsx` — `'use client'` view component

**`CaseStudyType`**: `'full'` | `'quick'` — controls whether `hardPart` section renders

**`CaseStudyDecision`**: `{ title: string, body: string, artifact?: string }` — artifact is image or mp4 path

**Full studies (6)**: waypoint, statespace, channel, seudo, wafer, sherpa — include `hardPart`, section label "key decisions"

**Quick takes (4)**: waypoint-sync, kernel, mushroom, cohere-labs — no `hardPart`, section label "what I did"

**CaseStudyView rules:**
- Sticky chrome header: traffic lights match orbital card exactly (`#ff5f57`/`#febc2e`/`#28c840`), `rgba(14,16,21,0.95)` + `blur(12px)`. Red light = `router.back()`. No type badge in the header — traffic lights + filename only.
- Traffic light hover behavior (Session 38): `closeHovered`/`yellowHovered`/`greenHovered` `useState` booleans. On hover, red shows `×`, yellow shows `−`, green shows `+` — each as an inline `<span>` child, `fontSize: 8`, dark text `rgba(0,0,0,0.5–0.6)`.
- Role line: `fontSize: 12`, `color: rgba(0,255,159,0.7)`, `fontWeight: 300` — NO `textTransform: uppercase`, NO `letterSpacing`. Sentence case.
- Content: `maxWidth: 720`, `margin: '0 auto'`
- Hero + decision artifact videos use `autoPlay` — this is intentional for case study pages (exception to the site-wide "no autoPlay" rule for orbital/thumbnail videos)
- All styling: inline styles only — this is a scrollable document page, not the fixed overlay system
- `<video>` elements in case study pages are ambient/decorative — no `eslint-disable` needed (jsx-a11y/media-has-caption rule is not active in this project)
- `eslint-disable-next-line @next/next/no-img-element` on all raw `<img>` elements (same exception as OrbitalCard)

**Do NOT add `preload="none"` to case study page videos** — they autoplay on load (different from orbital card/thumbnail videos where `preload="none"` is required).

**Next case study chain (loops):** waypoint → statespace → channel → seudo → wafer → sherpa → waypoint-sync → kernel → mushroom → cohere-labs → waypoint

## About page (Session 44)

Live at `/about`. Scrollable content page, same visual system as case study pages.

**Files:**
- `src/app/about/page.tsx` — thin route, renders `<AboutView />`
- `src/components/about/AboutView.tsx` — `'use client'` component
- `src/app/api/spotify/callback/route.ts` — OAuth callback, one-time token exchange
- `src/app/api/spotify/now-playing/route.ts` — fetches currently-playing or recently-played

**Layout:** 880px max-width, `padding: '120px 48px 120px'` — 120px top accounts for about.exe chrome (38px) + nav (~56px) + breathing room (updated Session 45). Two-section layout: photo+bio grid on top, facts+Spotify+connect grid below (2-col, 1fr each).

**Terminal chrome:** sticky top, `zIndex: 40`, `rgba(10,12,16,0.98)` + `blur(12px)`. Traffic lights `#ff5f57`/`#febc2e`/`#28c840` (12px circles). Red → `router.push('/')`. Hover glyphs: `×`/`−`/`+`. Title: `about.exe`.

**Photo:** `/joe.png` — raw `<img>` with `eslint-disable-next-line @next/next/no-img-element`, 200×200, `objectFit: cover`, `borderRadius: 8`.

**Bio copy:** 3 paragraphs, verbatim. Never rewrite. 13px, fontWeight 300, lineHeight 1.8, `rgba(255,255,255,0.65)`.

**Spotify widget:**
- Calls `/api/spotify/now-playing` on mount + every 30s (via `setInterval`)
- `pollRef: useRef<ReturnType<typeof setInterval> | undefined>(undefined)` — typed correctly
- Spotify green is `#1ed760` — NOT `#00ff9f`. Never confuse them.
- Green dot `#1ed760` + glow `boxShadow: '0 0 6px rgba(30,215,96,0.6)'` when `isPlaying: true`
- Hover: border `rgba(30,215,96,0.3)`, bg `rgba(30,215,96,0.04)` — imperative via `onMouseEnter/Leave` on the `<a>` tag
- Album art: raw `<img>` with `eslint-disable-next-line @next/next/no-img-element`
- Section label: `now playing` / `last played` (toggled by `isPlaying`)

**Spotify API routes:**
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` in `.env.local`
- OAuth scopes: `user-read-currently-playing user-read-recently-played`
- Callback redirectUri: `http://localhost:3002/api/spotify/callback` (hardcoded for local setup)
- Both routes use `cache: 'no-store'` — always fresh data

**NavWrapper:** `hasChrome = pathname.startsWith('/work') || pathname === '/about'` — `/about` has its own terminal chrome header so nav shifts down by `TAB_BAR_HEIGHT`. `top` is `useState(0)` + `useEffect` with 60ms delay (Session 46) — always animates from 0 so the CSS transition fires correctly.

**PageTransitionWrapper:** `/about` should be treated as a content page — dark bg, z-20, scrollable. Update `isContentPage` logic to include `pathname === '/about'` if needed.

**`<video>` rule exception note:** `AboutView.tsx` has no video elements. The "no autoPlay" rule does not apply here (no video at all).

## Scrollbar utilities

Added to `globals.css` `@layer utilities`:
- `.scrollbar-thin` — 4px width
- `.scrollbar-track-transparent` — transparent track
- `.scrollbar-thumb-white/10` — rgba(255,255,255,0.1) thumb, 2px radius

## Deprecated components (Session 7)

These files are retained as valid TypeScript stubs (return null, no props) to keep tsc clean:
- `src/components/sections/Hero.tsx` — replaced by inline layout in page.tsx
- `src/components/sections/hero/PromptBar.tsx` — replaced by ChatPanel
- `src/components/ui/TerminalPanel.tsx` — replaced by ChatPanel
- `src/components/sections/hero/ScatterName.tsx` — name is now static in bottom-left

## Code quality

- Run `tsc --noEmit` before considering any task complete. Zero type errors.
- ESLint must pass with no warnings.
- No `console.log` left in committed code — use a `logger` utility if needed.
- Images: use `next/image` for standard page content. **Exception:** `OrbitalCard.tsx`, `CaseStudyThumbnail.tsx`, and `AboutView.tsx` use raw `<img>` — fixed-size or externally-hosted media where `next/image` optimization caused silent failures or is not applicable (e.g. Spotify album art URLs). All exceptions are documented with `eslint-disable-next-line @next/next/no-img-element` comments.
- All `<video>` elements in the project must have `preload="none"`, `muted`, `playsInline`, and `loop`. Never use `autoPlay` or `preload="auto"` — video only loads on user interaction.
- Links: use `next/link` for internal navigation. Never raw `<a>` for internal routes.
- Accessibility: all interactive elements must have accessible labels. `aria-label` on icon buttons. Semantic HTML throughout.

## What to avoid

- No heavy 3D libraries (Three.js, react-three-fiber) — wrong signal for this role
- No template-looking layouts — every section should feel custom-designed
- No emoji in production UI
- Never update copy or content strings unless explicitly asked — preserve exact wording even if it conflicts with other style rules
- No lorem ipsum in any commit — use real content stubs from `content/`
- No inline styles except for truly dynamic values
- No `useEffect` for things that can be server-side
- Never bypass TypeScript with `// @ts-ignore` without a comment explaining why
