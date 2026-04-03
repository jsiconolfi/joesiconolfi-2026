// Project images live in /public/projects/
// Supported formats: .png, .webp, .gif, .mp4 (for video, use <video> instead of <img>)
// Placeholder grid renders automatically when image path is missing or file doesn't exist
// To add an asset: drop the file in /public/projects/ and it will render immediately

export interface Project {
  id: string
  name: string
  role: string
  image?: string
  video?: string   // mp4 in /public/projects/: plays lazily on hover/active. undefined = no video
  keywords: string[]
  url?: string  // case study URL: internal path or external. undefined = not yet built
}

export const PROJECTS: Project[] = [
  {
    id: 'waypoint',
    name: 'Waypoint',
    role: 'Design system for Cohere, built from zero',
    image: '/projects/waypoint.mp4',
    video: '/projects/waypoint.mp4',
    keywords: ['waypoint', 'design system', 'cohere', 'tokens', 'components'],
    url: '/work/waypoint',
  },
  {
    id: 'sherpa',
    name: 'Sherpa',
    role: 'RAG-based Figma plugin for design system Q&A',
    image: '/projects/sherpa.mp4',
    keywords: ['sherpa', 'figma', 'plugin', 'rag', 'pinecone'],
    url: '/work/sherpa',
  },
  {
    id: 'waypoint-sync',
    name: 'waypoint-sync',
    role: 'Two-way Figma-to-code token pipeline',
    image: '/projects/waypoint-sync.mp4',
    keywords: ['waypoint-sync', 'sync', 'tokens', 'figma variables', 'pipeline'],
    url: '/work/waypoint-sync',
  },
  {
    id: 'channel',
    name: 'Channel AI',
    role: 'Design Engineer, Product Design Lead',
    image: '/projects/channelai.mp4',
    video: '/projects/channelai.mp4',
    keywords: ['channel', 'channel ai', 'creative', 'writing'],
    url: '/work/channel',
  },
  {
    id: 'statespace',
    name: 'Statespace',
    role: 'AI coaching platform for 30M+ players',
    image: '/projects/statespace.mp4',
    keywords: ['statespace', 'aimlab', 'gaming', 'coaching', 'performance'],
    url: '/work/statespace',
  },
  {
    id: 'mushroom',
    name: 'Mushroom',
    role: 'LLM-powered voice interfaces before there was a playbook',
    image: '/projects/mushroom.jpg',
    keywords: ['mushroom', 'voice', 'llm', 'conversational'],
    url: '/work/mushroom',
  },
  {
    id: 'seudo',
    name: 'Seudo AI',
    role: 'Voice-first brainstorming with AI clustering',
    image: '/projects/seudo.mp4',
    video: '/projects/seudo.mp4',
    keywords: ['seudo', 'brainstorm', 'voice', 'nlp', 'ideas'],
    url: '/work/seudo',
  },
  {
    id: 'kernel',
    name: 'Statespace × Kernel',
    role: 'Gaming meets neurotech: neural data UX',
    image: '/projects/kernel.mp4',
    keywords: ['kernel', 'neurotech', 'neural', 'brain', 'statespace kernel'],
    url: '/work/kernel',
  },
  {
    id: 'wafer',
    name: 'Wafer Systems',
    role: 'AI-native OS: product, visual and UX design',
    image: '/projects/wafer.mp4',
    keywords: ['wafer', 'operating system', 'android', 'ai os'],
    url: '/work/wafer',
  },
  {
    id: 'cohere-labs',
    name: 'Cohere Labs',
    role: 'Prototyping new UX flows for model capabilities',
    image: '/projects/cohere-labs.mp4',
    keywords: ['cohere labs', 'research', 'prototype', 'model', 'capabilities'],
    url: '/work/cohere-labs',
  },
]
