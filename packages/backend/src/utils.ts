export function safeJsonParser<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str)
  } catch (error) {
    return defaultValue
  }
}
