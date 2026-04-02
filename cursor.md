# Cursor Rules — joesiconolfi.com

## Project identity

This is a personal portfolio site for Joe Siconolfi, Staff Design Engineer at Cohere. The site is not a brochure — it IS the proof of concept. Every interaction should demonstrate AI-native design engineering, not describe it. The swirl animation (code-to-design metaphor) is a core brand element and must be preserved across refactors.

## Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode, no `any` unless explicitly justified)
- **Styling**: Tailwind CSS v3 — utility-first, no inline styles except for dynamic values (e.g. animation keyframe percentages)
- **Animation**: Framer Motion (`framer-motion@12`) for page transitions and component-level animation, CSS for the swirl/background
- **Fonts**: Loaded via `next/font/google` — **IBM Plex Mono** only (**Session 87:** weights **`300`**, **`400`**, **`500`**, **`normal`** only — smaller first-load payload; no italic or 100–200 / 600–700). CSS var `--font-mono`. All type roles use IBM Plex Mono, differentiated by weight and size. No other fonts.
- **AI integration**: Anthropic Messages API via **`src/app/api/chat/route.ts`** (edge runtime, `fetch` to `api.anthropic.com`) — **`ANTHROPIC_API_KEY`**, model **`claude-sonnet-4-20250514`**, **`max_tokens: 250`** (**Session 77**, **Session 85**, **Session 86** — **do not exceed** without explicit instruction; **250** leaves room for short replies plus trailing cards JSON without cutoff). **`SYSTEM_PROMPT`** starts with a **`RULES`** block: **2-3 sentences max** (else cards), and **no em dashes (`—`)** in any reply. **Session 80:** in-memory IP rate limit **`RATE_LIMIT_MAX` = 50** requests per **`RATE_LIMIT_WINDOW` = 1h** per IP (`x-forwarded-for` / `x-real-ip`); **`429`** JSON body; resets on edge cold start.
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
  hooks/                # Custom React hooks (`useIsMobile.ts` — Session 66, breakpoint 768px)
  styles/               # Global CSS, Tailwind config extensions
  types/                # Shared TypeScript types and interfaces
  content/              # Static content as typed TS objects (no CMS yet)
```

## Next.js 15+ rules

- **`viewport` export (Session 70):** In `src/app/layout.tsx`, `export const viewport: Viewport` from `next` sets `maximumScale: 1` and `userScalable: false` for mobile chat / form UX (iOS). Do not rely on a raw `<meta name="viewport">` if the export is present.
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

### Hover states
All interactive hover states use `#00ff9f` (terminal green) as the highlight color.
- Link hovers: `color → '#00ff9f'`
- Border hovers: `rgba(0,255,159,0.3)`
- Background hovers: `rgba(0,255,159,0.04)`
- Text color changes on hover may use `rgba(255,255,255,0.9)` for readability
- EXCEPTION: Spotify widget uses `#1ed760` to signal brand context
- Never use white as an accent/highlight color on hover

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

## AI / chat panel (Session 7 — updated Session 11, Session 66, Session 68, Session 69, Session 70, **Session 72**, **Session 74**, **Session 75**, **Session 76**, **Session 77**, **Session 78**, **Session 79**, **Session 80**, **Session 85**, **Session 86**, **Session 87**)

The prompt bar has been replaced by a full `ChatPanel` component — the primary interface of the homepage. Rules:
- `src/components/ui/ChatPanel.tsx` — `variant?: 'embedded' | 'overlay'` (default **`embedded`**). Homepage uses embedded; **`ChatOverlay`** passes **`variant="overlay"`**.
- **Chrome (Session 69, **Session 79**, **Session 81**):** **Embedded** — first two **gray** dots `rgba(255,255,255,0.15)` `10px` (non-interactive); **third gray dot** is a `<button type="button">` — **`useChatMessages().resetConversation()`** (or **`useChatContext()`**), `title` / `aria-label` "New conversation"; **`id="chat-panel"`** on root. **Overlay** — red closes via **`useChatUI().close()`**; **green** — **`resetConversation()`**; **red / yellow / green** hover glyphs (**`×` `−` `+`**) all **`pointerEvents: 'none'`** on inner **`<span>`**s (**Session 81**); **no** `id` on root.
- **Session 79 — `ChatContext.tsx`:** Exports **`Message`**, **`ChatCard`**, **`INITIAL_MESSAGE`**, **`cloneGreetingMessage()`**. **`ChatProvider`** state: **`messages`**, **`setMessages`**, **`isLoading`**, **`setIsLoading`**, **`streamingGreetingContent`**, plus existing **`isOpen` / `open` / `close` / `toggle`**. **`ChatPanel`** must not keep **`messages`** or **`isLoading`** in component state. Greeting sequence (thinking → stream → commit) runs **once** inside **`ChatProvider`** when **`messages.length === 0`** so embedded + overlay never double-schedule timers. **`resetConversation()`** replaces thread with **`cloneGreetingMessage()`** and clears the greeting stream buffer. No **localStorage** — refresh resets the thread.
- **Session 87 — Context split:** **`ChatUIContext`** / **`useChatUI()`** — **`isOpen`**, **`open`**, **`close`**, **`toggle`**, **`isLimitReached`**, **`messageCount`**, **`incrementMessageCount`**. **`ChatMessagesContext`** / **`useChatMessages()`** — **`messages`**, **`setMessages`**, **`isLoading`**, **`setIsLoading`**, **`streamingGreetingContent`**, **`resetConversation`**. **`Nav`** and **`ChatOverlay`** use **`useChatUI()`** so streaming does not re-render the full tree. **`useChatContext()`** / **`useChat()`** merge both APIs.
- **Session 80 — Session message cap (`ChatContext.tsx` + `ChatPanel.tsx`):** **`messageCount`** + **`incrementMessageCount()`** + **`isLimitReached`**; **`MESSAGE_LIMIT` = 30** user sends per browser session (chips and typed sends both increment). **Not** cleared by **`resetConversation()`** — only a full page refresh resets the count. When **`isLimitReached`**, **`handleSend`** returns early; the **entire** chips + input footer is replaced by a short mono note to refresh (no disabled input left visible). **`429`** from **`POST /api/chat`**: streaming assistant row is filled with a human-readable cooldown message (**not** a separate error UI); **`finally`** still clears **`isResponseLoading`**.
- Panel dimensions (**Session 75**): desktop **`width`** = **`desktopNavWidthPx`** from **`NavWidthContext`** (nav pill measured in **`NavWrapper`** via **`ResizeObserver`** on the shrink-wrap div — **Session 91:** observer skips updates while **`document.documentElement.dataset.transitioning`** is set; fallback **`DEFAULT_DESKTOP_NAV_WIDTH_PX` = 560** in `NavWidthContext.tsx`). `maxWidth: 100%`. `height: 75vh`, `maxHeight: 80vh`; mobile `width: calc(100vw - 32px)`, **`height` and `maxHeight: calc(100dvh - 140px)`** — **`dvh` not `vh`** on mobile (Session 68). Outer panel `display: flex; flexDirection: column; minHeight: 0` so the messages region scrolls.
- Inner column wrapper (Session 70): `flex: 1`, `minHeight: 0`, `height/maxHeight: 100%`, `overflow: hidden` — fills the outer panel so header / messages / input distribute correctly on mobile.
- Messages column: `flex: 1`, `minHeight: 0`, `overflowY: auto` — **`overscrollBehavior: 'contain'`** (no scroll chaining to page), **`WebkitOverflowScrolling: 'touch'`** (iOS momentum). Chips + input `flexShrink: 0`; input stack **`paddingBottom: calc(12px + env(safe-area-inset-bottom, 0px))`** on mobile.
- **iOS input (Session 70):** `fontSize: '16px'` on mobile (**mandatory** — below 16px triggers auto-zoom); `'13px'` desktop. `fontFamily: 'var(--font-mono)'`, `fontWeight: 300`. **`onFocus`:** mobile → `setTimeout(scrollToBottom, 300)` after keyboard. Sentinel at thread end: `<div ref={messagesEndRef} style={{ height: 1 }} />`. **`touchAction: 'manipulation'`** on mobile for chips, text input, send button, overlay red close.
- **Root `viewport` export (Session 70):** `src/app/layout.tsx` — `maximumScale: 1`, `userScalable: false` with `device-width` / `initialScale: 1` (Next.js `export const viewport`).
- Glass treatment uses **inline styles only** (not Tailwind backdrop-blur classes):
  - Outer panel: `backgroundColor: rgba(22,26,34,0.92)`, `backdropFilter: blur(5px)`, `WebkitBackdropFilter: blur(5px)`, `boxShadow: 0 8px 32px rgba(0,0,0,0.3)`, `border: 1px solid rgba(255,255,255,0.06)`
  - Header / input bar: `backgroundColor: rgba(14,16,21,0.8)`, `borderBottom/Top: 1px solid rgba(255,255,255,0.06)`
  - User message bubble: `rgba(255,255,255,0.08)` bg, `rgba(255,255,255,0.1)` border, `borderRadius: 16px 16px 4px 16px`
  - Suggestion chips: `rgba(255,255,255,0.04)` bg, `rgba(255,255,255,0.12)` border, `borderRadius: 20px`
