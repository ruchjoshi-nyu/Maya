import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

import { memoizeWithTTLAsync } from './memoize.js'

const MAYA_ADC_SCOPE = 'https://www.googleapis.com/auth/cloud-platform'
const MAYA_ADC_CACHE_TTL_MS = 5 * 60 * 1000

export type MayaAuthMode = 'api-key' | 'access-token' | 'adc'

type GoogleAccessTokenResult =
  | string
  | null
  | undefined
  | {
      token?: string | null
    }

type GoogleAuthClientLike = {
  getAccessToken(): Promise<GoogleAccessTokenResult> | GoogleAccessTokenResult
}

type GoogleAuthLike = {
  getClient(): Promise<GoogleAuthClientLike>
  getProjectId?(): Promise<string>
}

export type MayaResolvedCredential =
  | {
      kind: 'api-key'
      credential: string
    }
  | {
      kind: 'access-token' | 'adc'
      credential: string
      projectId?: string
    }
  | {
      kind: 'none'
    }

type ResolveMayaCredentialDeps = {
  createGoogleAuth?: () => Promise<GoogleAuthLike>
}

function sanitizeCredential(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export function getMayaProjectIdHint(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  return (
    sanitizeCredential(env.GOOGLE_CLOUD_PROJECT) ??
    sanitizeCredential(env.GCLOUD_PROJECT) ??
    sanitizeCredential(env.GOOGLE_PROJECT_ID)
  )
}

export function getMayaAuthMode(
  env: NodeJS.ProcessEnv = process.env,
): MayaAuthMode | undefined {
  const normalized = sanitizeCredential(env.MAYA_AUTH_MODE)?.toLowerCase()
  if (
    normalized === 'api-key' ||
    normalized === 'access-token' ||
    normalized === 'adc'
  ) {
    return normalized
  }
  return undefined
}

export function getMayaAdcCredentialPaths(
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  const explicit = sanitizeCredential(env.GOOGLE_APPLICATION_CREDENTIALS)
  const paths = new Set<string>()

  if (explicit) {
    paths.add(explicit)
  }

  paths.add(join(homedir(), '.config', 'gcloud', 'application_default_credentials.json'))

  const appData = sanitizeCredential(env.APPDATA)
  if (appData) {
    paths.add(join(appData, 'gcloud', 'application_default_credentials.json'))
  }

  return [...paths]
}

export function mayHaveMayaAdcCredentials(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return getMayaAdcCredentialPaths(env).some(path => existsSync(path))
}

function normalizeAccessToken(
  value: GoogleAccessTokenResult,
): string | undefined {
  if (typeof value === 'string') {
    return sanitizeCredential(value)
  }
  return sanitizeCredential(value?.token)
}

async function createDefaultGoogleAuth(): Promise<GoogleAuthLike> {
  const { GoogleAuth } = await import('google-auth-library')
  return new GoogleAuth({
    scopes: [MAYA_ADC_SCOPE],
  }) as GoogleAuthLike
}

async function resolveMayaAdcCredentialUncached(
  env: NodeJS.ProcessEnv,
  deps: ResolveMayaCredentialDeps,
): Promise<Exclude<MayaResolvedCredential, { kind: 'none' | 'api-key' | 'access-token' }> | { kind: 'none' }> {
  if (!mayHaveMayaAdcCredentials(env)) {
    return { kind: 'none' }
  }

  try {
    const auth = await (deps.createGoogleAuth ?? createDefaultGoogleAuth)()
    const client = await auth.getClient()
    const accessToken = normalizeAccessToken(await client.getAccessToken())
    if (!accessToken) {
      return { kind: 'none' }
    }

    const hintedProjectId = getMayaProjectIdHint(env)
    const resolvedProjectId =
      hintedProjectId ??
      (typeof auth.getProjectId === 'function'
        ? sanitizeCredential(await auth.getProjectId().catch(() => undefined))
        : undefined)

    return {
      kind: 'adc',
      credential: accessToken,
      ...(resolvedProjectId ? { projectId: resolvedProjectId } : {}),
    }
  } catch {
    return { kind: 'none' }
  }
}

const resolveDefaultMayaAdcCredential = memoizeWithTTLAsync(
  async (
    googleApplicationCredentials: string | undefined,
    appData: string | undefined,
    home: string,
    projectIdHint: string | undefined,
  ) =>
    resolveMayaAdcCredentialUncached(
      {
        GOOGLE_APPLICATION_CREDENTIALS: googleApplicationCredentials,
        APPDATA: appData,
        GOOGLE_CLOUD_PROJECT: projectIdHint,
        GCLOUD_PROJECT: projectIdHint,
        GOOGLE_PROJECT_ID: projectIdHint,
        HOME: home,
      } as NodeJS.ProcessEnv,
      {},
    ),
  MAYA_ADC_CACHE_TTL_MS,
)

export async function resolveMayaCredential(
  env: NodeJS.ProcessEnv = process.env,
  deps: ResolveMayaCredentialDeps = {},
): Promise<MayaResolvedCredential> {
  const authMode = getMayaAuthMode(env)
  const apiKey =
    authMode === 'access-token' || authMode === 'adc'
      ? undefined
      : sanitizeCredential(env.MAYA_API_KEY) ??
        sanitizeCredential(env.GOOGLE_API_KEY)
  if (apiKey && (authMode === undefined || authMode === 'api-key')) {
    return {
      kind: 'api-key',
      credential: apiKey,
    }
  }

  const accessToken =
    authMode === 'api-key' || authMode === 'adc'
      ? undefined
      : sanitizeCredential(env.MAYA_ACCESS_TOKEN)
  if (accessToken && (authMode === undefined || authMode === 'access-token')) {
    const projectId = getMayaProjectIdHint(env)
    return {
      kind: 'access-token',
      credential: accessToken,
      ...(projectId ? { projectId } : {}),
    }
  }

  if (authMode === 'api-key' || authMode === 'access-token') {
    return { kind: 'none' }
  }

  if (deps.createGoogleAuth) {
    return resolveMayaAdcCredentialUncached(env, deps)
  }

  return resolveDefaultMayaAdcCredential(
    sanitizeCredential(env.GOOGLE_APPLICATION_CREDENTIALS),
    sanitizeCredential(env.APPDATA),
    homedir(),
    getMayaProjectIdHint(env),
  )
}
