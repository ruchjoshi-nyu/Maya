# Maya VS Code Extension

A practical VS Code companion for Maya with a project-aware **Control Center**, predictable terminal launch behavior, and quick access to useful Maya workflows.

## Features

- **Real Control Center status** in the Activity Bar:
  - whether the configured `maya` command is installed
  - the launch command being used
  - whether the launch shim injects `MAYA_CODE_USE_OPENAI=1`
  - the current workspace folder
  - the launch cwd that will be used for terminal sessions
  - whether `.maya-profile.json` exists in the current workspace root
  - a conservative provider summary derived from the workspace profile or known environment flags
- **Project-aware launch behavior**:
  - `Launch Maya` launches from the active editor's workspace when possible
  - falls back to the first workspace folder when needed
  - avoids launching from an arbitrary default cwd when a project is open
- **Practical sidebar actions**:
  - Launch Maya
  - Launch in Workspace Root
  - Open Workspace Profile
  - Open Repository
  - Open Setup Guide
  - Open Command Palette
- **Built-in dark theme**: `Maya Terminal Black`

## Requirements

- VS Code `1.95+`
- `maya` available in your terminal PATH (`npm install -g @gitlawb/maya`)

## Commands

- `Maya: Open Control Center`
- `Maya: Launch in Terminal`
- `Maya: Launch in Workspace Root`
- `Maya: Open Repository`
- `Maya: Open Setup Guide`
- `Maya: Open Workspace Profile`

## Settings

- `maya.launchCommand` (default: `maya`)
- `maya.terminalName` (default: `Maya`)
- `maya.useOpenAIShim` (default: `false`)

`maya.useOpenAIShim` only injects `MAYA_CODE_USE_OPENAI=1` into terminals launched by the extension. It does not guess or configure a provider by itself.

## Notes on Status Detection

- Provider status prefers the real workspace `.maya-profile.json` file when present.
- If no saved profile exists, the extension falls back to known environment flags available to the VS Code extension host.
- If the source of truth is unclear, the extension shows `unknown` instead of guessing.

## Development

From this folder:

```bash
npm run test
npm run lint
```

To package (optional):

```bash
npm run package
```

