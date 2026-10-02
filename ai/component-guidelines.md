# Component Guidelines

This document defines the standards and best practices for creating and organizing components in the project.

The goal is to keep components:

- reusable
- maintainable
- predictable
- easy to understand

The project follows a **Feature-Based Modular Architecture**, therefore components are categorized based on their scope of responsibility.

---

# Component Categories

There are three categories of components:

```text
components/
├── common
└── ui

features/
└── feature-name
    └── components
```

Each category has a different responsibility.

---

# Global UI Components

Location:

```text
src/components/ui
```

These components are generic UI building blocks.

Examples:

- Button
- Input
- Card
- Dialog
- Badge
- Avatar
- Tabs
- Skeleton

## Responsibilities

- generic UI
- no business logic
- reusable everywhere
- design system implementation

These components should never call APIs or contain feature-specific behavior.

---

# Shared Components

Location:

```text
src/components/common
```

These components contain reusable business UI shared across multiple features.

Examples:

- PageHeader
- EmptyState
- ErrorView
- DataTable
- SearchBox
- Pagination
- UserAvatar
- LoadingSection

Unlike `ui` components, these may combine multiple UI elements into a reusable application component.

## Responsibilities

- shared business UI
- reusable across features
- minimal business logic
- no feature-specific API calls

---

# Feature Components

Location:

```text
features/<feature>/components
```

Feature components belong to a single business domain.

Examples:

```text
features/auth/components/login-form.tsx

features/profile/components/profile-card.tsx

features/dashboard/components/statistics-card.tsx
```

These components should only be used inside their own feature.

## Responsibilities

- feature UI
- feature interactions
- feature presentation
- local composition

If another feature needs the same component, consider moving it into `components/common`.

---

# Component Responsibility

A component should have a single responsibility.

Good example:

```
LoginForm
```

Bad example:

```
LoginForm
+ API Requests
+ Authentication Logic
+ Navigation
+ Toast Handling
+ Local Storage
```

Instead:

```
LoginForm
      ↓
useLogin()
      ↓
authService()
```

Components should focus on rendering the UI.

---

# Component Composition

Prefer composing small components instead of building one large component.

Example:

```
DashboardView
│
├── StatisticsCard
├── RecentOrders
├── SalesChart
└── UserSummary
```

Instead of:

```
DashboardPage
```

containing hundreds of lines of JSX.

Small components are easier to:

- maintain
- test
- reuse
- review

---

# Business Logic

Business logic should not live inside components.

Instead:

```
Component
      ↓
Hook
      ↓
Service
```

Example:

```tsx
const {data, isLoading} = useUsers();
```

instead of

```tsx
useEffect(() => {
    axios.get(...)
}, []);
```

---

# API Calls

Never call APIs directly inside components.

Incorrect:

```tsx
axios.get(...)
```

Correct:

```text
Component
      ↓
Hook
      ↓
Service
      ↓
API
```

This keeps the presentation layer independent from the data layer.

---

# State Management

Components should own only UI-related state.

Examples:

- dialog open
- selected tab
- input value
- expanded section

Server state should be managed by feature hooks.

Examples:

- users
- products
- profile
- dashboard statistics

---

# Props

Components should receive data through props.

Avoid accessing unrelated global state when props are sufficient.

Prefer explicit props over hidden dependencies.

Good:

```tsx
<UserCard user={user} />
```

Instead of relying on global state inside the component.

---

# Reusability

Before creating a new component, ask:

- Is this only for one feature?
- Will another feature use it?
- Can this become a shared component?

Use the following guideline:

| Usage             | Location               |
| ----------------- | ---------------------- |
| One feature       | features/\*/components |
| Multiple features | components/common      |
| Generic UI        | components/ui          |

---

# Naming Convention

Use PascalCase for component names.

Good:

```text
LoginForm
UserCard
ProfileHeader
StatisticsCard
```

Avoid generic names such as:

```text
Component
Item
Box
Data
Element
```

Names should clearly describe the component's purpose.

---

# File Organization

Prefer one component per file.

Example:

```text
components/
└── user-card.tsx
```

Avoid placing multiple unrelated components inside a single file.

---

# Dialog / Modal Rule

Do not implement custom modal states or raw dialog logic within features. The project uses a centralized dialog manager.

- Hook Location: src/hooks/use-dialog.ts

Mandatory Usage:

```
const { openDialog, closeDialog } = useDialog();

openDialog("component-name", {
  closeDialog,
  ...otherProps,
});

```

# Toast Component / Rule

Do not implement custom toast logic or use Sonner directly inside features. The project uses a centralized toast wrapper.

- component Location: src/common/toast

Mandatory Usage:

```ts
import {toast} from '@/components/common/toast';

toast.success('Operation completed successfully');
toast.error('Something went wrong');
toast.info('Here is some information');
toast.warning('Be careful with this action');
```

---

# Global Filters & Utilities

Global application filters and logic must be reused from the central utility layer to prevent logic duplication.

- Primary Definitions: src/utils/filters/index.ts
- Public Exports: src/utils/index.ts

Workflow:

- Check src/utils/index.ts for the required filter (e.g., date formatting, currency, status mapping).
- If it exists, import and use it.
- If it does not exist but is globally relevant, add it to src/utils/filters/index.ts first.
- Never duplicate common filtering logic (like Date Filtering) inside a feature folder.

---

# Component Size

A component should stay focused.

If a component grows too large:

- extract child components
- move logic into hooks
- extract utilities
- simplify responsibilities

Large components are harder to maintain and review.

---

# Styling

Use **Tailwind CSS** for styling.

Guidelines:

- prefer utility classes
- avoid inline styles
- extract repeated class combinations when appropriate
- keep styling close to the component

---

# Accessibility

Components should follow basic accessibility practices.

Examples:

- semantic HTML
- proper button elements
- labels for form fields
- keyboard navigation support
- appropriate ARIA attributes when necessary

Accessibility should be considered during development, not added later.

---

# Best Practices

- Keep components small.
- Prefer composition over duplication.
- Keep business logic outside components.
- Keep API calls inside services.
- Use hooks for stateful behavior.
- Reuse components whenever possible.
- Name components clearly.
- Follow consistent folder structure.
- Write components that are easy to test.

---

# Summary

Components are responsible only for presenting the UI.

The overall architecture follows this flow:

```text
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
Backend
```

By keeping components focused on presentation and delegating business logic to hooks and services, the project remains modular, scalable, and easy to maintain.
