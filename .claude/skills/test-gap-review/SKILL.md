---
description: Find tests in the current branch whose names/docs overpromise compared to what they actually assert.
allowed-tools: Bash, Read, Grep, Glob, Edit, MultiEdit
---

# Test Gap Review

## Purpose

Catch tests whose names, docblocks, or comments claim more coverage than the assertions actually deliver.

## When to Use This

Before merging a branch with new or changed tests, or whenever asked to check whether tests actually verify what they claim to.

## Instructions

Review tests changed in this branch for gaps between test names, docs, and actual assertions. Look for:

- test names that claim behavior not actually asserted
- docs-alignment tests that only partially assert documented payloads
- security tests that send dangerous fields but do not verify they were ignored
- authorization tests that assert status code but not that state was left unchanged
- validation tests that do not assert specific error keys
- create/update/delete tests that do not verify database state
- route-scoping tests missing update/delete variants
- tests that use comments no longer true after implementation changes

## Constraints

- Fix small, safe test gaps directly.
- Do not change production behavior unless a test reveals a real bug — if it does, flag it and confirm scope before fixing.

## Verification

Run the focused tests you touched and report results.

## Output

Report: gaps found, fixes made directly, and any production-behavior bugs surfaced (with a note on whether they were in scope to fix).

User request or arguments:

$ARGUMENTS
