# AI Coding Rules

---

# Purpose

This document defines mandatory coding rules for all AI coding assistants contributing to this repository.

These rules apply to Cursor, Claude Code, Codex, Windsurf, GitHub Copilot, and any future AI development tools.

Violation of these rules results in code rejection.

---

# Core Principles

AI must generate code that is:

- Production Ready
- Type Safe
- Readable
- Testable
- Maintainable
- Scalable

Never optimize for fewer lines of code.

Optimize for maintainability.

---

# Read Repository First

Before generating code always read

1. AGENTS.md
2. Product Requirements
3. Feature Architecture
4. Component Guidelines
5. API Integration
6. Definition of Done

Never generate code without understanding project conventions.

---

# Architecture Rules

Always follow

```text
View
↓

Component
↓

Hook
↓

Service
↓

API
```

Never skip layers.

---

# Component Rules

Components

- render UI
- receive props
- emit events
- stay focused on a single responsibility

Components must never

- call fetch()
- call axios
- implement business rules
- validate forms
- calculate workflow
- contain service logic
- contain reusable business transformations

Each component should have a single clear responsibility.

Each component should preferably contain only one main return.

If a component becomes too large or complex, split it into smaller components.

Component props should be typed with an interface named `IProps`.

Every component must stay within the repository size limit.

Components should not exceed 200 to 250 lines of code unless there is a strong and documented exception.

---

# Hook Rules

Hooks manage

- queries
- mutations
- local state
- orchestration

Hooks should never

- render JSX
- manipulate DOM
- duplicate service logic

---

# Service Rules

Services must:

- Communicate with APIs
- Map DTOs
- Normalize responses
- Normalize errors
- Stay framework-agnostic when possible
- **Use standalone exported functions instead of classes OR namespace objects.**

Services must never:

- Use classes for standard service implementation
- **Group service functions inside a single exported object (e.g., `export const myService = { ... }`).**
- Contain UI logic
- Contain component logic
- Contain DOM access
- Contain form validation
- Call APIs directly from UI components
- Bypass the service-request abstraction

Service files must follow the repository standard structure.
Never create ad-hoc HTTP logic inside components, hooks, or feature files.

## Service Code Structure Rule (Critical)

Always export each service action as a **standalone `async function`**. Do not wrap them inside service objects, modules, or classes.

### Bad Service Pattern (Do NOT do this)

```typescript
// Do NOT group functions inside an object
export const authenticationService = {
  async requestVerificationCode(request: RequestVerificationCodeRequest) {
    // ...
  },
  async verifyAuthenticationCode(request: VerifyAuthenticationCodeRequest) {
    // ...
  }
};
```

---

# Validation Rules

All validation belongs in

```text
validations/
```

Never validate inside JSX.

Use Zod.

---

# Utility Rules

Utilities

- pure
- deterministic
- reusable
- shared when logic is used in multiple features

No side effects.

No React imports.

Before creating new utility logic, check whether an existing shared utility already solves the problem.

Prefer shared/global utilities for logic such as:

- date filtering
- formatting
- parsing
- transformation
- reusable helpers

Do not duplicate utility logic across features.

---

# File and Type Naming Rules

All generated files must follow repository naming conventions.
Never create files with vague or incorrect names.

## 1. File Naming Conventions

- Do not use dots (`.`) to separate parts of the filename, except for the final extension.
- Use hyphens (`-`) instead of dots for naming parts like feature, layer, or responsibility.
- The only dot in a filename must be before the file extension, such as `.ts`, `.tsx`, `.css`.

### Bad file names

- `home.service.ts`
- `create-opportunity.service.ts`
- `proposal.card.tsx`
- `temp.ts`
- `helper.ts`
- `data.ts`

### Good file names

- `create-opportunity-service.ts`
- `proposal-card.tsx`
- `visit-filters.ts`
- `use-create-visit.ts`
- `user-controller.ts`
- `auth-middleware.ts`

## 2. Type and Interface Naming Conventions

- Use meaningful, PascalCase names for all types and interfaces.
- Do not use unclear names like `Data`, `Item`, `Result`, or `Stuff`.
- Prefer feature-specific names when the type belongs to a feature.
- Shared types should live in shared type files with clear names.
- Avoid naming types after files in an inconsistent way.
- Follow project conventions for index-based type barrels when applicable.

