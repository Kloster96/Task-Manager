import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut,
    LuUser,
    LuKanban,
    LuCalendar
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Panel de control",
        icon: LuLayoutDashboard,
        path: "/admin/dashboard"
    },
    {
        id: "02",
        label: "Gestion de Tareas",
        icon: LuClipboardCheck,
        path: "/admin/tasks"
    },
    {
        id: "02b",
        label: "Kanban",
        icon: LuKanban,
        path: "/admin/kanban"
    },
    {
        id: "02c",
        label: "Calendario",
        icon: LuCalendar,
        path: "/admin/calendar"
    },
    {
        id: "03",
        label: "Crear Tarea",
        icon: LuSquarePlus,
        path: "/admin/create-task"
    },
    {
        id: "04",
        label: "Miembros del Equipo",
        icon: LuUsers,
        path: "/admin/users"
    },
    {
        id: "05",
        label: "Mi Perfil",
        icon: LuUser,
        path: "/profile"
    },
    {
        id: "06",
        label: "Cerrar sesion",
        icon: LuLogOut,
        path: "logout",
    }
];

export const SIDE_MENU_USER_DATA = [
    {
        id: "01",
        label: "Panel de control",
        icon: LuLayoutDashboard,
        path: "/user/dashboard"
    },
    {
        id: "02",
        label: "Mi Tarea",
        icon: LuClipboardCheck,
        path: "/user/tasks"
    },
    {
        id: "03",
        label: "Mi Perfil",
        icon: LuUser,
        path: "/profile"
    },
    {
        id: "04",
        label: "Cerrar sesion",
        icon: LuLogOut,
        path: "logout",
    }
];

export const PRIORITY_DATA = [
    { label: "Bajo", value: "Low"},
    { label: "Medio", value: "Medium"},
    { label: "Alto", value: "High"},
];

export const STATUS_DATA = [
    { label: "Pendiente", value: "Pending" },
    { label: "En progreso", value: "In Progress" },
    { label: "Completada", value: "Completed" },
];