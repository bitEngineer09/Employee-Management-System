import React from 'react'
import { Mail, Phone, Edit2, Trash2 } from 'lucide-react';

const EmployeeRecords = ({ employees }) => {
    // console.log(employees)

    // table header data
    const tableHeader = [
        { name: "Employee" },
        { name: "Contact" },
        { name: "Position" },
        { name: "Department" },
        { name: "Salary" },
        { name: "Status" },
        { name: "Action" },
    ];

    return (
        <div className='mt-6'>
            <table className='w-full border border-(--border-primary)'>
                <thead className="bg-(--border-subtle) border-b border-(--border-primary)">
                    <tr>
                        {
                            tableHeader.map((header) =>
                                <th
                                    className="
                                        px-6 py-3
                                        text-left text-xs
                                        font-medium text-(--text-tertiary)
                                        uppercase tracking-wider
                                    ">
                                    {header.name}
                                </th>
                            )}
                    </tr>
                </thead>
                <tbody className="bg-black">
                    {
                        employees?.map((employee) => {
                            return (
                                <tr
                                    key={employee.id}
                                    className="
                                    transition-colors
                                    text-(--text-secondary)
                                    border-b border-(--border-primary)
                                    hover:bg-(--border-subtle)
                                    ">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div
                                                className="
                                                    h-10 w-10
                                                    bg-(--blue-primary)
                                                    rounded-full 
                                                    flex items-center justify-center
                                                    font-semibold text-white
                                                ">
                                                {employee?.name?.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{employee?.name}</div>
                                                <div className="text-sm text-(--text-tertiary)">Joined {employee?.createdAt?.split("T")[0]}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center text-sm text-(--text-secondary)">
                                                <Mail size={14} className="mr-2 text-(--text-disabled)" />
                                                {employee?.email}
                                            </div>
                                            <div className="flex items-center text-sm text-(--text-secondary)">
                                                <Phone size={14} className="mr-2 text-(--text-disabled)" />
                                                {employee?.phoneNumber}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-(--text-secondary)">{employee?.designation}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className="
                                                px-3 py-1
                                                inline-flex
                                                text-xs leading-5
                                                font-semibold
                                                rounded-full
                                                bg-blue-950 text-blue-300
                                                border border-(--blue-dark)
                                            ">
                                            {employee?.department?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-(--text-secondary)">
                                        ₹{" "}{employee?.monthlySalary?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`
                                                px-3 py-1
                                                inline-flex
                                                text-xs leading-5
                                                font-semibold rounded-full
                                                ${employee?.isActive === true
                                                    ? 'bg-green-950 text-green-300 border border-green-800'
                                                    : 'bg-red-950 text-red-300 border border-red-800'
                                                }
                                            `}>
                                            {employee?.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-blue-400 hover:text-(--blue-primary) mr-4 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            className="text-red-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default EmployeeRecords