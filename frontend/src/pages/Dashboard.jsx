import React from 'react'
import useAuth from '../hooks/Auth/useAuth';
import useAdminDashboard from '../hooks/Admin/useAdminDashboard';
import useDepartmentStats from '../hooks/Admin/useDepartmentStats';
import EmployeeStatusBarChart from '../components/Charts/EmployeeStatusBarChart';
import DepartmentStats from '../components/Charts/DepartmentStats';
import AttendanceSummary from '../components/Charts/AttendanceSummary';
import { getAttendancePieData, getEmployeeChartData, getStats } from '../services/dashboardData';
import { House } from 'lucide-react';

const Dashboard = () => {

  const { currentUser } = useAuth();
  const { role } = currentUser?.user || {};

  const isAdmin = role === "ADMIN";
  // console.log(isAdmin);

  const { adminDashboardData } = useAdminDashboard();
  // console.log(adminDashboardData)

  const { departmentStats } = useDepartmentStats();
  // console.log(departmentStats)

  const stats = getStats(adminDashboardData);
  const employeeChartData = getEmployeeChartData(adminDashboardData)
  const attendancePieData = getAttendancePieData(adminDashboardData);

  const departmentChartData = departmentStats?.data?.map(dept => ({
    department: dept?.name,
    employees: dept?._count?.users,
  }));

  return (
    <div className='w-full h-full'>
      <p
        className='
          flex items-center 
          mt-1 mb-6 gap-2
          text-(--text-secondary)
          text-3xl font-medium
        '>Dashboard Analytics <House size={28} strokeWidth={3} />
      </p>
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

      <div className="grid grid-cols-2 gap-6 w-full mt-6">
        <div className="bg-blue-700/10 rounded-2xl p-4">
          <EmployeeStatusBarChart data={employeeChartData} />
        </div>

        <div className="bg-blue-700/10 rounded-2xl p-4">
          <AttendanceSummary data={attendancePieData} />
        </div>
      </div>

      <div className="bg-purple-700/10 rounded-2xl mt-6 p-4">
        <DepartmentStats data={departmentChartData} />
      </div>
    </div>
  )
}

export default Dashboard;