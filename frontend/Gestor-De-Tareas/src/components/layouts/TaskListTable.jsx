import React from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');


const TaskListTable = ({tableData}) => {
    const getStatusBadgeColor = (status) => {
    switch (status) {
        case "Completed" : return "bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 border border-green-200 dark:border-green-800";
        case "InProgress" : return "bg-yellow-100 dark:bg-yellow-900 text-yellow-500 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
        case "Pending" : return "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800";
        default: return "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600";
        }
    };
    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case "High" : return "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800";
            case "Medium" : return "bg-yellow-100 dark:bg-yellow-900 text-yellow-500 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
            case "Low" : return "bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 border border-green-200 dark:border-green-800";
            default: return "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600";
        }
    };
    return (
        <div className="overflow-x-auto p-0 rounded-lg mt-3">
            <table className="min-w-full">
                <thead>
                    <tr className="text-left">
                        <th className="py-3 px-4 text-gray-400 font-medium text-[13px] dark:text-gray-500">Name</th>
                        <th className="py-3 px-4 text-gray-400 font-medium text-[13px] dark:text-gray-500">Estado</th>
                        <th className="py-3 px-4 text-gray-400 font-medium text-[13px] dark:text-gray-500">Prioridad</th>
                        <th className="py-3 px-4 text-gray-400 font-medium text-[13px] dark:text-gray-500">Creado el</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((task) => (
                        <tr key={task._id} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="my-3 mx-4 text-gray-700 dark:text-gray-300 text-[13px] line-clamp-1 overflow-hidden">{task.title}</td>
                            <td className="py-4 px-4">
                                <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <span className={`px-2 py-1 text-xs rounded inline-block 
                                    ${getPriorityBadgeColor(task.priority)}`}
                                    >
                                        {task.priority}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-gray-700 dark:text-gray-300 text-[13px] text-nowrap hidden md:table-cell">
                                {task.createdAt ? dayjs(task.createdAt).format("dddd D [de] MMMM [de] YYYY") : "N/A"}
                            </td>
                        </tr>   
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TaskListTable