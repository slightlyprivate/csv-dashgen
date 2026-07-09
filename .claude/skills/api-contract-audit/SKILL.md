---
description: Audit API docs against routes, controllers, validation, responses, and tests on the current feature branch, fixing small docs/test mismatches directly.
allowed-tools: Bash, Read, Grep, Glob, Edit, MultiEdit
---

# API Contract Audit

## Purpose

Verify that `docs/api/*.md` accurately reflects the actual implementation: routes, controllers, request validation, response payloads, and tests.

## When to Use This

Before merging a feature branch that touches API endpoints, or whenever asked to check/audit API docs against the implementation.

## Instructions

Compare these sources of truth against each other for the current feature branch:

- `routes/api.php`
- controllers
- request validation classes (Form Requests)
- response payload helpers / JSON Resources
- feature tests
- `docs/api/*.md` files touched by this branch

Look for:

- docs listing endpoints that do not exist
- endpoints missing from docs
- request fields documented differently than validation
- date formats mismatched between docs and validation
- response fields documented but not tested
- response fields returned but not documented
- error codes that differ from the actual exception renderers
- auth requirements missing or inaccurate
- server-controlled fields described as client-settable
- mutable/immutable field behavior described unclearly
- route names inconsistent with tests

## Constraints

- Fix small, safe docs/test mismatches directly.
- For mismatches that would require an implementation change, stop and report rather than expanding scope — do not silently change behavior to match docs, or docs to match behavior, without flagging the tradeoff.
- Do not touch unrelated documentation or endpoints outside the current branch's diff.

## Verification

Run the feature tests relevant to the touched endpoints and report pass/fail results.

## Output

Report:

1. Mismatches found, each classified by severity
2. Fixes made directly (docs/tests)
3. Any implementation-mismatch findings that need a scope decision before proceeding
4. Test results

User request or arguments:

$ARGUMENTS
