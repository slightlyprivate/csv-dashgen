---
description: Adversarial diff-consistency review of the current feature branch before declaring it merge-ready — cross-checks code, tests, docs, and comments against each other.
allowed-tools: Bash, Read, Grep, Glob, Edit, MultiEdit
---

# Feature Branch Review

## Purpose

Do a final adversarial consistency review of the current feature branch before it's declared ready to merge — not a summary that tests pass, but a cross-check of code against tests, docs, comments/docblocks, route names, request validation, service behavior, and the PR/task description.

## When to Use This

Before opening a PR or right before merging, once the branch is believed to be feature-complete. Use [[pre-pr-package]] afterward to assemble the actual PR description once this review is clean.

## Instructions

Compare the branch's code, tests, docs, comments, and task description against each other. Specifically look for:

- docs claiming behavior the code does not implement
- docs omitting important constraints from validation
- request validation accepting broader input than docs describe
- comments/docblocks that became stale after implementation changes
- dead try/catch blocks
- unused imports
- route names inconsistent with existing patterns
- server-controlled fields described as client-settable
- mutable fields that are actually immutable
- dates documented as `YYYY-MM-DD` but validated as a broader date/time format
- generated slugs/identifiers with empty, long, duplicate, or non-URL-safe edge cases
- check-then-insert race conditions
- missing transaction boundaries around multi-write operations
- API error code names that differ from the actual exception renderers
- tests whose names/comments overstate or misdescribe the behavior being tested

## Constraints

- For every issue found, classify severity before deciding how to act.
- Fix small, safe issues directly.
- Add a regression test for any behavior fix.
- Do not expand scope into unrelated features or files outside the branch's diff.

## Verification

Run focused tests for the touched area first, then the full suite if practical.

## Output

Report:

1. Files changed
2. Issues found, by severity, and which were fixed vs. flagged
3. Regression tests added
4. Final test result

User request or arguments:

$ARGUMENTS
