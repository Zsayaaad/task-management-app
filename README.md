# ProjectFlow - Project & Task Management

A full-stack **project management** application built for teams to organize work into projects, break projects down into assignable tasks, and track progress end-to-end. Supports role-based access control (Admin / Member), project-scoped permissions, search, filtering, sorting, and pagination. Built with Express 5, React 19, PostgreSQL, and Prisma 7.

---

## Features

### Authentication
- User registration with role selection (Admin / Member)
- Login with email and password
- Logout with cookie invalidation
- JWT-based session management via HTTP-only cookies
- Rate limiting on registration and login endpoints (3 requests per IP per 15 minutes)

### Projects
- Create, update, and delete projects
- List projects with **search** (by name), **sorting** (`a-z`, `z-a`, `newest`, `oldest`) and **pagination**
- Project lists include member and task counts
- View project details with members and tasks
- Project names are unique per creator (enforced at the database level)
- Adding the creator as the first member happens atomically in a transaction

### Tasks
- Create, update, and delete tasks within projects
- Assign tasks to project members (validated against membership)
- Filter tasks by status, priority, and search term
- Search matches **task titles or assignee names**, case-insensitively
- Server-side pagination (default 10 per page, max 100)
- Task statuses: TODO, IN_PROGRESS, DONE
- Task priorities: LOW, MEDIUM, HIGH
- Tasks are sorted by most recently updated

### User Management
- View and update user profile (name, email)
- Change password with current password verification
- Delete account with password confirmation

### Admin Features
- Access all projects regardless of membership
- Full task management permissions across all projects
- Can manage members and tasks in any project

### Frontend
- Responsive dashboard with sidebar and mobile bottom navigation
- Project listing with search, sort controls, pagination, and member/task counts
- Task board with search, filter, and pagination
- Member management UI (add by email, remove members)
- Edit/delete modals with confirmation dialogs
- Toast notifications for user feedback
- React Router data loading with loaders and actions
- Client-side caching with TanStack Query (5-minute stale time)

---

## Tech Stack

| Layer            | Technology                                   |
|------------------|----------------------------------------------|
| Backend          | Node.js, Express 5, TypeScript               |
| Frontend         | React 19, Vite, TailwindCSS 4                |
| Database         | PostgreSQL (Neon-compatible)                  |
| ORM              | Prisma 7 with `@prisma/adapter-pg`           |
| Authentication   | JWT (`jsonwebtoken`), bcryptjs                |
| Validation       | Zod 4                                        |
| State Management | TanStack React Query, React Router 7         |
| HTTP Client      | Axios                                        |
| Notifications    | react-toastify                               |
| Security         | Helmet, express-rate-limit, HTTP-only cookies |
| Testing          | Jest (backend)                                |
| Dev Tools        | tsx (watch mode), ESLint, dotenv              |

---

## Architecture

