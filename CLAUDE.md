# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Bash Commands

- `pnpm build` - Type check + production build
- `pnpm dev` - Development build (watch mode)
- `pnpm lint` - Run oxlint + eslint
- `pnpm format` - Format with oxfmt

## Code Style

- Use ES modules (`import`/`export`), not CommonJS
- Use `this.app` instead of global `app` object
- Register events with `this.registerEvent()` for auto-cleanup
- Localize strings with `t("key.path")` from `src/i18n`

## Architecture

Obsidian plugin for extracting selected text into new notes.

- `main.ts` → `NoteCreatorService` → (`TemplateService`, `FrontmatterService`, `FolderService`)
- `ExtractionTemplate` in `src/types/settings.ts` is the core template type
- Template variables: `{{title}}`, `{{content}}`, `{{alias}}`, `{{date:FORMAT}}`

## Skills

Use `obsidian-plugin` skill for Obsidian API patterns, security rules, and UI components.
