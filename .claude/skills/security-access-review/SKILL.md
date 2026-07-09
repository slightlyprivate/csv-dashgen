---
description: Security and access-control review for the current feature branch — auth gaps, cross-tenant leaks, privilege escalation, and secret exposure.
allowed-tools: Bash, Read, Grep, Glob, Edit, MultiEdit
---

# Security & Access-Control Review

## Purpose

Review the current feature branch for security and access-control issues before it ships.

## When to Use This

Before merging any branch that touches authentication, authorization, membership, file storage, or notifications — or whenever asked for a security review of pending changes.

## Instructions

Focus on:

- unauthenticated access to private endpoints
- authorization gaps between controller and service layer
- cross-organization and cross-production data leaks
- removed/inactive member behavior
- route model binding leaks
- soft-deleted records still accessible
- token, password, invitation token, or storage path exposure
- server-controlled fields being accepted from requests
- privilege escalation through create/update endpoints
- notification recipient leaks
- file download/upload safety
- secrets or credentials committed
- logs containing sensitive values

## Constraints

- For each issue found, classify severity.
- Fix small, safe issues directly.
- Add regression tests for fixed issues.
- Avoid unrelated feature work.

## Verification

Run focused tests for the touched area, then the full suite if practical.

## Output

Report: issues found by severity, fixes made directly, regression tests added, and final test result.

User request or arguments:

$ARGUMENTS
