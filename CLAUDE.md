# CLAUDE.md — crc-dispatch-demo

## Tipo
`web-app (TypeScript)` — sigue `00-CORE/Project-Standard.md` del vault.

Prototipo/demo del sistema de dispatch HSE para presentaciones a stakeholders (Stephanie Davidson, Richard Hill) antes del deploy en SharePoint. Se despliega en Netlify con build esbuild personalizado. Comparte la misma logica de UI y config que `crc-dispatch`, pero sin dependencias de SPFx ni PnPjs.

## Vault
Ver `HSE-COC/Project.md` para contexto completo del proyecto padre.

## Stack
- React 17 — TypeScript — Fluent UI v9 (`@fluentui/react-components`)
- React Hook Form + Zod (validacion de formularios)
- esbuild (build y watch via `esbuild.config.mjs`)
- Netlify (deploy estatico, SPA redirect configurado)
- Sin SPFx, sin PnPjs, sin SharePoint Lists — `spfx-shims.ts` simula el contexto SPFx

## Estructura
```
src/
├── components/     — UI (misma estructura que crc-dispatch)
├── config/         — Call types y workflow steps (fuente de verdad compartida)
├── context/        — Estado global del demo
├── hooks/          — Hooks de formulario y timer
├── models/         — Interfaces TypeScript
├── services/       — Servicios mock (sin llamadas reales a SharePoint)
├── utils/          — Formatters, validators
├── spfx-shims.ts   — Stub del contexto SPFx para compilar fuera de SharePoint
└── main.tsx        — Entry point
dist/               — Output del build (publicado por Netlify)
Doc/                — Instrucciones de cambios y documentacion de stakeholders
TODO.md             — Items pendientes que requieren datos de Stephanie/Richard
```

## Comandos
```bash
npm install
npm run dev        # watch mode: node esbuild.config.mjs --watch
npm run build      # bundle estatico a dist/
npm run preview    # sirve dist/ en localhost:3000 (npx serve)
```

**Deploy en Netlify:** push a `main` dispara build automatico (`npm run build`, publica `dist/`). El `netlify.toml` redirige todas las rutas al `index.html` (SPA).

## Reglas criticas
- Este repo es solo para demos — no contiene logica de negocio nueva; los cambios de workflows van primero en `crc-dispatch`
- Sin emojis en codigo, comentarios ni strings de consola
- Sin menciones de IA, Claude, o Anthropic en ningun archivo
- TypeScript strict — nunca `any`
- Los items en `TODO.md` requieren datos reales de stakeholders antes de implementarse; no inventar valores de contacto
- Datos de contacto (HSE On Call, IOCC/CCF, QI contacts) viven en `src/config/notification-contacts.ts` — fuente unica de verdad
- Commits en ingles, Conventional Commits
- Nunca push directo a `main`
