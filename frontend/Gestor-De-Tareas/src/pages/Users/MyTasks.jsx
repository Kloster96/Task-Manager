import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet, LuFilter, LuX } from 'react-icons/lu';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';

const MyTasks = () => {

  const [ allTasks, setAllTasks ] = useState([])
  const [ tabs, setTabs ] = useState([]);
  const [ filterStatus, setFilterStatus ] = useState("All");
  
  // Filtros avanzados
  const [ showFilters, setShowFilters ] = useState(false);
  const [ filters, setFilters ] = useState({
    priority: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
          priority: filters.priority || '',
          dateFrom: filters.dateFrom || '',
          dateTo: filters.dateTo || '',
          search: filters.search || ''
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])

      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        {label: "All", count: statusSummary.all || 0},
        {label: "Pending", count:statusSummary.pendingTasks || 0},
        {label: "In Progress", count:statusSummary.inProgressTasks || 0},
        {label: "Completed", count: statusSummary.completedTasks || 0}
      ];
      setTabs(statusArray);

    } catch(error) {
      console.error("Error en la busqueda de tareas", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priority: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  const hasActiveFilters = () => {
    return filters.priority || filters.dateFrom || filters.dateTo || filters.search;
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`)
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch(error) {
      console.error("error al descargar", error)
      toast.error("Fallo la descarga vuelva a intentar mas tarde.")
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
  }, [filterStatus]);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    getAllTasks();
  }, [filters]);

  return (
    <DashboardLayout activeMenu="Mi Tarea">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-xl font-medium text-gray-900 dark:text-white">Mis Tareas</h2>
            
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters || hasActiveFilters() 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <LuFilter className="text-lg" />
              Filtros
              {hasActiveFilters() && (
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {[filters.priority, filters.dateFrom, filters.dateTo, filters.search].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>
          )}
        </div>

        {/* Filtros avanzados */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Filtros</h3>
              {hasActiveFilters() && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <LuX className="text-sm" />
                  Limpiar filtros
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Buscar por título */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Buscar por título
                </label>
                <input
                  type="text"
                  placeholder="Buscar tarea..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Prioridad */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Prioridad
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todas</option>
                  <option value="Low">Bajo</option>
                  <option value="Medium">Medio</option>
                  <option value="High">Alto</option>
                </select>
              </div>

              {/* Rango de fechas */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Mensaje si no hay resultados */}
      {allTasks.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            {hasActiveFilters() ? 'No se encontraron tareas con los filtros aplicados' : 'No hay tareas disponibles'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {allTasks?.map((item, index) => (
          <TaskCard
            key={item._id}
            title={item.title}
            description={item.description}
            priority={item.priority}
            status={item.status}
            progress={item.progress}
            createdAt={item.createdAt}
            dueDate={item.dueDate}
            assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
            attachmentCount={item.attachmentCount?.length || 0}
            completedTodoCount={item.completedTodoCount || 0}
            todoChecklist={item.todoChecklist || []}
            onClick={() =>{
              handleClick(item._id);
            }}
          />
        ))}
      </div>
    </DashboardLayout>
  )
}

export default MyTasks