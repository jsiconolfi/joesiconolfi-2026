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

### Hero / Homepage (Session 11 — current state)

The homepage is a fixed overlay composition — not a scrollable section:
- **Swirl**: `fixed inset-0 z-0`, fills entire viewport, bleeds through the glass panel
- **Nav**: `fixed top-4 z-30`, pill-shaped frosted glass, centered — links: work / lab / timeline / contact
- **ChatPanel**: `fixed inset-0 z-20`, centered, `max-w-2xl h-[75vh]` — THE primary interface
- **Name block**: `fixed bottom-8 left-8 z-10`, static text — name / "Design + Engineering" / thesis

The ChatPanel (`src/components/ui/ChatPanel.tsx`) is a terminal-aesthetic frosted glass chat interface:
- macOS traffic-light header chrome
- Animated greeting stream on load — three phases: thinking → streaming → chips (Session 11)
- AI avatar: `/logo-update.svg` in a small circle
- `>` prompt prefix in `#00ff9f` terminal green
- Placeholder AI responses (800ms timeout) — Anthropic integration next session
- Glass treatment uses inline styles matching the site's existing glass variables
- Thinking state: `SwirlDotGrid` (6×4, speed 0.055) + "thinking..." label

Load sequence (Session 11–13):
1. **Phase 1 — Thinking** (1.5s): `isLoading: true`. `AssistantAvatar thinking={true}` — SwirlDotGrid sweeps inside the avatar circle. `"thinking..."` label sits inline to the right, vertically centered on the same row.
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

Suggestion chips — persistent bar only:
- Chips appear ONLY in the persistent bar above the input. Never inside message bubbles.
- The `Message` interface has no `chips` field — do not add one.
- The bar always shows the fixed set: `my work`, `my experience`, `about me`, `my resume`, `contact`.
- When wiring real AI responses, do not pass chips through message data — the bar handles all navigation shortcuts.

The Nav (`src/components/layout/Nav.tsx`) includes a "Chat with me" button (Session 10):
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

### Work (case studies)
- Card grid. Glance: title + one-line thesis only. Expand: problem, decision, outcome — inline, never navigates away. Immerse: full case study with artifacts, code, process.
- Key projects: Waypoint design system, Sherpa Figma plugin (RAG-based, Pinecone + Cohere models), waypoint-sync (Figma-to-code token sync), Channel AI, Statespace/Aimlab.
- Frame each as a bet made at the right time, not a list of deliverables.

### The Seam
- The section that demonstrates keystone 3 directly.
- Split panel: Figma component left, TypeScript/React code right. The swirl or animated connector lives in the gutter between them — literally the space where design becomes code.
- Show waypoint-sync, design-map.json, the actual pipeline.
- Glance: striking visual that communicates hybrid fluency. Expand: toggle between the two sides. Immerse: annotated, decisions explained.

### Lab
- Open notebook. The differentiator section.
- Glance: "currently experimenting with —" with a live signal. Expand: experiment cards (before/after prompts, what changed, why). Immerse: actual system prompt structure from Sherpa, Pinecone RAG architecture, real evals with results.
- This is where senior hiring managers spend the most time. Keep it honest and specific.

### Timeline
- 15 years framed as compounding bets, not a resume.
- Glance: company + role + dates. Expand: "the bet I made" — why this role, what shifted. Immerse: artifacts from that era.
- The arc must be legible: someone who saw the AI-native shift coming and kept running toward it.
- Ends at Cohere/Waypoint as the culmination, not just the latest job.

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
