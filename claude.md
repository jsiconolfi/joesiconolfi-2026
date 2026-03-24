# Project Context — joesiconolfi.com

This file gives Claude persistent context about this project. Read it at the start of every session.

## Who this is for

Joe Siconolfi — Staff Design Engineer at Cohere. 15 years of experience across fintech, media, gaming, and AI. First design engineer at Cohere, building the Waypoint design system. Previously: Statespace (AI coaching, 30M+ users), Mushroom (LLM voice interfaces), Channel AI.

Joe's professional philosophy: building AI-native products that help people become more capable over time. Core principles — skill development through use, human-AI collaboration, making AI understandable and controllable.

## What this site is

A portfolio that IS the proof of concept. Not a site that describes an AI-native design engineer — a site that behaves like one. The central metaphor: the swirl animation lives at the exact point where code becomes design. That metaphor runs through every section.

The site is built for three audiences with different intents and time budgets:
- **Recruiter (30 sec)**: needs name, role, one sharp thesis line, credibility signal
- **Hiring manager (5 min)**: needs evidence of judgment, process thinking, proof the thesis is real
- **Collaborator (unlimited)**: needs the open notebook — prompts, systems, experiments, the full thinking

Every section uses the same interaction grammar: glance → expand → immerse. Learned once, applies everywhere. Never force depth on a scanner.

## Three keystones (map everything back to these)

1. **Model shift**: understands the move from static UI to adaptive, model-driven experience
2. **Creative curiosity**: experimentation, bridging creative and technical domains — shown, not claimed
3. **Hands-on fluency**: code-design combinations, prompt engineering, improving model outputs through real work

## Site sections and their purpose

### Hero / Homepage (Sessions 11–20 — current state)

The homepage is a fixed overlay composition — not a scrollable section:
- **Swirl**: `fixed inset-0 z-0`, fills entire viewport, bleeds through the glass panel
- **Nav**: `fixed top-4 z-30`, pill-shaped frosted glass, centered — links: case studies ∨ / about / timeline / the lab / Chat with me
- **ChatPanel**: `fixed inset-0 z-20`, centered, `max-w-2xl h-[75vh]` — THE primary interface
- **Name block**: `fixed bottom-8 left-8 z-10`, static text — name / "Design + Engineering" / thesis

The ChatPanel (`src/components/ui/ChatPanel.tsx`) is a terminal-aesthetic frosted glass chat interface:
- macOS traffic-light header chrome
- Animated greeting stream on load — three phases: thinking → streaming → chips (Session 11)
- AI avatar: `/logo-update.svg` in a small circle
- `>` prompt prefix in `#00ff9f` terminal green
- Placeholder AI responses (800ms timeout) — Anthropic integration next session
- Glass treatment uses inline styles matching the site's existing glass variables
- Thinking state: `SwirlDotGrid` (6×4, speed 0.055) + `<ThinkingText />` component (character-shimmer animation)

Load sequence (Session 11–13, updated Session 33):
1. **Phase 1 — Thinking** (1.5s): `isLoading: true`. `AssistantAvatar thinking={true}` — SwirlDotGrid sweeps inside the avatar circle. `<ThinkingText />` label sits inline to the right, vertically centered on the same row. Each character of "thinking..." has a staggered shimmer animation (`thinking-shimmer` keyframe, 80ms stagger per char, 1.6s duration).
2. **Phase 2 — Streaming**: `isLoading` flips false. Avatar crossfades to icon (`opacity 0.4s ease`). Greeting text builds character by character at 28ms/char; `#00ff9f` cursor blinks at trailing edge.
3. **Phase 3 — Complete**: 300ms after last char, `streamingContent` clears, full message lands in `messages`.

AssistantAvatar (Session 13):
- `thinking` prop (boolean, default `false`) controls a crossfade between two absolutely-positioned layers inside a fixed `w-9 h-9` circle
- `thinking={true}`: SwirlDotGrid (`4×4`, dotSize 3, gap 2, speed 0.055) fades in; icon fades out
- `thinking={false}`: icon (`/logo-update.svg`, 18×18) fades in; grid fades out
- Transition: CSS `opacity 0.4s ease` only — no Framer Motion
- Circle has `overflow-hidden` — grid is naturally clipped, no manual sizing
- Circle size is fixed at `w-9 h-9` (36×36px) — do not change it

Two separate loading states:
- `isLoading` — initial page load thinking phase only
- `isResponseLoading` — subsequent AI response loading; used for send button `disabled` prop and `AssistantAvatar thinking={true}`

Project mention detection (Session 14):
- `detectProjectMention(text)` scans user input against each project's `keywords` array
- On match, dispatches `portfolio:project-active` CustomEvent with `{ projectId }` detail
- Fired immediately after the user sends a message (before the placeholder response timeout)
- Same CustomEvent pattern as `swirl:keypress`
- Card picks its staging side (left or right) based on current orbital x vs viewport centerX at the moment of activation

Suggestion chips — persistent bar only:
- Chips appear ONLY in the persistent bar above the input. Never inside message bubbles.
- The `Message` interface has no `chips` field — do not add one.
- The bar always shows the fixed set: `my work`, `my experience`, `about me`, `my resume`, `contact`.
- When wiring real AI responses, do not pass chips through message data — the bar handles all navigation shortcuts.

### Floating project cards (Sessions 14–23 — current state)

Ten project cards orbit the chat panel in slow elliptical arcs and dock to staging zones when activated by chat.

**Files:**
- `src/content/projects.ts` — typed `Project` interface + `PROJECTS` array (10 entries)
- `src/components/ui/OrbitalCard.tsx` — floating card with sine-wave drift + staging lerp
- `src/components/ui/OrbitalSystem.tsx` — mounts 10 cards, computes home positions + staging zones

**Project interface (Session 20, updated Session 27):**
```ts
interface Project {
  id: string
  name: string
  role: string      // one line — your role or what you built
  image?: string    // path in /public/projects/ — static thumbnail (optional)
  video?: string    // mp4 in /public/projects/ — plays lazily on hover/active. undefined = no video
  keywords: string[]
  url?: string      // case study URL — internal path or external. undefined = not yet built
}
```
`url` is `undefined` for all projects until a case study is ready. Never set a placeholder string — `undefined` is the correct "not ready" state. Internal routes use `router.push()`, external URLs (start with `http`) use `window.open(..., '_blank', 'noopener noreferrer')`.