- **`ChatOverlay` (Session 69, **Session 71**, **Session 75**):** `motion.div` + **`useAnimation()`** — panel enters from **`y: '-100vh'`**, exits to **`y: '100vh'`**, then resets to **`'-100vh'`**; `duration: 0.45`, same ease as page transitions. Outer dialog visibility delay **`0.45s`** on close. **Session 71:** root **no `py-20`** / no desktop horizontal padding. **Session 75:** desktop wrapper width matches **`NavWidthContext`** (same as embedded **`ChatPanel`**); mobile **`calc(100vw - 32px)`**.
- Mobile send control: `44×44` min touch target (Session 68).
- AI avatar: logo image in a small circle (`/logo-update.svg`)
- Input bar: `>` prompt prefix in `#00ff9f` (terminal green), free-form input, up-arrow send button
- ID generation: use `useRef` counter (not `Date.now()`) — react-hooks/purity rule is strict

### Animated greeting stream on load (Session 11–13, updated Session 33, **Session 72**)

Three-phase load sequence on every **full page load** (or whenever **`messages`** is empty — **Session 79:** timers owned by **`ChatProvider`**, not per **`ChatPanel`**):
1. **Thinking** (1500ms) — `AssistantAvatar thinking={true}` (SwirlDotGrid animates inside the circle) + `<ThinkingText />` inline to the right, vertically centered. `isLoading: true`. Each character of "thinking..." has a staggered shimmer via `thinking-shimmer` CSS keyframe.
2. **Streaming** — `isLoading` flips false; avatar crossfades to icon (`opacity 0.4s ease`); **`INITIAL_MESSAGE.content`** streams character by character at **`STREAM_SPEED = 28`** ms/char (constant in **`ChatContext.tsx`**); a `2px × 13px` `#00ff9f` cursor blinks at `0.8s step-end`. Buffer: **`streamingGreetingContent`** in context.
3. **Complete** — 300ms after last character: **`streamingGreetingContent`** clears, **`cloneGreetingMessage()`** (greeting + starter `cards` for `work` and `about`) lands in **`messages`** — **Session 78:** never `setMessages([INITIAL_MESSAGE])` (avoids shared reference with module constant). **Session 75** greeting: `Hi! I'm Joe, a design engineer by trade and a creative cosmonaut by nature. What would you like to explore?` (no em dash).

State shape:
- `isLoading` — from **`ChatContext`** — initial greeting thinking phase (starts `true` while `messages.length === 0`, becomes `false` after 1500ms)
- `streamingGreetingContent` — from **`ChatContext`** — string built during greeting phase 2
- `isResponseLoading` — **local `ChatPanel` state** — `true` while `/api/chat` fetch is in progress; disables send + chips; distinct from `isLoading`

### Anthropic chat API (**Session 72**, **Session 75**, **Session 77**, **Session 80**, **Session 85**, **Session 86**)

- **Route:** `src/app/api/chat/route.ts` — `export const runtime = 'edge'`, `POST`, body `{ messages: { role, content }[] }`.
- **Session 80 — IP rate limit:** Module-scope **`Map`** (`rateLimitStore`) — key IP string, value **`{ count, windowStart }`**; **`RATE_LIMIT_MAX` = 50**, **`RATE_LIMIT_WINDOW` = 3600000** ms. **`checkRateLimit(ip)`** runs at the start of **`POST`** (IP from **`x-forwarded-for`** first hop or **`x-real-ip`**, else **`'unknown'`**). Over limit → **`429`**, **`Content-Type: application/json`**, body **`{ error: 'Rate limit exceeded. Try again later.' }`**. Store resets on edge cold start.
- **Env:** `ANTHROPIC_API_KEY` (500 if missing). Add to `.env.local` and Vercel project env.
- **Client payload:** Exclude `id === 'greeting'` and assistant rows with empty `content` so the **first message is always `user`** (Anthropic API rule).
- **Model / limits:** `claude-sonnet-4-20250514`, **`max_tokens: 250`** (**Session 86**; 150 was too tight for cards JSON) — **do not exceed** without explicit instruction; brevity still enforced by **`RULES`**, not by starving the output budget. **`SYSTEM_PROMPT`** must start with the **`RULES`** block (length + no **`—`**), then persona and reference content; **`How to answer`** reinforces the em-dash rule in prose.
- **Stream shape:** Anthropic SSE body is piped through a **`TransformStream`** that buffers incomplete lines, forwards **`content_block_delta` / `text_delta`** immediately as NDJSON `{ type: 'text', text }` per token. Cards: on **`message_stop`** and again in **`flush`** via **`trySendCards`** (deduped with `cardsSent`) so trailing `{"cards":[...]}` still emits after the stream. Response headers **`Cache-Control: no-cache, no-transform`** and **`X-Accel-Buffering: no`** (**Session 77**) reduce proxy buffering (e.g. Vercel/Nginx).
- **Client (`ChatPanel`):** For each parsed NDJSON line in the read loop, **`setMessages`** updates the streaming assistant row immediately (**Session 77** — no debounce). **`{ type: 'cards' }`** lines update **only** the current assistant row’s **`cards`** in state (**Session 78**); stream end sets **`isStreaming: false`** without replacing **`cards`**. No global cards state; new assistants start with **`cards: undefined`**. Strips displayed card JSON via `CARDS_STRIP_REGEX`; failures → `Something went wrong. Try again.` (**Session 78:** error row sets **`cards: undefined`**). **Session 80:** if **`response.status === 429`**, set the current assistant bubble text to the hourly cooldown copy and **`isStreaming: false`** before returning (no NDJSON read).
- **Input gating:** Send, chips, and `handleSend` no-op while `messages.length === 0` so the three-phase greeting is not interrupted and the first API turn always includes thread context after `INITIAL_MESSAGE` exists.
- **Session 75 — System prompt:** First person throughout. Opening: "You are Joe Siconolfi... Speak in first person as Joe". Sections **Who I am**, **My approach**, **My philosophy**, **My technical approach and hands-on model work**, **My career**, **My projects**, **My beliefs**; **How to answer** ends with first-person instructions. Card rules in prompt use **your** for background / thinking / work.
- **Session 96 / Session 97 — Card keys (`route.ts`):** **`SYSTEM_PROMPT`** includes a **`CRITICAL CARD RULE`** block immediately **before** "Surfacing contextual cards" (waypoint vs waypoint-sync disambiguation). Surfacing bullets: design system / components / Sherpa → **`waypoint`** + **`sherpa`**; token sync / Figma-to-code / waypoint-sync / token pipelines → **`waypoint-sync` only**, never **`waypoint`**. **`CARD_META`** includes **`waypoint-sync`** with **`href: '/work/waypoint-sync'`**. Parsed trailing **`{"cards":[...]}`** is validated with **exact** key membership: **`.filter((c) => c in CARD_META)`** (not substring match).
- **Session 74 — Contextual card hover (`ChatPanel.tsx`):** Border and background stay fixed; only `.card-title` and `.card-arrow` colors change via `onMouseEnter` / `onMouseLeave` (`querySelector`), aligned with **Chat with me** (text highlight, not surface highlight).
- **Session 76 — Contextual cards:** Not `<a href>`. **`useRouter` from `next/navigation`**: internal paths → **`router.push(card.href)`** (preserves **`PageTransitionWrapper` / AnimatePresence**); **`mailto:`** or href ending **`.pdf`** → **`window.open(href, '_blank')`**. **`role="button"`**, **`tabIndex={0}`**, **`Enter`** on `onKeyDown`. Compact single-line rows (label + arrow only); no description in UI; padding `8px 12px`; stack `gap: 6`, `marginTop: 10`; title rest `rgba(255,255,255,0.7)` fontWeight 300.

Color rules:
- `#00ff9f` (`accent.terminal`) appears on: blinking cursor, `>` prompt prefix, chip hover states, contextual card title + arrow on hover (**Session 74:** text-only hover, same idea as **Chat with me** — no card border or background change; static `rgba(255,255,255,0.08)` border, `rgba(255,255,255,0.03)` bg; arrow at rest `rgba(0,255,159,0.5)`, both title and arrow `#00ff9f` on hover; **Session 76:** no description line on cards)
- Do not use `accent.warm` for interactive terminal states — that color is for nav/link hovers only

### AssistantAvatar (Session 13)

`AssistantAvatar` accepts a `thinking` prop and crossfades between two layers inside the same `w-9 h-9` circle:
- `thinking={true}`: SwirlDotGrid (`4×4`, `dotSize={3}`, `gap={2}`, `speed={0.055}`) fades in; avatar icon fades out
- `thinking={false}`: avatar icon fades in; SwirlDotGrid fades out
- Both layers use `opacity` + `transition: opacity 0.4s ease` — CSS only, no Framer Motion
- Circle is `overflow-hidden` — the grid is clipped by the circle boundary, no explicit sizing needed
- Circle size is fixed at `w-9 h-9` (36×36px) — never resize it
- The avatar icon itself (`/logo-update.svg`, `18×18`) is unchanged

