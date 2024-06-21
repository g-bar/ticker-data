import { useCallback, useEffect, useLayoutEffect, useReducer } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

export function useWindowResizeEffect(onResize: () => void, debounceIntervalMs = 0) {
  const debouncedOnResize = useDebounceCallback(onResize, debounceIntervalMs)

  useLayoutEffect(() => {
    onResize()
  }, [onResize])

  useEffect(() => {
    window.addEventListener('resize', debouncedOnResize)
    return () => window.removeEventListener('resize', debouncedOnResize)
  }, [debouncedOnResize])
}
