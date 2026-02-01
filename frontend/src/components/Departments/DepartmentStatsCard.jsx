import React from 'react'
import useGetDepartment from '../../hooks/Admin/Department/useGetDepartment';
import useAuth from '../../hooks/Auth/useAuth';
import { getDepartmentStatsCard } from '../../data/SummaryCards';
import StatsCardGrid from '../Common/StatsCardGrid';

const DepartmentStatsCard = ({ onCardClick }) => {
    const { currentUser } = useAuth();
    const { role } = currentUser?.user || {};
    const isAdmin = role === "ADMIN";

    const { departmentData } = useGetDepartment();
    const department = departmentData?.summary;

    const departmentStatsCardData = getDepartmentStatsCard(department)

    if (!isAdmin) return null;

    return (
        <StatsCardGrid
            data={departmentStatsCardData}
            onCardClick={(type) => onCardClick(type)}
            gridClass='grid grid-cols-3 gap-4'
            padding='p-4'
        />
    )
}

export default DepartmentStatsCard;
