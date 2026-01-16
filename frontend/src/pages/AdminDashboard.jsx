import React, { useState } from 'react'

// data / fucntions import
import { getGreeting } from '../utils/getGreeting';
import { getDashboardStatsCard } from '../data/SummaryCards';
import { getActiveInactivePieData, getAttendancePieData, getEmployeeChartData } from '../data/ChartData';

// components import 
import QuickActions from '../components/QuickActions';
import SummaryDepartmentPopup from '../components/Popups/SummaryTablesPopup/SummaryDepartmentPopup';
import SummaryEmployeePopup from '../components/Popups/SummaryTablesPopup/SummaryEmployeePopup';

// hooks import
import useAuth from '../hooks/Auth/useAuth';
import useAdminDashboard from '../hooks/Admin/useAdminDashboard';
import useDepartmentStats from '../hooks/Admin/Department/useDepartmentStats';
import useDepartmentWiseAttendance from '../hooks/Admin/Department/useDepartmentWiseAttendance';
import useAllEmployees from '../hooks/Admin/useAllEmployees';
import useGetDepartment from '../hooks/Admin/Department/useGetDepartment';
import useTodayEmployeesAttendance from '../hooks/Admin/useTodayEmployeesAttendance';

// charts import
import EmployeeStatusBarChart from '../components/Charts/EmployeeStatusBarChart';
import DepartmentStatsBarChart from '../components/Charts/DepartmentStatsBarChart';
import AttendanceSummaryPieChart from '../components/Charts/AttendanceSummaryPieChart';
import DepartmentAttendanceBarChart from '../components/Charts/DepartmentAttendanceChart';
import UpcomingHolidays from '../components/UpcomingHolidays';

const AdminDashboard = () => {

  const [summaryType, setSummaryType] = useState(null);
  const [summaryTypeDepartments, setSummaryTypeDepartments] = useState(null);

  // today employees attendance
  const { todayEmployeesAttendance } = useTodayEmployeesAttendance();
  const todayEmployees = todayEmployeesAttendance?.data;

  // current user
  const { currentUser } = useAuth();
  const { role } = currentUser?.user || {};

  // all employees
  const { allEmployees } = useAllEmployees();

  const employees = summaryType === "PRESENT" || summaryType === "ABSENT"
    ? todayEmployees
    : allEmployees?.data || [];

  // departments data
  const { departmentData } = useGetDepartment();

  const departments = departmentData?.departments || [];

  // check admin
  const isAdmin = role === "ADMIN";

  // hooks data
  const { adminDashboardData } = useAdminDashboard();
  const { departmentStats } = useDepartmentStats();
  const { departmentWiseAttendance } = useDepartmentWiseAttendance();

  const greeting = getGreeting();

  // dashboard summary cards data
  const dashboardStatsCardData = getDashboardStatsCard(adminDashboardData);

  // chart data 
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
            dashboardStatsCardData.map((stat, index) => {
              const { name, number, icon, color, bgColor, hover, type } = stat;
              return (
                <div
                  onClick={
                    type === "TOTAL" || type === "PRESENT" || type === "ABSENT"
                      ? () => setSummaryType(type)
                      : () => setSummaryTypeDepartments(type)
                  }
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
          <AttendanceSummaryPieChart data={attendancePieData} header={"Attendance Summary"} />
        </div>
      </div>

      <div className="bg-purple-700/10 rounded-2xl my-10 p-4">
        <DepartmentStatsBarChart data={departmentChartData} />
      </div>

      <div className="bg-green-700/10 rounded-2xl p-4">
        <DepartmentAttendanceBarChart data={departmentWiseAttendance?.data || []} />
      </div>

      <div className="bg-blue-700/10 rounded-2xl mt-6 p-4">
        <AttendanceSummaryPieChart data={activeInactivePieData} header={"Active / Inactive"} />
      </div>

      <div className='pb-7'>
        <UpcomingHolidays />
      </div>

      {/* summary table employees */}
      {
        summaryType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <SummaryEmployeePopup
              type={summaryType}
              employees={employees}
              onClose={() => setSummaryType(null)}
            />
          </div>
        )
      }

      {/* summary table departments */}
      {
        summaryTypeDepartments && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <SummaryDepartmentPopup
              type={summaryTypeDepartments}
              departments={departments}
              onClose={() => setSummaryTypeDepartments(null)}
            />
          </div>
        )
      }
    </div>
  )
}

export default AdminDashboard;