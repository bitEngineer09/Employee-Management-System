import React from 'react'
import { Mail, Phone, Edit2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const tableHeader = [
    { name: "Employee" },
    { name: "Contact" },
    { name: "Designation" },
    { name: "Status" },
    { name: "Joined On" },
    { name: "Action" },
];

const DepartmentEmployeeTable = ({ employees, currentPage, setCurrentPage, totalPages }) => {
    // console.log(employees)
    const navigate = useNavigate();

    return (
        <div className='mt-4 overflow-x-auto custom-scrollbar'>
            <table className='w-full border border-(--border-primary) border-collapse'>
                <thead className="bg-blue-700/20 border-b border-(--border-primary) sticky top-0 z-10">
                    <tr>
                        {tableHeader.map((header) => (
                            <th
                                key={header.name}
                                className="
                                    px-6 py-3
                                    text-left text-xs
                                    font-medium text-(--text-secondary)
                                    uppercase tracking-wider
                                "
                            >
                                {header.name}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-black">
                    {employees?.map((emp) => (
                        <tr
                            key={emp.id}
                            className="
                                transition-colors
                                text-(--text-secondary)
                                border-b border-(--border-primary)
                                hover:bg-(--border-subtle)
                            ">
                            {/* Employee */}
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
                                        {emp?.name?.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-white">{emp?.name}</div>
                                        <div className="text-sm text-(--text-tertiary)">
                                            ID: {emp?.id}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* Contact */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center text-sm text-(--text-secondary)">
                                        <Mail size={14} className="mr-2 text-(--text-disabled)" />
                                        {emp?.email || "N/A"}
                                    </div>
                                    <div className="flex items-center text-sm text-(--text-secondary)">
                                        <Phone size={14} className="mr-2 text-(--text-disabled)" />
                                        {emp?.phone}
                                    </div>
                                </div>
                            </td>

                            {/* Designation */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-(--text-secondary)">
                                    {emp?.designation || "—"}
                                </div>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`
                                        px-3 py-1
                                        inline-flex
                                        text-xs leading-5
                                        font-semibold rounded-full
                                        ${emp?.isActive
                                            ? 'bg-green-950 text-green-300 border border-green-800'
                                            : 'bg-red-950 text-red-300 border border-red-800'
                                        }
                                    `}
                                >
                                    {emp?.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>

                            {/* Joined On */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-(--text-secondary)">
                                {emp?.joinedOn?.split("T")[0]}
                            </td>

                            {/* Action */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => navigate(`/emp/${emp?.id}`)}
                                    className="text-blue-400 hover:text-(--blue-primary) mr-4 transition-colors"
                                    title="View Employee"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    className="text-green-400 hover:text-green-500 transition-colors"
                                    title="Edit Employee"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
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
            </div>
        </div>
    )
}

export default DepartmentEmployeeTable
