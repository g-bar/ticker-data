'use client'

import { useState } from 'react'
import SymbolSelector from '@/components/SymbolSelector'
import Chart from '@/components/Chart'
import { useFetchSymbolData } from '@/hooks'

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const { chartData, error, fetching } = useFetchSymbolData(selectedSymbol)

  return (
    <main className="flex h-screen flex-col items-center justify-between p-8">
      <SymbolSelector setSelectedSymbol={setSelectedSymbol} />
      <Chart chartData={chartData} fetching={fetching} error={error} selectedSymbol={selectedSymbol} />
    </main>
  )
}
