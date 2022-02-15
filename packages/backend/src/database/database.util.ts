import { Repository } from 'typeorm'

export function getExcludeSelect<T>(
  repository: Repository<T>,
  select?: (keyof T)[]
): (keyof T)[] {
  const names = repository.metadata.columns.map(
    (col) => col.propertyName as keyof T
  )
  return select ? names.filter((name) => !select.includes(name)) : names
}
