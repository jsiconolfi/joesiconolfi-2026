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

### Hero / Homepage (Sessions 11–20 — current state, mobile Session 66)

The homepage is a fixed overlay composition — not a scrollable section:
- **Swirl**: `fixed inset-0 z-0`, fills entire viewport, bleeds through the glass panel
- **Nav**: via `NavWrapper` at `z-40` — desktop: pill frosted glass, centered; **mobile (Session 66)**: full-width bar, logo + hamburger + Chat (see Nav)
- **ChatPanel**: `z-20` — desktop: **width matches the desktop nav pill** via **`NavWidthContext`** (**Session 75**): `NavWrapper` runs **`ResizeObserver`** on the shrink-wrapped inner div around `<Nav />` and publishes `desktopNavWidthPx` (**Session 91:** skips while **`document.documentElement.dataset.transitioning`** is set); `ChatPanel` + **`ChatOverlay`** use that value (fallback **`DEFAULT_DESKTOP_NAV_WIDTH_PX` = `560`** in `NavWidthContext.tsx` before measure / on error). `height: 75vh`, `maxHeight: 80vh`, viewport-centered; **mobile**: `width: calc(100vw - 32px)`, `height` / `maxHeight: calc(100dvh - 140px)` (**`dvh` not `vh`** — Session 68); inner flex column fills panel; messages `flex: 1` + `minHeight: 0` + `overflowY: auto` + **`overscrollBehavior: contain`** + **`WebkitOverflowScrolling: touch`** (Session 70); chips + input `flexShrink: 0`, input bar **`paddingBottom: calc(12px + env(safe-area-inset-bottom))`** on mobile (Session 70); text input **`fontSize: 16px`** on mobile (**required** — iOS avoids focus zoom), `13px` desktop; **`touchAction: manipulation`** on chips, input, send, overlay close (Session 70); **`scrollToBottom`** on `messages` change + **`onFocus`** delayed scroll on mobile (Session 70)
- **Name block**: desktop `bottom: 32px` `left: 32px`; **mobile**: `bottom: 100px` `left: 16px` (clears mobile nav)

**Homepage file (`src/app/page.tsx`, Session 66, Session 68):** `'use client'` — `useIsMobile()` drives chat wrapper + name block offsets. Chat wrapper **Session 68 mobile:** `position: fixed; top: 80px; left: 0; right: 0; bottom: 0;` + `padding: 16px` (sides/top/bottom); desktop: `top: 0`, centered flex. `pointer-events: none` with `zIndex: 20`.

The ChatPanel (`src/components/ui/ChatPanel.tsx`) is a terminal-aesthetic frosted glass chat interface:
- **`variant` prop (Session 69):** `'embedded'` (default, homepage) vs `'overlay'` (`ChatOverlay` only). **Embedded:** first two **gray** dots `rgba(255,255,255,0.15)` at `10px` (non-interactive); **third gray dot** is a `<button>` — **`title` / `aria-label` "New conversation"**, `onClick → useChatContext().resetConversation()` (**Session 79**); persistent ambient window; `id="chat-panel"` on root for `OrbitalSystem`. **Overlay:** **colored** `#ff5f57` / `#febc2e` / `#28c840` — red `<button>` hover `×`, `title="Close"`, `onClick → useChatContext().close()`; yellow `−` hover only; **green `<button>`** — **`resetConversation()`** (same as embedded third dot), `+` on hover; **Session 81:** **`×` / `−` / `+`** glyphs on **`pointerEvents: 'none'`** spans (red, yellow, green); **no** `id` on root (avoids duplicate id with embedded instance).
- Animated greeting stream on load — three phases: thinking → streaming → assistant message with starter cards (Session 11, **Session 72**)
- AI avatar: `/logo-update.svg` in a small circle
- `>` prompt prefix in `#00ff9f` terminal green
- **Session 72 — Anthropic streaming:** `POST /api/chat` (`src/app/api/chat/route.ts`, **`export const runtime = 'edge'`**) calls Anthropic Messages API with model **`claude-sonnet-4-20250514`**, long in-file `SYSTEM_PROMPT`. Env: **`ANTHROPIC_API_KEY`** (`.env.local` + Vercel). Response is NDJSON lines: `{ type: 'text', text }` per delta, then optional `{ type: 'cards', cards }` after full text is parsed for trailing `{"cards":["slug",...]}` (max 3, validated keys). Client strips that JSON from displayed assistant text via regex.
- **Session 80 — Rate limits:** **IP (route):** in-memory **`Map`** on the edge handler — **`RATE_LIMIT_MAX` = 50** requests per **`RATE_LIMIT_WINDOW` = 1 hour** per IP (`x-forwarded-for` first / `x-real-ip` / `unknown`); over limit → **`429`** JSON **`{ error }`**; store clears on cold start. **Session (UI):** **`ChatProvider`** tracks **`messageCount`** with **`incrementMessageCount()`** on each user send (typed or chip); **`MESSAGE_LIMIT` = 30**; **`isLimitReached`** replaces the full chips + input footer with refresh copy; count resets on **page refresh only** (not **`resetConversation()`**). **`ChatPanel`:** **`429`** → assistant row shows hourly cooldown text, **`isStreaming: false`**.
- **Session 77 — Streaming + length; Session 85 — shorter replies; Session 86 — token budget for cards:** **`max_tokens: 250`** (hard cap; **do not exceed** without explicit instruction). Raised from 150 so replies can finish cleanly and append the trailing **`{"cards":[...]}`** block without mid-sentence cutoff; **`RULES`** still enforces **2-3 sentences** in the visible answer. **`SYSTEM_PROMPT`** opens with a **`RULES`** block (no exceptions): (1) **2-3 sentences max**, never more than 3, extra depth via **cards**; (2) **never use the em dash character (`—`)** in assistant replies. **`How to answer`** repeats the em-dash prohibition in plain language. Server: raw Anthropic body **`pipeThrough`** a **`TransformStream`** with SSE line buffering; response headers **`Cache-Control: no-cache, no-transform`**, **`X-Accel-Buffering: no`**. Cards emitted on **`message_stop`** and **`flush`** (once). Client: **`setMessages` inside the per-line parse loop** for each text chunk (no debounce).
- **Session 75 — Chat voice:** `SYSTEM_PROMPT` casts the model as **Joe in first person** ("You are Joe Siconolfi... Speak in first person as Joe"). Section headers use **Who I am**, **My approach**, **My philosophy**, **My technical approach...**, **My career**, **My projects**, **My beliefs**; **How to answer** requires first-person replies. Card-surfacing rules use **your** background / thinking / work. No em dashes in prompt rules. Project blurbs in **My projects** stay third-person descriptive (unchanged).
- **Session 79 — Chat persistence:** **`ChatProvider`** (`src/context/ChatContext.tsx`) holds **`messages`**, **`setMessages`**, **`isLoading`**, **`setIsLoading`**, **`streamingGreetingContent`**, and **`resetConversation()`**. Types **`Message`**, **`ChatCard`**, constants **`INITIAL_MESSAGE`**, and **`cloneGreetingMessage()`** live in **`ChatContext.tsx`** (single source of truth). **`ChatPanel`** reads/writes context only — no local **`messages`** / **`isLoading`** / greeting stream string. **`ChatOverlay`** still renders **`ChatPanel variant="overlay"`** with no separate thread state; embedded and overlay share one conversation. History survives route changes and overlay open/close; **full page refresh** clears (no localStorage). The **three-phase greeting** runs in **`ChatProvider`** in a **single `useEffect` keyed on `messages.length === 0`** so opening the overlay on the homepage does not spawn duplicate greeting timers. **`resetConversation()`** sets **`[cloneGreetingMessage()]`**, **`isLoading: false`**, clears **`streamingGreetingContent`**. **Session 80:** also exposes **`messageCount`**, **`incrementMessageCount`**, **`isLimitReached`** (session send cap — see Session 80 rate limits bullet).
- **Session 87 — Context split (performance):** **`ChatUIContext`** (`useChatUI`) — **`isOpen`**, **`open`**, **`close`**, **`toggle`**, **`isLimitReached`**, **`messageCount`**, **`incrementMessageCount`**. **`ChatMessagesContext`** (`useChatMessages`) — **`messages`**, **`setMessages`**, **`isLoading`**, **`setIsLoading`**, **`streamingGreetingContent`**, **`resetConversation`**. **`Nav`** and **`ChatOverlay`** use **`useChatUI()`** only so streaming tokens do not re-render the whole tree. **`ChatPanel`** uses **`useChatUI`** + **`useChatMessages`**. **`useChatContext()`** / **`useChat()`** merge both for backwards compatibility.
- **Contextual cards (Session 72, Session 74, **Session 76**, **Session 78**):** `Message` may include optional `cards?: ChatCard[]` (label, description, href, type — **`description` not rendered** after Session 76; still present in API/`INITIAL_MESSAGE` for meta). **Session 78:** Cards are **per message only** — no `useState` for cards. Greeting is committed with **`cloneGreetingMessage()`** (copy of `INITIAL_MESSAGE` + shallow-copied `cards` array) so state never holds the module singleton. New assistant rows use **`cards: undefined`** until a **`{ type: 'cards' }`** NDJSON line applies **`setMessages`** for that **`assistantMessage.id`** only; completion sets **`isStreaming: false`** without overwriting **`cards`** (no local `cards` accumulator merged at end). Render with **`message.cards && message.cards.length > 0 && !message.isStreaming`**. Rendered only below **completed** assistant text (not while `isStreaming`). **`role="button"`** row: single line label + `→`; padding `8px 12px`; list wrapper `gap: 6`, `marginTop: 10`. **Session 76:** Internal routes use **`useRouter().push(card.href)`** so **Framer Motion** page transitions run; **`mailto`** and **`.pdf`** use **`window.open(..., '_blank')`**. No `<a href>` for internal navigation. **Session 74:** static border/bg; **text-only hover** — `.card-title` and `.card-arrow` → `#00ff9f`; at rest title `rgba(255,255,255,0.7)` (weight 300), arrow `rgba(0,255,159,0.5)`; `Enter` activates focused row. Separate from suggestion chips.
- Glass treatment uses inline styles matching the site's existing glass variables
- Thinking state: `SwirlDotGrid` (6×4, speed 0.055) + `<ThinkingText />` component (character-shimmer animation)

