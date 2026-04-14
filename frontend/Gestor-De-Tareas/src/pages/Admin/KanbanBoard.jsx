import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuPlus, LuX, LuGripVertical, LuCalendar, LuUsers } from 'react-icons/lu';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import toast from 'react-hot-toast';

dayjs.locale('es');

const STATUS_COLUMNS = [
  { id: 'Pending', label: 'Pendiente', color: 'bg-violet-500' },
  { id: 'In Progress', label: 'En Progreso', color: 'bg-sky-500' },
  { id: 'Completed', label: 'Completada', color: 'bg-emerald-500' }
];

const PRIORITY_COLORS = {
  High: 'bg-rose-500',
  Medium: 'bg-amber-500', 
  Low: 'bg-emerald-500'
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({})
  const [loading, setLoading] = useState(true)
  const [draggedTask, setDraggedTask] = useState(null)
  const navigate = useNavigate()

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS)
      const allTasks = response.data?.tasks || []
      
      // Organizar por estado
      const grouped = {
        'Pending': allTasks.filter(t => t.status === 'Pending'),
        'In Progress': allTasks.filter(t => t.status === 'In Progress'),
        'Completed': allTasks.filter(t => t.status === 'Completed')
      }
      
      setTasks(grouped)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (task, e) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (status) => {
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTask(null)
      return
    }

    const originalStatus = draggedTask.status
    
    // Optimistic update
    setTasks(prev => {
      const newTasks = { ...prev }
      newTasks[originalStatus] = newTasks[originalStatus].filter(t => t._id !== draggedTask._id)
      newTasks[status] = [...newTasks[status], { ...draggedTask, status }]
      return newTasks
    })

    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_STATUS(draggedTask._id), { status })
      toast.success('Tarea movida correctamente')
    } catch (error) {
      // Revertir si hay error
      setTasks(prev => {
        const newTasks = { ...prev }
        newTasks[status] = newTasks[status].filter(t => t._id !== draggedTask._id)
        newTasks[originalStatus] = [...newTasks[originalStatus], draggedTask]
        return newTasks
      })
      toast.error('Error al mover tarea')
    }
    
    setDraggedTask(null)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <DashboardLayout activeMenu="Kanban">
      <div className="my-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Kanban Board
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Arrastra las tareas entre columnas para cambiar su estado
            </p>
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUS_COLUMNS.map((column) => (
            <div 
              key={column.id}
              className="bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl p-4 min-h-[500px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                    {column.label}
                  </h3>
                  <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {tasks[column.id]?.length || 0}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {loading ? (
                  <div className="skeleton h-24 rounded-xl"></div>
                ) : tasks[column.id]?.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                    No hay tareas
                  </div>
                ) : (
                  tasks[column.id]?.map((task, index) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(task, e)}
                      className={`bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 
                        cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md 
                        transition-all duration-200 hover:border-slate-300/60
                        ${draggedTask?._id === task._id ? 'opacity-50' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <LuGripVertical className="text-slate-300 dark:text-slate-600 cursor-grab" />
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]} text-white`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-slate-800 dark:text-white mb-2 line-clamp-2">
                        {task.title}
                      </h4>
                      
                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-1">
                          <LuCalendar className="text-xs" />
                          {task.dueDate ? dayjs(task.dueDate).format('DD MMM') : 'Sin fecha'}
                        </div>
                        
                        {task.assignedTo?.length > 0 && (
                          <div className="flex -space-x-2">
                            {task.assignedTo.slice(0, 3).map((user, i) => (
                              <img 
                                key={i}
                                src={user.profileImageUrl || 'https://via.placeholder.com/24'}
                                alt={user.name}
                                className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default KanbanBoard