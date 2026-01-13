import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import useUpdateEmployeeById from '../../hooks/Admin/useUpdateEmployeeById'
import { User } from 'lucide-react';
import ButtonLoader from '../Loader/ButtonLoader';
import { SquarePen, Pencil } from 'lucide-react';

const EditEmployeePopup = ({ employee, setUpdateEmp }) => {
    const { updateEmployee, isLoading } = useUpdateEmployeeById();
    console.log(employee)

    const [formData, setFormData] = useState(() => ({
        name: employee?.name || "",
        departmentId: employee?.department?.id || "",
        designation: employee?.designation || "",
        monthlySalary: employee?.monthlySalary || "",
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        updateEmployee({
            id: employee.id,
            data: {
                name: formData.name,
                departmentId: Number(formData.departmentId),
                designation: formData.designation,
                monthlySalary: Number(formData.monthlySalary),
            }
        });

        setUpdateEmp(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className='
                bg-white 
                w-full max-w-2xl
                rounded-2xl 
                p-6 shadow-2xl 
                border border-(--border-primary)
            '>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='flex items-center gap-2 text-2xl font-semibold text-(--bg-secondary)'>
                        Edit Employee <User />
                    </h1>
                    <p className='text-(--text-disabled) text-sm mt-1'>
                        Edit Employee details
                    </p>
                </div>
                <RxCross2
                    onClick={() => setUpdateEmp(false)}
                    className='cursor-pointer text-2xl text-(--bg-secondary) hover:text-red-700 transition-colors'
                />
            </div>

            <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
                {/* Department Name */}
                <div className='flex flex-col gap-2'>
                    <label className='flex items-center gap-1 text-sm font-medium text-(--bg-secondary)'>
                        Name <SquarePen size={15} />
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Department name"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                           focus:border-blue-400
                            focus:ring-3 focus:ring-blue-400
                            transition-all
                        '/>
                </div>

                {/* Department ID */}
                <div className='flex flex-col gap-2'>
                    <label
                        htmlFor='deptId'
                        className='flex items-center gap-1 text-sm font-medium text-(--bg-secondary)'>
                        Department ID <SquarePen size={15} />
                    </label>
                    <input
                        type="text"
                        name="departmentId"
                        id="deptId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        placeholder="Enter Department ID"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                           focus:border-blue-400
                            focus:ring-3 focus:ring-blue-400
                            transition-all
                        '/>
                </div>

                {/* Designation */}
                <div className='flex flex-col gap-2'>
                    <label
                        htmlFor='designation'
                        className='flex items-center gap-1 text-sm font-medium text-(--bg-secondary)'>
                        Designation <SquarePen size={15} />
                    </label>
                    <input
                        type="text"
                        name="designation"
                        id="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Change Designation"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                           focus:border-blue-400
                            focus:ring-3 focus:ring-blue-400
                            transition-all
                        '/>
                </div>

                {/* Monthly Salary */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor='salary' className='flex items-center gap-1 text-sm font-medium text-(--bg-secondary)'>
                        Salary <SquarePen size={15} />
                    </label>
                    <input
                        type="text"
                        name="monthlySalary"
                        id="salary"
                        value={formData.monthlySalary}
                        onChange={handleChange}
                        placeholder="Enter new salary"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                           focus:border-blue-400
                            focus:ring-3 focus:ring-blue-400
                            transition-all
                        '/>
                </div>


                {/* Buttons */}
                <div className='col-span-2 flex gap-4 mt-4'>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className='
                            flex-1 bg-blue-600
                            text-white py-3
                            rounded-xl hover:bg-blue-700
                            cursor-pointer
                            transition-colors font-medium
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        '>
                        {
                            isLoading
                                ? <ButtonLoader />
                                : <p className='flex items-center justify-center gap-2'> Update Employee <Pencil size={15} /> </p>
                        }
                    </button>
                    <button
                        disabled={isLoading}
                        type="button"
                        onClick={() => setUpdateEmp(false)}
                        className='
                            flex-1 bg-gray-200
                            text-(--bg-secondary)
                            py-3 rounded-xl
                            hover:bg-gray-300
                            cursor-pointer
                            transition-colors font-medium
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        '>
                        {
                            isLoading ? <ButtonLoader /> : "Cancel"
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditEmployeePopup;
