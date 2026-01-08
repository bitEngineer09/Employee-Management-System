import React from 'react'
import useAuth from '../hooks/Auth/useAuth';
import useAdminDashboard from '../hooks/Admin/useAdminDashboard';
import { getEmployeeStatsCard } from '../data/SummaryCards';

const EmployeeStats = ({ onCardClick }) => {
    const { currentUser } = useAuth();
    const { role } = currentUser?.user || {};

    const isAdmin = role === "ADMIN";
    // console.log(isAdmin);

    const { adminDashboardData } = useAdminDashboard();
    // console.log(adminDashboardData);

    const employeeStatsCardData = getEmployeeStatsCard(adminDashboardData);

    return (
        <div className='w-full h-full my-5'>
            <div className='grid grid-cols-4 gap-4'>
                {
                    isAdmin && (
                        employeeStatsCardData.map((stat, index) => {
                            const { name, number, icon, color, bgColor, hover, type } = stat;
                            return (
                                <div
                                    onClick={() => onCardClick(type)}
                                    key={index}
                                    className={`
                                        border-2 border-transparent
                                        flex items-center justify-between
                                        text-(--text-secondary)
                                        bg-(--bg-primary)
                                        p-5 rounded-2xl
                                        transition-all
                                        ${bgColor}
                                        ${hover}
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

export default EmployeeStats