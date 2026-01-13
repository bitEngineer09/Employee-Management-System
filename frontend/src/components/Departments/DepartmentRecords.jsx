import React, { useState } from 'react'
import { Users, User, Eye, Edit2, Trash2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditDepartmentPopup from '../Popups/EditDepartmentPopup';
import Remove from '../Popups/Remove';
import useDeleteDepartment from '../../hooks/Admin/Department/useDeleteDepartment';

// table header data
const tableHeader = [
    { name: "Department" },
    { name: "Department Head" },
    { name: "Employees" },
    { name: "Active" },
    { name: "Created On" },
    { name: "Action" },
];

const DepartmentRecords = ({ departments, currentPage, setCurrentPage, totalPages }) => {
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [updateDept, setUpdateDept] = useState(false);
    const [deleteDept, setDeleteDept] = useState(false);

    const navigate = useNavigate();

    const { deactiveDepartment, isLoading } = useDeleteDepartment();

    return (
        <div className='mt-8 overflow-x-auto custom-scrollbar'>
            <table className='w-full border border-(--border-primary) border-collapse'>
                <thead className="bg-purple-700/20 border-b border-(--border-primary) sticky top-0 z-10">
                    <tr>
                        {
                            tableHeader.map((header) =>
                                <th
                                    key={header.name}
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
                        departments?.map((dept) => {
                            return (
                                <tr
                                    key={dept.id}
                                    className="
                                        transition-colors
                                        text-(--text-secondary)
                                        border-b border-(--border-primary)
                                        hover:bg-(--border-subtle)
                                    "
                                >
                                    {/* Department Name */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div
                                                className="
                                                    h-10 w-10
                                                    bg-purple-800
                                                    rounded-full 
                                                    flex items-center justify-center
                                                    font-semibold text-white
                                                ">
                                                {dept?.name?.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{dept?.name}</div>
                                                <div className="text-sm text-(--text-tertiary)">ID: {dept?.id}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Department Head */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-(--text-disabled)" />
                                            <div className="flex flex-col">
                                                <span className="text-sm text-white">{dept?.head?.name || "Not Assigned"}</span>
                                                <span className="text-xs text-(--text-tertiary)">{dept?.head?.email}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Total Employees */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-(--text-disabled)" />
                                            <span className="text-sm text-(--text-secondary)">
                                                {dept?.totalEmployees}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Active Department*/}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`
                                               px-3 py-1
                                               inline-flex
                                               text-xs leading-5
                                               font-semibold
                                               rounded-full
                                               bg-green-950 text-green-300
                                               border
                                               ${dept?.isActive === true
                                                    ? 'bg-green-950 text-green-300 border border-green-800'
                                                    : 'bg-red-950 text-red-300 border border-red-800'
                                                }
                                            `}>
                                            {dept?.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Created On */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-(--text-secondary)">
                                        {dept?.createdAt?.split("T")[0]}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => navigate(`/admin/department/${dept.id}`)}
                                            className="text-blue-400 hover:text-(--blue-primary) mr-4 transition-colors"
                                            title="View Department"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedDepartment(dept);
                                                setUpdateDept(true)
                                            }}
                                            className="text-green-400 hover:text-green-500 mr-4 transition-colors"
                                            title="Edit Department"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteDept(!deleteDept)}
                                            className="text-red-400 hover:text-red-500 transition-colors"
                                            title="Delete Department"
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

            {/* update department popup */}
            {
                updateDept && selectedDepartment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <EditDepartmentPopup department={selectedDepartment} setUpdateDept={setUpdateDept} />
                    </div>
                )
            }

            {/* Delete department popup */}
            {
                deleteDept && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Remove
                            s
                            setState={setDeleteDept}
                            method={deactiveDepartment}
                            isLoading={isLoading}
                            icon={<Home />}
                            header={"Remove Department"}
                            subHeader={"Are you sure you want to remove this department ?"}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default DepartmentRecords;
