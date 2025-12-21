import React from 'react'
import { IoIosPerson } from "react-icons/io";
import { PiHouseSimpleBold } from "react-icons/pi";
import { MdOutlineVerified } from "react-icons/md";
import useAuth from '../hooks/Auth/useAuth';
import useAdminDashboard from '../hooks/Admin/useAdminDashboard';

const Dashboard = () => {

  const { currentUser } = useAuth();
  const { role } = currentUser?.user || {};

  const isAdmin = role === "ADMIN";
  // console.log(isAdmin);

  const { adminDashboardData } = useAdminDashboard();
  const { totalEmployees, activeEmployees, absentEmployees, departments } = adminDashboardData || {};

  const stats = [
    {
      name: "Total Employees",
      number: totalEmployees,
      icon: <IoIosPerson />,
      color: "bg-blue-600/20 text-blue-400",
    },
    {
      name: "Active Employees",
      number: activeEmployees,
      icon: <MdOutlineVerified />,
      color: "bg-green-600/20 text-green-400",
    },
    {
      name: "Absent Employees",
      number: absentEmployees,
      icon: <IoIosPerson />,
      color: "bg-red-600/20 text-red-400",
    },
    {
      name: "Departments",
      number: departments,
      icon: <PiHouseSimpleBold />,
      color: "bg-purple-600/20 text-purple-400",
    },
  ];

  return (
    <div className='w-full h-full'>
      <div className='grid grid-cols-4 gap-4'>
        {
          isAdmin && (
            stats.map((stat, index) => {
              const { name, number, icon, color } = stat;
              return (
                <div
                  key={index}
                  className='
                  flex items-center justify-between
                  text-(--text-secondary)
                  bg-(--bg-primary)
                  p-4 rounded-2xl
                '>
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
    </div>
  )
}

export default Dashboard;