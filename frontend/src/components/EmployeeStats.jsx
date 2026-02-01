import React from 'react'
import useAuth from '../hooks/Auth/useAuth';
import useAdminDashboard from '../hooks/Admin/useAdminDashboard';
import { getEmployeeStatsCard } from '../data/SummaryCards';
import StatsCardGrid from './Common/StatsCardGrid';

const EmployeeStats = ({ onCardClick }) => {
    const { currentUser } = useAuth();
    const { role } = currentUser?.user || {};
    const isAdmin = role === "ADMIN";

    const { adminDashboardData } = useAdminDashboard();
    const employeeStatsCardData = getEmployeeStatsCard(adminDashboardData);

    if (!isAdmin) return null;

    return (
        <StatsCardGrid
            data={employeeStatsCardData}
            onCardClick={(type) => onCardClick(type)}
            gridClass='grid grid-cols-2 xl:grid-cols-4 gap-4'
            padding='p-5'
        />
    )
}

export default EmployeeStats;
