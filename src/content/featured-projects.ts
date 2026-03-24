export interface FeaturedProject {
  id: string
  name: string
  description: string
  video: string   // mp4 path: shows first frame at rest, plays on hover
  url?: string    // case study URL: undefined until built
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'waypoint',
    name: 'Waypoint',
    description: 'Design system built from zero at Cohere',
    video: '/projects/waypoint.mp4',
    url: '/work/waypoint',
  },
  {
    id: 'wafer',
    name: 'Wafer Systems',
    description: 'AI-native OS: product, visual and UX design',
    video: '/projects/wafer.mp4',
    url: '/work/wafer',
  },
  {
    id: 'channel',
    name: 'Channel AI',
    description: 'AI-native creative tools for content teams',
    video: '/projects/channelai.mp4',
    url: '/work/channel',
  },
  {
    id: 'seudo',
    name: 'Seudo AI',
    description: 'Voice-first brainstorming with AI clustering',
    video: '/projects/seudo.mp4',
    url: '/work/seudo',
  },
]
