# Case studies — full copy (workshop)

All copy is production-ready. Asset paths marked with `<asset: description>` — replace with real file paths when assets are ready.
No em dashes anywhere in this file.

---

## Waypoint (`waypoint`) — full

**Tagline:** Design system built from zero at Cohere
**Year:** 2025–present
**Role:** Staff Design Engineer, sole design engineer

### Hero

`<asset: Waypoint brand/logo lockup or system overview screenshot>`

### The problem

Cohere had no design system when I joined. Every team was solving the same UI problems independently: different button components, different token conventions, different approaches to spacing and type. For a company shipping AI products to enterprise clients, that inconsistency was a real cost. I joined as the first design engineer and built Waypoint from scratch: tokens, components, documentation, and the tooling to keep design and code in sync.

### The hard part

The hardest part wasn't building the components. It was getting adoption. Engineers had their own patterns. Designers had their own Figma libraries. You can't mandate a design system into use. You have to make it genuinely better than the alternative. That meant treating developer experience as carefully as visual design: clear APIs, honest documentation that acknowledged when the system didn't have what you needed, and a feedback loop that made it easy to surface gaps without making teams feel like they were filing bug reports.

### Key decisions

#### Tokens first, components second

Before writing a single component I established the token architecture: a three-tier system of primitive, semantic, and component tokens mapped across Figma variables, CSS custom properties, and Tailwind config. This meant any component built on the system would automatically respond to theme changes. It also meant designers and engineers shared the same vocabulary from day one. When a designer says "surface secondary," the engineer knows exactly which token that maps to.

`<asset: Token architecture diagram or Figma variables screenshot showing the three tiers>`

#### waypoint-sync: two-way Figma-to-code pipeline

Manual token handoff was the biggest source of drift between design and code. I built waypoint-sync, a CLI tool that reads a design-map.json mapping Figma variable names to CSS custom properties and Tailwind keys, and syncs changes bidirectionally through Claude Code and Cursor. When a designer updates a color token in Figma, the codebase updates. No export step. No PR for a hex value change. No drift.

`<asset: Terminal screenshot showing waypoint-sync CLI running, or a before/after showing token drift eliminated>`

#### Sherpa: RAG-based documentation assistant

Documentation that nobody reads is worthless. I built Sherpa, a Figma plugin that lets designers query Waypoint documentation in natural language using Cohere's embed-english-v3.0 and command-r-plus models with Pinecone as the vector store. The real test was whether designers stopped asking the same questions in Slack. They did.

`<asset: Sherpa plugin UI screenshot showing a natural language query and response inside Figma>`

#### Packaging for external delivery

When RBC became a client needing Waypoint components, I scoped and kicked off the npm packaging work, consolidating icons, components, and tokens into a private package. External delivery forces discipline that internal use doesn't. Every undocumented behavior becomes a support burden. Every inconsistency becomes a contract violation. The external package is better designed because it had to be.

### Outcome

Waypoint is now the production design system for Cohere's North product and the foundation for external client deliveries. The token sync pipeline eliminated manual handoff drift. Sherpa changed how designers find answers. The system is still evolving. I'm still building it.

---

## Statespace (`statespace`) — full

**Tagline:** AI coaching platform for 30M+ players
**Year:** 2019–2022
**Role:** Product Design Lead, owned the full product design function

### Hero

`<asset: Aim Lab product overview screenshot or hero shot of the training interface>`

### The problem

Aim Lab started as a free aim trainer. By the time I joined we had 30 million users and a real question: how do you turn a tool into a training system? The difference is personalization. A tool does the same thing for everyone. A training system learns who you are and gets better at making you better. That gap is the entire product strategy.

### The hard part

The tension was between depth and accessibility. The most effective training features required users to understand concepts like target acquisition speed and flick accuracy. Concepts that even experienced players didn't have language for. The wrong answer was to hide the complexity. The right answer was to build a vocabulary for it: translate the performance model into language users could act on, then let them graduate into the full data over time.

### Key decisions

#### Skill model as the foundation

We defined a skill taxonomy of the discrete components of aiming performance and built every feature on top of it. This gave the product a coherent vocabulary and meant every new feature could be positioned within a framework users already understood. When the AI coaching surfaced a recommendation, it connected to a specific skill gap rather than just telling users to practice more.

`<asset: Skill model visualization or the performance dashboard showing skill breakdown>`