Load sequence (Session 11–13, updated Session 33, **Session 79** — orchestrated in **`ChatProvider`**):
1. **Phase 1 — Thinking** (1.5s): `isLoading: true`. `AssistantAvatar thinking={true}` — SwirlDotGrid sweeps inside the avatar circle. `<ThinkingText />` label sits inline to the right, vertically centered on the same row. Each character of "thinking..." has a staggered shimmer animation (`thinking-shimmer` keyframe, 80ms stagger per char, 1.6s duration).
2. **Phase 2 — Streaming**: `isLoading` flips false. Avatar crossfades to icon (`opacity 0.4s ease`). Greeting text builds character by character at 28ms/char; `#00ff9f` cursor blinks at trailing edge. Stream string is **`streamingGreetingContent`** from context.
3. **Phase 3 — Complete**: 300ms after last char, **`streamingGreetingContent`** clears, **`cloneGreetingMessage()`** lands in **`messages`** (`id: 'greeting'`, copy + starter cards `work` / `about` — **Session 78:** not the `INITIAL_MESSAGE` singleton). **Session 75 greeting (verbatim, no em dash):** `Hi! I'm Joe, a design engineer by trade and a creative cosmonaut by nature. What would you like to explore?`

AssistantAvatar (Session 13):
- `thinking` prop (boolean, default `false`) controls a crossfade between two absolutely-positioned layers inside a fixed `w-9 h-9` circle
- `thinking={true}`: SwirlDotGrid (`4×4`, dotSize 3, gap 2, speed 0.055) fades in; icon fades out
- `thinking={false}`: icon (`/logo-update.svg`, 18×18) fades in; grid fades out
- Transition: CSS `opacity 0.4s ease` only — no Framer Motion
- Circle has `overflow-hidden` — grid is naturally clipped, no manual sizing
- Circle size is fixed at `w-9 h-9` (36×36px) — do not change it

Two separate loading states:
- `isLoading` — initial thinking phase for the greeting only (**Session 79:** from **`ChatContext`**; not duplicated per `ChatPanel` instance)
- `isResponseLoading` — local to **`ChatPanel`** — subsequent AI request in flight; disables send and chips; empty streaming assistant row shows `ThinkingText` on the avatar row; once text arrives, assistant bubble updates with trailing `#00ff9f` blink cursor until stream completes

Project mention detection (Session 14):
- `detectProjectMention(text)` scans user input against each project's `keywords` array
- On match, dispatches `portfolio:project-active` CustomEvent with `{ projectId }` detail
- Fired immediately when the user sends a message (before the chat API returns)
- Same CustomEvent pattern as `swirl:keypress`
- **`OrbitalSystem`** listens for **`portfolio:project-active`**, batches IDs in a **`queueMicrotask`**, then dispatches **`portfolio:orbit-staging`** (`src/lib/orbitalStaging.ts`) with **`{ projectId, centerX, centerY }`** in **physics space** (card **center** — same as **`posRef`**). **`OrbitalCard`** listens only to **`portfolio:orbit-staging`** for activation + staging target (**Session 93**). Side (left/right dock) from **`positionsRef`** center **x** vs viewport center (fallback: clamped home if position still **`0,0`**). **`ChatPanel`** emits **`portfolio:chat-response-complete`** when an assistant message finishes streaming; docked cards release **2s** after that (**`POST_STREAM_RELEASE_MS`** in **`OrbitalCard.tsx`**).

Suggestion chips — persistent bar only:
- Chips appear ONLY in the persistent bar above the input. Never inside message bubbles.
- The `Message` interface has no `chips` field — do not add one. Optional **`cards`** on assistant messages are for model-surfaced links only (**Session 72**).
- The bar shows the fixed set: `my work`, `my experience`, `about me`, `my resume`, `contact` — **always visible at every conversation state** (**Session 76**); never hidden after the first user message (**Session 80:** unless **`isLimitReached`** — then chips + input are replaced by the session-limit message). **`ChatOverlay`** uses the same **`ChatPanel`** — no separate chip implementation.
- Each chip calls **`handleSend`** with a full natural-language prompt (e.g. `Tell me about your work`), not the chip label alone (**Session 72**).
- Send, chips, and **`handleSend`** are inactive while **`messages.length === 0`** (until **`INITIAL_MESSAGE`** lands after the load sequence) so the greeting stream is not cleared mid-flight (**Session 72**).
- **Session 76:** chips container `padding: '10px 16px 0'`, `flexWrap` + `gap: 8`; input row `px-4` for alignment.

### Floating project cards (Sessions 14–23 — current state)

Ten project cards orbit the chat panel in slow elliptical arcs and dock to staging zones when activated by chat.

**Files:**
- `src/content/projects.ts` — typed `Project` interface + `PROJECTS` array (10 entries)
- `src/components/ui/OrbitalCard.tsx` — floating card with sine-wave drift + staging lerp; **`forwardRef`** + **`useImperativeHandle`** exposes **`tick(now)`** + **`getVideoElement()`** (**Session 87**, **Session 90** video coordinator). Position written as **`transform: translate(...)`** (**Session 90**).
- `src/components/ui/OrbitalSystem.tsx` — mounts 10 cards, computes home positions + **Session 93** staging targets (dock math + multi-mention stagger); **single shared `requestAnimationFrame` loop** calls each card's **`tick`** when **`pathname === '/'`** (**Session 87**, **Session 90** pause off homepage). **`activeVideoRef`** enforces one playing MP4 (**Session 90**). **`src/lib/orbitalStaging.ts`** — **`ORBIT_STAGING_EVENT`** + **`OrbitStagingDetail`** type.

