import React from 'react';
import { NavLink } from 'react-router-dom';
import { sidebarContent } from '../services/SidebarData';
import useLogout from '../hooks/Auth/useLogout';
import useAuth from '../hooks/Auth/useAuth';
import { LogOut } from 'lucide-react';

const Sidebar = () => {

    const { logout } = useLogout();
    const { currentUser } = useAuth();

    return (
        <div
            className="
                w-65 h-full shrink-0
                px-4 pb-3
                border-r-2 border-(--border-primary)
                flex flex-col justify-between
                bg-(--bg-secondary)
            ">
            <div className="flex flex-col mt-1 gap-1">

                {/* Profile */}
                <div
                    className='
                        flex items-center justify-center
                        border-2 border-transparent
                        hover:bg-cyan-700/20 hover:border-2
                        hover:border-cyan-500
                        rounded-xl p-3
                        gap-4 my-4 tracking-wider 
                        text-sm cursor-pointer
                        transition-all duration-200
                    '>
                    <div
                        className='
                            flex items-center justify-center
                            bg-linear-to-r from-blue-500 to-indigo-500
                            size-12 text-(--text-secondary)
                            rounded-full
                            text-3xl font-semibold
                    '>{currentUser?.user?.name?.charAt(0)?.toUpperCase()}</div>
                    <div className='flex flex-col text-(--text-secondary)'>
                        <p>{currentUser?.user?.name}</p>
                        <p>{currentUser?.user?.designation}</p>
                    </div>
                </div>

                {
                    sidebarContent.map((item, index) => {
                        const { name, icon, path, style } = item;
                        return (
                            <NavLink
                                key={index}
                                to={path}
                                className={({ isActive }) => `
                                  flex items-center gap-4
                                  h-11 px-5
                                  cursor-pointer
                                  rounded-full
                                  transition-all duration-200 mt-2
                                  ${style}
                                  ${isActive ? 'ring-2' : ''}
                                  `}>
                                <span className="text-xl">
                                    {icon}
                                </span>
                                <span className="text-sm font-medium tracking-wider">
                                    {name}
                                </span>
                            </NavLink>
                        )
                    })
                }
            </div>

            {/* settings */}
            <div
                onClick={logout}
                className='
                flex items-center gap-4
                h-11 px-5
                cursor-pointer
                rounded-full
                transition-all duration-200
                border-2 border-transparent bg-red-700/10 hover:border-red-600 text-red-400
            '>
                <LogOut className='text-xl' />
                <p className=' text-sm font-medium tracking-wide'>Logout</p>
            </div>
        </div>
    )
}

export default Sidebar;