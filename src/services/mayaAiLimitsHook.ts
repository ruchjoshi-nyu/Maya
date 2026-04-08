import { useEffect, useState } from 'react'
import {
  type MayaAILimits,
  currentLimits,
  statusListeners,
} from './mayaAiLimits.js'

export function useMayaAiLimits(): MayaAILimits {
  const [limits, setLimits] = useState<MayaAILimits>({ ...currentLimits })

  useEffect(() => {
    const listener = (newLimits: MayaAILimits) => {
      setLimits({ ...newLimits })
    }
    statusListeners.add(listener)

    return () => {
      statusListeners.delete(listener)
    }
  }, [])

  return limits
}