#### Progressive disclosure of data

New users see simple scores. Advanced users see the full performance model. The same data, different views, controlled by engagement level rather than a settings toggle. Users graduated into complexity naturally, without us deciding when they were ready. The system inferred readiness from behavior.

#### The coaching arc

Individual sessions weren't enough. We designed a progression arc: assessment, targeted practice, benchmark. That cycle repeated on weekly and monthly cadences. Users weren't just playing Aim Lab. They were on a training program with a structure they could see and measure themselves against.

`<asset: Coaching arc UI or progression timeline showing the weekly/monthly cadence>`

#### Statespace x Kernel integration

When we partnered with Kernel to integrate their Flow neural interface, I led the UX for surfacing cognitive metrics alongside performance data. Cognitive load scores and focus indices meant nothing to gamers. We mapped them to performance language users already understood: peak focus window became optimal training window, high cognitive load became a signal to take a break. The data didn't change. The framing did.

`<asset: Kernel integration UI showing cognitive metrics mapped to training language>`

### Outcome

Aim Lab reached 30M+ registered users. The training system model became the differentiator, and the core of the $50M Series B. The Kernel integration was covered by VentureBeat and became the opening move in the cognitive performance category Statespace was building.

---

## Channel AI (`channel`) — full

**Tagline:** AI-native creative tools for content teams
**Year:** 2023–2025
**Role:** Design Engineer (design system, core product, AI interaction patterns)

### Hero

`<asset: Channel product overview or hero shot of the writing interface>`

### The problem

Channel was building AI writing tools when every AI writing tool looked the same: text box, generate, copy. The problem wasn't the model. It was the interaction model. Generate-and-copy treats AI as a vending machine. Channel was trying to build something you could actually think with.

### The hard part

The hardest design problem was latency. Streaming responses feel broken when the UI isn't designed for them. Every interaction pattern had to be rebuilt from first principles for a streaming-first world: how you show thinking, how you show streaming, how you handle errors, how you invite iteration. None of the patterns from static form UX applied. Everything stayed broken until we stopped adapting existing patterns and started designing for how the model actually worked.

### Key decisions

#### Streaming-first interaction model

We designed every state in the response lifecycle: thinking, streaming, complete, error, and the various iteration states (refining, expanding, trying again). Each state had distinct visual language so users always knew where they were in the process. The most important state was thinking. Most products treated it as a blank waiting period. We made it legible as a process, not an absence.

`<asset: State diagram or UI screenshots showing the distinct response lifecycle states>`

#### Multi-variation output

Single outputs created friction. Users would get one response, decide it was wrong, and start over. We designed a variation model where the AI produces two or three distinct interpretations simultaneously. Users pick the closest one and refine from there rather than starting from nothing. Once you show people options, they stop wanting to work without them.

`<asset: Variation UI showing two or three simultaneous outputs side by side>`

#### Context as a first-class concept

The AI was only as good as the context it had. We built a persistent context panel where users could attach brand voice, tone guidelines, previous work, and reference material. This shifted the mental model from "AI writes for me" to "AI writes with everything it knows about me." The shift from interaction to inference. The system stops asking and starts knowing.

`<asset: Context panel UI showing attached brand voice, guidelines, and reference material>`

### Outcome

Channel shipped to production serving content teams across marketing, editorial, and product functions. The streaming interaction patterns became the foundation for every AI feature in the product. The multi-variation model had higher completion rates than single-output alternatives. Once users worked with variations, they didn't go back.

---

## Seudo AI (`seudo`) — full

**Tagline:** Voice-first brainstorming with AI clustering
**Year:** 2023–present
**Role:** Design Engineer, solo, built from zero

### Hero

`<asset: Seudo product overview or hero shot of the spatial idea map>`

### The problem

Most brainstorming tools are note-taking apps with a new name. Seudo started from a different premise: what if the AI was present during the brainstorm itself, not just available after? Voice input removes the friction of typing. Real-time clustering surfaces connections you might miss while still speaking. The tool thinks alongside you.

### The hard part

Voice input is fast and messy. The AI clustering needed to keep up without overwhelming users with reorganization while they were still thinking. Getting the timing right required iteration with real users: when to surface a new cluster, when to let ideas accumulate before organizing them, and how to signal that the system is working without pulling attention away from the thought in progress.

### Key decisions

