import React from 'react';
import useAuth from '../../hooks/Auth/useAuth';
import { Ban, TentTree, User } from 'lucide-react';
import { AnimatedItem, StaggerContainer } from '../Animation/StaggerContainer';

const DepartmentDetailsStatsCard = ({ department }) => {
    const { currentUser } = useAuth();
    const { role } = currentUser?.user || {};
    const isAdmin = role === "ADMIN";
    const stats = [
        {
            name: "Present Employees",
            number: department?.attendance?.present,
            icon: <User />,
            color: "bg-emerald-600/20 text-emerald-400",
            bgColor: "bg-emerald-600/20"
        },
        {
            name: "Absent Employees",
            number: department?.attendance?.absent,
            icon: <Ban />,
            color: "bg-red-600/20 text-red-400",
            bgColor: "bg-red-600/20"
        },
        {
            name: "On Leave",
            number: department?.attendance?.onLeave,
            icon: <TentTree />,
            color: "bg-amber-600/20 text-amber-400",
            bgColor: "bg-amber-600/20"
        },
        {
            name: "Inactive Employees",
            number: department?.inactiveEmployees,
            icon: <Ban />,
            color: "bg-orange-600/20 text-orange-400",
            bgColor: "bg-orange-600/20"
        },

    ];
    return (
        <div className='w-full h-full my-5'>
            <StaggerContainer className='grid grid-cols-4 gap-4'>
                {
                    isAdmin && (
                        stats.map((stat, index) => {
                            const { name, number, icon, color, bgColor } = stat;
                            return (
                                <AnimatedItem key={index}>
                                <div
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
                                </AnimatedItem>
                            )
                        }))
                }
            </StaggerContainer>
        </div>
    )
}

export default DepartmentDetailsStatsCard