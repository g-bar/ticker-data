import { Frequency } from '@/types'
import { capitalize } from '@/utils'

interface Props {
  frequency: Frequency
  currentFrequency: Frequency
  setFrequency: (frequency: Frequency) => void
}

export default function FrequencyButton({ frequency, setFrequency, currentFrequency }: Props) {
  const disabled = currentFrequency === frequency
  const className = disabled
    ? 'mr-5 bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded cursor-not-allowed'
    : 'mr-5 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700'
  return (
    <button className={className} disabled={disabled} onClick={disabled ? undefined : () => setFrequency(frequency)}>
      {capitalize(frequency)}
    </button>
  )
}
