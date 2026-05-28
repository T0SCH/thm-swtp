# IdeaCamp Frontend

An Angular 21-based single-page application (SPA) for collaborative project management with Keycloak OAuth2 authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ with npm 11+
- Running Keycloak server (for authentication)
- Backend API running (http://localhost:8080/api)

### Installation

```bash
cd web/ideacamp
npm install
```

### Development Server

```bash
npm start
# Application runs at http://localhost:4200
```

### Build for Production

```bash
npm run build
```

### Server-Side Rendering (SSR)

```bash
npm run build
npm run serve:ssr:ideacamp
```

---

## 📋 Project Overview

**IdeaCamp** is a collaborative platform where developers can:
- 👤 Create and manage user profiles
- 📦 Create and showcase projects
- 🔍 Search for projects and developers
- 👥 Invite team members to projects
- 💬 Receive project invitations/collaboration requests
- 🏷️ Tag projects and profiles with technologies

### Key Features

✅ **Authentication**
- OAuth2/OIDC via Keycloak
- Automatic token refresh
- Secure token storage and handling

✅ **Project Management**
- Create projects with details (name, description, tech stack)
- View project listings and details
- Manage team members
- Track open positions

✅ **User Profiles**
- Public user profiles with portfolio information
- Profile tags/skills
- Project history

✅ **Discovery**
- Full-text search for projects and users
- Advanced filtering

✅ **Collaboration**
- Send project invitations
- Accept/reject collaboration requests
- Team member management

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Angular 21 (Standalone) |
| **Language** | TypeScript 5.9 |
| **State Management** | Angular Signals |
| **Styling** | Tailwind CSS 4.1 |
| **Auth** | Keycloak OAuth2 OIDC |
| **Validation** | Zod |
| **HTTP Client** | Angular HttpClient |
| **Routing** | Angular Router (Standalone) |

### Project Structure

```
src/
├── app/
│   ├── feature/              # Feature modules (auth, projects, search, etc.)
│   ├── shared/               # Reusable components & services
│   ├── models/               # Shared data models
│   ├── services/             # Global services
│   ├── core/                 # Core module (singletons)
│   └── app.routes.ts         # Route configuration
└── index.html
```

**See [FRONTEND_STRUCTURE_AND_AUTH.md](./FRONTEND_STRUCTURE_AND_AUTH.md) for detailed folder structure.**

---

## 🔐 Authentication Flow

### OAuth2 Code Flow with PKCE

```
User → App → Keycloak → Browser → App → API
                ↑                    ↓
          Login with credentials  JWT Token
```

1. **User initiates login** → `AuthService.login()`
2. **Redirected to Keycloak** → Enter credentials
3. **Keycloak redirects back** → `/success?code=...`
4. **Token exchange** → Code for JWT token
5. **Access granted** → Protected routes accessible

### Auth Components

| Component | Purpose |
|-----------|---------|
| **AuthService** | Manages OAuth state, tokens, signals |
| **AuthGuard** | Route protection (requires login) |
| **AuthInterceptor** | Automatically attach JWT to API requests |
| **SuccessComponent** | Handle OAuth callback |

**See [FRONTEND_STRUCTURE_AND_AUTH.md](./FRONTEND_STRUCTURE_AND_AUTH.md#-authentication-architecture) for detailed auth architecture.**

---

## 📁 Key Folders

### `/feature`
Feature modules organized by business domain:
- **auth** - Authentication & authorization
- **user-profile** - User profile management
- **project-site** - Project details & display
- **project-create** - Create new projects
- **search** - Global search functionality
- **my-projects** - User's project dashboard
- **contact-request** - Collaboration requests
- **legal-notice** - Legal pages

### `/shared`
Reusable components and utilities:
- Components: `header`, `sidebar`, `tag`, `edit-button`
- Services: `user-profile.service`, `sidebar.service`
- Types: `user.type.ts`
- Icons: SVG icon components

### `/models`
TypeScript interfaces for data structures:
- `project.model.ts`
- `user-profile.model.ts`

### `/services`
Global services:
- `user-profile.service.ts` - User profile API access

### `/enviroments`
Environment-specific configuration:
- `enviroment.dev.ts` - Dev settings (Keycloak URL, API endpoint)

---

## 🛤️ Routing Map

| Route | Component | Protected | Purpose |
|-------|-----------|-----------|---------|
| `/` | - | - | Redirects to `/impressum` |
| `/impressum` | Impressum | ❌ | Legal notice (public) |
| `/success` | SuccessComponent | ❌ | OAuth callback |
| `/profile` | UserProfile | ✅ | View/edit user profile |
| `/search` | SearchPage | ✅ | Search projects & users |
| `/createProject` | ProjectCreate | ✅ | Multi-step project wizard |
| `/my-projects` | MyProjectsPage | ✅ | Dashboard of user's projects |
| `/contact-requests` | ContactRequests | ✅ | Manage invitations |
| `/project/:projectUrl` | ProjectSite | ✅ | View project details |

---

## 🔧 Configuration

### Environment Settings

File: `src/app/enviroments/enviroment.dev.ts`

```typescript
export const environment = {
  issuer: 'https://keycloak.example.com/realms/ideacamp',
  clientId: 'ideacamp-web',
  scope: 'openid profile email',
  apiUrl: 'http://localhost:8080/api'
};
```

Update these values for your environment:
- `issuer` - Keycloak realm URL
- `clientId` - OAuth client ID
- `apiUrl` - Backend API URL

---

## 📚 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Build with SSR
npm run build

# Serve SSR application
npm run serve:ssr:ideacamp

# Run linter
npm run lint
```

---

## 🧪 Testing

Tests use **Vitest** and **JSDOM**:

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage
```

Test files are colocated with source files (`.spec.ts`).

---

## 📦 Dependencies

### Core Dependencies
- `@angular/core` - Angular framework
- `@angular/router` - Client-side routing
- `@angular/forms` - Form handling
- `angular-oauth2-oidc` - OAuth2/OIDC client
- `rxjs` - Reactive programming
- `zod` - TypeScript-first schema validation

### Styling
- `tailwindcss` - Utility-first CSS framework
- `postcss` - CSS processing

### Dev Dependencies
- `@angular/cli` - CLI for development
- `typescript` - TypeScript compiler
- `vitest` - Unit test framework
- `eslint` - Code linting
- `prettier` - Code formatting

See `package.json` for full dependency list.

---

## 🔗 API Integration

### Base URL
```
http://localhost:8080/api  (development)
```

### Authentication
All API requests (except public endpoints) include:
- `Authorization: Bearer {jwt_token}`
- `X-User-Id: {user_id}` (extracted from JWT)

Handled automatically by `AuthInterceptor`.

### Available Endpoints

See [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md) for complete API routes.

Key endpoints:
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project
- `GET /api/users/{username}/profile` - Get user
- `GET /api/search/projects` - Search projects
- `GET /api/search/users` - Search users

---

## 🎯 Common Tasks

### Add a New Page

1. Create feature component in `src/app/feature/{feature}/pages/`
2. Add route to `src/app/app.routes.ts`
3. Import component in routes

```typescript
// app.routes.ts
{
  path: 'new-page',
  component: NewPageComponent,
  canActivate: [authGuard]  // if protected
}
```

### Add Shared Component

1. Create component in `src/app/shared/{component}/`
2. Export from component file
3. Import in feature components

```typescript
import { MySharedComponent } from '@app/shared/my-shared-component/my-shared-component';
```

### Protect a Route

```typescript
{
  path: 'protected',
  component: ProtectedComponent,
  canActivate: [authGuard]  // ← Add this
}
```

### Call Backend API

```typescript
import { inject } from '@angular/core';
import { UserProfileService } from '@app/services/user-profile.service';

export class MyComponent {
  private userService = inject(UserProfileService);

  loadProfile() {
    this.userService.getProfile(username).subscribe(profile => {
      // Handle profile data
    });
  }
}
```

### Check Authentication Status

```typescript
import { inject } from '@angular/core';
import { AuthService } from '@app/feature/auth/auth.service';

export class MyComponent {
  private auth = inject(AuthService);

  isLoggedIn = this.auth.isLoggedIn;  // Signal
  currentUser = this.auth.user;        // Signal

  login() {
    this.auth.login();
  }
}
```

---

## 🐛 Troubleshooting

### OAuth Redirect Loop

**Problem:** Stuck in login redirect loop

**Solution:**
- Verify Keycloak `redirectUri` matches app URL in `environment.ts`
- Check Keycloak client configuration (valid redirect URIs)
- Clear browser cookies & cache

### API Requests Failing

**Problem:** 401/403 errors on API calls

**Solution:**
- Verify backend is running (`http://localhost:8080/api`)
- Check JWT token is valid (use `AuthService.getAccessToken()`)
- Verify CORS settings on backend

### Keycloak Connection Issues

**Problem:** Can't connect to Keycloak

**Solution:**
- Verify Keycloak is running
- Check `issuer` URL in `environment.ts`
- Verify network connectivity
- Check browser console for CORS errors

---

## 📖 Documentation

For more detailed information, see:
- [Frontend Structure & Auth Guide](./FRONTEND_STRUCTURE_AND_AUTH.md) - Detailed folder structure and authentication architecture
- [Backend API Documentation](./BACKEND_API_DOCUMENTATION.md) - Complete API endpoint reference
- [Keycloak Integration](./Keycloak%20-%20Integration%20Frontend%20%26%20Backend.md) - Keycloak setup guide

---

## 🤝 Contributing

1. Follow existing code structure
2. Use TypeScript strict mode
3. Add tests for new features
4. Run `npm run lint` before committing
5. Use Prettier for code formatting

---

## 📄 License

See [LICENSE](../../LICENSE) file for details.

---

## 📞 Support

For issues or questions:
1. Check documentation in `/docs`
2. Review existing issues on GitHub
3. Contact the development team

---

## 🔄 Development Workflow

1. **Local Development**
   ```bash
   npm start              # Starts dev server
   npm test -- --watch    # Watch and run tests
   ```

2. **Before Committing**
   ```bash
   npm run lint           # Check code quality
   npm test               # Run all tests
   npm run build          # Verify production build
   ```

3. **Production Deployment**
   ```bash
   npm run build
   npm run serve:ssr:ideacamp
   ```

---

## ✨ Features Roadmap

- [ ] User profile avatar uploads
- [ ] Real-time collaboration notifications
- [ ] Advanced project filtering
- [ ] Team activity feed
- [ ] Project milestones & tasks
- [ ] Social features (followers, likes)