- **Modular backend** -- each domain (auth, users, projects, tasks) has its own routes, controller, service, and schema files.
- **Layered separation** -- controllers handle HTTP, services contain business logic, schemas define validation.
- **REST API** -- versioned under `/api/v1` with consistent JSON responses.
- **JWT via HTTP-only cookies** -- tokens are set server-side, never exposed to client JavaScript.
- **Zod validation middleware** -- validates request body, query params, and route params before reaching controllers.
- **Centralized error handling** -- custom error classes (`NotFoundError`, `UnauthorizedError`, `ConflictError`, etc.) caught by a global error handler middleware.
- **Project access middleware** -- verifies project membership (or admin role) before allowing access to project-scoped resources.
- **Creator authorization middleware** -- restricts destructive/scoped operations to the project creator or an admin.
- **Environment validation** -- Zod schema validates all required environment variables at startup; the app fails fast on misconfiguration.
- **Security headers** -- Helmet middleware applied to every response.
- **Rate limiting** -- shared limiter on register/login (3 requests / 15 min / IP).
- **Vite proxy** -- frontend proxies `/api` requests to the backend in development.
- **Single-container production build** -- the Express server also serves the compiled frontend with an SPA fallback (see [Docker](#docker)).

---

## Project Structure

```
task-management-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database models and enums
│   │   ├── seed.ts                # Seed script with demo data
│   │   └── migrations/            # Prisma migration history
│   ├── src/
│   │   ├── index.ts               # Express app entry point
│   │   ├── modules/
│   │   │   ├── auth/              # Register, login, logout
│   │   │   ├── users/             # Profile, password, account
│   │   │   ├── projects/          # CRUD, search/sort/pagination, members
│   │   │   └── tasks/             # CRUD, filtering, pagination
│   │   ├── middlewares/           # Auth, validation, error handler, project access
│   │   ├── errors/                # Custom error classes
│   │   ├── utils/                 # JWT, hashing, cookies
│   │   ├── lib/                   # Prisma client, env config, roles
│   │   └── types/                 # Express type augmentation
│   ├── jest.config.cjs            # Jest configuration (SWC transform)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Router and query client setup
│   │   ├── pages/                 # Route-level components with loaders/actions
│   │   ├── components/            # Shared UI components
│   │   ├── context/               # React context providers
│   │   └── utils/                 # Axios instance, constants
│   ├── vite.config.js
│   └── package.json
├── postman/
│   └── projectflow.postman_collection.json
└── Dockerfile                     # Multi-stage build (frontend + backend + runner)
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- PostgreSQL database (local or hosted, e.g., Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   cd ../backend
   cp .env.example .env
   # Edit .env with your database URL, JWT secret, etc.
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database**
   ```bash
   npm run seed
   ```

7. **Start the backend**
   ```bash
   npm run dev
   ```

8. **Start the frontend** (in a separate terminal)
   ```bash
   cd ../frontend
   npm run dev
   ```

The app is available at the URL printed by Vite (default `http://localhost:5173`). In development, the Vite dev server proxies `/api` requests to the backend at `http://localhost:3001`.

---

## Environment Variables

| Variable       | Description                              | Required |
|----------------|------------------------------------------|----------|
| PORT           | Backend server port (default: 3001)      | No       |
| NODE_ENV       | Environment: development / production / test | No   |
| DATABASE_URL   | PostgreSQL connection string             | Yes      |
| JWT_SECRET     | Secret key for signing JWT tokens        | Yes      |
| JWT_EXPIRES_IN | Token expiration duration (default: 7d)  | No       |

All variables are validated at startup with a Zod schema -- missing required values cause the server to exit immediately.

---

## Database

- **Database**: PostgreSQL
- **ORM**: Prisma 7 with the `@prisma/adapter-pg` driver adapter
- **Migrate**: `npx prisma migrate dev`
- **Seed**: `npm run seed` (resets all data and creates demo users, projects, and tasks)
- **Generate client**: `npx prisma generate`

### Data Model

- **User** -- name, email (unique), password, role (ADMIN / MEMBER)
- **Project** -- name, description, creator; **unique per creator** (`@@unique([name, creatorId])`)
- **ProjectMember** -- many-to-many link between User and Project (unique constraint on userId + projectId, cascade delete)
- **Task** -- title, description, status (TODO / IN_PROGRESS / DONE), priority (LOW / MEDIUM / HIGH), dueDate, linked to project, creator, and assignee

Deleting a project cascades to its memberships and tasks.

---

## API

All endpoints are prefixed with `/api/v1`.

### Authentication (`/auth`)
| Method | Path       | Description                        | Auth Required |
|--------|------------|------------------------------------|---------------|
| POST   | `/register` | Create an account (rate limited)  | No            |
| POST   | `/login`    | Log in (rate limited)             | No            |
| POST   | `/logout`   | Clear the auth cookie             | No            |

### Users (`/users`)
| Method | Path               | Description                                  | Auth Required |
|--------|--------------------|----------------------------------------------|---------------|
| GET    | `/current-user`     | Get the authenticated user                   | Yes           |
| PATCH  | `/profile`          | Update name/email                            | Yes           |
| PATCH  | `/change-password`  | Change password (requires current password)  | Yes           |
| DELETE | `/account`          | Delete account (requires password)           | Yes           |

### Projects (`/projects`)
| Method | Path                            | Description                                        | Access                    |
|--------|---------------------------------|----------------------------------------------------|---------------------------|
| POST   | `/`                             | Create a project                                   | Any authenticated user    |
| GET    | `/`                             | List projects (`?search&sort&page&limit`)          | Admins see all; members see theirs |
| GET    | `/:projectId`                    | Project details incl. members and tasks            | Members + admins          |
| PATCH  | `/:projectId`                    | Update a project                                    | Creator + admins          |
| DELETE | `/:projectId`                    | Delete a project (cascades tasks/memberships)      | Creator + admins          |
| GET    | `/:projectId/members`            | List project members                                | Members + admins          |
| POST   | `/:projectId/members`            | Add a member by email                               | Creator + admins          |
| DELETE | `/:projectId/members/:userId`    | Remove a member                                     | Creator + admins          |

### Tasks (`/tasks/:projectId`)
| Method | Path                              | Description                                      | Access                       |
|--------|-----------------------------------|--------------------------------------------------|------------------------------|
| POST   | `/:projectId`                      | Create a task                                    | Members + admins             |
| GET    | `/:projectId`                      | List tasks (`?status&priority&search&page&limit`) | Members + admins           |
| GET    | `/:projectId/:taskId`              | Get a single task                                 | Members + admins            |
| PATCH  | `/:projectId/:taskId`              | Update a task                                     | Admin, creator, or assignee |
| DELETE | `/:projectId/:taskId`              | Delete a task                                     | Creator or admins           |

Pagination defaults: tasks return 10 per page, projects 4 per page (both capped at 100). Project listing supports `sort=a-z|z-a|newest|oldest` (default `newest`). Passing `"all"` for `status`/`priority` ignores the filter.

---

## Important Business Rules

- Admins can view all projects; members can only view projects they belong to.
- Only the project **creator or an admin** can update or delete a project.
- Only the project **creator or an admin** can add or remove project members.
- Admins cannot remove themselves from a project.
- Project access is enforced at the middleware level -- non-members receive a 403 error (admins are exempt).
- Project names must be unique **per creator** -- a user cannot create two projects with the same name.
- Tasks can only be assigned to users who are members of the target project.
- Duplicate task titles within the same project are rejected (case-insensitive).
- Only the task creator or an admin can delete a task; assignees cannot.
- Task creators, admins, and assignees can update a task; only creators/admins can reassign it, and the new assignee must be a project member.
- Changing password requires the current password; new password must differ from the current one.
- Deleting an account requires password confirmation and clears the auth cookie.
- Passwords are hashed with bcrypt (cost factor 12) before storage; never returned in API responses.
- Invalid or expired JWT tokens return a 401 Unauthorized response.

---

## Security Highlights

- **Password hashing** -- bcrypt with salt rounds of 12.
- **JWT in HTTP-only cookies** -- `httpOnly`, `secure` (in production), `sameSite: strict`, 7-day expiry; prevents XSS token theft and CSRF.
- **Input validation** -- Zod schemas validate all request bodies and query parameters before reaching business logic.
- **Role-based authorization** -- admin privileges checked throughout services and middleware.
- **Resource-level access control** -- `checkProjectAccess` middleware verifies membership on every project-scoped request.
- **Creator-only mutations** -- project updates/deletes and member management require the `authorizeProjectCreator` middleware.
- **Rate limiting** -- login/register endpoints limited to 3 requests per IP per 15-minute window.
- **Security headers** -- Helmet sets secure HTTP headers on all responses.
- **Environment validation** -- All required env vars validated at startup via Zod; app fails fast on misconfiguration.
- **Centralized error handling** -- Custom error hierarchy with proper HTTP status codes; internal errors do not leak stack traces.
- **Password omission** -- Prisma `omit` ensures passwords are excluded from all user query responses.
- **CORS** -- Enabled via `cors` middleware.

---

## Docker

The included multi-stage `Dockerfile` builds the frontend, compiles the backend, and produces a single image that serves **both the REST API and the built SPA** on one port.

```bash
# Build the image (from the repository root)
docker build -t projectflow .

# Run it, pointing to your database
docker run -p 3001:3001 --env-file backend/.env projectflow
```

- Base image: `node:22-bookworm-slim`
- Runs as the non-root `node` user
- Exposes port **3001**
- On startup, set `NODE_ENV=production` (the image does this automatically) so cookies are issued with the `secure` flag

In production the Express server serves the compiled frontend from `public/` and falls back to `index.html` for any non-API GET request, enabling client-side routing.

---

## Postman Collection

A ready-made collection covering user, project, and task endpoints lives in [`postman/projectflow.postman_collection.json`](postman/projectflow.postman_collection.json).

1. Import it into Postman.
2. Set the `base_url` collection variable (e.g., `http://localhost:3001/api/v1`).
3. Run requests folder by folder -- several include basic status-code tests.

---

## Testing

The backend ships with Jest configured (SWC transform for TypeScript):

```bash
cd backend
npm test            # run tests once
npm run test:watch  # watch mode
npm run test:coverage
```

---

## Sample Accounts

After running the seed command (`npm run seed`), the following accounts are available:

| Role   | Email               | Password    |
|--------|---------------------|-------------|
| Admin  | admin@example.com   | Admin123!   |
| Member | member@example.com  | Member123!  |
| Member | member2@example.com | Member123!  |
| Member | member3@example.com | Member123!  |

The seed creates 5 demo projects with 25 tasks each (125 tasks total), distributed across all users.

---

## Notes

- Modular, production-minded architecture with clear separation between HTTP layer, business logic, and data access.
- Consistent file naming convention: `module.routes.ts`, `module.controller.ts`, `module.service.ts`, `module.schema.ts`.
- Database transactions used for multi-step operations (e.g., creating a project and adding the creator as a member).
- Frontend uses React Router's data APIs (loaders, actions) for data fetching and mutations, combined with TanStack Query for caching and automatic invalidation scoped to affected projects.
- Vite dev server proxies API requests to the backend, eliminating CORS issues in development.