### Suggestion chips — persistent bar only (Session 12, **Session 72**, **Session 76**)

Chips appear exclusively in the persistent bar directly above the input field. They do NOT appear inline inside message bubbles.
- `Message` has no `chips` field — chips are not message-level data. Optional **`cards`** on assistant messages are for AI-surfaced links only (**Session 72**).
- **Session 76:** The chip bar is **always rendered** (no `showChips` / no hide after first user message). Container `padding: '10px 16px 0'`, `gap: 8`, `flexWrap`. **`ChatOverlay`** only mounts **`ChatPanel variant="overlay"`** — chips behavior is identical. Chips stay disabled until `INITIAL_MESSAGE` is committed (`messages.length > 0`) and while `isResponseLoading` / initial `isLoading` (unchanged gating). **Session 80 exception:** when **`isLimitReached`**, chips + input are **not** rendered — replaced by the session-limit copy block.
- Do not put suggestion chips inside assistant bubbles — contextual **cards** are separate (compact single-line rows below finished assistant text).

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

## Floating project cards (Sessions 14–23 — **Session 94** ambient drift + hover)

Ten project cards float around the chat panel with slow sine-wave drift (low-gravity feel), and dock to staging zones when the AI references a project or a card is clicked.

**Files:**
- `src/content/projects.ts` — `Project` interface + `PROJECTS` array (10 entries)
- `src/lib/orbitalStaging.ts` — **`ORBIT_STAGING_EVENT`**, **`CHAT_RESPONSE_COMPLETE_EVENT`** (`portfolio:chat-response-complete`), **`OrbitStagingDetail`** (**Session 93**)
- `src/components/ui/OrbitalCard.tsx` — floating card with drift animation + staging lerp; **`forwardRef`** + **`tick(now)`** + **`getVideoElement()`** via **`useImperativeHandle`** (**Session 87**, **Session 90**). Position: **`transform: translate(x - 110, y - 80)`** from fixed `0,0` (**Session 90**). Listens to **`portfolio:orbit-staging`** for dock and **`portfolio:chat-response-complete`** for release delay (**Session 93**).
- `src/components/ui/OrbitalSystem.tsx` — mounts 10 cards, computes home positions + **Session 93** dock targets (measured panel + **`DOCK_GAP = CARD_W / 2`**, same-side vertical stagger); **`z-10`**; **one `requestAnimationFrame` loop** invokes each card's **`tick`** only when **`pathname === '/'`** (**Session 87**, **Session 90**). Listens to **`portfolio:project-active`**, batches, emits **`portfolio:orbit-staging`** (**Session 93**). **`activeVideoRef`** + **`onVideoHover` / `onVideoLeave`** — one orbital MP4 at a time (**Session 90**).

Z-index stack: Swirl `z-0` → OrbitalSystem `z-10` → PageTransitionWrapper `z-10/z-20` → NavWrapper `z-40` → TabBar `z-50` → ChatOverlay `z-50`

**Project interface (Session 20, updated Session 34):** `id`, `name`, `role`, `keywords` (required) + optional `image?: string` (static thumbnail path in `/public/projects/`) + optional `video?: string` (mp4 path — lazy video, plays on hover/active) + optional `url?: string` (case study URL). All 10 projects now have `url` set to `/work/[slug]` as of Session 34. Three projects have `video` set: `waypoint`, `channel`, `seudo`.

**Card visual (Session 20, updated Session 25):** terminal window — traffic lights `#ff5f57`/`#febc2e`/`#28c840`, dark chrome header (`rgba(14,16,21,0.9)`), `[id].exe` title, 120px image area (placeholder grid when no asset), one line of copy (`project.role`), footer label. Idle `opacity: 0.6`, hovered `opacity: 0.85`, active `opacity: 1`. Static `#00ff9f` beacon on active.

**Hover state (Session 25, **Session 73** CSS, **Session 94**):** Border, shadow, role tint, and footer label swap are driven by **`globals.css`** — **no hover `scale`** (**Session 94** — removed `scale(1.02)` to avoid backdrop blur repaint jank with video). **`will-change: transform`** on **`.orbital-card-panel`**. **no `hovered` `useState`**, so sweeping the cursor across cards does not re-render each `OrbitalCard`. **`opacity: 0.85`** and **`zIndex: 12`** on the outer wrapper remain **imperative** in pointer enter/leave (and activation). Active (`.orbital-card-panel--active` / `.orbital-card-root--active`) suppresses idle hover border via `:not(.orbital-card-panel--active)`.

**Performance — Session 30 + Session 73 + Session 87 + Session 90:**
- **Session 87 — Single RAF:** `OrbitalSystem` runs **one** `requestAnimationFrame` loop; each card exposes **`tick(now)`** — **no** per-card RAF schedulers. Physics unchanged.
- **Session 90 — RAF on `/` only:** `usePathname()` + `isHome`; loop **does not schedule** off the homepage (cards hold last `transform` until return).
- **Session 90 — `transform` positioning:** `cardRef.current.style.transform = translate(x - 110px, y - 80px)` with **`left: 0` / `top: 0` / `position: fixed`** — no per-frame `left`/`top` updates. **`willChange: 'transform'`** on outer wrapper.
- **Position updates are direct DOM** — `setDisplayPos` eliminated; no React reconciliation per frame.
- **Opacity + zIndex are imperative** on pointer enter/leave and activation — set directly on `cardRef`. **`hoveredRef`** tracks hover **without** React state for the deactivation timer.
- **Session 90 — Video:** `OrbitalSystem` **`activeVideoRef`** + **`handleOrbitalVideoHover` / `handleOrbitalVideoLeave`**; **`getVideoElement()`** on **`OrbitalCardHandle`**. Orbital `<video>` uses **`preload="metadata"`** for first-frame thumbnail at rest.
- **Session 92 — Orbital panels:** **`backdropFilter` / `WebkitBackdropFilter`: `blur(5px)`** + **`backgroundColor: rgba(22,26,34,0.92)`** on **`absolute` / `inset: 0` / `zIndex: 0`** (**`pointer-events: none`**). **`opacity`** idle/hover/active on **`opacityLayerRef`** (**`relative` / `zIndex: 1`**) — **not** on **`cardRef`** (ancestor **`opacity`** breaks **`backdrop-filter`**). **`cardRef`**: **`transform`** + **`zIndex`** only. Beacon + **`.orbital-card-panel`** (**`transparent`**). Nav, chat, sticky chrome blurs unchanged.
- **Session 95 — No pairwise collision:** **`OrbitalCard`** no longer reads neighbor positions or applies repulsion; **`positionsRef`** lives only in **`OrbitalSystem`** for **Session 93** left/right staging.
- `activeRef.current` is set directly in the signal handler (not via `useEffect` watching `active` state). The sync `useEffect` was removed.

**Click handling (Session 25):** `handleClick` uses `useRouter` from `next/navigation`. If `project.url` exists: internal paths → `router.push()`, external URLs (start with `http`) → `window.open(..., '_blank', 'noopener noreferrer')`. If no URL: fires `portfolio:query` CustomEvent (chat fallback — every card is always interactive).

**Card footer (Session 25):** small label below `project.role`. No URL: `case study coming soon` at rest → `ask me about this →` on hover. With URL: `view case study →` in `#00ff9f` on hover, dim at rest. Font: 9px mono, uppercase, `0.08em` tracking.

**Media rendering (Session 23, updated Session 27, **Session 74** orbital preload):** `project.image` → raw `<img>` when not `.mp4`. MP4-backed cards use `<video preload="metadata">` + `onLoadedMetadata` → `currentTime = 0` for at-rest poster; **`play()`** only on hover/chat activation; pause/reset on leave. **`preload="none"`** on orbital videos was reverted — it broke visible thumbnails. Image and video fields per `projects.ts`. `onError` on `<img>` → placeholder grid. Raw `<img>` intentional — `eslint-disable` comment.

**Position system (Session 22 — replaces elliptical orbital math):**
- `HOME_POSITIONS` array — 10 fixed positions as `{ xPct, yPct }` viewport fractions. Converted to px as `xPct * viewport.w` / `yPct * viewport.h`. Layout: 3 left, 3 right, 2 top, 2 bottom — none overlap the chat panel.
- `DRIFT_CONFIGS` array — per-card `{ xAmp, yAmp, xSpeed, ySpeed, phase }`. Drift: `sin(elapsed * xSpeed + phase) * xAmp` on X, `cos(elapsed * ySpeed + phase * 1.3) * yAmp` on Y. **Session 94:** amplitudes **8–14px**, speeds **~0.0003**, **`phase = index * (2π/10)`** — slow, independent float.
- No elliptical math, no radius calculations, no convergence problems.

