import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/Auth/useAuth';
import { LogOut } from 'lucide-react';
import { sidebarAdminContent, sideBarUserContent } from '../data/SidebarData';
import Remove from './Popups/Remove';
import useLogout from '../hooks/Auth/useLogout';
import { motion as Motion } from "motion/react";
import AnimateModal from '../components/Animation/AnimateModal';

const Sidebar = () => {
    const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
    const { currentUser } = useAuth();
    const ROLE = currentUser?.user?.role;
    const { logout, isLoading } = useLogout();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -25 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };


    return (
        <div
            className="
                w-65 h-full shrink-0
                px-4 pb-3
                relative
                flex flex-col justify-between
                bg-sidebar-gradient
            ">

            <Motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col mt-1 gap-1">

                {/* Profile */}
                <Motion.div variants={itemVariants}>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `
                        flex items-center justify-center
                        border-2
                        rounded-xl p-3
                        gap-4 mt-2 tracking-wider 
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
                            text-3xl font-semibold shrink-0
                    '>{currentUser?.user?.name?.charAt(0)?.toUpperCase()}</div>
                        <div className='flex flex-col text-(--text-secondary)'>
                            <p className='text-(--text-primary)'>{currentUser?.user?.name}</p>
                            <p className='text-xs text-(--text-tertiary)'>{currentUser?.user?.designation}</p>
                        </div>
                    </NavLink>
                </Motion.div>

                {
                    (ROLE === "ADMIN" ? sidebarAdminContent : sideBarUserContent).map((item, index) => {
                        const { name, icon, path, style } = item;
                        return (
                            <Motion.div
                                variants={itemVariants}
                                key={index}
                            >
                            <NavLink
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
                            </Motion.div>
                        )
                    })
                }
            </Motion.div>

            {/* settings */}
            <Motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            >
            <Motion.div
            variants={itemVariants}
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
            </Motion.div>
            </Motion.div>

            {/* logout popup */}
            <AnimateModal isOpen={logoutPopupOpen}>
            {
                logoutPopupOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Remove
                            onClose={() => {
                                setLogoutPopupOpen(false);
                            }}
                            method={logout}
                            isLoading={isLoading}
                            icon={<LogOut />}
                            header={"Logout"}
                            subHeader={"Are you sure you want to logout ?"}
                        />
                    </div>
                )
            }
            </AnimateModal>
        </div>
    )
}

export default Sidebar;