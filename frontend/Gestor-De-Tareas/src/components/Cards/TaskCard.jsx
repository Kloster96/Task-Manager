import React from 'react';
import Progress from '../layouts/Progress';
import AvatarGroup from '../layouts/AvatarGroup';
import { LuPaperclip } from 'react-icons/lu';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case 'In Progress':
        return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
      case 'Completed':
        return 'text-lime-500 bg-lime-50 border border-lime-500/20';
      default:
        return 'text-violet-500 bg-violet-50 border border-violet-500/10';
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case 'Low':
        return 'text-emerald-500 bg-emerald-50 border border-emerald-500/10';
      case 'Medium':
        return 'text-amber-500 bg-amber-50 border border-amber-500/10';
      default:
        return 'text-rose-500 bg-rose-50 border border-rose-500/10';
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl py-4 shadow-lg border border-gray-300 dark:border-gray-700 hover:shadow-xl transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div className={`text-[12px] font-medium ${getStatusTagColor()} dark:${getStatusTagColor().replace('bg-', 'dark:bg-').replace('/10', '/20')} px-4 py-1 rounded`}>
          {status}
        </div>
        <div className={`text-[12px] font-medium ${getPriorityTagColor()} dark:${getPriorityTagColor().replace('bg-', 'dark:bg-').replace('/10', '/20')} px-4 py-1 rounded`}>
          {priority} Prioridad
        </div>
      </div>

      <div
        className={`px-4 border-l-[3px] mt-4 ${
          status === 'In Progress'
            ? 'border-cyan-500'
            : status === 'Completed'
            ? 'border-indigo-500'
            : 'border-violet-500'
        }`}
      >
        <p className="text-sm font-medium text-gray-800 dark:text-white mt-2 line-clamp-2">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-[18px]">{description}</p>
        <p className="text-[13px] text-gray-700/80 dark:text-gray-300 font-medium mt-2 mb-2 leading-[18px]">
          Tarea realizada:{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Fecha de inicio</label>
            <p className="text-[13px] font-medium text-gray-900 dark:text-white">
              {dayjs(createdAt).format('dddd D MMMM YYYY')}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Fecha de vencimiento</label>
            <p className="text-[13px] font-medium text-gray-900 dark:text-white">
              {dayjs(dueDate).format('dddd D MMMM YYYY')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />
          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded-lg shrink-0">
              <LuPaperclip className="text-blue-600 dark:text-blue-400 text-lg" />
              <span className="text-xs text-gray-900 dark:text-white">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;