`video` is separate from `image`. Three projects have `video` set: `waypoint`, `channel`, `seudo`. All others leave `video` unset.

**Z-index stack:**
- Swirl: `z-0`
- OrbitalSystem: `z-10`
- ChatPanel wrapper (centering div): `z-20`, `pointer-events-none` — must stay `pointer-events-none` or it blocks all card interaction
- ChatPanel root div: `pointer-events-auto` — explicitly re-enables interaction (inherited `pointer-events-none` from wrapper)
- Nav: `z-30`

**Card visual design (Session 20, updated Session 25):**
- Terminal chrome header: macOS traffic lights `#ff5f57` / `#febc2e` / `#28c840`, dark bg `rgba(14,16,21,0.9)`, `[id].exe` title
- 120px image/video area: placeholder `20×20px` grid line pattern + project id label when no asset or load error
- One line of copy: `project.role` — `rgba(255,255,255,0.5)` idle → `rgba(255,255,255,0.85)` active
- Footer label: `case study coming soon` at rest → `ask me about this →` on hover (no URL); `view case study →` in `#00ff9f` on hover (with URL). 9px mono, uppercase.
- Glass body: `rgba(22,26,34,0.92)` + `blur(5px)`, `borderRadius: 8px`, `220px` wide
- NO data visualizations, NO `rgba(196,174,145,*)` warm amber
- Active beacon: static `#00ff9f` dot + `boxShadow: 0 0 8px rgba(0,255,159,0.5)` — no pulse
- Idle `opacity: 0.6`, hovered `opacity: 0.85`, active `opacity: 1`
- Hover: border → `rgba(255,255,255,0.2)`, `scale(1.02)` (suppressed when active), `zIndex: 12`
- Active always overrides hover — active state takes full visual control

**Media rendering (Session 23, updated Session 27):**
- `project.image` → raw `<img>` at rest (not `next/image` — optimization pipeline caused silent failures). `onError` → placeholder fallback.
- `project.video` → `<video ref={videoRef} muted playsInline loop preload="none">` — lazy, no autoPlay. Plays on hover or chat activation (`hovered || active`), pauses and resets on leave.
- Both layers overlap in the image area. Image crossfades to opacity 0 when video is playing; video crossfades to opacity 1. Transition: `opacity 0.2s ease`.
- `preload="none"` required — no network request until first hover.
- `eslint-disable-next-line @next/next/no-img-element` comment justifies the raw `<img>` exception
- Old autoPlay detection (`isVideo = project.image?.endsWith('.mp4')`) removed — `image` and `video` are now separate fields.

**Current assets in `/public/projects/`:**
- MP4: `waypoint.mp4`, `sherpa.mp4`, `waypoint-sync.mp4`, `channelai.mp4`, `statespace.mp4`, `seudo.mp4`, `kernel.mp4`, `cohere-labs.mp4`
- Static: `mushroom.jpg`, `wafer.png`
- Unused: `north.mp4` (no matching project entry)

**Position system (Session 22 — replaces all elliptical orbital math):**
- `HOME_POSITIONS` — 10 fixed positions as `{ xPct, yPct }` viewport fractions. Layout: 3 left, 3 right, 2 top strip, 2 bottom strip. All within viewport, none overlap the chat panel.
- `DRIFT_CONFIGS` — per-card `{ xAmp, yAmp, xSpeed, ySpeed, phase }`. Gentle sine drift: `sin(elapsed * xSpeed + phase) * xAmp` / `cos(elapsed * ySpeed + phase * 1.3) * yAmp`. Amplitudes ±14–24px.
- No elliptical math, no radius calculations, no convergence problems.

**Viewport clamping (Session 23):**
- `clampHome(xPct, yPct, vw, vh)` in `OrbitalSystem.tsx` — ensures every home position keeps the full 220×160 card footprint on screen. `EDGE_PAD = 12`. Re-applied on every resize.

**Soft collision repulsion (Session 23, staggered Session 30):**
- `positionsRef` — shared `useRef<Array<{x,y}>>` in `OrbitalSystem`, passed to every card. Updated each RAF frame via `onPositionUpdate` callback. Never triggers re-renders.
- Each card reads `positionsRef` in its RAF loop: if distance to another card < `MIN_DIST = 240`, applies a gentle push proportional to overlap. `REPULSE_STRENGTH = 0.4`.
- Repulsion + viewport clamping only apply when card is idle (`activeRef.current === false`). Staged cards are fully exempt.
- `startTimeRef` uses lazy initialization on first RAF frame (not `performance.now()` at render time) to satisfy `react-hooks/purity`.
- **Collision check staggered every 3rd frame (Session 30):** `frameCountRef.current % 3 === cardIndex % 3` — different cards check on different frames. Cuts collision compute by 66%; imperceptible since positions change slowly.

**Velocity + damping physics (Session 32 — replaces stateless position model):**

The old model recalculated position from scratch every frame (`newPos = driftPos + forces`). Forces had no memory so they oscillated. Session 32 introduces proper velocity physics:

- `posRef` and `velRef` — `useRef({ x: 0, y: 0 })` each. Persist state between frames. Never trigger renders.
- `lerpRef` and `frameCountRef` removed — no longer needed.
- **Spring toward drift target**: `vx += (targetX - x) * SPRING`. `SPRING = 0.018` — gentle follow, not snap.
- **DAMPING = 0.82** — velocity multiplied by 0.82 every frame. Oscillations decay to zero within ~0.5s regardless of opposing forces.
- **Collision repulsion adds to velocity** (not position). `REPULSE = 0.6` impulse, then damped. Previous stagger (every 3rd frame) removed — velocity model handles smoothing naturally.
- **Edge repulsion adds to velocity**. `EDGE_MARGIN = 130px`, `EDGE_FORCE = 0.4`. Force proportional to distance inside margin.
- **Staging lerp**: when `activeRef.current && chosenSlotRef.current`, card lerps at `0.06` to slot directly. Velocity bled at `0.85x` per frame so return-to-orbit is smooth.
- **Hard safety clamp (`HARD_MARGIN = 20px`)** — last resort only. Fires only if card somehow exits the viewport despite all soft forces. Does NOT interact with normal physics.
- Position is initialized on first frame: `if (posRef.current.x === 0 && posRef.current.y === 0) posRef.current = { x: targetX, y: targetY }`

