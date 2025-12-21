import React from 'react';
import { Link } from 'react-router-dom';

import { IoIosPerson } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { PiHouseSimpleBold } from "react-icons/pi";
import { IoMdHome } from "react-icons/io";
import { GoGear } from "react-icons/go";
import { TbLogout2 } from "react-icons/tb";
import { CiMenuKebab } from "react-icons/ci";

import useLogout from '../hooks/Auth/useLogout';
import useUser from '../hooks/Auth/useUser';

const Sidebar = () => {
    const sidebarContent = [
        { name: "Home", icon: <IoMdHome />, path: "/" },
        { name: "Dashboard", icon: <RxDashboard />, path: "/dashboard" },
        { name: "Employees", icon: <IoIosPerson />, path: "/emp" },
        { name: "Departments", icon: <PiHouseSimpleBold />, path: "/dept" },
        { name: "Settings", icon: <GoGear /> },
    ]

    const { logout } = useLogout();
    const { currentUser } = useUser();

    const { name, designation, } = currentUser?.user || {};

    return (
        <div
            className="
                w-60 h-full 
                border-r-2 border-(--border-primary)
                flex flex-col justify-between
                bg-(--bg-secondary)
            ">
            <div className="flex flex-col mt-1 gap-1">

                {/* Profile */}
                <div className='flex items-center justify-center gap-4 px-5 my-4 tracking-wider text-sm cursor-pointer'>
                    <div
                        className='
                            flex items-center justify-center
                            bg-(--text-secondary)
                            size-10
                            rounded-full
                            text-3xl font-semibold
                    '>G</div>
                    <div className='flex flex-col text-(--text-secondary)'>
                        <p>{name}</p>
                        <p>{designation}</p>
                    </div>
                    <CiMenuKebab className='text-(--text-secondary) text-2xl' />
                </div>

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
            <div
                onClick={logout}
                className='
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