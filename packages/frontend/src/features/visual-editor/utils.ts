/* eslint-disable @typescript-eslint/no-implied-eval */
import { transform } from '@babel/standalone'
import { message } from 'antd'
import { NavigateFunction } from 'react-router'
import { isWrapperValue } from './components/variable-binding'
import { BindingValue, DataSources } from './type'
export function compileExports(
  code: string,
  // utils
  {
    navigate,
    ...props
  }: {
    state: Record<string, any>
    setState: (state: Record<string, any>) => void
    reloadRemoteDataSources: (...args: string[]) => void
    navigate: NavigateFunction
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
      )({}, { ...props, $message: message, $navigate: navigate })
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

export function compileNormalValue(code: string) {
  const str = `const compiledValue = ${code}`
  return new Function(`${str}\n return compiledValue`)()
}

export function compileBindingValue(
  dataSources: DataSources,
  code: string,
  cycleData?: {
    item: {
      name: string
      value: any
    }
    index: {
      name: string
      value: any
    }
  }
) {
  const str = `const compiledValue = ${code}`
  if (cycleData) {
    return new Function(
      'state',
      cycleData.item.name,
      cycleData.index.name,
      `${str}\n return compiledValue`
    )(dataSources, cycleData.item.value, cycleData.index.value)
  }
  return new Function('state', `${str}\n return compiledValue`)(dataSources)
}

export type ParerBindingValue<T> = T extends BindingValue<infer V> ? V : T

export function getBindingValue<T>(
  dataSources: DataSources,
  data: T,
  cycleData?: {
    item: {
      name: string
      value: any
    }
    index: {
      name: string
      value: any
    }
  }
): ParerBindingValue<T> {
  if (isWrapperValue(data)) {
    if (data.type === 'normal') {
      return data.value
    } else if (data.type === 'binding') {
      return compileBindingValue(dataSources, data.value, cycleData)
    }
    return data as ParerBindingValue<T>
  } else {
    return data as ParerBindingValue<T>
  }
}