**Viewport clamping (Session 23 — OrbitalSystem; **Session 97** — OrbitalCard):**
- `clampHome(xPct, yPct, vw, vh)` — clamps each home position so the card's full 220×160 footprint stays within the viewport. **Session 97:** **`HOME_MARGIN` = 16px** (aligned with per-frame clamp). Applied on mount and resize.
- **Session 97 — `OrbitalCard` `tick`:** After physics, **hard clamp** on **card center** `posRef` with **16px** inset (`min/max` derived from **center** coordinates and **110/80** half-extents). **Zero velocity** on an axis when that axis hits a bound. Not a force — no edge bounce.
- Cards near viewport edges (top/bottom strips at 6%/92% yPct, left/right columns at 6–10%/86–90% xPct) are nudged inward so they're always fully visible.

**Velocity + damping physics (Session 32 — replaces all prior stateless position models; **Session 94** idle tuning; **Session 95** no collision):**
- `posRef` and `velRef` — `useRef({ x: 0, y: 0 })`. Persist between frames, never trigger renders. `lerpRef` removed.
- **Spring** (**Session 94:** `SPRING = 0.004`): `vx += (targetX - x) * SPRING` — very soft follow toward drift target (idle only).
- **Damping** (**Session 94:** `DAMPING = 0.96`): velocity decays slowly — weightless, long-settle motion.
- **Session 95:** Pairwise collision repulsion (**`MIN_DIST`**, **`REPULSE`**, staggered **`frameCountRef`**) removed — no longer fights the soft spring.
- **Session 96:** Per-frame **edge repulsion removed** from **`OrbitalCard`** (`EDGE_MARGIN` / `EDGE_FORCE` velocity nudges) — caused edge oscillation with Session 94 slow spring. Do not reintroduce edge velocity forces without an explicit session.
- **Session 97:** **Hard position clamp** every frame after physics — **16px** margin, **center-based** bounds, **zero velocity** on boundary hit. Replaces incorrect **`HARD_MARGIN`** clamp that treated **center** like **top-left**.
- **Staging**: lerp at `0.06` directly to slot. Velocity bled at `0.85x` per frame.
- **Session 94** superseded the Session 32 spring/damping guardrails for idle drift — current values **`0.004` / `0.96`** in **`OrbitalCard`**. Do NOT reintroduce `px = homeX + driftX` as the base position each frame.

**Activation — two triggers:**
1. Chat keyword match → **`portfolio:project-active`** (**ChatPanel**) → **`OrbitalSystem`** batches (**`queueMicrotask`**) → **`portfolio:orbit-staging`** `{ projectId, centerX, centerY }` → **`OrbitalCard`** activates (**Session 93**)
2. Card click → `portfolio:query` CustomEvent `{ query: 'tell me about [name]' }` → ChatPanel auto-submits
- Side picked by **card center x** (`positionsRef` vs viewport center; home fallback if still **`0,0`**) — **Session 93** (replaces `homeX`-only)
- Staging lerp at **`0.06`/frame** toward **`chosenSlotRef`** (center coords) — destination math fixed **Session 93**; lerp factor unchanged
- After assistant streaming ends, **`ChatPanel`** fires **`portfolio:chat-response-complete`**; **`POST_STREAM_RELEASE_MS`** (2000ms) later → `active` false, `chosenSlotRef` cleared → card returns to drift
- Active: border `rgba(0,255,159,0.3)`, static `#00ff9f` beacon

**Staging targets (Session 93):** Physics **`posRef`** = **card center**; **`DOCK_GAP` = `CARD_W / 2` (110)** — half card-width from panel edge; left/right dock **center x** from **`#chat-panel`** **`getBoundingClientRect()`**: `rect.left - DOCK_GAP - CARD_W/2` / `rect.right + DOCK_GAP + CARD_W/2`; **`dockCY = window.innerHeight / 2`**. Multiple activations on one side: **`centerY = dockCY + (i - (n-1)/2) * (CARD_H + 16)`**. `id="chat-panel"` on `ChatPanel` root div.

**OrbitalCard props (Session 23 additions; Session 90; **Session 95**):** `cardIndex: number`, `onPositionUpdate: (index, x, y) => void`, **`onVideoHover`** / **`onVideoLeave`**. **`positionsRef`** was removed from **`OrbitalCard`** (**Session 95** — only **`OrbitalSystem`** keeps it for staging). No **`leftSlot` / `rightSlot`** — staging from **`portfolio:orbit-staging`** (**Session 93**). `CARD_W` / `CARD_H` (220 / 160) and half-sizes for `translate` live in **`OrbitalCard.tsx`** (must match **`OrbitalSystem`** footprint constants).

**Project shuffle (Session 24):** `shuffleArray<T>()` (Fisher-Yates, module scope) shuffles `PROJECTS` once via `useMemo(() => shuffleArray(PROJECTS), [])` inside `OrbitalSystem`. The render iterates `shuffledProjects` — different order on every page load, stable for the session. `PROJECTS` in `projects.ts` is never mutated. Do not replace `useMemo` with `useState` or `useEffect` — that would cause a flash of unshuffled content.

**Do NOT reintroduce elliptical orbital math.** Home positions are fixed viewport percentages.
**Do NOT change** staging lerp factor **`0.06`**, traffic light colors, or orbital chrome layout. (**Session 92:** orbital glass on **`absolute` inset-0 layer** under **`zIndex: 1`** content. **Session 94:** no hover **scale** on the panel.)
**Do NOT reintroduce** orbital pairwise collision physics (**Session 95** removed) or per-frame edge velocity repulsion (**Session 96** removed).

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
- `src/context/NavWidthContext.tsx` (**Session 75**) — `NavWidthProvider`, `useNavWidthContext()`; `desktopNavWidthPx` + `setDesktopNavWidthPx` for desktop chat width = measured nav pill.
- `src/components/layout/TabBar.tsx` — renders tab strip. Exports `TAB_BAR_HEIGHT = 38`.
- `src/components/layout/NavWrapper.tsx` — wraps `Nav`, shifts `top` by `TAB_BAR_HEIGHT` on `/work/*`; **Session 75:** `ResizeObserver` on shrink-wrap div (desktop) updates nav width for chat.

**Tab context rules:**
- `openTab` max 10 tabs (`tabs.length >= 10` guard). If tab already exists, no-op.
- `closeTab` uses `historyRef` (LRU order) to find the most recently active remaining tab. Last tab closed → `router.push('/work')`, state cleared.
- Tab state is in-memory context only — never URL params, never localStorage.

**TabBar layout (Session 43, Session 67 mobile, **Session 81**):**
- `hoveredTab: string | null` — tracks which tab body is hovered (bg tint + close button reveal)
- `hoveredClose: string | null` — tracks which right-hand close button is hovered (circle bg + color)
- Tab inner order: `[traffic lights — active only, desktop only] [label flex:1] [× close button]`
- **Session 81:** Traffic lights (`#ff5f57`/`#febc2e`/`#28c840`, **12px** buttons) on active tab **when not mobile** — **red `<button>` calls `closeTab(slug)`** (macOS-style); yellow/green **`stopPropagation` only** (decorative). Hover **`×` / `−` / `+`** render inside **`<span style={{ pointerEvents: 'none' }}>`** so the parent button keeps stable hit testing (no flicker). **`TabActiveTrafficLights`** child holds red/yellow/green hover state (resets on unmount when active tab changes).
- **Session 67:** `useIsMobile()` — per-tab `maxWidth: 120` mobile / `200` desktop; row padding `0 6px 0 8px` mobile; close `minWidth`/`minHeight: 44` mobile; `touchAction: 'manipulation'` on tab row + close; close `type="button"`.
- Right `×` button: 16px circle, always mounted. `opacity: 1` when active or tab is hovered; `opacity: 0` at rest on inactive tabs. `e.stopPropagation()` on click + mouseenter/mouseleave. Glyph wrapped in **`pointerEvents: 'none'`** span. Circle bg `rgba(255,255,255,0.12)` on hover.
- Inactive tab on hover: `rgba(255,255,255,0.03)` bg, label brightens to `rgba(255,255,255,0.55)`

**TabBar constants:**
- `TAB_BAR_HEIGHT = 38` — used in TabBar, NavWrapper, PageTransitionWrapper. Do NOT change this value without updating all three.
- Tab `z-index: 50` — same level as ChatOverlay but renders behind it (ChatOverlay is rendered after in DOM order).
- Background: `rgba(10,12,16,0.98)` — slightly darker than panel overlays.

**NavWrapper (Session 66, Session 67):** `useIsMobile()` — inner wrapper `width: '100%'` on mobile. **Session 67:** outer fixed padding `isMobile ? '12px 16px' : '12px 24px'`.