### Good type examples

- `CreateOpportunityInput`
- `VisitFilterParams`
- `UserProfile`
- `AuthTokenPayload`

---

# TypeScript Rules

Always

- enable strict typing
- avoid any
- prefer interfaces for models
- use type aliases when appropriate
- use `IProps` for component props interfaces

Never suppress compiler errors.

Keep types clear, explicit, and reusable.

Prefer project-standard naming conventions for interfaces, types, and barrels.

---

# Naming

Use meaningful names.

Good

```text
calculateOpportunityScore

canApproveProposal

useCreateVisit

ProposalCard
```

Bad

```text
helper

run

data

temp

test2
```

---

# Imports

Use path aliases.

Avoid deep relative imports.

Prefer

```text
@/components/ui
```

instead of

```text
../../../../components
```

---

# Styling

Use:

- Tailwind
- Design Tokens
- Existing UI Components

Guidelines:

- Never hardcode values.
- Use semantic tokens like `bg-primary` and `text-primary`.
- Reuse existing components.
- Do not introduce new styles unless necessary.

---

# Accessibility

Every generated UI must support

- keyboard navigation
- focus states
- semantic HTML
- ARIA labels

---

# Performance

Prefer

- lazy loading
- memoization where justified
- pagination
- virtualization for large datasets

Avoid premature optimization.

---

# API Rules

Never call fetch directly.

Never call axios inside components.

Always use

Component

↓

Hook

↓

Service

↓

HTTP Client

Do not bypass the service layer for any HTTP communication.

If a request is needed in a component, create or reuse the appropriate hook and service instead.

---

# Error Handling

Every async operation must handle

- loading
- success
- empty
- error

Never ignore rejected promises.

---

# Logging

Never use console.log in production code.

Use the project's logging solution.

---

# Security

Never

- expose secrets
- hardcode credentials
- trust client input
- bypass authorization

---

# Testing

Generate tests for

- business logic
- services
- reusable components

Prefer unit tests over snapshot tests.

---

# Code Duplication

Before writing code ask

- Does this already exist?
- Can it be reused?
- Can it be extended?
- Is there already a shared component for this?
- Is there already a shared utility for this?

Never duplicate logic.

Prefer extracting reusable logic into shared components, hooks, services, or utilities when appropriate.

If a modal, filter, formatter, or similar UI pattern already exists, reuse it instead of creating a new one.

# Comments

Only write comments when they explain intent.

Do not explain obvious code.

Bad

```ts
// increment counter
counter++;
```

Good

```ts
// Retry only idempotent requests to avoid duplicate writes.
```

---

# AI Decision Checklist

Before generating code verify

- Architecture respected
- Component responsibilities respected
- Hook responsibilities respected
- Service responsibilities respected
- Validation centralized
- No duplicated logic
- Shared/global component reused when available
- Shared/global utility reused when available
- Typed
- Accessible
- Responsive
- Testable
- File and type naming conventions respected
- Service implementation follows repository standard
- Component uses `IProps` for props typing
- Component stays within the size limit
- SEO-sensitive data fetching happens on the server when needed

---

# Forbidden

AI must never

- create business logic inside components
- duplicate API endpoints
- duplicate query keys
- bypass hooks
- bypass services
- bypass validations
- use any
- disable TypeScript errors
- ignore lint errors
- ignore failed tests
- use classes for standard service files
- create unnamed or vague files
- create oversized components without justification
- ignore shared/global reusable components or utilities

---

# Code Generation Strategy

Generate code in small increments.

Prefer

Feature

↓

Component

↓

Hook

↓

Service

↓

Tests

Before creating a new component or utility, check for reusable shared alternatives.

Never generate an entire feature in a single response.

If a shared/global component or utility exists, use it first.

---

# Refactoring

When improving existing code

Prefer

- extracting reusable logic
- reducing complexity
- improving naming
- removing duplication

Avoid unnecessary rewrites.

---

# Pull Request Expectations

Every generated change should

- compile successfully
- pass linting
- pass type checking
- respect repository architecture
- satisfy Definition of Done

---

# Golden Rule

Generate code as if another developer will maintain it for the next five years.

Readable code always wins over clever code.
