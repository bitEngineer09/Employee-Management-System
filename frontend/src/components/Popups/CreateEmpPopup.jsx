import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import useCreateEmployee from '../../hooks/Admin/useCreateEmployee';
import { User } from 'lucide-react';

const CreateEmpPopup = ({ setCreateEmp }) => {
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

        setCreateEmp(false);
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
                        text-(--blue-light)
                        flex items-center justify-center 
                        bg-(--blue-primary)/20 rounded-xl
                        border border-(--blue-primary)
                    ">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-(--text-primary)">
                            Add Employee
                        </h2>
                        <p className="text-sm text-(--text-tertiary) mt-0.5">
                            Enter employee details
                        </p>
                    </div>
                </div>

                <RxCross2
                    onClick={() => setCreateEmp(false)}
                    className='cursor-pointer text-2xl text-(--text-secondary) hover:text-red-700 transition-colors'
                />
            </div>

            <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>

                <InputCard
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                />

                <InputCard
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                />

                <SelectCard
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Select Gender" },
                        { value: "MALE", label: "Male" },
                        { value: "FEMALE", label: "Female" },
                        { value: "OTHER", label: "Other" },
                    ]}
                />

                <InputCard
                    label="Date of Birth"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                />

                <InputCard
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
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
    );
};

export default CreateEmpPopup;


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


const SelectCard = ({
    label,
    name,
    value,
    onChange,
    options = [],
}) => {
    return (
        <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-(--text-secondary)'>
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                required
                className='
                    border border-(--border-primary)
                    py-3 px-4
                    bg-slate-900/50
                    outline-none rounded-xl
                    text-(--text-secondary)
                    focus:border-(--blue-active)
                    focus:ring-3 focus:ring-(--blue-light)
                    transition-all
                '>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
