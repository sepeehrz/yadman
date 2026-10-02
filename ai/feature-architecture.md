# Feature Architecture

This document describes the standard architecture used for each feature inside the `features` directory.

Each feature represents a single business domain and should remain as independent as possible from other features.

---

# Feature Structure

```text
feature-name
├── components
├── hooks
├── service
├── types
├── utils
├── validations
└── views
```

---

# Architecture Overview

Each feature is designed as an isolated module that contains everything related to its own business logic.

A feature is responsible for:

- UI components
- API communication
- State management through hooks
- Validation
- Types
- Internal utilities
- Feature entry view

This modular approach keeps the application scalable and prevents unrelated code from being mixed together.

---

# Folder Responsibilities

## components

Contains UI components used only inside this feature.

Examples:

- cards
- tables
- forms
- dialogs
- sections
- feature-specific widgets

If a component becomes reusable across multiple features, it should be moved to:

```
components/common
```

---

## hooks

Contains feature-specific React hooks.

Responsibilities include:

- fetching data
- mutations
- cache management
- business logic
- local state management

Hooks should consume the service layer instead of making API requests directly.

Example flow:

```
Component
      ↓
Feature Hook
      ↓
Feature Service
      ↓
API Route
      ↓
Backend
```

---

## service

Contains all API communication for the feature.

Responsibilities:

- HTTP requests
- endpoint definitions
- request transformation
- response mapping

Services should never contain UI logic.

Example:

```
getUsers()
createUser()
updateProfile()
deleteItem()
```

---

## types

Contains TypeScript types used only inside this feature.

Examples:

- DTOs
- API responses
- Form models
- Component props
- Local interfaces

If a type is shared across multiple features, move it to:

```
src/types
```

---

## utils

Contains helper functions used only inside this feature.

Examples:

- data formatting
- converters
- filters
- feature-specific helpers

Utilities should stay inside the feature unless they are reused globally.

---

## validations

Contains validation schemas.

The project uses **Zod** for validation.

Examples:

- form schemas
- field validation
- parsing
- transformations

Example:

```
loginSchema.ts
profileSchema.ts
```

---

## views

Contains the main feature page.

The App Router imports this view instead of directly importing components.

Example:

```
app/dashboard/page.tsx
          ↓
features/dashboard/views/dashboard-view.tsx
```

Views compose:

- components
- hooks
- layouts

and represent the complete UI for the feature.

---

# Recommended Data Flow

```
App Route
      ↓
Feature View
      ↓
Feature Components
      ↓
Feature Hook
      ↓
Feature Service
      ↓
Internal API
      ↓
Backend
```

This separation keeps responsibilities clear and improves maintainability.

---

# Feature Independence

Each feature should:

- own its components
- own its hooks
- own its services
- own its types
- own its validation
- avoid importing implementation details from other features

Communication between features should happen through shared layers rather than direct dependencies.

---

# When to Use Global Folders

Move code outside the feature only if it is shared.

| Feature Scope | Global Scope      |
| ------------- | ----------------- |
| components    | components/common |
| hooks         | hooks             |
| service       | services          |
| types         | types             |
| utils         | utils             |

A good rule is:

> If another feature needs it, consider promoting it to a shared layer.

---

# Best Practices

- Keep features independent.
- Avoid circular dependencies.
- Keep components focused on UI.
- Keep hooks responsible for state and data.
- Keep services responsible for API communication only.
- Store validation schemas separately.
- Use TypeScript types for all public interfaces.
- Avoid placing unrelated business logic inside shared folders.

---

# Example Feature

```text
features
└── auth
    ├── components
    │   ├── login-form.tsx
    │   └── social-login.tsx
    ├── hooks
    │   └── use-login.ts
    ├── service
    │   └── index.ts
    ├── types
    │   └── index.ts
    ├── utils
    │   └── token.ts
    ├── validations
    │   └── loginSchema.ts
    └── views
        └── login-view.tsx
```

---

# Summary

Each feature should be a self-contained module that includes:

- UI components
- Business logic
- API communication
- Validation
- Types
- Utilities
- Main view

This architecture improves scalability, maintainability, code organization, and team collaboration while keeping each business domain isolated from the rest of the application.
