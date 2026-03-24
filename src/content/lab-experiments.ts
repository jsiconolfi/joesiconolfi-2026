export type ExperimentStatus = 'in progress' | 'shipped' | 'archived' | 'ongoing'

export interface LabExperiment {
  id: string
  title: string
  description: string
  status: ExperimentStatus
  tags: string[]
  date: string
  url?: string
  notes?: string
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'waypoint-sync-mcp',
    title: 'Waypoint-sync via Figma MCP',
    description: 'The question I started with: what if the design file was not the source of a handoff, but the source of truth the codebase reads from directly?\n\nThe Figma MCP console makes this possible in a way that was not practical before. Instead of exporting tokens, converting them, committing them, and reviewing drift, the pipeline becomes: designer changes a color token in Figma, the MCP reads it, waypoint-sync maps it to the correct CSS custom property and Tailwind config key, the code updates. No PR for a color change. No "did you sync the tokens" in code review.\n\nThe deeper finding is about the relationship between design files and codebases. For 15 years the design file has been a spec: a picture of what the code should look like. The MCP turns it into an API. The design file is now a live data source the codebase subscribes to. That changes what a design system is.',
    status: 'in progress',
    tags: ['design systems', 'mcp', 'figma', 'automation'],
    date: '2025',
    notes: 'The design file stops being a spec and becomes an API. That changes what a design system fundamentally is.',
  },
  {
    id: 'swirl-prompt-engineering',
    title: 'Protecting generative UI from model drift',
    description: 'The Swirl animation on this site (binary characters spiraling from the viewport center with a destination-out fade) went through 50+ Cursor sessions across several months. The challenge was not building it. It was keeping it intact.\n\nThe finding: LLMs cannot hold visual intent across long contexts. You can describe the animation in as much detail as you want, document every constant, write rules that say "do not modify Swirl.tsx." The model will still drift. It will optimize for what looks like correct code rather than what produces the correct visual output.\n\nThe solution was a canonical reference artifact. Not rules about the code, but an immutable file that represents the intended output. The model cannot modify it. Every session, it gets the file and the instruction: this is what it should look like. Make changes elsewhere that stay loyal to this.\n\nThis is a general finding about working with LLMs on design artifacts: the model needs something to be loyal to, not just rules to follow. Rules describe constraints. The artifact describes the intent. Intent survives context windows in a way that rules do not.',
    status: 'ongoing',
    tags: ['prompt engineering', 'generative ui', 'cursor', 'llm'],
    date: '2025',
    notes: 'Rules describe constraints. Artifacts describe intent. Intent survives context windows better than rules do.',
  },
  {
    id: 'beyond-chat',
    title: 'Designing beyond the chat interface',
    description: 'Every AI product defaults to a text box. Type a question, get an answer. This is the command-line era of AI interfaces: functional, powerful, and requiring the user to do all the work of formulating intent into language.\n\nVictor argued in 2006 that interactivity is a last resort. The best interface infers what you need from context and shows it without being asked. Chat is the opposite of that: it maximizes interactivity, requiring explicit input for every output.\n\nThe experiments I am running are about what comes after chat. Voice is the most obvious: spoken language is lower friction than typed language, and it opens up ambient and hands-free contexts. But voice is still interaction. The more interesting direction is inference: interfaces that observe behavior, build a model of what you care about, and surface relevant things before you ask.\n\nThe Swirl and orbital card system on this homepage is a small version of this. The AI chat knows which projects are in your context. As you talk, the relevant cards come forward. You did not click on them. You did not search for them. The system inferred relevance from the conversation and surfaced them. That is the direction.',
    status: 'ongoing',
    tags: ['ai ux', 'interaction design', 'voice', 'ambient', 'inference'],
    date: '2025',
    notes: 'The best interface never asks. The second best interface asks once and remembers.',
  },
]
