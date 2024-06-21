import { useEffect, useLayoutEffect, useState, useRef, useMemo } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

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
export function useFetchSymbolData(symbol: string) {
  const [data, setData] = useState<TickerData | null>(null)
  const [error, setError] = useState('')
  const [fetching, setFetchingState] = useState(false)
  const fetchingRef = useRef(false) // Store fetching state in a ref to prevent retriggering the effect that fetches the data

  const chartData = useMemo(() => {
    if (!data) return
    const values = Object.values(data['Monthly Adjusted Time Series'])
    return {
      x: Object.keys(data['Monthly Adjusted Time Series']),
      open: values.map(v => v['1. open']),
      close: values.map(v => v['4. close']),
      high: values.map(v => v['2. high']),
      low: values.map(v => v['3. low'])
    }
  }, [data])

  useEffect(() => {
    const setFetching = (v: boolean) => {
      if (v)
        // Only show loading message if data fetch takes longer than 2 seconds
        setTimeout(() => setFetchingState(v), 2000)
      else setFetchingState(v)
      fetchingRef.current = v
    }

    if (!symbol || fetchingRef.current) return
    const fetchData = async () => {
      setFetching(true)
      const res = await fetch(`/api?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}`)
      if (!res.ok) {
        setError('There was an error fetching the data, please try again!')
        setFetching(false)
        return
      }
      setData((await res.json()) as TickerData)
      setError('')
      setFetching(false)
    }

    fetchData()
  }, [symbol])

  return { data: chartData, error, fetching }
}

type TickerData = {
  'Monthly Adjusted Time Series': {
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
}
