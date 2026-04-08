import { afterEach, beforeEach, expect, mock, test } from 'bun:test'

type MockStorageData = Record<string, unknown>

const originalEnv = { ...process.env }
let storageState: MockStorageData = {}

async function importFreshModule() {
  mock.module('./secureStorage/index.js', () => ({
    getSecureStorage: () => ({
      name: 'mock-secure-storage',
      read: () => storageState,
      readAsync: async () => storageState,
      update: (next: MockStorageData) => {
        storageState = next
        return { success: true }
      },
      delete: () => {
        storageState = {}
        return true
      },
    }),
  }))

  return import(`./mayaCredentials.ts?ts=${Date.now()}-${Math.random()}`)
}

beforeEach(() => {
  process.env = { ...originalEnv }
  storageState = {}
})

afterEach(() => {
  process.env = { ...originalEnv }
  storageState = {}
  mock.restore()
})

test('saveMayaAccessToken stores and reads back the token', async () => {
  const {
    readMayaAccessToken,
    saveMayaAccessToken,
  } = await importFreshModule()

  const result = saveMayaAccessToken('token-123')
  expect(result.success).toBe(true)
  expect(readMayaAccessToken()).toBe('token-123')
})

test('clearMayaAccessToken removes the stored token', async () => {
  const {
    clearMayaAccessToken,
    readMayaAccessToken,
    saveMayaAccessToken,
  } = await importFreshModule()

  expect(saveMayaAccessToken('token-123').success).toBe(true)
  expect(clearMayaAccessToken().success).toBe(true)
  expect(readMayaAccessToken()).toBeUndefined()
})