**Nav changes (Session 39, updated Session 44):**
- `Nav.tsx` no longer has `fixed` positioning — `NavWrapper` owns all positioning.
- `NavWrapper` wraps Nav in a `position: fixed` div, shifting `top` by `TAB_BAR_HEIGHT` on all `/work` pages.
- **Session 42:** Transition updated from `'top 0.3s ease'` to `'top 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)'` — matches the ease-out-quart used in page transitions. Nav slides smoothly rather than snapping.
- **Session 91:** Append **`0.15s`** transition-delay — full string **`top 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s`** — staggers nav `top` animation vs **`PageTransitionWrapper`** (exactly **150ms**, do not change without explicit instruction). **`ResizeObserver`** skips **`setDesktopNavWidthPx`** while **`dataset.transitioning`** is set.
- **Session 44:** `hasChrome = pathname.startsWith('/work') || pathname === '/about'` — `/about` also has a sticky terminal chrome header so the nav must shift down there too.
- **Session 49:** `hasChrome` updated to also include `pathname === '/timeline'` — `/timeline` has its own sticky terminal chrome, nav shifts down there too.
- **Session 60:** `hasChrome` updated to also include `pathname === '/lab'` — `/lab` has its own sticky terminal chrome, nav shifts down there too.
- **Session 46:** `top` is now driven by `useState(0)` + `useEffect`. The nav always mounts at `top: 0` and animates to `TAB_BAR_HEIGHT` after a 60ms delay. Without this, `pathname`-derived `top` renders synchronously on mount so the CSS transition has no prior value to animate from. `useState(0)` initial value is intentional — do NOT initialize to `hasChrome ? TAB_BAR_HEIGHT : 0`. The `setTimeout` delay must stay in the 50–100ms range.

**Do NOT:**
- Store tab state in localStorage or URL params
- Render TabBar on non-`/work/*` routes
- Change `TAB_BAR_HEIGHT` without updating all three consumers

Z-index stack (Session 39): Swirl `z-0` → OrbitalSystem `z-10` → PageTransitionWrapper `z-10/z-20` → NavWrapper `z-40` → TabBar `z-50` → ChatOverlay `z-50`

## Page layout (Session 7 — updated Session 39)

Homepage is a fixed overlay composition — no scrollable hero section.

**Root layout (`src/app/layout.tsx`) — updated Session 39, **Session 75**:**
- `Swirl`, `OrbitalSystem`, `TabBar`, `ChatProvider`, **`NavWidthProvider`**, `NavWrapper`, `PageTransitionWrapper`, and `ChatOverlay` all live here — persistent across all navigation
- `TabProvider` wraps everything (outermost)
- `Swirl`: `fixed inset-0 z-0`
- `OrbitalSystem`: `fixed inset-0 z-10 pointer-events-none overflow-hidden`
- `TabBar`: `fixed top-0 z-50` — visible only on `/work/*`
- **`NavWidthProvider` (**Session 75**):** wraps `NavWrapper` + `PageTransitionWrapper` + `ChatOverlay` inside **`ChatProvider`** — desktop chat width tracks measured nav pill (`src/context/NavWidthContext.tsx`).
- `NavWrapper`: `fixed z-40` — shifts `top` by `TAB_BAR_HEIGHT` on work pages; inside `NavWidthProvider`
- `PageTransitionWrapper`: wraps `{children}` — `top: TAB_BAR_HEIGHT` on work pages, `top: 0` on homepage
- `ChatOverlay`: inside `NavWidthProvider`, `z-50`

**Homepage (`src/app/page.tsx`) — updated Session 35, Session 66, Session 68:**
- Only contains ChatPanel wrapper + name block — NO Swirl, OrbitalSystem, or Nav (those moved to layout)
- `'use client'` + `useIsMobile()` (Session 66)
- ChatPanel wrapper: `z-20` `pointer-events-none`; desktop `top: 0; inset` horizontal + bottom `0`, `flex` center; **mobile Session 68:** `top: 80px`, `left/right/bottom: 0`, `padding: 16px`, `alignItems: flex-start`
- Embedded `ChatPanel` root has `id="chat-panel"` and `pointer-events-auto` (overlay instance omits `id` — Session 69); desktop width from **`NavWidthContext`** (**Session 75**), mobile `calc(100vw - 32px)` (see ChatPanel)
- Name block: desktop `bottom: 32px` `left: 32px`; mobile `bottom: 100px` `left: 16px` — `z-10` `pointer-events-none`

**PageTransitionWrapper (`src/components/layout/PageTransitionWrapper.tsx`, Session 35, rewritten Session 47, **Session 91**):**
- `AnimatePresence mode="wait" initial={false}` — exits before enters; no animation on first load
- `key={pathname}` on `motion.div` — triggers transition on route change
- `data-scroll-container` on motion.div — `useEffect` resets `scrollTop = 0` on pathname change only (**Session 87:** `[pathname]` dependency — not on every chat token)
- **Session 91:** **`onAnimationStart`** sets **`document.documentElement.dataset.transitioning = 'true'`**; **`onAnimationComplete`** deletes it only when **`useIsPresent()`** is true (enter finished — not exit). **`motion.div`** **`willChange: 'transform, opacity'`**, **`contain: 'layout style'`**; inner **`div`** around **`{children}`** has **`contain: 'layout'`**.
- `isDeepPage(pathname)` helper: `pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline' || pathname === '/lab'` — single source of truth for page tier
- Deep pages (`/work`, `/work/*`, `/about`): `zIndex: 20`, dark bg `rgba(14,16,21,0.97)`, `pointerEvents: 'auto'`, `overflowY: 'auto'`, `top: 0`
- Homepage: `zIndex: 10`, transparent bg, `pointerEvents: 'none'`, `overflowY: 'hidden'`, `top: 0`
- Transition: `duration: 0.45`, `ease: [0.25, 0.46, 0.45, 0.94]` (ease-out-quart)
- Deep pages: enter from above (`y: '-100vh'`), exit downward (`y: '100vh'`)
- Homepage: enter from below (`y: '100vh'`), exit upward (`y: '-100vh'`)
- `top: 0` for all pages — `TAB_BAR_HEIGHT` offset removed from wrapper; content padding handles tab bar clearance
- `isCaseStudy`, `isWorkIndex`, `isAbout`, `isContentPage` variables removed — replaced by single `deep` boolean
- Do NOT reintroduce `top: TAB_BAR_HEIGHT` on the wrapper; do NOT split `isDeepPage` back into separate variables

**OrbitalSystem (updated Session 35, Session 66, **Session 87**, **Session 90**):**
- **Session 66:** `useIsMobile()` — returns `null` on viewports `< 768px` (after all hooks). No orbital UI on phone; Swirl unchanged.
- Uses `usePathname` — pathname is a dependency on the measure `useEffect`
- Runs immediate `measure()` + delayed `measure()` at 600ms on each pathname change
- Delayed measure ensures `chat-panel` element is found after the 450ms transition animation completes
- Cards stay rendered (behind opaque overlay) on case study pages — no visibility toggle needed
- **Session 87:** After mount, a **single** RAF loop drives all cards; `positionsRef` rows initialized with **`Array.from({ length: 10 }, () => ({ x: 0, y: 0 }))`** (distinct objects per card)
- **Session 90:** That RAF runs **only when `pathname === '/'`** — off homepage the loop does not schedule (no physics ticks per frame). **`activeVideoRef`** coordinates orbital MP4 playback.

## Mobile layout — Session 66

**Breakpoint:** `768px`. Shared hook `src/hooks/useIsMobile.ts` — `'use client'`, `useState(false)` + `useEffect` with `resize` listener; `isMobile === window.innerWidth < 768`. Use this hook (not ad-hoc media queries) for responsive behavior unless a static CSS approach is explicitly required.

- **OrbitalSystem:** `if (isMobile) return null` after all hooks — no cards on mobile; do not partially render. Swirl stays mounted in layout (`Swirl.tsx` unchanged).
- **Nav:** Desktop pill unchanged. Mobile: full-width bar (logo / hamburger / Chat); hamburger opens fixed overlay `z-index: 45` with large link labels; active route `#00ff9f`; Chat calls **`useChatUI().toggle()`** (**Session 87:** prefer **`useChatUI`** for open/close/toggle so streaming does not re-render Nav). **Session 98:** mobile **Chat with me** matches desktop (dark glass + white border + **`HiDotGrid`** 2.5/1.5), plus **`minHeight: 44`** and **`touchAction: 'manipulation'`**. **NavWrapper:** inner `width: 100%` when mobile.
- **ChatPanel:** Root `width` / `maxWidth` — mobile `calc(100vw - 32px)` / `100%`, desktop **`desktopNavWidthPx` + `px`** from **`NavWidthContext`** (**Session 75**). Mobile height **`calc(100dvh - 140px)`**; flex column + scrollable messages (Session 68). **Embedded** = gray chrome; **overlay** = colored chrome (Session 69).
- **Homepage `page.tsx`:** `'use client'` + `useIsMobile` — **Session 68 mobile:** wrapper `top: 80px`, `left/right/bottom: 0`, `padding: 16px`, `alignItems: flex-start`; desktop `top: 0`, centered. Name block `bottom: 100` / `left: 16` on mobile vs `32` desktop.
- **ChatOverlay (Session 71, **Session 75**):** Dialog root **no `py-20`**, **no horizontal padding on desktop**; mobile `paddingLeft`/`paddingRight` `16px` only. Inner **`motion.div`** width — mobile **`calc(100vw - 32px)`**; desktop same **`NavWidthContext`** pixel width as embedded chat — **no `max-w-2xl`**, matches homepage chat placement.