**Physics constants (do not exceed):**
- `SPRING` ≤ 0.025 — higher makes drift feel snappy not floaty
- `DAMPING` between 0.78–0.88 — outside this range causes sluggishness or oscillation
- `HARD_MARGIN` ≤ 20px — it is last resort only, not a regular constraint
- Do NOT remove `posRef`/`velRef` — position must be stored in refs, not recalculated from drift each frame
- Do NOT reintroduce stateless `px = homeX + driftX` as the base position

**Activation flow:**
1. Type → `detectProjectMention` → `portfolio:project-active` dispatched on send
2. Click card → `portfolio:query` dispatched → `ChatPanel` auto-submits via `sendMessageRef.current`
3. Side picked by `homeX < window.innerWidth / 2` (home position determines side, not current drift position)
4. `lerpRef` `0 → 1` at `0.06`/frame → card lerps from drift position toward staging slot
5. After 4000ms: `active` false, `chosenSlotRef` cleared → lerpRef drains → card returns to drift

**Staging zones (Session 22):**
- 5 slots per side, `CARD_H = 160`, `STAGE_GAP = 12`, `16px` gap from panel edge
- `id="chat-panel"` on `ChatPanel` root div — NOT the centering wrapper in `page.tsx`
- **Critical:** centering wrapper in `page.tsx` must have `pointer-events-none`. `ChatPanel` root div must have `pointer-events-auto`. Without this pair, the `fixed inset-0` wrapper at `z-20` silently blocks all pointer events to the cards at `z-10`.

**Do NOT reintroduce elliptical orbital math.** Home positions are fixed viewport percentages.
**Do NOT change `lerpRef` factor (`0.06`), traffic light colors, or card visual design.**
**Do NOT reduce `MIN_DIST` below 220** (card width). Current value: 240.
**`positionsRef` must remain a `useRef`** — never convert to `useState`.

**Project shuffle (Session 24):** `shuffleArray<T>()` (Fisher-Yates, module scope in `OrbitalSystem.tsx`) is called once via `useMemo(() => shuffleArray(PROJECTS), [])`. The render iterates `shuffledProjects`. Each page load gets a different layout; positions are stable within a session. `PROJECTS` in `projects.ts` is never mutated. Must use `useMemo` — `useState` or `useEffect` would cause a visible flash of the unshuffled order.

**Performance — Session 30 rewrites:**
- **OrbitalCard position is direct DOM** — `setDisplayPos` state removed. In the RAF loop, `cardRef.current.style.left/top` is set directly. Eliminates 600 React state updates/second (60fps × 10 cards).
- **OrbitalCard opacity/zIndex are imperative** — set directly on `cardRef` in hover handlers and activation/deactivation callbacks. `hoveredRef` mirrors `hovered` state for use in async callbacks.
- **OrbitalCard video is imperative** — `playVideo()` / `pauseVideo()` called from event handlers, not a `useEffect` watching state. `videoPlayingRef` guards against double-play. Deferred `currentTime = 0` avoids seek collision.
- **Swirl DPR capped at 1.5** (`Math.min(window.devicePixelRatio ?? 1, 1.5)`) — 30% fewer canvas fill ops/frame on Retina; invisible at character sizes.
- **Swirl canvas `willChange: 'contents'`** — compositor layer for canvas, prevents canvas repaints from invalidating other layers.
- **CaseStudyThumbnail has zero `useState`** — fully refs + imperative DOM. `passive: true` on event listeners. `willChange: 'transform'` + `translateZ(0)` on both wrapper and video elements.
- **CaseStudiesDropdown row hover debounced 50ms** — `hoverTimerRef` delays `setHoveredId` by 50ms; `onMouseLeave` clears immediately. Eliminates jitter from fast cursor sweeps.

**Do NOT modify:** `Swirl.tsx` particle logic / color math / RAF timing (DPR cap and `willChange` are the only allowed changes)
**Do NOT modify:** `SwirlDotGrid.tsx`, `HiDotGrid.tsx`
**Do NOT change:** `lerpRef` factor (`0.06`), traffic light colors, card visual design
**Do NOT reintroduce:** elliptical orbital math, `next/image` in OrbitalCard (intentional exception)
**Do NOT remove:** `willChange: 'transform, left, top'` on OrbitalCard wrapper, `willChange: 'contents'` on Swirl canvas, `willChange: 'transform'` + `translateZ(0)` on CaseStudyThumbnail — these are load-bearing for compositor layering.
**`@keyframes pulse`** remains in `globals.css` (not used by cards currently)
**`@keyframes thinking-shimmer`** in `globals.css` — used by `ThinkingText`: `0%/100% { color: #555555 }`, `50% { color: #aaaaaa }`, 1.6s ease-in-out infinite. Each character has an 80ms stagger delay.

### The Nav (`src/components/layout/Nav.tsx`) — updated Session 27

Nav links: `case studies` (dropdown) / `about` / `timeline` / `the lab` / "Chat with me" button. Order left to right: case studies ∨ · about · timeline · the lab · [Chat with me]. `about` links to `/about` (built Session 44). `timeline` → `#timeline`, `the lab` → `#lab` (in-page anchors for future sections). "lab" is gone — only "the lab" exists (updated Session 33).

The `work` link is replaced by `<CaseStudiesDropdown />` — a hover-triggered frosted glass dropdown with 4 featured projects. `z-index: 50` on the panel — above orbital cards at `z-10`.