#### Voice as the primary input, not an add-on

Typing interrupts thought. Voice is how people actually brainstorm. Building voice as the primary modality meant rethinking every part of the UI. There is no cursor, no text field focus, no submit button. The interface had to feel ambient. The visual layer is a consequence of the voice layer, not the other way around.

`<asset: Voice input UI or the ambient listening state showing minimal visual presence>`

#### Real-time clustering without interruption

The AI clusters ideas as they arrive but doesn't surface reorganizations until natural pauses. This prevents the feeling that the system is constantly rearranging things while you're still thinking. The clustering is continuous. The UI updates are gated. Users experience the intelligence, not the process.

#### Spatial mapping of idea relationships

Text lists hide relationships. Every idea is mapped spatially, with proximity indicating semantic similarity. As clusters form, the map self-organizes: ideas that belong together drift together. Users see the shape of their thinking, not just its content. The insight surfaces in the layout, not the text.

`<asset: Spatial idea map showing clusters forming, with proximity indicating semantic relationships>`

### Outcome

Users organized ideas 35% faster in testing. The clustering consistently surfaced connections users said they hadn't consciously made. The description that came up most often in sessions: "thinking out loud with someone who's actually listening." Still building.

---

## Wafer Systems (`wafer`) — full

**Tagline:** AI-native OS: product, visual and UX design
**Year:** 2024–present
**Role:** Design Lead (product, visual, and UX design)

### Hero

`<asset: Wafer OS context layer overview or hero concept showing the unified surface>`

### The problem

Wafer is reimagining the smartphone OS from the ground up for an AI-native world. The premise: apps are the wrong abstraction. Instead of siloed apps that don't share context, Wafer builds a unified context layer that understands what you're doing across everything and surfaces the right capability at the right moment. The question stops being "which app do I open?" It becomes "what do I need right now?"

### The hard part

Designing for an OS that doesn't exist yet, on hardware that isn't shipping yet, for users who don't know they want it yet. The design had to be specific enough to be buildable and principled enough not to be wrong when the constraints changed. Every decision would be validated or invalidated by hardware that didn't exist. So the work was to build patterns, not pixels.

### Key decisions

#### Context layer as the core metaphor

Instead of designing apps, we designed the context layer: the surface that sits above everything and understands user intent. This meant designing states, transitions, and affordances for a system that's always present but rarely front-and-center. The design challenge isn't what it looks like when you're using it. It's what it looks like when it interrupts you at exactly the right moment.

`<asset: Context layer state diagrams or UI showing the system surfacing at an appropriate moment>`

#### Proactive over reactive

Traditional mobile UI is reactive. You open an app, you do a thing. Wafer's UI is proactive. The system anticipates and surfaces. Designing for proactivity required rethinking every interaction model. The question stopped being "what does the user do next?" and became "what does the user need before they know they need it?" That's the context inference problem at the OS level. Magic Ink, but for everything.

#### Component library for an AI OS

An AI-native OS surfaces in wildly different contexts: a cooking timer, a meeting note, a driving direction. The components had to feel like they belonged to the same coherent system regardless of where they appeared. I built 12 categories of components with a unified visual language for exactly that constraint. The goal: users should feel the system before they understand it.

`<asset: Component library overview showing the 12 categories and their visual coherence>`

### Outcome

A full component system and interaction model for Wafer's context layer. The design is shaping how the team thinks about the product, not just how it looks. The OS is in active development. The design work continues as hardware constraints sharpen and the scope of the context layer expands.

---

## Sherpa (`sherpa`) — full

**Tagline:** RAG-based Figma plugin for design system Q&A
**Year:** 2025
**Role:** Staff Design Engineer, designed and built solo

### Hero

`<asset: Sherpa plugin in context inside Figma, showing the query interface>`

### The problem

A design system is only as good as its adoption. The bottleneck at Cohere wasn't the components. It was that designers couldn't find what they needed fast enough. They'd open Figma, try to remember the right component name, give up, and build something custom. A plugin that answered questions about Waypoint in natural language removed the friction between having a system and actually using it.

### The hard part

RAG quality is highly sensitive to how you chunk and embed documentation. Early versions surfaced technically correct but contextually wrong answers: the right component for the wrong use case. Getting retrieval quality right required rethinking the documentation structure itself, not just the pipeline. If the documentation was vague, the answers were vague. The AI was a mirror of the documentation quality.

