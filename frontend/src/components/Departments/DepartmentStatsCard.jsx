import React from 'react'
import useGetDepartment from '../../hooks/Admin/Department/useGetDepartment';
import { BadgeCheck, Ban, House } from 'lucide-react';
import useAuth from '../../hooks/Auth/useAuth';

const DepartmentStatsCard = () => {
    const { currentUser } = useAuth();
    const { role } = currentUser?.user || {};

    const isAdmin = role === "ADMIN";

    const { departmentData } = useGetDepartment();
    const department = departmentData?.summary;
    // console.log(department)

    const stats = [
        {
            name: "Total Departments",
            number: department?.totalDepartments,
            icon: <House />,
            color: "bg-blue-600/20 text-blue-400",
            bgColor: "bg-blue-600/10"
        },
        {
            name: "Active Departments",
            number: department?.activeDepartments,
            icon: <BadgeCheck />,
            color: "bg-green-600/20 text-green-400",
            bgColor: "bg-green-600/10"
        },
        {
            name: "Inactive Departments",
            number: department?.inactiveDepartments,
            icon: <Ban />,
            color: "bg-red-600/20 text-red-400",
            bgColor: "bg-red-600/10"
        },

    ];
    return (
        <div className='w-full h-full my-5'>
            <div className='grid grid-cols-4 gap-4'>
                {
                    isAdmin && (
                        stats.map((stat, index) => {
                            const { name, number, icon, color, bgColor } = stat;
                            return (
                                <div
                                    key={index}
                                    className={`
                                        flex items-center justify-between
                                        text-(--text-secondary)
                                        bg-(--bg-primary)
                                        p-4 rounded-2xl
                                        ${bgColor}
                                    `}>
                                    <div className='flex flex-col gap-2'>
                                        <p>{name}</p>
                                        <p className='text-3xl font-medium'>{number}</p>
                                    </div>
                                    <div
                                        className={`
                                            size-12
                                            text-2xl
                                            flex items-center justify-center
                                            rounded-full
                                            ${color}
                                            `}>
                                        {icon}
                                    </div>
                                </div>
                            )
                        }))
                }
            </div>
        </div>
    )
}

export default DepartmentStatsCard;