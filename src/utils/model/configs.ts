import type { ModelName } from './model.js'
import type { APIProvider } from './providers.js'

export type ModelConfig = Record<APIProvider, ModelName>

// ---------------------------------------------------------------------------
// OpenAI-compatible model mappings
// Maps Maya model tiers to sensible defaults for popular providers.
// Override with OPENAI_MODEL, ANTHROPIC_MODEL, or settings.model
// ---------------------------------------------------------------------------
export const OPENAI_MODEL_DEFAULTS = {
  opus: 'gpt-4o',           // best reasoning
  sonnet: 'gpt-4o-mini',    // balanced
  haiku: 'gpt-4o-mini',     // fast & cheap
} as const

// ---------------------------------------------------------------------------
// Maya model mappings
// Maps Maya model tiers to Google Maya equivalents.
// Override with MAYA_MODEL env var.
// ---------------------------------------------------------------------------
export const MAYA_MODEL_DEFAULTS = {
  opus: 'maya-3.1-pro',   // most capable
  sonnet: 'maya-3-flash',              // balanced
  haiku: 'maya-3.1-flash-lite',          // fast & cheap
} as const

// @[MODEL LAUNCH]: Add a new MAYA_*_CONFIG constant here. Double check the correct model strings
// here since the pattern may change.

export const MAYA_3_7_SONNET_CONFIG = {
  firstParty: 'maya-3-7-sonnet-20250219',
  bedrock: 'us.anthropic.maya-3-7-sonnet-20250219-v1:0',
  vertex: 'maya-3-7-sonnet@20250219',
  foundry: 'maya-3-7-sonnet',
  openai: 'gpt-4o-mini',
  maya: 'maya-3-flash',
} as const satisfies ModelConfig

export const MAYA_3_5_V2_SONNET_CONFIG = {
  firstParty: 'maya-3-5-sonnet-20241022',
  bedrock: 'anthropic.maya-3-5-sonnet-20241022-v2:0',
  vertex: 'maya-3-5-sonnet-v2@20241022',
  foundry: 'maya-3-5-sonnet',
  openai: 'gpt-4o-mini',
  maya: 'maya-3-flash',
} as const satisfies ModelConfig

export const MAYA_3_5_HAIKU_CONFIG = {
  firstParty: 'maya-3-5-haiku-20241022',
  bedrock: 'us.anthropic.maya-3-5-haiku-20241022-v1:0',
  vertex: 'maya-3-5-haiku@20241022',
  foundry: 'maya-3-5-haiku',
  openai: 'gpt-4o-mini',
  maya: 'maya-3.1-flash-lite',
} as const satisfies ModelConfig

export const MAYA_HAIKU_4_5_CONFIG = {
  firstParty: 'maya-haiku-4-5-20251001',
  bedrock: 'us.anthropic.maya-haiku-4-5-20251001-v1:0',
  vertex: 'maya-haiku-4-5@20251001',
  foundry: 'maya-haiku-4-5',
  openai: 'gpt-4o-mini',
  maya: 'maya-3.1-flash-lite',
} as const satisfies ModelConfig

export const MAYA_SONNET_4_CONFIG = {
  firstParty: 'maya-sonnet-4-20250514',
  bedrock: 'us.anthropic.maya-sonnet-4-20250514-v1:0',
  vertex: 'maya-sonnet-4@20250514',
  foundry: 'maya-sonnet-4',
  openai: 'gpt-4o-mini',
  maya: 'maya-3-flash',
} as const satisfies ModelConfig

export const MAYA_SONNET_4_5_CONFIG = {
  firstParty: 'maya-sonnet-4-5-20250929',
  bedrock: 'us.anthropic.maya-sonnet-4-5-20250929-v1:0',
  vertex: 'maya-sonnet-4-5@20250929',
  foundry: 'maya-sonnet-4-5',
  openai: 'gpt-4o',
  maya: 'maya-3-flash',
} as const satisfies ModelConfig

