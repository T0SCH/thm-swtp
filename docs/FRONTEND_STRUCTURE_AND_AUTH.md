# Frontend - Folder Structure & Architecture

A comprehensive guide to the IdeaCamp frontend application built with Angular 21, featuring Keycloak OAuth2 integration and modern Angular patterns.

---

## 📁 Project Structure

```
web/ideacamp/
├── src/
│   ├── app/                              # Angular Application Root
│   │   ├── app.ts                        # Root Component
│   │   ├── app.routes.ts                 # Route Configuration (Standalone)
│   │   ├── app.config.ts                 # App Configuration (Providers)
│   │   ├── app.html                      # Root Template
│   │   ├── app.css                       # Global Styles
│   │   ├── core/                         # Core Module (Singleton Services)
│   │   ├── config/                       # Configuration Files
│   │   ├── enviroments/                  # Environment Configuration
│   │   │   └── enviroment.dev.ts         # Dev Environment (API URL, OAuth Config)
│   │   ├── models/                       # Shared Data Models
│   │   │   ├── project.model.ts          # Project Interface/Type
│   │   │   └── user-profile.model.ts     # User Profile Interface/Type
│   │   ├── services/                     # Global Services
│   │   │   └── user-profile.service.ts   # User Profile API Service
│   │   ├── shared/                       # Reusable Components & Utilities
│   │   │   ├── header/                   # Header Component with Auth Panel
│   │   │   ├── sidebar/                  # Sidebar Navigation Component
│   │   │   ├── tag/                      # Tag Display Component
│   │   │   ├── icons/                    # SVG Icon Components
│   │   │   ├── edit-button/              # Reusable Edit Button
│   │   │   └── types/                    # Shared TypeScript Types
│   │   └── feature/                      # Feature Modules (Lazy-loadable)
│   │       ├── auth/                     # 🔐 Authentication Module
│   │       │   ├── auth.service.ts       # Keycloak/OIDC Service
│   │       │   ├── auth.guard.ts         # Route Guard (Requires Login)
│   │       │   ├── auth.interceptor.ts   # HTTP Interceptor (Adds Auth Tokens)
│   │       │   ├── success/              # OAuth Callback Handler
│   │       │   └── auth.service.spec.ts  # Unit Tests
│   │       ├── user-profile/             # User Profile Feature
│   │       │   ├── pages/
│   │       │   │   └── user-profile/     # Main Profile Page
│   │       │   └── components/           # Profile Sub-components
│   │       │       ├── profile-banner/
│   │       │       └── profile-information/
│   │       ├── project-create/           # Project Creation Wizard
│   │       │   ├── project-create.ts     # Main Wizard Container
│   │       │   ├── wizard-layout/        # Wizard Layout Component
│   │       │   ├── stepper/              # Stepper Control
│   │       │   ├── project-general-form/ # General Info Form
│   │       │   ├── project-members-form/ # Members Selection Form
│   │       │   ├── project-settings-form/# Settings Form
│   │       │   ├── project-finish-form/  # Summary & Submit
│   │       │   └── schemas/              # Zod Validation Schemas
│   │       ├── project-site/             # Project Detail Page
│   │       │   ├── project-site.ts       # Main Project Container
│   │       │   ├── project.service.ts    # Project API Service
│   │       │   ├── services/
│   │       │   │   └── project-tag.service.ts
│   │       │   └── components/
│   │       │       ├── project-header/   # Header with Title & Owner
│   │       │       ├── project-sidebar/  # Quick Info Sidebar
│   │       │       ├── info-card/        # Info Cards (Status, Dates, etc)
│   │       │       ├── member-list/      # Team Members Display
│   │       │       ├── open-position-card/ # Job Openings
│   │       │       ├── tech-stack/       # Technology Tags
│   │       │       ├── tag-list/         # Project Tags
│   │       │       └── quicklinks/       # Quick Action Links
│   │       ├── my-projects/              # User's Projects Dashboard
│   │       │   ├── pages/
│   │       │   │   └── my-projects-page/
│   │       │   └── services/
│   │       │       └── my-projects.service.ts
│   │       ├── search/                    # Global Search Feature
│   │       │   ├── pages/
│   │       │   │   └── search-page/      # Search Results Page
│   │       │   ├── components/
│   │       │   │   ├── user-result-card/ # User Search Result
│   │       │   │   └── project-result-card/ # Project Search Result
│   │       │   ├── services/
│   │       │   │   └── search.service.ts
│   │       │   └── models/
│   │       │       ├── user-search-result.model.ts
│   │       │       └── project-search-result.model.ts
│   │       ├── contact-request/          # Project Invitations/Requests
│   │       │   ├── pages/
│   │       │   │   └── contact-requests/ # Invitations Page
│   │       │   └── components/
│   │       │       ├── contact-request-box/
│   │       │       └── contact-request.model.ts
│   │       └── legal-notice/             # Legal Pages
│   │           └── pages/
│   │               └── impressum.ts      # Impressum (Legal Notice)
│   ├── main.ts                           # Bootstrap Entry Point
│   ├── index.html                        # Main HTML Template
│   └── styles.css                        # Global Styles
├── public/                               # Static Assets
├── angular.json                          # Angular CLI Configuration
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript Configuration
└── README.md                             # Project README
```

