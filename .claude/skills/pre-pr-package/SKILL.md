---
description: Assemble the final PR description, change summary, and merge-readiness checklist for the current branch. Read-only — does not edit files.
allowed-tools: Bash, Read, Grep, Glob
---

# Pre-PR Package

## Purpose

Package up everything needed to open a PR: title, description, summary of behavior added, and a merge-readiness checklist — without editing any files.

## When to Use This

Once the branch is feature-complete and reviewed (see [[feature-branch-review]]), right before opening the pull request.

## Instructions

Inspect:

- `git diff develop...HEAD --stat`
- `git log develop..HEAD --oneline`
- `TASKS.md` changes
- docs changes
- tests added/updated

Produce:

1. PR title
2. Concise PR description
3. Summary of behavior added
4. Files changed by category
5. Tests run and results
6. Migration/config/env changes
7. Known deferred items
8. Reviewer notes / risk areas
9. Checklist before merge

## Constraints

Do not edit files. This skill only inspects and reports.

## Verification

Not applicable — this skill is read-only. If tests haven't been run recently, note that in the output rather than running them.

## Output

The 9-part package described above, ready to paste into a PR description.

User request or arguments:

$ARGUMENTS