**CaseStudiesDropdown (`src/components/ui/CaseStudiesDropdown.tsx`, Session 27, updated Session 30):**
- Opens on **hover**, not click. `onMouseEnter` / `onMouseLeave` on the wrapper div. 120ms close delay prevents accidental close when cursor moves from trigger to panel.
- `closeTimer` typed as `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)`
- Button trigger is a non-interactive label (`cursor: 'default'`, no `onClick`). No outside-click or Escape handlers.
- Chevron: path draws downward ∨ at rest. Open: `rotate(180deg)` → ∧.
- Panel: `320px` wide, `rgba(14,16,21,0.97)` + `blur(12px)`, `borderRadius: 12px`, `zIndex: 50`
- Panel: `top: calc(100% + 20px)`, `left: 0` — left-aligns to trigger, 20px gap below nav
- Each row: `CaseStudyThumbnail` (64×48px) + name + description + arrow icon (when URL present)
- "Browse / See all case studies" footer row
- **Row hover debounced 50ms (Session 30):** `hoverTimerRef` delays `setHoveredId` by 50ms on enter; `onMouseLeave` cancels timer and clears immediately. Applied to all rows + Browse footer. Eliminates flicker from fast cursor sweeps.

**CaseStudyThumbnail (`src/components/ui/CaseStudyThumbnail.tsx`, Session 27, updated Session 30):**
- 64×48px rounded container, `overflow: hidden`
- **Zero `useState` (Session 30)** — fully refs + direct DOM manipulation. No React re-renders on hover.
- `wrapperRef` + `videoRef` + `playingRef` + `seekingRef` — all imperative
- `mouseenter`/`mouseleave` registered via `useEffect` with `{ passive: true }` — browser doesn't wait for JS
- `playingRef` guard prevents double-play on fast hover. Deferred `currentTime = 0` via `requestAnimationFrame` avoids seek collision when switching rows quickly.
- Border updated directly: `wrapper.style.borderColor` — no React re-render
- `willChange: 'transform'` + `transform: 'translateZ(0)'` on wrapper and video — separate compositor layers, isolated from swirl canvas compositing
- Single `<video preload="metadata">` — no `<img>` layer. `onLoadedMetadata` seeks to `currentTime = 0` to paint first frame as poster.

**Featured projects data (`src/content/featured-projects.ts`, Session 27, updated Session 34):**
- `FeaturedProject` interface: `id`, `name`, `description`, `video` (required mp4), `url?`
- `image` field removed — all 4 assets are mp4
- Assets: `waypoint.mp4`, `wafer.mp4`, `channelai.mp4`, `seudo.mp4`
- All 4 now have `url` set: `/work/waypoint`, `/work/wafer`, `/work/channel`, `/work/seudo`

**CaseStudiesDropdown browse footer (Session 40):**
- "See all case studies" footer row now calls `router.push('/work')` on click (previously only closed the dropdown)
- `setOpen(false)` fires before the push

**Nav "Chat with me" button (Session 10, unchanged):**
- Warm amber pill button at the right of the nav
- Contains `HiDotGrid` (5×5, dotSize 4, gap 2.5, speed 1.2) spelling "HI" with a left-to-right shimmer
- Grid animates continuously from mount — no hover trigger
- Button border brightens on hover; the grid itself is unaffected by hover

New RAF-loop animation primitives (Session 10):
- `src/components/ui/HiDotGrid.tsx` — 5×5 "HI" letterform grid with warm hue shimmer wave
- `src/components/ui/SwirlDotGrid.tsx` — configurable dot grid with rotating sweep arm
- Both: pure RAF loop, no animation libraries, `prefers-reduced-motion` static fallback

### Philosophy
- Three principles, not an about page. Punchy, typographically confident.
- Glance: three one-liners. Expand: each shows a real example from actual work. Immerse: links to writing and thinking.
- Principles: skill development through use / human-AI collaboration / making AI understandable + controllable.

### Background color (Session 36)

`#161a22` must be set in **two places** — both are required:
1. `globals.css`: `html, body { background-color: #161a22; margin: 0; padding: 0; }` — handles initial paint before JS hydrates
2. `layout.tsx` body inline style: `backgroundColor: '#161a22'` — handles the hydrated state

Do NOT use `#0e1015` on `<body>` — that's the darker panel/overlay color, not the body background. Do NOT use `#000000`.

After moving Swirl/Nav/OrbitalSystem to `layout.tsx` in Session 35, the page components no longer set the background, so both locations are now the single source of truth.

### Page transitions (Session 35)

Smooth Framer Motion transitions between homepage and case study pages. Swirl and orbital cards are persistent — they never unmount.

**Architecture:**
- `Swirl`, `OrbitalSystem`, and `Nav` moved from `page.tsx` to `layout.tsx` — persistent across all navigation
- `PageTransitionWrapper` (`src/components/layout/PageTransitionWrapper.tsx`) wraps `{children}` in the layout
- `ChatProvider` and `ChatOverlay` remain in layout, wrapping Nav + PageTransitionWrapper + ChatOverlay
- `page.tsx` now only contains ChatPanel wrapper + name block — no Swirl, OrbitalSystem, or Nav

**PageTransitionWrapper (rewritten Session 47):**
- `'use client'` — uses `usePathname` from next/navigation
- `AnimatePresence mode="wait" initial={false}` — exits complete before enters begin; no entrance animation on first load
- `key={pathname}` — triggers AnimatePresence on every route change
- `data-scroll-container` attribute on the motion.div — `useEffect` resets `scrollTop` to 0 on pathname change
- Transition: `duration: 0.45`, `ease: [0.25, 0.46, 0.45, 0.94]` (ease-out-quart)
- `isDeepPage(pathname)`: `pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline'` — single helper, replaces all prior `isCaseStudy`/`isWorkIndex`/`isAbout`/`isContentPage` variables
- Deep pages (`/work`, `/work/*`, `/about`, `/timeline`): enter from above (`y: '-100vh'`), exit downward (`y: '100vh'`); dark bg, z-20, `pointerEvents: 'auto'`, `overflowY: 'auto'`, `top: 0`
- Homepage: enters from below (`y: '100vh'`), exits upward (`y: '-100vh'`); transparent bg, z-10, `pointerEvents: 'none'`, `overflowY: 'hidden'`, `top: 0`
- `top: 0` for all pages — `TAB_BAR_HEIGHT` offset removed from wrapper; content-level padding handles tab bar / chrome clearance
- Do NOT reintroduce `top: TAB_BAR_HEIGHT` on the wrapper
- Do NOT split `isDeepPage` back into per-pathname variables (`isCaseStudy`, `isWorkIndex`, `isAbout`, `isTimeline`)