**Mobile (Session 66):** `useIsMobile()` from `src/hooks/useIsMobile.ts` (`true` when `window.innerWidth < 768`). After all hooks, `if (isMobile) return null` — no orbital cards on mobile; **Swirl is unchanged** and still runs in layout.

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
- Card body (**Session 92**): **`backdropFilter` / `WebkitBackdropFilter`: `blur(5px)`** + **`rgba(22,26,34,0.92)`** on a **`position: absolute; inset: 0; zIndex: 0`** layer (**`pointer-events: none`**), **sibling** to the content stack — **never** put **`opacity < 1`** on an ancestor of that layer (breaks backdrop blur in WebKit/Blink). Idle/hover/active **`opacity`** lives on **`opacityLayerRef`** (`relative` **`zIndex: 1`**), not **`cardRef`**. **`cardRef`**: **`transform`**, **`borderRadius: 8px`**, **`zIndex`** only; no **`isolation: isolate`** (can narrow backdrop roots). **`.orbital-card-panel`** **`transparent`**. Nav, chat, sticky chrome blurs unchanged. `220px` wide
- NO data visualizations, NO `rgba(196,174,145,*)` warm amber
- Active beacon: static `#00ff9f` dot + `boxShadow: 0 0 8px rgba(0,255,159,0.5)` — no pulse
- Idle `opacity: 0.6`, hovered `opacity: 0.85`, active `opacity: 1`
- Hover: border → `rgba(255,255,255,0.2)`, `scale(1.02)` (suppressed when active), `zIndex: 12` — implemented in **`globals.css`** via `.orbital-card-root:hover` (no `hovered` React state — **Session 73**)
- Active always overrides hover — active state takes full visual control

**Media rendering (Session 23, updated Session 27):**
- `project.image` → raw `<img>` at rest (not `next/image` — optimization pipeline caused silent failures). `onError` → placeholder fallback.
- `project.video` (and MP4 in `project.image` when no separate still) → `<video muted playsInline loop preload="metadata">` — loads enough for a **first-frame thumbnail at rest**; **`preload="none"`** leaves orbital cards visually empty until hover. Plays on hover or chat activation; pauses and resets on leave.
- Both layers overlap in the image area. Image crossfades to opacity 0 when video is playing; video crossfades to opacity 1. Transition: `opacity 0.2s ease`.
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