---

## 🔐 Authentication Architecture

### Overview

The application uses **Keycloak** as the OAuth2/OIDC identity provider with the Angular OAuth2 library (`angular-oauth2-oidc`) for seamless integration.

**Key Features:**
- ✅ Automatic token refresh
- ✅ Code flow with PKCE
- ✅ Server-side rendering compatible
- ✅ Signal-based reactive state management
- ✅ Type-safe JWT handling

---

### Auth Service (`auth.service.ts`)

**Purpose:** Central authentication service managing OAuth state and UI signals.

**Key Responsibilities:**
1. Configure OAuth client for Keycloak
2. Load discovery document & restore login state
3. Manage login/logout flows
4. Expose reactive auth state via Angular Signals

**Primary Signals:**
```typescript
// Is user authenticated (has valid access token)
isLoggedIn: WritableSignal<boolean>

// Current authenticated user
user: WritableSignal<User | null>

// Current username (convenience)
username: WritableSignal<string>

// Is logout in progress
isLoggingOut: WritableSignal<boolean>
```

**Key Methods:**

| Method | Purpose |
|--------|---------|
| `login()` | Initiate Keycloak OAuth code flow |
| `logout()` | Clear auth state & redirect to Keycloak logout |
| `isAuthenticated()` | Check if valid access token exists |
| `getAccessToken()` | Get JWT token for API calls |
| `waitUntilAuthReady()` | Async: Wait for auth initialization (SSR-safe) |

**Configuration (from environment):**
```typescript
// From enviroment.dev.ts
{
  issuer: "https://keycloak.example.com/realms/ideacamp",
  clientId: "ideacamp-web",
  scope: "openid profile email",
  redirectUri: "${ORIGIN}/success"  // Callback URL
}
```

---

### Auth Guard (`auth.guard.ts`)

**Purpose:** Route protection - ensures only authenticated users can access protected pages.

**Implementation:**
```typescript
export const authGuard: CanActivateFn = async () => {
  // 1. Wait for auth bootstrap (loads discovery doc)
  await authService.waitUntilAuthReady();
  
  // 2. Check if user is logging out
  if (authService.isLoggingOut()) {
    return router.createUrlTree(['/impressum']);
  }
  
  // 3. Check if authenticated
  if (authService.isAuthenticated()) {
    return true;  // Allow access
  }
  
  // 4. Not authenticated → start login
  authService.login();
  return false;  // Deny access (user redirected to OAuth)
};
```

**Protected Routes:**
- `/profile` - User profile
- `/search` - Global search
- `/createProject` - Project wizard
- `/my-projects` - Project dashboard
- `/contact-requests` - Invitations
- `/project/:projectUrl` - Project details

**Public Routes:**
- `/impressum` - Legal notice (no guard)
- `/success` - OAuth callback (no guard)
- `/` - Redirects to `/impressum`

---

### Auth Interceptor (`auth.interceptor.ts`)

**Purpose:** Automatically attach JWT token to all API requests.

**Functionality:**
1. Extract access token from auth service
2. Decode JWT to get `sub` claim (user ID)
3. Add headers to requests targeting the API:
   - `Authorization: Bearer {token}`
   - `X-User-Id: {userId}`

**Smart Behavior:**
- Only attaches token to API requests (URL filtering)
- Allows public HTTP requests without modification
- Decodes JWT claims without calling backend

---

### OAuth Callback Component (`success/success.component.ts`)

**Purpose:** Handle OAuth redirect callback from Keycloak.

**Flow:**
1. User returned from Keycloak with auth code
2. `success` component mounts
3. Auth service processes callback (token exchange happens)
4. Redirect to intended destination or dashboard

---

## 🎯 Feature Modules

### Auth Module (`feature/auth/`)
- Complete OAuth2/OIDC integration
- Route protection
- Token management
- SSR-compatible

### User Profile (`feature/user-profile/`)
- View & edit user profiles
- Display user information
- Manage profile data

### Project Site (`feature/project-site/`)
- Display project details
- Show team members
- List open positions
- Display technologies & tags

### Project Create (`feature/project-create/`)
- Multi-step wizard
- Form validation using Zod
- General info, members, settings, review
- Final project submission