**Do not modify** `Swirl.tsx`, `SwirlDotGrid.tsx`, or `HiDotGrid.tsx` for mobile work.

**Session 68 — touch targets:** Mobile nav logo link, hamburger, and Chat pill use **minimum 44×44** hit areas where specified in `Nav.tsx`.

## Mobile content pages — Session 67

**Breakpoint:** `768px` via `useIsMobile()` (`src/hooks/useIsMobile.ts`). Applies to **About**, **Timeline**, **Lab**, **Work grid**, **CaseStudyView**, **TabBar**, **NavWrapper**.

**Shared rules:**
- **Padding pattern** (about / timeline / lab): `padding: isMobile ? '100px 20px 80px' : '120px 48px 160px'`.
- **Work grid** content: `isMobile ? '100px 20px 80px' : '100px 48px 120px'`.
- **Case study** content column (**Session 71**): `isMobile ? '20px 20px 80px' : '120px 24px 120px'`; `maxWidth: isMobile ? '100%' : 720`.
- **Touch targets:** interactive controls **`minHeight: 44`** (and width where needed) on mobile — iOS minimum.
- **`touchAction: 'manipulation'`** on buttons, links, tab rows, filter controls, and other tappable UI on these pages — prevents double-tap zoom.
- **`overflowX: 'hidden'`** on `<main>` where needed; **`wordBreak: 'break-word'`** on long copy — no horizontal scroll at **390px** width.
- **Typography:** mobile header **`h1` 22px** where specified (was 28px desktop); never increase sizes on mobile.

**Page sticky chrome (Session 71):** `AboutView`, `TimelineView`, `LabView`, `WorkGrid` sticky `*.exe` headers use **colored** traffic lights (`#ff5f57` / `#febc2e` / `#28c840`): red `<button type="button">` → `router.push('/')`, shows `×` on hover; yellow/green show `−` / `+` on hover only; **inner glyph spans use `pointerEvents: 'none'`** so the button receives clicks.

**Per-file highlights:**
- **AboutView:** Photo/bio stack vertical on mobile (`alignItems: flex-start` on the photo+bio row); photo **120×120** **left-aligned** on mobile (no centering margin on wrapper); **Session 98:** name / role / location block **`textAlign: 'left'`** on mobile (not centered). facts + connect (left) and Spotify + sports widgets (right) stack on mobile; facts label width **100** mobile; Spotify link **`maxWidth: '100%'`**; Spotify row touch + 44px height on mobile; **Session 83:** connect links horizontal row under facts (**no** `→` arrows), **`minHeight: 44`** + **`touchAction: 'manipulation'`** on mobile; right column widgets **`gap: 14`** (Spotify, Knicks, Mets).
- **TimelineView:** Resume download link **44px** min height + `touchAction`; **`EraBlock`** receives `isMobile` — summary **`wordBreak: 'break-word'`**; case study **`button`** `minHeight: 44`, `touchAction`, `type="button"`.
- **LabView:** Beliefs **single column** on mobile (`flex` / `gap: 8`); note **`marginTop: 4`** mobile; filter input **`maxWidth: '100%'`** mobile, **`fontSize: 16`** mobile (iOS); tag/clear/suggestion buttons **44px** + `touchAction`; experiment copy **`wordBreak`**.
- **WorkGrid:** Grid **`1fr`** mobile; header **22px**; card chrome row **`minHeight: 44`** mobile; whole card **`touchAction: 'manipulation'`**; **`role="button"`** + **`aria-label`** + keyboard **Enter/Space** for a11y.
- **CaseStudyView:** Hero + decision **mp4**: **`autoPlay={!isMobile}`**, **`preload="metadata"`** — no autoplay on mobile; next CTA **full width**, centered, **44px** min height, **`touchAction`**; shared **`bodyStyle`** includes **`wordBreak`**.
- **TabBar:** **`isActive && !isMobile`** for traffic lights; tab flex **`maxWidth: isMobile ? 120 : 200`**; row padding **`0 6px 0 8px`** mobile; close **`minWidth`/`minHeight: 44`** mobile; tab row + close **`touchAction: 'manipulation'`**.
- **NavWrapper:** Outer padding **`isMobile ? '12px 16px' : '12px 24px'`** (Session 67).

## Traffic lights — Session 68–69 ChatPanel split, **Session 71** page chrome + overlay, **Session 81** hit targets

**Global rule (Session 81):** Any **hover-revealed glyph** (`×`, `−`, `+`) inside a traffic-light **`<button>`** must sit in a **`<span style={{ pointerEvents: 'none' }}>`** (or equivalent). Otherwise the span captures the pointer, the button fires **`mouseLeave`**, the glyph unmounts, and hover **flickers** / **clicks fail**.

**Colored dots** (`#ff5f57`, `#febc2e`, `#28c840`) — use on **closeable / page-level** window chrome and any surface with a real dismiss:
- **Sticky page headers:** **`about.exe`**, **`timeline.exe`**, **`lab.exe`**, **`case-studies.exe`** — red **`<button type="button">`** → **`router.push('/')`**, hover **`×`**; yellow/green hover **`−`** / **`+`** only; glyph spans **`pointerEvents: 'none'`**.
- **`ChatPanel variant="overlay"`** — red closes via **`useChatUI().close()`** (or **`useChatContext().close()`**); red/yellow/green hover glyphs all **`pointerEvents: 'none'`** (**Session 81**).
- **Orbital project cards**, **`TabBar`** active tab (**desktop only**; lights hidden on mobile — Session 67) — **Session 81:** TabBar **red dot closes tab**; glyphs **`pointerEvents: 'none'`**.

**Gray dots** (`rgba(255,255,255,0.15)`) — **informational cards only** (clicking dots does nothing):
- **`ChatPanel variant="embedded"`** (homepage)
- **WorkGrid** grid **card** chrome rows, **Lab** experiment **card** chrome, **OrbitalCard**-style cards

**`/work/[slug]`:** No second sticky `*.exe` row in **`CaseStudyView`** — colored metaphor is **`TabBar`** (active tab) + nav; body padding **`120px`** top desktop (**Session 71**).

**ChatOverlay (Session 71, **Session 75**):** Root **`fixed inset-0`** flex center — **no `py-20`**; mobile horizontal inset **`16px`** each side; desktop panel wrapper width from **`NavWidthContext`** (matches nav pill); mobile **`calc(100vw - 32px)`** — **no `max-w-2xl`**, matches homepage chat placement.

## Nav (Session 7 — updated Session 33, Session 65, Session 66, Session 68, Session 69, Session 98)

`src/components/layout/Nav.tsx` — pill nav (desktop), frosted glass, centered top, `'use client'`:
- Links left to right: `case studies` (dropdown) / `about` / `timeline` / `the lab` / "Chat with me" button
- Order: `<CaseStudiesDropdown />` → `about` (href="/about") → `timeline` (href="/timeline") → `the lab` (href="/lab") → Chat with me button
- "lab" is gone — only "the lab" exists. `about` links to `/about`. `timeline` links to `/timeline` (live, Session 49). `the lab` links to `/lab` (live, Session 60).
- The `work` link was replaced in Session 27 with `<CaseStudiesDropdown />` — a button that opens a `320px` frosted-glass dropdown with 4 featured projects + hover-play video thumbnails
- Glass: inline styles (`backdropFilter: blur(12px)`, `backgroundColor: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.1)`)
- **Active route (Session 65):** `usePathname()` + `isActive(href)` (`/` exact match; else `pathname.startsWith(href)`). Text links: idle `rgba(255,255,255,0.6)`; current route or hover → `#00ff9f` (via `NavTextLink` + hover state). Logo has no active color.
- "Chat with me" at the right: dark glass **`backgroundColor: rgba(22,26,34,0.7)`**, **`border: 1px solid rgba(255,255,255,0.15)`**, **`text-white hover:text-accent-neon`**, `<HiDotGrid dotSize={2.5} gap={1.5} speed={1.2} />` in padded span — grid animates continuously. **Mobile:** same classes/styles as desktop, label **"Chat with me"**, **`minHeight: 44`**, **`touchAction: 'manipulation'`** (Session 98).

**Mobile nav (Session 69):** Bar `z-index: 46`; menu overlay `z-index: 45`, always in DOM, `opacity` / `pointerEvents` only; hamburger **two-line → X** morph; staggered link animation `i * 60ms`; `useEffect` on `pathname` closes menu (`eslint-disable-next-line react-hooks/set-state-in-effect` on `setMenuOpen`).

**CaseStudiesDropdown (`src/components/ui/CaseStudiesDropdown.tsx`, Session 27, updated Session 40, Session 65):**
- `usePathname()`: `pathname.startsWith('/work')` → trigger `#00ff9f`; else open → `rgba(255,255,255,0.9)`; else `rgba(255,255,255,0.6)`.
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

