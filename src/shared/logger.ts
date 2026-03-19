const PREFIX = '[chatgpt-pins]'
const DEBUG = false

export const logger = {
  info: (...args: unknown[]) => {
    console.info(PREFIX, ...args)
  },
  debug: (...args: unknown[]) => {
    if (!DEBUG) {
      return
    }

    console.debug(PREFIX, ...args)
  },
  warn: (...args: unknown[]) => {
    console.warn(PREFIX, ...args)
  },
  error: (...args: unknown[]) => {
    console.error(PREFIX, ...args)
  },
}
