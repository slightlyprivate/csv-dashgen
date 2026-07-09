---
description: Triage Copilot/GitHub PR review comments (pasted by the user), fix valid issues, and rerun tests.
allowed-tools: Bash, Read, Grep, Glob, Edit, MultiEdit
---

# PR Review Comments Fix

## Purpose

Work through a batch of PR review comments (e.g. from GitHub Copilot or a human reviewer), decide which are valid, fix the valid ones, and leave the branch in a re-reviewable state.

## When to Use This

When the user pastes PR review comments and wants them triaged and addressed.

## Instructions

For each comment in the user's input:

1. Decide whether it is valid, partially valid, invalid, or out of scope.
2. Briefly explain the reasoning.
3. Fix valid small/medium issues directly.
4. Add or update a regression test for any behavioral fix.
5. Update docs/comments if the issue is contract- or wording-related.

## Constraints

- Do not expand scope beyond the current feature branch.
- Do not "fix" comments that are invalid or out of scope — explain why instead.

## Verification

- Run focused tests related to the changed area.
- Run the full test suite if practical.
- Run Pint on touched PHP files if practical (`./vendor/bin/pint --dirty` or equivalent).

## Output

Report:

1. Comment-by-comment disposition (valid/partial/invalid/out-of-scope + reasoning)
2. Files changed
3. Tests added/updated
4. Final test result
5. Whether the branch is ready for another review

PR review comments to analyze:

$ARGUMENTS
