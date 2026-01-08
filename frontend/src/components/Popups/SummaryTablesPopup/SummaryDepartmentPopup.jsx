import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import DepartmentRecords from "../../Departments/DepartmentRecords";

const TITLE = {
    TOTAL: "Total Departments",
    ACTIVE: "Active Departments",
    INACTIVE: "Inactive Departments",
};

const ITEMS_PER_PAGE = 6;

const SummaryDepartmentPopup = ({ type, departments, onClose }) => {

    const [currentPage, setCurrentPage] = useState(1);
    // console.log(departments)
    // console.log(type)
    
    const filteredDepartments = useMemo(() => {
        if (!departments || departments.length === 0) return [];

        switch (type) {
            case "ACTIVE":
                return departments.filter(dept => dept?.isActive === true);

            case "INACTIVE":
                return departments.filter(dept => dept?.isActive === false);

            case "TOTAL":
            default:
                return departments;
        };
    }, [type, departments]);

    const totalPages = Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE);

    const paginatedDepartments = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredDepartments.slice(startIndex, endIndex);
    }, [filteredDepartments, currentPage]);

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
                    filteredDepartments.length === 0 ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center text-(--text-tertiary)">
                            <p className="text-xl font-medium">No records found</p>
                            <p className="text-sm mt-2">Try changing the filter or criteria</p>
                        </div>
                    ) : (
                        <DepartmentRecords
                            departments={paginatedDepartments}
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

export default SummaryDepartmentPopup;
