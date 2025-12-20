import React from 'react';
import { IoIosPerson } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { PiHouseSimpleBold } from "react-icons/pi";
import { IoMdHome } from "react-icons/io";
import { GoGear } from "react-icons/go";
import { TbLogout2 } from "react-icons/tb";

import { Link } from 'react-router-dom';
const Sidebar = () => {
    const sidebarContent = [
        { name: "Home", icon: <IoMdHome />, path: "/" },
        { name: "Dashboard", icon: <RxDashboard />, path: "/dashboard" },
        { name: "Employees", icon: <IoIosPerson />, path: "/emp" },
        { name: "Departments", icon: <PiHouseSimpleBold />, path: "/dept" },
        { name: "Settings", icon: <GoGear /> },
    ]

    return (
        <div
            className="
                w-60 h-full 
                border-r-2 border-(--border-primary)
                flex flex-col justify-between
                bg-(--bg-secondary)
            ">
            <div className="flex flex-col mt-1 gap-1">
                {
                    sidebarContent.map((item, index) => {
                        const { name, icon, path } = item;
                        return (
                            <Link to={path}
                                key={index}
                                className="
                            flex items-center gap-4
                            h-11 px-5
                            cursor-pointer
                            rounded-r-full
                            transition-all duration-200
                            text-(--text-secondary)
                            hover:bg-(--text-secondary)
                            hover:text-(--bg-secondary)
                        ">
                                <span className="text-xl">
                                    {icon}
                                </span>
                                <span className="text-sm font-medium tracking-wide">
                                    {name}
                                </span>
                            </Link>
                        )
                    })
                }
            </div>

            {/* settings */}
            <div className='
                flex items-center gap-4
                h-11 px-5
                cursor-pointer
                rounded-r-full
                transition-all duration-200
                hover:bg-red-800
                hover:text-white
            '>
                <TbLogout2 className='text-xl text-(--text-secondary)' />
                <p className='text-(--text-secondary) text-sm font-medium tracking-wide'>Logout</p>
            </div>
        </div>
    )
}

export default Sidebar;