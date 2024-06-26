import { useEffect, useLayoutEffect, useState, useRef, useMemo } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { Frequency } from './types'
import { capitalize } from './utils'

/* 
  Runs onResize when the window is resized 
*/
export function useWindowResizeEffect(onResize: () => void, debounceIntervalMs = 0) {
  const debouncedOnResize = useDebounceCallback(onResize, debounceIntervalMs)

  // Initial call, useLayoutEffect to avoid painting the chart before the dimensions
  // have been determined
  useLayoutEffect(() => {
    onResize()
  }, [onResize])

  useEffect(() => {
    window.addEventListener('resize', debouncedOnResize)
    return () => window.removeEventListener('resize', debouncedOnResize)
  }, [debouncedOnResize])
}

/* 
  Fetch ticker data for the given symbol 
*/
export function useFetch(frequency: Frequency, symbol: string) {
  const [data, setData] = useState<TickerData | null>(null)
  const [error, setError] = useState('')
  const [fetching, setFetchingState] = useState(false)
  const fetchingRef = useRef(false) // Store fetching state in a ref to prevent retriggering the effect that fetches the data

  const chartData = useMemo(() => {
    if (!data) return
    const values = Object.values(data)
    return {
      x: Object.keys(data),
      open: values.map(v => v['1. open']),
      close: values.map(v => v['4. close']),
      high: values.map(v => v['2. high']),
      low: values.map(v => v['3. low'])
    }
  }, [data])

  useEffect(() => {
    const setFetching = (v: boolean) => {
      setFetchingState(v)
      fetchingRef.current = v
    }

    if (!symbol || fetchingRef.current) return

    const fetchData = async () => {
      setFetching(true)
      setData(null)
      const res = await fetch(`/api?function=${getFunction(frequency)}&symbol=${symbol}`)
      const data = await res.json()

      const key = getDataKey(frequency)

      if (!res.ok || !data[key]) {
        setData(null)
        setError(data.Information || 'There was an error fetching the data, please try again!')
        setFetching(false)
        return
      }

      setData(data[key] as TickerData)
      setError('')
      setFetching(false)
    }

    fetchData()
  }, [symbol, frequency])

  return { data: chartData, error, fetching }
}

type TickerData = {
  [time: string]: {
    '1. open': number
    '2. high': number
    '3. low': number
    '4. close': number
    '5. adjusted': number
    '6. volume': number
    '7. dividend amount': number
  }
}

function getFunction(frequency: Frequency) {
  return `TIME_SERIES_${frequency.toUpperCase()}`
}

function getDataKey(frequency: Frequency) {
  if (frequency === 'daily') return `Time Series (Daily)`
  return `${capitalize(frequency)} Time Series`
}
