const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args) // intentional dev-only logging
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args) // intentional dev-only logging
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args) // always surface errors
  },
}
