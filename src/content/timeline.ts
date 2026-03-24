export interface TimelineArtifact {
  label: string
  value: string
}

export interface TimelineEra {
  id: string
  years: string
  company: string
  role: string
  location: string
  type: 'full' | 'compact'
  summary: string
  artifacts: TimelineArtifact[]
  tech?: string[]
  slug?: string
}

export const TIMELINE: TimelineEra[] = [
  {
    id: 'maxq',
    years: '2010–2011',
    company: 'Max Q Designs',
    role: 'Jr Design Engineer',
    location: 'Melbourne, FL',
    type: 'compact',
    summary: 'First professional role. Built websites for local and national clients in Florida. Where the habit of making things started.',
    artifacts: [
      { label: 'focus', value: 'web design + front end development' },
    ],
  },
  {
    id: 'progressive',
    years: '2011',
    company: 'Progressive Communications',
    role: 'Design Engineer',
    location: 'Lake Mary, FL',
    type: 'compact',
    summary: 'Short stint at a small agency. Won some awards. Moved to New York to find work with more scale.',
    artifacts: [
      { label: 'focus', value: 'agency design + development' },
    ],
  },
  {
    id: 'spongecell',
    years: '2011–2014',
    company: 'Spongecell',
    role: 'Interaction Engineer',
    location: 'New York City',
    type: 'compact',
    summary: 'Interaction engineering for an enterprise ad creation platform serving major advertisers. First time building something that had to work at real scale.',
    artifacts: [
      { label: 'focus', value: 'enterprise ad-tech, interaction engineering' },
      { label: 'note', value: 'Spongecell later acquired by Flashtalking' },
    ],
    tech: ['JavaScript', 'CSS', 'HTML'],
  },
  {
    id: 'viacom',
    years: '2014–2015',
    company: 'Viacom / MTV',
    role: 'UX/UI Engineer',
    location: 'New York City',
    type: 'compact',
    summary: 'UX engineering for MTV digital properties, including interactive voting features. The voting work drove a 55% lift in engagement.',
    artifacts: [
      { label: 'impact', value: '55% increase in user engagement' },
      { label: 'focus', value: 'editorial platforms, interactive experiences' },
    ],
    tech: ['JavaScript', 'CSS', 'React'],
  },
  {
    id: 'logic',
    years: '2015–2019',
    company: 'Logic Web Media',
    role: 'Design Engineer',
    location: 'New York City',
    type: 'compact',
    summary: 'Design and front-end development for a fintech platform in New York. Built the first design system I ever owned from scratch. Four years of compounding toward Waypoint.',
    artifacts: [
      { label: 'focus', value: 'fintech, design systems, A/B testing' },
      { label: 'note', value: 'First design system built from scratch' },
    ],
    tech: ['React', 'JavaScript', 'CSS'],
  },
  {
    id: 'statespace-1',
    years: '2019–2020',
    company: 'Statespace',
    role: 'Product Design',
    location: 'New York City / Remote',
    type: 'full',
    summary: 'First AI role. Led design for Aim Lab, an AI-driven training platform for esports. Worked with ML teams and neuroscience experts to build adaptive interfaces that responded to how players actually trained.',
    artifacts: [
      { label: 'product', value: 'Aim Lab: FPS training platform' },
      { label: 'approach', value: 'AI + neuroscience-driven adaptive UX' },
      { label: 'tech', value: 'cross-platform, AI/ML integration' },
    ],
    tech: ['React', 'TypeScript'],
    slug: 'statespace',
  },
  {
    id: 'statespace-2',
    years: '2020–2022',
    company: 'Statespace',
    role: 'Product Design Lead',
    location: 'Remote',
    type: 'full',
    summary: 'Promoted to lead. Took full ownership of design for the AI coaching platform. Shaped end-to-end product experiences for 30M+ users using neuroscience research and data insights. Led the Statespace x Kernel neural interface integration.',
    artifacts: [
      { label: 'scale', value: '30M+ registered users' },
      { label: 'milestone', value: '$50M Series B' },
      { label: 'project', value: 'Statespace x Kernel neural interface UX' },
      { label: 'coverage', value: 'VentureBeat: Statespace raises $50M' },
    ],
    tech: ['React', 'TypeScript', 'AI/ML'],
    slug: 'statespace',
  },
  {
    id: 'mushroom',
    years: '2022–2023',
    company: 'Mushroom',
    role: 'Product Design Engineer',
    location: 'Palo Alto, CA',
    type: 'full',
    summary: 'Built LLM-powered conversational and voice interfaces before voice AI was mainstream. Designed for ears, not screens. Shipped production voice interfaces and built scalable UI systems for evolving AI behaviors.',
    artifacts: [
      { label: 'focus', value: 'LLM voice + conversational interfaces' },
      { label: 'insight', value: 'designed for ears, not screens' },
      { label: 'output', value: 'production voice interfaces shipped' },
    ],
    tech: ['TypeScript', 'React', 'Tailwind'],
    slug: 'mushroom',
  },
  {
    id: 'channel',
    years: '2023–2025',
    company: 'Channel AI',
    role: 'Design Engineer',
    location: 'Palo Alto, CA',
    type: 'full',
    summary: 'Owned design and front-end development for AI-native creative tools. Built streaming-first interaction models, multi-variation output systems, and context-as-a-first-class-concept patterns that became the foundation of the product.',
    artifacts: [
      { label: 'pattern', value: 'streaming-first interaction model' },
      { label: 'innovation', value: 'multi-variation AI output UX' },
      { label: 'stack', value: 'TypeScript, React, Tailwind, Swift, SwiftUI' },
    ],
    tech: ['TypeScript', 'React', 'Tailwind', 'Swift', 'SwiftUI'],
    slug: 'channel',
  },
  {
    id: 'cohere',
    years: '2025–present',
    company: 'Cohere',
    role: 'Staff Design Engineer',
    location: 'San Francisco / Remote',
    type: 'full',
    summary: 'First design engineer at Cohere. Building Waypoint (design system), Sherpa (RAG Figma plugin), and waypoint-sync (Figma-to-code pipeline). Also prototyping new interaction paradigms for frontier model capabilities at Cohere Labs, and helping define UX patterns for research and product teams working on next-generation models.',
    artifacts: [
      { label: 'system', value: 'Waypoint: design system from zero' },
      { label: 'tool', value: 'Sherpa: RAG Figma plugin' },
      { label: 'pipeline', value: 'waypoint-sync: Figma-to-code token sync' },
      { label: 'research', value: 'Cohere Labs: frontier model UX patterns' },
      { label: 'scope', value: 'product, design, engineering, research' },
    ],
    tech: ['TypeScript', 'React', 'Tailwind'],
    slug: 'waypoint',
  },
]