**WorkGrid rules (Session 64 updates, Session 67 mobile, **Session 71** chrome):**
- **Sticky terminal chrome header:** `position: sticky, top: 0, zIndex: 40`, `rgba(10,12,16,0.98)` + `blur(12px)`, `padding: 10px 20px`. **Session 71:** **colored** traffic lights on sticky bar (red → home); **per-card** rows stay **gray** dots. Window title: `case-studies.exe`.
- **`useIsMobile()`** — content padding `isMobile ? '100px 20px 80px' : '100px 48px 120px'`; grid `1fr` mobile / `repeat(auto-fill, minmax(280px, 1fr))` desktop; h1 **22** mobile / **28** desktop; card chrome row **`minHeight: 44`** mobile; cards **`touchAction: 'manipulation'`**, **`role="button"`**, **`aria-label`**, keyboard Enter/Space; `<main overflowX: hidden>`.
- **Grid card chrome:** three 8px dots, all `rgba(255,255,255,0.15)` — decorative only (not closeable windows); do not use colored traffic lights on card rows.
- **`GridThumbnail` helper** (in `WorkGrid.tsx`): wraps the 16/9 area with `onMouseEnter` / `onMouseLeave`. Mp4: `videoRef`, `preload="metadata"`, `muted` + `playsInline` + `loop`, `onLoadedMetadata` seeks to 0; hover calls `play().catch(() => {})`, leave pauses and resets `currentTime` to 0. Static images: raw `<img>` with `eslint-disable-next-line @next/next/no-img-element`. Placeholder grid when no `heroAsset`.
- `gap: 16`
- No `textTransform: uppercase` on the "case study" label at the bottom of each card
- PageTransitionWrapper treats `/work` as a content page: dark bg `rgba(14,16,21,0.97)`, z-20, scrollable, `top: 0` (no tab bar offset — tab bar only renders on `/work/*`)

**PageTransitionWrapper update (Session 40, superseded Session 47):**
- Session 47 rewrote the wrapper entirely — see PageTransitionWrapper entry above.
- `isContentPage`, `isCaseStudy`, `isWorkIndex`, `isAbout` all removed. Single `isDeepPage` helper covers all: `/work`, `/work/*`, `/about`, `/timeline`, `/lab`.
- `top: TAB_BAR_HEIGHT` offset on case study pages removed from wrapper — `top: 0` for all pages now.

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

**CaseStudyView rules (Session 34, Session 67 mobile, **Session 71**):**
- Sticky page chrome **removed** (Session 39) — tab bar + nav only; **`TabBar`** carries colored tab metaphor on **`/work/*`**.
- Role line: `fontSize: 12`, `color: rgba(0,255,159,0.7)`, `fontWeight: 300` — NO `textTransform: uppercase`, NO `letterSpacing`. Sentence case.
- **`useIsMobile()`** — content: `maxWidth: isMobile ? '100%' : 720`, `padding: isMobile ? '20px 20px 80px' : '120px 24px 120px'`, `width: '100%'`, `boxSizing`. `<main overflowX: hidden>`.
- Hero + decision **mp4:** `autoPlay={!isMobile}`, `preload="metadata"`, `muted`, `loop`, `playsInline` — **desktop** ambient autoplay; **mobile** no autoplay (Session 67).
- Next CTA: `type="button"`, full width + centered on mobile, `minHeight: 44` mobile, `touchAction: 'manipulation'`. Body copy via `bodyStyle` includes `wordBreak: 'break-word'`.
- All styling: inline styles only — scrollable document page
- `eslint-disable-next-line @next/next/no-img-element` on raw `<img>` elements (same exception as OrbitalCard)

**Next case study chain (loops):** waypoint → statespace → channel → seudo → wafer → sherpa → waypoint-sync → kernel → mushroom → cohere-labs → waypoint

## About page (Session 44, bio Session 84, sports widgets Session 82, layout Session 83, last result Session 88, compact last result Session 89, mobile header Session 98)

Live at `/about`. Scrollable content page, same visual system as case study pages.

**Files:**
- `src/app/about/page.tsx` — thin route, renders `<AboutView />`
- `src/components/about/AboutView.tsx` — `'use client'` component
- `src/app/api/spotify/callback/route.ts` — OAuth callback, one-time token exchange
- `src/app/api/spotify/now-playing/route.ts` — fetches currently-playing or recently-played
- `src/app/api/sports/knicks/route.ts` — Knicks schedule/score via ESPN team schedule API (**Session 82**)
- `src/app/api/sports/mets/route.ts` — Mets schedule/score, same pattern (**Session 82**)
- `src/lib/espnSchedule.ts` — typed helpers for ESPN schedule JSON (`competition[0].status`, `score.value` / `displayValue`) (**Session 82**)

**Layout (Session 67, Session 83, Session 98):** 880px max-width, `padding: isMobile ? '100px 20px 80px' : '120px 48px 160px'`, `width: '100%'`, `boxSizing`. Photo+bio: stack on mobile (flex column, **`alignItems: flex-start`**, 120px photo **left-aligned**); name / role / location **`textAlign: 'left'`** on all breakpoints. Bottom grid: **left** — facts then **connect** (divider, horizontal row, label-only links, hover `#00ff9f`); **right** — Spotify + Knicks + Mets only, column **`gap: 14`** (no extra `marginTop` on sports blocks). See **Mobile content pages — Session 67** in this file.

**Terminal chrome:** sticky, `zIndex: 40`, `rgba(10,12,16,0.98)` + `blur(12px)`. **Session 71:** **colored** traffic lights (red → `/`). Title: `about.exe`.

**Photo:** `/joe.png` — raw `<img>` with `eslint-disable-next-line @next/next/no-img-element`, 200×200, `objectFit: cover`, `borderRadius: 8`.

**Bio copy:** 4 paragraphs in `BIO` in `AboutView.tsx`, verbatim (**Session 84** — designer/engineer/creative cosmonaut, NY→SF Bay 2022, design–code duality, AI-native product + agency questions, records/Knicks/Mets/MySpace arc). No em dashes in `AboutView.tsx` body or bio strings (including JSX comments). Never rewrite. 13px, fontWeight 300, lineHeight 1.8, `rgba(255,255,255,0.65)`.

**Spotify widget:**
- Calls `/api/spotify/now-playing` on mount + every 30s (via `setInterval`)
- `pollRef: useRef<ReturnType<typeof setInterval> | undefined>(undefined)` — typed correctly
- Spotify green is `#1ed760` — NOT `#00ff9f`. Never confuse them.
- Green dot `#1ed760` + glow `boxShadow: '0 0 6px rgba(30,215,96,0.6)'` when `isPlaying: true`
- Hover: border `rgba(30,215,96,0.3)`, bg `rgba(30,215,96,0.04)` — imperative via `onMouseEnter/Leave` on the `<a>` tag
- Album art: raw `<img>` with `eslint-disable-next-line @next/next/no-img-element`
- Section label: `now playing` / `last played` (toggled by `isPlaying`)

**Knicks + Mets widgets (Session 82, layout Session 83, last result Session 88, single-line last result Session 89):** Right column only, below Spotify, **`flexDirection: 'column'`** + **`gap: 14`** with Spotify (no connect in this column). `<SportsWidget>` fetches `/api/sports/knicks` or `/api/sports/mets` on mount and every **60s** (`setInterval` cleared on unmount). Visual match: bordered `rgba(255,255,255,0.02)` panel, mono labels. Team name labels in header: **`rgba(255,255,255,0.75)`** (shared for both teams). **Live** badge: `#00ff9f` + `rgba(0,255,159,0.3)` border. States: **upcoming** (`vs` / `@` opponent + localized date/time), **live** (scores + quarter/clock or MLB `shortDetail`), **off_season** (`no games scheduled`), **error** (`unavailable`), loading (`loading...`). **Session 88:** API adds **`lastGame`** to **`live`**, **`upcoming`**, and **`off_season`**. **Session 89:** **last result** UI is one line: label left, **W** / **L** + score + **`vs` / `@`** abbr right (`justifyContent: space-between`, inner cluster `gap: 6`); **W** `rgba(0,255,159,0.7)`, **L** `rgba(255,255,255,0.3)`; only when **`lastGame`** is present. Server: **`export const revalidate = 60`** + `fetch(..., { next: { revalidate: 60 } })` to ESPN `site.api.espn.com` team schedule endpoints — **no API key** (not SportRadar). Parsing uses **`competitions[0].status.type.state`** (`in` / `pre` / `post`), not event-level status.

**Connect (Session 83):** Bottom of **left** column under facts: `marginTop: 32`, `paddingTop: 24`, `borderTop: 1px solid rgba(255,255,255,0.06)`; row `display: flex`, `gap: 24`, `flexWrap: wrap`; links text-only (no arrows), `fontSize: 11`, hover `#00ff9f`; `mailto:` omits `target` / `rel`; external uses `_blank` + `noopener noreferrer`. URLs stay on **`LINKS`** in `AboutView.tsx` (existing canonical paths).

**Spotify API routes:**
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` in `.env.local`
- OAuth scopes: `user-read-currently-playing user-read-recently-played`
- Callback redirectUri: `http://localhost:3002/api/spotify/callback` (hardcoded for local setup)
- Both routes use `cache: 'no-store'` — always fresh data

