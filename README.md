<div align="center">

# 📋 Task Manager

**Full-stack task management and tracking application with role-based access, real-time dashboards, and exportable reports.**

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens&logoColor=white)

---

### 🌐 Live Deployment

| Service | Stack | URL |
|---------|-------|-----|
| **Frontend** | React + Vite | [View app →](https://frontend-gestorde-tareas-mrgc9wnos-kloster96s-projects.vercel.app/) |
| **Backend** | Node + Express | [API →](https://backend-gestordetareas.onrender.com) |
| **Database** | MongoDB Atlas | Cloud-hosted |

> ⏱ Backend uses Render's free tier — first request may take ~15s (cold start).

</div>

---

## 🎯 Problem Statement

Teams that need to organize collaborative work without relying on expensive enterprise tools. An admin creates and assigns tasks; members execute them, update checklists, and attach evidence. Everything is tracked with dashboards and exportable to Excel.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│  React 19 + Vite + TailwindCSS 4                │
│  React Router v7 · Axios · Recharts             │
│  Context API for auth state management          │
├─────────────────────────────────────────────────┤
│                    REST API                       │
│  Express 5 · JWT · Multer · ExcelJS             │
│  RBAC (admin / member) · Auth middlewares       │
├─────────────────────────────────────────────────┤
│                   DATABASE                        │
│  MongoDB Atlas · Mongoose ODM                    │
│  Aggregation pipelines for analytics            │
└─────────────────────────────────────────────────┘
```

---

## ✨ Features

### Authentication & Authorization
- 🔐 Registration with avatar and optional admin token
- 🛡 JWT with automatic refresh via Axios interceptor
- 👥 Two roles: **Admin** (full CRUD) and **Member** (assigned tasks only)

### Task Management
- 📝 CRUD with title, description, priority, and due date
- 👤 Multi-member assignment per task
- ✅ Interactive checklist with auto-calculated progress
- 📎 URL-based attachments with preview
- 🔄 Automatic status transitions based on progress (Pending → In Progress → Completed)

### Dashboard & Reports
- 📊 Distribution charts by status (Pie) and priority (Bar) using Recharts
- 📈 Real-time metric cards
- 📁 Excel (.xlsx) export for tasks and users via ExcelJS
- 🔍 Status-based filtering with tabs

### UI/UX
- 📱 Responsive design (mobile-first with hamburger menu)
- 🇪🇸 Spanish-localized interface with Day.js date formatting
- 🔔 Toast notifications for immediate feedback
- 🖼 Grouped avatars on task cards

---

## 🛠 Tech Stack

| Layer | Technology | Detail |
|-------|-----------|--------|
| **Frontend** | React 19 + Vite 6 | SPA with hot reload |
| **Styling** | TailwindCSS 4 | Utility-first, responsive |
| **Routing** | React Router v7 | Role-protected routes |
| **HTTP** | Axios | Centralized instance with JWT interceptor |
| **Charts** | Recharts | Custom Pie + Bar charts |
| **Backend** | Express 5 | REST API |
| **Database** | MongoDB Atlas | Mongoose ODM |
| **Auth** | bcryptjs + JWT | Hash + token-based |
| **Uploads** | Multer | Disk-stored images |
| **Reports** | ExcelJS | Streaming .xlsx generation |
| **Deploy** | Vercel + Render + Atlas | Automatic CI/CD |

---

## 📂 Project Structure

```
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Business logic (auth, tasks, users, reports)
│   ├── middlewares/     # Auth (protect, adminOnly), upload (multer)
│   ├── models/          # Mongoose schemas (User, Task)
│   ├── routes/          # REST routes by domain
│   ├── uploads/         # Uploaded files
│   └── server.js        # Entry point
│
├── frontend/
│   └── Gestor-De-Tareas/
│       └── src/
│           ├── components/  # Cards, Inputs, Layouts, Charts
│           ├── context/     # UserContext (React Context API)
│           ├── hook/        # useUserAuth
│           ├── pages/       # Admin, Users, Auth
│           ├── routes/      # PrivateRoute
│           └── utils/       # API paths, axios instance, helpers
│
└── README.md
```

---

## 🔌 API Endpoints

### Auth `/api/auth`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/register` | — | Register (with optional admin token) |
| `POST` | `/login` | — | Login, returns JWT |
| `GET` | `/profile` | ✅ | Current user profile |
| `PUT` | `/profile` | ✅ | Update profile |

### Tasks `/api/tasks`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/dashboard-data` | ✅ Admin | Global stats + charts |
| `GET` | `/user-dashboard-data` | ✅ | Personal stats |
| `GET` | `/` | ✅ | List tasks (filtered by role) |
| `GET` | `/:id` | ✅ | Task detail |
| `POST` | `/` | ✅ Admin | Create task |
| `PUT` | `/:id` | ✅ | Update task |
| `DELETE` | `/:id` | ✅ Admin | Delete task |
| `PUT` | `/:id/status` | ✅ | Change status |
| `PUT` | `/:id/todo` | ✅ | Update checklist |

### Reports `/api/reports`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/export/tasks` | ✅ Admin | Download tasks (.xlsx) |
| `GET` | `/export/users` | ✅ Admin | Download users (.xlsx) |

---

## ⚡ Local Setup

```bash
# Clone repository
git clone https://github.com/Kloster96/Proyecto_programacion_3.git
cd Proyecto_programacion_3
```

### Backend
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/gestor-tareas
JWT_SECRET=your_jwt_secret
PORT=5000
ADMIN_INVITE_TOKEN=4588944
CLIENT_URL=http://localhost:5173
EOF

npm run dev
```

### Frontend
```bash
cd frontend/Gestor-De-Tareas
npm install
npm run dev
```

> App runs at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

---

## 👨‍💻 Author

**Luciano Kloster**

[![GitHub](https://img.shields.io/badge/GitHub-Kloster96-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Kloster96)

---

## 📝 What I Learned

- Designing a REST API with role-based access control (RBAC)
- File upload handling with Multer and static serving
- MongoDB aggregation pipelines for real-time dashboards
- Axios interceptors for automatic auth and centralized error handling
- Full-stack deployment on free-tier services (Vercel + Render + Atlas)
- Excel report generation with backend streaming
