import { isBareMode, isEnvTruthy } from './envUtils.js'
import { getMayaAuthMode } from './mayaAuth.js'
import { getSecureStorage } from './secureStorage/index.js'

export const MAYA_TOKEN_STORAGE_KEY = 'maya' as const

export type MayaCredentialBlob = {
  accessToken: string
}

export function readMayaAccessToken(): string | undefined {
  if (isBareMode()) return undefined
  try {
    const data = getSecureStorage().read() as
      | ({ maya?: MayaCredentialBlob } & Record<string, unknown>)
      | null
    const token = data?.maya?.accessToken?.trim()
    return token || undefined
  } catch {
    return undefined
  }
}

export function hydrateMayaAccessTokenFromSecureStorage(): void {
  if (!isEnvTruthy(process.env.MAYA_CODE_USE_MAYA)) {
    return
  }
  const authMode = getMayaAuthMode(process.env)
  if (authMode && authMode !== 'access-token') {
    return
  }
  if (process.env.MAYA_ACCESS_TOKEN?.trim()) {
    return
  }
  if (isBareMode()) {
    return
  }
  const token = readMayaAccessToken()
  if (token) {
    process.env.MAYA_ACCESS_TOKEN = token
  }
}

export function saveMayaAccessToken(token: string): {
  success: boolean
  warning?: string
} {
  if (isBareMode()) {
    return { success: false, warning: 'Bare mode: secure storage is disabled.' }
  }
  const trimmed = token.trim()
  if (!trimmed) {
    return { success: false, warning: 'Token is empty.' }
  }
  const secureStorage = getSecureStorage()
  const previous = secureStorage.read() || {}
  const next = {
    ...(previous as Record<string, unknown>),
    [MAYA_TOKEN_STORAGE_KEY]: { accessToken: trimmed },
  }
  return secureStorage.update(next as typeof previous)
}

export function clearMayaAccessToken(): {
  success: boolean
  warning?: string
} {
  if (isBareMode()) {
    return { success: true }
  }
  const secureStorage = getSecureStorage()
  const previous = secureStorage.read() || {}
  const next = { ...(previous as Record<string, unknown>) }
  delete next[MAYA_TOKEN_STORAGE_KEY]
  return secureStorage.update(next as typeof previous)
}
