<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Obsidian Project Documentation

This project maintains a structured Obsidian-compatible documentation system under `docs/obsidian/`. It is the project's human-readable knowledge layer.

Whenever significant architecture, database, security, payment, feature, infrastructure, or product changes are made:

1. Determine which documentation files are affected.
2. Update the relevant documentation.
3. Preserve existing information unless it is demonstrably obsolete.
4. Never fabricate implementation details.
5. Use Obsidian-compatible Markdown with YAML frontmatter (`project`, `type`, `status`, `last_updated`).
6. Use [[Internal Links]] between related project notes.
7. Record important architectural decisions in Decisions.md.
8. Record significant changes in Changelog.md.
9. Keep documentation synchronized with the actual codebase.
10. Do not create duplicate documentation files unless explicitly instructed.

Documentation files:
- Project.md — project overview
- Architecture.md — system architecture and data flow
- Database.md — schema, relationships, RPCs, triggers, RLS policies, migrations
- Backend.md — backend services, APIs, RPCs, Edge Functions
- Frontend.md — UI and frontend architecture
- Security.md — auth, authorization, RLS, threat considerations, known risks
- Payments.md — payment lifecycle (mark placeholders clearly)
- Features.md — product capabilities (implemented / partial / planned / deprecated)
- Decisions.md — architecture and product decisions with rationale
- Bugs.md — known bugs and technical problems
- Tasks.md — outstanding implementation work
- Changelog.md — significant project changes
