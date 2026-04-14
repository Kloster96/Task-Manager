import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { LuTrash2, LuX, LuFileStack } from 'react-icons/lu'
import SelectDropdown from '../../components/Inputs/SelectDropdown'
import SelectUser from '../../components/Inputs/SelectUser'
import TodoListInput from '../../components/Inputs/TodoListInput'
import AddAttchmentsInput from '../../components/Inputs/AddAttchmentsInput'
import Modal from '../../components/layouts/Modal'
import DeleteAlert from '../../components/layouts/DeleteAlert'


const CreateTask = () => {
  const location = useLocation()
  const { taskId, template } = location.state || {}
  const navigate = useNavigate()

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
    tags: []
  })

  const [currentTask, setCurrentTask] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
  const [templates, setTemplates] = useState([])

  // Cargar plantillas
  const fetchTemplates = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TEMPLATES.GET_ALL)
      setTemplates(response.data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  // Aplicar plantilla
  const applyTemplate = (templateId) => {
    const template = templates.find(t => t._id === templateId)
    if (template) {
      setTaskData(prev => ({
        ...prev,
        title: template.name,
        description: template.description || '',
        priority: template.priority || 'Medium',
        todoChecklist: template.todoChecklist?.map(t => t.text) || [],
        tags: template.tags || []
      }))
      toast.success('Plantilla aplicada')
    }
  }

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }))
  }

  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
      tags: []
    })
  }

  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }))
      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Tarea creada con exito");
      clearData();
    } catch (error) {
      console.error("Error al crear tarea", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }

  }

  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist: todolist,
        }
      );
      toast.success("Tarea actualizada correctamente")
      
    } catch (error) {
        console.error("Error al crear la tarea");
        setLoading(false);
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setError(null);

    if(!taskData.title.trim()) {
      setError("Es requerido un titulo");
      return;
    } if (!taskData.description.trim()) {
      setError("Es requerido un descripcion");
      return;
    } if (!taskData.dueDate) {
      setError("Es requerido una fecha");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Ninguna tarea esta asignada a algun miembro");
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError("añade al menos una tarea pendiente");
      return;
    }
    if(taskId) {
      updateTask();
      return;
    }
    createTask();

  }

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );
      if ( response.data ) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);
        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? dayjs(taskInfo.dueDate).format('YYYY-MM-DD')
            : '',
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
          tags: taskInfo?.tags || [],
        }));
      }
    } catch(error) {
      console.error("error a el buscar usuarios:", error)
    }
  };

  const deleteTask = async () => {
    try {
        await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

        setOpenDeleteAlert(false);
        toast.success("Tarea borrada exitosamente")
        navigate("/admin/tasks")
    } catch (error) {
        console.error("Error al borrar la tarea", error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if(taskId){
      getTaskDetailsById(taskId)
    }
    return () => {

    }

  }, [taskId])

  return (
    <DashboardLayout activeMenu="Crear Tarea">
      <div className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
              <div className="col-span-3 form-card">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-xl font-medium text-gray-900 dark:text-white">
                    {taskId ? 'Actualizar tarea' : 'Crear tarea'}
                  </h2>
                  {!taskId && templates.length > 0 && (
                    <div className="flex items-center gap-2">
                      <LuFileStack className="text-slate-400" />
                      <select
                        onChange={(e) => applyTemplate(e.target.value)}
                        className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800"
                        defaultValue=""
                      >
                        <option value="" disabled>Seleccionar plantilla</option>
                        {templates.map(t => (
                          <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {taskId && (
                    <button
                      onClick={() => setOpenDeleteAlert(true)}
                      className="flex items-center gap-2 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                    >
                      <LuTrash2 className="text-base" /> Borrar
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <label className="text-xs font-medium text-slate-600 dark:text-gray-300 dark:text-gray-300">
                    Titulo de la tarea
                  </label>
                  <input
                    placeholder="Crear la interfaz de la aplicacion"
                    type="text"
                    className="form-input"
                    value={taskData.title}
                    onChange={({ target }) =>
                      handleValueChange('title', target.value)
                    }
                  />
                </div>

                <div className="mt-3">
                  <label className="text-xs font-medium text-slate-700 dark:text-gray-300 dark:text-gray-300">
                    Descripcion
                  </label>
                  <textarea
                    placeholder="Descripcion de la tarea"
                    className="form-input"
                    rows={4}
                    value={taskData.description}
                    onChange={({ target }) =>
                      handleValueChange('description', target.value)
                    }
                  ></textarea>
                </div>

                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-600 dark:text-gray-300">
                      Prioridad
                    </label>

                    <SelectDropdown
                      options={PRIORITY_DATA}
                      value={taskData.priority}
                      onChange={(value) => handleValueChange('priority', value)}
                      placeholder="Selecciona la prioridad"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-700 dark:text-gray-300">
                      Fecha limite
                    </label>
                    <input
                      placeholder="Fecha límite"
                      className="form-input"
                      value={taskData.dueDate || ''}
                      onChange={({ target }) =>
                        handleValueChange('dueDate', target.value)
                      }
                      type="date"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center">
                    <label className="text-xs font-medium text-slate-600 dark:text-gray-300 mb-1">
                      Asignar a
                    </label>
                    <SelectUser
                      selectedUsers={taskData.assignedTo}
                      setSelectedUsers={(value) => {
                        handleValueChange('assignedTo', value)
                      }}
                    />
                  </div>

                  <div className="col-span-12 mt-3">
                    <label className="text-xs font-medium text-slate-600 dark:text-gray-300">
                      Lista de control
                    </label>
                    <TodoListInput
                      todoList={taskData?.todoChecklist}
                      setTodoList={(value) => handleValueChange("todoChecklist", value)}
                    />
                  </div>

                    <div className="col-span-12 mt-3">
                      <label className="text-xs font-medium text-slate-600 dark:text-gray-300">
                          Añadir archivo
                      </label>
                      <AddAttchmentsInput
                        attachments={taskData?.attachments}
                        setAttachments={(value) =>
                          handleValueChange("attachments", value)
                        }
                      />
                    </div>

                    {/* Tags */}
                    <div className="col-span-12 mt-3">
                      <label className="text-xs font-medium text-slate-600 dark:text-gray-300">
                        Etiquetas
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {taskData.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                          >
                            {tag}
                            <button
                              onClick={() => {
                                const newTags = taskData.tags.filter((_, i) => i !== index);
                                handleValueChange('tags', newTags);
                              }}
                              className="hover:text-indigo-900"
                            >
                              <LuX className="text-xs" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Agregar etiqueta..."
                          className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              e.preventDefault();
                              const newTag = e.target.value.trim();
                              if (!taskData.tags.includes(newTag)) {
                                handleValueChange('tags', [...taskData.tags, newTag]);
                              }
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                </div>
                    {error && (
                      <p className="text-xs font-medium text-red-500 mt-5">
                        {error}
                      </p>
                    )}
                    <div className="flex justify-center mt-7">
                      <button 
                        className="add-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {taskId ?  "UPDATE TASK" : "CREATE TASK"}
                      </button>
                    </div>
              </div>
            </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Borrar tarea"
      >
        <DeleteAlert
          content="Estas seguro de que quieres borrar la tarea?"
          onDelete={() => deleteTask()}
        />
      </Modal>
     
    </DashboardLayout>
  )
}

export default CreateTask