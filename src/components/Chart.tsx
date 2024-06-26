import { useFetch, useWindowResizeEffect } from '@/hooks'
import { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import FrequencyButton from './FrequencyButton'
import { Frequency } from '@/types'

// Import Plot dynamically and disable ssr, plotly seems to be
// incompatible with the server (error thrown when pre-rendering)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface Props {
  selectedSymbol: string
  error: string
}

/* Displays the chart */
export default function Chart({ selectedSymbol, error }: Props) {
  const plotRef = useRef<HTMLDivElement>(null)
  const [plotSize, setPlotSize] = useState<{ height: number; width: number } | null>(null)
  const [frequency, setFrequency] = useState<Frequency>('daily')
  const { data, error: fetchError, fetching } = useFetch(frequency, selectedSymbol)

  const showError = error || fetchError

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
    if (showError) return <span className="text-red-600">{showError}</span>
    return 'Select a symbol'
  }

  return (
    <div ref={plotRef} className="w-full h-full mt-5 bg-white">
      {!data && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-[400px] text-center">{getNoDataMessage()}</div>
        </div>
      )}
      {!!data && (
        <>
          <div className="bg-white" style={{ width: plotSize?.width }}>
            <div className="pt-5 pl-5">
              <FrequencyButton frequency={'monthly'} currentFrequency={frequency} setFrequency={setFrequency} />
              <FrequencyButton frequency={'weekly'} currentFrequency={frequency} setFrequency={setFrequency} />
              <FrequencyButton frequency={'daily'} currentFrequency={frequency} setFrequency={setFrequency} />
            </div>
          </div>
          <Plot
            data={[{ ...data, type: 'candlestick' }]}
            layout={{ width: plotSize?.width, height: plotSize?.height, title: selectedSymbol }}
          />
        </>
      )}
    </div>
  )
}
