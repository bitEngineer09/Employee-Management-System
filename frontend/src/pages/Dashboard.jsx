import React from 'react'
import useAuth from '../hooks/Auth/useAuth';
import useAdminDashboard from '../hooks/Admin/useAdminDashboard';
import EmployeeStatusBarChart from '../components/Charts/EmployeeStatusBarChart';
import DepartmentStats from '../components/Charts/DepartmentStats';
import AttendanceSummary from '../components/Charts/AttendanceSummary';
import useDepartmentStats from '../hooks/Admin/Department/useDepartmentStats';
import useDepartmentWiseAttendance from '../hooks/Admin/Department/useDepartmentWiseAttendance';
import DepartmentAttendanceChart from '../components/Charts/DepartmentAttendanceChart';
import { getGreeting } from '../utils/getGreeting';
import QuickActions from '../components/QuickActions';
import { getDashboardStatsCard } from '../data/SummaryCards';
import { getActiveInactivePieData, getAttendancePieData, getEmployeeChartData } from '../data/ChartData';

const Dashboard = () => {

  const { currentUser } = useAuth();
  const { role } = currentUser?.user || {};

  const isAdmin = role === "ADMIN";
  // console.log(isAdmin);

  const { adminDashboardData } = useAdminDashboard();
  // console.log(adminDashboardData);

  const { departmentStats } = useDepartmentStats();
  // console.log(departmentStats)

  const { departmentWiseAttendance } = useDepartmentWiseAttendance();
  // console.log(departmentWiseAttendance);

  const greeting = getGreeting();

  const stats = getDashboardStatsCard(adminDashboardData);
  const employeeChartData = getEmployeeChartData(adminDashboardData)
  const attendancePieData = getAttendancePieData(adminDashboardData);
  const activeInactivePieData = getActiveInactivePieData(adminDashboardData);

  const departmentChartData = departmentStats?.data?.map(dept => ({
    department: dept?.name,
    employees: dept?._count?.users,
  }));


  return (
    <div className='w-full h-full text-(--text-secondary)'>

      {/* header */}
      <header>
        <h1 className="text-3xl">{greeting}, {currentUser?.user?.name || "Guest"}👋</h1>
        <p className=" mt-1">Welcome to the admin panel. Here you can manage your employees, check attendances, view reports, etc</p>
      </header>

      {/* summary cards */}
      <div className='grid grid-cols-4 gap-4 mt-9'>
        {
          isAdmin && (
            stats.map((stat, index) => {
              const { name, number, icon, color, bgColor, hover } = stat;
              return (
                <div
                  key={index}
                  className={`
                    border-2 border-transparent
                  flex items-center justify-between
                  text-(--text-secondary)
                  bg-(--bg-primary)
                  p-6 rounded-2xl
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

      {/* Quick actions */}
      <QuickActions />

        {/* Charts */}
      <div className="grid grid-cols-2 gap-6 w-full mt-9">
        <div className="bg-blue-700/10 rounded-2xl p-4">
          <EmployeeStatusBarChart data={employeeChartData} />
        </div>

        <div className="bg-blue-700/10 rounded-2xl p-4">
          <AttendanceSummary data={attendancePieData} header={"Attendance Summary"} />
        </div>
      </div>

      <div className="bg-purple-700/10 rounded-2xl my-10 p-4">
        <DepartmentStats data={departmentChartData} />
      </div>

      <div className="bg-green-700/10 rounded-2xl p-4">
        <DepartmentAttendanceChart data={departmentWiseAttendance?.data || []} />
      </div>

      <div className="bg-blue-700/10 rounded-2xl mt-6 p-4">
        <AttendanceSummary data={activeInactivePieData} header={"Active / Inactive"} />
      </div>

    </div>
  )
}

export default Dashboard;