**OrbitalSystem changes (Session 35):**
- Added `usePathname` import — pathname used as dependency in the measure `useEffect`
- Immediate `measure()` on pathname change + delayed `measure()` after 600ms — catches `chat-panel` element that may still be animating in after transition
- On case study pages: `chat-panel` not found → `ready` stays as-is, cards keep floating behind the opaque overlay at z-20
- On return to homepage: delayed measure finds `chat-panel`, recomputes staging slots

**CaseStudyView changes (Session 35):**
- `backgroundColor: '#0e1015'` removed from `<main>` — background now provided by `PageTransitionWrapper`'s `rgba(14,16,21,0.97)` overlay

**Root layout structure (Session 39):**
```
<body>
  <TabProvider>
    <Swirl />             {/* z-0, persistent */}
    <OrbitalSystem />     {/* z-10, persistent */}
    <TabBar />            {/* z-50, fixed top-0, visible on /work/* only */}
    <ChatProvider>
      <NavWrapper />      {/* z-40, fixed — shifts top by TAB_BAR_HEIGHT on /work/* */}
      <PageTransitionWrapper>
        {children}        {/* z-10 (homepage) or z-20 (case study) */}
      </PageTransitionWrapper>
      <ChatOverlay />     {/* z-50 */}
    </ChatProvider>
  </TabProvider>
</body>
```

### Tab bar system (Session 39)

Persistent browser-like tab bar that appears on all `/work/*` routes.

**Files:**
- `src/context/TabContext.tsx` — `TabProvider`, `useTabs()` hook, `Tab` interface
- `src/components/layout/TabBar.tsx` — renders tab strip; exports `TAB_BAR_HEIGHT = 38`
- `src/components/layout/NavWrapper.tsx` — wraps `Nav`, shifts its `top` by `TAB_BAR_HEIGHT` on `/work/*`

**Tab interface:**
```ts
interface Tab {
  slug: string
  name: string  // display name e.g. "Waypoint"
  exe: string   // e.g. "waypoint.exe"
}
```

**Tab context (`TabContext.tsx`):**
- `tabs: Tab[]` — open tabs in order opened
- `activeSlug: string | null` — currently active tab
- `openTab(tab)` — adds tab if not already present; max 10 tabs (`tabs.length >= 10` guard); calls `setActiveSlug`
- `closeTab(slug)` — removes tab; if last tab → `router.push('/work')`, clear state; otherwise find most-recently-active other tab from `historyRef`, navigate there
- `setActiveSlug(slug)` — sets active + prepends to `historyRef` (deduped, capped at 20)
- `historyRef: useRef<string[]>` — tracks history of active slugs for fallback on close. Never triggers re-renders.

**TabBar (`TabBar.tsx`):**
- Only renders on `/work/*` routes
- `TAB_BAR_HEIGHT = 38` — exported constant, used by NavWrapper and PageTransitionWrapper
- `useEffect` on `pathname` — registers current case study as a tab via `openTab` + `setActiveSlug`
- **Tab layout (Session 43):** `[traffic lights — active only] [label flex:1] [× close button]`. Traffic lights are decorative on active tab (no close action on red). `×` button is always mounted on right: `opacity:1` when active or hovered, `opacity:0` at rest on inactive. `e.stopPropagation()` on close button events.
- `hoveredTab` and `hoveredClose` state control bg tint, label brightness, and close button visibility
- `flex: 1, maxWidth: 200px` per tab — tabs compress automatically as more open; label truncates with ellipsis
- `z-index: 50` — above orbital cards and nav
- Background: `rgba(10,12,16,0.98)` + `blur(12px)`, border-bottom `rgba(255,255,255,0.06)`
- Active tab: `rgba(255,255,255,0.05)` bg, `borderBottom: '1px solid #161a22'` (merges with content)
- Inactive tab: no bg, `rgba(255,255,255,0.35)` label color

**NavWrapper (`NavWrapper.tsx`, Session 39, updated Session 46):**
- `'use client'` — reads `usePathname`
- `hasChrome = pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline'` — covers `/work` index, `/work/[slug]`, `/about` (Session 44), and `/timeline` (Session 49)
- `top` is `useState(0)` + `useEffect` with 60ms `setTimeout` (Session 46). Nav always mounts at `top: 0` and animates to `TAB_BAR_HEIGHT` after the delay. Without this, the `pathname`-derived value renders synchronously so the CSS transition has no prior state to animate from. `useState(0)` initial value is intentional — do NOT initialize to `hasChrome ? TAB_BAR_HEIGHT : 0`. The delay must stay 50–100ms.
- `transition: 'top 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)'` — ease-out-quart, matches page transition easing.
- `pointerEvents: 'none'` on outer div, `pointerEvents: 'auto'` on inner Nav wrapper — preserves nav interactivity
- `Nav` no longer sets its own fixed position — NavWrapper owns all positioning

**Nav changes (Session 39):**
- Removed `fixed top-4 left-1/2 -translate-x-1/2 z-30` from Nav className
- Nav is now a plain flex element — NavWrapper handles all positioning

**Tab behavior:**
- Opening a case study → tab registers, appears in bar
- Refreshing → `useEffect` on pathname re-registers the tab correctly
- Switching tabs → click navigates + activates tab
- Closing active tab → switches to most recently viewed other tab
- Closing last tab → navigates to `/work`, tab bar disappears
- Max 10 tabs — `openTab` silently ignores if already at capacity
- Tab state lives in context only — never in URL params or localStorage

**Do NOT:**
- Store tab state in localStorage or URL params
- Change `TAB_BAR_HEIGHT` from 38 without updating all three consumers (TabBar, NavWrapper, PageTransitionWrapper)
- Render TabBar on non-`/work/*` routes
- Add tabs for the `/work` index page (only `/work/[slug]` routes create tabs)

### Work (case studies) — updated Session 40

Case study pages are now live at `/work/[slug]` for all 10 projects.

