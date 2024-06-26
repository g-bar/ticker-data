'use client'

import { useState } from 'react'
import SymbolSelector from '@/components/SymbolSelector'
import Chart from '@/components/Chart'

export default function Home() {
  let [selectedSymbol, setSelectedSymbol] = useState('')
  const [symbolError, setSymbolError] = useState('')

  return (
    <main className="flex h-screen flex-col items-center justify-between p-8">
      <SymbolSelector setSelectedSymbol={setSelectedSymbol} setError={setSymbolError} />
      <Chart selectedSymbol={selectedSymbol} error={symbolError} />
    </main>
  )
}
