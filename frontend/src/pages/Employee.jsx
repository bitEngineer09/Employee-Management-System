import React, { useState } from 'react'
import { LuPlus } from "react-icons/lu";
import CreateEmpPopup from '../components/CreateEmpPopup';

const Employee = () => {
  const [createEmp, setCreateEmp] = useState(false);

  return (
    <div className='relative'>
      <div className='flex items-center justify-between'>
        <p className='text-(--text-secondary) text-3xl font-semibold'>Employee Records</p>
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
          Add Employee <LuPlus size={20} />
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
    </div>
  );
};

export default Employee;
