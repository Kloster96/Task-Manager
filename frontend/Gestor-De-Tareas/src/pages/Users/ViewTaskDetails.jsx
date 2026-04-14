import React, { useEffect, useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import AvatarGroup from '../../components/layouts/AvatarGroup';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LuSquareArrowOutUpRight, LuPlus, LuTrash2, LuMessageCircle, LuSend } from "react-icons/lu";
import { UserContext } from '../../context/userContext';
import toast from 'react-hot-toast';

dayjs.locale('es');
dayjs.extend(relativeTime);

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [newTodoItem, setNewTodoItem] = useState('');
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { user } = useContext(UserContext);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-sky-500 bg-sky-50 border border-sky-500/10";
      case "Completed":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/20";
      case "Pending":
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
      default:
        return "text-gray-500 bg-gray-100 border border-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return "Pendiente";
      case "In Progress":
        return "En progreso";
      case "Completed":
        return "Completada";
      default:
        return status;
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error al buscar la tarea", error);
    }
  };

  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...task?.todoChecklist];
    const taskId = id;
    
    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
    }
    
    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
        { todoChecklist }
      );
      if (response.status === 200) {
        setTask(response.data?.task || task);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const addTodoItem = async () => {
    if (!newTodoItem.trim()) return;
    
    const todoChecklist = [
      ...(task?.todoChecklist || []),
      { text: newTodoItem.trim(), completed: false }
    ];
    
    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist }
      );
      if (response.status === 200) {
        setTask(response.data?.task || task);
        setNewTodoItem('');
        setShowAddTodo(false);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodoItem = async (index) => {
    const todoChecklist = task?.todoChecklist.filter((_, i) => i !== index);
    
    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist }
      );
      if (response.status === 200) {
        setTask(response.data?.task || task);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await axiosInstance.post(
        API_PATHS.TASKS.ADD_COMMENT(id),
        { text: newComment }
      );
      if (response.status === 201) {
        setTask(response.data?.task || task);
        setNewComment('');
        toast.success('Comentario agregado');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error('Error al agregar comentario');
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_COMMENT(id, commentId));
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      setTask(response.data);
      toast.success('Comentario eliminado');
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLinkClick = (link) => {
    if(!/^https?:\/\//i.test(link)){
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
  }, [id]);

  const completedTodos = task?.todoChecklist?.filter(t => t.completed).length || 0;
  const totalTodos = task?.todoChecklist?.length || 0;
  const progress = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <DashboardLayout activeMemu="Mis Tareas">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">
                  {task?.title}
                </h2>
                <div className={`text-[10px] md:text-[12px] font-medium ${getStatusTagColor(task?.status)} px-4 py-1 rounded`}>
                  {getStatusLabel(task?.status)}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Descripción" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Prioridad" value={task?.priority} />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Fecha de Vencimiento"
                    value={
                      task.dueDate
                        ? dayjs(task.dueDate).format("dddd D [de] MMMM [de] YYYY")
                        : "N/A"
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Asignado a
                  </label>
                  <AvatarGroup
                    avatars={task?.assignedTo?.map((item) => item?.profileImageUrl) || []}
                    maxVisible={5}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                    Lista de Tareas
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {completedTodos}/{totalTodos} ({progress}%)
                    </span>
                    <button
                      onClick={() => setShowAddTodo(!showAddTodo)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-primary"
                    >
                      <LuPlus className="text-lg" />
                    </button>
                  </div>
                </div>
                
                {totalTodos > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3 dark:bg-gray-700">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}

                {showAddTodo && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTodoItem}
                      onChange={(e) => setNewTodoItem(e.target.value)}
                      placeholder="Nueva subtarea..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      onKeyDown={(e) => e.key === 'Enter' && addTodoItem()}
                    />
                    <button
                      onClick={addTodoItem}
                      className="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark"
                    >
                      Agregar
                    </button>
                    <button
                      onClick={() => { setShowAddTodo(false); setNewTodoItem(''); }}
                      className="px-3 py-2 text-gray-500 text-sm hover:text-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  {task?.todoChecklist?.map((item, index) => (
                    <TodoCheckList 
                      key={`todo_${index}`}
                      text={item.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoChecklist(index)}
                      onDelete={() => deleteTodoItem(index)}
                    />
                  ))}
                  {totalTodos === 0 && (
                    <p className="text-sm text-gray-400 italic">No hay subtareas. Agregá una!</p>
                  )}
                </div>
              </div>

              {/* Attachments */}
              {task?.attachments?.length > 0 && (
                <div className="mt-6">
                  <label className="text-xs font-medium text-slate-500">
                    Archivos Adjuntos
                  </label>
                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}

              {/* Comments */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary"
                >
                  <LuMessageCircle className="text-lg" />
                  Comentarios ({task?.comments?.length || 0})
                </button>

                {showComments && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-3">
                      <img
                        src={user?.profileImageUrl || 'https://via.placeholder.com/32'}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Escribir un comentario..."
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                          onKeyDown={(e) => e.key === 'Enter' && addComment()}
                        />
                        <button
                          onClick={addComment}
                          className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                          <LuSend className="text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {task?.comments?.map((comment, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <img
                            src={comment.user?.profileImageUrl || 'https://via.placeholder.com/32'}
                            alt={comment.user?.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-800 dark:text-white">
                                {comment.user?.name || 'Usuario'}
                              </span>
                              <span className="text-xs text-slate-400">
                                {dayjs(comment.createdAt).fromNow()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              {comment.text}
                            </p>
                          </div>
                          {(comment.user?._id === user?._id || user?.role === 'admin') && (
                            <button
                              onClick={() => deleteComment(comment._id)}
                              className="p-1 text-slate-400 hover:text-red-500"
                            >
                              <LuTrash2 className="text-sm" />
                            </button>
                          )}
                        </div>
                      ))}
                      {(!task?.comments || task.comments.length === 0) && (
                        <p className="text-sm text-slate-400 text-center py-4">
                          No hay comentarios aún
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => (
  <>
    <label className="text-xs font-medium text-slate-500 dark:text-gray-400">{label}</label>
    <p className="text-[12px] md:text-[12px] font-medium text-gray-700 mt-1 dark:text-gray-300">{value || 'N/A'}</p>
  </>
);

const TodoCheckList = ({ isChecked, onChange, onDelete, text }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
    <input 
      type="checkbox"
      className="w-5 h-5 text-primary bg-white border-2 border-gray-300 rounded-md outline-none cursor-pointer accent-primary" 
      checked={isChecked}
      onChange={onChange}
    />
    <p className={`flex-1 text-sm ${isChecked ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
      {text}
    </p>
    <button 
      onClick={onDelete}
      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-600 transition-opacity"
      title="Eliminar"
    >
      <LuTrash2 className="text-base" />
    </button>
  </div>
);

const Attachment = ({ link, index, onClick }) => (
  <div 
    className="flex justify-between bg-gray-50 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 px-3 py-2 rounded-md mb-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 font-semibold">
        {index < 9 ? `0${index + 1}` : index + 1}
      </span>
      <p className="text-xs text-black dark:text-white break-all">
        {link}
      </p>
    </div>
    <LuSquareArrowOutUpRight className="text-gray-400" />
  </div>
);