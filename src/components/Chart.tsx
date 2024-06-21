import { useWindowResizeEffect } from '@/hooks'
import { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Import Plot dynamically and disable ssr, plotly seems to be
// incompatible with the server (error thrown when pre-rendering)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface Props {
  data?: {
    x: string[]
    open: number[]
    close: number[]
    high: number[]
    low: number[]
  }
  fetching: boolean
  error: string
  selectedSymbol: string
}

/* Displays the chart */
export default function Chart({ data, fetching, error, selectedSymbol }: Props) {
  const plotRef = useRef<HTMLDivElement>(null)
  const [plotSize, setPlotSize] = useState<{ height: number; width: number } | null>(null)

  // Adjust the size of the chart when the window is resized
  useWindowResizeEffect(
    useCallback(() => {
      if (!plotRef.current) return
      const { width, height } = plotRef.current.getBoundingClientRect()
      setPlotSize({ width: width - 50, height: height - 50 })
    }, []),
    300
  )

  function getNoDataMessage() {
    if (fetching) return 'Loading...'
    if (error) return 'There was an error fetching the data, please try again.'
    return 'Select a symbol'
  }

  return (
    <div ref={plotRef} className="w-full h-full mt-5">
      {!data && <div className="w-full h-full flex items-center justify-center">{getNoDataMessage()}</div>}
      {!!data && (
        <Plot
          data={[{ ...data, type: 'candlestick' }]}
          layout={{ width: plotSize?.width, height: plotSize?.height, title: selectedSymbol }}
        />
      )}
    </div>
  )
}
