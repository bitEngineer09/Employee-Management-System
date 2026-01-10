import React, { useMemo, useState } from 'react'

// components
import DepartmentRecords from '../components/Departments/DepartmentRecords';
import CreateDepartmentPopup from '../components/Popups/CreateDepartmentPopup';
import DepartmentStatsCard from '../components/Departments/DepartmentStatsCard';
import SummaryDepartmentPopup from '../components/Popups/SummaryTablesPopup/SummaryDepartmentPopup';

// hooks
import useGetDepartment from '../hooks/Admin/Department/useGetDepartment';

// icons
import { House, Plus } from 'lucide-react';

// constants
const ITEMS_PER_PAGE = 6;

const Department = () => {

  const [createDept, setCreateDept] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [summaryType, setSummaryType] = useState(null);

  // department data
  const { departmentData } = useGetDepartment();
  const departments = useMemo(() => {
    return departmentData?.departments ?? [];
  }, [departmentData]);

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
        <DepartmentStatsCard onCardClick={(type) => setSummaryType(type)} />

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

      {/* Summary table department popup*/}
      {
        summaryType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <SummaryDepartmentPopup
              type={summaryType}
              departments={departments}
              onClose={() => setSummaryType(null)}
            />
          </div>
        )
      }
    </>
  )
}

export default Department;
