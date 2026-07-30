# TaskFlow - Task Management Application

A full-stack task management application built for teams to organize projects, assign tasks, and track progress. Supports role-based access control with Admin and Member roles. Built with Express, React, PostgreSQL, and Prisma.

---

## Features

### Authentication
- User registration with role selection (Admin / Member)
- Login with email and password
- Logout with cookie invalidation
- JWT-based session management via HTTP-only cookies

### Projects
- Create, update, and delete projects
- List all projects (admins see all; members see only their own)
- View project details with members and tasks

### Tasks
- Create, update, and delete tasks within projects
- Assign tasks to project members
- Filter tasks by status, priority, and assignee name
- Server-side pagination for task lists
- Task statuses: TODO, IN_PROGRESS, DONE
- Task priorities: LOW, MEDIUM, HIGH

### User Management
- View and update user profile (name, email)
- Change password with current password verification
- Delete account with password confirmation

### Admin Features
- Add members to projects by email
- Remove members from projects
- Access all projects regardless of membership
- Full task management permissions across all projects

### Frontend
- Responsive dashboard with sidebar and mobile bottom navigation
- Project listing with member/task counts
- Task board with search, filter, and pagination
- Edit/delete modals with confirmation dialogs
- Toast notifications for user feedback
- React Router data loading with loaders and actions

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
| Dev Tools        | tsx (watch mode), ESLint, dotenv              |

---

## Architecture

- **Modular backend** -- each domain (auth, users, projects, tasks) has its own routes, controller, service, and schema files.
- **Layered separation** -- controllers handle HTTP, services contain business logic, schemas define validation.
- **REST API** -- versioned under `/api/v1` with consistent JSON responses.
- **JWT via HTTP-only cookies** -- tokens are set server-side, never exposed to client JavaScript.
- **Zod validation middleware** -- validates request body, query params, and route params before reaching controllers.
- **Centralized error handling** -- custom error classes (`NotFoundError`, `UnauthorizedError`, etc.) caught by a global error handler middleware.
- **Project access middleware** -- verifies project membership (or admin role) before allowing access to project-scoped resources.
- **Environment validation** -- Zod schema validates all required environment variables at startup.
- **Vite proxy** -- frontend proxies `/api` requests to the backend in development.

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
│   │   │   ├── projects/          # CRUD, members
│   │   │   └── tasks/             # CRUD, filtering, pagination
│   │   ├── middlewares/           # Auth, validation, error handler, project access
│   │   ├── errors/                # Custom error classes
│   │   ├── utils/                 # JWT, hashing, cookies
│   │   ├── lib/                   # Prisma client, env config, roles
│   │   └── types/                 # Express type augmentation
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
└── .gitignore
```

---

## Prerequisites

- Node.js (v18+)
- npm
- PostgreSQL database (local or hosted, e.g., Neon)

---

## Installation

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

---

## Environment Variables

| Variable       | Description                          | Required |
|----------------|--------------------------------------|----------|
| PORT           | Backend server port (default: 3001)  | No       |
| NODE_ENV       | Environment: development / production / test | No |
| DATABASE_URL   | PostgreSQL connection string         | Yes      |
| JWT_SECRET     | Secret key for signing JWT tokens    | Yes      |
| JWT_EXPIRES_IN | Token expiration duration (default: 7d) | No    |

---

## Database

- **Database**: PostgreSQL
- **ORM**: Prisma 7 with the `@prisma/adapter-pg` driver adapter
- **Migrate**: `npx prisma migrate dev`
- **Seed**: `npm run seed` (resets all data and creates demo users, projects, and tasks)
- **Generate client**: `npx prisma generate`

### Data Model

- **User** -- name, email, password, role (ADMIN / MEMBER)
- **Project** -- name, description
- **ProjectMember** -- many-to-many link between User and Project (unique constraint on userId + projectId)
- **Task** -- title, description, status, priority, dueDate, linked to project, creator, and assignee

---

## API

All endpoints are prefixed with `/api/v1`.

| Group          | Base Path              | Auth Required |
|----------------|------------------------|---------------|
| Authentication | `/auth`                | No            |
| Users          | `/users`               | Yes           |
| Projects       | `/projects`            | Yes           |
| Tasks          | `/tasks/:projectId`    | Yes           |

Project and task endpoints enforce project membership via the `checkProjectAccess` middleware. Member management endpoints additionally require Admin role.

---

## Important Business Rules

- Admins can view all projects; members can only view projects they belong to.
- Only admins can add or remove project members.
- Admins cannot remove themselves from a project.
- Project access is enforced at the middleware level -- non-members receive a 403 error (admins are exempt).
- Tasks can only be assigned to users who are members of the target project.
- Duplicate task titles within the same project are rejected (case-insensitive).
- Duplicate project names are rejected globally.
- Duplicate user emails are rejected at registration.
- Only the task creator or an admin can delete a task; assignees cannot.
- Assignees can only update the task status field -- all other field updates are rejected.
- Task creators and admins can update any task field, but reassignment is validated against project membership.
- Changing password requires the current password; new password must differ from the current one.
- Deleting an account requires password confirmation and clears the auth cookie.
- Passwords are hashed with bcrypt (cost factor 12) before storage; never returned in API responses.
- Invalid or expired JWT tokens return a 401 Unauthorized response.

---

## Security Highlights

- **Password hashing** -- bcrypt with salt rounds of 12.
- **JWT in HTTP-only cookies** -- `httpOnly`, `secure` (in production), `sameSite: strict`; prevents XSS token theft and CSRF.
- **Input validation** -- Zod schemas validate all request bodies and query parameters before reaching business logic.
- **Role-based authorization** -- Admin-only routes protected by `requireAdmin` middleware.
- **Resource-level access control** -- `checkProjectAccess` middleware verifies membership on every project-scoped request.
- **Environment validation** -- All required env vars validated at startup via Zod; app fails fast on misconfiguration.
- **Centralized error handling** -- Custom error hierarchy with proper HTTP status codes; internal errors do not leak stack traces.
- **Password omission** -- Prisma `omit` ensures passwords are excluded from all user query responses.
- **CORS** -- Enabled via `cors` middleware.

---

## Sample Accounts

After running the seed command (`npm run seed`), the following accounts are available:

| Role   | Email               | Password    |
|--------|---------------------|-------------|
| Admin  | admin@example.com   | Admin123!   |
| Member | member@example.com  | Member123!  |
| Member | member2@example.com | Member123!  |
| Member | member3@example.com | Member123!  |

The seed also creates 5 projects with 25 tasks each, distributed across all users.

---

## Notes

- Modular, production-minded architecture with clear separation between HTTP layer, business logic, and data access.
- Consistent file naming convention: `module.routes.ts`, `module.controller.ts`, `module.service.ts`, `module.schema.ts`.
- Database transactions used for multi-step operations (e.g., creating a project and adding the creator as a member).
- Frontend uses React Router's data APIs (loaders, actions) for data fetching and mutations, combined with TanStack Query for caching.
- Vite dev server proxies API requests to the backend, eliminating CORS issues in development.
