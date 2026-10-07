# API Integration Guide for AI Coding Agents

This project uses a strict layered architecture for all external API communication.

## Required Request Flow

```text
Component
  ↓
Feature Hook
  ↓
Feature Service
  ↓
Internal API Route
  ↓
External System
```

External systems include:

- the main backend REST services

---

## Internal API Domains

Use these internal API route groups:

- `src/app/api/*` → main backend REST services

Examples:

- `/api/users`
- `/api/orders`

---

## Non-Negotiable Rules

- Never call backend from components.
- Never bypass the feature hook or feature service layers.
- Components must use hooks.
- Hooks must use services.
- Services must call internal API routes only.
- Internal API routes are the only layer allowed to communicate with external systems.
- Do not expose backend base URL to the client.
- Use RESTful naming whenever possible.
- Avoid `any`; always define explicit TypeScript types.

---

## Layer Responsibilities

### Component

Responsible only for:

- rendering UI
- handling user interaction
- consuming feature hooks

Must not contain:

- direct API calls
- request construction
- backend

### Feature Hook

Responsible for:

- business flow
- React Query integration
- loading state
- error state
- caching
- refetching
- mutations

Hooks should expose clean, UI-friendly data to components.

### Feature Service

Responsible for:

- calling internal API routes
- endpoint definitions
- request configuration
- query parameter construction
- response mapping
- file upload logic

Services must not contain:

- React state
- component logic
- UI logic

### Internal API Route

Responsible for:

- proxying requests to backend
- attaching authentication headers
- request transformation
- response transformation
- centralized error normalization
- protecting external endpoints from direct client exposure

### Backend

Responsible for:

- business processing
- persistence
- integration logic

---

## Folder Conventions

```text
src/
  app/
    api/
  lib/
    api/
  types/
    server-types/
  utils/
    server-helpers/

features/
  <feature>/
    hooks/
    service/
    types/
```

---

## Shared API Client

Use a shared Axios client from:

```ts
src / lib / api;
```

This shared client should contain:

- base configuration
- default headers
- timeout
- authentication logic
- interceptors

Do not create ad hoc Axios instances inside feature services unless there is a strong technical reason.

---

## Request and Response Typing

Keep request and response models inside the feature.

Examples:

- `CreateUserRequest`
- `UpdateUserRequest`
- `UserDto`
- `UsersResponse`
- `PaginatedUsersResponse`

Do not use untyped API responses.

---

## React Query Rules

Hooks should manage server state using React Query.

Hooks are responsible for:

- queries
- mutations
- cache invalidation
- refetch behavior
- loading/error states

Components should consume hooks, not services.

---

## Query Parameters

Query parameters must be constructed inside the service layer.

Example:

```ts
getUsers(page, limit, search);
```

The service should build:

```text
/users?page=1&limit=20&search=john
```

Components must pass simple values, not manually constructed URLs.

---

## File Uploads

File upload logic belongs in the feature service layer.

Services may handle:

- multipart/form-data
- upload progress
- upload request config

Components should only trigger the upload flow.

---

## Authentication

Authentication must be handled centrally through:

- internal API routes
- Axios interceptors
- shared auth utilities

Do not implement authentication logic separately inside each feature service.

---

## Error Handling

Errors must be normalized before reaching the component layer.

Expected flow:

```text
External Error
  ↓
Internal API Route
  ↓
Service
  ↓
Hook
  ↓
Component
```

Components should receive user-friendly errors, not raw backend responses.

---

## Data Transformation

Transform backend responses before they reach the UI.

Expected flow:

```text
External Response
  ↓
Internal API Route or Service
  ↓
Mapped Model
  ↓
Hook
  ↓
Component
```

Components should receive presentation-ready data.

---

## Versioning

If API versioning is required, keep it centralized and consistent.

Example:

```text
/api/backend/v1/users
```

Do not scatter version strings across unrelated files.

---

## Examples

### Backend Flow

```text
Component
  ↓
useUsers()
  ↓
getUsers()
  ↓
GET /api/users
  ↓
Backend REST API
```

---

## Summary Rules for Code Generation

When generating code for this project:

1. Follow the layered flow exactly:
   `Component -> Hook -> Service -> Internal API Route -> External System`
2. Use `app/api/*` for backend REST integrations.
3. Never call external APIs directly from the component.
4. Put React Query logic in hooks.
5. Put HTTP logic in services.
6. Put proxy/auth/transformation/error normalization in internal API routes.
7. Use the shared Axios client from `src/lib/api`.
8. Keep types inside the related feature.
9. Prefer clear, strongly typed, RESTful implementations.
