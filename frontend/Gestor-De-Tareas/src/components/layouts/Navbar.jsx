import React, { useState, useContext } from 'react'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { LuSun, LuMoon } from 'react-icons/lu';
import { ThemeContext } from '../../context/themeContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const [openSideMenu, setOpenSidemenu] = useState(false);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200 backdrop-blur-[2px] py-4
    px-7 sticky top-0 z-30 dark:bg-gray-900 dark:border-gray-700">
        <button 
        className="block lg:hidden text-black dark:text-white"
        onClick={() => {
            setOpenSidemenu(!setOpenSidemenu);
        }}
        >
            {setOpenSidemenu ? (
                <HiOutlineX className="text-2xl" />
            ) : (
                <HiOutlineMenuAlt3 className="text-2xl" />
            )}
        </button>
        <h2 className="text-lg font-medium text-black dark:text-white">Control de Tareas</h2>
        
        <div className="flex items-center gap-2 ml-auto">
            <NotificationBell />
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
                {isDarkMode ? (
                    <LuSun className="text-xl text-yellow-500" />
                ) : (
                    <LuMoon className="text-xl text-gray-600" />
                )}
            </button>
        </div>
    </div>
  )
}

export default Navbar