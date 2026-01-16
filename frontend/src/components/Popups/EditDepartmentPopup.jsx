import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import useUpdateDepartment from '../../hooks/Admin/Department/useUpdateDepartment';
import { House } from 'lucide-react';
import ButtonLoader from '../Loader/ButtonLoader';
import { SquarePen, Pencil } from 'lucide-react';

const EditDepartmentPopup = ({ department, setUpdateDept }) => {
    const { updateDepartment, isLoading } = useUpdateDepartment();
    console.log(department)

    const [formData, setFormData] = useState({
        name: department?.name || "",
        description: department?.description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        updateDepartment({
            id: department?.id,
            data: {
                name: formData.name,
                description: formData.description,
            }
        });
        setUpdateDept(false);
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
                <div className="flex items-center gap-3">
                    <div
                        className="
                            w-12 h-12 
                        text-purple-400
                        flex items-center justify-center 
                        bg-purple-700/20 rounded-xl
                        border border-purple-400
                        ">
                        <House size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-(--text-primary)">
                            Edit Department
                        </h2>
                        <p className="text-sm text-(--text-tertiary) mt-0.5">
                            Update department details
                        </p>
                    </div>
                </div>
                <RxCross2
                    onClick={() => setUpdateDept(false)}
                    className='cursor-pointer text-2xl text-(--text-secondary) hover:text-red-700 transition-colors'
                />
            </div>

            <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
                {/* Department Name */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor='name' className='flex items-center gap-1 text-sm font-medium text-(--text-secondary)'>
                        Name <SquarePen size={15} />
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Department name"
                        className='
                            border border-(--border-primary)
                            py-3 px-4 bg-slate-900/50
                            outline-none rounded-xl
                            text-(--text-secondary)
                           focus:border-purple-400
                            focus:ring-3 focus:ring-purple-400
                            transition-all
                        '/>
                </div>

                {/* Department Description */}
                <div className='col-span-2 flex flex-col gap-2'>
                    <label htmlFor='descp' className='flex items-center gap-1 text-sm font-medium text-(--text-secondary)'>
                        Description <SquarePen size={15} />
                    </label>
                    <textarea
                        name="description"
                        id="descp"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter Department description"
                        className='
                            border border-(--border-primary)
                            py-3 px-4 bg-slate-900/50
                            outline-none rounded-xl
                            text-(--text-secondary)
                            resize-none
                            focus:border-purple-400
                            focus:ring-3 focus:ring-purple-400
                            transition-all
                        '/>
                </div>

                {/* Buttons */}
                <div className='col-span-2 flex gap-4 mt-4'>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className='
                            flex-1 bg-purple-600
                            text-white py-3
                            rounded-xl hover:bg-purple-700
                            cursor-pointer
                            transition-colors font-medium
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        '>
                        {
                            isLoading
                                ? <ButtonLoader />
                                : <p className='flex items-center justify-center gap-2'> Update Department <Pencil size={15} /> </p>
                        }
                    </button>
                    <button
                        disabled={isLoading}
                        type="button"
                        onClick={() => setUpdateDept(false)}
                        className='
                            cursor-pointer
                            flex-1 bg-slate-700
                            hover:bg-slate-600
                            text-(--text-secondary)
                            py-3 rounded-xl
                            transition-colors font-medium
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

export default EditDepartmentPopup;
