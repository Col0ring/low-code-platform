export type DomElement = HTMLElement | Element | Window | Document

export type DomParam<T extends DomElement = DomElement> = React.RefObject<T> | T

export function isRef<T extends DomElement = DomElement>(
  value: DomParam<T>
): value is React.RefObject<T> {
  return value && typeof value === 'object' && 'current' in value
}

export function getDomElement<T extends DomElement>(
  ref: DomParam<T>
): T | null {
  if (isRef(ref)) {
    return ref.current
  }
  return ref
}

export function elementCanScroll(el: Element) {
  if (el.scrollLeft > 0) {
    return true
  } else {
    el.scrollLeft++
    const left = el.scrollLeft
    if (left) {
      el.scrollLeft = 0
    }
    return left > 0
  }
}
