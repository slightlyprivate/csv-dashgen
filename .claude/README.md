# Suggested workflow

For each feature branch:

implement feature

run

```bash
/test-gap-review
```

run

```bash
/api-contract-audit
```

if security-relevant
run

```bash
/security-access-review
```

run

```bash
/feature-branch-review
```

run

```bash
/pre-pr-package
```

open PR
after Copilot comments
run

```bash
/pr-review-comments-fix
```
