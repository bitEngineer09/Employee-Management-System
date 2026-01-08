import React from 'react'
import useGetDepartment from '../../hooks/Admin/Department/useGetDepartment';
import useAuth from '../../hooks/Auth/useAuth';
import { getDepartmentStatsCard } from '../../data/SummaryCards';

const DepartmentStatsCard = () => {
    const { currentUser } = useAuth();
    const { role } = currentUser?.user || {};
    const isAdmin = role === "ADMIN";

    const { departmentData } = useGetDepartment();
    const department = departmentData?.summary;
    // console.log(department)

    const departmentStatsCardData = getDepartmentStatsCard(department)

    return (
        <div className='w-full h-full my-5'>
            <div className='grid grid-cols-4 gap-4'>
                {
                    isAdmin && (
                        departmentStatsCardData.map((stat, index) => {
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