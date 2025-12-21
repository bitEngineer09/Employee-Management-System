import React from 'react'
import { RxCross2 } from "react-icons/rx";

const CreateEmpPopup = ({ createEmp, setCreateEmp }) => {

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
                    <h1 className='text-2xl font-semibold text-(--bg-secondary)'>Create Employee</h1>
                    <p className='text-(--text-disabled) text-sm mt-1'>Enter employee details</p>
                </div>
                <RxCross2
                    onClick={() => setCreateEmp(!createEmp)}
                    className='cursor-pointer text-2xl text-(--bg-secondary) hover:text-red-700 transition-colors'
                />
            </div>

            <form className='grid grid-cols-2 gap-6'>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--bg-secondary)'>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                            focus:border-(--blue-active)
                            focus:ring-3 focus:ring-(--blue-light)
                            transition-all
                        '/>
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--bg-secondary)'>Employee ID</label>
                    <input
                        type="number"
                        name="employeeId"
                        placeholder="Enter employee ID"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                            focus:border-(--blue-active)
                            focus:ring-3 focus:ring-(--blue-light)
                            transition-all
                        '/>
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--bg-secondary)'>Department ID</label>
                    <input
                        type="number"
                        name="departmentId"
                        placeholder="Enter department ID"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                            focus:border-(--blue-active)
                            focus:ring-3 focus:ring-(--blue-light)
                            transition-all
                        '/>
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--bg-secondary)'>Designation</label>
                    <input
                        type="text"
                        name="designation"
                        placeholder="Enter designation"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                            focus:border-(--blue-active)
                            focus:ring-3 focus:ring-(--blue-light)
                            transition-all
                        '/>
                </div>

                <div className='flex flex-col gap-2 col-span-2'>
                    <label className='text-sm font-medium text-(--bg-secondary)'>Monthly Salary</label>
                    <input
                        type="number"
                        name="salary"
                        placeholder="Enter monthly salary"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                            focus:border-(--blue-active)
                            focus:ring-3 focus:ring-(--blue-light)
                            transition-all
                        '/>
                </div>

                <div className='col-span-2 flex gap-4 mt-4'>
                    <button
                        type="submit"
                        className='
                            flex-1 bg-(--blue-active)
                            text-white py-3
                            rounded-xl hover:bg-blue-700
                            transition-colors font-medium
                        '>
                        Create Employee
                    </button>
                    <button
                        type="button"
                        onClick={() => setCreateEmp(false)}
                        className='
                            flex-1 bg-gray-200
                            text-(--bg-secondary)
                            py-3 rounded-xl
                            hover:bg-gray-300
                            transition-colors font-medium
                        '>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateEmpPopup