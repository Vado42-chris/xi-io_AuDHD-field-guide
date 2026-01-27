# xi-io: AuDHD Field Guide

## System Overview
xi-io is a specialized nervous-system stabilization platform designed for AuDHD (Autistic/ADHD) users. It utilizes **Hallberg Math** for stability quantization and the **Gemini 3 Pro** engine for "Neural Relay" coaching.

## Setup Requirements

### 1. Intelligence Uplink (API Key)
This application requires a Google Gemini API Key.
- **Provider**: [Google AI Studio](https://aistudio.google.com/)
- **Configuration**: The application looks for an environment variable named `API_KEY`.
- **Note**: Ensure the key has permissions for the `gemini-3-pro-preview` model.

### 2. Environment Variables
If hosting on platforms like Vercel, Netlify, or Cloudflare Pages, set:
`API_KEY=your_gemini_api_key_here`

## Architectural Philosophy
- **Hallberg Math**: A proprietary heuristic that calculates "R-Factor" (Environmental Stability) by cross-referencing sensory load entries against a Fibonacci-weighted assessment baseline.
- **PDA Reframing**: The "Coach" is programmed to bypass Pathological Demand Avoidance by reframing tasks as "Autonomous Choice" rather than "External Requirements."
- **Spoon Economy**: A finite resource tracking system (U-Units) that visualizes cognitive battery life.

## For AI Agents / Future Developers
- **Persistence**: All user data (Archive, Lexicon, Responses) is stored in `localStorage` under the `xi_` prefix.
- **Modularity**: 
  - `types.ts`: Core interfaces for the neuro-inclusion framework.
  - `services/hallbergMath.ts`: The mathematical engine for stability analysis.
  - `services/geminiService.ts`: Context-aware AI integration with multi-turn history support.
- **UI Guidelines**:
  - High-contrast, dark-mode-only aesthetic.
  - "Flashlight" effect for sensory focus.
  - Grid overlays to reduce visual noise (Low Friction design).

## Operational Status
- **Current Version**: 1.3.5
- **Neural Archive**: Functional (L1: Project Groups, L2: Signal Threads).
- **Stability Core**: Nominal.