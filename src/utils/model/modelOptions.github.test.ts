import { afterEach, beforeEach, expect, mock, test } from 'bun:test'

import { resetModelStringsForTestingOnly } from '../../bootstrap/state.js'
import { saveGlobalConfig } from '../config.js'

async function importFreshModelOptionsModule() {
  mock.restore()
  mock.module('./providers.js', () => ({
    getAPIProvider: () => 'github',
  }))
  const nonce = `${Date.now()}-${Math.random()}`
  return import(`./modelOptions.js?ts=${nonce}`)
}

const originalEnv = {
  MAYA_CODE_USE_GITHUB: process.env.MAYA_CODE_USE_GITHUB,
  MAYA_CODE_USE_OPENAI: process.env.MAYA_CODE_USE_OPENAI,
  MAYA_CODE_USE_MAYA: process.env.MAYA_CODE_USE_MAYA,
  MAYA_CODE_USE_BEDROCK: process.env.MAYA_CODE_USE_BEDROCK,
  MAYA_CODE_USE_VERTEX: process.env.MAYA_CODE_USE_VERTEX,
  MAYA_CODE_USE_FOUNDRY: process.env.MAYA_CODE_USE_FOUNDRY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  ANTHROPIC_CUSTOM_MODEL_OPTION: process.env.ANTHROPIC_CUSTOM_MODEL_OPTION,
}

beforeEach(() => {
  mock.restore()
  delete process.env.MAYA_CODE_USE_GITHUB
  delete process.env.MAYA_CODE_USE_OPENAI
  delete process.env.MAYA_CODE_USE_MAYA
  delete process.env.MAYA_CODE_USE_BEDROCK
  delete process.env.MAYA_CODE_USE_VERTEX
  delete process.env.MAYA_CODE_USE_FOUNDRY
  delete process.env.OPENAI_MODEL
  delete process.env.OPENAI_BASE_URL
  delete process.env.ANTHROPIC_CUSTOM_MODEL_OPTION
  resetModelStringsForTestingOnly()
})

afterEach(() => {
  process.env.MAYA_CODE_USE_GITHUB = originalEnv.MAYA_CODE_USE_GITHUB
  process.env.MAYA_CODE_USE_OPENAI = originalEnv.MAYA_CODE_USE_OPENAI
  process.env.MAYA_CODE_USE_MAYA = originalEnv.MAYA_CODE_USE_MAYA
  process.env.MAYA_CODE_USE_BEDROCK = originalEnv.MAYA_CODE_USE_BEDROCK
  process.env.MAYA_CODE_USE_VERTEX = originalEnv.MAYA_CODE_USE_VERTEX
  process.env.MAYA_CODE_USE_FOUNDRY = originalEnv.MAYA_CODE_USE_FOUNDRY
  process.env.OPENAI_MODEL = originalEnv.OPENAI_MODEL
  process.env.OPENAI_BASE_URL = originalEnv.OPENAI_BASE_URL
  process.env.ANTHROPIC_CUSTOM_MODEL_OPTION =
    originalEnv.ANTHROPIC_CUSTOM_MODEL_OPTION
  saveGlobalConfig(current => ({
    ...current,
    additionalModelOptionsCache: [],
    additionalModelOptionsCacheScope: undefined,
    openaiAdditionalModelOptionsCache: [],
    openaiAdditionalModelOptionsCacheByProfile: {},
    providerProfiles: [],
    activeProviderProfileId: undefined,
  }))
  resetModelStringsForTestingOnly()
})

test('GitHub provider exposes only default + GitHub model in /model options', async () => {
  process.env.MAYA_CODE_USE_GITHUB = '1'
  delete process.env.MAYA_CODE_USE_OPENAI
  delete process.env.MAYA_CODE_USE_MAYA
  delete process.env.MAYA_CODE_USE_BEDROCK
  delete process.env.MAYA_CODE_USE_VERTEX
  delete process.env.MAYA_CODE_USE_FOUNDRY

  process.env.OPENAI_MODEL = 'github:copilot'
  delete process.env.ANTHROPIC_CUSTOM_MODEL_OPTION

  const { getModelOptions } = await importFreshModelOptionsModule()
  const options = getModelOptions(false)
  const nonDefault = options.filter(
    (option: { value: unknown }) => option.value !== null,
  )

  expect(nonDefault.length).toBe(1)
  expect(nonDefault[0]?.value).toBe('github:copilot')
})
