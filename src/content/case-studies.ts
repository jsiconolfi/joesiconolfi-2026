export type CaseStudyType = 'full' | 'quick'

export interface CaseStudyDecision {
  title: string
  body: string
  artifact?: string   // image/video path in /public/projects/
}

export interface CaseStudy {
  id: string          // matches project id in projects.ts
  slug: string        // URL slug: /work/[slug]
  type: CaseStudyType
  name: string
  tagline: string     // one line under the name
  year: string
  role: string        // specific, honest: "Staff Design Engineer" not "Led design"
  hook: string        // 2-3 sentences: the real problem and why it mattered
  hardPart?: string   // full case studies only: one genuine constraint/tension
  decisions: CaseStudyDecision[]
  outcome: string     // what shipped, what changed, what you learned
  heroAsset?: string  // image or video path for the hero area
  nextSlug?: string   // slug of the next case study for navigation
}

export const CASE_STUDIES: CaseStudy[] = [
  // --- FULL CASE STUDIES ---
  {
    id: 'waypoint',
    slug: 'waypoint',
    type: 'full',
    name: 'Waypoint',
    tagline: 'Design system built from zero at Cohere',
    year: '2025–present',
    role: 'Staff Design Engineer, sole design engineer',
    hook: 'Cohere had no design system when I joined. Every team was solving the same UI problems independently: different button components, different token conventions, different approaches to spacing and type. For a company shipping AI products to enterprise clients, that inconsistency was a real cost. I joined as the first design engineer and built Waypoint from scratch: tokens, components, documentation, and the tooling to keep design and code in sync.',
    hardPart: 'The hardest part wasn\'t building the components. It was getting adoption. Engineers had their own patterns. Designers had their own Figma libraries. You can\'t mandate a design system into use. You have to make it genuinely better than the alternative. That meant treating developer experience as carefully as visual design: clear APIs, honest documentation that acknowledged when the system didn\'t have what you needed, and a feedback loop that made it easy to surface gaps without making teams feel like they were filing bug reports.',
    decisions: [
      {
        title: 'Tokens first, components second',
        body: 'Before writing a single component I established the token architecture: a three-tier system of primitive, semantic, and component tokens mapped across Figma variables, CSS custom properties, and Tailwind config. This meant any component built on the system would automatically respond to theme changes. It also meant designers and engineers shared the same vocabulary from day one. When a designer says "surface secondary," the engineer knows exactly which token that maps to.',
        artifact: '/projects/waypoint.mp4',
      },
      {
        title: 'waypoint-sync: two-way Figma-to-code pipeline',
        body: 'Manual token handoff was the biggest source of drift between design and code. I built waypoint-sync, a CLI tool that reads a design-map.json mapping Figma variable names to CSS custom properties and Tailwind keys, and syncs changes bidirectionally through Claude Code and Cursor. When a designer updates a color token in Figma, the codebase updates. No export step. No PR for a hex value change. No drift.',
        artifact: '/projects/waypoint-sync.mp4',
      },
      {
        title: 'Sherpa: RAG-based documentation assistant',
        body: 'Documentation that nobody reads is worthless. I built Sherpa, a Figma plugin that lets designers query Waypoint documentation in natural language using Cohere\'s embed-english-v3.0 and command-r-plus models with Pinecone as the vector store. The real test was whether designers stopped asking the same questions in Slack. They did.',
        artifact: '/projects/sherpa.mp4',
      },
      {
        title: 'Packaging for external delivery',
        body: 'When RBC became a client needing Waypoint components, I scoped and kicked off the npm packaging work, consolidating icons, components, and tokens into a private package. External delivery forces discipline that internal use doesn\'t. Every undocumented behavior becomes a support burden. Every inconsistency becomes a contract violation. The external package is better designed because it had to be.',
      },
    ],
    outcome: 'Waypoint is now the production design system for Cohere\'s North product and the foundation for external client deliveries. The token sync pipeline eliminated manual handoff drift. Sherpa changed how designers find answers. The system is still evolving. I\'m still building it.',
    heroAsset: '/projects/waypoint.mp4',
    nextSlug: 'statespace',
  },

  {
    id: 'statespace',
    slug: 'statespace',
    type: 'full',
    name: 'Statespace',
    tagline: 'AI coaching platform for 30M+ players',
    year: '2019–2022',
    role: 'Product Design Lead, owned the full product design function',
    hook: 'Aim Lab started as a free aim trainer. By the time I joined we had 30 million users and a real question: how do you turn a tool into a training system? The difference is personalization. A tool does the same thing for everyone. A training system learns who you are and gets better at making you better. That gap is the entire product strategy.',
    hardPart: 'The tension was between depth and accessibility. The most effective training features required users to understand concepts like target acquisition speed and flick accuracy. Concepts that even experienced players didn\'t have language for. The wrong answer was to hide the complexity. The right answer was to build a vocabulary for it: translate the performance model into language users could act on, then let them graduate into the full data over time.',
    decisions: [
      {
        title: 'Skill model as the foundation',
        body: 'We defined a skill taxonomy of the discrete components of aiming performance and built every feature on top of it. This gave the product a coherent vocabulary and meant every new feature could be positioned within a framework users already understood. When the AI coaching surfaced a recommendation, it connected to a specific skill gap rather than just telling users to practice more.',
        artifact: '/projects/statespace.mp4',
      },
      {
        title: 'Progressive disclosure of data',
        body: 'New users see simple scores. Advanced users see the full performance model. The same data, different views, controlled by engagement level rather than a settings toggle. Users graduated into complexity naturally, without us deciding when they were ready. The system inferred readiness from behavior.',
      },
      {
        title: 'The coaching arc',
        body: 'Individual sessions weren\'t enough. We designed a progression arc: assessment, targeted practice, benchmark. That cycle repeated on weekly and monthly cadences. Users weren\'t just playing Aim Lab. They were on a training program with a structure they could see and measure themselves against.',
        artifact: '/projects/statespace.mp4',
      },
      {
        title: 'Statespace x Kernel integration',
        body: 'When we partnered with Kernel to integrate their Flow neural interface, I led the UX for surfacing cognitive metrics alongside performance data. Cognitive load scores and focus indices meant nothing to gamers. We mapped them to performance language users already understood: peak focus window became optimal training window, high cognitive load became a signal to take a break. The data didn\'t change. The framing did.',
        artifact: '/projects/kernel.mp4',
      },
    ],
    outcome: 'Aim Lab reached 30M+ registered users. The training system model became the differentiator, and the core of the $50M Series B. The Kernel integration was covered by VentureBeat and became the opening move in the cognitive performance category Statespace was building.',
    heroAsset: '/projects/statespace.mp4',
    nextSlug: 'channel',
  },

  {
    id: 'channel',
    slug: 'channel',
    type: 'full',
    name: 'Channel AI',
    tagline: 'AI-native creative tools for content teams',
    year: '2023–2025',
    role: 'Design Engineer (design system, core product, AI interaction patterns)',
    hook: 'Channel was building AI writing tools when every AI writing tool looked the same: text box, generate, copy. The problem wasn\'t the model. It was the interaction model. Generate-and-copy treats AI as a vending machine. Channel was trying to build something you could actually think with.',
    hardPart: 'The hardest design problem was latency. Streaming responses feel broken when the UI isn\'t designed for them. Every interaction pattern had to be rebuilt from first principles for a streaming-first world: how you show thinking, how you show streaming, how you handle errors, how you invite iteration. None of the patterns from static form UX applied. Everything stayed broken until we stopped adapting existing patterns and started designing for how the model actually worked.',
    decisions: [
      {
        title: 'Streaming-first interaction model',
        body: 'We designed every state in the response lifecycle: thinking, streaming, complete, error, and the various iteration states (refining, expanding, trying again). Each state had distinct visual language so users always knew where they were in the process. The most important state was thinking. Most products treated it as a blank waiting period. We made it legible as a process, not an absence.',
        artifact: '/projects/channelai.mp4',
      },
      {
        title: 'Multi-variation output',
        body: 'Single outputs created friction. Users would get one response, decide it was wrong, and start over. We designed a variation model where the AI produces two or three distinct interpretations simultaneously. Users pick the closest one and refine from there rather than starting from nothing. Once you show people options, they stop wanting to work without them.',
        artifact: '/projects/channelai.mp4',
      },
      {
        title: 'Context as a first-class concept',
        body: 'The AI was only as good as the context it had. We built a persistent context panel where users could attach brand voice, tone guidelines, previous work, and reference material. This shifted the mental model from "AI writes for me" to "AI writes with everything it knows about me." The shift from interaction to inference. The system stops asking and starts knowing.',
        artifact: '/projects/channelai.mp4',
      },
    ],
    outcome: 'Channel shipped to production serving content teams across marketing, editorial, and product functions. The streaming interaction patterns became the foundation for every AI feature in the product. The multi-variation model had higher completion rates than single-output alternatives. Once users worked with variations, they didn\'t go back.',
    heroAsset: '/projects/channelai.mp4',
    nextSlug: 'seudo',
  },

  {
    id: 'seudo',
    slug: 'seudo',
    type: 'full',
    name: 'Seudo AI',
    tagline: 'Voice-first brainstorming with AI clustering',
    year: '2023–present',
    role: 'Design Engineer, solo, built from zero',
    hook: 'Most brainstorming tools are note-taking apps with a new name. Seudo started from a different premise: what if the AI was present during the brainstorm itself, not just available after? Voice input removes the friction of typing. Real-time clustering surfaces connections you might miss while still speaking. The tool thinks alongside you.',
    hardPart: 'Voice input is fast and messy. The AI clustering needed to keep up without overwhelming users with reorganization while they were still thinking. Getting the timing right required iteration with real users: when to surface a new cluster, when to let ideas accumulate before organizing them, and how to signal that the system is working without pulling attention away from the thought in progress.',
    decisions: [
      {
        title: 'Voice as the primary input, not an add-on',
        body: 'Typing interrupts thought. Voice is how people actually brainstorm. Building voice as the primary modality meant rethinking every part of the UI. There is no cursor, no text field focus, no submit button. The interface had to feel ambient. The visual layer is a consequence of the voice layer, not the other way around.',
        artifact: '/projects/seudo.mp4',
      },
      {
        title: 'Real-time clustering without interruption',
        body: 'The AI clusters ideas as they arrive but doesn\'t surface reorganizations until natural pauses. This prevents the feeling that the system is constantly rearranging things while you\'re still thinking. The clustering is continuous. The UI updates are gated. Users experience the intelligence, not the process.',
      },
      {
        title: 'Spatial mapping of idea relationships',
        body: 'Text lists hide relationships. Every idea is mapped spatially, with proximity indicating semantic similarity. As clusters form, the map self-organizes: ideas that belong together drift together. Users see the shape of their thinking, not just its content. The insight surfaces in the layout, not the text.',
        artifact: '/projects/seudo.mp4',
      },
    ],
    outcome: 'Users organized ideas 35% faster in testing. The clustering consistently surfaced connections users said they hadn\'t consciously made. The description that came up most often in sessions: "thinking out loud with someone who\'s actually listening." Still building.',
    heroAsset: '/projects/seudo.mp4',
    nextSlug: 'wafer',
  },

  {
    id: 'wafer',
    slug: 'wafer',
    type: 'full',
    name: 'Wafer Systems',
    tagline: 'AI-native OS: product, visual and UX design',
    year: '2024–present',
    role: 'Design Lead (product, visual, and UX design)',
    hook: 'Wafer is reimagining the smartphone OS from the ground up for an AI-native world. The premise: apps are the wrong abstraction. Instead of siloed apps that don\'t share context, Wafer builds a unified context layer that understands what you\'re doing across everything and surfaces the right capability at the right moment. The question stops being "which app do I open?" It becomes "what do I need right now?"',
    hardPart: 'Designing for an OS that doesn\'t exist yet, on hardware that isn\'t shipping yet, for users who don\'t know they want it yet. The design had to be specific enough to be buildable and principled enough not to be wrong when the constraints changed. Every decision would be validated or invalidated by hardware that didn\'t exist. So the work was to build patterns, not pixels.',
    decisions: [
      {
        title: 'Context layer as the core metaphor',
        body: 'Instead of designing apps, we designed the context layer: the surface that sits above everything and understands user intent. This meant designing states, transitions, and affordances for a system that\'s always present but rarely front-and-center. The design challenge isn\'t what it looks like when you\'re using it. It\'s what it looks like when it interrupts you at exactly the right moment.',
        artifact: '/projects/wafer.mp4',
      },
      {
        title: 'Proactive over reactive',
        body: 'Traditional mobile UI is reactive. You open an app, you do a thing. Wafer\'s UI is proactive. The system anticipates and surfaces. Designing for proactivity required rethinking every interaction model. The question stopped being "what does the user do next?" and became "what does the user need before they know they need it?" That\'s the context inference problem at the OS level. Magic Ink, but for everything.',
      },
      {
        title: 'Component library for an AI OS',
        body: 'An AI-native OS surfaces in wildly different contexts: a cooking timer, a meeting note, a driving direction. The components had to feel like they belonged to the same coherent system regardless of where they appeared. I built 12 categories of components with a unified visual language for exactly that constraint. The goal: users should feel the system before they understand it.',
        artifact: '/projects/wafer.mp4',
      },
    ],
    outcome: 'A full component system and interaction model for Wafer\'s context layer. The design is shaping how the team thinks about the product, not just how it looks. The OS is in active development. The design work continues as hardware constraints sharpen and the scope of the context layer expands.',
    heroAsset: '/projects/wafer.mp4',
    nextSlug: 'sherpa',
  },

  {
    id: 'sherpa',
    slug: 'sherpa',
    type: 'full',
    name: 'Sherpa',
    tagline: 'RAG-based Figma plugin for design system Q&A',
    year: '2025',
    role: 'Staff Design Engineer, designed and built solo',
    hook: 'A design system is only as good as its adoption. The bottleneck at Cohere wasn\'t the components. It was that designers couldn\'t find what they needed fast enough. They\'d open Figma, try to remember the right component name, give up, and build something custom. A plugin that answered questions about Waypoint in natural language removed the friction between having a system and actually using it.',
    hardPart: 'RAG quality is highly sensitive to how you chunk and embed documentation. Early versions surfaced technically correct but contextually wrong answers: the right component for the wrong use case. Getting retrieval quality right required rethinking the documentation structure itself, not just the pipeline. If the documentation was vague, the answers were vague. The AI was a mirror of the documentation quality.',
    decisions: [
      {
        title: 'Embedding at the component level',
        body: 'Rather than embedding full documentation pages, each component\'s usage guidelines, variants, and do/don\'t examples were embedded as separate chunks. This made retrieval more precise: a query about spacing would surface spacing tokens, not the entire layout section. The unit of retrieval had to match the unit of the question.',
        artifact: '/projects/sherpa.mp4',
      },
      {
        title: 'Context-aware response generation',
        body: 'Responses aren\'t retrieved text. They\'re generated answers grounded in retrieved chunks. command-r-plus synthesizes the relevant documentation into a direct answer with component names, variant recommendations, and links to the relevant Figma frames. The difference between search and Sherpa is that search returns a document. Sherpa returns an answer.',
      },
      {
        title: 'Figma-native UX',
        body: 'The plugin had to feel like it belonged in Figma, not like a chat window dropped in from elsewhere. The interaction model mirrors how designers already talk about decisions: "what should I use for this?" rather than searching for component names. The context is Figma. The language should be too. A plugin that forces designers to think in system vocabulary defeats the point.',
        artifact: '/projects/sherpa.mp4',
      },
    ],
    outcome: 'Sherpa is in use by the Cohere design team. The clearest signal: designers stopped asking for component guidance in Slack. When a tool becomes the first place people go, you\'ve removed a friction that was real. It\'s now the primary way new designers learn the system.',
    heroAsset: '/projects/sherpa.mp4',
    nextSlug: 'waypoint-sync',
  },

  // --- QUICK TAKES ---
  {
    id: 'waypoint-sync',
    slug: 'waypoint-sync',
    type: 'quick',
    name: 'waypoint-sync',
    tagline: 'Two-way Figma-to-code token pipeline',
    year: '2025',
    role: 'Staff Design Engineer, built solo',
    hook: 'Design tokens drift between Figma and code. It always happens. The designer updates a color, the engineer has a different version, the gap widens until someone manually reconciles it. waypoint-sync is a CLI tool that makes the design file the source of truth the codebase reads from directly.',
    decisions: [
      {
        title: 'design-map.json as the contract',
        body: 'A single JSON file maps every Figma variable to its CSS custom property and Tailwind counterpart. The CLI reads this map and syncs in either direction: push code changes to Figma, or pull Figma changes to code. One source of truth, two directions. The design file stops being a spec and starts being an API.',
      },
      {
        title: 'Claude Code and Cursor as the runtime',
        body: 'Rather than building a custom sync engine, I use Claude Code and Cursor as the execution layer. The design-map.json is the spec and the AI handles the actual file operations. This keeps the tool lightweight and maintainable. The finding: you don\'t need custom tooling when the spec is precise enough for the model to execute against.',
        artifact: '/projects/waypoint-sync.mp4',
      },
    ],
    outcome: 'Manual token sync eliminated across the Waypoint system. Design and code stay in sync with a single CLI command. Being adopted as the standard for token management on the Cohere design team.',
    heroAsset: '/projects/waypoint-sync.mp4',
    nextSlug: 'kernel',
  },

  {
    id: 'kernel',
    slug: 'kernel',
    type: 'quick',
    name: 'Statespace x Kernel',
    tagline: 'Gaming meets neurotech: neural data UX',
    year: '2021–2022',
    role: 'Product Design Lead (integration UX and data visualization)',
    hook: 'Kernel Flow measures cognitive load and focus in real time using a neural interface. Integrating it with Aim Lab meant designing a UX that made neuroscience data legible and actionable for gamers, not researchers. The data was sophisticated. The interface had to be the opposite.',
    decisions: [
      {
        title: 'Translating neural metrics to performance language',
        body: 'Cognitive load scores and focus indices meant nothing to gamers. We mapped them to familiar performance concepts: peak windows, recovery periods, warm-up states. Users could act on the data without needing to understand the neuroscience behind it. The translation layer was the entire design problem.',
      },
      {
        title: 'Ambient by default',
        body: 'The neural data had to enhance training without adding friction. We designed it as an ambient layer: visible when you want it, invisible when you\'re in the zone. The worst version of this feature would make you think about your brain while you\'re trying to train.',
        artifact: '/projects/kernel.mp4',
      },
    ],
    outcome: 'Shipped and covered by VentureBeat. The cognitive performance angle became a real differentiator for Statespace and part of the $50M Series B story.',
    heroAsset: '/projects/kernel.mp4',
    nextSlug: 'mushroom',
  },

  {
    id: 'mushroom',
    slug: 'mushroom',
    type: 'quick',
    name: 'Mushroom',
    tagline: 'LLM-powered voice interfaces',
    year: '2022–2023',
    role: 'Product Design Engineer (voice UX and conversational interface design)',
    hook: 'Mushroom was building LLM-powered voice interfaces before voice AI was mainstream. The design challenge was fundamental: there is no screen. No cursor, no button, no text field. The interface is entirely audio. The feedback is entirely acoustic.',
    decisions: [
      {
        title: 'Designing for ears, not eyes',
        body: 'Every interface decision was evaluated aurally first. Response length, pacing, confirmation patterns: all optimized for how they sound, not how they look. The standard UX toolkit doesn\'t exist for voice. We built our own evaluation methods from scratch.',
      },
      {
        title: 'Conversational state management',
        body: 'Voice conversations carry context that text doesn\'t: tone, pace, interruptions. We designed a state model that accounted for these signals and let the interface adapt to the emotional and practical context of each interaction. A user who sounds frustrated gets a different response pattern than one who sounds engaged.',
        artifact: '/projects/mushroom.jpg',
      },
    ],
    outcome: 'Shipped production voice interfaces across multiple products. The key finding on latency: users\' threshold for feeling understood is far lower with voice than text. A 200ms response feels intelligent. A two-second response feels broken, regardless of what it says.',
    heroAsset: '/projects/mushroom.jpg',
    nextSlug: 'cohere-labs',
  },

  {
    id: 'cohere-labs',
    slug: 'cohere-labs',
    type: 'quick',
    name: 'Cohere Labs',
    tagline: 'Prototyping new UX flows for model capabilities',
    year: '2025–present',
    role: 'Staff Design Engineer (prototype design and build)',
    hook: 'New model capabilities need UX before they have products. Cohere Labs is where I prototype the interaction patterns for features coming out of research: turning model capabilities into experiences that product teams can evaluate, iterate on, and eventually ship.',
    decisions: [
      {
        title: 'Prototype fidelity calibrated to the question',
        body: 'Not all prototypes need to be high fidelity. I build at the fidelity the question requires: sometimes a rough interactive mock to test whether the capability is even understandable, sometimes a near-production component to test whether the implementation is right. Building at the wrong fidelity wastes time and produces misleading signals.',
      },
      {
        title: 'UX as a research input',
        body: 'The prototypes feed back into model development. How users interact with a capability surfaces edge cases and failure modes that pure model evaluation misses. Design and research are a closed loop. The prototype isn\'t just a deliverable. It\'s a measurement instrument.',
        artifact: '/projects/cohere-labs.mp4',
      },
    ],
    outcome: 'Several prototypes have shipped to production or directly shaped what shipped. The more valuable output is often the failure cases: understanding what users cannot make sense of at all helps the research team know what to improve in the model before it reaches product.',
    heroAsset: '/projects/cohere-labs.mp4',
    nextSlug: 'waypoint',
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find(cs => cs.slug === slug)
}

export function getAllSlugs(): string[] {
  return CASE_STUDIES.map(cs => cs.slug)
}
