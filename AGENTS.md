# AI Agent Gateway

## Axon Acquisition Management Platform

This document is the entry point for every AI coding agent working on this repository.

Before making any modifications, always follow the workflow below.

---

# Project Context

Before generating any code, read these documents in order:

1. `00-project-idea.md`
2. `12-ai-coding-rules.md`

These documents explain the business goals, product requirements, and repository-wide development rules.

Never start implementation without understanding the project context.

---

# Architecture Rules

Before creating or modifying any feature, read:

- `03-frontend-architecture.md`
- `04-feature-architecture.md`

These documents define:

- Folder structure
- Feature boundaries
- Layer responsibilities
- Dependency rules
- Project architecture

Never violate the documented architecture.

---

# UI Development

Before implementing any UI or frontend component, read:

- `02-design-system.md`
- `05-component-guidelines.md`

These documents define:

- Design tokens
- Component standards
- Responsive behavior
- Accessibility
- Component responsibilities
- UI composition rules

Always reuse existing components before creating new ones.

---

# Business Logic

Before implementing business workflows or calculations, read:

- `06-business-logic-guidelines.md`

Business logic must never be implemented inside Components or Views.

Keep business rules centralized and reusable.

---

# API Development

Before implementing API communication, read:

- `07-api-integration.md`

If the implementation communicates with external systems, also read:

- `08-crm-integration.md`

Never communicate directly with APIs from UI components.

Always use the Service Layer.

---

# Feature Development Workflow

Before implementing a new feature:

1. Identify the owning Feature.
2. Review existing Components, Hooks, Services, and Utilities.
3. Reuse existing implementations whenever possible.
4. Implement the feature following the documented architecture.
5. Validate against `13-definition-of-done.md`

Never implement features outside their defined boundaries.

---

# Code Generation Rules

Every generated implementation must comply with:

- `12-ai-coding-rules.md`

These rules define:

- TypeScript standards
- Naming conventions
- Code organization
- Error handling
- Accessibility
- Performance
- Testing expectations

---

# Before Completing Any Task

Before considering work complete, verify the implementation against:

- `13-definition-of-done.md`

A feature is **not complete** simply because it works.

It must satisfy all documented quality requirements.

---

# AI Development Principles

Always:

- Follow documented architecture.
- Reuse existing code.
- Keep business logic centralized.
- Keep components focused on presentation.
- Keep services responsible for API communication.
- Write strongly typed code.
- Prefer maintainability over clever implementations.

Never:

- Invent business requirements.
- Duplicate existing logic.
- Ignore architecture documents.
- Bypass Hooks or Services.
- Introduce undocumented patterns.
- Hardcode business rules.
- Create one-off UI components when reusable alternatives exist.

---

# Decision Priority

If multiple documents appear to conflict, use the following priority order:

1. `AGENTS.md`
2. `03-frontend-architecture.md`
3. `04-feature-architecture.md`
4. `06-business-logic-guidelines.md`
5. `07-api-integration.md`
6. `05-component-guidelines.md`
7. `02-design-system.md`
8. `12-ai-coding-rules.md`
9. `13-definition-of-done.md`

Higher-priority documents always take precedence.

---

# Development Workflow

For every task, follow this sequence:

1. Understand the business requirement.
2. Read the relevant documentation.
3. Review existing implementations.
4. Plan the implementation.
5. Implement the feature.
6. Validate functionality.
7. Review against the Definition of Done.

Never skip any step.

---

# Golden Rule

Documentation is the single source of truth.

Every implementation should be directly traceable to the project documentation.

If a requirement is not documented, do not assume it—request clarification instead.
