# PRD: TaskFlow — Task Management & Project Tracker
**Stack:** Java 17 · Spring Boot · MySQL · React.js · JWT · Role-Based Access (Admin / User)
**Deploy:** Render (backend) · Vercel (frontend)
**Build window:** 4 hours

---
### Note: "Add a data.sql file that inserts one default admin user with email admin@taskflow.com and BCrypt hashed password Admin@123"

## 1. Project Overview

TaskFlow is an internal project and task management tool. Admins manage projects and assign tasks to team members. Users view and update their assigned tasks. Role-based JWT authentication controls all access.

---

## 2. Roles & Access

| Feature | Admin | User |
|---|---|---|
| Login / Logout | ✓ | ✓ |
| View own profile | ✓ | ✓ |
| Create / Edit / Delete Projects | ✓ | ✗ |
| View all Projects | ✓ | ✗ |
| Create / Assign Tasks | ✓ | ✗ |
| View assigned Tasks | ✓ | ✓ |
| Update Task status | ✓ | ✓ (own tasks only) |
| View all Users | ✓ | ✗ |
| Admin Dashboard (stats) | ✓ | ✗ |
| User Dashboard (my tasks) | ✗ | ✓ |

---

## 3. Database Schema (MySQL)

### users
```
id          BIGINT AUTO_INCREMENT PRIMARY KEY
name        VARCHAR(100) NOT NULL
email       VARCHAR(150) UNIQUE NOT NULL
password    VARCHAR(255) NOT NULL  -- BCrypt hashed
role        VARCHAR(20) NOT NULL   -- ADMIN | USER
created_at  TIMESTAMP DEFAULT NOW()
```

### projects
```
id           BIGINT AUTO_INCREMENT PRIMARY KEY
name         VARCHAR(150) NOT NULL
description  TEXT
status       VARCHAR(30) DEFAULT 'ACTIVE'   -- ACTIVE | COMPLETED | ON_HOLD
created_by   BIGINT REFERENCES users(id)
created_at   TIMESTAMP DEFAULT NOW()
```

### tasks
```
id           BIGINT AUTO_INCREMENT PRIMARY KEY
title        VARCHAR(200) NOT NULL
description  TEXT
status       VARCHAR(30) DEFAULT 'TODO'     -- TODO | IN_PROGRESS | DONE
priority     VARCHAR(20) DEFAULT 'MEDIUM'   -- LOW | MEDIUM | HIGH
project_id   BIGINT REFERENCES projects(id)
assigned_to  BIGINT REFERENCES users(id)
created_by   BIGINT REFERENCES users(id)
due_date     DATE
created_at   TIMESTAMP DEFAULT NOW()
```

---

## 4. Backend API Endpoints (Spring Boot)

### Auth
```
POST  /api/auth/login       -- returns JWT token + role
POST  /api/auth/register    -- admin only or open (your call)
```

### Users (Admin only)
```
GET   /api/users            -- list all users
GET   /api/users/{id}       -- get user by id
```

### Projects (Admin only)
```
GET   /api/projects         -- list all projects
POST  /api/projects         -- create project
PUT   /api/projects/{id}    -- update project
DELETE /api/projects/{id}   -- delete project
```

### Tasks
```
GET   /api/tasks            -- admin: all tasks | user: own tasks
GET   /api/tasks/{id}       -- get task detail
POST  /api/tasks            -- admin: create + assign task
PUT   /api/tasks/{id}       -- admin: full update | user: status only
DELETE /api/tasks/{id}      -- admin only
GET   /api/tasks/project/{projectId}  -- tasks by project (admin)
```

### Dashboard
```
GET   /api/dashboard/admin  -- total projects, tasks by status, user count
GET   /api/dashboard/user   -- my tasks count by status
```

---

## 5. Spring Boot Structure

```
src/main/java/com/taskflow/
├── config/
│   ├── SecurityConfig.java       -- JWT filter chain, role-based access
│   └── JwtUtil.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── ProjectController.java
│   ├── TaskController.java
│   └── DashboardController.java
├── model/
│   ├── User.java
│   ├── Project.java
│   └── Task.java
├── repository/
│   ├── UserRepository.java
│   ├── ProjectRepository.java
│   └── TaskRepository.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── ProjectService.java
│   └── TaskService.java
├── dto/
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   ├── TaskRequest.java
│   └── DashboardResponse.java
└── exception/
    └── GlobalExceptionHandler.java
```

---

## 6. React Frontend Structure

```
src/
├── api/
│   └── axios.js              -- axios instance with JWT interceptor
├── context/
│   └── AuthContext.jsx        -- stores token + role in state
├── pages/
│   ├── Login.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── Tasks.jsx
│   │   └── Users.jsx
│   └── user/
│       ├── UserDashboard.jsx
│       └── MyTasks.jsx
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── TaskCard.jsx
│   ├── ProjectCard.jsx
│   └── PrivateRoute.jsx       -- redirects if not authenticated
└── App.jsx                    -- routes with role-based protection
```

---

## 7. Frontend Pages & Features

### Login Page
- Email + password form
- On success: store JWT + role in context/localStorage
- Redirect: ADMIN → /admin/dashboard | USER → /user/dashboard

### Admin Dashboard
- Stats cards: Total Projects · Total Tasks · Users · Tasks by status
- Recent tasks table (last 10)
- Quick links to Projects and Tasks pages

