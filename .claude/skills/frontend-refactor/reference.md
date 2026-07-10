# Frontend Refactor — Architecture Reference

Detailed rules for the [frontend-refactor](SKILL.md) skill. Read the relevant section before making structural decisions.

## Single Responsibility

Every file should have a clear primary responsibility. Avoid files that mix:

- route/page orchestration
- data transformation
- UI subcomponents
- business rules
- formatting helpers
- permission logic
- API concerns

Split these into appropriate files when practical.

## Route/Page Components

Route/page component files should stay thin. A route/page file should generally:

- load route params/search params if needed
- call existing hooks or data loaders
- handle top-level loading/error/empty states
- compose extracted components
- export one main function component

A route/page file should **not** contain:

- multiple supporting function components
- large JSX sections that can be named and extracted
- repeated card/list/item markup
- inline helper functions beyond trivial local glue
- large permission or formatting logic
- hardcoded repeated copy blocks

If a route/page file currently contains supporting components, extract each meaningful supporting component into its own file.

## One Component Per File

Prefer one exported function component per component file. Acceptable exceptions:

- tiny private constants
- small static config arrays
- type definitions used only by that component
- co-located helper functions that are genuinely trivial and not reused

Avoid multiple sibling React components in the same file unless one is a tiny private render helper and extracting it would clearly make the code worse.

## Supporting Components

Extract supporting components into focused files near the feature they support. Prefer feature-local folders when the component is feature-specific:

```txt
apps/web/src/features/<feature>/components/<ComponentName>.tsx
```

or, if the project already uses another convention (this repo is layer-first — see `apps/web/src/components/<area>/`), follow the existing convention.

Move components to shared UI only when they are genuinely reusable across multiple features:

```txt
apps/web/src/components/<ComponentName>.tsx
apps/web/src/components/ui/<ComponentName>.tsx
```

Do not prematurely make feature-specific components global.

## Helper Functions

Move reusable helper functions out of components and route files. Use shared helper files for logic such as:

- formatting dates/times/timezones
- building display labels
- normalizing API values
- permission-safe display logic
- sorting/filtering/grouping data
- mapping enum/status values to display metadata

Prefer locations like:

```txt
apps/web/src/lib/<domain>.ts
apps/web/src/utils/<domain>.ts
apps/web/src/features/<feature>/utils/<helper>.ts
```

Follow the repo's existing structure if it differs (this repo uses `apps/web/src/lib/<area>/`).

Helpers should be:

- pure where practical
- named clearly
- unit-tested when non-trivial
- independent from React unless they specifically need React

## DRY Without Over-Abstraction

Remove duplication, but do not create vague abstractions. Good abstractions are:

- named after real product concepts
- easy to read at call sites
- small and specific
- reused at least twice, or likely to become a stable shared pattern

Avoid abstractions like:

- `GenericCardThing`
- `renderSection(type, options)` when explicit components are clearer
- config-driven UI that hides simple markup
- premature generic components with many optional props

Prefer boring, readable code over clever code.

## TypeScript Standards

Use strict, explicit TypeScript where it improves safety. Prefer:

- existing API/domain types when available
- narrow union types for statuses and variants
- explicit component prop types
- descriptive prop names
- derived types only when they remain readable

Avoid:

- `any`
- unsafe casts
- duplicated type definitions for API objects
- overly broad `string` props for known statuses/variants
- large inline prop type objects in component signatures when a named type would be clearer

## React Standards

Use function components. Prefer:

- declarative JSX
- small components
- clear prop boundaries
- derived values via plain constants
- `useMemo` only when there is a real performance or referential stability reason
- `useCallback` only when it prevents meaningful re-renders or satisfies dependency stability

Avoid:

- unnecessary local state
- state derived from props when a computed value is enough
- effects for pure calculations
- effects that duplicate data-loading behavior already handled by hooks
- deeply nested ternaries
- large inline render functions

## Styling Standards

Preserve the existing visual direction unless the user explicitly requested a design change. Prefer:

- existing design tokens/classes/patterns
- consistent spacing, radius, shadows, and typography
- existing shared UI components
- responsive/mobile-first layout

Avoid:

- arbitrary Tailwind bracket classes like `max-w-[12rem]` unless absolutely necessary
- one-off styling that should be a shared pattern
- visual regressions hidden inside refactors
- dark-mode changes unless explicitly requested

## Accessibility Standards

Maintain or improve accessibility. Check:

- buttons have accessible names
- icon-only buttons have `aria-label`
- form inputs have labels
- modal focus behavior remains correct
- interactive controls are keyboard-accessible
- semantic headings remain logical
- links vs. buttons are used correctly

Do not remove accessibility attributes unless replacing them with better ones.

## Copy Standards

Preserve user-facing copy unless the user asked for copy changes. If copy is repeated or likely to be reused, move it to an appropriate shared copy/config file if the repo has that pattern. Do not casually introduce new product terminology.

For Company Call specifically:

- prefer `News Feed` for the feature
- do not introduce `Production Update` as a news type
- do not use `Announcement` as a catch-all label for member posts
- preserve permission-sensitive wording

## Permission and Privacy Standards

Do not weaken existing permission checks.

For Company Call specifically:

- admin/leadership-only actions must remain permission-gated
- regular members must not receive or display private conflict details
- regular members may see aggregate conflict counts only where supported
- do not expose private notes, reasons, names, or leadership-only details through UI refactors

If the frontend currently relies on backend-provided permission flags, preserve that contract.

## File Organization Preferences

Use clear, predictable names based on product concepts, not implementation details, e.g.:

```txt
ProductionNewsPage.tsx
PinnedNewsCarousel.tsx
PinnedNewsCard.tsx
RecentNewsList.tsx
RecentNewsCard.tsx
NewsPostAvatar.tsx
newsDisplay.ts
newsCopy.ts
newsTypes.ts
```

Do not create vague files like `helpers.ts`, `misc.ts`, `stuff.ts`, `components.tsx`, `utils.ts` unless the surrounding folder convention already makes the domain obvious.

## Testing Requirements

Update or add tests for behavior affected by the refactor. Tests should cover:

- existing behavior still works
- permission-gated UI still hides/shows correctly
- extracted helpers behave correctly when non-trivial
- important empty/loading/error states still render
- critical user interactions still work

Do not delete tests just because they are inconvenient. If a test becomes brittle because it depended on old DOM structure, update it to test user-visible behavior instead.
