export type ExperimentStatus = 'in progress' | 'shipped' | 'archived' | 'ongoing'

export interface ExperimentStep {
  label: string
  done: boolean
}

export interface LabExperiment {
  id: string
  title: string
  description: string
  status: ExperimentStatus
  tags: string[]
  date: string
  url?: string
  notes?: string
  steps?: ExperimentStep[]
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'waypoint-sync-mcp',
    title: 'Waypoint-sync via Figma MCP',
    description: 'The question I started with: what if the design file was not the source of a handoff, but the source of truth the codebase reads from directly?\n\nThe Figma MCP console makes this possible in a way that was not practical before. Instead of exporting tokens, converting them, committing them, and reviewing drift, the pipeline becomes: designer changes a color token in Figma, the MCP reads it, waypoint-sync maps it to the correct CSS custom property and Tailwind config key, the code updates. No PR for a color change. No "did you sync the tokens" in code review.\n\nThe deeper finding is about what a design file actually is. For 15 years the design file has been a spec: a picture of what the code should look like. The MCP turns it into an API. The design file is now a live data source the codebase subscribes to. That changes what a design system fundamentally is.',
    status: 'in progress',
    tags: ['design systems', 'mcp', 'figma', 'automation'],
    date: '2026',
    notes: 'The design file stops being a spec and becomes an API. That changes what a design system fundamentally is.',
    steps: [
      { label: 'Pull: Figma variables to CSS custom properties', done: true },
      { label: 'Push: CSS changes back to Figma via MCP', done: true },
      { label: 'Parity scoring per component (0-100)', done: true },
      { label: 'Change report generation and channel logging', done: false },
      { label: 'Automated drift detection on PR', done: false },
    ],
  },
  {
    id: 'swirl-prompt-engineering',
    title: 'Protecting generative UI from model drift',
    description: 'The Swirl animation on this site went through 50+ Cursor sessions across several months. The challenge was not building it. It was keeping it intact.\n\nThe finding: LLMs cannot hold visual intent across long contexts. You can describe the animation in as much detail as you want, document every constant, write rules that say "do not modify this file." The model will still drift. It optimizes for what looks like correct code rather than what produces the correct visual output.\n\nThe solution was a canonical reference artifact. Not rules about the code, but an immutable file that represents the intended output. The model cannot modify it. Every session it gets the file and the instruction: this is what it should look like. Make changes elsewhere that stay loyal to this.\n\nThis is a general finding about working with LLMs on design artifacts: the model needs something to be loyal to, not just rules to follow. Rules describe constraints. The artifact describes intent. Intent survives context windows in a way that rules do not. Currently in the documentation phase, mapping the broader implications for how teams should structure AI-assisted design work.',
    status: 'ongoing',
    tags: ['prompt engineering', 'generative ui', 'cursor', 'llm'],
    date: '2025',
    notes: 'Rules describe constraints. Artifacts describe intent. Intent survives context windows better than rules do.',
    steps: [
      { label: 'Initial finding documented (canonical reference artifact)', done: true },
      { label: 'Pattern validated across 50+ sessions', done: true },
      { label: 'Applied to full portfolio site build', done: true },
      { label: 'Documentation and generalization in progress', done: false },
      { label: 'Publish findings as a lab post', done: false },
    ],
  },
  {
    id: 'beyond-chat',
    title: 'Designing beyond the chat interface',
    description: 'Every AI product defaults to a text box. Type a question, get an answer. This is the command-line era of AI interfaces: functional, powerful, and requiring the user to do all the work of formulating intent into language.\n\nVictor argued in 2006 that interactivity is a last resort. The best interface infers what you need from context and shows it without being asked. Chat is the opposite of that: it maximizes interactivity, requiring explicit input for every output.\n\nThe work I am doing with Seudo is the most direct exploration of this. Voice removes the typing friction but it is still interaction. The more interesting problem is inference: what does the interface know before you speak? The Swirl and orbital card system on this homepage is a small version: as you chat, relevant cards come forward without you clicking on them. You did not search for them. The system inferred relevance from the conversation.\n\nMost of the work right now is mapping what the future of interfaces looks like when they are not tied to a chat box. The patterns are starting to emerge.',
    status: 'in progress',
    tags: ['ai ux', 'interaction design', 'voice', 'ambient', 'inference', 'seudo'],
    date: '2025',
    notes: 'The best interface never asks. The second best interface asks once and remembers.',
    steps: [
      { label: 'Chat interface limitations documented', done: true },
      { label: 'Voice-first patterns explored via Seudo', done: true },
      { label: 'Inference-driven UI prototyped (orbital card system)', done: true },
      { label: 'Mapping post-chat interaction paradigms', done: false },
      { label: 'Pattern library for ambient AI interfaces', done: false },
    ],
  },
  {
    id: 'interrupt-model',
    title: 'The interrupt model: when should AI surface?',
    description: 'Working on Wafer has sharpened a question I keep returning to: when should an intelligent system interrupt you?\n\nToo early is noise. Too late is useless. The threshold between the two is the entire design problem. An OS-level context layer that knows your calendar, your current task, your recent conversations, and your location has extraordinary capability. But capability is not the hard part. The hard part is knowing when to use it.\n\nVictor framed this as the context inference problem in Magic Ink. The ideal interface already knows. But "already knows" only matters if the system also knows when to speak. A model that always answers is just another notification stream. A model that answers at exactly the right moment feels like it understands you.\n\nI am working on a framework for thinking about interrupt timing: the conditions under which a proactive surface adds value versus friction, how to design for the threshold rather than the capability, and what signals indicate that a user is in a receptive state versus a focused one.',
    status: 'in progress',
    tags: ['ai ux', 'wafer', 'ambient', 'proactive ui', 'inference'],
    date: '2025',
    notes: 'The interrupt model is the entire product. Get it wrong and the system feels intrusive. Get it right and it feels like it understands you.',
    steps: [
      { label: 'Problem defined and framed via Wafer work', done: true },
      { label: 'Component patterns for proactive surfaces designed', done: true },
      { label: 'Interrupt timing framework in progress', done: false },
      { label: 'User signal taxonomy (receptive vs focused states)', done: false },
      { label: 'Apply framework back to Wafer component system', done: false },
    ],
  },
  {
    id: 'model-in-the-loop-design',
    title: 'The model as a design system collaborator',
    description: 'Most design systems treat AI as a consumer: the system exists, the AI queries it. Sherpa does this. You ask, it answers. That is useful but it is still the old paradigm.\n\nThe more interesting direction is treating the model as a collaborator in the design system itself. waypoint-sync points at this: the design-map.json schema is written in a form the model can read and reason about. Claude Code and Cursor can invoke sync operations through natural language. The model is not just querying the system, it is operating it.\n\nThe question I am exploring: what does a design system look like when it is built to be model-readable from the start? Not just documented for humans, but structured so a model can reason about changes, catch drift, propose components based on usage patterns, and surface inconsistencies before they become bugs. The design system stops being a static spec and becomes a living inference engine.',
    status: 'in progress',
    tags: ['design systems', 'llm', 'waypoint', 'inference', 'ai'],
    date: '2026',
    notes: 'The design system stops being a static spec and becomes a living inference engine.',
    steps: [
      { label: 'design-map.json schema designed for model readability', done: true },
      { label: 'Natural language sync invocation via Claude Code and Cursor', done: true },
      { label: 'Parity checking via model-evaluated component specs', done: true },
      { label: 'Usage pattern analysis for component proposals', done: false },
      { label: 'Self-modifying documentation from model observations', done: false },
    ],
  },
  {
    id: 'voice-cognitive-rhythm',
    title: 'Designing for cognitive rhythm in voice interfaces',
    description: 'At Seudo and Mushroom I kept running into the same problem: timing is the entire design problem in voice interfaces. Not what you say. When you say it.\n\nThe latency threshold for voice is brutally specific. A 200ms response feels intelligent. A two-second response feels broken, regardless of output quality. This is not about performance optimization. It is about how humans assign intelligence to systems. Speed is a proxy for understanding. A slow response signals that the system did not know the answer immediately, which signals that it does not really understand you.\n\nBeyond response latency, there is a deeper timing problem: cognitive rhythm. People think in waves, not streams. There are moments of articulation and moments of processing. A voice interface that interrupts a processing moment feels intrusive. One that waits for the next articulation moment feels collaborative.\n\nI am mapping what cognitive rhythm looks like in practice and what interface patterns emerge from designing around it rather than against it.',
    status: 'ongoing',
    tags: ['voice', 'seudo', 'mushroom', 'cognitive design', 'timing'],
    date: '2025',
    notes: '200ms feels intelligent. Two seconds feels broken. The gap between them is the entire design problem.',
    steps: [
      { label: 'Latency threshold documented from Mushroom work', done: true },
      { label: 'Cognitive rhythm hypothesis formed via Seudo', done: true },
      { label: 'Pause-gated clustering as cognitive rhythm design', done: true },
      { label: 'Pattern documentation in progress', done: false },
      { label: 'Apply to next voice interface project', done: false },
    ],
  },
]
