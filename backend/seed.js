require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Task = require("./models/Task");

// URI de producción de MongoDB Atlas
const MONGO_URI = "mongodb://test:Kloster271296@ac-xe9rw2r-shard-00-00.m9nrgrl.mongodb.net:27017,ac-xe9rw2r-shard-00-01.m9nrgrl.mongodb.net:27017,ac-xe9rw2r-shard-00-02.m9nrgrl.mongodb.net:27017/?ssl=true&replicaSet=atlas-rd0ftz-shard-0&authSource=admin&appName=gestor-de-tareas";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// URLs de avatares funcionando - mujeres y hombres
const femaleAvatars = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=5",
    "https://i.pravatar.cc/150?img=9",
    "https://i.pravatar.cc/150?img=16",
    "https://i.pravatar.cc/150?img=23",
    "https://i.pravatar.cc/150?img=44",
];

const maleAvatars = [
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=8",
    "https://i.pravatar.cc/150?img=12",
    "https://i.pravatar.cc/150?img=15",
    "https://i.pravatar.cc/150?img=53",
    "https://i.pravatar.cc/150?img=60",
];
const users = [
    { name: "Ana García", email: "ana@empresa.com", role: "admin", gender: "female" },
    { name: "Carlos López", email: "carlos@empresa.com", role: "member", gender: "male" },
    { name: "María Rodríguez", email: "maria@empresa.com", role: "member", gender: "female" },
    { name: "Javier Martínez", email: "javier@empresa.com", role: "member", gender: "male" },
    { name: "Laura Sánchez", email: "laura@empresa.com", role: "member", gender: "female" },
    { name: "Daniel Pérez", email: "daniel@empresa.com", role: "member", gender: "male" },
    { name: "Sofía Gómez", email: "sofia@empresa.com", role: "member", gender: "female" },
    { name: "Miguel Torres", email: "miguel@empresa.com", role: "member", gender: "male" },
];

const tasks = [
    { title: "Revisar estados financieros Q1", description: "Analizar y aprobar los estados financieros del primer trimestre", status: "In Progress", priority: "High", daysUntilDue: 3 },
    { title: "Actualizar documentación de API", description: "Documentar los nuevos endpoints del sistema", status: "Pending", priority: "Medium", daysUntilDue: 7 },
    { title: "Reunión con equipo de marketing", description: "Planificar campaña de lanzamiento de producto", status: "Completed", priority: "High", daysUntilDue: -2 },
    { title: "Implementar sistema de notificaciones", description: "Agregar notificaciones en tiempo real para usuarios", status: "Pending", priority: "Medium", daysUntilDue: 14 },
    { title: "Revisar código de seguridad", description: "Auditar el código fuente en busca de vulnerabilidades", status: "In Progress", priority: "High", daysUntilDue: 5 },
    { title: "Optimizar base de datos", description: "Mejorar queries lentas y agregar índices", status: "Pending", priority: "Medium", daysUntilDue: 10 },
    { title: "Preparar presentación para inversores", description: "Crear slides con métricas y proyecciones", status: "Completed", priority: "High", daysUntilDue: -5 },
    { title: "Testing de integración", description: "Ejecutar pruebas de integración entre módulos", status: "In Progress", priority: "Medium", daysUntilDue: 8 },
    { title: "Actualizar dependencias", description: "Actualizar packages y dependencias del proyecto", status: "Pending", priority: "Low", daysUntilDue: 21 },
    { title: "Migrar a nuevo servidor", description: "Configurar y desplegar en infraestructura nueva", status: "Pending", priority: "High", daysUntilDue: 30 },
];

const seedDatabase = async () => {
    await connectDB();
    
    try {
        // Limpiar base de datos
        await User.deleteMany({});
        await Task.deleteMany({});
        console.log('✓ Base de datos limpiada');

        // Crear usuarios
        const salt = await bcrypt.genSalt(10);
        const defaultPassword = await bcrypt.hash("password123", salt);
        const adminToken = process.env.ADMIN_INVITE_TOKEN || "admin123";

        const createdUsers = [];
        let femaleCount = 0;
        let maleCount = 0;

        for (const user of users) {
            // Obtener avatar según género
            const profileImageUrl = user.gender === "female" 
                ? femaleAvatars[femaleCount++ % femaleAvatars.length]
                : maleAvatars[maleCount++ % maleAvatars.length];
            
            const created = await User.create({
                name: user.name,
                email: user.email,
                password: defaultPassword,
                profileImageUrl,
                role: user.role === "admin" ? "admin" : "member",
                adminInviteToken: user.role === "admin" ? adminToken : undefined
            });
            createdUsers.push(created);
            console.log(`✓ Usuario creado: ${user.name} (${user.role})`);
        }

        // Crear tareas asignadas a miembros
        const members = createdUsers.filter(u => u.role === "member");
        
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            // Asignar a 1-3 miembros aleatorios
            const assignedCount = Math.floor(Math.random() * 3) + 1;
            const shuffled = members.sort(() => 0.5 - Math.random());
            const assignedTo = shuffled.slice(0, assignedCount).map(u => u._id);
            
            // Calcular fecha de vencimiento basada en días
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + task.daysUntilDue);
            
            await Task.create({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate,
                assignedTo,
                createdBy: createdUsers[0]._id // admin
            });
            console.log(`✓ Tarea creada: ${task.title}`);
        }

        console.log('\n========================================');
        console.log('SEED COMPLETADO EXITOSAMENTE');
        console.log('========================================');
        console.log('\nCredenciales de acceso:');
        console.log('  Admin: ana@empresa.com / password123');
        console.log('  Miembros: nombre@empresa.com / password123');
        
    } catch (error) {
        console.error('Error durante el seed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Conexión cerrada');
        process.exit(0);
    }
};

seedDatabase();