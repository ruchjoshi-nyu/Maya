import { afterEach, expect, test } from 'bun:test'

import { resetModelStringsForTestingOnly } from '../../bootstrap/state.js'
import { parseUserSpecifiedModel } from './model.js'
import { getModelStrings } from './modelStrings.js'

const originalEnv = {
  MAYA_CODE_USE_GITHUB: process.env.MAYA_CODE_USE_GITHUB,
  MAYA_CODE_USE_OPENAI: process.env.MAYA_CODE_USE_OPENAI,
  MAYA_CODE_USE_MAYA: process.env.MAYA_CODE_USE_MAYA,
  MAYA_CODE_USE_BEDROCK: process.env.MAYA_CODE_USE_BEDROCK,
  MAYA_CODE_USE_VERTEX: process.env.MAYA_CODE_USE_VERTEX,
  MAYA_CODE_USE_FOUNDRY: process.env.MAYA_CODE_USE_FOUNDRY,
}

function clearProviderFlags(): void {
  delete process.env.MAYA_CODE_USE_GITHUB
  delete process.env.MAYA_CODE_USE_OPENAI
  delete process.env.MAYA_CODE_USE_MAYA
  delete process.env.MAYA_CODE_USE_BEDROCK
  delete process.env.MAYA_CODE_USE_VERTEX
  delete process.env.MAYA_CODE_USE_FOUNDRY
}

afterEach(() => {
  process.env.MAYA_CODE_USE_GITHUB = originalEnv.MAYA_CODE_USE_GITHUB
  process.env.MAYA_CODE_USE_OPENAI = originalEnv.MAYA_CODE_USE_OPENAI
  process.env.MAYA_CODE_USE_MAYA = originalEnv.MAYA_CODE_USE_MAYA
  process.env.MAYA_CODE_USE_BEDROCK = originalEnv.MAYA_CODE_USE_BEDROCK
  process.env.MAYA_CODE_USE_VERTEX = originalEnv.MAYA_CODE_USE_VERTEX
  process.env.MAYA_CODE_USE_FOUNDRY = originalEnv.MAYA_CODE_USE_FOUNDRY
  resetModelStringsForTestingOnly()
})

test('GitHub provider model strings are concrete IDs', () => {
  clearProviderFlags()
  process.env.MAYA_CODE_USE_GITHUB = '1'

  const modelStrings = getModelStrings()

  for (const value of Object.values(modelStrings)) {
    expect(typeof value).toBe('string')
    expect(value.trim().length).toBeGreaterThan(0)
  }
})

test('GitHub provider model strings are safe to parse', () => {
  clearProviderFlags()
  process.env.MAYA_CODE_USE_GITHUB = '1'

  const modelStrings = getModelStrings()

  expect(() => parseUserSpecifiedModel(modelStrings.sonnet46 as any)).not.toThrow()
})