**Files (Session 34, updated Session 40):**
- `src/content/case-studies.ts` — `CaseStudy` interface + `CASE_STUDIES` array (10 entries) + `getCaseStudy(slug)` + `getAllSlugs()` helpers
- `src/app/work/page.tsx` — `/work` index page, renders `<WorkGrid />` (Session 40)
- `src/components/case-study/WorkGrid.tsx` — `'use client'` grid of all 10 case studies. Sticky terminal chrome header (`case-studies.exe`, traffic lights — red goes to `/`). Terminal chrome cards, 16/9 thumbnails (`preload="metadata"` for first-frame paint), responsive `auto-fill minmax(280px,1fr)` grid. No `autoPlay` (Session 40, updated Session 41)
- `src/app/work/[slug]/page.tsx` — async dynamic route, `generateStaticParams` for all 10 slugs, calls `notFound()` for unknown slugs. **Next.js 15+:** `params` typed as `Promise<{ slug: string }>`, awaited before use. Page function is `async`.
- `src/components/case-study/CaseStudyView.tsx` — `'use client'` component rendering the full case study page

**CaseStudy interface:**
```ts
interface CaseStudy {
  id: string          // matches project id in projects.ts
  slug: string        // URL slug — /work/[slug]
  type: CaseStudyType // 'full' | 'quick'
  name: string
  tagline: string
  year: string
  role: string
  hook: string        // 2–3 sentences — the real problem and why it mattered
  hardPart?: string   // full case studies only
  decisions: CaseStudyDecision[]  // { title, body, artifact? }
  outcome: string
  heroAsset?: string  // image or video path
  nextSlug?: string   // slug of the next case study for nav
}
```

**Two types:**
- `'full'` (6 entries): waypoint, statespace, channel, seudo, wafer, sherpa — includes `hardPart` section
- `'quick'` (4 entries): waypoint-sync, kernel, mushroom, cohere-labs — no `hardPart` section

**CaseStudyView layout (updated Session 39):**
- Sticky terminal chrome header **removed** — replaced by the persistent tab bar (`TabBar`) at the top of the viewport.
- 720px max-width content column, `0 auto` centered
- Content padding: `120px 24px 120px` — 120px top accounts for tab bar (38px) + nav (~56px) + breathing room
- Hero asset (if present): `16/9` aspect ratio, `borderRadius: 8`, autoplay muted loop for video
- Header block: year (muted, uppercase) → name (h1, 32px) → tagline → role (terminal green `rgba(0,255,159,0.7)`, 12px, fontWeight 300, sentence case — no uppercase, no letterSpacing)
- Sections in order: `the problem` (hook) → `the hard part` (full only) → `key decisions` or `what I did` → `outcome`
- Decision artifacts render inline below each decision body — video autoplay muted loop, img static
- Next case study: `[nextSlug].exe →` button at bottom, hover brightens border + text
- Body copy: 13px, `fontWeight: 300`, `lineHeight: 1.8`, `rgba(255,255,255,0.65)`
- All styling: inline styles only (no Tailwind — this is a scrollable page, not the fixed overlay system)

**Video rule exception for case study pages:**
- Hero videos and decision artifact videos autoplay muted loop — this is intentional and correct for case study pages
- This differs from orbital cards (hover/active only) and thumbnails (hover only)
- Case study page videos have `autoPlay` — this is the one place this is allowed

**URL wiring (Session 34):**
- All 10 projects in `projects.ts` now have `url: '/work/[slug]'`
- All 4 featured projects in `featured-projects.ts` now have `url: '/work/[slug]'`
- OrbitalCard click → `router.push()` for internal paths (already implemented in Session 25)
- CaseStudiesDropdown rows → `router.push()` for internal paths (already implemented in Session 27)

**Next case study chain:**
waypoint → statespace → channel → seudo → wafer → sherpa → waypoint-sync → kernel → mushroom → cohere-labs → waypoint (loops)

Card grid. Glance: title + one-line thesis only. Expand: problem, decision, outcome — inline, never navigates away. Immerse: full case study with artifacts, code, process.
- Key projects: Waypoint design system, Sherpa Figma plugin (RAG-based, Pinecone + Cohere models), waypoint-sync (Figma-to-code token sync), Channel AI, Statespace/Aimlab.
- Frame each as a bet made at the right time, not a list of deliverables.

### About page — Session 44

Live at `/about`. Scrollable content page with terminal chrome header.

**Files:**
- `src/app/about/page.tsx` — thin route, renders `<AboutView />`
- `src/components/about/AboutView.tsx` — `'use client'` component

**Layout:**
- Terminal chrome header: `position: sticky, top: 0, zIndex: 40`, `rgba(10,12,16,0.98)` + `blur(12px)`. Traffic lights `#ff5f57`/`#febc2e`/`#28c840`. Red → `router.push('/')`. Window title: `about.exe`. Yellow/green hover shows `−`/`+` glyphs, no action.
- Max-width 880px content column, `padding: '120px 48px 120px'` — 120px top accounts for about.exe chrome (38px) + nav (~56px) + breathing room (updated Session 45)
- Two-column grid (200px photo col + 1fr bio col), `gap: 48`, `marginBottom: 72`
- Photo: `/joe.png` (200×200, `borderRadius: 8`, `objectFit: cover`). Raw `<img>` with `eslint-disable-next-line @next/next/no-img-element`.
- Name/role below photo: name 14px 400 weight, role `rgba(0,255,159,0.7)` 11px 300, location `rgba(255,255,255,0.35)` 11px 300
- Bio: 3 paragraphs, 13px fontWeight 300 lineHeight 1.8 `rgba(255,255,255,0.65)`. Copy is **verbatim** — never rewrite.
- Horizontal divider `rgba(255,255,255,0.06)` separates bio from bottom section
- Bottom two-column grid (1fr 1fr): facts left, Spotify + connect right

**BIO copy (verbatim — do not modify):**
```
Para 1: "I'm a design engineer based in San Francisco, originally from New York (pizza in my veins, West Coast since 22)..."
Para 2: "My focus is AI-native product, not AI as a feature bolted onto something..."
Para 3: "When I'm not building I'm digging through record bins, watching the Knicks and Mets find new ways to break my heart..."
```

**Facts (verbatim — do not modify):** hometown / based / years in tech / first code / record collection / sports / education / currently building