**NavWrapper:** `hasChrome = pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline' || pathname === '/lab'` — these pages have sticky terminal chrome headers so nav shifts down by `TAB_BAR_HEIGHT`. `top` is `useState(0)` + `useEffect` with 60ms delay (Session 46) — always animates from 0 so the CSS transition fires correctly. **Session 91:** **`top`** transition **`0.15s` delay**; **`ResizeObserver`** skips width updates during **`dataset.transitioning`**.

**PageTransitionWrapper:** `/about`, `/timeline`, and `/lab` are deep pages — dark bg, z-20, scrollable, enter from above. Handled by `isDeepPage` (Session 47, updated Session 49, Session 60). **Session 91:** **`dataset.transitioning`**, **`useIsPresent`**, **`contain`**, **`willChange`** — see layout section above.

**`<video>` rule exception note:** `AboutView.tsx` has no video elements. The "no autoPlay" rule does not apply here (no video at all).

## The Lab page — Session 60, updated Session 61–63

Live at `/lab`. Open notebook with beliefs, open questions, experiments, and a chronological feed.

**Files:**
- `src/content/lab-experiments.ts` — 3 experiments (expanded write-ups, Session 61)
- `src/content/lab-feed.ts` — 14 entries (5 new prepended in Session 61)
- `src/app/lab/page.tsx` — thin route
- `src/components/lab/LabView.tsx` — `'use client'` component

**Page order:**
1. Terminal chrome (`lab.exe`)
2. Header (eyebrow + h1 + subtitle + tagline)
3. "Currently thinking about" (4 questions, green arrow prefix)
4. Divider
5. "Things I hold true" (7 beliefs, two-column grid)
6. Divider
7. "Experiments" (3 terminal window cards, gray dots)
8. Divider
9. "Feed" label + tag search + active pills + filtered entries (14 entries in data, newest first; client-side only)

**Feed tag filter (Session 63):**
- `activeTags` + `filterQuery`. Search input suggests matching tags (case-insensitive substring); max 6 rows in dropdown; click adds tag and clears input.
- Active filters: green pills with × dismiss; `clear all` when any tag active.
- `filteredFeed`: OR across `activeTags`; empty `activeTags` shows full feed.
- No URL params / no persistence.

**Layout:**
- Content padding: `120px 48px 160px`. Max-width 760px.
- Beliefs grid: `gridTemplateColumns: '1fr 1fr'`, `gap: 32`. Left col: statement `rgba(255,255,255,0.85)` 13px 400. Right col: note `rgba(255,255,255,0.4)` 12px 300. Row `borderBottom: rgba(255,255,255,0.05)`.
- Experiment description and feed body: `text.split('\n\n').map((para) => <p>)` — renders multi-paragraph content.
- All styling: inline styles only.

**Traffic light rule (site-wide, Session 61, Session 68–69, **Session 71**, **Session 81**):**
- **Colored dots** = page-level closeable chrome, **`ChatPanel variant="overlay"`**, OrbitalCards, TabBar; sticky **`*.exe`** bars on about / timeline / lab / work index (**red → `router.push('/')`**). **Session 81:** TabBar **red** closes the active tab; **all** colored-dot hover glyphs use **`pointerEvents: 'none'`** on inner spans.
- **Gray dots** = informational cards only — **`ChatPanel variant="embedded"`**, WorkGrid **per-card** rows, Lab **experiment** cards.
- See **Traffic lights — Session 68–69 ChatPanel split, Session 71 page chrome + overlay, Session 81 hit targets** above.

**Nav/transition wiring:**
- `Nav.tsx`: `<Link href="/lab">`
- `NavWrapper.tsx`: `hasChrome` includes `pathname === '/lab'`
- `PageTransitionWrapper.tsx`: `isDeepPage` includes `pathname === '/lab'`

**Do NOT:**
- Rewrite or edit body copy in either data file
- Use `next/image` in LabView
- Add colored traffic light dots to non-interactive cards

## Timeline page — Session 49 (rebuilt Session 51)

Live at `/timeline`. Vertical scroll timeline with single scroll listener + CSS grid dot/line layout.

**Files:**
- `src/content/timeline.ts` — `TimelineArtifact` + `TimelineEra` interfaces + `TIMELINE` array (10 eras)
- `src/app/timeline/page.tsx` — thin route, renders `<TimelineView />`
- `src/components/timeline/TimelineView.tsx` — `'use client'`, single scroll listener, CSS grid `EraBlock`

**Header (Session 58–59):** `paddingLeft: 48` on the header div aligns it with the era content column. h1 reads "15+ years of building". Resume download link below subtitle: `<a href="/JoeSiconolfi_Resume-2026.pdf" download>` with `↓` prefix, `marginTop: 20`, hover → `#00ff9f`. File must exist at `public/JoeSiconolfi_Resume-2026.pdf`.

**Era types:** `compact` (early career, 5 eras) = dot 6px, smaller text, no artifacts/tech/link. `full` (5 eras) = dot 8px, full treatment with artifacts, tech pills, case study link.

**Dot color (Session 54, cleaned Session 57):** Active dots `#00ff9f` hardcoded inline + `boxShadow: 0 0 6px rgba(0,255,159,0.3)`. Inactive: `rgba(255,255,255,0.12)`. No `threadColor` variable. No `position: relative` or `zIndex` on dot — redundant, era list flex container provides stacking context. No `marginLeft`/`marginRight` — `alignItems: 'center'` on dot column centers it on the 24px column and rail.

**Active state (Session 56):** No `opacity` or `transform` on the EraBlock outer wrapper — dots are stationary and always fully visible. Active/inactive drives color only: dot `backgroundColor` + `boxShadow`, and all text color values, transition at `0.35s ease`. Do NOT add `opacity` or `transform` back to the EraBlock wrapper.

**Scroll activation (Session 51, fixed Session 53):** Single scroll listener on `[data-scroll-container]`.
- `targetY = window.innerHeight * 0.4` — fixed viewport point, not a scroll offset
- Finds era whose center (`getBoundingClientRect().top + rect.height / 2`) is closest to `targetY`
- `getBoundingClientRect()` is always viewport-relative. `offsetTop` was wrong — it's relative to `offsetParent`, not the scroll container.
- `requestAnimationFrame(findActiveEra)` on mount. `{ passive: true }` listener. Works in both directions.
- NEVER use `IntersectionObserver` for this — it fires multiple times simultaneously and doesn't work in reverse.
- NEVER use `offsetTop` for this calculation — use `getBoundingClientRect()`.

**Layout (Session 51 + Session 52):** CSS grid per era — `gridTemplateColumns: '24px 1fr'`.
- Column 1: dot only (`position: relative, zIndex: 1`). No per-block line segment.
- Column 2: all text content.
- **Single static rail (Session 52):** `position: absolute, left: 11, top: 8, bottom: 0, width: 1, rgba(255,255,255,0.07)` on the `position: relative` timeline wrapper. Never has a transition or animation. Era blocks sit at `zIndex: 1` above it. `left: 11` centers the rail on the 24px dot column.

**Footer (Session 55–59):** `paddingLeft: 48` (Session 59) — aligns border and text with era content column. `borderTop: '1px solid rgba(255,255,255,0.06)'`, `marginTop: 64`, `paddingTop: 40`. Sibling of the timeline wrapper, NOT a child. No box, no animation.

**`pulse-slow` keyframe** in `globals.css` — retained but not used by timeline.

**Nav wiring:** `timeline` link is `<Link href="/timeline">`.

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

### Lint and TypeScript standard (project-wide)

- `eslint src/` must pass clean at all times — **never** scope lint to a single file to work around failures.
- `tsc --noEmit` must pass clean at all times.
- Fix real violations when found, even if outside the current session’s scope.
- **No refs read during render** — use `useState(() => computeInitialValue())` to pin values at mount when a value must stay fixed for that component instance (e.g. page transition tier).
- **No unused variables or constants** — remove them when found.

### Other conventions

- Run `tsc --noEmit` and `eslint src/` before considering a task complete.
- No `console.log` left in committed code — use a `logger` utility if needed.
- Images: use `next/image` for standard page content. **Exception:** `OrbitalCard.tsx`, `CaseStudyThumbnail.tsx`, and `AboutView.tsx` use raw `<img>` — fixed-size or externally-hosted media where `next/image` optimization caused silent failures or is not applicable (e.g. Spotify album art URLs). All exceptions are documented with `eslint-disable-next-line @next/next/no-img-element` comments.
- `<video>` elements: **`muted`**, **`playsInline`**, and usually **`loop`**. Use **`preload="metadata"`** where a visible first frame is required at rest (OrbitalCard MP4 thumbnails, `CaseStudyThumbnail`, `WorkGrid`, case study heroes/artifacts). Never **`preload="auto"`**. **`autoPlay`** only where explicitly specified (e.g. desktop case-study hero with `!isMobile`); orbital cards never autoplay.
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
