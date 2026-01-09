import React from 'react';
import CheckInOut from '../../components/CheckInOut';
import AttendanceTable from '../../components/AttendanceTable';
import { getTodayAttendanceData } from '../../data/AttendanceSummaryCardData';

// hooks
import useGetTodayAttendance from '../../hooks/User/Attendance/useGetTodayAttendance';
import TodayAttendanceStatsCards from '../../components/TodayAttendanceStatsCards';
import MonthlyAttendanceSummaryCard from '../../components/MonthlyAttendanceSummaryCard';

import { CheckCheck } from 'lucide-react';


const Attendance = () => {
  const { todayAttendance } = useGetTodayAttendance();
  const todayAttendanceData = getTodayAttendanceData(todayAttendance?.data);

  return (
    <div>

      {/* header */}
      <h1 className='flex items-center gap-2 text-(--text-secondary) text-3xl font-medium'>
        Attendance <CheckCheck size={28} strokeWidth={2} />
      </h1>

      {/* check-in / check-out button */}
      <CheckInOut />

      {/* Today attendance stats cards */}
      <div>
        <h2 className="text-xl font-semibold text-(--text-primary)">
          Today's Attendance
        </h2>
        <div className='grid grid-cols-4 gap-4 mt-3'>
          {
            todayAttendanceData.map((stat, index) => {
              const { name, value, icon, color, bgColor, hover } = stat;
              return (
                <TodayAttendanceStatsCards
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
    </div>
  )
}

export default Attendance;