---
description: Review Laravel migrations, models, factories, relationships, and lifecycle behavior changed in the current branch.
allowed-tools: Bash, Read, Grep, Glob, Edit, MultiEdit
---

# Migration & Model Review

## Purpose

Review migration and model changes in the current branch for schema correctness, data-integrity risk, and lifecycle consistency.

## When to Use This

After adding or changing a migration, model, factory, or relationship — especially before merging schema changes.

## Instructions

Check:

- foreign key types match referenced primary keys
- `nullable`/`nullOnDelete`/`cascade` behavior is intentional
- `down()` migrations are reliable (actually reverse the `up()`)
- indexes are useful and not redundant
- enum/string status columns have defaults/constraints when appropriate
- soft delete behavior is consistent
- parent soft-delete/restore cascades are intentional
- factories create valid, realistic records
- model `$casts` match the underlying DB column types
- `$fillable` attributes avoid mass-assignment risk
- relationships are named and typed consistently
- slug/identifier fields handle empty, long, duplicate, and non-URL-safe input
- multi-write operations use transactions

## Constraints

- Fix small, safe issues directly.
- Add lifecycle tests where appropriate (factory states, cascade behavior, casts).
- Do not change unrelated schema or models outside the current branch's diff.

## Verification

Run the tests covering the touched models/migrations (e.g. `docker compose run --rm -T app php artisan test`) and report results.

## Output

Report: issues found (with severity), fixes made directly, tests added, and final test result.

User request or arguments:

$ARGUMENTS
