import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import useCreateDepartment from '../../hooks/Admin/Department/useCreateDepartment';
import { Home, House } from 'lucide-react';

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
                bg-modal-gradient
                w-full max-w-2xl
                rounded-2xl 
                p-6 shadow-2xl 
                border border-(--border-primary)
            '>
            <div className='flex items-center justify-between mb-6'>
                <div className="flex items-center gap-3 mb-5">
                    <div
                        className="
                        w-12 h-12 
                        text-purple-400
                        flex items-center justify-center 
                        bg-purple-700/20 rounded-xl
                        border border-purple-400
                    ">
                        <Home size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-(--text-primary)">
                            Add Department
                        </h2>
                        <p className="text-sm text-(--text-tertiary) mt-0.5">
                            Enter department details
                        </p>
                    </div>
                </div>
                <RxCross2
                    onClick={() => setCreateDept(!createDept)}
                    className='cursor-pointer text-2xl text-(--text-secondary) tracking-wide hover:text-red-700 transition-colors'
                />
            </div>

            <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
                {/* Department Name */}
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--text-secondary) tracking-wide'>
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
                            text-(--text-secondary) tracking-wide
                            bg-slate-900/50
                           focus:border-purple-400
                            focus:ring-3 focus:ring-purple-400
                            transition-all
                        '/>
                </div>

                {/* Department Description */}
                <div className='col-span-2 flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--text-secondary) tracking-wide'>
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
                            bg-slate-900/50
                            outline-none rounded-xl
                            text-(--text-secondary) tracking-wide
                            resize-none
                            focus:border-purple-400
                            focus:ring-3 focus:ring-purple-400
                            transition-all
                        '/>
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
                            cursor-pointer
                            flex-1 bg-slate-700
                            hover:bg-slate-600
                            text-(--text-secondary)
                            py-3 rounded-xl
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
