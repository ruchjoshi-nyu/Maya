import { formatTotalCost } from '../../cost-tracker.js'
import { currentLimits } from '../../services/mayaAiLimits.js'
import type { LocalCommandCall } from '../../types/command.js'
import { isMayaAISubscriber } from '../../utils/auth.js'

export const call: LocalCommandCall = async () => {
  if (isMayaAISubscriber()) {
    let value: string

    if (currentLimits.isUsingOverage) {
      value =
        'You are currently using your overages to power your Maya usage. We will automatically switch you back to your subscription rate limits when they reset'
    } else {
      value =
        'You are currently using your subscription to power your Maya usage'
    }

    if (process.env.USER_TYPE === 'ant') {
      value += `\n\n[internal-only] Showing cost anyway:\n ${formatTotalCost()}`
    }
    return { type: 'text', value }
  }
  return { type: 'text', value: formatTotalCost() }
}
