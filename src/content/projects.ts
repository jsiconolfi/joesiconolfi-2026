// Project images live in /public/projects/
// Supported formats: .png, .webp, .gif, .mp4 (for video, use <video> instead of <img>)
// Placeholder grid renders automatically when image path is missing or file doesn't exist
// To add an asset: drop the file in /public/projects/ and it will render immediately

export interface Project {
  id: string
  name: string
  role: string
  image?: string
  keywords: string[]
}

export const PROJECTS: Project[] = [
  {
    id: 'waypoint',
    name: 'Waypoint',
    role: 'Design system for Cohere — built from zero',
    image: '/projects/waypoint.mp4',
    keywords: ['waypoint', 'design system', 'cohere', 'tokens', 'components'],
  },
  {
    id: 'sherpa',
    name: 'Sherpa',
    role: 'RAG-based Figma plugin for design system Q&A',
    image: '/projects/sherpa.mp4',
    keywords: ['sherpa', 'figma', 'plugin', 'rag', 'pinecone'],
  },
  {
    id: 'waypoint-sync',
    name: 'waypoint-sync',
    role: 'Two-way Figma-to-code token pipeline',
    image: '/projects/waypoint-sync.mp4',
    keywords: ['waypoint-sync', 'sync', 'tokens', 'figma variables', 'pipeline'],
  },
  {
    id: 'channel',
    name: 'Channel AI',
    role: 'AI-native creative tools for content teams',
    image: '/projects/channelai.mp4',
    keywords: ['channel', 'channel ai', 'creative', 'writing'],
  },
  {
    id: 'statespace',
    name: 'Statespace',
    role: 'AI coaching platform for 30M+ players',
    image: '/projects/statespace.mp4',
    keywords: ['statespace', 'aimlab', 'gaming', 'coaching', 'performance'],
  },
  {
    id: 'mushroom',
    name: 'Mushroom',
    role: 'LLM-powered voice interfaces',
    image: '/projects/mushroom.jpg',
    keywords: ['mushroom', 'voice', 'llm', 'conversational'],
  },
  {
    id: 'seudo',
    name: 'Seudo AI',
    role: 'Voice-first brainstorming with AI clustering',
    image: '/projects/seudo.mp4',
    keywords: ['seudo', 'brainstorm', 'voice', 'nlp', 'ideas'],
  },
  {
    id: 'kernel',
    name: 'Statespace × Kernel',
    role: 'Gaming meets neurotech — neural data UX',
    image: '/projects/kernel.mp4',
    keywords: ['kernel', 'neurotech', 'neural', 'brain', 'statespace kernel'],
  },
  {
    id: 'wafer',
    name: 'Wafer Systems',
    role: 'AI-native OS — product, visual and UX design',
    image: '/projects/wafer.png',
    keywords: ['wafer', 'operating system', 'android', 'ai os'],
  },
  {
    id: 'cohere-labs',
    name: 'Cohere Labs',
    role: 'Prototyping new UX flows for model capabilities',
    image: '/projects/cohere-labs.mp4',
    keywords: ['cohere labs', 'research', 'prototype', 'model', 'capabilities'],
  },
]
