// Content for the maya-api bundled skill.
// Each .md file is inlined as a string at build time via Bun's text loader.

import csharpMayaApi from './maya-api/csharp/maya-api.md'
import curlExamples from './maya-api/curl/examples.md'
import goMayaApi from './maya-api/go/maya-api.md'
import javaMayaApi from './maya-api/java/maya-api.md'
import phpMayaApi from './maya-api/php/maya-api.md'
import pythonAgentSdkPatterns from './maya-api/python/agent-sdk/patterns.md'
import pythonAgentSdkReadme from './maya-api/python/agent-sdk/README.md'
import pythonMayaApiBatches from './maya-api/python/maya-api/batches.md'
import pythonMayaApiFilesApi from './maya-api/python/maya-api/files-api.md'
import pythonMayaApiReadme from './maya-api/python/maya-api/README.md'
import pythonMayaApiStreaming from './maya-api/python/maya-api/streaming.md'
import pythonMayaApiToolUse from './maya-api/python/maya-api/tool-use.md'
import rubyMayaApi from './maya-api/ruby/maya-api.md'
import skillPrompt from './maya-api/SKILL.md'
import sharedErrorCodes from './maya-api/shared/error-codes.md'
import sharedLiveSources from './maya-api/shared/live-sources.md'
import sharedModels from './maya-api/shared/models.md'
import sharedPromptCaching from './maya-api/shared/prompt-caching.md'
import sharedToolUseConcepts from './maya-api/shared/tool-use-concepts.md'
import typescriptAgentSdkPatterns from './maya-api/typescript/agent-sdk/patterns.md'
import typescriptAgentSdkReadme from './maya-api/typescript/agent-sdk/README.md'
import typescriptMayaApiBatches from './maya-api/typescript/maya-api/batches.md'
import typescriptMayaApiFilesApi from './maya-api/typescript/maya-api/files-api.md'
import typescriptMayaApiReadme from './maya-api/typescript/maya-api/README.md'
import typescriptMayaApiStreaming from './maya-api/typescript/maya-api/streaming.md'
import typescriptMayaApiToolUse from './maya-api/typescript/maya-api/tool-use.md'

// @[MODEL LAUNCH]: Update the model IDs/names below. These are substituted into {{VAR}}
// placeholders in the .md files at runtime before the skill prompt is sent.
// After updating these constants, manually update the two files that still hardcode models:
//   - maya-api/SKILL.md (Current Models pricing table)
//   - maya-api/shared/models.md (full model catalog with legacy versions and alias mappings)
export const SKILL_MODEL_VARS = {
  OPUS_ID: 'claude-opus-4-6',
  OPUS_NAME: 'Maya Opus 4.6',
  SONNET_ID: 'claude-sonnet-4-6',
  SONNET_NAME: 'Maya Sonnet 4.6',
  HAIKU_ID: 'claude-haiku-4-5',
  HAIKU_NAME: 'Maya Haiku 4.5',
  // Previous Sonnet ID — used in "do not append date suffixes" example in SKILL.md.
  PREV_SONNET_ID: 'claude-sonnet-4-5',
} satisfies Record<string, string>

export const SKILL_PROMPT: string = skillPrompt

export const SKILL_FILES: Record<string, string> = {
  'csharp/maya-api.md': csharpMayaApi,
  'curl/examples.md': curlExamples,
  'go/maya-api.md': goMayaApi,
  'java/maya-api.md': javaMayaApi,
  'php/maya-api.md': phpMayaApi,
  'python/agent-sdk/README.md': pythonAgentSdkReadme,
  'python/agent-sdk/patterns.md': pythonAgentSdkPatterns,
  'python/maya-api/README.md': pythonMayaApiReadme,
  'python/maya-api/batches.md': pythonMayaApiBatches,
  'python/maya-api/files-api.md': pythonMayaApiFilesApi,
  'python/maya-api/streaming.md': pythonMayaApiStreaming,
  'python/maya-api/tool-use.md': pythonMayaApiToolUse,
  'ruby/maya-api.md': rubyMayaApi,
  'shared/error-codes.md': sharedErrorCodes,
  'shared/live-sources.md': sharedLiveSources,
  'shared/models.md': sharedModels,
  'shared/prompt-caching.md': sharedPromptCaching,
  'shared/tool-use-concepts.md': sharedToolUseConcepts,
  'typescript/agent-sdk/README.md': typescriptAgentSdkReadme,
  'typescript/agent-sdk/patterns.md': typescriptAgentSdkPatterns,
  'typescript/maya-api/README.md': typescriptMayaApiReadme,
  'typescript/maya-api/batches.md': typescriptMayaApiBatches,
  'typescript/maya-api/files-api.md': typescriptMayaApiFilesApi,
  'typescript/maya-api/streaming.md': typescriptMayaApiStreaming,
  'typescript/maya-api/tool-use.md': typescriptMayaApiToolUse,
}
