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
    id: 'no-playbook',
    type: 'note',
    title: 'Building before there was a playbook',
    body: 'At Mushroom in 2022 we were building LLM-powered voice interfaces before ChatGPT existed as a public product. There were no established patterns. No prior art for how users form intent with voice, how a model should respond to build trust, how the interface should handle the gap between what someone said and what the model understood.\n\nThe design challenge was not just building something. It was figuring out what to build at all. Every decision was first principles. The standard UX toolkit did not apply. We built our own evaluation methods, our own trust patterns, our own vocabulary for what good even meant.\n\nI keep returning to that experience when I see teams moving slowly on AI products because they are waiting for best practices to emerge. The best practices come from building. The playbook does not exist until someone writes it.',
    date: '2025-04',
    tags: ['voice', 'mushroom', 'ai ux', 'first principles'],
  },
  {
    id: 'open-source-consumer',
    type: 'note',
    title: 'The abstraction problem in open-source AI',
    body: 'Working on Channel, the hardest design problem was not capability. The models were extraordinary. The problem was abstraction. How do you make the vast, fragmented landscape of open-source AI feel coherent to someone who has never heard of Stable Diffusion or Mistral?\n\nAbstraction that erases capability is just dumbing it down. Abstraction that makes capability legible is product design. The difference is whether the user feels like the system is hiding things from them or translating things for them. One produces distrust. The other produces confidence.\n\nThis is the same problem at every layer of AI product design. The model can be extraordinary and still fail the user if the interface does not create the conditions for understanding.',
    date: '2025-03',
    tags: ['channel', 'ai ux', 'abstraction', 'open source'],
  },
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
    id: 'interrupt-timing',
    type: 'note',
    title: 'The threshold problem',
    body: 'The hardest design problem at Wafer is not capability. It is timing. An OS-level context layer that knows your calendar, your current task, your open files, and your recent conversations has more than enough signal to be useful. The question is when to use it.\n\nSurface too early: noise. Surface too late: missed the moment. The threshold between the two is not a setting you configure. It is a model of the user the system has to build and maintain. That is a fundamentally different design problem than building a feature.\n\nVictor described this as context sensitivity in Magic Ink. The ideal interface infers from environment, history, and behavior. What he could not have known in 2006 is that we would eventually have models capable of exactly that inference. The infrastructure caught up. The design patterns have not.',
    date: '2025-02',
    tags: ['wafer', 'ambient', 'proactive ui', 'magic ink'],
  },
  {
    id: 'state-divergence-ux',
    type: 'experiment',
    title: 'Parallel state as a UX problem',
    body: 'Building Nexus surfaced a design problem I had not seen framed clearly before: parallel state divergence. When you run the same prompt across four AI models simultaneously, each model is in a different state at any given moment. One is still thinking. One has finished streaming. One returned an error. One gave a two-sentence answer twenty seconds ago.\n\nThe user needs to read all four states at a glance. Traditional chat UI is designed for sequential states: one thing happens, then the next. Parallel state requires a completely different visual language. State needs to be legible in parallel, not just sequentially.\n\nThis turns out to be a general problem for any AI product that runs multiple operations simultaneously. The design patterns for sequential UX do not transfer.',
    date: '2025-02',
    tags: ['channel', 'nexus', 'ai ux', 'parallel state'],
  },
  {
    id: 'design-system-inference',
    type: 'experiment',
    title: 'When should a design system propose its own components?',
    body: 'A design system is a spec for how things should be built. But a spec is static. It describes what exists, not what should exist.\n\nThe experiment: can Waypoint observe how teams are building and propose components before they are requested? If three teams independently build a similar pattern, the system should surface that as a candidate component before a fourth team builds it again.\n\nThis requires instrumenting the system: tracking which tokens are used together, which patterns appear in multiple components, where designers are going off-system and why. It is closer to a linter than a library. The design system becomes something that learns.',
    date: '2025-02',
    tags: ['design systems', 'inference', 'waypoint', 'ai'],
  },
  {
    id: 'capability-through-use',
    type: 'note',
    title: 'Capability through use',
    body: 'The products I find most meaningful are the ones that make you better at something. Not just more efficient. Actually better. Where using the tool repeatedly results in improved judgment, faster pattern recognition, deeper understanding.\n\nAim Lab was this at its best. The AI did not just tell you where you were weak, it built a training program that made you less weak. The coaching was embedded in the product mechanics, not in a report you read afterward.\n\nMost AI products do the opposite. They make you dependent. You outsource the thinking to the model and get worse at the underlying skill. The design question that keeps me up: how do you build AI that makes you more capable in its absence, not just more productive in its presence?',
    date: '2025-02',
    tags: ['ai', 'capability', 'design philosophy', 'statespace'],
  },
  {
    id: 'voice-cognitive-rhythm-note',
    type: 'note',
    title: 'Cognitive rhythm and voice',
    body: "People think in waves, not streams. There are moments of articulation and moments of processing. A voice interface that interrupts a processing moment feels intrusive. One that waits for the next articulation moment feels collaborative.\n\nAt Seudo, the decision to gate clustering updates to natural pauses came directly from this observation. The clustering ran continuously in the background. The UI updates waited. Users experienced the intelligence without feeling interrupted by the process.\n\nThis is a general principle for any ambient interface: the interface should be aware of the user's cognitive state and time its surfaces accordingly. Not just what to show. When.",
    date: '2025-01',
    tags: ['voice', 'seudo', 'cognitive design', 'ambient'],
  },
  {
    id: 'reading-dynamicland',
    type: 'read',
    title: 'Dynamicland by Bret Victor',
    body: "If Magic Ink is Victor's argument against interaction-heavy information software, Dynamicland is the physical manifestation of what comes next. A communal computer where programs live on paper, tables, and walls. Where the interface is the room.\n\nIt sounds like a research project. It is actually a critique of every assumption we have built into computing since 1984. The window, the mouse, the screen. All of these are choices, not inevitabilities. Dynamicland asks: what if computation was ambient? What if the interface was not a device but an environment?\n\nI am not building rooms. But the question it asks: what if the interface was everywhere and nowhere? That is the same question behind every ambient AI product I find compelling.",
    date: '2025-01',
    tags: ['read', 'bret victor', 'ambient', 'interface'],
    url: 'https://dynamicland.org',
  },
  {
    id: 'magic-ink-reference',
    type: 'read',
    title: 'Magic Ink, Bret Victor (2006)',
    body: "Required reading for anyone building AI interfaces. Victor argued in 2006 that most software is information software, that interactivity is a failure mode rather than a feature, and that the ideal interface infers context and shows what is relevant without being asked. We now have the AI infrastructure to actually build what he described. The irony is that the chat-first AI paradigm is exactly the interaction-heavy anti-pattern he was arguing against.",
    date: '2024-10',
    tags: ['read', 'design theory', 'bret victor'],
    url: 'https://worrydream.com/MagicInk/',
  },
]
