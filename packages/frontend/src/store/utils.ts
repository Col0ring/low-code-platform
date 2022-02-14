export function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}
