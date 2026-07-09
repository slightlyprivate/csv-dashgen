---
description: Refactor frontend React/TypeScript code using Matt's preferred architecture — DRY, single responsibility, thin page components, extracted supporting components, shared helpers, reusable UI patterns, strong typing, and updated tests.
allowed-tools: Bash, Read, Grep, Glob, Edit, MultiEdit
---

# Frontend Refactor

## Purpose

Refactor a targeted piece of frontend code toward this repo's preferred architecture — thin route/page files, small single-responsibility components, shared helpers, strong typing — while preserving existing behavior, API contracts, permissions, routing, and visual intent.

## When to Use This

When asked to refactor, clean up, split up, or reorganize existing React/TypeScript frontend code in `apps/web`. This is a focused refactor, not a redesign — do not use it to build new features or change visual design unless the user explicitly asks for that too.

## Instructions

1. **Inspect before editing.** Identify:
   - current route/page component structure
   - repeated JSX or logic
   - components embedded inside route/page files
   - helper functions embedded inside components
   - type definitions that should be shared
   - user-facing copy that should be centralized or reused
   - tests that will need updating
   - existing shared components/utilities that should be reused instead of creating new ones

2. **Produce a short implementation plan** before making changes, covering:
   - files likely to change
   - components to extract
   - helpers to extract
   - tests to update or add
   - risks to watch for

3. **Apply the refactor** following the architecture rules in [reference.md](reference.md) — single responsibility, thin route/page files, one component per file, extracted helpers, DRY without over-abstraction, TypeScript/React/styling/accessibility/copy/permission standards, and file naming conventions. Read that file before making structural decisions.

4. **Update tests** for any behavior touched by the refactor (see reference.md's Testing Requirements).

Prioritize, in order: clearer structure, single responsibility, reduced duplication, better component boundaries, safer TypeScript, better testability, existing-behavior preservation.

## Constraints

Do not:

- change backend API contracts
- rename product concepts casually
- mix unrelated cleanup into the branch
- rewrite working code from scratch without a clear reason
- change visual design unless asked
- add new dependencies without justification
- add new architecture patterns when existing repo patterns already work
- weaken existing permission checks (see reference.md's Permission and Privacy Standards)

Do:

- preserve current behavior
- improve boundaries
- reuse existing components/utilities
- keep diffs reviewable and scoped to the requested target
- keep route/page files thin
- extract repeated UI into real components and repeated logic into helper files
- update tests

## Verification

```bash
cd apps/web
npm run typecheck
npm run build
npm run test -- --run
git diff --check
```

For Company Call UI polish/refactor work specifically, also spot-check terminology and arbitrary styling drift:

```bash
rg -n "Production Update|View all|Pinned|max-w-\[|any" apps/web/src docs TASKS.md || true
```

Only run `rg` checks relevant to the task at hand.

## Output

Report:

1. Summary of what changed
2. Files changed
3. Components extracted
4. Helpers extracted
5. Tests added/updated
6. Verification commands run and their results
7. Any remaining risks or follow-up recommendations

If verification could not be completed, say exactly why and what still needs to be run.

Target or task from user:

$ARGUMENTS