### Key decisions

#### Embedding at the component level

Rather than embedding full documentation pages, each component's usage guidelines, variants, and do/don't examples were embedded as separate chunks. This made retrieval more precise: a query about spacing would surface spacing tokens, not the entire layout section. The unit of retrieval had to match the unit of the question.

`<asset: Diagram showing the chunking strategy or a retrieval quality comparison (early vs refined)>`

#### Context-aware response generation

Responses aren't retrieved text. They're generated answers grounded in retrieved chunks. command-r-plus synthesizes the relevant documentation into a direct answer with component names, variant recommendations, and links to the relevant Figma frames. The difference between search and Sherpa is that search returns a document. Sherpa returns an answer.

#### Figma-native UX

The plugin had to feel like it belonged in Figma, not like a chat window dropped in from elsewhere. The interaction model mirrors how designers already talk about decisions: "what should I use for this?" rather than searching for component names. The context is Figma. The language should be too. A plugin that forces designers to think in system vocabulary defeats the point.

`<asset: Sherpa UI inside Figma showing a natural language question and a specific component recommendation response>`

### Outcome

Sherpa is in use by the Cohere design team. The clearest signal: designers stopped asking for component guidance in Slack. When a tool becomes the first place people go, you've removed a friction that was real. It's now the primary way new designers learn the system.

---

## waypoint-sync (`waypoint-sync`) — quick

**Tagline:** Two-way Figma-to-code token pipeline
**Year:** 2025
**Role:** Staff Design Engineer, built solo

### Hero

`<asset: Terminal screenshot of waypoint-sync running, or a visual showing the sync flow>`

### The problem

Design tokens drift between Figma and code. It always happens. The designer updates a color, the engineer has a different version, the gap widens until someone manually reconciles it. waypoint-sync is a CLI tool that makes the design file the source of truth the codebase reads from directly.

### What I built

#### design-map.json as the contract

A single JSON file maps every Figma variable to its CSS custom property and Tailwind counterpart. The CLI reads this map and syncs in either direction: push code changes to Figma, or pull Figma changes to code. One source of truth, two directions. The design file stops being a spec and starts being an API.

#### Claude Code and Cursor as the runtime

Rather than building a custom sync engine, I use Claude Code and Cursor as the execution layer. The design-map.json is the spec and the AI handles the actual file operations. This keeps the tool lightweight and maintainable. The finding: you don't need custom tooling when the spec is precise enough for the model to execute against.

`<asset: design-map.json screenshot or the CLI output showing a successful sync>`

### Outcome

Manual token sync eliminated across the Waypoint system. Design and code stay in sync with a single CLI command. Being adopted as the standard for token management on the Cohere design team.

---

## Statespace x Kernel (`kernel`) — quick

**Tagline:** Gaming meets neurotech: neural data UX
**Year:** 2021–2022
**Role:** Product Design Lead (integration UX and data visualization)

### Hero

`<asset: Kernel Flow hardware or the integration UI showing neural data alongside game performance>`

### The problem

Kernel Flow measures cognitive load and focus in real time using a neural interface. Integrating it with Aim Lab meant designing a UX that made neuroscience data legible and actionable for gamers, not researchers. The data was sophisticated. The interface had to be the opposite.

### What I built

#### Translating neural metrics to performance language

Cognitive load scores and focus indices meant nothing to gamers. We mapped them to familiar performance concepts: peak windows, recovery periods, warm-up states. Users could act on the data without needing to understand the neuroscience behind it. The translation layer was the entire design problem.

#### Ambient by default

The neural data had to enhance training without adding friction. We designed it as an ambient layer: visible when you want it, invisible when you're in the zone. The worst version of this feature would make you think about your brain while you're trying to train.

`<asset: UI screenshot showing the ambient neural data layer alongside the training session>`

### Outcome

Shipped and covered by VentureBeat. The cognitive performance angle became a real differentiator for Statespace and part of the $50M Series B story.

---

## Mushroom (`mushroom`) — quick

**Tagline:** LLM-powered voice interfaces
**Year:** 2022–2023
**Role:** Product Design Engineer (voice UX and conversational interface design)

### Hero

`<asset: Any product screenshot, interface concept, or visual showing the voice interface context>`

### The problem

Mushroom was building LLM-powered voice interfaces before voice AI was mainstream. The design challenge was fundamental: there is no screen. No cursor, no button, no text field. The interface is entirely audio. The feedback is entirely acoustic.

