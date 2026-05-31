import React from 'react';
import CheckInOut from '../../components/CheckInOut';
import AttendanceTable from '../../components/AttendanceTable';
import { getTodayAttendanceData } from '../../data/AttendanceSummaryCardData';

// hooks
import useGetTodayAttendance from '../../hooks/User/Attendance/useGetTodayAttendance';
import TodayAttendanceStatsCards from '../../components/TodayAttendanceStatsCards';
import MonthlyAttendanceSummaryCard from '../../components/MonthlyAttendanceSummaryCard';

import { CheckCheck } from 'lucide-react';
import { getGreeting } from '../../utils/getGreeting';
import useAuth from '../../hooks/Auth/useAuth';
import UpcomingHolidays from '../../components/UpcomingHolidays';


const Attendance = () => {

  // hooks
  const { currentUser } = useAuth();
  const { todayAttendance } = useGetTodayAttendance();

  // data / fn
  const todayAttendanceData = getTodayAttendanceData(todayAttendance?.data);
  const greeting = getGreeting();
  return (
    <div>

      {/* header */}
      <h1 className='flex items-center gap-2 text-(--text-secondary) text-3xl font-medium mb-5'>
        <div
          className="
            w-11 h-11 
            text-(--blue-light)
            flex items-center justify-center 
            bg-(--blue-primary)/20 rounded-xl
            border border-(--blue-primary)
            ">
          <CheckCheck size={24} />
        </div>
        Attendance
      </h1>
      <header className='text-(--text-secondary) mb-7'>
        <p className="text-3xl">{greeting}, {currentUser?.user?.name || "Guest"}👋</p>
        <p className=" mt-1">Welcome to the employee panel. Here you can put your attendance, check attendances, view reports, etc</p>
      </header>

      {/* check-in / check-out */}
      <CheckInOut />

      {/* Today attendance stats cards */}
      <div>
        <h2 className="text-xl font-semibold text-(--text-primary)">
          Today's Attendance
        </h2>
        <div className='w-full grid grid-cols-4 gap-50 mt-3 '>
          {
            todayAttendanceData.map((stat, index) => {
              const { name, value, icon, color, bgColor, hover } = stat;
              return (
                <TodayAttendanceStatsCards
                  key={index}
                  index={index}
                  name={name}
                  value={value}
                  icon={icon}
                  color={color}
                  bgColor={bgColor}
                  hover={hover}
                />
              )
            })
          }
        </div>
      </div>

      {/* attendance table record by date range */}
      <AttendanceTable />

      {/* monthly attendance summary */}
      <MonthlyAttendanceSummaryCard />

      <UpcomingHolidays />
    </div>
  )
}

export default Attendance;