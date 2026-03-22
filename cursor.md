# Cursor Rules — joesiconolfi.com

## Project identity

This is a personal portfolio site for Joe Siconolfi, Staff Design Engineer at Cohere. The site is not a brochure — it IS the proof of concept. Every interaction should demonstrate AI-native design engineering, not describe it. The swirl animation (code-to-design metaphor) is a core brand element and must be preserved across refactors.

## Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode, no `any` unless explicitly justified)
- **Styling**: Tailwind CSS v3 — utility-first, no inline styles except for dynamic values (e.g. animation keyframe percentages)
- **Animation**: Framer Motion for component-level animation, CSS for the swirl/background
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

### Animated greeting stream on load (Session 11–13)

Three-phase load sequence on every page visit:
1. **Thinking** (1500ms) — `AssistantAvatar thinking={true}` (SwirlDotGrid animates inside the circle) + `"thinking..."` label inline to the right, vertically centered. `isLoading: true`.
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

## Floating project cards (Sessions 14–23 — current state)

Ten project cards float around the chat panel with gentle sine-wave drift, and dock to staging zones when the AI references a project or a card is clicked.

**Files:**
- `src/content/projects.ts` — `Project` interface + `PROJECTS` array (10 entries)
- `src/components/ui/OrbitalCard.tsx` — floating card with drift animation + staging lerp
- `src/components/ui/OrbitalSystem.tsx` — mounts 10 cards, computes home positions + staging zones; `z-10`

Z-index stack: Swirl `z-0` → OrbitalSystem `z-10` → ChatPanel `z-20` → Nav `z-30`

**Project interface (Session 20, updated Session 25):** `id`, `name`, `role`, `keywords` (required) + optional `image?: string` (path in `/public/projects/`) + optional `url?: string` (case study URL — internal path or external). `url` is `undefined` until a case study is ready — never set a placeholder string.

**Card visual (Session 20, updated Session 25):** terminal window — traffic lights `#ff5f57`/`#febc2e`/`#28c840`, dark chrome header (`rgba(14,16,21,0.9)`), `[id].exe` title, 120px image area (placeholder grid when no asset), one line of copy (`project.role`), footer label. Idle `opacity: 0.6`, hovered `opacity: 0.85`, active `opacity: 1`. Static `#00ff9f` beacon on active.

**Hover state (Session 25):** `hovered` boolean state. On hover: `opacity: 0.85`, `zIndex: 12`, border brightens to `rgba(255,255,255,0.2)`, card scales `1.02x` (suppressed when `active`). Active state always overrides hover visually.

**Click handling (Session 25):** `handleClick` uses `useRouter` from `next/navigation`. If `project.url` exists: internal paths → `router.push()`, external URLs (start with `http`) → `window.open(..., '_blank', 'noopener noreferrer')`. If no URL: fires `portfolio:query` CustomEvent (chat fallback — every card is always interactive).

**Card footer (Session 25):** small label below `project.role`. No URL: `case study coming soon` at rest → `ask me about this →` on hover. With URL: `view case study →` in `#00ff9f` on hover, dim at rest. Font: 9px mono, uppercase, `0.08em` tracking.

**Media rendering (Session 23):** `.mp4` → raw `<video autoPlay muted loop playsInline>`. Static formats (`.jpg`, `.png`, `.webp`, `.gif`) → raw `<img>` (not `next/image` — optimization pipeline caused silent failures for these fixed-size decorative thumbnails). `onError` on both falls back to placeholder grid. Detection: `project.image?.endsWith('.mp4')`.

**Position system (Session 22 — replaces elliptical orbital math):**
- `HOME_POSITIONS` array — 10 fixed positions as `{ xPct, yPct }` viewport fractions. Converted to px as `xPct * viewport.w` / `yPct * viewport.h`. Layout: 3 left, 3 right, 2 top, 2 bottom — none overlap the chat panel.
- `DRIFT_CONFIGS` array — per-card `{ xAmp, yAmp, xSpeed, ySpeed, phase }`. Drift: `sin(elapsed * xSpeed + phase) * xAmp` on X, `cos(elapsed * ySpeed + phase * 1.3) * yAmp` on Y. Amplitudes ±14–24px — floating feel, never leaves quadrant.
- No elliptical math, no radius calculations, no convergence problems.

**Viewport clamping (Session 23 — added to OrbitalSystem):**
- `clampHome(xPct, yPct, vw, vh)` — clamps each home position so the card's full 220×160 footprint stays within the viewport. `EDGE_PAD = 12`. Applied to every card on mount and resize.
- Cards near viewport edges (top/bottom strips at 6%/92% yPct, left/right columns at 6–10%/86–90% xPct) are nudged inward so they're always fully visible.

**Soft collision repulsion (Session 23 — added to OrbitalCard RAF loop):**
- Shared `positionsRef` in `OrbitalSystem` — a `useRef<Array<{x,y}>>` (not state, no re-renders). Each card calls `onPositionUpdate(cardIndex, px, py)` every frame to keep it current.
- `MIN_DIST = 240` — minimum center-to-center distance. Do not reduce below 220 (card width).
- `REPULSE_STRENGTH = 0.4` — force multiplier. Cards ease apart rather than snap.
- Repulsion only when `activeRef.current === false` — staged cards are exempt.
- After repulsion, position is viewport-clamped (`hw = CARD_W/2 + 8`, `hh = CARD_H/2 + 8`).
- `startTimeRef` initialised lazily on the first RAF frame (`if (startTimeRef.current === null) startTimeRef.current = now`) — not during render, to satisfy `react-hooks/purity`.

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

## Page layout (Session 7 — updated Session 14)

Homepage is a fixed overlay composition — no scrollable hero section:
- `src/app/page.tsx` — assembles `Swirl`, `OrbitalSystem`, `Nav`, name block, `ChatPanel` directly
- Swirl: `fixed inset-0 z-0`
- OrbitalSystem: `fixed inset-0 z-10 pointer-events-none overflow-hidden`
- Nav: `fixed top-4 z-30`, pill-shaped frosted glass (inline styles for glass effect)
- Name block: `fixed bottom-8 left-8 z-10 pointer-events-none`
- ChatPanel wrapper: `fixed inset-0 flex items-center justify-center z-20 px-4 py-20 pointer-events-none` — no `id` on this div. Must have `pointer-events-none` so cards behind it remain clickable.
- ChatPanel root div has `id="chat-panel"` and `pointer-events-auto` (re-enables pointer events since the wrapper inherits `pointer-events-none`). This is what `OrbitalSystem` measures via `getBoundingClientRect()`.

## Nav (Session 7 — updated Session 10)

`src/components/layout/Nav.tsx` — pill nav, frosted glass, centered top, `'use client'`:
- Links: work, lab, timeline, contact
- Glass: inline styles (`backdropFilter: blur(12px)`, `backgroundColor: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.1)`)
- All type: `font-mono text-xs font-light`, hover → `accent.warm`
- "Chat with me" button at the right: warm amber pill containing `<HiDotGrid dotSize={4} gap={2.5} speed={1.2} />`, border brightens on hover — grid animates continuously regardless of hover

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
- Images: use `next/image` for standard page content. **Exception:** `OrbitalCard.tsx` uses raw `<img>` and `<video>` for project thumbnails — fixed-size decorative media where `next/image` optimization caused silent failures. This exception is intentional and documented with `eslint-disable` comments.
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
