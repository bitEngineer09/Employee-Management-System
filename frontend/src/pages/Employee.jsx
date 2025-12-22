import React, { useMemo, useState } from 'react'
import { Plus, User, Funnel } from 'lucide-react';
import CreateEmpPopup from '../components/CreateEmpPopup';
import EmployeeRecords from '../components/EmployeeRecords';
import useAllEmployees from '../hooks/Admin/useAllEmployees';
import EmployeeStats from '../components/EmployeeStats';

const FILTER_CONFIG = {
  gender: ["MALE", "FEMALE", "OTHER"],
  department: ["Engineering", "Sales", "HR", "IT", "Finanace", "Customer", "R&D"],
  designation: ["MANAGER", "DEVELOPER", "INTERN"],
  status: ["ACTIVE", "INACTIVE"],
};

const Employee = () => {
  const [createEmp, setCreateEmp] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const { allEmployees } = useAllEmployees();

  // all employees data
  const employees = allEmployees?.data;
  console.log(employees);

  // employees filtering logic
  const filteredEmployees = useMemo(() => {
    if (employees?.length === 0) return [];
    if (!filterType || !filterValue) return employees;

    return employees.filter((emp) => {
      switch (filterType) {
        case "gender":
          return emp.gender === filterValue;

        case "department":
          return emp.department?.name === filterValue;

        case "designation":
          return emp.designation === filterValue;

        case "status":
          if (filterValue === "ACTIVE") return emp.isActive === true;
          if (filterValue === "INACTIVE") return emp.isActive === false;
          return true;

        default:
          return true;
      }
    });
  }, [employees, filterType, filterValue]);


  return (
    <div className='relative'>
      <div className='flex items-center justify-between'>
        <p className='flex items-center gap-2 text-(--text-secondary) text-3xl font-semibold'>Employee Records <User size={28} strokeWidth={3} /></p>

        {/* Create Employee */}
        <button
          onClick={() => setCreateEmp(!createEmp)}
          className='
            flex items-center 
            gap-2
            text-(--text-secondary)
            border border-gray-300
            hover:border-blue-500
            hover:text-blue-600
            transition-colors 
            cursor-pointer
            px-4 py-3 rounded-xl
            font-medium
            '>
          Add Employee <Plus size={20} />
        </button>
      </div>

      {/* Popup */}
      {
        createEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <CreateEmpPopup createEmp={createEmp} setCreateEmp={setCreateEmp} />
          </div>
        )
      }

      {/* Employee stats */}
      <EmployeeStats />

      {/* Filter employees */}
      <div className='flex items-center gap-5 mt-10'>
        <h1
          className='flex items-center gap-2 text-(--text-secondary) text-3xl font-semibold'>
          Filter By <Funnel size={28} strokeWidth={2} />
        </h1>

        {/* Filter Type */}
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setFilterValue("");
          }}
          className="border py-3 px-4 rounded-xl text-(--text-secondary)"
        >
          <option className='text-(--bg-secondary)' value="">Select Category</option>
          <option className='text-(--bg-secondary)' value="gender">Gender</option>
          <option className='text-(--bg-secondary)' value="department">Department</option>
          <option className='text-(--bg-secondary)' value="designation">Designation</option>
          <option className='text-(--bg-secondary)' value="status">Status</option>
        </select>

        {/* Filter Value (Nested) */}
        {filterType && (
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="border py-3 px-4 rounded-xl text-(--text-secondary)"
          >
            <option className='text-(--bg-secondary)' value="">Select {filterType}</option>
            {FILTER_CONFIG[filterType].map((item) => (
              <option key={item} value={item} className='text-(--bg-secondary)'>
                {item}
              </option>
            ))}
          </select>
        )}

      </div>

      {/* Employee table records */}
      <EmployeeRecords employees={filteredEmployees} />

    </div>
  );
};

export default Employee;
