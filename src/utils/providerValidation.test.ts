import { afterEach, expect, test } from 'bun:test'

import { getProviderValidationError } from './providerValidation.ts'

const originalEnv = {
  MAYA_CODE_USE_MAYA: process.env.MAYA_CODE_USE_MAYA,
  MAYA_API_KEY: process.env.MAYA_API_KEY,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  MAYA_ACCESS_TOKEN: process.env.MAYA_ACCESS_TOKEN,
  MAYA_AUTH_MODE: process.env.MAYA_AUTH_MODE,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
}

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[key]
  } else {
    process.env[key] = value
  }
}

afterEach(() => {
  restoreEnv('MAYA_CODE_USE_MAYA', originalEnv.MAYA_CODE_USE_MAYA)
  restoreEnv('MAYA_API_KEY', originalEnv.MAYA_API_KEY)
  restoreEnv('GOOGLE_API_KEY', originalEnv.GOOGLE_API_KEY)
  restoreEnv('MAYA_ACCESS_TOKEN', originalEnv.MAYA_ACCESS_TOKEN)
  restoreEnv('MAYA_AUTH_MODE', originalEnv.MAYA_AUTH_MODE)
  restoreEnv(
    'GOOGLE_APPLICATION_CREDENTIALS',
    originalEnv.GOOGLE_APPLICATION_CREDENTIALS,
  )
})

test('accepts MAYA_ACCESS_TOKEN as valid Maya auth', async () => {
  process.env.MAYA_CODE_USE_MAYA = '1'
  process.env.MAYA_AUTH_MODE = 'access-token'
  delete process.env.MAYA_API_KEY
  delete process.env.GOOGLE_API_KEY
  process.env.MAYA_ACCESS_TOKEN = 'token-123'

  await expect(getProviderValidationError(process.env)).resolves.toBeNull()
})

test('accepts ADC credentials for Maya auth', async () => {
  process.env.MAYA_CODE_USE_MAYA = '1'
  process.env.MAYA_AUTH_MODE = 'adc'
  delete process.env.MAYA_API_KEY
  delete process.env.GOOGLE_API_KEY
  delete process.env.MAYA_ACCESS_TOKEN

  await expect(
    getProviderValidationError(process.env, {
      resolveMayaCredential: async () => ({
        kind: 'adc',
        credential: 'adc-token',
        projectId: 'adc-project',
      }),
    }),
  ).resolves.toBeNull()
})

test('still errors when no Maya credential source is available', async () => {
  process.env.MAYA_CODE_USE_MAYA = '1'
  process.env.MAYA_AUTH_MODE = 'access-token'
  delete process.env.MAYA_API_KEY
  delete process.env.GOOGLE_API_KEY
  delete process.env.MAYA_ACCESS_TOKEN
  delete process.env.GOOGLE_APPLICATION_CREDENTIALS

  await expect(getProviderValidationError(process.env)).resolves.toBe(
    'MAYA_API_KEY, GOOGLE_API_KEY, MAYA_ACCESS_TOKEN, or Google ADC credentials are required when MAYA_CODE_USE_MAYA=1.',
  )
})
