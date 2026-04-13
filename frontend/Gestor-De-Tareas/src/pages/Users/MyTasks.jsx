import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';

const MyTasks = () => {

  const [ allTasks, setAllTasks ] = useState([])

  const [ tabs, setTabs ] = useState([]);
  const [ filterStatus, setFilterStatus ] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS,{
        params: {
          status: filterStatus === "All" ? "" : filterStatus
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])

      const statusSummary = response.data?.statusSummary || {

      };

      const statusArray = [
        {label: "All", count: statusSummary.all || 0},
        {label: "Pending", count:statusSummary.pendingTasks || 0},
        {label: "In Progress", count:statusSummary.inProgressTasks || 0},
        {label: "Completed", count: statusSummary.completedTasks || 0}
      ];
      setTabs(statusArray);

    } catch(error) {
      console.error("Error en la busqueda de usuarios", error);
    }
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
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Mi Tarea">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium text-gray-900 dark:text-white">Mis Tareas</h2>
          {tabs?.[0]?.count > 0 && (
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
          )}
        </div>
      </div>

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