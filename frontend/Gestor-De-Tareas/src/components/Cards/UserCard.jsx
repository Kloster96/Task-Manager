import React from 'react'

const UserCard = ({userInfo}) => {
  return (
    <div className="user-card p-2 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img 
                    src={userInfo?.profileImageUrl} 
                    alt={`Avatar`} 
                    className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-600"
                />

                <div>
                    <p className="text-sm font-medium dark:text-white">{userInfo?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{userInfo?.email}</p>
                </div>
            </div>
        </div>
        <div className="flex items-end gap-3 mt-5">
            <StatCard
                label="Pendiente"
                count={userInfo?.pendingTasks || 0}
                status="Pending"
            />
              <StatCard
                label="En proceso"
                count={userInfo?.pendingTasks || 0}
                status="In Progress"
            />
              <StatCard
                label="Completado"
                count={userInfo?.pendingTasks || 0}
                status="Completed"
            />
        </div>
    </div>
  )
}

export default UserCard

const StatCard = ({label, count, status}) => {

    const getStatusTagColor = () => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-gray-50 dark:bg-gray-700"
            
            case "Completed":
                return "text-violet-500 bg-gray-50 dark:bg-gray-700"

            default:
                return "text-violet-500 bg-gray-50 dark:bg-gray-700"
        }
    };

    return (
        <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-1 rounded`}>
            <span className="text-[12px] font-semibold dark:text-white">
                {count} <br /> {label}
            </span>
        </div>
    )
}