### What I built

#### Designing for ears, not eyes

Every interface decision was evaluated aurally first. Response length, pacing, confirmation patterns: all optimized for how they sound, not how they look. The standard UX toolkit doesn't exist for voice. We built our own evaluation methods from scratch.

#### Conversational state management

Voice conversations carry context that text doesn't: tone, pace, interruptions. We designed a state model that accounted for these signals and let the interface adapt to the emotional and practical context of each interaction. A user who sounds frustrated gets a different response pattern than one who sounds engaged.

`<asset: State model diagram or flow showing how tone and pace influence response patterns>`

### Outcome

Shipped production voice interfaces across multiple products. The key finding on latency: users' threshold for feeling understood is far lower with voice than text. A 200ms response feels intelligent. A two-second response feels broken, regardless of what it says.

---

## Cohere Labs (`cohere-labs`) — quick

**Tagline:** Prototyping new UX flows for model capabilities
**Year:** 2025–present
**Role:** Staff Design Engineer (prototype design and build)

### Hero

`<asset: A prototype screenshot or the Cohere Labs environment showing a capability being explored>`

### The problem

New model capabilities need UX before they have products. Cohere Labs is where I prototype the interaction patterns for features coming out of research: turning model capabilities into experiences that product teams can evaluate, iterate on, and eventually ship.

### What I built

#### Prototype fidelity calibrated to the question

Not all prototypes need to be high fidelity. I build at the fidelity the question requires: sometimes a rough interactive mock to test whether the capability is even understandable, sometimes a near-production component to test whether the implementation is right. Building at the wrong fidelity wastes time and produces misleading signals.

#### UX as a research input

The prototypes feed back into model development. How users interact with a capability surfaces edge cases and failure modes that pure model evaluation misses. Design and research are a closed loop. The prototype isn't just a deliverable. It's a measurement instrument.

`<asset: A prototype in use, or a research finding visualization showing how UX feedback shaped model direction>`

### Outcome

Several prototypes have shipped to production or directly shaped what shipped. The more valuable output is often the failure cases: understanding what users cannot make sense of at all helps the research team know what to improve in the model before it reaches product.

---

## Order on site (next-case-study chain)

waypoint → statespace → channel → seudo → wafer → sherpa → waypoint-sync → kernel → mushroom → cohere-labs → waypoint (loops)

---

## Asset checklist

Use this to track which assets are gathered. Replace `<asset: ...>` placeholders in the copy above once files are in `/public/projects/`.

### Waypoint
- [ ] Hero: Waypoint brand/logo lockup or system overview screenshot
- [ ] Token architecture diagram or Figma variables screenshot
- [ ] waypoint-sync CLI terminal screenshot or before/after
- [ ] Sherpa plugin UI screenshot inside Figma

### Statespace
- [ ] Hero: Aim Lab training interface screenshot
- [ ] Skill model visualization or performance dashboard
- [ ] Coaching arc UI or progression timeline
- [ ] Kernel integration UI showing cognitive metrics

### Channel AI
- [ ] Hero: Channel writing interface screenshot
- [ ] Response lifecycle state diagram or UI screenshots
- [ ] Multi-variation output UI
- [ ] Context panel UI

### Seudo AI
- [ ] Hero: Spatial idea map screenshot
- [ ] Voice input / ambient listening state UI
- [ ] Spatial idea map showing clusters forming

### Wafer Systems
- [ ] Hero: Context layer concept overview
- [ ] Context layer state diagrams or surface-at-right-moment UI
- [ ] Component library overview (12 categories)

### Sherpa
- [ ] Hero: Sherpa plugin in Figma
- [ ] Chunking strategy diagram or retrieval quality comparison
- [ ] Sherpa UI showing a query and component recommendation

### waypoint-sync
- [ ] Hero: Terminal screenshot of CLI running
- [ ] design-map.json screenshot or CLI output

### Statespace x Kernel
- [ ] Hero: Kernel Flow hardware or integration UI
- [ ] Ambient neural data layer UI

### Mushroom
- [ ] Hero: Voice interface context visual
- [ ] State model diagram or tone/pace flow

### Cohere Labs
- [ ] Hero: Prototype screenshot or Cohere Labs environment
- [ ] Prototype in use or research finding visualization
