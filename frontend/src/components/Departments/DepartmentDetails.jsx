import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Users, User } from 'lucide-react'
import useGetDepartmentById from '../../hooks/Admin/Department/useGetDepartmentById'
import PageLoader from '../Loader/PageLoader'
import DepartmentEmployeeTable from './DepartmentEmployeeTable'
import DepartmentDetailsStatsCard from './DepartmentDetailsStatsCard'


const ITEMS_PER_PAGE = 6;

const DepartmentDetail = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const { id } = useParams()
    const { departmentDetail, loading } = useGetDepartmentById(id);
    const department = departmentDetail?.department;
    const employees = department?.employees;
    // console.log(employees);

    // Pagination
    const totalPages = Math.ceil(employees?.length / ITEMS_PER_PAGE);
    const pagintedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return employees?.slice(startIndex, endIndex);
    }, [employees, currentPage]);

    if (loading) return <PageLoader />

    return (
        <div className="space-y-8">

            {/* Header Section */}
            <div className="bg-(--border-subtle) p-6 rounded-2xl border border-(--border-primary)">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-white tracking-wide">{department?.name}</h1>
                        <p className="text-(--text-tertiary) mt-2">Department Created on {department?.createdAt?.split("T")[0]}</p>
                    </div>

                    <div className="flex gap-6">
                        <div className="bg-blue-700/10 p-4 rounded-xl border-2 border-blue-800">
                            <p className="text-blue-500 text-sm">Total Employees</p>
                            <p className="text-2xl text-blue-500 font-semibold mt-1">{department?.totalEmployees}</p>
                        </div>
                        <div className="bg-emerald-700/10 p-4 rounded-xl border-2 border-emerald-800">
                            <p className="text-emerald-500 text-sm">Active Employees</p>
                            <p className="text-2xl text-emerald-500 font-semibold mt-1">{department?.activeEmployees}</p>
                        </div>
                        <div className="bg-orange-700/10 p-4 rounded-xl border-2 border-orange-800">
                            <p className="text-orange-500 text-sm">Inactive Employees</p>
                            <p className="text-2xl text-orange-500 font-semibold mt-1">{department?.inactiveEmployees}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Head Info */}
            <div className="bg-(--border-subtle) p-6 rounded-2xl border border-(--border-primary)">
                <h2 className="text-xl text-white mb-4 flex items-center gap-2">
                    <User size={20} /> Department Head
                </h2>
                <p className="text-white">{department?.head?.name || "Not Assigned"}</p>
                <p className="text-(--text-tertiary)">{department?.head?.email}</p>
            </div>

            {/* Attendance Snapshot */}
            <DepartmentDetailsStatsCard department={department} />

            {/* Employees Table */}
            <h2 className="text-xl text-white mb-4 flex items-center gap-2">
                <Users size={20} /> Employees
            </h2>

            {/* Department employee table */}
            <DepartmentEmployeeTable
                employees={pagintedEmployees}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />

        </div>
    )
}

export default DepartmentDetail;

