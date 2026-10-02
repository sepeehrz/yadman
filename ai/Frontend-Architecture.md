# Frontend Architecture

# Project Structure

```text
├── app
│   └── api
├── components
│   ├── common
│   └── ui
├── config
├── features
│   ├── named your feature application
│   │   ├── components
│   │   ├── hooks
│   │   ├── service
│   │   ├── types
│   │   ├── utils
│   │   ├── validations
│   │   └── views
├── lib
│   ├── api
│   ├── fonts
├── middlewares
├── providers
├── services
├── types
└── utils

```

---

## Technologies Used

This project is built using the following core technologies:

- **Next.js 16** — React framework for building the application with App Router support
- **Tailwind CSS** — Utility-first CSS framework for styling
- **Zustand** — Lightweight state management library
- **Axios** — HTTP client for handling API requests

---

# Project Architecture

This project is structured based on a **Feature-Based Modular Architecture** using **Next.js App Router**.  
The goal of this structure is to keep the codebase **scalable**, **maintainable**, and **easy to understand** by separating:

- application routing and API layer
- feature-specific logic
- shared UI and reusable components
- global services, hooks, utilities, and providers

In this architecture, each business feature is isolated inside the `features` directory, while shared and application-wide logic is placed in dedicated global folders.

---

## Source Structure

```text
src
├── app
├── components
├── config
├── features
├── hooks
├── lib
├── middlewares
├── providers
├── services
├── types
└── utils
```

---

## Architecture Overview

The project follows a combination of:

- **App Router Structure** for pages, layouts, and route-level organization
- **Feature-Based Design** for grouping business logic by domain
- **Shared Layer Pattern** for reusable components, hooks, services, and utilities
- **Service + Hook Pattern** for handling API communication and stateful data fetching
- **Validation Layer** for form schemas and input validation using `zod`

This approach helps keep each feature self-contained while still allowing shared logic to be reused across the application.

---

## Folder Responsibilities

### `app`

The `app` directory contains the main application routing structure based on **Next.js App Router**.

It includes:

- application pages
- layouts
- route segmentation for authenticated and unauthenticated pages
- internal API routes

#### Responsibilities

- Defining the page structure of the application
- Separating pages that require authentication from public pages
- Providing API proxy routes under `/api` to forward requests to the main backend

The `/api` layer acts as a proxy between the frontend and the main backend service.  
This helps centralize request handling and gives more flexibility for authentication, security, and request transformation.

---

### `components`

The `components` directory contains shared UI building blocks used across the application.

It is divided into two parts:

#### `components/common`

Contains shared components that are reusable across multiple features or pages.

Examples:

- data presentation blocks
- layout sections
- shared business components

#### `components/ui`

Contains generic UI components, including:

- design system elements
- reusable base UI such as buttons, inputs, dialogs, etc.

These components are not tied to a specific feature and can be reused throughout the entire application.

#### `Layout & Shell Components` (`components/layout`)

- **Location:** `src/components/layout`
- **Definition:** Components that form the global application shell.
- **Examples:** `Sidebar`, `Header`, `Footer`, `Navbar`, `AppShell`.
- **Constraint:** These must NEVER be placed inside a `features/` folder. They are global and should be imported in `app/layout.tsx`.

---

### `config`

The `config` directory contains application-level configuration files.

This may include:

- static configuration
- constants
- environment-based settings
- app-wide options

Its purpose is to centralize configurable values and prevent hardcoded values from being scattered across the codebase.

---

### `features`

The `features` directory is the core of the project architecture.  
Each business domain or application feature is organized as an isolated module inside this folder.

- **Constraint:** Feature folders must only contain UI and logic specific to that domain. Global navigation or layout elements (like the main Sidebar) must NOT be implemented here.

Examples:

- `auth`
- `profile`
- other application-specific sections

Each feature usually contains the following internal structure:

text
feature-name
├── components
├── hooks
├── service
├── types
├── utils
├── validations
└── views

#### `features/*/components`

Contains UI components specific to that feature.  
These components are only used inside the same feature and are not meant to be shared globally unless promoted to `components/common` or `components/ui`.

#### `features/*/hooks`

Contains hooks related to that feature.

This folder also plays an important role in the data layer:

- feature services are called inside hooks
- `react-query` is used inside hooks for fetching, caching, mutations, and request state management
- components and views consume these hooks instead of calling services directly

