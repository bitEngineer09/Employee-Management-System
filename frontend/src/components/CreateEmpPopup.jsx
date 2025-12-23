import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import useCreateEmployee from '../hooks/Admin/useCreateEmployee';

const CreateEmpPopup = ({ createEmp, setCreateEmp }) => {

    const { createEmployee } = useCreateEmployee();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        gender: "",
        dob: "",
        phone: "",
        departmentId: "",
        designation: "",
        monthlySalary: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        createEmployee({
            name: formData.name,
            email: formData.email,
            gender: formData.gender,
            dob: formData.dob,
            phoneNumber: formData.phone,
            departmentId: formData.departmentId,
            designation: formData.designation,
            monthlySalary: formData.monthlySalary,
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

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

            <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='name' className='text-sm font-medium text-(--bg-secondary)'>Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        onChange={handleChange}
                        value={formData.name}
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
                    <label htmlFor='email' className='text-sm font-medium text-(--bg-secondary)'>Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        onChange={handleChange}
                        value={formData.email}
                        placeholder="Enter email"
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
                    <label htmlFor='gender' className='text-sm font-medium text-(--bg-secondary)'>Gender</label>
                    <select
                        name="gender"
                        value={formData?.gender}
                        onChange={handleChange}
                        required
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                            focus:border-(--blue-active)
                            focus:ring-3 focus:ring-(--blue-light)
                            transition-all
                        '>
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor='dob' className='text-sm font-medium text-(--bg-secondary)'>
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        name="dob"
                        value={formData?.dob}
                        onChange={handleChange}
                        required
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
                    <label htmlFor='phone' className='text-sm font-medium text-(--bg-secondary)'>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        required
                        onChange={handleChange}
                        value={formData?.phone}
                        placeholder="Enter Phone Number"
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
                    <label htmlFor='departmentId' className='text-sm font-medium text-(--bg-secondary)'>Department ID</label>
                    <input
                        type="text"
                        name="departmentId"
                        required
                        onChange={handleChange}
                        value={formData.departmentId}
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
                    <label htmlFor='designation' className='text-sm font-medium text-(--bg-secondary)'>Designation</label>
                    <input
                        type="text"
                        name="designation"
                        required
                        onChange={handleChange}
                        value={formData.designation}
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

                <div className='flex flex-col gap-2 '>
                    <label htmlFor='monthlySalary' className='text-sm font-medium text-(--bg-secondary)'>Monthly Salary</label>
                    <input
                        type="text"
                        name="monthlySalary"
                        required
                        onChange={handleChange}
                        value={formData.monthlySalary}
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
                            cursor-pointer
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
                            cursor-pointer
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