### Search (`feature/search/`)
- Search projects by name/description
- Search users by username/email
- Display search results with cards

### My Projects (`feature/my-projects/`)
- Dashboard of user's projects
- Quick project access
- Project management

### Contact Requests (`feature/contact-request/`)
- Display project invitations
- Accept/reject invitations
- Manage team requests

### Legal Notice (`feature/legal-notice/`)
- Impressum page (required in Germany/EU)
- Public, no auth required

---

## 📦 Shared Components & Services

### Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Header** | `shared/header/` | Top navigation, auth panel |
| **Sidebar** | `shared/sidebar/` | Navigation menu |
| **Tag** | `shared/tag/` | Display project/profile tags |
| **Edit Button** | `shared/edit-button/` | Reusable edit action button |
| **Icons** | `shared/icons/` | SVG icon components |

### Shared Services

| Service | Location | Purpose |
|---------|----------|---------|
| **UserProfileService** | `services/user-profile.service.ts` | User profile API calls |
| **SidebarService** | `shared/sidebar/sidebar.service.ts` | Sidebar state management |

### Shared Types

| Type | Location | Purpose |
|------|----------|---------|
| **User** | `shared/types/user.type.ts` | Authenticated user representation |

---

## 🚀 Environment Configuration

**File:** `src/app/enviroments/enviroment.dev.ts`

Contains:
- Keycloak issuer URL
- OAuth client ID
- API base URL
- Scopes

```typescript
export const environment = {
  issuer: 'https://keycloak.example.com/realms/ideacamp',
  clientId: 'ideacamp-web',
  scope: 'openid profile email',
  apiUrl: 'http://localhost:8080/api'
};
```

---

## 🛠️ Technology Stack

**Framework & Libraries:**
- Angular 21 (Standalone components)
- TypeScript 5.9
- Angular Router (Standalone routes)
- RxJS (Reactive programming)
- Angular OAuth2 OIDC (v20)
- Zod (Form validation)

**Styling:**
- Tailwind CSS 4.1
- POSTCSS

**Build Tools:**
- Angular CLI 21
- Vite/esbuild (dev server)
- Server-Side Rendering (Angular SSR)

**Testing:**
- Vitest 4.0
- JSDOM
- Angular Testing Utilities

**Code Quality:**
- ESLint (Angular ESLint)
- Prettier
- TypeScript strict mode

---

## 🔄 Data Flow

### Login Flow

```
1. User clicks "Login" → authService.login()
2. OAuth service initiates code flow → redirect to Keycloak
3. User enters credentials in Keycloak
4. Keycloak redirects to /success?code=...&state=...
5. Auth service exchanges code for token
6. AuthService signals updated (isLoggedIn=true)
7. App redirects to requested route
```

### Protected Route Access

```
1. User navigates to /profile
2. authGuard checks authService.isAuthenticated()
3. If false → authService.login() + block access
4. If true → allow component load
5. Components use authService signals for UI
```

### API Call with Token

```
1. Component calls API via HttpClient
2. AuthInterceptor intercepts request
3. Extracts token from authService
4. Adds Authorization header + X-User-Id
5. Request sent to backend
6. Backend validates JWT
```

---

## 📝 Routing Summary

| Path | Component | Auth | Purpose |
|------|-----------|------|---------|
| `/` | - | ❌ | Redirects to `/impressum` |
| `/impressum` | Impressum | ❌ | Legal notice |
| `/success` | SuccessComponent | ❌ | OAuth callback handler |
| `/profile` | UserProfile | ✅ | User profile page |
| `/search` | SearchPage | ✅ | Global search |
| `/createProject` | ProjectCreate | ✅ | Create new project wizard |
| `/my-projects` | MyProjectsPage | ✅ | User's projects dashboard |
| `/contact-requests` | ContactRequests | ✅ | Project invitations |
| `/project/:projectUrl` | ProjectSite | ✅ | Project details page |

---

## 🧪 Testing

Run tests with:
```bash
npm test
```

Test files use `.spec.ts` extension and are colocated with source files.

---

## 📚 Key Design Patterns

1. **Standalone Components** - Modern Angular pattern (no NgModules)
2. **Functional Routing** - Routes defined as config objects
3. **Angular Signals** - Reactive state management (replaces BehaviorSubject)
4. **Route Guards** - Protect authenticated routes
5. **HTTP Interceptors** - Attach auth tokens automatically
6. **Feature-based Structure** - Organized by business features
7. **SSR-Compatible** - Server-side rendering support

---

## 🔗 Related Documentation

- [Backend API Documentation](./BACKEND_API_DOCUMENTATION.md)
- [Keycloak Integration Guide](./Keycloak%20-%20Integration%20Frontend%20%26%20Backend.md)


