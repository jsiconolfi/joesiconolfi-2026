export interface Project {
  id: string
  name: string
  thesis: string
  artifact: string
  artifactLabel: string
  keywords: string[]
}

export const PROJECTS: Project[] = [
  {
    id: 'waypoint',
    name: 'Waypoint',
    thesis: 'Design system for Cohere',
    artifact: '--color-primary: #1D9E75;\n--space-4: 1rem;\n--radius-md: 8px;',
    artifactLabel: 'design token',
    keywords: ['waypoint', 'design system', 'cohere', 'tokens', 'components'],
  },
  {
    id: 'sherpa',
    name: 'Sherpa',
    thesis: 'RAG-based Figma plugin',
    artifact: 'query: "what spacing scale\ndoes waypoint use?"\n→ 4px base, 8-step scale',
    artifactLabel: 'rag query',
    keywords: ['sherpa', 'figma', 'plugin', 'rag', 'pinecone', 'embed'],
  },
  {
    id: 'waypoint-sync',
    name: 'waypoint-sync',
    thesis: 'Figma-to-code token pipeline',
    artifact: '"figma": "Primary/500",\n"css": "--color-primary",\n"tw": "primary-500"',
    artifactLabel: 'design-map.json',
    keywords: ['waypoint-sync', 'sync', 'tokens', 'figma variables', 'pipeline'],
  },
  {
    id: 'channel',
    name: 'Channel AI',
    thesis: 'AI-native creative tools',
    artifact: 'user → "help me write this"\nai   → streaming draft...\n     → 3 variations ready',
    artifactLabel: 'conversation',
    keywords: ['channel', 'channel ai', 'creative', 'writing', 'generative'],
  },
  {
    id: 'statespace',
    name: 'Statespace',
    thesis: 'AI coaching for 30M+ players',
    artifact: 'aim_score:  847\nrank:       top 4%\ndelta_7d:   +23pts',
    artifactLabel: 'performance',
    keywords: ['statespace', 'aimlab', 'gaming', 'coaching', 'performance', '30m'],
  },
  {
    id: 'mushroom',
    name: 'Mushroom',
    thesis: 'LLM voice interfaces',
    artifact: 'listening...\n> "set a timer for 10 min"\n✓ timer set — 10:00',
    artifactLabel: 'voice interface',
    keywords: ['mushroom', 'voice', 'llm', 'conversational', 'audio'],
  },
  {
    id: 'seudo',
    name: 'Seudo AI',
    thesis: 'Voice-first AI brainstorming',
    artifact: 'listening...\n> "connect these ideas"\ntheme: product clarity\n→ 3 clusters found',
    artifactLabel: 'voice session',
    keywords: ['seudo', 'brainstorm', 'voice', 'nlp', 'ideas', 'clustering'],
  },
  {
    id: 'kernel',
    name: 'Statespace × Kernel',
    thesis: 'Gaming meets neurotech',
    artifact: 'neural_load:   0.73\nfocus_score:   91\ncognitive_lag: 12ms\n→ peak window: now',
    artifactLabel: 'neural metrics',
    keywords: ['kernel', 'neurotech', 'neural', 'brain', 'cognitive', 'statespace kernel'],
  },
]