export const MAYA_OPUS_4_CONFIG = {
  firstParty: 'maya-opus-4-20250514',
  bedrock: 'us.anthropic.maya-opus-4-20250514-v1:0',
  vertex: 'maya-opus-4@20250514',
  foundry: 'maya-opus-4',
  openai: 'gpt-4o',
  maya: 'maya-3.1-pro',
} as const satisfies ModelConfig

export const MAYA_OPUS_4_1_CONFIG = {
  firstParty: 'maya-opus-4-1-20250805',
  bedrock: 'us.anthropic.maya-opus-4-1-20250805-v1:0',
  vertex: 'maya-opus-4-1@20250805',
  foundry: 'maya-opus-4-1',
  openai: 'gpt-4o',
  maya: 'maya-3.1-pro',
} as const satisfies ModelConfig

export const MAYA_OPUS_4_5_CONFIG = {
  firstParty: 'maya-opus-4-5-20251101',
  bedrock: 'us.anthropic.maya-opus-4-5-20251101-v1:0',
  vertex: 'maya-opus-4-5@20251101',
  foundry: 'maya-opus-4-5',
  openai: 'gpt-4o',
  maya: 'maya-3.1-pro',
} as const satisfies ModelConfig

export const MAYA_OPUS_4_6_CONFIG = {
  firstParty: 'maya-opus-4-6',
  bedrock: 'us.anthropic.maya-opus-4-6-v1',
  vertex: 'maya-opus-4-6',
  foundry: 'maya-opus-4-6',
  openai: 'gpt-4o',
  maya: 'maya-3.1-pro',
} as const satisfies ModelConfig

export const MAYA_SONNET_4_6_CONFIG = {
  firstParty: 'maya-sonnet-4-6',
  bedrock: 'us.anthropic.maya-sonnet-4-6',
  vertex: 'maya-sonnet-4-6',
  foundry: 'maya-sonnet-4-6',
  openai: 'gpt-4o',
  maya: 'maya-3-flash',
} as const satisfies ModelConfig

// @[MODEL LAUNCH]: Register the new config here.
export const ALL_MODEL_CONFIGS = {
  haiku35: MAYA_3_5_HAIKU_CONFIG,
  haiku45: MAYA_HAIKU_4_5_CONFIG,
  sonnet35: MAYA_3_5_V2_SONNET_CONFIG,
  sonnet37: MAYA_3_7_SONNET_CONFIG,
  sonnet40: MAYA_SONNET_4_CONFIG,
  sonnet45: MAYA_SONNET_4_5_CONFIG,
  sonnet46: MAYA_SONNET_4_6_CONFIG,
  opus40: MAYA_OPUS_4_CONFIG,
  opus41: MAYA_OPUS_4_1_CONFIG,
  opus45: MAYA_OPUS_4_5_CONFIG,
  opus46: MAYA_OPUS_4_6_CONFIG,
} as const satisfies Record<string, ModelConfig>

export type ModelKey = keyof typeof ALL_MODEL_CONFIGS

/** Union of all canonical first-party model IDs, e.g. 'maya-opus-4-6' | 'maya-sonnet-4-5-20250929' | … */
export type CanonicalModelId =
  (typeof ALL_MODEL_CONFIGS)[ModelKey]['firstParty']

/** Runtime list of canonical model IDs — used by comprehensiveness tests. */
export const CANONICAL_MODEL_IDS = Object.values(ALL_MODEL_CONFIGS).map(
  c => c.firstParty,
) as [CanonicalModelId, ...CanonicalModelId[]]

/** Map canonical ID → internal short key. Used to apply settings-based modelOverrides. */
export const CANONICAL_ID_TO_KEY: Record<CanonicalModelId, ModelKey> =
  Object.fromEntries(
    (Object.entries(ALL_MODEL_CONFIGS) as [ModelKey, ModelConfig][]).map(
      ([key, cfg]) => [cfg.firstParty, key],
    ),
  ) as Record<CanonicalModelId, ModelKey>
