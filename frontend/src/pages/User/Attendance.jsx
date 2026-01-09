import React from 'react';
import CheckInOut from '../../components/CheckInOut';
import { CheckCheck } from 'lucide-react';
import AttendanceTable from '../../components/AttendanceTable';

const Attendance = () => {
  return (
    <div>
      <p className='flex items-center gap-2 text-(--text-secondary) text-3xl font-medium'>Attendance <CheckCheck size={28} strokeWidth={2} /></p>
      <CheckInOut />
      <AttendanceTable />
    </div>
  )
}

export default Attendance;