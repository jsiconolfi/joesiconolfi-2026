export const SITE_URL = 'https://joesiconolfi.com'

export const SECTIONS = ['hero', 'philosophy', 'work', 'seam', 'lab', 'timeline'] as const
export type Section = (typeof SECTIONS)[number]

/** Breakpoints match tailwind.config.ts */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const
