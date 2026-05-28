# API Backend - Dokumentation

## 📁 Projektstruktur

```
api/
├── src/
│   ├── main/java/de/thm/swtp/api/
│   │   ├── ApiApplication.java
│   │   ├── config/                    # Security & Keycloak Konfiguration
│   │   ├── controller/                # REST Controller (HelloController)
│   │   ├── exceptionhandling/         # Globale Exception Handler
│   │   ├── tool/                      # Utility Classes
│   │   ├── project/                   # Project Management Module
│   │   ├── userprofile/               # User Profile Management Module
│   │   ├── tag/                       # Tags Module (Project & Profile Tags)
│   │   ├── projectInvitation/         # Project Invitations Module
│   │   └── search/                    # Search Functionality Module
│   ├── test/java/de/thm/swtp/api/
│   └── resources/
│       └── application.yaml
├── pom.xml
├── Dockerfile
└── db/
    └── dev.db (SQLite)
```

---

## 🔌 REST API Endpoints

### 1. Authentication & Hello
**Base Path:** `/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/public/hello` | ❌ | Public hello endpoint |
| `GET` | `/api/hello` | ✅ | Secured hello - returns user info & roles |

---

### 2. Projects
**Base Path:** `/api/projects`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/projects` | ✅ | Create new project |
| `GET` | `/api/projects/{projectId}` | ✅ | Get project by ID |
| `GET` | `/api/projects/by-url/{projectUrl}` | ✅ | Get project by URL |
| `PUT` | `/api/projects/{projectId}` | ✅ | Update project (owner only) |
| `DELETE` | `/api/projects/{projectId}` | ✅ | Delete project (owner only) |

**DTOs:**
- `CreateProjectRequest` (POST body)
- `UpdateProjectRequest` (PUT body)
- `ProjectResponse` (Response)
- `DeleteProjectResponse` (DELETE response)

---

### 3. User Profiles
**Base Path:** `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/users/me` | ✅ | Sync current user profile from Keycloak |
| `GET` | `/api/users/{username}/profile` | ❌ | Get user profile by username |
| `GET` | `/api/users/{username}/projects` | ✅ | Get all projects of a user (owner only) |
| `PUT` | `/api/users/{username}/profile` | ✅ | Update own profile (owner only) |
| `DELETE` | `/api/users/{username}/profile` | ✅ | Delete own profile (owner only) |

**DTOs:**
- `UserProfileRequest` - Fields: `title`, `location`, `about`, `experience`
- `UserProfileResponse` (Response)

---

### 4. Project Tags
**Base Path:** `/api/v1/projects/{projectId}/tags`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/projects/{projectId}/tags` | ✅ | Get all tags of a project |
| `POST` | `/api/v1/projects/{projectId}/tags` | ✅ | Add tag to project (owner only) |
| `DELETE` | `/api/v1/projects/{projectId}/tags/{tagName}` | ✅ | Remove tag from project (owner only) |

**DTOs:**
- `CreateTagRequest` - Field: `name`
- `TagResponse` (Response)

---

### 5. Profile Tags
**Base Path:** `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/users/{userId}/profile/tags` | ❌ | Get all tags of user profile |
| `POST` | `/api/v1/users/me/profile/tags` | ✅ | Add tag to current user's profile |
| `DELETE` | `/api/v1/users/me/profile/tags/{tagName}` | ✅ | Remove tag from current user's profile |

**DTOs:**
- `CreateTagRequest` - Field: `name`
- `TagResponse` (Response)

---

### 6. Project Invitations
**Base Path:** `/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/projects/{projectId}/invitations` | ✅ | Create project invitation (owner only) |
| `GET` | `/api/v1/users/me/invitations` | ✅ | Get current user's invitations |
| `PUT` | `/api/v1/invitations/{invitationId}` | ✅ | Accept/Reject invitation |

**DTOs:**
- `CreateProjectInviteRequest` - Fields: `invitedUserId`, `message`
- `UpdateProjectInviteStatusRequest` - Field: `status`
- `ProjectInviteResponse` (Response)

---

### 7. Search
**Base Path:** `/api/search`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/search/projects` | ❌ | Search projects - Query: `q` |
| `GET` | `/api/search/users` | ❌ | Search users - Query: `q` |

**Response:**
- `ProjectSearchResult[]` (Projects)
- `UserSearchResult[]` (Users)

---

## 🔐 Security & Authentication

- **Framework:** Spring Security + OAuth2 Resource Server
- **Auth Provider:** Keycloak (JWT Bearer Tokens)
- **Configuration:**
  - `SecurityConfig.java` - Security rules
  - `KeycloakJwtConverter.java` - JWT token conversion

All endpoints marked with ✅ require JWT authentication in the `Authorization` header.

---

## 📦 Technology Stack

**Backend:**
- Spring Boot 4.0.6
- Java 25
- Spring Data JPA (Hibernate)
- SQLite / MariaDB
- OAuth2 Resource Server
- Lombok (Code generation)

**Build & Quality:**
- Maven
- Checkstyle (Code style validation)

---

## 🛠️ Error Handling

Global exception handling via `GlobalExceptionHandler.java` returns standardized `ErrorResponse` objects.

**Custom Exceptions:**
- Project: `ProjectNotFoundException`, `ExceptionProjectNameAlreadyExists`, `ExceptionProjectEditNotAllowed`, `ExceptionProjectDeleteNotAllowed`
- User Profile: `UserProfileNotFoundException`, `ProfileAccessDeniedException`
- Tags: `TagAccessDeniedException`
- Invitations: `ProjectInviteNotFoundException`, `ProjectInviteAccessDeniedException`, `InvalidProjectInviteException`

---

## 📚 Module Overview

| Module | Purpose | Key Classes |
|--------|---------|------------|
| **project** | Project CRUD & Management | `ProjectController`, `ProjectService`, `ProjectRepository` |
| **userprofile** | User Profile Management | `UserProfileController`, `UserProfileService` |
| **tag** | Tags for Projects & Profiles | `ProjectTagController`, `ProfileTagController` |
| **projectInvitation** | Project Member Invitations | `ProjectInviteController`, `ProjectInviteService` |
| **search** | Full-text Search | `SearchController`, `ProjectSearchService`, `UserSearchService` |
| **config** | Security & OAuth2 Setup | `SecurityConfig`, `KeycloakJwtConverter` |
| **exceptionhandling** | Global Error Handling | `GlobalExceptionHandler` |





