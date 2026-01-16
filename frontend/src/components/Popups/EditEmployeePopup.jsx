import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { User, Pencil } from 'lucide-react';
import useUpdateEmployeeById from '../../hooks/Admin/useUpdateEmployeeById';
import ButtonLoader from '../Loader/ButtonLoader';

const EditEmployeePopup = ({ employee, setUpdateEmp }) => {
    const { updateEmployee, isLoading } = useUpdateEmployeeById();

    const [formData, setFormData] = useState({
        name: employee?.name || "",
        departmentId: employee?.department?.id || "",
        designation: employee?.designation || "",
        monthlySalary: employee?.monthlySalary || "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className='
                bg-modal-gradient
                w-full max-w-2xl
                rounded-2xl 
                p-6 shadow-2xl 
                border border-(--border-primary)
            '>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <div className="flex items-center gap-3">
                    <div
                        className="
                            w-12 h-12 
                            text-(--blue-light)
                            flex items-center justify-center 
                            bg-(--blue-primary)/20 rounded-xl
                            border border-(--blue-primary)
                        ">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-(--text-primary)">
                            Edit Employee
                        </h2>
                        <p className="text-sm text-(--text-tertiary) mt-0.5">
                            Update employee details
                        </p>
                    </div>
                </div>

                <RxCross2
                    onClick={() => setUpdateEmp(false)}
                    className='cursor-pointer text-2xl text-(--text-secondary) hover:text-red-700 transition-colors'
                />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>

                <InputCard
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                />

                <InputCard
                    label="Department ID"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    placeholder="Enter department ID"
                />

                <InputCard
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                />

                <InputCard
                    label="Monthly Salary"
                    name="monthlySalary"
                    value={formData.monthlySalary}
                    onChange={handleChange}
                    placeholder="Enter monthly salary"
                />

                {/* Buttons */}
                <div className='col-span-2 flex gap-4 mt-4'>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className='
                            cursor-pointer
                            flex-1 bg-(--blue-active)
                            text-white py-3
                            rounded-xl hover:bg-blue-700
                            transition-colors font-medium
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        '>
                        {
                            isLoading
                                ? <ButtonLoader />
                                : <p className='flex items-center justify-center gap-2'>
                                    Update Employee <Pencil size={15} />
                                </p>
                        }
                    </button>

                    <button
                        disabled={isLoading}
                        type="button"
                        onClick={() => setUpdateEmp(false)}
                        className='
                            cursor-pointer
                            flex-1 bg-slate-700
                            hover:bg-slate-600
                            text-(--text-secondary)
                            py-3 rounded-xl
                            transition-colors font-medium
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        '>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEmployeePopup;

const InputCard = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
}) => {
    return (
        <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium tracking-wide text-(--text-secondary)'>
                {label}
            </label>

            <input
                type={type}
                name={name}
                required
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className='
                    border border-(--border-primary)
                    py-3 px-4
                    bg-slate-900/50
                    outline-none rounded-xl
                    text-(--text-secondary)
                    focus:border-(--blue-active)
                    focus:ring-3 focus:ring-(--blue-light)
                    transition-all
                '/>
        </div>
    );
};
