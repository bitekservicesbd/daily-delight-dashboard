---
name: Kanso design system
description: Color tokens, fonts, and custom utilities for the Kanso task app
type: design
---
Palette (oklch tokens in src/styles.css): warm off-white background (0.985 0.008 95), deep teal primary (0.52 0.09 195), amber accent (0.82 0.13 75). Added semantic tokens: --success, --warning. Radius 0.75rem.
Font: Plus Jakarta Sans (loaded via <link> in __root.tsx head), mapped to --font-sans.
Custom utilities: `bg-gradient-hero`, `shadow-soft`, `shadow-lifted`.
Priority/status badge styles live in src/lib/task-meta.ts. Never hardcode colors in components — extend the design system.
++