### Projects Page (Admin)
- List of all projects with status badge
- Create project modal (name, description, status)
- Edit / Delete inline

### Tasks Page (Admin)
- Table: title, project, assigned user, priority, status, due date
- Create task modal: title, description, project, assign to user, priority, due date
- Filter by project / status / priority
- Edit / Delete

### Users Page (Admin)
- List of all registered users with role badge

### User Dashboard
- Stats cards: Total Assigned · TODO · In Progress · Done
- Task list filtered to logged-in user

### My Tasks Page (User)
- Task cards with status, priority, due date
- Status update dropdown (TODO → IN_PROGRESS → DONE)

---

## 8. UI Design & Theme

### Design Direction
**"Dark enterprise utility"** — clean, serious, professional. Looks like a real internal tool, not a tutorial project. No gradients everywhere, no playful rounded bubbles. Sharp but not harsh.

### Color Palette
```
Background:     #0F1117   (near-black, slightly blue-tinted)
Surface:        #1A1D27   (cards, sidebar, modals)
Border:         #2A2D3E   (subtle dividers)
Primary accent: #4F6EF7   (blue — buttons, active states, links)
Success:        #22C55E   (DONE status, active badge)
Warning:        #F59E0B   (IN_PROGRESS, MEDIUM priority)
Danger:         #EF4444   (HIGH priority, delete actions)
Text primary:   #F1F5F9   (headings, labels)
Text muted:     #8B92A5   (secondary text, placeholders)
```

### Typography
```
Display / Headings:  'DM Sans' (Google Fonts) — weight 600/700
Body / Labels:       'Inter' — weight 400/500
Monospace (IDs):     'JetBrains Mono' — for task IDs, timestamps
```

### Component Style Rules
- Cards: `background: #1A1D27`, `border: 1px solid #2A2D3E`, `border-radius: 10px`, subtle box-shadow
- Buttons: Primary = solid `#4F6EF7`, no rounded-full — use `border-radius: 6px`
- Sidebar: fixed left, `#1A1D27` background, active item highlighted with left border accent `#4F6EF7`
- Status badges: pill shape, color-coded — TODO (grey), IN_PROGRESS (amber), DONE (green)
- Priority badges: LOW (grey), MEDIUM (amber), HIGH (red)
- Tables: no zebra stripes — use hover row highlight `#2A2D3E`
- Modals: centered overlay, `#1A1D27` background, close on backdrop click
- Form inputs: `background: #0F1117`, `border: 1px solid #2A2D3E`, focus border `#4F6EF7`

### Login Page Design
- Full dark screen `#0F1117`
- Center card `#1A1D27` — 420px wide, clean padding
- App name "TaskFlow" in DM Sans bold at top of card with a small `#4F6EF7` dot or icon
- Subtle tagline: "Project & Task Management" in muted text
- No illustrations, no stock images, no gradient backgrounds
- Just the card, the form, clean spacing

---

## 9. Build Order (4 Hours)

### Hour 1 — Backend foundation
1. Spring Boot project (Spring Web, Security, JPA, MySQL, JWT dependency)
2. User entity + repository + BCrypt password encoding
3. JWT utility class + security config
4. Auth controller (login endpoint returning token + role)

### Hour 2 — Backend APIs
1. Project entity + CRUD APIs (admin secured)
2. Task entity + CRUD APIs (role-based)
3. Dashboard endpoints (counts by status)
4. Test all endpoints in Postman

### Hour 3 — Frontend
1. Vite + React setup, install Axios + React Router + Tailwind
2. AuthContext + axios interceptor (attach JWT header)
3. Login page
4. Admin Dashboard + sidebar layout
5. Projects page + Tasks page (basic list + create modal)
6. User Dashboard + My Tasks page

### Hour 4 — Connect + Deploy
1. Wire all API calls, test role-based routing
2. Fix any CORS issues (`@CrossOrigin` or Spring Security config)
3. Deploy backend to Render (free tier, MySQL addon)
4. Deploy frontend to Vercel (set VITE_API_URL env var)
5. Smoke test deployed URLs

---

## 10. Environment Variables

### Backend (Render)
```
DB_URL=jdbc:mysql://<render-db-host>/taskflow?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=...
DB_PASSWORD=...
JWT_SECRET=your-256-bit-secret
JWT_EXPIRATION=86400000
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 11. application.properties (Spring Boot)
```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/taskflow?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
server.port=8080
```

---

I don't want you to agree with me just to be polite or supportive. Drop the filter, be brutally honest, straightforward, and logical. Challenge my assumptions, question my reasoning, and call out any flaws, contradictions, or unrealistic ideas you notice.
Don't soften the truth or sugarcoat anything to protect my feelings. I care more about growth and accuracy than comfort. Avoid empty praise, generic motivation, or vague advice. I want hard facts, clear reasoning, and actionable feedback.
Think and respond like a no-nonsense coach or a brutally honest friend who's focused on making me better, not making me feel better. Push back whenever necessary, and never feed me bullshit. Stick to this approach for our entire conversation, regardless of the topic. Accept my orders if i asked for my requirements to be fulfilled.

Ditch the filter. Be brutal, logical, and honest. Challenge my flaws; no sugarcoating. Logic over ego.