**Spotify widget:**
- Polls `/api/spotify/now-playing` on mount + every 30s. `pollRef` typed `useRef<ReturnType<typeof setInterval> | undefined>(undefined)`
- Loading state: simple bordered box with "loading..." text
- Track present: linked `<a>` card with album art (48×48), title, artist, Spotify SVG icon `#1ed760`. Green dot indicator when `isPlaying: true`. Hover: border `rgba(30,215,96,0.3)`, bg `rgba(30,215,96,0.04)`.
- No track: "not playing anything right now" text
- Section label toggles: `now playing` (isPlaying) / `last played` (not playing)
- Spotify green is `#1ed760` — NOT `#00ff9f`. Do not confuse them.
- Album art uses raw `<img>` with `eslint-disable-next-line @next/next/no-img-element`

**Connect links:** linkedin / github / email. Hover: `rgba(255,255,255,0.85)`. Terminal green `→` prefix. No `next/link` needed — all external or `mailto:`.

**NavWrapper:** `hasChrome = pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline'` — nav shifts down by `TAB_BAR_HEIGHT` on `/about` and `/timeline` (same as work pages). `top` is `useState(0)` + `useEffect` with 60ms delay (Session 46) so the CSS transition always has a prior value to animate from.

**Spotify API routes:**
- `src/app/api/spotify/callback/route.ts` — OAuth callback. Exchanges `code` for tokens. Returns `refresh_token` in JSON for one-time setup. `redirectUri` hardcoded to `http://localhost:3002/api/spotify/callback`.
- `src/app/api/spotify/now-playing/route.ts` — uses `SPOTIFY_REFRESH_TOKEN` env var to get a fresh access token, then fetches currently-playing. Falls back to recently-played (limit 1) if nothing is playing. Returns `{ isPlaying, title, artist, album, albumArt, url }`. Both routes use `cache: 'no-store'`.
- Required env vars: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`
- OAuth scopes needed: `user-read-currently-playing user-read-recently-played`

**PageTransitionWrapper:** `/about` is a deep page — handled by `isDeepPage` helper (Session 47). Dark bg, z-20, scrollable, enters from above (`y: '-100vh'`). No separate `isAbout` variable needed.

### The Seam
- The section that demonstrates keystone 3 directly.
- Split panel: Figma component left, TypeScript/React code right. The swirl or animated connector lives in the gutter between them — literally the space where design becomes code.
- Show waypoint-sync, design-map.json, the actual pipeline.
- Glance: striking visual that communicates hybrid fluency. Expand: toggle between the two sides. Immerse: annotated, decisions explained.

### Lab
- Open notebook. The differentiator section.
- Glance: "currently experimenting with —" with a live signal. Expand: experiment cards (before/after prompts, what changed, why). Immerse: actual system prompt structure from Sherpa, Pinecone RAG architecture, real evals with results.
- This is where senior hiring managers spend the most time. Keep it honest and specific.

### Timeline — Session 49

Live at `/timeline`. Vertical scroll timeline with continuous thread line and viewport-driven era highlighting.

**Files:**
- `src/content/timeline.ts` — `TimelineArtifact` + `TimelineEra` interfaces + `TIMELINE` array (10 eras)
- `src/app/timeline/page.tsx` — thin route, renders `<TimelineView />`
- `src/components/timeline/TimelineView.tsx` — `'use client'` component with single scroll listener, CSS grid layout

**TimelineEra interface:**
```ts
interface TimelineEra {
  id: string
  years: string
  company: string
  role: string
  location: string
  type: 'full' | 'compact'  // compact = early career smaller treatment
  summary: string
  artifacts: TimelineArtifact[]
  tech?: string[]
  slug?: string  // links to case study if exists
}
```

**10 eras in order:** maxq, progressive, spongecell, viacom, logic (compact), statespace-1, statespace-2 (full), mushroom, channel, cohere (full)

**Layout (Session 51 + Session 52):**
- Terminal chrome: `position: sticky, top: 0, zIndex: 40`, `rgba(10,12,16,0.98)` + `blur(12px)`. Traffic lights. Red → `router.push('/')`. Window title: `timeline.exe`. Thread legend on the right.
- Max-width 760px content column, `padding: '120px 48px 160px'`
- Each `EraBlock`: `display: grid, gridTemplateColumns: '24px 1fr', gap: '0 24px'`
  - Column 1 (24px): dot only (`position: relative, zIndex: 1`) — sits above the static rail
  - Column 2 (1fr): all text content
- **Single static rail (Session 52):** `position: absolute, left: 11, top: 8, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.07)'` on the `position: relative` timeline wrapper. Never transitions. Era blocks sit at `zIndex: 1` above it. No per-block line segments.
- `left: 11` = center of 24px dot column (12px) minus half of 1px line width. Dot centers sit exactly on the rail.

**Scroll activation (Session 51, fixed Session 53):**
- Single scroll listener on `[data-scroll-container]` (the `PageTransitionWrapper` motion.div)
- `targetY = window.innerHeight * 0.4` — a fixed viewport point, not a scroll offset
- Each event: finds the era whose center (`getBoundingClientRect().top + rect.height / 2`) is closest to `targetY`
- `getBoundingClientRect()` is always viewport-relative — correct regardless of scroll container nesting. `offsetTop` was wrong here because it's relative to `offsetParent`, not the scroll container.
- `requestAnimationFrame(findActiveEra)` on mount — ensures DOM is fully painted before first measurement
- `{ passive: true }` listener, cleaned up on unmount
- Works in both scroll directions. Never skips eras. No threshold tuning needed.
- `activeId` state — the geometrically closest era is always active
- Active era: `opacity: 1`, `translateX(0)`. Inactive: `opacity: 0.3`, `translateX(-4px)`
- Transition: `0.35s ease` on opacity, transform, color

**Dot color (Session 54 — thread system removed):**
- All active dots: `#00ff9f` + `boxShadow: 0 0 6px rgba(0,255,159,0.3)` — no warm amber variant
- Inactive dots: `rgba(255,255,255,0.12)`
- No thread legend in the header — terminal chrome is traffic lights + `timeline.exe` only
- `thread` field removed from `TimelineEra` interface and all TIMELINE entries

