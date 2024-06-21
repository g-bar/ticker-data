'use client'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import AsyncSelect from 'react-select/async'

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

type SymbolData = {
  bestMatches: {
    '1. symbol': string
  }[]
}

import React from 'react'
import Plot from 'react-plotly.js'
import { useWindowResizeEffect } from '@/hooks'
import { useDebounceCallback } from 'usehooks-ts'

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [data, setData] = useState<TickerData | null>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const [plotSize, setPlotSize] = useState<{ height: number; width: number } | null>(null)

  const [error, setError] = useState('')
  const [fetching, setFetchingState] = useState(false)
  const fetchingRef = useRef(false) // Store fetching state in a ref to prevent retriggering the effect that fetches the data

  function getNoDataMessage() {
    if (fetching) return 'Loading...'
    if (error) return 'There was an error fetching the data, please try again.'
    return 'Select a symbol'
  }

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

  const loadOptions = useDebounceCallback((inputValue: string, callback: (data: { label: string }[]) => void) => {
    const loadSymbols = async () => {
      const res = await fetch('symbols.json')
      const symbolsRes = (await res.json()) as SymbolData
      const symbols = symbolsRes.bestMatches.map(s => ({ label: s['1. symbol'] }))

      callback(symbols)
    }
    loadSymbols()
  }, 500)

  const onResize = useCallback(() => {
    if (!plotRef.current) return
    const { width, height } = plotRef.current.getBoundingClientRect()
    setPlotSize({ width: width - 50, height: height - 50 })
  }, [])

  useWindowResizeEffect(onResize, 300)

  useEffect(() => {
    const setFetching = (v: boolean) => {
      if (!v)
        // Only show fetching message if data fetch takes longer than 2 seconds
        setTimeout(() => setFetchingState(v), 2000)
      else setFetchingState(v)
      fetchingRef.current = v
    }

    if (!selectedSymbol || fetchingRef.current) return
    const fetchData = async () => {
      setFetching(true)
      const res = await fetch('data.json')
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
  }, [selectedSymbol])

  return (
    <main className="flex h-screen flex-col items-center justify-between p-8">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        onChange={e => setSelectedSymbol(e?.label ?? '')}
        className="w-[300px]"
        placeholder="Search for a symbol"
      />
      <div ref={plotRef} className="w-full h-full mt-5">
        {!chartData && <div className="w-full h-full flex items-center justify-center">{getNoDataMessage()}</div>}
        {!!chartData && (
          <Plot
            data={[{ ...chartData, type: 'candlestick' }]}
            layout={{ width: plotSize?.width, height: plotSize?.height, title: selectedSymbol }}
          />
        )}
      </div>
    </main>
  )
}
