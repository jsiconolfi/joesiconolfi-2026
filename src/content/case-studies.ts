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
    role: 'Staff Design Engineer',
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
    hook: 'How do you turn a tool into a training system? A tool does the same thing for everyone. A training system learns who you are and gets better at making you better. That distinction sounds simple. Executing it is not. Aim Lab had 30 million users when I joined. The product used AI to adapt training difficulty, identify per-user performance patterns, and surface the specific skills holding each player back. The design question was never "what should this screen look like." It was: how do we know if this training actually made someone better? And how do we communicate that to a user in a way they can act on?',
    hardPart: 'The most effective features required users to understand concepts most players didn\'t have language for. Cognitive load, reaction time variance, decision speed under pressure: real, measurable, meaningful things that mean nothing to someone who just thinks they need to aim better. The wrong answer was to hide the complexity. The right answer was to build a vocabulary for it. Translate the performance model into language users could act on, then let them graduate into the full data as they engaged more deeply. Progressive disclosure not controlled by a settings toggle, but by demonstrated understanding. The system inferred where you were and gave you what you were ready for.',
    decisions: [
      {
        title: 'Skill taxonomy as the foundation',
        body: 'Before any UI, I built a model of the skills the product was training and how they related to each other. Every feature mapped to this taxonomy. This gave the product a coherent vocabulary and meant every AI recommendation connected to a specific skill gap rather than just telling users to practice more.',
        artifact: '/projects/statespace.mp4',
      },
      {
        title: 'Progressive disclosure driven by behavior',
        body: 'New users see simple scores. Advanced users see the full performance model. The same data, different views, controlled by engagement level rather than a settings toggle. Users graduated into complexity naturally. The system inferred readiness from behavior rather than asking users to configure it.',
      },
      {
        title: 'The coaching arc',
        body: 'Individual sessions were not enough. I designed a progression arc: assessment, targeted practice, benchmark, on weekly and monthly cadences. The temporal structure was itself a design decision. It created the sense of a training program with momentum, not just a collection of drills. Users were on a program. They could see their progress and measure themselves against it.',
        artifact: '/projects/statespace.mp4',
      },
      {
        title: 'Kernel neural interface integration',
        body: 'When we partnered with Kernel to integrate their Flow neural interface, I led the UX for surfacing cognitive metrics alongside performance data. Cognitive load scores and focus indices meant nothing to gamers. We mapped them to performance language users already understood: peak focus window became optimal training window, high cognitive load became a signal to take a break. The data did not change. The framing did.',
        artifact: '/projects/kernel.mp4',
      },
    ],
    outcome: 'Aim Lab reached 30M+ registered users. The training system model became the product differentiator and the core of the $50M Series B. The Kernel integration was covered by VentureBeat and became the opening move in the cognitive performance category Statespace was building.',
    heroAsset: '/projects/statespace.mp4',
    nextSlug: 'channel',
  },

  {
    id: 'channel',
    slug: 'channel',
    type: 'full',
    name: 'Channel AI',
    tagline: 'Making open-source AI feel like a consumer product',
    year: '2023–2025',
    role: 'Design Engineer, Product Design Lead',
    hook: 'The open-source AI ecosystem is vast, fragmented, and built for developers. Hundreds of image generation models, dozens of LLMs, each with their own interfaces, their own terminology, their own mental models. Channel\'s premise: all of that frontier model power, in your pocket, without the technical barrier. Think Hugging Face designed for consumers. The core product design challenge was not capability. The models were extraordinary. The challenge was making them feel approachable, coherent, and trustworthy to someone who has never heard of Stable Diffusion or Mistral.',
    hardPart: 'Open-source models are not a product. They are raw capability. Stitching together models that were never designed to coexist into a single consumer experience required building a design language from scratch. Every model had different inputs, different outputs, different failure modes. The interface had to abstract all of that without hiding what made each model interesting. Abstraction that erases capability is just dumbing it down. The goal was abstraction that makes capability legible.',
    decisions: [
      {
        title: 'Model exploration UX',
        body: 'The model landscape needed to feel explorable, not overwhelming. I designed a browsing and discovery system that surfaced models by what they do rather than what they are. Users don\'t want to choose between SDXL and Flux. They want to find the right tool for their intent. The interface translated technical model identities into approachable capability descriptions with honest previews of what each model actually produces.',
        artifact: '/projects/channelai.mp4',
      },
      {
        title: 'Dynamic model switching',
        body: 'Switching between models mid-workflow was a core behavior, not an edge case. I designed the switching interface so users could move between models without losing context or starting over. The output from one model could seed the input to another. This turned the fragmented open-source landscape into a connected creative workflow rather than a series of isolated tools.',
        artifact: '/projects/channelai.mp4',
      },
      {
        title: 'Streaming-first interaction model',
        body: 'Every state in the response lifecycle needed distinct visual language: thinking, streaming, complete, error, refining. The most important state was thinking. Most products treated it as a blank waiting period. We made it legible as a process, not an absence. On mobile, where generation takes longer and attention is less patient, this was especially critical.',
        artifact: '/projects/channelai.mp4',
      },
      {
        title: 'Trust through transparency',
        body: 'Open-source models are unfamiliar to most consumers. A model they\'ve never heard of producing unexpected output breeds distrust. I built transparency into the product at every level: showing which model produced which output, surfacing quality signals, and making it easy to understand why something looked the way it did. Trust is not a feature. It is a product design decision made across hundreds of small moments.',
      },
    ],
    outcome: 'Channel shipped to production on iOS. The model exploration and switching patterns became the core product interaction model. The work demonstrated what it looks like to design for the open-source AI ecosystem rather than a single hosted model: more complex, more honest, and ultimately more powerful for users who wanted real capability without the developer overhead.',
    heroAsset: '/projects/channelai.mp4',
    nextSlug: 'channel-nexus',
  },

  {
    id: 'channel-nexus',
    slug: 'channel-nexus',
    type: 'full',
    name: 'Channel AI: Nexus',
    tagline: 'Compare up to four AI models in one conversation',
    year: '2023–2025',
    role: 'Design Engineer, Product Design Lead',
    hook: `Choosing between AI models is hard when you can only talk to one at a time. Nexus was built to solve that: a single interface where you send one prompt and get responses from up to four models simultaneously. Part consumer product, part evaluation tool for companies assessing models against each other. The premise of LLM Arena, but designed as a coherent product rather than a benchmark leaderboard. The question it answered: which model actually gives the best answer for your specific use case?`,
    hardPart: `Displaying four simultaneous chat conversations without the interface becoming chaotic is harder than it sounds. Each model responds at a different speed, with different formatting tendencies, different response lengths, and different failure modes. A layout that works when all four models respond in two seconds falls apart when one streams for ten seconds and another errors out immediately. The interaction model had to hold together across every combination of response states, and had to make comparison feel natural rather than like reading four documents at once.`,
    decisions: [
      {
        title: 'The comparison layout',
        body: `Four panels in one viewport could have easily felt like a spreadsheet. The layout was designed to feel like a conversation first and a comparison second. Each model had its own visual lane with a consistent response container, but the prompt input was shared and central. You were talking to four models at once, not running four separate chats.`,
        artifact: '/projects/channel-nexus/comparison-layout.png',
      },
      {
        title: 'Handling response state divergence',
        body: `The hardest engineering and design problem was state divergence: one model is still thinking, one has finished streaming, one returned an error, and one gave a two-sentence answer. Each state needed distinct visual language so users could read the status of all four at a glance without hunting for it. Streaming, thinking, complete, and error states were designed to be legible in parallel, not just sequentially.`,
        artifact: '/projects/channel-nexus/state-divergence.png',
      },
      {
        title: 'Seamless model switching',
        body: `Beyond side-by-side comparison, users could swap any of the four models mid-conversation. The new model would enter the conversation with the existing context intact. This was both a product feature and a technical challenge: maintaining conversation state across model swaps without the experience feeling like starting over.`,
      },
      {
        title: 'Scalable component architecture',
        body: `Nexus was built end-to-end in TypeScript, Next.js, and Tailwind with reusability as a first principle. Every panel, input, state indicator, and response container was a composable component built for the flexibility that four simultaneous live data streams require. Complex state logic for auth, content reveals, and modal stacking was handled cleanly so the UI felt light even when a lot was happening underneath.`,
        artifact: '/projects/channel-nexus/components.png',
      },
    ],
    outcome: `Nexus shipped as both a consumer product and an enterprise model evaluation tool. The multi-model comparison pattern gave companies a practical way to assess open-source models against each other on real prompts, not synthetic benchmarks. The side-by-side format consistently changed how users thought about model selection: once you see four answers to the same question, single-model interfaces feel like a constraint.`,
    heroAsset: '/projects/channelai.mp4',
    nextSlug: 'channel-prism',
  },

  {
    id: 'channel-prism',
    slug: 'channel-prism',
    type: 'full',
    name: 'Channel AI: Prism',
    tagline: 'AI image generation that meets you where you are',
    year: '2023–2025',
    role: 'Design Engineer, Product Design Lead',
    hook: `AI image generation is powerful and inaccessible at the same time. The tools that produce the best results require prompt engineering expertise most people don't have and don't want to develop. Prism was built around a different premise: describe what you want in plain language, and let the system handle model selection and prompt crafting automatically. Think Sora from OpenAI, but designed for consumers rather than researchers. The goal was to put the full capability of the open-source image generation ecosystem in front of someone who has never heard of Stable Diffusion.`,
    hardPart: `Automatic model selection created a context-switching problem that was fundamentally a design challenge. When a user types "a moody portrait of a city at night" and the system selects a model and crafts a prompt on their behalf, the user needs to trust that selection and understand what happened. If the output doesn't match their expectation, they need a clear path to adjust it without learning the underlying model infrastructure. The interaction pattern after the prompt was submitted had to match what the user expected, not what the system actually did internally. Getting that handoff right was the hardest problem on the product.`,
    decisions: [
      {
        title: 'Automatic model selection via internal scoring',
        body: `Rather than asking users to choose a model, Prism used an internal scoring tool to evaluate the prompt against the available models and select the best fit automatically. The scoring logic weighed prompt type, stylistic signals, and model strengths. Users never saw the selection happen. They described what they wanted and got a result. The complexity was completely abstracted, but the output quality reflected real model intelligence rather than a random assignment.`,
        artifact: '/projects/channel-prism/model-selection.png',
      },
      {
        title: 'The post-prompt interaction model',
        body: `The moment after a user submits a prompt is where most image generation tools fail. A spinner, then an image. If it's wrong, start over. Prism was designed with a richer post-prompt experience: real-time loading states with visual feedback on generation progress, smooth image reveal animations that gave the result a sense of arrival, and immediately available remix and refinement options that let users stay in the creative flow rather than restart it.`,
        artifact: '/projects/channel-prism/post-prompt.png',
      },
      {
        title: 'Searchable gallery with remix',
        body: `The generated image gallery was not a passive history log. It was a discovery surface. Users could search across the entire gallery of AI-generated images, find work that was close to what they wanted, and remix it directly. This turned the gallery into a creative starting point rather than an archive. The search interface was designed for speed: a dynamic input bar that surfaced results as you typed, with a responsive grid optimized for visual browsing.`,
        artifact: '/projects/channel-prism/gallery.png',
      },
      {
        title: 'Component system and performance',
        body: `Prism was built in TypeScript, Next.js, and Tailwind with a fully reusable component system covering search, gallery display, generation states, and content interaction patterns. Mobile-first architecture was not an afterthought: the entire experience was designed for touch from the start, with accessible input patterns and a visual hierarchy that worked at every screen size.`,
      },
    ],
    outcome: `Prism shipped as a consumer image generation product. The automatic model selection removed the biggest barrier to entry for non-technical users without limiting what experienced users could do. The gallery and remix system turned generated content into a creative resource rather than a one-time output. The post-prompt interaction patterns became a reference point for how the team approached AI output states across the rest of the Channel product suite.`,
    heroAsset: '/projects/channelai.mp4',
    nextSlug: 'seudo',
  },

  {
    id: 'seudo',
    slug: 'seudo',
    type: 'full',
    name: 'Seudo AI',
    tagline: 'Voice-first brainstorming with AI clustering',
    year: '2024–present',
    role: 'Sole Designer + Engineer',
    hook: 'What if the AI was present during the brainstorm itself, not just available after? Voice removes the friction of typing. Real-time clustering surfaces connections you might miss while still speaking. Seudo was an attempt to design an AI brainstorming partner that did not make you stop to interact with it. It listened, clustered, and surfaced patterns in the background while you kept thinking out loud. Most brainstorming tools are note-taking apps with a different name. This was something else.',
    hardPart: 'Getting the timing right was everything. Interrupt too early and you break the person\'s train of thought. Interrupt too late and the insight has passed. The interaction model had to be designed around natural cognitive rhythms, not UI conventions. There were no established patterns for this. The design work was fundamentally about when the system speaks, not what it says.',
    decisions: [
      {
        title: 'Voice as primary input, not add-on',
        body: 'No cursor, no text field, no submit button. The absence of those affordances was itself the design statement: this is a different kind of interface. Building voice as the primary modality meant rethinking every part of the UI from first principles. The visual layer is a consequence of the voice layer, not the other way around.',
        artifact: '/projects/seudo.mp4',
      },
      {
        title: 'Clustering gated to natural pauses',
        body: 'Rather than surfacing clusters continuously, the system waited for the user to pause, then offered a synthesis. The clustering was continuous. The UI updates were gated. Users experienced the intelligence, not the process. This preserved cognitive flow while still making the AI\'s presence felt.',
      },
      {
        title: 'Spatial mapping with proximity indicating semantic similarity',
        body: 'Ideas that were conceptually close appeared near each other on the canvas. The layout was a live argument about how the ideas related, not a chronological transcript. As clusters formed, the map self-organized. Users saw the shape of their thinking, not just its content. The insight surfaced in the layout.',
        artifact: '/projects/seudo.mp4',
      },
    ],
    outcome: '35% faster idea organization in user testing. But the more interesting finding was qualitative: users described it as "thinking out loud with someone who\'s actually listening." That description is a precise articulation of what good AI collaboration should feel like: present, responsive, but not interruptive. The interface disappeared into the thinking process rather than demanding attention alongside it. That is the Magic Ink principle applied to voice. The ideal interface already knows when to speak and when to stay quiet. Still building.',
    heroAsset: '/projects/seudo.mp4',
    nextSlug: 'wafer',
  },

  {
    id: 'wafer',
    slug: 'wafer',
    type: 'full',
    name: 'Wafer Systems',
    tagline: 'AI-native OS: product, visual and UX design',
    year: '2025–present',
    role: 'Design Lead (product, visual, and UX design)',
    hook: 'Apps are the wrong abstraction. They require you to know which app contains the capability you need, navigate to it, and then operate it. That model made sense when software was a collection of discrete tools. It does not make sense when a device knows your location, your calendar, your current task, your recent conversations, and your flight departure time. Wafer is a design exploration of what an OS-level intelligence looks like: a context layer that understands what you are doing across everything and surfaces the right capability at the right moment. The question stops being "which app do I open?" It becomes "what do I need right now?"',
    hardPart: 'You cannot do traditional user research on a product category that isn\'t in the market. There were no users to test with, no competitors to reference, no prior art to learn from. The design had to be principled rather than prescriptive: establish the patterns and the vocabulary, not the final pixels. Every decision would be validated or invalidated by hardware that didn\'t exist yet. The central design challenge: what does it look like when the system interrupts you at exactly the right moment? Too early is noise. Too late is useless. The interrupt model is the entire product. Get it wrong and the system feels intrusive. Get it right and it feels like the device finally understands you.',
    decisions: [
      {
        title: 'The interrupt model',
        body: 'The most important design work was defining when the system surfaces. Not a notification. Not a suggestion. Something that feels like a natural extension of what you were already doing. If the system knows your flight is in two hours, your calendar should already look different. The data exists. The inference is the design problem. This is Magic Ink at the OS level: every surface evaluated through the lens of what the interface already knows and whether it\'s using that knowledge.',
        artifact: '/projects/wafer.mp4',
      },
      {
        title: 'Proactive over reactive',
        body: 'Traditional mobile UI is reactive. You open an app, you do a thing. Wafer\'s UI is proactive. Designing for proactivity required rethinking every interaction model from scratch. The question stopped being "what does the user do next?" and became "what does the user need before they know they need it?" That required a new class of UI pattern that didn\'t exist before this work.',
      },
      {
        title: '12 component categories, one visual language',
        body: 'People, Conversations, Travel, Home, Entertainment, Money, Email: wildly different contexts, same underlying design language. The consistency across contexts was the trust signal. When the system surfaces in an unfamiliar situation it needs to feel immediately recognizable. I built 12 component categories with unified visual language for exactly that constraint. Users should feel the system before they understand it.',
        artifact: '/projects/wafer.mp4',
      },
    ],
    outcome: 'A full component system and interaction model for Wafer\'s context layer. The design is actively shaping how the team thinks about the product. The OS is in development. The design work continues as hardware constraints sharpen and the scope of what the context layer can do expands.',
    heroAsset: '/projects/wafer.mp4',
    nextSlug: 'sherpa',
  },

  {
    id: 'sherpa',
    slug: 'sherpa',
    type: 'full',
    name: 'Sherpa',
    tagline: 'RAG-based Figma plugin for design system Q&A',
    year: '2026',
    role: 'Staff Design Engineer',
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
    name: 'Waypoint-sync',
    tagline: 'Two-way Figma-to-code token pipeline',
    year: '2026',
    role: 'Staff Design Engineer',
    hook: 'Design tokens drift between Figma and code constantly. The standard solution: manual handoff, docs, hoping engineers update their Tailwind config. It does not scale. The deeper problem is that a design system is not a set of files. It is a living set of decisions. Those decisions need to stay synchronized across every medium where they exist, automatically, without requiring a human to remember to do it. waypoint-sync is the sync layer that makes that true.',
    decisions: [
      {
        title: 'design-map.json as the contract',
        body: 'A declarative JSON schema maps every Figma variable to its CSS custom property and Tailwind counterpart, tracking both primitive tokens (the raw oklch values in :root) and semantic tokens (the var() references that consume them). The schema is itself a design artifact: it defines the contract between design and code in a form a model can read and reason about. When a token changes in either direction, the sync layer propagates it. The design system becomes a model-in-the-loop artifact. Claude Code reads the mapping schema and can reason about changes, conflicts, and downstream effects.',
      },
      {
        title: 'Two-tier token architecture',
        body: 'Primitives are the raw values: --ds-gray-5 through --ds-gray-100 plus four alert colors. Semantics are the roles: --background, --primary, --border. Pulling a Figma change writes to the primitive layer only. The semantic layer inherits automatically through var(). A single token update propagates correctly through the entire design system without manual mapping.',
      },
      {
        title: 'AI-operated sync and parity checking',
        body: 'The scripts are designed to be invoked through natural language in Cursor and Claude Code. Rather than a custom sync engine, the design-map.json is the spec and the model handles the file operations. The system also scores design-to-code parity per component on a 0-100 scale, catching drift that manual review misses. It already found real drift in production: a --primary token divergence between Figma and code that had gone unnoticed.',
        artifact: '/projects/waypoint-sync.mp4',
      },
    ],
    outcome: 'Manual token sync eliminated across the Waypoint system. The pull workflow takes one command. The push workflow takes a natural language prompt. The design file stops being a spec and starts being an API. Being adopted as the standard for token management on the Cohere design team.',
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
    tagline: 'LLM-powered voice interfaces before there was a playbook',
    year: '2022–2023',
    role: 'Product Design Engineer (product design, voice UX, conversational interface design)',
    hook: 'Mushroom was building LLM-powered conversational and voice interfaces in 2022. Pre-ChatGPT mass awareness. There were no established design patterns for working with language models as a design material. No prior art for how users form intent with voice, how a model should respond to build trust over a conversation, how the interface should handle the gap between what someone said and what the model understood. The design challenge was not just building something. It was figuring out what to build at all.',
    decisions: [
      {
        title: 'The product design foundation',
        body: 'I worked on the full product design for conversational interfaces, which meant starting from questions most designers had never had to ask: how does a user form intent without a text field? How do you design for a medium where the feedback is acoustic, not visual? How do you build trust in a system the user cannot see or control? These were not interaction design questions. They were product design questions. The answers shaped everything downstream.',
      },
      {
        title: 'Designing for ears, not eyes',
        body: 'Every interface decision was evaluated aurally first. Response length, pacing, confirmation patterns: all optimized for how they sound, not how they look. The standard UX toolkit does not exist for voice. We built our own evaluation methods from scratch, testing against how responses actually felt to hear rather than how they looked in a doc.',
      },
      {
        title: 'Conversational state management',
        body: 'Voice conversations carry context that text does not: tone, pace, interruptions, hesitation. We designed a state model that accounted for these signals and let the interface adapt to the emotional and practical context of each interaction. A user who sounds frustrated gets a different response pattern than one who sounds engaged. This required designing at the model level, not just the UI level.',
        artifact: '/projects/mushroom.jpg',
      },
    ],
    outcome: 'Shipped production voice interfaces across multiple products. The key finding on latency: users\' threshold for feeling understood is far lower with voice than text. A 200ms response feels intelligent. A two-second response feels broken, regardless of what it says. The playbook we built became the foundation for everything that came after.',
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
