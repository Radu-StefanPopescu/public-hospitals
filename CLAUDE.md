# FE Component Guidelines

# Optimal File Structure. Create those file and folders only if needed. The names presented here are just a description, the structure is what matters
    src/
    ├── assets/                           # Static files (images, fonts, icons)
    │
    ├── components/                       # Reusable UI components
    │   ├── ui/                           # Generic primitives (Button, Input, Modal)
    │   │   ├── Button/
    │   │   │   ├── Button.tsx
    │   │   │   ├── Button.test.tsx       # Unit test co-located
    │   │   │   └── index.ts
    │   └── layout/                       # Layout components (Navbar, Sidebar, Footer)
    │
    ├── pages/                            # Route-level components (one per route)
    │   ├── Home/
    │   │   ├── Home.tsx
    │   │   ├── Home.test.tsx             # Page-level render tests
    │   │   └── index.ts
    │   ├── Dashboard/
    │   └── Settings/
    │
    ├── features/                         # Feature-based modules (co-located logic)
    │   └── auth/
    │       ├── components/               # Feature-specific components
    │       │   ├── LoginForm.tsx
    │       │   └── LoginForm.test.tsx    # Component unit test
    │       ├── hooks/                    # Feature-specific hooks
    │       │   ├── useAuth.ts
    │       │   └── useAuth.test.ts       # Hook unit test
    │       ├── store/                    # State (Redux slice, Zustand store, etc.)
    │       │   ├── authSlice.ts
    │       │   └── authSlice.test.ts     # Store/reducer unit test
    │       ├── api.ts                    # API calls for this feature
    │       ├── api.test.ts               # API mock tests
    │       └── index.ts                  # Public exports
    │
    ├── hooks/                            # Shared custom hooks (useDebounce, useMediaQuery)
    │   ├── useDebounce.ts
    │   └── useDebounce.test.ts
    │
    ├── services/                         # API clients, third-party integrations
    │   └── api/
    │       ├── client.ts                 # Axios/fetch base config
    │       ├── client.test.ts
    │       └── endpoints.ts
    │
    ├── store/                            # Global state (Redux store, Zustand root)
    │
    ├── utils/                            # Pure helper functions (formatDate, validators)
    │   ├── formatDate.ts
    │   └── formatDate.test.ts            # Pure functions are easiest to test
    │
    ├── types/                            # Global TypeScript types & interfaces
    │
    ├── constants/                        # App-wide constants (routes, config values)
    │
    ├── styles/                           # Global styles, theme, CSS variables
    │
    ├── __tests__/                        # Integration & E2E-adjacent tests
    │   ├── integration/
    │   │   ├── auth.integration.test.tsx # Multi-component flow tests
    │   │   └── checkout.integration.test.tsx
    │   └── setup/
    │       ├── jest.setup.ts             # Global test setup
    │       ├── msw.handlers.ts           # MSW mock API handlers
    │       └── renderWithProviders.tsx   # Custom render helper
    │
    ├── e2e/                              # E2E tests (Playwright/Cypress)
    │   ├── auth.spec.ts
    │   ├── checkout.spec.ts
    │   └── playwright.config.ts
    │
    ├── App.tsx
    ├── main.tsx
    └── routes.tsx
# All components should be reusable and should look like this
    interface ComponentPops{}
    export const Component = ({}:ComponentPops) => {
    const styles = {
    
          }
          return (
              <div></div>
          )
    }
# SVGs should only be located in assets
# Big Texts should be extracted in a ts file that exports a constant with ther value and then be used inside the components
# Do not
- Do not add `// comments` explaining what obvious code does.
- Do not add error-handling for scenarios that cannot happen.
- Do not create abstractions for one-off operations.
- Do not add features or refactor code beyond what was explicitly requested.
- Do not use `style={{}}` inline styles.
- Do not hardcode colours — use design tokens.
- Do not use `export default` for components.
