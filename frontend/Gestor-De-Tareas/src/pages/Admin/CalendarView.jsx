import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { LuChevronLeft, LuChevronRight, LuCalendar } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

dayjs.locale('es')

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [tasks, setTasks] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const navigate = useNavigate()

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS)
      setTasks(response.data?.tasks || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const getDaysInMonth = () => {
    const start = currentDate.startOf('month').startOf('week')
    const end = currentDate.endOf('month').endOf('week')
    
    const days = []
    let day = start
    
    while (day.isBefore(end) || day.isSame(end, 'day')) {
      days.push(day)
      day = day.add(1, 'day')
    }
    
    return days
  }

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      return dayjs(task.dueDate).isSame(date, 'day')
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-500'
      case 'Medium': return 'bg-amber-500'
      case 'Low': return 'bg-emerald-500'
      default: return 'bg-slate-400'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'border-emerald-500'
      case 'In Progress': return 'border-sky-500'
      case 'Pending': return 'border-violet-500'
      default: return 'border-slate-400'
    }
  }

  const days = getDaysInMonth()
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const goToPrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'))
  const goToNextMonth = () => setCurrentDate(currentDate.add(1, 'month'))
  const goToToday = () => setCurrentDate(dayjs())

  return (
    <DashboardLayout activeMenu="Calendario">
      <div className="my-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Calendario
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Visualizá tus tareas por fecha de vencimiento
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Hoy
            </button>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <button
                onClick={goToPrevMonth}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-l-lg"
              >
                <LuChevronLeft className="text-lg text-slate-600 dark:text-slate-400" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-slate-800 dark:text-white min-w-[140px] text-center">
                {currentDate.format('MMMM YYYY')}
              </span>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-r-lg"
              >
                <LuChevronRight className="text-lg text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Week days header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="p-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayTasks = getTasksForDate(day)
              const isToday = day.isSame(dayjs(), 'day')
              const isCurrentMonth = day.month() === currentDate.month()
              const isSelected = selectedDate && day.isSame(selectedDate, 'day')

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-[120px] p-2 border-b border-r border-slate-100 dark:border-slate-700
                    ${!isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}
                    ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}
                    hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                        text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                        ${isToday 
                          ? 'bg-primary text-white' 
                          : isCurrentMonth 
                            ? 'text-slate-800 dark:text-white' 
                            : 'text-slate-400 dark:text-slate-600'
                        }
                      `}
                    >
                      {day.date()}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-xs text-slate-400">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/admin/create-task`, { state: { taskId: task._id } })
                        }}
                        className={`
                          text-xs p-1 rounded truncate border-l-2 cursor-pointer hover:opacity-80
                          ${getPriorityColor(task.priority)}
                          ${getStatusColor(task.status)} bg-white/80 dark:bg-slate-900/80
                        `}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-slate-500 text-center">
                        +{dayTasks.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Date Tasks */}
        {selectedDate && (
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Tareas para {selectedDate.format('DD [de] MMMM [de] YYYY')}
            </h3>
            {getTasksForDate(selectedDate).length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No hay tareas para esta fecha
              </p>
            ) : (
              <div className="space-y-3">
                {getTasksForDate(selectedDate).map((task) => (
                  <div
                    key={task._id}
                    onClick={() => navigate(`/admin/create-task`, { state: { taskId: task._id } })}
                    className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-800 dark:text-white">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {task.status} • {task.priority}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                      {task.status === 'Completed' ? 'Completada' : task.status === 'In Progress' ? 'En Progreso' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default CalendarView