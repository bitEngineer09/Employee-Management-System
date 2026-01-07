import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import useCreateDepartment from '../hooks/Admin/Department/useCreateDepartment';
import { House } from 'lucide-react';

const CreateDepartmentPopup = ({ createDept, setCreateDept }) => {
    const { createDepartment } = useCreateDepartment();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        createDepartment({
            name: formData.name,
            description: formData.description,
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div
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
                        Create Department <House/>
                    </h1>
                    <p className='text-(--text-disabled) text-sm mt-1'>
                        Enter department details
                    </p>
                </div>
                <RxCross2
                    onClick={() => setCreateDept(!createDept)}
                    className='cursor-pointer text-2xl text-(--bg-secondary) hover:text-red-700 transition-colors'
                />
            </div>

            <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
                {/* Department Name */}
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--bg-secondary)'>
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Department name"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                           focus:border-purple-400
                            focus:ring-3 focus:ring-purple-400
                            transition-all
                        '
                    />
                </div>

                {/* Department Description */}
                <div className='col-span-2 flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--bg-secondary)'>
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter Department description"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                            resize-none
                            focus:border-purple-400
                            focus:ring-3 focus:ring-purple-400
                            transition-all
                        '
                    />
                </div>

                {/* Buttons */}
                <div className='col-span-2 flex gap-4 mt-4'>
                    <button
                        type="submit"
                        className='
                            flex-1 bg-purple-600
                            text-white py-3
                            rounded-xl hover:bg-purple-700
                            cursor-pointer
                            transition-colors font-medium
                        '>
                        Create Department
                    </button>
                    <button
                        type="button"
                        onClick={() => setCreateDept(false)}
                        className='
                            flex-1 bg-gray-200
                            text-(--bg-secondary)
                            py-3 rounded-xl
                            hover:bg-gray-300
                            cursor-pointer
                            transition-colors font-medium
                        '>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateDepartmentPopup;
