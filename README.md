<div align="center">

# 📋 Gestor de Tareas

**Aplicación full-stack para gestión y seguimiento de tareas con roles, dashboards en tiempo real y reportes exportables.**

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens&logoColor=white)

---

### 🌐 Deploy en Producción

| Servicio | Stack | URL |
|----------|-------|-----|
| **Frontend** | React + Vite | [Ver app →](https://frontend-gestorde-tareas-mrgc9wnos-kloster96s-projects.vercel.app/) |
| **Backend** | Node + Express | [API →](https://backend-gestordetareas.onrender.com) |
| **Base de datos** | MongoDB Atlas | Cloud-hosted |

> ⏱ El backend usa plan gratuito en Render — la primera request puede tardar ~15s (cold start).

</div>

---

## 🎯 Qué resuelve

Equipos que necesitan organizar trabajo colaborativo sin depender de herramientas enterprise caras. Un admin crea y asigna tareas; los miembros las ejecutan, actualizan checklist y adjuntan evidencia. Todo queda trackeado con dashboards y exportable a Excel.

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│  React 19 + Vite + TailwindCSS 4                │
│  React Router v7 · Axios · Recharts             │
│  Context API para estado de autenticación       │
├─────────────────────────────────────────────────┤
│                    REST API                       │
│  Express 5 · JWT · Multer · ExcelJS             │
│  RBAC (admin / member) · Middlewares de auth    │
├─────────────────────────────────────────────────┤
│                   DATABASE                        │
│  MongoDB Atlas · Mongoose ODM                    │
│  Aggregation pipelines para estadísticas        │
└─────────────────────────────────────────────────┘
```

---

## ✨ Features

### Autenticación y Autorización
- 🔐 Registro con avatar y token opcional de admin
- 🛡 JWT con refresh automático via interceptor de Axios
- 👥 Dos roles: **Admin** (CRUD completo) y **Member** (solo sus tareas)

### Gestión de Tareas
- 📝 CRUD con título, descripción, prioridad y fecha límite
- 👤 Asignación múltiple de miembros por tarea
- ✅ Checklist interactivo con progreso auto-calculado
- 📎 Adjuntos (URLs) con previsualización
- 🔄 Transición automática de estado según progreso (Pending → In Progress → Completed)

### Dashboard y Reportes
- 📊 Gráficos de distribución por estado (Pie) y prioridad (Bar) con Recharts
- 📈 Cards de métricas en tiempo real
- 📁 Exportación a Excel (.xlsx) de tareas y usuarios con ExcelJS
- 🔍 Filtrado por estado con tabs

### UI/UX
- 📱 Diseño responsive (mobile-first con menú hamburguesa)
- 🇪🇸 Interfaz en español con fechas localizadas (Day.js)
- 🔔 Toast notifications para feedback inmediato
- 🖼 Avatares agrupados en cards de tarea

---

## 🛠 Stack técnico

| Capa | Tecnología | Detalle |
|------|-----------|---------|
| **Frontend** | React 19 + Vite 6 | SPA con hot reload |
| **Estilos** | TailwindCSS 4 | Utility-first, responsive |
| **Routing** | React Router v7 | Rutas protegidas por rol |
| **HTTP** | Axios | Instancia centralizada con interceptor JWT |
| **Gráficos** | Recharts | Pie + Bar charts customizados |
| **Backend** | Express 5 | REST API |
| **Base de datos** | MongoDB Atlas | Mongoose ODM |
| **Auth** | bcryptjs + JWT | Hash + token-based |
| **Uploads** | Multer | Imágenes en disco |
| **Reportes** | ExcelJS | Streaming de .xlsx |
| **Deploy** | Vercel + Render + Atlas | CI/CD automático |

---

## 📂 Estructura del proyecto

```
├── backend/
│   ├── config/          # Conexión a MongoDB
│   ├── controllers/     # Lógica de negocio (auth, tasks, users, reports)
│   ├── middlewares/     # Auth (protect, adminOnly), upload (multer)
│   ├── models/          # Mongoose schemas (User, Task)
│   ├── routes/          # Rutas REST por dominio
│   ├── uploads/         # Archivos subidos
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
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/register` | — | Registro (con token admin opcional) |
| `POST` | `/login` | — | Login, devuelve JWT |
| `GET` | `/profile` | ✅ | Perfil del usuario actual |
| `PUT` | `/profile` | ✅ | Actualizar perfil |

### Tasks `/api/tasks`
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/dashboard-data` | ✅ Admin | Stats globales + gráficos |
| `GET` | `/user-dashboard-data` | ✅ | Stats personales |
| `GET` | `/` | ✅ | Listar tareas (filtrado por rol) |
| `GET` | `/:id` | ✅ | Detalle de tarea |
| `POST` | `/` | ✅ Admin | Crear tarea |
| `PUT` | `/:id` | ✅ | Actualizar tarea |
| `DELETE` | `/:id` | ✅ Admin | Eliminar tarea |
| `PUT` | `/:id/status` | ✅ | Cambiar estado |
| `PUT` | `/:id/todo` | ✅ | Actualizar checklist |

### Reports `/api/reports`
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/export/tasks` | ✅ Admin | Descargar tareas (.xlsx) |
| `GET` | `/export/users` | ✅ Admin | Descargar usuarios (.xlsx) |

---

## ⚡ Instalación local

```bash
# Clonar repositorio
git clone https://github.com/Kloster96/Proyecto_programacion_3.git
cd Proyecto_programacion_3
```

### Backend
```bash
cd backend
npm install

# Crear archivo .env
cat > .env << EOF
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/gestor-tareas
JWT_SECRET=tu_secreto_jwt
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

> La app corre en `http://localhost:5173` (frontend) y `http://localhost:5000` (backend).

---

## 👨‍💻 Autor

**Luciano Kloster**

[![GitHub](https://img.shields.io/badge/GitHub-Kloster96-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Kloster96)

---

## 📝 Lo que aprendí construyendo esto

- Diseño de una REST API con control de acceso basado en roles (RBAC)
- Manejo de uploads de archivos con Multer y servido estático
- Aggregation pipelines de MongoDB para dashboards en tiempo real
- Interceptores de Axios para auth automática y manejo de errores centralizado
- Deploy full-stack en servicios gratuitos (Vercel + Render + Atlas)
- Generación de reportes en Excel con streaming desde el backend
