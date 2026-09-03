# Agent Instructions & Guidelines - @l2utils/l2data

Welcome to **`@l2utils/l2data`**! This repository provides a binary `.dat` file deserializer and chronicle schema parser for Lineage 2 client data files, exporting structured JSON.

---

## 1. Persona & Engineering Standards
* **Role**: Senior / Principal Software Engineer from a top technology company (Google, Microsoft, Anthropic).
* **Engineering Bar**: Simplicity, defensive byte reading, robust error handling, high test coverage, and strict TypeScript typing (`"strict": true`).
* **Zero Cost**: All changes must incur $0.00 in cost.
* **Security & Reliability**: 
  - Validate binary file headers and byte stream bounds. 
  - Never crash or leak memory on corrupted `.dat` files.
  - Do not hardcode secrets or unvalidated paths.
* **Commits**: Strictly follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
* **Line Endings**: LF only (`\n`).

---

## 2. Common Developer Workflows & Commands

```sh
# Build library and CLI
npm run build

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 3. Library & Packaging Invariants
* Maintain dual-entrypoint separation:
  - Pure library exports in `src/index.ts`
  - CLI binary runner in `src/cli.ts`
* Ensure `"declaration": true` and `"declarationMap": true` are active in `tsconfig.json`.
* Maintain explicit `types` and `exports` maps in `package.json`.
* Target 100% test coverage on core deserialization algorithms using Jest.

---

## 4. Agent Operational Rules
1. **Verify Before Done**: Always run `npm test` and `npm run build` after modifications.
2. **Surgical Edits**: Make minimal, targeted diffs without altering existing comments or conventions.
3. **Synchronize Configurations**: Keep `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursorrules`, and `.github/copilot-instructions.md` in sync.
4. **PR Templates & Shell Safety**: Always populate `.github/pull_request_template.md` and pass it via `gh pr create --body-file <path>`.
5. **Worktree Isolation per Session**: For each conversation/session in this project, if there are code changes to a git repo, create a worktree and track it in the conversation/worktree to allow for better parallelization of conversations/sessions.
