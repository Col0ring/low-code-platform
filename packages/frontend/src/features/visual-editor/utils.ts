/* eslint-disable @typescript-eslint/no-implied-eval */
import { transform } from '@babel/standalone'
import { isWrapperValue } from './components/variable-binding'
import { BindingValue, DataSources } from './type'
export function compileExports(
  code: string,
  // utils
  lc: {
    state: Record<string, any>
    setState: (state: Record<string, any>) => void
    reloadRemoteDataSources: (...args: string[]) => void
  }
) {
  return new Promise<Record<string, any>>((resolve, reject) => {
    try {
      const { code: transformCode } = transform(code, {
        minified: true,
        presets: [['env', { modules: 'cjs', loose: true }]],
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __esModule, ...exports } = new Function(
        'exports',
        'lc',
        `${transformCode}\nreturn exports`
      )({}, lc)
      resolve(exports)
    } catch (error) {
      reject(error)
    }
  })
}

export function compileDataSources(dataSources: DataSources) {
  return new Promise<Record<string, any>>((resolve, reject) => {
    let compiledDataSourcesStr = 'const dataSources =  {'
    Object.keys(dataSources).forEach((key) => {
      compiledDataSourcesStr += `${key}: ${dataSources[key].defaultValue},`
    })
    compiledDataSourcesStr += '}'
    try {
      const { code: transformCode } = transform(compiledDataSourcesStr, {
        minified: true,
        presets: [['env', { modules: 'cjs', loose: true }]],
      })
      resolve(new Function(`${transformCode}\n return dataSources`)())
    } catch (error) {
      reject(error)
    }
  })
}

export function compileBindingValue(dataSources: DataSources, code: string) {
  const str = `const compiledValue = ${code}`
  return new Function('state', `${str}\n return compiledValue`)(dataSources)
}

export type ParerBindingValue<T> = T extends BindingValue<infer V> ? V : T

export function getBindingValue<T>(
  dataSources: DataSources,
  data: T
): ParerBindingValue<T> {
  if (isWrapperValue(data)) {
    if (data.type === 'normal') {
      return data.value
    } else if (data.type === 'binding') {
      return compileBindingValue(dataSources, data.value)
    }
    return data as ParerBindingValue<T>
  } else {
    return data as ParerBindingValue<T>
  }
}
