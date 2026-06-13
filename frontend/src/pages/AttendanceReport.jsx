import React from 'react'
import AttendanceReportSummary from '../components/AttendanceReportSummary'

const AttendanceReport = () => {
  return (
    <div>
        <AttendanceReportSummary mode="employee" />
        <AttendanceReportSummary mode="department" />
    </div>
  )
}

export default AttendanceReport