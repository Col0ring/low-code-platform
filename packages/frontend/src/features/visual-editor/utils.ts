/* eslint-disable @typescript-eslint/no-implied-eval */
import { transform } from '@babel/standalone'

export function compile(code: string) {
  return new Promise<Record<string, any>>((resolve, reject) => {
    try {
      const { code: transformCode } = transform(code, {
        minified: true,
        presets: [['env', { modules: 'cjs', loose: true }]],
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __esModule, ...exports } = new Function(
        'exports',
        `${transformCode}\nreturn exports`
      )({})
      resolve(exports)
    } catch (error) {
      reject(error)
    }
  })
}
