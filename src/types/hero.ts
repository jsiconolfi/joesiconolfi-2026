export interface HeroTextProps {
  name: string
  role: string
  thesis: string
}

export interface PromptBarProps {
  onSubmit: (query: string) => void
  onFocusChange?: (active: boolean) => void
  placeholder?: string
  suggestions?: string[]
}