**Soft collision repulsion (Session 23, staggered Session 30, **Session 73** dist²):**
- `positionsRef` — shared `useRef<Array<{x,y}>>` in `OrbitalSystem`, passed to every card. Updated each RAF frame via `onPositionUpdate` callback. Never triggers re-renders.
- Each card reads `positionsRef` in its **`tick`** (driven by **`OrbitalSystem`**'s single RAF loop — **Session 87**): if distance to another card < `MIN_DIST = 240`, applies a gentle push proportional to overlap. `REPULSE = 0.6` (impulse to velocity).
- Repulsion + viewport clamping only apply when card is idle (`activeRef.current === false`). Staged cards are fully exempt.
- `startTimeRef` uses lazy initialization on first RAF frame (not `performance.now()` at render time) to satisfy `react-hooks/purity`.
- **Collision check staggered every 3rd frame:** `frameCountRef.current % 3 === cardIndex % 3` — different cards check on different frames. Cuts collision compute by ~66%. **Session 73:** compare **`distSq`** to `MIN_DIST * MIN_DIST` first; call `sqrt` only when pairs overlap (fewer `sqrt` calls per frame).

**Velocity + damping physics (Session 32 — replaces stateless position model):**

The old model recalculated position from scratch every frame (`newPos = driftPos + forces`). Forces had no memory so they oscillated. Session 32 introduces proper velocity physics:

- `posRef` and `velRef` — `useRef({ x: 0, y: 0 })` each. Persist state between frames. Never trigger renders.
- `lerpRef` removed — no longer needed. **`frameCountRef` (Session 73)** — increments each RAF tick; used **only** to stagger collision repulsion (`% 3` vs `cardIndex`); does not drive position lerp.
- **Spring toward drift target**: `vx += (targetX - x) * SPRING`. `SPRING = 0.018` — gentle follow, not snap.
- **DAMPING = 0.82** — velocity multiplied by 0.82 every frame. Oscillations decay to zero within ~0.5s regardless of opposing forces.
- **Collision repulsion adds to velocity** (not position). `REPULSE = 0.6` impulse, then damped. Staggered every 3rd frame per card; damping smooths inter-frame gaps.
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
1. Type → `detectProjectMention` → **`portfolio:project-active`** dispatched on send (**ChatPanel**)
2. **`OrbitalSystem`** batches project IDs (**`queueMicrotask`**), measures **`#chat-panel`** via **`getBoundingClientRect()`**, computes dock **center** targets, dispatches **`portfolio:orbit-staging`** per card (**Session 93**)
3. Click card → `portfolio:query` dispatched → `ChatPanel` auto-submits via `sendMessageRef.current`
4. Side picked by **card center x** (`positionsRef` / home fallback) vs **`window.innerWidth / 2`** (**Session 93** — not `homeX` alone)
5. Staging lerp at **`0.06`/frame** toward **`chosenSlotRef`** (center coords) — unchanged (**Session 93** fixes destination math only)
6. **`ChatPanel`** dispatches **`portfolio:chat-response-complete`** when the assistant reply **finishes streaming** (success, **429**, or error). **`OrbitalCard`** waits **`POST_STREAM_RELEASE_MS`** (2000ms) after that event, then clears **`chosenSlotRef`** → card returns to drift

**Staging targets (Session 93 — transform / physics alignment):**
- Physics **`posRef.x` / `posRef.y`** are **card center** coordinates; DOM uses **`translate(x - 110px, y - 80px)`** (**Session 90**). Staging targets must be **center** points in that same space.
- **`CARD_W` = 220**, **`CARD_H` = 160**, **`DOCK_GAP` = `CARD_W / 2`** (half card-width gap between chat panel edge and docked card’s nearest vertical edge). Panel edges from measured **`#chat-panel`** rect (tracks **`NavWidthContext`** width, not a hardcoded 560).
- **Left dock center x:** `rect.left - DOCK_GAP - CARD_W/2`. **Right dock center x:** `rect.right + DOCK_GAP + CARD_W/2`. **Vertical:** `dockCY = window.innerHeight / 2`.
- **Same-side stagger** when multiple projects activate in one batch: **`STAGGER = CARD_H + 16`**, **`centerY = dockCY + (i - (n-1)/2) * STAGGER`** for **`n`** cards on that side.
- **`id="chat-panel"`** on `ChatPanel` root div — NOT the centering wrapper in `page.tsx`
- **Critical:** centering wrapper in `page.tsx` must have `pointer-events-none`. `ChatPanel` root div must have `pointer-events-auto`. Without this pair, the `fixed inset-0` wrapper at `z-20` silently blocks all pointer events to the cards at `z-10`.

**Do NOT reintroduce elliptical orbital math.** Home positions are fixed viewport percentages.
**Do NOT change `lerpRef` factor (`0.06`), traffic light colors, or orbital chrome layout.** (**Session 92:** glass **`blur(5px)`** + **`rgba(22,26,34,0.92)`** on the **absolute inset-0 blur layer** inside **`cardRef`** (content **`zIndex: 1`**) — traffic lights / borders / scale hover unchanged.)
**Do NOT reduce `MIN_DIST` below 220** (card width). Current value: 240.
**`positionsRef` must remain a `useRef`** — never convert to `useState`.

**Project shuffle (Session 24):** `shuffleArray<T>()` (Fisher-Yates, module scope in `OrbitalSystem.tsx`) is called once via `useMemo(() => shuffleArray(PROJECTS), [])`. The render iterates `shuffledProjects`. Each page load gets a different layout; positions are stable within a session. `PROJECTS` in `projects.ts` is never mutated. Must use `useMemo` — `useState` or `useEffect` would cause a visible flash of the unshuffled order.

**Performance — Session 30 + Session 73 + Session 87 + Session 90 + Session 92 (homepage / orbital):**
- **Session 90 — Position via `transform: translate(x, y)`** — outer wrapper is `position: fixed; left: 0; top: 0` with **`transform: translate(x - 110px, y - 80px)`** (`110`/`80` = half of `220×160` footprint). Physics `x,y` remain card-center coordinates; compositor-friendly (no per-frame `left`/`top` layout). **`willChange: 'transform'`** on the wrapper only.
- **Session 93 — Staging coordinates** — dock targets computed in **`OrbitalSystem`** from **`#chat-panel`** **`getBoundingClientRect()`** + **`DOCK_GAP = CARD_W / 2`**; **`portfolio:orbit-staging`** carries **`centerX`/`centerY`** matching **`posRef`** (see **Staging targets** above). Multi-mention stagger via **`queueMicrotask`** batch.
- **Session 90 — RAF only on homepage** — `OrbitalSystem` uses `usePathname()` + `isHome = pathname === '/'`; the shared RAF loop **does not run** off `/` (cards freeze at last transform until return). Saves 10× physics per frame on deep routes.
- **Session 90 — Single orbital video** — `OrbitalSystem` holds **`activeVideoRef`**; **`onVideoHover(index)`** / **`onVideoLeave(index)`** pause any other card’s `<video>` before playing. **`OrbitalCardHandle`** adds **`getVideoElement()`** for the coordinator. Prevents stacked MP4 decodes on fast hover sweeps.
- **Session 92 — Orbital panel glass restored** — **`backdropFilter` / `WebkitBackdropFilter`: `blur(5px)`** + **`backgroundColor: rgba(22,26,34,0.92)`** on **`position: absolute; inset: 0; zIndex: 0`** (blur **`pointer-events: none`**). **`opacity`** for idle/hover/active on **`opacityLayerRef`** only (sibling above blur), **not** on **`cardRef`**. **Do not** remove blur from Nav, `ChatPanel`, overlays, sticky `*.exe` headers, or `TabBar` when editing orbital cards.
- **OrbitalCard position is direct DOM** — `setDisplayPos` state removed; no per-frame React updates.
- **OrbitalCard opacity/zIndex are imperative** — **`opacity`** on **`opacityLayerRef`**; **`zIndex`** on **`cardRef`** (pointer enter/leave and activation). **`hoveredRef`** mirrors pointer hover **without** `setState` — used only for async deactivation timer + leave coordination.
- **Session 73 — hover visuals are CSS-only** — classes `orbital-card-root`, `orbital-card-panel`, `orbital-card-panel--active`, footer helpers in **`globals.css`**. Moving the cursor across cards does **not** re-render React for border, shadow, scale, role color, or footer copy swap.
- **Session 73 — active beacon** always in DOM; shown with `.orbital-card-root--active .orbital-card-beacon { display: block }` (no conditional mount on `active`).
- **OrbitalCard video** — play/pause coordinated by **`OrbitalSystem`** (Session 90). **`preload="metadata"`** on `<video>` (**Session 74**) — required so MP4-backed cards show a poster at rest.
- **Swirl DPR capped at 1.5** (`Math.min(window.devicePixelRatio ?? 1, 1.5)`) — 30% fewer canvas fill ops/frame on Retina; invisible at character sizes.
- **Swirl canvas `willChange: 'contents'`** — compositor layer for canvas, prevents canvas repaints from invalidating other layers.
- **CaseStudyThumbnail has zero `useState`** — fully refs + imperative DOM. `passive: true` on event listeners. `willChange: 'transform'` + `translateZ(0)` on both wrapper and video elements.
- **CaseStudiesDropdown row hover debounced 50ms** — `hoverTimerRef` delays `setHoveredId` by 50ms; `onMouseLeave` clears immediately. Eliminates jitter from fast cursor sweeps.

**Do NOT modify:** `Swirl.tsx` particle logic / color math / RAF timing (DPR cap and `willChange` are the only allowed changes)
**Do NOT modify:** `SwirlDotGrid.tsx`, `HiDotGrid.tsx`
**Do NOT change:** `lerpRef` factor (`0.06`), traffic light colors, card visual design
**Do NOT reintroduce:** elliptical orbital math, `next/image` in OrbitalCard (intentional exception), or **per-card `requestAnimationFrame`** in `OrbitalCard` (**Session 87** — one RAF in `OrbitalSystem` calls **`tick(now)`** on each card)
**Do NOT remove:** `willChange: 'transform'` on OrbitalCard wrapper (**Session 90** — not `left`/`top`), `willChange: 'contents'` on Swirl canvas, `willChange: 'transform'` + `translateZ(0)` on CaseStudyThumbnail — load-bearing for compositor layering.
**`@keyframes pulse`** remains in `globals.css` (not used by cards currently)
**`@keyframes thinking-shimmer`** in `globals.css` — used by `ThinkingText`: `0%/100% { color: #555555 }`, `50% { color: #aaaaaa }`, 1.6s ease-in-out infinite. Each character has an 80ms stagger delay.

### The Nav (`src/components/layout/Nav.tsx`) — updated Session 27, Session 65, Session 66, Session 68, Session 69

**Desktop:** `case studies` (dropdown) / `about` / `timeline` / `the lab` / "Chat with me" button. Order left to right: case studies ∨ · about · timeline · the lab · [Chat with me]. `about` links to `/about` (built Session 44). `timeline` links to `/timeline` (built Session 49). `the lab` links to `/lab` (built Session 60). "lab" is gone — only "the lab" exists (updated Session 33).

**Mobile (Session 66–69):** Full-width bar with **`position: relative; z-index: 46`** so it stacks **above** the menu overlay (`z-index: 45`). Hamburger: **two** lines, `gap: 6`, morph to **X** via `translateY(±3.75px)` + `rotate(±45deg)` when `menuOpen` (CSS only, `0.25s`). **Menu overlay (Session 69):** always mounted; **`opacity` + `pointerEvents`** toggle (not conditional render) so fade-out can complete; `rgba(14,16,21,0.92)` + `blur(20px)`; nav rows **left-aligned**, `fontSize: 32`, `translateX(-16px)` → `0` with **`transition-delay: i * 60ms`**; bottom **linkedin** / **github** links with extra delay after rows. `useRouter().push` on row click + `setMenuOpen(false)`; **`useEffect` on `pathname`** closes menu (browser back). **Chat** pill: `toggle()` + close menu. **NavWrapper (Session 66):** inner `width: 100%` when mobile.

**ChatOverlay (Session 66, animation Session 69, **Session 71** positioning, **Session 75** width):** `useIsMobile()`. Renders `<ChatPanel variant="overlay" />`. **Session 71:** Dialog root `fixed inset-0` flex center — **no `py-20`**, **no `px-4` on desktop**; mobile only `paddingLeft`/`paddingRight` `16px` (matches homepage `32px` total horizontal inset with panel `calc(100vw - 32px)`). Inner `motion.div`: **`width`** — mobile `calc(100vw - 32px)`; desktop **`desktopNavWidthPx` + `px`** from **`NavWidthContext`** (**Session 75**, same value as embedded `ChatPanel`) — **no `max-w-2xl`**, so overlay panel centers identically to the homepage chat. **Panel motion:** `useAnimation()` — open from above (`y: '-100vh'` → `0`), close down (`y: '100vh'`), reset to `-100vh`; `duration: 0.45`, same ease as page transitions. Root `opacity` / `visibility` close delay aligned to `0.45s`.

**Active route highlighting (Session 65):**
- `usePathname()` from `next/navigation` in `Nav.tsx`. Helper `isActive(href)`: if `href === '/'` then `pathname === '/'`, else `pathname.startsWith(href)`.
- Text links (`about`, `timeline`, `the lab`): resting color `rgba(255,255,255,0.6)`; **active** (current route) or **hover** → `#00ff9f`. Implemented via small `NavTextLink` wrapper with local hover state so inline `color` does not block hover.
- Homepage `/`: no text nav link uses active green (logo/home link has no active styling).
- `CaseStudiesDropdown` uses its own `usePathname()`: when `pathname.startsWith('/work')`, trigger label is `#00ff9f`; when not on work, open dropdown → `rgba(255,255,255,0.9)`, closed → `rgba(255,255,255,0.6)`.

The `work` link is replaced by `<CaseStudiesDropdown />` — a hover-triggered frosted glass dropdown with 4 featured projects. `z-index: 50` on the panel — above orbital cards at `z-10`.

**CaseStudiesDropdown (`src/components/ui/CaseStudiesDropdown.tsx`, Session 27, updated Session 30, Session 65):**
- Opens on **hover**, not click. `onMouseEnter` / `onMouseLeave` on the wrapper div. 120ms close delay prevents accidental close when cursor moves from trigger to panel.
- `closeTimer` typed as `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)`
- Button trigger is a non-interactive label (`cursor: 'default'`, no `onClick`). No outside-click or Escape handlers.
- Trigger text color: `/work` and `/work/*` → `#00ff9f`; else `open` → `rgba(255,255,255,0.9)`; else `rgba(255,255,255,0.6)` (Session 65).
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

**Viewport (Session 70):** `src/app/layout.tsx` exports `viewport` (`next` `Viewport` type): `width: 'device-width'`, `initialScale: 1`, `maximumScale: 1`, `userScalable: false` — prevents iOS Safari input-focus zoom and stuck zoom after the keyboard dismisses (pairs with **16px** mobile input in `ChatPanel`).

Do NOT use `#0e1015` on `<body>` — that's the darker panel/overlay color, not the body background. Do NOT use `#000000`.

After moving Swirl/Nav/OrbitalSystem to `layout.tsx` in Session 35, the page components no longer set the background, so both locations are now the single source of truth.

### Page transitions (Session 35)

Smooth Framer Motion transitions between homepage and case study pages. Swirl and orbital cards are persistent — they never unmount.

**Architecture:**
- `Swirl`, `OrbitalSystem`, and `Nav` moved from `page.tsx` to `layout.tsx` — persistent across all navigation
- `PageTransitionWrapper` (`src/components/layout/PageTransitionWrapper.tsx`) wraps `{children}` in the layout
- `ChatProvider` wraps **`NavWidthProvider`** → `NavWrapper` + `PageTransitionWrapper` + `ChatOverlay` (**Session 75** — desktop chat width tracks nav via context)
- `page.tsx` now only contains ChatPanel wrapper + name block — no Swirl, OrbitalSystem, or Nav

**PageTransitionWrapper (rewritten Session 47):**
- `'use client'` — uses `usePathname` from next/navigation
- `AnimatePresence mode="wait" initial={false}` — exits complete before enters begin; no entrance animation on first load
- `key={pathname}` — triggers AnimatePresence on every route change
- `data-scroll-container` attribute on the motion.div — `useEffect` resets `scrollTop` to 0 **only when `pathname` changes** (**Session 87:** dependency array `[pathname]` — avoids resetting scroll on every chat streaming token / unrelated `ChatProvider` re-render)
- Transition: `duration: 0.45`, `ease: [0.25, 0.46, 0.45, 0.94]` (ease-out-quart)
- `isDeepPage(pathname)`: `pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline' || pathname === '/lab'` — single helper, replaces all prior `isCaseStudy`/`isWorkIndex`/`isAbout`/`isContentPage` variables
- Deep pages (`/work`, `/work/*`, `/about`, `/timeline`, `/lab`): enter from above (`y: '-100vh'`), exit downward (`y: '100vh'`); dark bg, z-20, `pointerEvents: 'auto'`, `overflowY: 'auto'`, `top: 0`
- Homepage: enters from below (`y: '100vh'`), exits upward (`y: '-100vh'`); transparent bg, z-10, `pointerEvents: 'none'`, `overflowY: 'hidden'`, `top: 0`
- `top: 0` for all pages — `TAB_BAR_HEIGHT` offset removed from wrapper; content-level padding handles tab bar / chrome clearance
- Do NOT reintroduce `top: TAB_BAR_HEIGHT` on the wrapper
- Do NOT split `isDeepPage` back into per-pathname variables (`isCaseStudy`, `isWorkIndex`, `isAbout`, `isTimeline`)
- **Session 91 — transition flag + compositor hints:** `onAnimationStart` sets **`document.documentElement.dataset.transitioning = 'true'`**; **`onAnimationComplete`** clears it only when **`useIsPresent()`** is true (enter animation finished — exit completion does not clear). **`motion.div`:** `willChange: 'transform, opacity'`, **`contain: 'layout style'`**. Inner wrapper around **`{children}`:** **`contain: 'layout'`**. Swirl particle count is unchanged (**Session 91** scoped layout cost only; do not modify **`Swirl.tsx`**).

**OrbitalSystem changes (Session 35):**
- Added `usePathname` import — pathname used as dependency in the measure `useEffect`
- Immediate `measure()` on pathname change + delayed `measure()` after 600ms — catches `chat-panel` element that may still be animating in after transition
- On case study pages: `chat-panel` not found → `ready` stays as-is, cards keep floating behind the opaque overlay at z-20
- On return to homepage: delayed measure finds `chat-panel`, sets viewport readiness (**Session 93:** dock targets are computed at activation from the panel rect, not precomputed slot arrays)

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
      <NavWidthProvider>  {/* Session 75 — desktop chat width = measured nav pill */}
        <NavWrapper />      {/* z-40, fixed — shifts top by TAB_BAR_HEIGHT on /work/* */}
        <PageTransitionWrapper>
          {children}        {/* z-10 (homepage) or z-20 (case study) */}
        </PageTransitionWrapper>
        <ChatOverlay />     {/* z-50 */}
      </NavWidthProvider>
    </ChatProvider>
  </TabProvider>
</body>
```

### Tab bar system (Session 39)

Persistent browser-like tab bar that appears on all `/work/*` routes.

**Files:**
- `src/context/TabContext.tsx` — `TabProvider`, `useTabs()` hook, `Tab` interface
- `src/context/NavWidthContext.tsx` (**Session 75**) — `NavWidthProvider`, `useNavWidthContext()`; desktop chat width tracks measured nav
- `src/components/layout/TabBar.tsx` — renders tab strip; exports `TAB_BAR_HEIGHT = 38`
- `src/components/layout/NavWrapper.tsx` — wraps `Nav`, shifts its `top` by `TAB_BAR_HEIGHT` on `/work/*`; **Session 75:** measures nav pill width for context

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
- **Tab layout (Session 43, **Session 81**):** `[traffic lights — active only, desktop] [label flex:1] [× close button]`. **Session 81:** On the active tab (desktop only), the **red dot is a `<button>`** that **`closeTab(slug)`** — hover shows **`×`** on a **`<span style={{ pointerEvents: 'none' }}>`** so the glyph never steals hit targets from the button (no hover flicker, click always registers). Yellow / green are **`<button type="button" tabIndex={-1} aria-hidden>`** with decorative **`−` / `+`** on hover — same **`pointerEvents: 'none'`** on those spans; **`onClick` → `stopPropagation`** so tab row does not switch. **`TabActiveTrafficLights`** (child component) owns red/yellow/green hover state so it resets when the active row unmounts (avoids **`useEffect` + setState** lint). **`×` button** on the right remains: **`opacity:1`** when active or tab hovered, **`e.stopPropagation()`** on click and pointer handlers; wrap the **`×`** in **`pointerEvents: 'none'`** span.
- **Session 67 (mobile):** `useIsMobile()` — traffic lights **hidden** when mobile (`isActive && !isMobile`). Per-tab `maxWidth: isMobile ? 120 : 200`; row padding `isMobile ? '0 6px 0 8px' : '0 8px 0 10px'`; close button `minWidth`/`minHeight: 44` on mobile; tab row + close `touchAction: 'manipulation'`. Close is `type="button"`.
- `hoveredTab` and `hoveredClose` state control bg tint, label brightness, and close button visibility
- `flex: 1, maxWidth: 200px` per tab on desktop — tabs compress automatically as more open; label truncates with ellipsis
- `z-index: 50` — above orbital cards and nav
- Background: `rgba(10,12,16,0.98)` + `blur(12px)`, border-bottom `rgba(255,255,255,0.06)`
- Active tab: `rgba(255,255,255,0.05)` bg, `borderBottom: '1px solid #161a22'` (merges with content)
- Inactive tab: no bg, `rgba(255,255,255,0.35)` label color

**NavWrapper (`NavWrapper.tsx`, Session 39, updated Session 46, Session 67, **Session 75**):**
- `'use client'` — reads `usePathname` + **`useIsMobile()`** (Session 66, Session 67) + **`useNavWidthContext()`** (**Session 75**)
- `hasChrome = pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline' || pathname === '/lab'` — covers `/work` index, `/work/[slug]`, `/about` (Session 44), `/timeline` (Session 49), and `/lab` (Session 60)
- **Session 67:** outer fixed wrapper `padding: isMobile ? '12px 16px' : '12px 24px'`
- **Session 75:** `navMeasureRef` on the inner shrink-wrap div (`width: auto` desktop) around `<Nav />`; **`useLayoutEffect`** + **`ResizeObserver`** when **`!isMobile`** → `setDesktopNavWidthPx(el.offsetWidth)` so `ChatPanel` / `ChatOverlay` match the nav pill width. **Session 91:** **`ResizeObserver`** callback **returns early** if **`document.documentElement.dataset.transitioning === 'true'`** (avoids width churn during route transitions).
- `top` is `useState(0)` + `useEffect` with 60ms `setTimeout` (Session 46). Nav always mounts at `top: 0` and animates to `TAB_BAR_HEIGHT` after the delay. Without this, the `pathname`-derived value renders synchronously so the CSS transition has no prior state to animate from. `useState(0)` initial value is intentional — do NOT initialize to `hasChrome ? TAB_BAR_HEIGHT : 0`. The delay must stay 50–100ms.
- **Session 91:** `transition: 'top 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s'` — **150ms delay** before `top` animates (staggers nav vs full-viewport **`PageTransitionWrapper`** motion). Do not change the delay without an explicit session.
- `pointerEvents: 'none'` on outer div, `pointerEvents: 'auto'` on inner Nav wrapper — preserves nav interactivity
- Inner wrapper **`width: '100%'`** when mobile (Session 66)
- `Nav` no longer sets its own fixed position — NavWrapper owns all positioning

**`NavWidthContext` (`src/context/NavWidthContext.tsx`, Session 75):**
- **`NavWidthProvider`** wraps `NavWrapper`, `PageTransitionWrapper`, and `ChatOverlay` inside **`ChatProvider`** in `layout.tsx`.
- **`useNavWidthContext()`** — `desktopNavWidthPx`, `setDesktopNavWidthPx` (internal use from NavWrapper).

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
- `src/components/case-study/WorkGrid.tsx` — `'use client'` grid of all 10 case studies. **Session 71:** Sticky **`case-studies.exe`** header uses **colored** traffic lights — red `<button type="button">` → `router.push('/')`, hover `×`; yellow/green hover `−` / `+` only; inner glyph spans use **`pointerEvents: 'none'`**. **Per-card** chrome: **gray** dots only (informational cards). **`useIsMobile()`** — content padding `isMobile ? '100px 20px 80px' : '100px 48px 120px'`; grid `1fr` on mobile vs `auto-fill minmax(280px,1fr)`; h1 **22px** mobile / **28px** desktop; card chrome row **`minHeight: 44`** mobile; cards **`touchAction: 'manipulation'`**, **`role="button"`**, **`aria-label`**, Enter/Space keyboard. 16/9 thumbnails via `GridThumbnail`: `preload="metadata"`, hover play mp4, leave pause/reset. `<main overflowX: hidden>`.
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

**CaseStudyView layout (updated Session 39, Session 67, **Session 71** padding):**
- Sticky `*.exe` page chrome **removed** — persistent **`TabBar`** (colored traffic lights on active tab, desktop) + nav. **`/work/[slug]`** colored-window metaphor = tab bar + overlay/chat chrome, not a second sticky header in the scroll body.
- **`useIsMobile()`** — content column `maxWidth: isMobile ? '100%' : 720`, `padding: isMobile ? '20px 20px 80px' : '120px 24px 120px'` (**Session 71:** desktop top `120px` to match other deep pages), `width: '100%'`, `boxSizing: 'border-box'`. `<main overflowX: hidden>`.
- Hero asset (if present): `16/9` aspect ratio, `borderRadius: 8`. **Video:** `autoPlay={!isMobile}`, `muted`, `loop`, `playsInline`, **`preload="metadata"`** — **no autoplay on mobile** (Session 67); desktop keeps ambient autoplay.
- Header block: year (muted, uppercase) → name (h1, 32px) → tagline → role (terminal green `rgba(0,255,159,0.7)`, 12px, fontWeight 300, sentence case — no uppercase, no letterSpacing)
- Sections in order: `the problem` (hook) → `the hard part` (full only) → `key decisions` or `what I did` → `outcome`
- Decision artifact videos: same as hero — **`autoPlay={!isMobile}`**, **`preload="metadata"`** (Session 67)
- Next case study: **`type="button"`** — full width on mobile, `justifyContent: center`, `minHeight: 44` mobile, `touchAction: 'manipulation'`
- Body copy: 13px, `fontWeight: 300`, `lineHeight: 1.8`, `rgba(255,255,255,0.65)` — shared **`bodyStyle`** includes **`wordBreak: 'break-word'`**
- All styling: inline styles only (no Tailwind — this is a scrollable page, not the fixed overlay system)

**Video rule for case study pages (Session 67 update):**
- **Desktop:** hero and decision artifact mp4s autoplay muted loop — ambient case-study treatment.
- **Mobile:** **`autoPlay={false}`** (via `!isMobile`) + **`preload="metadata"`** — avoids jarring autoplay and saves battery; differs from orbital cards (hover/active) and thumbnails (hover only).

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

### About page — Session 44, bio Session 84, sports widgets Session 82, layout Session 83, last result Session 88, compact last result Session 89

Live at `/about`. Scrollable content page with terminal chrome header.

**Files:**
- `src/app/about/page.tsx` — thin route, renders `<AboutView />`
- `src/components/about/AboutView.tsx` — `'use client'` component
- **`src/app/api/sports/knicks/route.ts`** — GET, ESPN NBA Knicks schedule (`teams/18`), **`revalidate` 60** (**Session 82**)
- **`src/app/api/sports/mets/route.ts`** — GET, ESPN MLB Mets schedule (`teams/21`), same (**Session 82**)
- **`src/lib/espnSchedule.ts`** — shared types + `parseCompetitorPoints` (ESPN `score` object), `competitionState` reads **`competitions[0]`** (**Session 82**)

**Layout (Session 67 mobile, **Session 71** chrome):**
- Terminal chrome header: `position: sticky, top: 0, zIndex: 40`, `rgba(10,12,16,0.98)` + `blur(12px)`. **Colored** traffic lights (**Session 71**): red button → `router.push('/')`, hover `×`; yellow/green `−` / `+` on hover only; glyph spans **`pointerEvents: 'none'`**. Title: `about.exe`.
- **`useIsMobile()`** — content `padding: isMobile ? '100px 20px 80px' : '120px 48px 160px'`, `maxWidth: 880`, `width: '100%'`, `boxSizing: 'border-box'`. `<main overflowX: hidden>`.
- Photo + bio: **mobile** — `flex` column, `gap: 32`; **desktop** — grid `200px 1fr`, `gap: 48`. `marginBottom: 72`.
- Photo: **mobile** `120×120`, `margin: 0 auto`; **desktop** `200×200`. `/joe.png`, `borderRadius: 8`, `objectFit: cover`. Raw `<img>` with `eslint-disable-next-line @next/next/no-img-element`.
- Name/role below photo: **`marginTop: 12`**, **`textAlign: center`** on mobile / left desktop. name 14px 400 weight, role `rgba(0,255,159,0.7)` 11px 300, location `rgba(255,255,255,0.35)` 11px 300
- Facts + widgets: **mobile** single column `flex`; **desktop** grid `1fr 1fr`, `gap: 48`. Facts label width **100** mobile / **120** desktop. Spotify link **`maxWidth: '100%'`** mobile; Spotify card **`minHeight: 44`** + **`touchAction: 'manipulation'`** on mobile. **Session 83:** **connect** lives under facts in the **left** column (divider + horizontal row, label-only, hover `#00ff9f`); connect links **`minHeight: 44`** + **`touchAction: 'manipulation'`** on mobile. **Right** column: Spotify + Knicks + Mets only, column **`gap: 14`** (tight widget stack).
- Bio: 4 paragraphs, 13px fontWeight 300 lineHeight 1.8 `rgba(255,255,255,0.65)`. Copy is **verbatim** — never rewrite (**Session 84**).
- Horizontal divider `rgba(255,255,255,0.06)` separates bio from bottom section
- Bottom two-column grid (1fr 1fr): **left** — facts + **connect** (horizontal, bottom); **right** — Spotify + Knicks + Mets (**Session 83:** widget column `gap: 14`; connect removed from right). Sports widgets still poll **60s**.

**BIO copy (verbatim — do not modify; Session 84, align with `content-voice-guidelines.md`):** Stored as the `BIO` string array in `AboutView.tsx`. Four paragraphs; **no em dashes** in the about page file (bio strings and comments).

```tsx
const BIO = [
  "I'm a designer, engineer, and self-proclaimed creative cosmonaut based in San Francisco, originally from New York. With pizza in my blood, punk in my veins, and users in my heart. I've been on the West Coast and the SF Bay since 2022. For 15+ years I've been doing both: conceiving the experience and building it, in the same session, without handing off.",
  "Most of my work has been at companies where the product didn't exist yet. That's where the duality matters most. When you're figuring out what something should be, you can't separate how it feels from how it works. The design is the product. The code is the design. I've never thought of them as different jobs.",
  "My focus now is AI-native product. Not AI as a feature bolted onto something, but experiences built from the ground up around what AI actually makes possible. I care deeply about the human side of that: how do you make a system that learns feel empowering rather than opaque? How do you design for capability without designing away agency? How do you get someone to the moment where the product just gets them, and make that moment happen faster? That's the problem I keep returning to.",
  "When I'm not building I'm digging through record bins or watching the Knicks and Mets find new ways to break my heart. I started with MySpace CSS in middle school and the habit never left. Fifteen years later the tools are different, the problems are bigger, and I still can't stop making things.",
]
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

**Knicks / Mets widgets (Session 82, **Session 88 — last result**, **Session 89 — single-line last result**):** **`SportsWidget`** in `AboutView.tsx` — **`/api/sports/knicks`**, **`/api/sports/mets`**. ESPN unofficial JSON only (**no env vars**). Next game: opponent, home/away, formatted local time; live: scores, NBA `Q` + clock or MLB `shortDetail`; **live** pill `#00ff9f`. **Session 88:** Successful responses (`live`, `upcoming`, `off_season`) include optional **`lastGame`**: most recent completed event (`competitionState === 'post'` or `status.type.completed`), with opponent name/abbr, final scores, **`won`** (boolean), **`isHome`**, ISO **`date`**. Knicks payload uses **`knicksScore`** / **`opponentScore`**; Mets uses **`metsScore`** / **`opponentScore`**. **`SportsWidget`** renders **last result** below the main state (divider `rgba(255,255,255,0.05)`). **Session 89:** One row only: **`display: flex`**, **`justifyContent: space-between`** — **last result** label left (9px uppercase dim, `fontWeight: 300`); right cluster **`gap: 6`**: **W** **`rgba(0,255,159,0.7)`**, **L** **`rgba(255,255,255,0.3)`**, score, **`vs` / `@`** opponent abbr. No stacked label above the score. Omit block when **`lastGame`** is null/undefined. Team name labels (**knicks** / **mets**) use **`rgba(255,255,255,0.75)`** (not team blue accents). **`setInterval` 60_000**, cleanup on unmount. Routes return JSON `status`: `live` | `upcoming` | `off_season`; HTTP 500 → `{ status: 'error' }` (no **`lastGame`** on error).

**Connect links (Session 83):** Under facts in the left column: horizontal row (`gap: 24`, `flexWrap`), text labels only (**no** `→` prefix). Hover **`#00ff9f`**. `mailto:` has no `target`/`rel`; https opens `_blank` + `noopener noreferrer`. Data: **`LINKS`** in `AboutView.tsx`. No `next/link` — external or `mailto:`.

**NavWrapper:** `hasChrome = pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline' || pathname === '/lab'` — nav shifts down by `TAB_BAR_HEIGHT` on `/about`, `/timeline`, and `/lab` (same as work pages). `top` is `useState(0)` + `useEffect` with 60ms delay (Session 46) so the CSS transition always has a prior value to animate from. **Session 91:** **`top`** CSS transition **`0.15s` delay**; **`ResizeObserver`** guarded during **`dataset.transitioning`**.

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

### The Lab — Session 60, updated Session 61–63

Live at `/lab`. Open notebook: featured experiments at top, chronological feed below.

**Files:**
- `src/content/lab-experiments.ts` — `ExperimentStatus` type + `LabExperiment` interface + `LAB_EXPERIMENTS` array (3 entries, expanded in Session 61)
- `src/content/lab-feed.ts` — `FeedEntryType` type + `FeedEntry` interface + `LAB_FEED` array (14 entries as of Session 61)
- `src/app/lab/page.tsx` — thin route, renders `<LabView />`
- `src/components/lab/LabView.tsx` — `'use client'` component

**LabExperiment interface:**
```ts
interface LabExperiment {
  id: string
  title: string
  description: string  // supports \n\n for paragraph breaks
  status: ExperimentStatus  // 'in progress' | 'shipped' | 'archived' | 'ongoing'
  tags: string[]
  date: string
  url?: string
  notes?: string
}
```

**FeedEntry interface:**
```ts
interface FeedEntry {
  id: string
  type: FeedEntryType  // 'note' | 'prompt' | 'read' | 'tool' | 'eval' | 'experiment'
  title: string
  body: string  // supports \n\n for paragraph breaks
  date: string
  tags: string[]
  url?: string
}
```

**LabView layout (Session 61, Session 67 mobile, **Session 71** chrome):**
- Terminal chrome: `position: sticky, top: 0, zIndex: 40`, `rgba(10,12,16,0.98)` + `blur(12px)`. **Colored** traffic lights on sticky bar — same red/yellow/green pattern as **About** / **Timeline** / **WorkGrid** (**Session 71**). Window title: `lab.exe`.
- **`useIsMobile()`** — content `padding: isMobile ? '100px 20px 80px' : '120px 48px 160px'`, `maxWidth: 760`, `width: '100%'`, `boxSizing`. `<main overflowX: hidden>`.
- Page order: header → currently thinking about → divider → things I hold true (7 beliefs) → divider → experiments → divider → feed
- Header: eyebrow "the lab" + h1 **22px mobile / 28px desktop** "Open notebook" + subtitle + tagline "The best interface never asks."
- "Currently thinking about": questions with **`wordBreak: 'break-word'`** on mobile-narrow viewports
- "Things I hold true": **mobile** — single column `flex`, `gap: 8`, note col **`marginTop: 4`**; **desktop** — two-column grid (`1fr 1fr`, gap 32). Left: statement (`rgba(255,255,255,0.85)`, 13px weight 400). Right: note (`rgba(255,255,255,0.4)`, 12px weight 300). Rows separated by `rgba(255,255,255,0.05)` border-bottom.
- Experiment cards: terminal chrome with **gray dots** (`rgba(255,255,255,0.15)`) — NOT colored. Cards are not interactive/closeable.
- Status badge colors: `in progress`/`ongoing` → `rgba(0,255,159,0.7)`, `shipped` → `rgba(0,255,159,0.4)`, `archived` → `rgba(255,255,255,0.25)`
- Experiment descriptions: `text.split('\n\n').map((para) => <p>)` — renders multi-paragraph bodies correctly
- Notes field: `borderLeft: '2px solid rgba(0,255,159,0.2)'`, `color: rgba(0,255,159,0.45)`
- Feed section label + **tag search filter** (Session 63, Session 67): `activeTags` + `filterQuery`; `filteredFeed` OR across active tags; suggestions `slice(0, 6)`; client-side only, no URL persistence. **Mobile:** filter input **`maxWidth: '100%'`**, **`fontSize: 16`** (iOS), **`minHeight: 44`**; tag pills + clear + suggestion rows **`minHeight: 44`** + **`touchAction: 'manipulation'`**. Experiment card chrome row **`minHeight: 44`** mobile; titles/body **`wordBreak: 'break-word'`**.
- Feed entries: type badge (terminal green pill), date, title, body. Body split on `\n\n` for multi-paragraph entries.
- Feed entries with `url` render title as `<a>` that turns `#00ff9f` on hover, with ` →` suffix
- All styling: inline styles only (no Tailwind)

**Traffic light rule (Session 61, clarified Session 68–69, **Session 71**):**
- **Colored dots** (`#ff5f57`, `#febc2e`, `#28c840`) = **page-level closeable chrome**: sticky **`about.exe`**, **`timeline.exe`**, **`lab.exe`**, **`case-studies.exe`** headers (red → `router.push('/')`, hover `×`; yellow/green `−`/`+` decorative); **`ChatPanel variant="overlay"`** (red → `useChatContext().close()`); **OrbitalCards**; **TabBar** active tab **desktop only** (lights hidden on mobile — Session 67) — **Session 81:** TabBar **red dot closes the tab** (same as right **`×`**); **all hover glyphs** (`×` **`−` `+`**) on **`<span pointerEvents: 'none'>`** inside the dot **`<button>`**s. **`/work/[slug]`** body uses **TabBar** for colored tab chrome, not a duplicate sticky header in `CaseStudyView`.
- **Gray dots** (`rgba(255,255,255,0.15)`) = **informational cards only**: **`ChatPanel variant="embedded"`** — first two header dots only (**Session 79:** third dot is a **New conversation** control, same gray look); **WorkGrid** per-card rows, **Lab** experiment cards, **OrbitalCard**-style card rows — those gray dots non-interactive.
- **Implementation note (Session 71, **Session 81**):** On colored chrome, inner `×` / `−` / `+` spans must use **`pointerEvents: 'none'`** so pointer events stay on the parent **`<button>`** — without it, conditional glyphs cause **leave/enter flicker** and **missed clicks** (**Session 81:** **`TabBar`** active-tab lights, **`ChatPanel` overlay** red/yellow, sticky **`*.exe`** headers already compliant; right-hand **TabBar** **`×`** wraps glyph in **`pointerEvents: 'none'`** span).

**Nav/transition wiring:**
- `NavWrapper.tsx`: `hasChrome` includes `pathname === '/lab'`
- `PageTransitionWrapper.tsx`: `isDeepPage` includes `pathname === '/lab'`
- `Nav.tsx`: `the lab` uses `<Link href="/lab">`

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

**Layout (Session 51 + Session 52, updated Session 58, Session 67, **Session 71** chrome):**
- Terminal chrome: `position: sticky, top: 0, zIndex: 40`, `rgba(10,12,16,0.98)` + `blur(12px)`. **Colored** traffic lights — same pattern as **About** / **Lab** / **WorkGrid** sticky headers (**Session 71**). Window title: `timeline.exe`.
- **`useIsMobile()`** — content `padding: isMobile ? '100px 20px 80px' : '120px 48px 160px'`, `width: '100%'`, `boxSizing`. `<main overflowX: hidden>`.
- Header div: `paddingLeft: 48` (Session 59) — aligns header text with era content column (24px dot + 24px gap)
- Header h1: **22px mobile / 28px desktop** — "15+ years of building" (Session 58, Session 67)
- Resume download link: **`minHeight: 44`** mobile + **`touchAction: 'manipulation'`**. `<a href="/JoeSiconolfi_Resume-2026.pdf" download>` — `marginTop: 20`, `fontSize: 11`, `fontWeight: 300`, `color: rgba(255,255,255,0.4)`. Hover → `#00ff9f`. `↓` arrow prefix in `rgba(0,255,159,0.5)`. PDF served from `/public/`.
- **`EraBlock`:** receives `isMobile` — summary + artifact values **`wordBreak: 'break-word'`**; content col **`minWidth: 0`**; case study **`type="button"`**, **`minHeight: 44`** mobile, **`touchAction: 'manipulation'`**. Footer wrapper **`wordBreak: 'break-word'`**.
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
- No `opacity` or `transform` on the EraBlock outer wrapper (Session 56) — dots are stationary, always fully visible
- Active/inactive state drives color only: dot color, glow, and text color values transition at `0.35s ease`

**Dot color (Session 54, cleaned Session 57):**
- All active dots: `#00ff9f` + `boxShadow: 0 0 6px rgba(0,255,159,0.3)` — hardcoded inline, no `threadColor` variable
- Inactive dots: `rgba(255,255,255,0.12)`
- No `position: relative` or `zIndex` on the dot element — redundant, the era list flex container already provides the stacking context
- No `marginLeft`, `marginRight`, or `marginTop` on the dot — `alignItems: 'center'` on the dot column handles centering
- No thread legend in the header — sticky chrome is colored traffic lights + `timeline.exe` (**Session 71**)

**Era types:**
- `compact` — dot 6px, smaller text (12px company, 10px role, 11px summary), `paddingBottom: 32px` in content col, `minHeight: 32px` line, no artifacts/tech/case-study rendered
- `full` — dot 8px, larger text (14px company, 11px role, 12px summary), `paddingBottom: 56px`, `minHeight: 48px` line, artifacts + tech pills + case study link

**Cohere era:** `"now"` badge — `fontSize: 9, color: '#00ff9f', border: 1px solid rgba(0,255,159,0.3)`, `borderRadius: 3`

**Footer (Session 50–59):** Simple text line only. `borderTop: '1px solid rgba(255,255,255,0.06)'`, `marginTop: 64`, `paddingTop: 40`, `paddingLeft: 48` (Session 59 — aligns border + text with era content column). No box, no background, no border-radius. "Currently at Cohere, San Francisco · Staff Design Engineer" in `rgba(255,255,255,0.25)`. Footer is a sibling of the timeline wrapper — not a child.

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
- **Session 87 — `layout.tsx` font subset:** `next/font/google` loads weights **`300`**, **`400`**, **`500`** only, **`normal`** only (no italic). Saves first-load bytes; inline **`fontWeight: 700`** / **`600`** were migrated to **`500`** where emphasis was needed. Do not re-add weights 100–200, 600–700, or italic without updating the subset.
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

### Lint and code quality standard (project-wide)

- `eslint src/` must pass clean at all times — never scope lint to a single file to work around failures.
- `tsc --noEmit` must pass clean at all times.
- Fix real violations when found, even if outside the current session’s scope.
- No refs read during render — use `useState(() => computeInitialValue())` to pin values at mount when a value must stay fixed for that component instance.
- No unused variables or constants — remove them when found.

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
