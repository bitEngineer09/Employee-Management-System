import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/Auth/useAuth';
import { LogOut } from 'lucide-react';
import { sidebarAdminContent, sideBarUserContent } from '../data/SidebarData';
import Remove from './Popups/Remove';
import useLogout from '../hooks/Auth/useLogout';

const Sidebar = () => {
    const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
    const { currentUser } = useAuth();
    const ROLE = currentUser?.user?.role;
    const { logout, isLoading } = useLogout();

    return (
        <div
            className="
                w-65 h-full shrink-0
                px-4 pb-3
                relative
                flex flex-col justify-between
                bg-(--bg-secondary)
            ">
            {/* Border on Right */}
            {/* <div className="absolute top-0 right-0 w-0.5 h-full bg-linear-to-b from-purple-500 via-linear-500 via-cyan-500 to-pink-500"></div> */}
            {/* <div className="absolute top-0 right-0 w-0.5 h-full bg-stone-900"></div> */}

            <div className="flex flex-col mt-1 gap-1">

                {/* Profile */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `
                        flex items-center justify-center
                        border-2
                        rounded-xl p-3
                        gap-4 my-4 tracking-wider 
                        text-sm cursor-pointer
                        transition-all duration-200
                        ${isActive
                            ? "bg-cyan-700/20 border-cyan-500"
                            : "border-transparent hover:bg-cyan-700/20 hover:border-cyan-500"
                        }
                    `}>
                    <div
                        className='
                            flex items-center justify-center
                            bg-linear-to-r from-blue-500 to-cyan-500
                            size-12 text-(--text-secondary)
                            rounded-full
                            text-3xl font-semibold
                    '>{currentUser?.user?.name?.charAt(0)?.toUpperCase()}</div>
                    <div className='flex flex-col text-(--text-secondary)'>
                        <p>{currentUser?.user?.name}</p>
                        <p>{currentUser?.user?.designation}</p>
                    </div>
                </NavLink>

                {
                    (ROLE === "ADMIN" ? sidebarAdminContent : sideBarUserContent).map((item, index) => {
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
                onClick={() => setLogoutPopupOpen(!logoutPopupOpen)}
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

            {/* logout popup */}
            {
                logoutPopupOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Remove
                            state={logoutPopupOpen}
                            setState={setLogoutPopupOpen}
                            method={logout}
                            isLoading={isLoading}
                            icon={<LogOut />}
                            header={"Logout"}
                            subHeader={"Are you sure you want to logout ?"}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default Sidebar;