**Era types:**
- `compact` — dot 6px, smaller text (12px company, 10px role, 11px summary), `paddingBottom: 32px` in content col, `minHeight: 32px` line, no artifacts/tech/case-study rendered
- `full` — dot 8px, larger text (14px company, 11px role, 12px summary), `paddingBottom: 56px`, `minHeight: 48px` line, artifacts + tech pills + case study link

**Cohere era:** `"now"` badge — `fontSize: 9, color: '#00ff9f', border: 1px solid rgba(0,255,159,0.3)`, `borderRadius: 3`

**Footer (Session 50, confirmed Session 55):** Simple text line only. `borderTop: '1px solid rgba(255,255,255,0.06)'`, `marginTop: 64`, `paddingTop: 40`. No box, no background, no border-radius, no pulsing dot. "Currently at Cohere, San Francisco · Staff Design Engineer" in `rgba(255,255,255,0.25)`. Footer is a sibling of the timeline wrapper div — not a child of it — so it has no grid inheritance from EraBlock. Also removed unused `index` param from `TIMELINE.map` (Session 55).

**`pulse-slow` keyframe** exists in `globals.css` (added Session 49, no longer used by timeline footer but retained for possible future use).

**Nav/transition wiring:**
- `NavWrapper.tsx`: `hasChrome` includes `pathname === '/timeline'` — nav shifts down by `TAB_BAR_HEIGHT`
- `PageTransitionWrapper.tsx`: `isDeepPage` includes `'/timeline'` — enters from above, dark bg, z-20, scrollable
- `Nav.tsx`: timeline link changed from `<a href="#timeline">` to `<Link href="/timeline">`

**Do NOT:**
- Modify the thread colors (`#00ff9f` for ai/both, `rgba(196,174,145,0.7)` for builder)
- Set inactive era opacity below `0.3`
- Use em dashes in copy (use `x` or `–` for ranges)
- Add `animation` property to any element in `TimelineView.tsx` — no pulsing anywhere on the page
- Add a box/background/border-radius to the footer — text only
- Use `IntersectionObserver` for scroll tracking — single scroll listener only (Session 51)
- Use per-block line segments — the rail is a single static absolute element (Session 52)
- Add transition or animation to the rail line — it must never change (Session 52)

## Key technical artifacts to reference

- **Waypoint**: Cohere's internal design system (TypeScript, React, Tailwind). Joe is the sole design engineer.
- **Sherpa**: A Figma plugin using RAG (Pinecone vector store + Cohere models) grounded in Waypoint documentation. Built to help designers query the design system conversationally.
- **waypoint-sync**: A two-way Figma-to-code token synchronization layer. Uses `design-map.json` as the source of truth, built with Claude Code and Cursor.
- **Waypoint npm package**: Packaging Waypoint components, icons, and design tokens as a unified private package for external clients (RBC).

These are the things that make the Lab section and The Seam section real and specific. Use them for content stubs.

## Design language decisions

### Typography (enforce strictly)
- **One font family: IBM Plex Mono** across all type roles
- Hierarchy is created through weight and size only — not through font switching
- Name / hero: 400 weight, large
- Thesis / body: 300 weight (light), smaller — creates subordination within the same typeface
- Labels / nav / metadata: 300 weight, uppercase, wide tracking
- No Geist, no Manrope, no Playfair Display, no system-ui

### Color palette (defined in tailwind.config.ts — values extracted from existing site CSS)

```
bg.primary:    #161a22  — body, canvas base, loader background
bg.secondary:  #0e1015  — menu overlays, deeper surfaces
bg.card:       #282e39  — card borders, info cards
border.subtle: #323337  — form inputs, dividers
border.strong: #515255  — buttons, stronger outlines

text.primary:  #ffffff  — primary copy
text.secondary:#eeeeee  — nav, logo, secondary labels
text.muted:    #aaaaaa  — supporting body copy
text.hint:     #999999  — section titles, captions
text.faint:    #555555  — decorative lines, scroll indicators

accent.warm:     #c4ae91  — the site's warm accent (nav/link hovers)
accent.terminal: #00ff9f  — neon terminal green — streaming cursor, > prompt, chip hovers
                            Added Session 11. Use precisely: only these three contexts.
```

No purple gradients on white. No generic AI aesthetics. Two accents are now defined — `#c4ae91` for nav/link interactions, `#00ff9f` for terminal/chat interactions. Do not add a third without explicit instruction.

### Hover color rule (Session 48)
`#00ff9f` is the universal hover highlight color across all interactive elements.
- Link hovers: `color → '#00ff9f'`
- Border hovers: `rgba(0,255,159,0.3)`
- Background hovers: `rgba(0,255,159,0.04)`
- Text color changes on hover may use `rgba(255,255,255,0.9)` for readability but never as an accent
- EXCEPTION: Spotify widget uses `#1ed760` to signal brand context — do not change this
- Never use white as an accent/highlight color on hover
- This rule applies to all pages: homepage, about, work grid, case studies, nav, orbital cards

### Motion
- Swirl: slow, considered. Speed should feel deliberate, not decorative.
- Text on load: characters resolve/assemble, don't just fade
- Scroll reveals: `whileInView` with Framer Motion, one direction, no bounce
- Always include `prefers-reduced-motion` fallbacks

## What to never do

- Never write emoji into production UI components
- Never update copy or content strings unless explicitly asked — preserve exact wording even if it conflicts with other rules
- Never generate lorem ipsum — use real content stubs from the content defined above
- Never add Three.js or heavy 3D — wrong signal for the role
- Never make the prompt bar look like a ChatGPT clone
- Never let a section be longer at glance-level than a recruiter can absorb in 5 seconds

## How to handle ambiguity

When Joe gives a vague instruction like "make this section feel more alive" or "this doesn't feel right":
1. Ask one clarifying question before writing code
2. Reference the design language and motion principles above to ground the answer
3. Propose two distinct directions, not a single solution
4. Default to the interaction grammar (glance → expand → immerse) if unsure about depth

When writing new components, always check: does this serve the scanning audience, the exploring audience, or the deep audience? Build for all three simultaneously.
