const PDFDocument = require('pdfkit');
const Task = require('../models/Task');
const User = require('../models/User');

const exportTasksToPDF = async (req, res) => {
    try {
        const { status, priority, dateFrom, dateTo } = req.query;
        
        let filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (dateFrom || dateTo) {
            filter.dueDate = {};
            if (dateFrom) filter.dueDate.$gte = new Date(dateFrom);
            if (dateTo) filter.dueDate.$lte = new Date(dateTo);
        }

        const tasks = await Task.find(filter)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        // Crear PDF
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=tareas.pdf');

        doc.pipe(res);

        // Título
        doc.fontSize(24).font('Helvetica-Bold').text('Reporte de Tareas', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).font('Helvetica').text(`Fecha de generación: ${new Date().toLocaleDateString('es-AR')}`, { align: 'center' });
        doc.moveDown(2);

        // Resumen
        doc.fontSize(14).font('Helvetica-Bold').text('Resumen');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Total de tareas: ${tasks.length}`);
        doc.text(`Pendientes: ${tasks.filter(t => t.status === 'Pending').length}`);
        doc.text(`En progreso: ${tasks.filter(t => t.status === 'In Progress').length}`);
        doc.text(`Completadas: ${tasks.filter(t => t.status === 'Completed').length}`);
        doc.moveDown(2);

        // Tabla de tareas
        doc.fontSize(14).font('Helvetica-Bold').text('Detalle de Tareas');
        doc.moveDown();

        let y = doc.y;
        
        // Encabezados
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Título', 50, y, { width: 120 });
        doc.text('Estado', 170, y, { width: 70 });
        doc.text('Prioridad', 240, y, { width: 60 });
        doc.text('Asignado', 300, y, { width: 100 });
        doc.text('Vencimiento', 400, y, { width: 80 });

        doc.moveDown();
        y = doc.y;
        
        // Línea separadora
        doc.moveTo(50, y).lineTo(550, y).stroke('#cccccc');
        doc.moveDown();

        // Datos
        doc.font('Helvetica').fontSize(8);
        
        tasks.forEach((task, index) => {
            y = doc.y;
            
            // Alternar colores
            if (index % 2 === 0) {
                doc.rect(50, y - 3, 500, 15).fill('#f9f9f9');
            }
            
            doc.fillColor('#000000');
            
            // Título (truncar si es muy largo)
            const title = task.title.length > 40 ? task.title.substring(0, 37) + '...' : task.title;
            doc.text(title, 50, y, { width: 120 });
            
            // Estado con color
            const estadoColor = task.status === 'Completed' ? '#22c55e' : 
                              task.status === 'In Progress' ? '#eab308' : '#8b5cf6';
            doc.fillColor(estadoColor).text(task.status, 170, y, { width: 70 });
            
            // Prioridad
            const prioridadColor = task.priority === 'High' ? '#ef4444' : 
                                 task.priority === 'Medium' ? '#f97316' : '#3b82f6';
            doc.fillColor(prioridadColor).text(task.priority, 240, y, { width: 60 });
            
            // Asignado
            doc.fillColor('#000000');
            const assignedNames = task.assignedTo.map(u => u.name).join(', ') || 'Sin asignar';
            const assignedText = assignedNames.length > 20 ? assignedNames.substring(0, 17) + '...' : assignedNames;
            doc.text(assignedText, 300, y, { width: 100 });
            
            // Vencimiento
            const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-AR') : 'N/A';
            doc.text(dueDate, 400, y, { width: 80 });
            
            doc.moveDown();
            
            // Nueva página si es necesario
            if (y > 700) {
                doc.addPage();
            }
        });

        // Pie de página
        doc.fontSize(8).fillColor('#888888');
        doc.text('Generado por Task Manager', 50, doc.page.height - 50, { align: 'center' });

        doc.end();

    } catch (error) {
        console.error('Error exporting PDF:', error);
        res.status(500).json({ message: 'Error exporting PDF', error: error.message });
    }
};

module.exports = { exportTasksToPDF };