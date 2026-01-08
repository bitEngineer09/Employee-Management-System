import React, { useMemo, useState } from 'react'
import { House, Plus } from 'lucide-react';
import DepartmentRecords from '../components/Departments/DepartmentRecords';
import useGetDepartment from '../hooks/Admin/Department/useGetDepartment';
import CreateDepartmentPopup from '../components/Popups/CreateDepartmentPopup';
import DepartmentStatsCard from '../components/Departments/DepartmentStatsCard';

const ITEMS_PER_PAGE = 6;

const Department = () => {
  const [createDept, setCreateDept] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { departmentData } = useGetDepartment();
  const departments = departmentData?.departments || [];
  // console.log(departmentData)

  // pagingation 
  const totalPages = Math.ceil(departments.length / ITEMS_PER_PAGE);
  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return departments.slice(startIndex, endIndex);
  }, [departments, currentPage]);

  return (
    <>
      <div>
        {/* header */}
        <header className='flex justify-between'>
          <p className='flex items-center gap-2 text-(--text-secondary) text-3xl font-medium'>
            Department Records <House size={28} strokeWidth={2} />
          </p>

          {/* Create Department */}
          <button
            onClick={() => setCreateDept(!createDept)}
            className='
            flex items-center 
            gap-2
            text-(--text-secondary)
            border border-gray-300
            hover:border-purple-500
            hover:text-purple-600
            transition-colors 
            cursor-pointer
            px-4 py-3 rounded-xl
            font-medium
            '>
            Create Department <Plus size={20} />
          </button>
        </header>

        {/* Department stats summary cards */}
        <DepartmentStatsCard />

        {/* Department records table */}
        <DepartmentRecords
          departments={paginatedDepartments}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>

      {/* create department popup */}
      {
        createDept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <CreateDepartmentPopup createDept={createDept} setCreateDept={setCreateDept} />
          </div>
        )
      }
    </>
  )
}

export default Department;
