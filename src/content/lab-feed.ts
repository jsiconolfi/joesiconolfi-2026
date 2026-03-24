export type FeedEntryType = 'note' | 'prompt' | 'read' | 'tool' | 'eval' | 'experiment'

export interface FeedEntry {
  id: string
  type: FeedEntryType
  title: string
  body: string
  date: string
  tags: string[]
  url?: string
}

export const LAB_FEED: FeedEntry[] = [
  {
    id: 'frustration-chat-default',
    type: 'note',
    title: 'The tyranny of the text box',
    body: 'Every AI product I open defaults to a text input. The cursor blinks. The placeholder says "Ask me anything." The assumption embedded in that UI is that the user knows what to ask, how to ask it, and when. That is a lot of work to put on the user before they have even experienced what the product can do.\n\nThe chat interface is not wrong. It is just a beginning that the industry has mistaken for a destination. We learned to walk and stopped there. The next interface is the one that watches you work and surfaces what you need before you know you need it. We have the models for it. We are still building the interfaces.',
    date: '2025-03',
    tags: ['ai ux', 'chat', 'interaction design'],
  },
  {
    id: 'prompt-as-interface-failure',
    type: 'eval',
    title: 'The prompt is evidence of interface failure',
    body: 'I have been running a personal eval on every AI tool I use: how much work does the user have to do before the model is useful?\n\nThe finding is consistent. The tools that feel magical are the ones that infer context from what you are doing and act without being asked. The tools that feel like work are the ones that require a perfectly crafted prompt before they produce anything useful.\n\nThe prompt is not a feature. It is a failure mode. Every character the user has to type is an interaction the interface failed to make unnecessary. The goal of prompt engineering is to eventually engineer prompts out of existence.',
    date: '2025-03',
    tags: ['prompt engineering', 'eval', 'ai ux'],
  },
  {
    id: 'design-system-inference',
    type: 'experiment',
    title: 'When should a design system propose its own components?',
    body: 'A design system is a spec for how things should be built. But a spec is static. It describes what exists, not what should exist.\n\nThe experiment: can Waypoint observe how teams are building and propose components before they are requested? If three teams independently build a similar pattern (a status indicator, for example), the system should surface that as a candidate component before a fourth team builds it again.\n\nThis requires instrumenting the system: tracking which tokens are used together, which patterns appear in multiple components, where designers are going off-system and why. It is closer to a linter than a library. The design system becomes something that learns.',
    date: '2025-02',
    tags: ['design systems', 'inference', 'waypoint', 'ai'],
  },
  {
    id: 'capability-through-use',
    type: 'note',
    title: 'Capability through use',
    body: 'The products I find most meaningful are the ones that make you better at something. Not just more efficient at it. Actually better. Where using the tool repeatedly results in improved judgment, faster pattern recognition, deeper understanding.\n\nAim Lab was this at its best: the AI did not just tell you where you were weak, it built a training program that made you less weak. The coaching was embedded in the product mechanics, not in a report you read afterward.\n\nMost AI products do the opposite. They make you dependent. You outsource the thinking to the model and get worse at the underlying skill. The design question that keeps me up at night: how do you build AI that makes you more capable in its absence, not just more productive in its presence?',
    date: '2025-02',
    tags: ['ai', 'capability', 'design philosophy'],
  },
  {
    id: 'reading-dynamicland',
    type: 'read',
    title: 'Dynamicland by Bret Victor',
    body: 'If Magic Ink is Victor\'s argument against interaction-heavy information software, Dynamicland is the physical manifestation of what comes next. A communal computer where programs live on paper, tables, and walls. Where the interface is the room.\n\nIt sounds like a research project. It is actually a critique of every assumption we have built into computing since 1984. The window, the mouse, the screen. All of these are choices, not inevitabilities. Dynamicland asks: what if computation was ambient? What if the interface was not a device but an environment?\n\nI am not building rooms. But the question it asks: what if the interface was everywhere and nowhere? That is the same question behind every ambient AI product I find compelling.',
    date: '2025-01',
    tags: ['read', 'bret victor', 'ambient', 'interface'],
    url: 'https://dynamicland.org',
  },
  {
    id: 'ai-ux-paradigms',
    type: 'note',
    title: 'Emerging AI UX paradigms',
    body: 'We are still in the command-line era of AI interfaces. The dominant paradigm is prompt-response: you ask, it answers. But the interfaces that will matter are the ones that close the loop: systems that observe behavior, infer intent, and surface what is relevant before you ask. The shift is from AI as a tool you use to AI as a layer that understands. Magic Ink described this in 2006 for information software. We are finally building the infrastructure to do it.',
    date: '2025-03',
    tags: ['ai ux', 'paradigms', 'design'],
  },
  {
    id: 'human-empathy-ai',
    type: 'note',
    title: 'Human empathy as a design constraint for AI',
    body: 'The failure mode of most AI products is not that they are too powerful. It is that they are too confident. They answer without acknowledging uncertainty. They act without explaining reasoning. They optimize without surfacing the tradeoff. Designing with human empathy means treating the user\'s trust as something that must be earned incrementally, not assumed. AI that explains itself, that shows its work, that asks before acting on irreversible things: that is empathy as a design constraint, not a feature.',
    date: '2025-03',
    tags: ['ai', 'empathy', 'trust', 'design'],
  },
  {
    id: 'ai-powered-design-systems',
    type: 'experiment',
    title: 'AI-powered design systems',
    body: 'Waypoint started as a conventional design system. Tokens, components, documentation. What it is becoming is different: a system where the AI can answer questions about itself (Sherpa), where design changes propagate to code automatically (waypoint-sync), and where new components can be proposed based on usage patterns. The design system stops being a static spec and becomes a living inference engine. The question is not "what components exist" but "what should exist given how people are building."',
    date: '2025-02',
    tags: ['design systems', 'ai', 'waypoint', 'automation'],
  },
  {
    id: 'removing-barrier-magic',
    type: 'note',
    title: 'Removing the barrier to magic',
    body: 'The aha moment in any AI product is the moment the user realizes the system understood something they did not fully articulate. That is the magic. Not the capability. The inference. Getting to that moment faster is the core design challenge. Every step between the user\'s intent and the system\'s understanding is friction. Every assumption the system has to ask about is a failure of inference. The design goal is to move the magic as close to zero effort as possible.',
    date: '2025-02',
    tags: ['ai ux', 'design', 'interaction'],
  },
  {
    id: 'voice-ux-seudo',
    type: 'experiment',
    title: 'Designing for voice with Seudo',
    body: 'Voice-first interfaces break every assumption built for screens. There is no cursor, no text field, no affordance for "I am ready to listen." The design challenge is ambient feedback: how does the system signal that it heard you, understood you, and is working, without asking you to look at anything? At Seudo we learned that timing matters more than visuals: the latency between speaking and response is the primary quality signal. A 200ms response feels intelligent. A two-second response feels broken, regardless of output quality.',
    date: '2025-01',
    tags: ['voice', 'nlp', 'ux', 'seudo'],
  },
  {
    id: 'wafer-ai-os',
    type: 'experiment',
    title: 'What makes an AI-native OS feel magical',
    body: 'Working on Wafer has clarified something: the hard problem is not the AI capability, it is the moment of intervention. An OS that acts on your behalf has to develop a precise sense of when to surface and when to stay invisible. Surface too early and it feels intrusive. Surface too late and it feels pointless. The magic is in the threshold: the system\'s model of when you would have wanted help if you had known help was available. That is Victor\'s context inference problem at the OS level.',
    date: '2024-12',
    tags: ['ai os', 'wafer', 'ambient', 'design'],
  },
  {
    id: 'evolution-ai-interface',
    type: 'note',
    title: 'The evolution of the AI interface',
    body: 'Chat is not the destination. It is the first interface paradigm we reached for because it maps to something humans already understand: conversation. But conversation is high-friction. It requires the user to know what to ask, how to ask it, and when to follow up. The interfaces that come after chat will be more like good colleagues than good search engines: they will have context, they will have memory, they will surface things unprompted because they have learned what matters to you. We are building the scaffolding for that now.',
    date: '2024-11',
    tags: ['ai', 'interface', 'future', 'design'],
  },
  {
    id: 'magic-ink-reference',
    type: 'read',
    title: 'Magic Ink, Bret Victor (2006)',
    body: 'Required reading for anyone building AI interfaces. Victor argued in 2006 that most software is information software, that interactivity is a failure mode rather than a feature, and that the ideal interface infers context and shows what is relevant without being asked. We now have the AI infrastructure to actually build what he described. The irony is that the chat-first AI paradigm is exactly the interaction-heavy anti-pattern he was arguing against.',
    date: '2024-10',
    tags: ['read', 'design theory', 'bret victor'],
    url: 'https://worrydream.com/MagicInk/',
  },
  {
    id: 'mini-swe-agent',
    type: 'tool',
    title: 'mini-swe-agent-ui',
    body: 'Built a React + FastAPI frontend for mini-swe-agent with live step streaming, a real-time analytics dashboard, run history, and cost tracking via litellm. Tokyo Night theme. The interesting finding: a streaming UI for an agent is fundamentally different from a streaming UI for a chat model. The agent takes actions (file reads, shell commands, code edits) and the UI needs to represent a process, not a conversation. This required rethinking every interaction pattern built for chat.',
    date: '2024-09',
    tags: ['tool', 'agents', 'react', 'fastapi'],
  },
]
