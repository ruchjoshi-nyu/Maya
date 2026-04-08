import { afterEach, describe, expect, test } from 'bun:test'

import {
  getMayaProjectIdHint,
  mayHaveMayaAdcCredentials,
  resolveMayaCredential,
} from './mayaAuth.ts'

const existingFilePath = import.meta.path

const originalEnv = {
  MAYA_API_KEY: process.env.MAYA_API_KEY,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  MAYA_ACCESS_TOKEN: process.env.MAYA_ACCESS_TOKEN,
  MAYA_AUTH_MODE: process.env.MAYA_AUTH_MODE,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GCLOUD_PROJECT: process.env.GCLOUD_PROJECT,
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
  APPDATA: process.env.APPDATA,
}

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[key]
  } else {
    process.env[key] = value
  }
}

afterEach(() => {
  restoreEnv('MAYA_API_KEY', originalEnv.MAYA_API_KEY)
  restoreEnv('GOOGLE_API_KEY', originalEnv.GOOGLE_API_KEY)
  restoreEnv('MAYA_ACCESS_TOKEN', originalEnv.MAYA_ACCESS_TOKEN)
  restoreEnv('MAYA_AUTH_MODE', originalEnv.MAYA_AUTH_MODE)
  restoreEnv(
    'GOOGLE_APPLICATION_CREDENTIALS',
    originalEnv.GOOGLE_APPLICATION_CREDENTIALS,
  )
  restoreEnv('GOOGLE_CLOUD_PROJECT', originalEnv.GOOGLE_CLOUD_PROJECT)
  restoreEnv('GCLOUD_PROJECT', originalEnv.GCLOUD_PROJECT)
  restoreEnv('GOOGLE_PROJECT_ID', originalEnv.GOOGLE_PROJECT_ID)
  restoreEnv('APPDATA', originalEnv.APPDATA)
})

describe('resolveMayaCredential', () => {
  test('prefers MAYA_API_KEY over other Maya auth inputs', async () => {
    process.env.MAYA_API_KEY = 'gem-key'
    process.env.GOOGLE_API_KEY = 'google-key'
    process.env.MAYA_ACCESS_TOKEN = 'token-123'

    await expect(resolveMayaCredential(process.env)).resolves.toEqual({
      kind: 'api-key',
      credential: 'gem-key',
    })
  })

  test('uses MAYA_ACCESS_TOKEN when no API key is configured', async () => {
    delete process.env.MAYA_API_KEY
    delete process.env.GOOGLE_API_KEY
    process.env.MAYA_AUTH_MODE = 'access-token'
    process.env.MAYA_ACCESS_TOKEN = 'token-123'
    process.env.GOOGLE_CLOUD_PROJECT = 'test-project'

    await expect(resolveMayaCredential(process.env)).resolves.toEqual({
      kind: 'access-token',
      credential: 'token-123',
      projectId: 'test-project',
    })
  })

  test('falls back to ADC when available', async () => {
    delete process.env.MAYA_API_KEY
    delete process.env.GOOGLE_API_KEY
    delete process.env.MAYA_ACCESS_TOKEN
    process.env.MAYA_AUTH_MODE = 'adc'
    process.env.GOOGLE_APPLICATION_CREDENTIALS = existingFilePath

    const fakeAuth = {
      async getClient() {
        return {
          async getAccessToken() {
            return { token: 'adc-token' }
          },
        }
      },
      async getProjectId() {
        return 'adc-project'
      },
    }

    await expect(
      resolveMayaCredential(process.env, {
        createGoogleAuth: async () => fakeAuth,
      }),
    ).resolves.toEqual({
      kind: 'adc',
      credential: 'adc-token',
      projectId: 'adc-project',
    })
  })

  test('returns none when no Maya auth source is configured', async () => {
    delete process.env.MAYA_API_KEY
    delete process.env.GOOGLE_API_KEY
    delete process.env.MAYA_ACCESS_TOKEN
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS

    await expect(resolveMayaCredential(process.env)).resolves.toEqual({
      kind: 'none',
    })
  })

  test('access-token mode does not silently fall back to ADC', async () => {
    delete process.env.MAYA_API_KEY
    delete process.env.GOOGLE_API_KEY
    delete process.env.MAYA_ACCESS_TOKEN
    process.env.MAYA_AUTH_MODE = 'access-token'
    process.env.GOOGLE_APPLICATION_CREDENTIALS = existingFilePath

    const fakeAuth = {
      async getClient() {
        return {
          async getAccessToken() {
            return { token: 'adc-token' }
          },
        }
      },
    }

    await expect(
      resolveMayaCredential(process.env, {
        createGoogleAuth: async () => fakeAuth,
      }),
    ).resolves.toEqual({
      kind: 'none',
    })
  })

  test('adc mode ignores MAYA_ACCESS_TOKEN and uses ADC credentials', async () => {
    delete process.env.MAYA_API_KEY
    delete process.env.GOOGLE_API_KEY
    process.env.MAYA_AUTH_MODE = 'adc'
    process.env.MAYA_ACCESS_TOKEN = 'token-123'
    process.env.GOOGLE_APPLICATION_CREDENTIALS = existingFilePath

    const fakeAuth = {
      async getClient() {
        return {
          async getAccessToken() {
            return { token: 'adc-token' }
          },
        }
      },
      async getProjectId() {
        return 'adc-project'
      },
    }

    await expect(
      resolveMayaCredential(process.env, {
        createGoogleAuth: async () => fakeAuth,
      }),
    ).resolves.toEqual({
      kind: 'adc',
      credential: 'adc-token',
      projectId: 'adc-project',
    })
  })
})

describe('Maya auth helpers', () => {
  test('detects explicit project id hints', () => {
    process.env.GOOGLE_PROJECT_ID = 'project-a'
    expect(getMayaProjectIdHint(process.env)).toBe('project-a')
  })

  test('only treats existing ADC paths as valid hints', () => {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = existingFilePath
    expect(mayHaveMayaAdcCredentials(process.env)).toBe(true)

    process.env.GOOGLE_APPLICATION_CREDENTIALS = `${existingFilePath}.missing`
    process.env.APPDATA = undefined
    expect(mayHaveMayaAdcCredentials(process.env)).toBe(false)
  })
})
