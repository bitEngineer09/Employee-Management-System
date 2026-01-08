import React, { useState } from 'react'
import { Mail, Phone, Edit2, Trash2, Eye } from 'lucide-react';
import EditEmployeePopup from './Popups/EditEmployeePopup';
import DeleteEmployeePopup from './Popups/DeleteEmployeePopup';
import { useNavigate } from 'react-router-dom';

// table header data
const tableHeader = [
    { name: "Employee" },
    { name: "Contact" },
    { name: "Designation" },
    { name: "Department" },
    { name: "Status" },
    { name: "Action" },
];

const EmployeeRecords = ({ employees, currentPage, setCurrentPage, totalPages }) => {
    // console.log(employees)
    const [deleteEmp, setDeleteEmp] = useState(false);
    const [updateEmp, setUpdateEmp] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div className='mt-8 overflow-x-auto custom-scrollbar'>
                <table className='w-full border border-(--border-primary) border-collapse'>
                    <thead className="bg-blue-700/20 border-b border-(--border-primary) sticky top-0 z-10">
                        <tr>
                            {
                                tableHeader.map((header, index) =>
                                    <th
                                        key={index}
                                        className="
                                        px-6 py-3
                                        text-left text-xs
                                        font-medium text-(--text-secondary)
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
                                                bg-purple-950 text-purple-300
                                                border border-purple-500
                                            ">
                                                {employee?.department?.name}
                                            </span>
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
                                                onClick={() => navigate(`/emp/${employee?.id}`)}
                                                className="text-blue-400 hover:text-(--blue-primary) mr-4 transition-colors"
                                                title="View Employee"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => setUpdateEmp(!updateEmp)}
                                                className="text-blue-400 hover:text-(--blue-primary) mr-4 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteEmp(!deleteEmp)}
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

            <div className="flex justify-end items-center gap-4 mt-6 text-(--text-secondary)">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 border rounded-full disabled:opacity-50 cursor-pointer"
                >
                    Previous
                </button>

                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-full disabled:opacity-50 cursor-pointer"
                >
                    Next
                </button>

                {/* update employee popup */}
                {
                    updateEmp && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <EditEmployeePopup updateEmp={updateEmp} setUpdateEmp={setUpdateEmp} />
                        </div>
                    )
                }

                {/* delete employee popup */}
                {
                    deleteEmp && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <DeleteEmployeePopup deleteEmp={deleteEmp} setDeleteEmp={setDeleteEmp} />
                        </div>
                    )
                }
            </div>
        </>

    )
}

export default EmployeeRecords