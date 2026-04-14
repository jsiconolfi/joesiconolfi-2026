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
    hardPart: 'The hardest part wasn\'t building the components. It was getting adoption. I traced the failures to their actual source, which was not "the system is not good enough." It was three distinct failure modes, each requiring a different fix. Documentation dishonesty: if a developer hits a gap and the docs say the component exists but it doesn\'t, they lose trust and go off-system permanently. Discoverability: designers couldn\'t find what they needed fast enough and gave up. Governance without friction: token drift accumulated silently until it became a QA problem.',
    decisions: [
      {
        title: 'Tokens first, components second',
        body: 'Before writing a single component I established a three-tier token architecture: primitive tokens are the raw values (specific oklch color coordinates, numeric spacing values), semantic tokens are roles (surface, primary, border, destructive), and component tokens handle component-specific overrides. The tiers are what make theme changes and white-labeling work without rebuilding anything.',
        artifact: '/projects/waypoint.mp4',
      },
      {
        title: 'The RBC integration proved the architecture',
        body: 'When RBC came in as an external client needing Waypoint components with their own brand, they needed brand application without forking the library. Because the three-tier structure separates raw values from role assignments, we swapped the primitive and semantic layers for the RBC client context. The component layer was completely untouched. If the architecture had been flat, that would have been impossible without a fork. External delivery forces discipline that internal use doesn\'t. Every inconsistency becomes a contract violation.',
      },
      {
        title: 'Three scoped npm packages',
        body: 'Published as three independent packages: `@cohere-ai/waypoint-tokens`, `@cohere-ai/waypoint-icons`, `@cohere-ai/waypoint-components`. Separate packages so teams and clients can depend on only what they need, and versions evolve independently. North, RBC, and internal teams are on different update cadences. Monolithic packaging would have forced synchronized updates that served nobody.',
      },
      {
        title: 'Sherpa: solving discoverability with RAG',
        body: 'The bottleneck was not the components. It was that designers couldn\'t find what they needed fast enough. I built Sherpa, a Figma plugin that lets designers query Waypoint documentation in natural language using Cohere\'s embed-english-v3.0 and command-r-plus with Pinecone as the vector store. Embedded at the component level so a query about spacing surfaces spacing tokens, not the entire layout section. The real test was whether designers stopped asking the same questions in Slack. They did.',
        artifact: '/projects/sherpa.mp4',
      },
      {
        title: 'waypoint-sync: solving governance without friction',
        body: 'Manual token handoff was the biggest source of drift. I built waypoint-sync, a CLI tool that reads a design-map.json mapping Figma variable names to CSS custom properties and Tailwind keys, and syncs changes bidirectionally through Claude Code and Cursor. Parity scoring assigns a 0-100 score per component comparing Figma state to code state. It already found real divergence in production: a primary token that had drifted between Figma and the codebase over several weeks. Nobody had noticed.',
        artifact: '/projects/waypoint-sync.mp4',
      },
    ],
    outcome: 'Waypoint is now the production design system for Cohere\'s North product and the foundation for external client deliveries including RBC. The token sync pipeline eliminated manual handoff drift. Sherpa changed how designers find answers. The three failure modes of adoption each have a specific answer. The system is still evolving. I\'m still building it.',
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
    hook: '30 million users and a product that was optimizing for the wrong thing. Engagement metrics looked good. The training was not actually making people better because the AI was giving users what felt good: easy drills, comfortable difficulty, not what produced growth. The design challenge was changing what the AI optimized for, which meant changing the product thesis, not just the product design. The question was not "what should this screen look like." It was: how do we know if this training actually made someone better, and how do we communicate that to a user in a way they can act on?',
    hardPart: 'The most effective features required users to understand concepts most players did not have language for. Cognitive load, reaction time variance, decision speed under pressure: real, measurable, meaningful things that meant nothing to someone who just thought they needed to aim better. The wrong answer was to hide the complexity. The right answer was to build a vocabulary for it. Translate the performance model into language users could act on, then let them graduate into the full data as they engaged more deeply. Progressive disclosure not controlled by a settings toggle, but by demonstrated understanding. The system inferred where you were and gave you what you were ready for.',
    decisions: [
      {
        title: 'Skill taxonomy as the foundation',
        body: 'Before designing a single new feature, I built a model of every cognitive and motor skill the product was training and how they related. That taxonomy gave every AI recommendation a specific named target rather than just "practice more." Every feature mapped to this taxonomy. When the AI surfaced a recommendation, it connected to a specific skill gap the user already had language for.',
        artifact: '/projects/statespace.mp4',
      },
      {
        title: 'The coaching arc',
        body: 'Individual sessions were not enough. I designed a progression arc: assessment, targeted practice, benchmark, on weekly and monthly cadences. The temporal structure was itself a design decision. It created the sense of a training program with momentum, not just a collection of drills. Users were on a program. They could see their progress and measure themselves against it.',
        artifact: '/projects/statespace.mp4',
      },
      {
        title: 'Progressive disclosure driven by behavior',
        body: 'New users see simple scores. Advanced users see the full performance model. The same data, different views, controlled by engagement level rather than a settings toggle. Users graduated into complexity naturally. The system inferred readiness from behavior rather than asking users to configure it.',
      },
      {
        title: 'Kernel neural interface integration',
        body: 'When we partnered with Kernel to layer in neural interface data, the design problem was translating neuroscience into performance language gamers could act on. Peak focus window instead of EEG threshold. Optimal training window instead of cognitive load score. Same data, completely different frame. Users could make decisions from it without understanding what generated it. The data did not change. The framing did.',
        artifact: '/projects/kernel.mp4',
      },
    ],
    outcome: 'Aim Lab reached 30M+ registered users. The training system model became the product differentiator and the core of the $50M Series B. The Kernel integration was covered by VentureBeat. A tool does the same thing for everyone. A training system learns who you are and gets better at making you better. That distinction was the whole product.',
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
    hook: 'The open-source AI ecosystem is vast, fragmented, and built for developers. Hundreds of image generation models, dozens of LLMs, each with their own interfaces, terminology, and mental models. Channel\'s premise: all of that frontier model power, in your pocket, without the technical barrier. Think Hugging Face designed for consumers. The core product design challenge was not capability. The models were extraordinary. The challenge was making them feel approachable, coherent, and trustworthy to someone who has never heard of Stable Diffusion or Mistral. Abstraction that erases capability is dumbing it down. Abstraction that makes capability legible is product design.',
    hardPart: 'Open-source models are not a product. They are raw capability. Stitching together models that were never designed to coexist into a single consumer experience required building a design language from scratch. Every model had different inputs, different outputs, different failure modes. The interface had to abstract all of that without hiding what made each model interesting. Most AI products treat the response lifecycle as two states: loading spinner and answer. That is a missed design opportunity across the entire generative arc.',
    decisions: [
      {
        title: 'Streaming states as designed moments',
        body: 'I designed five distinct states for the response lifecycle: thinking, streaming, complete, error, and refining, each with specific visual language and interaction affordances. Making thinking legible as a process rather than as an absence changed how users related to the product. The shift from "waiting" to "accompanied" is a trust design decision, not a visual one. Each state also had specific interaction affordances because user agency does not switch off while the model is working.',
        artifact: '/projects/channelai.mp4',
      },
      {
        title: 'Model exploration by intent',
        body: 'The model landscape needed to feel explorable, not overwhelming. I designed a browsing and discovery system that surfaced models by what they do rather than what they are. Users do not want to choose between SDXL and Flux. They want to find the right tool for their intent. The interface translated technical model identities into approachable capability descriptions with honest previews of what each model actually produces.',
        artifact: '/projects/channelai.mp4',
      },
      {
        title: 'Dynamic model switching without losing context',
        body: 'Switching between models mid-workflow was designed as a core behavior, not an edge case. The output from one model could seed the input to another. This turned the fragmented open-source landscape into a connected creative workflow. Users described the product as "working with it, not using it." That shift is what the streaming state design was trying to produce.',
        artifact: '/projects/channelai.mp4',
      },
      {
        title: 'Trust through transparency',
        body: 'Open-source models are unfamiliar to most consumers. A model they have never heard of producing unexpected output breeds distrust. I built transparency into the product at every level: showing which model produced which output, surfacing quality signals, and making it easy to understand why something looked the way it did. Trust is not a feature. It is a product design decision made across hundreds of small moments.',
      },
    ],
    outcome: 'Channel shipped to production on iOS. The streaming state work became the foundation for every AI feature in the product. Every streaming state is either a designed moment or a broken one. There is no neutral.',
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
    hook: 'How do you display four simultaneous AI responses where each model is in a completely different state at any given moment: one streaming, one done, one errored, one still thinking, without the interface becoming unreadable or requiring users to context-switch between panels? Sequential chat UI is designed on the assumption that one thing happens at a time. That assumption is broken by any multi-agent workflow. Nexus was the product that forced a real answer to this problem.',
    hardPart: 'State divergence. A layout that works when all four models respond in two seconds falls apart when one streams for ten seconds and another errors out immediately. Each state needed distinct visual language so users could read the status of all four at a glance without hunting for it. The interaction model had to hold together across every combination of response states and make comparison feel natural rather than like reading four documents at once.',
    decisions: [
      {
        title: 'State as a separate visual layer from content',
        body: 'I separated state from content as independent visual layers. State indicators: thinking, streaming, complete, error, used motion and color to communicate state and were designed to be readable peripherally without requiring focused attention. The content layer rendered independently in each panel as it arrived. You could glance across all four panels and read the state of every model in under a second, then focus on the content of whichever panel interested you.',
        artifact: '/projects/channel-nexus/state-divergence.png',
      },
      {
        title: 'One conversation, four participants',
        body: 'Four panels in one viewport could have felt like a spreadsheet. The layout was designed to feel like a conversation first and a comparison second. The prompt input was shared and central. You were talking to four models at once, not running four separate chats. Seamless model switching mid-conversation preserved full context. The new model entered the conversation knowing everything that had come before.',
        artifact: '/projects/channel-nexus/comparison-layout.png',
      },
      {
        title: 'Scalable component architecture',
        body: 'Every panel, input, state indicator, and response container was a composable component built for the flexibility that four simultaneous live data streams require. TypeScript, Next.js, and Tailwind with reusability as a first principle. Complex state logic handled cleanly so the UI felt light even when a lot was happening underneath.',
        artifact: '/projects/channel-nexus/components.png',
      },
    ],
    outcome: 'Nexus shipped as both a consumer product and an enterprise model evaluation tool. The multi-model comparison pattern gave companies a practical way to assess open-source models against each other on real prompts, not synthetic benchmarks. Once users saw four answers to the same question, single-model interfaces felt like a constraint. If your UI assumes sequential state, you have already constrained what AI can do inside it.',
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
    hook: 'AI image generation required prompt engineering expertise most users did not have. The full capability of the open-source ecosystem was inaccessible behind a skills barrier. The design challenge: make that capability available to someone who has never heard of Stable Diffusion, without dumbing it down or hiding what made it powerful. Abstraction that erases capability is dumbing it down. Abstraction that makes capability legible is product design.',
    hardPart: 'The hardest design problem was the agentic handoff. When the system acts on your behalf and selects a model and crafts a prompt, the user needs to trust that decision and understand what happened. If the output does not match expectation, they need a clear path to adjust without learning the underlying infrastructure. The interaction pattern after the prompt was submitted had to match what the user expected, not what the system actually did internally. You do not need to understand what happened to correct it. The interface needs to give you handles, not explanations.',
    decisions: [
      {
        title: 'Automatic model selection via internal scoring',
        body: 'An internal scoring tool evaluated each user description against available models and selected the best fit automatically. The scoring logic weighed prompt type, stylistic signals, and model strengths. Users never saw the selection happen. They described what they wanted and got a result. The complexity was completely abstracted, but the output quality reflected real model intelligence.',
        artifact: '/projects/channel-prism/model-selection.png',
      },
      {
        title: 'The agentic handoff design',
        body: 'After generation, users could see which model produced the result and a plain-language description of why it was selected: not the scoring mechanics, but the intent-level reasoning. The redirect layer: modify the description, switch to manual selection, or pull a previous generation as a starting point. Two layers, not one. First: make the decision legible after the fact. Second: make it easy to redirect without needing to understand what happened. That handoff design is the core problem in every agentic experience.',
        artifact: '/projects/channel-prism/post-prompt.png',
      },
      {
        title: 'Searchable gallery with remix',
        body: 'The generated image gallery was not a passive history log. It was a discovery surface. Users could search across the entire gallery, find work close to what they wanted, and remix it directly. This turned generated content into a creative starting point rather than a one-time output. The search interface was designed for speed: a dynamic input bar that surfaced results as you typed, with a responsive grid optimized for visual browsing.',
        artifact: '/projects/channel-prism/gallery.png',
      },
    ],
    outcome: 'Prism shipped as a consumer image generation product. The automatic model selection removed the biggest barrier to entry for non-technical users without limiting experienced ones. The post-prompt interaction patterns became a reference point for how the team approached AI output states across the rest of the Channel product suite. The agentic handoff patterns are directly applicable to any AI experience where the system acts on the user\'s behalf.',
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
    hook: 'What if the AI was present during the brainstorm itself, not just available after? The premise is compelling. The design challenge is entirely about timing. Interrupt too early and you break the thought in progress. Interrupt too late and the moment has passed. That threshold is not a setting you configure. It is a model of the user\'s cognitive state. Most brainstorming tools are note-taking apps with a different name. This was an attempt to design something that thinks alongside you.',
    hardPart: 'Getting the timing right was everything. The interaction model had to be designed around natural cognitive rhythms, not UI conventions. There were no established patterns for this. The design work was fundamentally about when the system speaks, not what it says. The interface had to be aware of where the user was in their thinking, not just what they were saying.',
    decisions: [
      {
        title: 'Voice as primary input, not add-on',
        body: 'No cursor, no text field, no submit button. The absence of those affordances was itself the design statement: this is a different kind of interface that does not operate on the request-response model. Building voice as the primary modality meant rethinking every part of the UI from first principles. The visual layer is a consequence of the voice layer, not the other way around.',
        artifact: '/projects/seudo.mp4',
      },
      {
        title: 'Clustering gated to natural pauses',
        body: 'The clustering ran continuously in the background. UI updates were gated to natural pauses: moments of silence that indicated a completed thought rather than a processing pause. Users experienced the intelligence without experiencing the process. The AI\'s presence was felt without interrupting the thought in progress. Impressive makes the AI\'s capability visible. Useful makes the AI\'s capability felt without requiring you to watch it work.',
      },
      {
        title: 'Spatial mapping with proximity indicating semantic similarity',
        body: 'Ideas that were conceptually close appeared near each other on the canvas. The layout was a live argument about how the ideas related, not a chronological transcript. Users saw the shape of their thinking, not just its content. The insight surfaced in the layout.',
        artifact: '/projects/seudo.mp4',
      },
    ],
    outcome: '35% faster idea organization in user testing. The more important finding was qualitative: users described it as "thinking out loud with someone who is actually listening." That description is precise about what good AI collaboration should feel like: present, responsive, but not interruptive. The interface disappeared into the thinking process rather than demanding attention alongside it. The hardest proactive AI problem is not what to surface. It is when. The answer is a model of the user\'s cognitive state, not a setting. Still building.',
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
    hardPart: 'You cannot do traditional user research on a product category that isn\'t in the market. There were no users to test with, no competitors to reference, no prior art to learn from. The design had to be principled rather than prescriptive: establish the patterns and the vocabulary, not the final pixels. Every decision would be validated or invalidated by hardware that didn\'t exist yet.\n\nThe central design challenge: what does it look like when the system interrupts you at exactly the right moment? Too early is noise. Too late is useless. The interrupt model is the entire product. Get it wrong and the system feels intrusive. Get it right and it feels like the device finally understands you.',
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
    year: '2025',
    role: 'Staff Design Engineer, designed and built solo',
    hook: 'A design system is only as good as its adoption. The bottleneck at Cohere wasn\'t the components. It was discoverability. Designers couldn\'t find what they needed fast enough. They\'d open Figma, try to remember the right component name, give up, and build something custom. That inconsistency was eroding the system I was trying to build. Nobody asked me to fix it. A plugin that answered questions about Waypoint in natural language removed the friction between having a system and actually using it.',
    hardPart: 'RAG quality is highly sensitive to how you chunk and embed documentation. The first version used page-level chunks. The answers were technically accurate but contextually wrong: the right component for the wrong use case. A question about button variants would retrieve the entire button documentation page, and the model would generate an answer that was too general. The retrieval unit was larger than the question unit. The AI was a mirror of the documentation quality. Getting retrieval right required rethinking the documentation structure itself, not just the pipeline.',
    decisions: [
      {
        title: 'Chunking strategy as a design decision',
        body: 'When I moved to component-level chunking: usage guidelines, variants, and do/don\'t examples as separate embedded chunks, the retrieval precision matched the precision of the question. The model synthesized from three or four targeted chunks rather than one large page, and the answers became specific and actionable rather than generally correct. The unit of retrieval should match the unit of the question. Chunking strategy is a design decision, not an engineering one.',
        artifact: '/projects/sherpa.mp4',
      },
      {
        title: 'Context-aware response generation',
        body: 'Responses aren\'t retrieved text. They\'re generated answers grounded in retrieved chunks. command-r-plus synthesizes the relevant documentation into a direct answer with component names, variant recommendations, and links to the relevant Figma frames. The difference between search and Sherpa is that search returns a document. Sherpa returns an answer.',
      },
      {
        title: 'Documentation honesty as a prerequisite',
        body: 'The worst thing a design system does is pretend to be complete when it is not. Before Sherpa could work well, I had to rewrite documentation to explicitly acknowledge gaps: when something wasn\'t in Waypoint yet, the docs said so directly and explained how to build a compatible version in the meantime. Honesty is counterintuitive but it is what sustains trust. Designers would rather have an honest system with gaps than a dishonest system that claims to be complete.',
      },
      {
        title: 'Figma-native UX',
        body: 'The plugin had to feel like it belonged in Figma, not like a chat window dropped in from elsewhere. The interaction model mirrors how designers already talk about decisions: "what should I use for this?" rather than searching for component names. The context is Figma. The language should be too.',
        artifact: '/projects/sherpa.mp4',
      },
    ],
    outcome: 'Sherpa is in use by the Cohere design team. The clearest signal: designers stopped asking for component guidance in Slack. It\'s now the primary way new designers learn the system. The adoption problem I was solving was not unique to Cohere: any design system at scale has the same discoverability failure. The answer is not better documentation. It is better access to the documentation that already exists.',
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
    role: 'Staff Design Engineer, built solo',
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
    hook: 'Mushroom was building LLM-powered voice interfaces in 2022. Pre-ChatGPT mass awareness. No established patterns for how users form intent with voice, how a model builds trust over a conversation, how the interface handles the gap between what someone said and what the model understood. The design challenge was not just building something. It was figuring out what to build at all. There was no playbook. We built it.',
    decisions: [
      {
        title: 'The product design foundation',
        body: 'Starting from questions most designers had never had to ask: how does a user form intent without a text field? How do you design for a medium where the feedback is acoustic, not visual? How do you build trust in a system the user cannot see or control? These were not interaction design questions. They were product design questions. Every decision about the model\'s behavior was also a design decision. You could not separate them.',
      },
      {
        title: 'Designing for ears, not eyes',
        body: 'Every interface decision was evaluated aurally first. Response length, pacing, confirmation patterns: all optimized for how they sound, not how they look. The standard UX toolkit does not exist for voice. We built our own evaluation methods, testing against how responses actually felt to hear rather than how they read in a doc.',
      },
      {
        title: 'Conversational state management',
        body: 'Voice conversations carry context that text does not: tone, pace, interruptions, hesitation. We designed a state model that adapted to the emotional and practical context of each interaction. A user who sounds frustrated gets a different response pattern than one who sounds engaged. The prompt is evidence of interface failure. Every character a user has to type or say is an interaction the design failed to make unnecessary.',
        artifact: '/projects/mushroom.jpg',
      },
    ],
    outcome: 'Shipped production voice interfaces across multiple products. The key finding: 200ms response latency feels intelligent. Two seconds feels broken, regardless of what the response says. Users form their trust judgment before the answer arrives. That is a design constraint, not an engineering one. The ceiling shaped every design and pipeline decision downstream.',
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
    hook: 'New model capabilities arrive from research without interaction patterns. The team knows what the model can do. Nobody knows how users should experience it. That gap between capability and experience is a design problem, and if it is not solved before the capability ships, it gets solved badly after the fact. Design at the front of the decision, not the back.',
    decisions: [
      {
        title: 'Prototype fidelity calibrated to the question',
        body: 'Not all prototypes need to be high fidelity. I build at the fidelity the question requires: sometimes a rough interactive mock to test whether the capability is even understandable, sometimes a near-production component to test whether the implementation is right. Building at the wrong fidelity wastes time and produces misleading signals. The question determines the fidelity.',
      },
      {
        title: 'UX as a research input, not a design deliverable',
        body: 'The prototypes feed back into model development. How users interact with a capability surfaces edge cases and failure modes that pure model evaluation misses. When users cannot make sense of a capability at all, that information feeds back into how the model behavior is refined, not just how the UI is adjusted. The prototype is a measurement instrument. Design influencing model development, not just model presentation.',
        artifact: '/projects/cohere-labs.mp4',
      },
      {
        title: 'The proactive versus reactive question',
        body: 'Every capability I prototype starts with the same question: does this behavior surface before the user asks, or in response to it? That distinction determines the entire interaction model. Proactive surfaces require designing for timing and trust. Reactive surfaces require designing for legibility and control. Getting that question wrong at the prototype stage means the shipped product answers the wrong problem.',
      },
    ],
    outcome: 'Several prototypes have shipped to production or directly shaped what shipped. The failure cases are often the most valuable output: understanding what users cannot make sense of at all helps the research team know what to improve in the model before it reaches product. The prototype is not the deliverable. The learning is.',
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
