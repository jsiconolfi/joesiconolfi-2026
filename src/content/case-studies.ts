export type CaseStudyType = 'full' | 'quick'

export interface CaseStudyDecision {
  title: string
  body: string
  artifact?: string   // image/video path in /public/projects/
}

export interface CaseStudy {
  id: string          // matches project id in projects.ts
  slug: string        // URL slug — /work/[slug]
  type: CaseStudyType
  name: string
  tagline: string     // one line under the name
  year: string
  role: string        // specific, honest — "Staff Design Engineer" not "Led design"
  hook: string        // 2–3 sentences — the real problem and why it mattered
  hardPart?: string   // full case studies only — one genuine constraint/tension
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
    role: 'Staff Design Engineer — sole design engineer',
    hook: 'Cohere had no design system. Every team was building components independently, creating inconsistency across North, the flagship product, and every external delivery. I joined as the first design engineer and built Waypoint from scratch — tokens, components, documentation, and the tooling to keep design and code in sync.',
    hardPart: 'The hardest part wasn\'t building the components — it was getting adoption. Engineers had their own patterns. Designers had their own libraries. Making Waypoint the path of least resistance required as much product thinking as it did engineering.',
    decisions: [
      {
        title: 'Tokens first, components second',
        body: 'Before writing a single component I established the token architecture — a three-tier system of primitive, semantic, and component tokens mapped across Figma variables, CSS custom properties, and Tailwind config. This meant any component built on the system would automatically respond to theme changes.',
        artifact: '/projects/waypoint.mp4',
      },
      {
        title: 'waypoint-sync: two-way Figma-to-code pipeline',
        body: 'Manual token handoff was the biggest source of drift between design and code. I built waypoint-sync — a CLI tool that reads a design-map.json mapping Figma variable names to CSS custom properties and Tailwind keys, and syncs changes bidirectionally through Claude Code and Cursor.',
        artifact: '/projects/waypoint-sync.mp4',
      },
      {
        title: 'Sherpa: RAG-based documentation assistant',
        body: 'Documentation that nobody reads is worthless. I built Sherpa, a Figma plugin that lets designers query the Waypoint documentation in natural language using Cohere\'s embed-english-v3.0 and command-r-plus models with Pinecone as the vector store. Adoption of correct component usage went up measurably.',
        artifact: '/projects/sherpa.mp4',
      },
      {
        title: 'Packaging for external delivery',
        body: 'When RBC became a client needing Waypoint components, I scoped and kicked off the npm packaging work — consolidating icons, components, and tokens into a private package. This forced cleaner API design and better documentation than internal use alone would have demanded.',
      },
    ],
    outcome: 'Waypoint is now the production design system for Cohere\'s North product and the foundation for external client deliveries. The token sync pipeline eliminated manual handoff drift. Sherpa reduced the time designers spend hunting for component guidance. The system is still evolving — I\'m still building it.',
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
    role: 'Product Design Lead — owned the full product design function',
    hook: 'Aim Lab started as a free aim trainer. By the time I joined we had 30 million users and a real question: how do you turn a tool into a training system? The difference is personalization. A tool does the same thing for everyone. A training system learns who you are and gets better at making you better.',
    hardPart: 'The tension was between depth and accessibility. The most effective training features required users to understand concepts like target acquisition speed and flick accuracy — concepts that even experienced players didn\'t have language for. Designing for comprehension without dumbing it down was the constant challenge.',
    decisions: [
      {
        title: 'Skill model as the foundation',
        body: 'We defined a skill taxonomy — the discrete components of aiming performance — and built every feature on top of it. This gave the product a coherent vocabulary and meant every new feature could be positioned within a framework users already understood.',
        artifact: '/projects/statespace.mp4',
      },
      {
        title: 'Progressive disclosure of data',
        body: 'New users see simple scores. Advanced users see the full performance model. The same data, different views — controlled by engagement level rather than a settings toggle. Users graduated into complexity naturally.',
      },
      {
        title: 'The coaching arc',
        body: 'Individual sessions weren\'t enough. We designed a progression arc — assessment, targeted practice, benchmark — that repeated on weekly and monthly cadences. Users weren\'t just playing Aim Lab, they were on a training program.',
      },
      {
        title: 'Statespace × Kernel integration',
        body: 'When we partnered with Kernel to integrate their neural interface, I led the UX for mapping cognitive metrics (focus, cognitive load) onto the performance dashboard. The design challenge was making neuroscience data legible to gamers without medical framing.',
        artifact: '/projects/kernel.mp4',
      },
    ],
    outcome: 'Aim Lab reached 30M+ registered users. The training system model became the product\'s core differentiator and the foundation of the $50M Series B narrative. The Kernel integration was covered by VentureBeat and became a proof point for the cognitive performance category Statespace was building.',
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
    role: 'Design Engineer — design system, core product, AI interaction patterns',
    hook: 'Channel was building AI writing tools at a moment when every AI writing tool looked the same: chat box, output, copy button. The opportunity was to design AI collaboration that felt like working with a skilled partner rather than querying a database.',
    hardPart: 'The hardest design problem was latency. Streaming responses feel broken when the UI isn\'t designed for them. Every interaction pattern — how you show thinking, how you show streaming, how you handle errors, how you invite iteration — had to be rebuilt from first principles for a streaming-first world.',
    decisions: [
      {
        title: 'Streaming-first interaction model',
        body: 'We designed every state in the response lifecycle: thinking, streaming, complete, error, and the various iteration states (refining, expanding, trying again). Each state had distinct visual language so users always knew where they were in the process.',
        artifact: '/projects/channelai.mp4',
      },
      {
        title: 'Multi-variation output',
        body: 'Single outputs created friction — users would get one response, decide it was wrong, and start over. We designed a variation model where the AI produces 2–3 distinct interpretations simultaneously. Users pick the closest one and refine from there rather than starting from nothing.',
      },
      {
        title: 'Context as a first-class concept',
        body: 'The AI was only as good as the context it had. We built a context panel — a persistent space where users could attach brand voice, tone guidelines, previous work, and reference material. This shifted the mental model from "AI writes for me" to "AI writes with everything it knows about me."',
      },
    ],
    outcome: 'Channel shipped to production serving content teams across marketing, editorial, and product functions. The streaming interaction patterns became the foundation for all AI features across the product. The multi-variation model had measurably higher completion rates than single-output alternatives.',
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
    role: 'Design Engineer — solo, built from zero',
    hook: 'Most brainstorming tools are just note-taking apps with a new name. Seudo started from a different premise: what if the AI was present during the brainstorm itself, not just available after? Voice input removes the friction of typing, and real-time clustering surfaces connections the human might miss while still speaking.',
    hardPart: 'Voice input is fast and messy. The AI clustering needed to keep up without overwhelming the user with reorganization while they were still thinking. Getting the timing right — when to surface a new cluster, when to let ideas accumulate before making sense of them — required a lot of iteration with real users.',
    decisions: [
      {
        title: 'Voice as the primary input',
        body: 'Typing interrupts thought. Voice is how people actually brainstorm. Building voice as the primary modality (not an add-on) meant rethinking every part of the UI — there\'s no cursor, no text field focus, no submit button. The interface had to feel ambient.',
        artifact: '/projects/seudo.mp4',
      },
      {
        title: 'Real-time clustering without interruption',
        body: 'The AI clusters ideas as they arrive but doesn\'t surface reorganizations until natural pauses. This prevents the feeling that the system is constantly moving things around while you\'re still thinking. The clustering is continuous but the UI updates are gated.',
      },
      {
        title: 'Visual mapping of idea relationships',
        body: 'Text lists hide relationships. Every idea is mapped spatially, with proximity indicating semantic similarity. As clusters form, the map self-organizes — ideas that belong together drift together. Users see the shape of their thinking, not just its content.',
      },
    ],
    outcome: '35% faster organization of brainstorming sessions in user testing. Clearer thinking through smart clustering. Users consistently described the experience as "thinking out loud with someone who\'s actually listening." Still building.',
    heroAsset: '/projects/seudo.mp4',
    nextSlug: 'wafer',
  },

  {
    id: 'wafer',
    slug: 'wafer',
    type: 'full',
    name: 'Wafer Systems',
    tagline: 'AI-native OS — product, visual and UX design',
    year: '2024–present',
    role: 'Design Lead — product, visual, and UX design',
    hook: 'Wafer is reimagining the smartphone OS from the ground up for an AI-native world. The premise: apps are the wrong abstraction. Instead of siloed apps that don\'t talk to each other, Wafer builds a unified context layer that understands what you\'re doing across everything and surfaces the right capability at the right moment.',
    hardPart: 'Designing for an OS that doesn\'t exist yet, for hardware that isn\'t shipping yet, for users who don\'t know they want it yet. The design had to be specific enough to be buildable and vague enough not to be wrong.',
    decisions: [
      {
        title: 'Context layer as the core metaphor',
        body: 'Instead of designing apps, we designed the context layer — the surface that sits above apps and understands user intent. This meant designing states, transitions, and affordances for a system that\'s always present but rarely front-and-center.',
        artifact: '/projects/wafer.mp4',
      },
      {
        title: 'Proactive vs reactive UI',
        body: 'Traditional mobile UI is reactive — you open an app, you do a thing. Wafer\'s UI is proactive — the system anticipates and surfaces. Designing for proactivity required rethinking every interaction model: how do you design something that acts without being asked?',
      },
      {
        title: 'Component library for an AI OS',
        body: 'I built a full component library (12 categories) for Wafer\'s context-aware interface layer, with consistent dark purple aesthetic, DM Sans/DM Mono typography, and a recurring cast of characters to make the system feel coherent across wildly different contexts.',
      },
    ],
    outcome: 'Delivered a full component system and interaction model for Wafer\'s context layer. The work is ongoing — the OS is in early development with a target of shipping to Android early adopters.',
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
    role: 'Staff Design Engineer — designed and built solo',
    hook: 'A design system is only as good as its adoption. The bottleneck at Cohere wasn\'t the components — it was that designers couldn\'t find what they needed fast enough. A Figma plugin that answered questions about Waypoint in natural language removed the friction between having a system and using it.',
    hardPart: 'RAG quality is highly sensitive to how you chunk and embed documentation. Early versions surfaced technically correct but contextually wrong answers — the right component for the wrong use case. Getting the retrieval quality right required rethinking the documentation structure itself, not just the retrieval pipeline.',
    decisions: [
      {
        title: 'Embedding at the component level',
        body: 'Rather than embedding full documentation pages, each component\'s usage guidelines, variants, and do/don\'t examples were embedded as separate chunks. This made retrieval more precise — a query about spacing would surface spacing tokens, not the entire layout section.',
        artifact: '/projects/sherpa.mp4',
      },
      {
        title: 'Context-aware response generation',
        body: 'Responses aren\'t just retrieved text — they\'re generated answers grounded in the retrieved chunks. command-r-plus synthesizes the relevant documentation into a direct answer with component names, variant recommendations, and links to the relevant Figma frames.',
      },
      {
        title: 'Figma-native UX',
        body: 'The plugin had to feel like it belonged in Figma, not like a chat window dropped in from somewhere else. The interaction model mirrors how designers already talk about design decisions — "what should I use for this?" rather than "search: button variants."',
      },
    ],
    outcome: 'Sherpa is in use by the Cohere design team. Component adoption rate improved measurably after launch. Designers report spending significantly less time hunting through documentation or asking in Slack. It\'s become the primary way new designers learn the system.',
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
    role: 'Staff Design Engineer — built solo',
    hook: 'Design tokens drift between Figma and code. Waypoint-sync is a CLI tool that keeps them in sync bidirectionally through a design-map.json that maps Figma variable names to CSS custom properties and Tailwind config keys.',
    decisions: [
      {
        title: 'design-map.json as the source of truth',
        body: 'A single JSON file maps every Figma variable to its CSS and Tailwind counterpart. The CLI reads this map and either pushes code changes to Figma or pulls Figma changes to code. One source of truth, two directions.',
        artifact: '/projects/waypoint-sync.mp4',
      },
      {
        title: 'Claude Code + Cursor as the runtime',
        body: 'Rather than building a custom sync engine, I use Claude Code and Cursor as the execution layer — the design-map.json is the spec, and the AI handles the actual file operations. This keeps the tool lightweight and maintainable.',
      },
    ],
    outcome: 'Manual token sync eliminated across the Waypoint system. Design and code stay in sync with a single CLI command. The approach is being adopted as the standard for token management on the Cohere design team.',
    heroAsset: '/projects/waypoint-sync.mp4',
    nextSlug: 'kernel',
  },

  {
    id: 'kernel',
    slug: 'kernel',
    type: 'quick',
    name: 'Statespace × Kernel',
    tagline: 'Gaming meets neurotech — neural data UX',
    year: '2021–2022',
    role: 'Product Design Lead — integration UX and data visualization',
    hook: 'Kernel Flow is a neural interface that measures cognitive load and focus in real time. Integrating it with Aim Lab meant designing a UX that made neuroscience data legible and actionable for gamers — not researchers.',
    decisions: [
      {
        title: 'Translating neural metrics to performance language',
        body: 'Cognitive load scores and focus indices meant nothing to gamers. We mapped them to familiar performance concepts — peak windows, recovery periods, warm-up states — so users could act on the data without understanding the neuroscience.',
        artifact: '/projects/kernel.mp4',
      },
      {
        title: 'Non-intrusive integration',
        body: 'The neural data needed to enhance gameplay sessions without adding friction. We designed it as an ambient layer — visible when you want it, invisible when you\'re in the zone.',
      },
    ],
    outcome: 'The integration shipped and was covered by VentureBeat. It established Statespace\'s position in the cognitive performance category and contributed to the Series B narrative.',
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
    role: 'Product Design Engineer — voice UX and conversational interface design',
    hook: 'Mushroom was building LLM-powered voice interfaces before voice AI was mainstream. The design challenge was creating interfaces that felt natural for voice input — no screens, no buttons, just conversation.',
    decisions: [
      {
        title: 'Designing for ears, not eyes',
        body: 'Every interface decision was evaluated aurally first. Response length, pacing, confirmation patterns — all optimized for how they sound, not how they look. This required new design tools and new evaluation methods.',
        artifact: '/projects/mushroom.jpg',
      },
      {
        title: 'Conversational state management',
        body: 'Voice conversations have context that text doesn\'t — tone, pace, interruptions. We designed a state model that accounted for these signals and let the interface adapt to the emotional and practical context of each interaction.',
      },
    ],
    outcome: 'Shipped production voice interfaces for multiple use cases. The conversational design patterns developed at Mushroom became the foundation for subsequent voice AI work.',
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
    role: 'Staff Design Engineer — prototype design and build',
    hook: 'New model capabilities need UX before they have products. Cohere Labs is where I prototype the interaction patterns for features coming out of research — turning model capabilities into experiences that product teams can evaluate, iterate on, and eventually ship.',
    decisions: [
      {
        title: 'Prototype fidelity calibrated to the question',
        body: 'Not all prototypes need to be high fidelity. I build at the fidelity the question requires — sometimes a rough interactive mock to test if the capability is even understandable, sometimes a near-production component to test if the implementation is right.',
        artifact: '/projects/cohere-labs.mp4',
      },
      {
        title: 'UX as a research input',
        body: 'The prototypes feed back into model development — how users interact with a capability surfaces edge cases and failure modes that pure model evaluation misses. Design and research are a closed loop.',
      },
    ],
    outcome: 'Multiple prototypes shipped to production or informed production features. Established the design-research feedback loop as a standard practice for new capability development at Cohere.',
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
