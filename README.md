# Maya

Maya is an elite, open-source coding-agent CLI optimized for the **Google Gemini 3.1** ecosystem and local model providers.

Developed by **Ruchir Joshi**, Maya was inspired by the work of the [OpenClaude](https://github.com/Gitlawb/openclaude) project. As students, we often have access to powerful tools like **Gemini AI Pro** through our university subscriptions, yet many high-end agentic tools remain locked behind proprietary paywalls like Claude Code. Maya was built to bridge this gap—providing a professional-grade, agentic terminal for everyone who wants the power of an elite AI engineer without the proprietary price tag.

Use OpenAI-compatible APIs, **Gemini 3.1 (Pro/Flash)**, GitHub Models, Codex, Ollama, and more, while keeping one unified, terminal-first workflow.

[![License](https://img.shields.io/badge/license-MIT-2563eb)](LICENSE)
[![Gemini Optimized](https://img.shields.io/badge/optimized-Gemini%203.1-blue)](https://deepmind.google/technologies/gemini/)

[Quick Start](#quick-start) | [Why Maya](#why-maya) | [Setup Guides](#setup-guides) | [Providers](#supported-providers) | [Source Build](#source-build-and-local-development)

---

## Why Maya

- **Optimized for Students & Developers**: Deeply tuned for **Gemini 3.1 Pro** and **Flash**, taking full advantage of the 2M token context window available in many academic/developer tiers.
- **Elite Agentic Power**: Research, plan, and execute multi-file refactors autonomously. Maya doesn't just chat; it works your terminal.
- **Free & Open Source**: Built so that the engineering power of agentic tools is accessible to everyone, regardless of whether they can afford a Claude subscription.
- **Unified Workflow**: One CLI for every backend. Switch between Gemini, local Ollama models, or OpenAI with a single command.
- **Project Native**: Full support for `MAYA.md` and `.maya/` project standards to keep your agent aligned with your codebase.

## Quick Start

### Install

```bash
# Clone the repo
git clone https://github.com/ruchjoshi-nyu/maya.git
cd maya

# Install and build
bun install
bun run build

# Run locally
./bin/maya
```

### Start with Gemini (Highly Recommended)

Maya is optimized for Gemini 3.1. Ensure your `GEMINI_API_KEY` is set:

```bash
export GEMINI_API_KEY=your-key-here
./bin/maya
```

Inside Maya, run `/init` to automatically generate a `MAYA.md` file for your project.

## Supported Providers

| Provider | Optimization Level | Notes |
| --- | --- | --- |
| **Google Gemini** | 🚀 **Highest** | **Optimized for Gemini 3.1 Pro.** Uses native tool-calling and huge context windows. |
| **OpenAI** | ✅ High | Works with GPT-4o, GPT-4o-mini, and custom endpoints. |
| **Ollama** | ✅ High | Local inference with no API key required. |
| **GitHub Models** | ✅ High | Interactive onboarding for students with GitHub Copilot access. |

## What Works

- **Autonomous Coding**: Bash, file read/write/edit, grep, glob, and specialized engineering agents.
- **Deep Research**: Maya uses a "Research -> Strategy -> Execution" cycle to handle complex bugs.
- **Massive Context**: Specifically tuned to handle the large-scale context windows of the Gemini 3.1 series.
- **MCP Support**: Connect Maya to external tools and data via the Model Context Protocol.

## The Maya Story

Maya began as a personal project by **Ruchir Joshi** to make elite AI agent tools accessible to the student community. Inspired by the architectural foundations of **OpenClaude**, Maya has been rebranded and tuned specifically for the **Gemini 3** series of models. 

The goal is simple: **Any model. Every tool. Zero limits.**

---

## Disclaimer

Maya is an independent community project. It is a derivative work inspired by the OpenClaude project and the original engine principles of Claude Code. "Maya" is not affiliated with, endorsed by, or sponsored by Anthropic or Google.

## License

See [LICENSE](LICENSE).
