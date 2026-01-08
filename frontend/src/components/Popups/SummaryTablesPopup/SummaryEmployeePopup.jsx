import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import EmployeeRecords from "../../EmployeeRecords";

const TITLE = {
    TOTAL: "Total Employees",
    ACTIVE: "Active Employees",
    INACTIVE: "Inactive Employees",
    PRESENT: "PRESENT EMPLOYEES",
    ABSENT: "Absent Employees",
};
const ITEMS_PER_PAGE = 6;
const SummaryEmployeePopup = ({ type, employees, onClose }) => {
    console.log(employees);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredEmployees = useMemo(() => {
        if (!employees || employees.length === 0) return [];

        switch (type) {
            case "ACTIVE":
                return employees.filter(emp => emp?.isActive === true);

            case "INACTIVE":
                return employees.filter(emp => emp?.isActive === false);

            case "PRESENT":
                return employees.filter(emp =>
                    emp.attendances[0]?.status === "PRESENT"
                );

            case "ABSENT":
                return employees.filter(emp =>
                    emp.attendances[0]?.status === "ABSENT"
                );

            case "TOTAL":
            default:
                return employees;
        }
    }, [type, employees]);

    const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);

    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredEmployees.slice(startIndex, endIndex);
    }, [filteredEmployees, currentPage]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-[90%] max-w-6xl rounded-2xl p-6 relative">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-(--text-secondary) mb-4">
                        {TITLE[type]}
                    </h2>
                    {/* Cross Button */}
                    <button
                        onClick={onClose}
                        className="text-(--text-secondary) hover:text-red-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {
                    filteredEmployees.length === 0 ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center text-(--text-tertiary)">
                            <p className="text-xl font-medium">No records found</p>
                            <p className="text-sm mt-2">Try changing the filter or criteria</p>
                        </div>
                    ) : (
                        <EmployeeRecords
                            employees={paginatedEmployees}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default SummaryEmployeePopup;
