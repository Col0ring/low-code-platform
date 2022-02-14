export interface createLocalStorageOptions<V> {
  map?: (v: string | null) => V
  defaultValue?: V
}
export function createLocalStorage<T extends string, V = string | null>(
  name: T,
  options: createLocalStorageOptions<V> = {}
) {
  const { defaultValue, map = (v: string | null) => v } = options
  type SetAction = `set${Capitalize<T>}`
  type GetAction = `get${Capitalize<T>}`
  type RemoveAction = `remove${Capitalize<T>}`

  const action = name[0].toUpperCase() + name.slice(1)
  const setAction = `set${action}`
  const getAction = `get${action}`
  const removeAction = `remove${action}`
  const key = `@low-code/key-${name}`

  return {
    [setAction](value: string) {
      localStorage.setItem(key, value)
    },
    [getAction]() {
      return map(localStorage.getItem(key)) ?? defaultValue ?? null
    },
    [removeAction]() {
      localStorage.removeItem(key)
    },
  } as {
    [P in SetAction | GetAction | RemoveAction]: P extends SetAction
      ? (value: string) => void
      : P extends GetAction
      ? () => V
      : () => void
  }
}