This creates a clean separation between:

- API communication
- data/state handling
- UI rendering

#### `features/*/service`

Contains the service layer for the feature.

This is where backend calls related to that feature are defined.  
These services usually call the internal `/api` routes and encapsulate request logic for that domain.

#### `features/*/types`

Contains TypeScript types related only to that feature.

Examples:

- request and response types
- form types
- local data models

#### `features/*/utils`

Contains helper functions and internal utility snippets used only inside that feature.

These utilities are feature-scoped and should not be placed in global `utils` unless they are reusable across the whole project.

#### `features/*/validations`

Contains form validation schemas and related validation logic.

In this project, this layer is implemented using **Zod**.

Examples:

- login form schema
- profile form validation
- input parsing and transformation rules

#### `features/*/views`

Contains the main feature view that is imported into the `app` layer.

This acts as the entry point of the feature’s UI and connects the route-level page with the internal feature implementation.

In other words:

- `app` defines the route
- `views` provides the feature page/view
- `components` provide smaller UI pieces used inside that view

---

### `hooks`

The `hooks` directory contains **global hooks** that are not tied to a single feature.

Similar to feature hooks:

- services can be called inside these hooks
- business or shared logic can be handled here
- the resulting hooks can be reused across the whole application

This folder is useful for:

- app-wide behavior
- shared async logic
- common stateful abstractions

---

### `lib`

The `lib` directory contains library setup and integration configuration.

Examples:

- `axios` setup
- `i18n` initialization
- `dayjs` configuration
- wrappers around external libraries

This folder is intended for technical setup and low-level integrations, not for business logic.

---

### `middlewares`

The `middlewares` directory contains application-level middleware logic.

Examples:

- route protection
- auth checking
- access control
- request preprocessing

This layer is responsible for handling cross-cutting routing concerns before the user reaches a page or route.

---

### `providers`

The `providers` directory contains React providers used across the application.

Examples:

- theme provider
- dialog provider
- query provider
- other app-wide context providers

This folder helps centralize global application wrappers and keeps root composition clean and manageable.

---

### `services`

The `services` directory contains **global services** that are not related to a single feature.

These services are used when the logic:

- is shared across multiple parts of the application
- belongs to global UI sections like header or layout
- does not fit into one specific feature module

This separation helps avoid duplicating common API calls inside individual features.

---

### `types`

The `types` directory contains **global TypeScript types**.

This folder is usually used for:

- shared service types
- common API response types
- reusable application-wide interfaces and type definitions

Feature-specific types should remain inside `features/*/types`, while cross-feature types belong here.

---

### `utils`

The `utils` directory contains **global utility functions** and reusable code snippets.

Examples:

- filters
- formatting helpers
- localization-related helpers
- reusable transformation functions
- two-language utilities
- any helper needed across multiple parts of the application

If a utility is only useful inside one feature, it should stay in that feature’s `utils`.  
If it is reusable application-wide, it belongs here.

---

## Data Flow Pattern

A common implementation pattern in this architecture is:

1. A route is defined inside `app`
2. The route imports the related feature view from `features/*/views`
3. The view uses feature components and feature hooks
4. Hooks call the corresponding service layer
5. Services send requests to internal `/api` endpoints
6. `/api` routes proxy requests to the main backend

This creates a clear and maintainable flow between:

- routing
- presentation
- state/data handling
- API communication

---

## Architectural Benefits

This architecture provides several advantages:

- **Scalability**: each feature grows independently
- **Maintainability**: code is easier to locate and update
- **Separation of concerns**: routing, UI, services, hooks, and validation are clearly separated
- **Reusability**: shared logic is extracted into dedicated global layers
- **Team collaboration**: developers can work on separate features with less conflict
- **Consistency**: each feature follows a predictable internal structure

---

## Summary

In summary, this project uses a **modular feature-based frontend architecture** where:

- `app` handles routing and API entry points
- `features` contains business modules
- `components` contains shared UI
- `services`, `hooks`, `types`, and `utils` are split into feature-level and global-level responsibilities
- `lib`, `providers`, and `middlewares` support application-wide infrastructure and cross-cutting concerns

This structure is well-suited for medium to large-scale applications where clarity, modularity, and long-term maintainability are important.
