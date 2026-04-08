import { afterEach, expect, test } from 'bun:test'

import { getSystemPrompt, DEFAULT_AGENT_PROMPT } from './prompts.js'
import { CLI_SYSPROMPT_PREFIXES, getCLISyspromptPrefix } from './system.js'
import { GENERAL_PURPOSE_AGENT } from '../tools/AgentTool/built-in/generalPurposeAgent.js'
import { EXPLORE_AGENT } from '../tools/AgentTool/built-in/exploreAgent.js'

const originalSimpleEnv = process.env.MAYA_CODE_SIMPLE

afterEach(() => {
  process.env.MAYA_CODE_SIMPLE = originalSimpleEnv
})

test('CLI identity prefixes describe Maya instead of Maya', () => {
  expect(getCLISyspromptPrefix()).toContain('Maya')
  expect(getCLISyspromptPrefix()).not.toContain("Anthropic's official CLI for Maya")

  for (const prefix of CLI_SYSPROMPT_PREFIXES) {
    expect(prefix).toContain('Maya')
    expect(prefix).not.toContain("Anthropic's official CLI for Maya")
  }
})

test('simple mode identity describes Maya instead of Maya', async () => {
  process.env.MAYA_CODE_SIMPLE = '1'

  const prompt = await getSystemPrompt([], 'gpt-4o')

  expect(prompt[0]).toContain('Maya')
  expect(prompt[0]).not.toContain("Anthropic's official CLI for Maya")
})

test('built-in agent prompts describe Maya instead of Maya', () => {
  expect(DEFAULT_AGENT_PROMPT).toContain('Maya')
  expect(DEFAULT_AGENT_PROMPT).not.toContain("Anthropic's official CLI for Maya")

  const generalPrompt = GENERAL_PURPOSE_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(generalPrompt).toContain('Maya')
  expect(generalPrompt).not.toContain("Anthropic's official CLI for Maya")

  const explorePrompt = EXPLORE_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(explorePrompt).toContain('Maya')
  expect(explorePrompt).not.toContain("Anthropic's official CLI for Maya")
})
