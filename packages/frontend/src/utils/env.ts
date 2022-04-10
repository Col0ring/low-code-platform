export const __DEV__ = import.meta.env?.MODE === 'development'

export const isMac = /macintosh|mac os x/i.test(window.navigator.userAgent)
