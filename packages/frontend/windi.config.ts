import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['src/**/*.{jsx,tsx}'],
    exclude: ['node_modules', '.git'],
  },
  shortcuts: {
    'text-cut': 'overflow-hidden whitespace-nowrap overflow-ellipsis',
  },
})
