import { afterEach, beforeEach, expect, test } from 'bun:test'
import { getAnthropicClient } from './client.js'

type FetchType = typeof globalThis.fetch

type ShimClient = {
  beta: {
    messages: {
      create: (params: Record<string, unknown>) => Promise<unknown>
    }
  }
}

const originalFetch = globalThis.fetch
const originalMacro = (globalThis as Record<string, unknown>).MACRO
const originalEnv = {
  MAYA_CODE_USE_MAYA: process.env.MAYA_CODE_USE_MAYA,
  MAYA_API_KEY: process.env.MAYA_API_KEY,
  MAYA_MODEL: process.env.MAYA_MODEL,
  MAYA_BASE_URL: process.env.MAYA_BASE_URL,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  ANTHROPIC_AUTH_TOKEN: process.env.ANTHROPIC_AUTH_TOKEN,
}

beforeEach(() => {
  ;(globalThis as Record<string, unknown>).MACRO = { VERSION: 'test-version' }
  process.env.MAYA_CODE_USE_MAYA = '1'
  process.env.MAYA_API_KEY = 'maya-test-key'
  process.env.MAYA_MODEL = 'maya-3-flash'
  process.env.MAYA_BASE_URL = 'https://maya.example/v1beta/openai'

  delete process.env.GOOGLE_API_KEY
  delete process.env.OPENAI_API_KEY
  delete process.env.OPENAI_BASE_URL
  delete process.env.OPENAI_MODEL
  delete process.env.ANTHROPIC_API_KEY
  delete process.env.ANTHROPIC_AUTH_TOKEN
})

afterEach(() => {
  ;(globalThis as Record<string, unknown>).MACRO = originalMacro
  process.env.MAYA_CODE_USE_MAYA = originalEnv.MAYA_CODE_USE_MAYA
  process.env.MAYA_API_KEY = originalEnv.MAYA_API_KEY
  process.env.MAYA_MODEL = originalEnv.MAYA_MODEL
  process.env.MAYA_BASE_URL = originalEnv.MAYA_BASE_URL
  process.env.GOOGLE_API_KEY = originalEnv.GOOGLE_API_KEY
  process.env.OPENAI_API_KEY = originalEnv.OPENAI_API_KEY
  process.env.OPENAI_BASE_URL = originalEnv.OPENAI_BASE_URL
  process.env.OPENAI_MODEL = originalEnv.OPENAI_MODEL
  process.env.ANTHROPIC_API_KEY = originalEnv.ANTHROPIC_API_KEY
  process.env.ANTHROPIC_AUTH_TOKEN = originalEnv.ANTHROPIC_AUTH_TOKEN
  globalThis.fetch = originalFetch
})

test('routes Maya provider requests through the OpenAI-compatible shim', async () => {
  let capturedUrl: string | undefined
  let capturedHeaders: Headers | undefined
  let capturedBody: Record<string, unknown> | undefined

  globalThis.fetch = (async (input, init) => {
    capturedUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url
    capturedHeaders = new Headers(init?.headers)
    capturedBody = JSON.parse(String(init?.body)) as Record<string, unknown>

    return new Response(
      JSON.stringify({
        id: 'chatcmpl-maya',
        model: 'maya-3-flash',
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'maya ok',
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 8,
          completion_tokens: 3,
          total_tokens: 11,
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }) as FetchType

  const client = (await getAnthropicClient({
    maxRetries: 0,
    model: 'maya-3-flash',
  })) as unknown as ShimClient

  const response = await client.beta.messages.create({
    model: 'maya-3-flash',
    system: 'test system',
    messages: [{ role: 'user', content: 'hello' }],
    max_tokens: 64,
    stream: false,
  })

  expect(capturedUrl).toBe('https://maya.example/v1beta/openai/chat/completions')
  expect(capturedHeaders?.get('authorization')).toBe('Bearer maya-test-key')
  expect(capturedBody?.model).toBe('maya-3-flash')
  expect(response).toMatchObject({
    role: 'assistant',
    model: 'maya-3-flash',
  })
})
