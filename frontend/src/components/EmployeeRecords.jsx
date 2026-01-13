import React, { useState } from 'react'
import EditEmployeePopup from './Popups/EditEmployeePopup';
import Remove from './Popups/Remove';
import { useNavigate } from 'react-router-dom';
import useDeactivateEmployee from '../hooks/Admin/useDeactivateEmployee';
import usePermanentDeleteEmployee from '../hooks/Admin/usePremanentDeleteEmployee';

// icons
import { Mail, Phone, Edit2, Trash2, Eye, User, Ban } from 'lucide-react';

// table header data
const tableHeader = [
    { name: "Employee" },
    { name: "Contact" },
    { name: "Designation" },
    { name: "Department" },
    { name: "Status" },
    { name: "Action" },
];

const EmployeeRecords = ({
    employees,
    currentPage,
    setCurrentPage,
    totalPages
}) => {

    const navigate = useNavigate();

    const [updateEmp, setUpdateEmp] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [actionType, setActionType] = useState(null);

    // hooks
    const { deactivateEmployee, isLoading: deactivating } = useDeactivateEmployee();
    const { permanentDeleteEmployee, isLoading: deleting } = usePermanentDeleteEmployee();


    return (
        <>
            <div className='mt-8 overflow-x-auto custom-scrollbar'>
                <table className='w-full border border-(--border-primary) border-collapse'>

                    {/* table header */}
                    <thead
                        className="
                        bg-blue-700/20
                        -b border-(--border-primary)
                        sticky top-0 z-10
                    ">
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

                    {/* table body data */}
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
                                        {/* name & joined at */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div
                                                    className="
                                                    h-10 w-10
                                                    bg-(--blue-primary)
                                                    rounded-full 
                                                    flex items-center justify-center
                                                    font-semibold text-(--text-primary)
                                                ">
                                                    {employee?.name?.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-(--text-primary)">
                                                        {employee?.name}
                                                    </div>
                                                    <div className="text-sm text-(--text-tertiary)">
                                                        Joined {employee?.createdAt?.split("T")[0]}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* employee contact */}
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

                                        {/* designation */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-(--text-secondary)">{employee?.designation}</div>
                                        </td>

                                        {/* employee department name */}
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

                                        {/* active / inactive */}
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

                                        {/* action buttons */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => navigate(`/admin/emp/${employee?.id}`)}
                                                className="text-blue-400 hover:text-(--blue-primary) mr-4 transition-colors"
                                                title="View Employee"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => { () => setUpdateEmp(true) }}
                                                className="text-blue-400 hover:text-(--blue-primary) mr-4 transition-colors"
                                                title='Edit employee'
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedEmployee(employee);
                                                    setActionType("OPTIONS");
                                                }}
                                                className="text-red-400 hover:text-red-500 transition-colors"
                                                title="Manage Employee"
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

            {/* Pagination controls */}
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

            {/* update employee popup */}
            {
                updateEmp && (
                    <div
                        className="
                        fixed inset-0 z-50
                        flex items-center justify-center 
                        bg-black/50 backdrop-blur-sm
                    ">
                        <EditEmployeePopup employee={selectedEmployee} setUpdateEmp={setUpdateEmp} />
                    </div>
                )
            }

            {/* Manage employee popup (acitvate / deactivate ) */}
            {
                actionType === "OPTIONS" && selectedEmployee && (
                    <div
                        className="
                        fixed inset-0 z-50
                        flex items-center justify-center
                        bg-black/60 backdrop-blur-sm
                    ">
                        <div className="bg-[#0B0B0B] border border-(--border-primary) rounded-xl p-6 w-95">

                            <h2 className="text-lg flex justify-between font-semibold text-(--text-primary) mb-2">
                                Manage Employee <p>ID: {selectedEmployee?.id}</p>
                            </h2>
                            <p className="text-sm text-(--text-tertiary) mb-4">
                                {selectedEmployee.name} ({selectedEmployee.email})
                            </p>

                            <div className="flex flex-col gap-3">

                                {/* Deactivate */}
                                <button
                                    onClick={() => setActionType("DEACTIVATE")}
                                    className="
                                    w-full px-4 py-2
                                    flex gap-2 justify-center items-center
                                    rounded-lg bg-yellow-900/30
                                    border border-yellow-700
                                    text-yellow-300 
                                    hover:bg-yellow-900/50 transition
                                ">
                                    Deactivate Employee <Ban size={18} />
                                </button>

                                {/* Permanent Delete */}
                                <button
                                    onClick={() => setActionType("DELETE")}
                                    className="
                                    w-full px-4 py-2
                                    flex gap-2 justify-center items-center
                                    rounded-lg bg-red-900/30
                                    border border-red-700
                                    text-red-300
                                    hover:bg-red-900/50 transition
                                ">
                                    Delete Permanently <Trash2 size={18} />
                                </button>

                                {/* Cancel */}
                                <button
                                    onClick={() => {
                                        setActionType(null);
                                        setSelectedEmployee(null);
                                    }}
                                    className="
                                    w-full px-4 py-2
                                    rounded-lg 
                                    border border-(--border-primary)
                                    text-(--text-secondary)
                                    hover:bg-(--border-subtle)
                                ">
                                    Cancel
                                </button>

                            </div>
                        </div>
                    </div>
                )
            }

            {/* Deactive confirmation popup */}
            {
                actionType === "DEACTIVATE" && selectedEmployee && (
                    <div
                        className="
                    fixed inset-0 z-10
                    flex items-center justify-center 
                    bg-black/60 backdrop-blur-sm
                ">
                        <Remove
                            state={true}
                            setState={() => {
                                setActionType(null);
                                setSelectedEmployee(null);
                            }}
                            method={() => deactivateEmployee(selectedEmployee.id)}
                            isLoading={deactivating}
                            icon={<Ban />}
                            header={"Deactivate Employee"}
                            subHeader={"Employee will be inactive but all data will remain safe. Continue?"}
                        />
                    </div>
                )
            }

            {/* Permanent Delete confirmation popup */}
            {
                actionType === "DELETE" && selectedEmployee && (
                    <div
                        className="
                    fixed inset-0 z-10
                    flex items-center justify-center
                    bg-black/60 backdrop-blur-sm
                ">
                        <Remove
                            state={true}
                            setState={() => {
                                setActionType(null);
                                setSelectedEmployee(null);
                            }}
                            method={() => permanentDeleteEmployee(selectedEmployee.id)}
                            isLoading={deleting}
                            icon={<Trash2 />}
                            header={"Delete Employee Permanently"}
                            subHeader={"This will remove employee and all related data. This action cannot be undone!"}
                        />
                    </div>
                )
            }

        </>

    )
};

export default EmployeeRecords;