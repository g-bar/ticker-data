import AsyncSelect from 'react-select/async'
import { useDebounceCallback } from 'usehooks-ts'

interface Props {
  setSelectedSymbol: (symbol: string) => void
  setError: (error: string) => void
}

/* Displays the symbol selector, when the user types into the 
search box the api is queried to search for available symbols
*/
export default function SymbolSelector({ setSelectedSymbol, setError }: Props) {
  const loadOptions = useDebounceCallback((inputValue: string, callback: (data: { label: string }[]) => void) => {
    if (!inputValue) return
    const loadSymbols = async () => {
      const res = await fetch(`/api?function=SYMBOL_SEARCH&keywords=${inputValue}`)
      const data = await res.json()
      if (!data.bestMatches) {
        setError(data['Information'] ?? 'Unexpected Error, please try again')
        return
      }
      const symbolsRes = data as SymbolData
      const symbols = symbolsRes.bestMatches?.map(s => ({ label: s['1. symbol'] }))

      callback(symbols)
    }
    loadSymbols()
  }, 500)

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      onChange={e => setSelectedSymbol(e?.label ?? '')}
      className="w-[300px]"
      placeholder="Search for a symbol"
    />
  )
}

type SymbolData = {
  bestMatches: {
    '1. symbol': string
  }[]
}
