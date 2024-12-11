import { useRef } from 'react'

export function useLatest<T>(val: T): React.MutableRefObject<T> {
  const ref = useRef(val)
  ref.current = val
  return ref
}
