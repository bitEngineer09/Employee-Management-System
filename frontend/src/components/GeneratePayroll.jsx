import { useState } from "react";
import useGeneratePayroll from "../hooks/Admin/Payroll/useGeneratePayroll";
import useRegeneratePayroll from "../hooks/Admin/Payroll/useRegeneratePayroll";
import ButtonLoader from "./Loader/ButtonLoader";

const GeneratePayroll = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [month, setMonth] = useState("");

    const {
        generatePayroll,
        generatePayrollData,
        isLoading: isGenerating,
        error: generateError,
    } = useGeneratePayroll();

    const {
        regeneratePayroll,
        isLoading: isRegenerating,
    } = useRegeneratePayroll();

    // handle generate
    const handleGenerate = () => {
        if (!employeeId || !month) {
            alert("Employee ID and Month required");
            return;
        }
        generatePayroll({ employeeId, month });
    };

    // handle regenerate
    const handleRegenerate = () => {
        const confirm = window.confirm(
            "Are you sure? This will delete existing payroll and regenerate."
        );
        if (!confirm) return;

        regeneratePayroll({ employeeId, month });
    };

    // payroll data
    const payroll = generatePayrollData?.payroll;

    // check if it is already generated
    const isAlreadyGenerated = generateError?.response?.data?.message === "Payroll already generated for this month";

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-(--text-secondary)">
                Generate / Regenerate Payroll
            </h1>

            <div className="flex gap-4 mb-6">
                <input
                    type="number"
                    placeholder="Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="
                    border border-gray-600
                    bg-gray-700
                    text-(--text-secondary)
                    placeholder-gray-400 p-3
                    rounded-lg w-full 
                    focus:outline-none focus:ring-2 
                    focus:ring-green-500
                "/>

                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="
                    border border-gray-600
                    bg-gray-700 text-(--text-secondary)
                    p-3 rounded-lg w-full
                    focus:outline-none focus:ring-2
                    focus:ring-green-500
                "/>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || isRegenerating}
                    className="
                    bg-green-600
                    hover:bg-green-700
                    text-white px-6 py-3
                    rounded-lg font-semibold 
                    transition-colors whitespace-nowrap 
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                ">
                    {isGenerating ? <ButtonLoader /> : "Generate"}
                </button>

                {/* Regenerate Button only when already exists */}
                {isAlreadyGenerated && (
                    <button
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                        className="
                        bg-red-600 hover:bg-red-700
                        text-white px-6 py-3
                        rounded-lg font-semibold 
                        transition-colors whitespace-nowrap
                        disabled:opacity-50 
                        disabled:cursor-not-allowed
                    ">
                        {isRegenerating ? <ButtonLoader /> : "Regenerate"}
                    </button>
                )}
            </div>

            {/* Error */}
            {generateError && !isAlreadyGenerated && (
                <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg mb-6">
                    {generateError?.response?.data?.message || "Something went wrong"}
                </div>
            )}

            {/* Payroll Card */}
            {payroll && (
                <div className="border border-gray-700 p-6 rounded-lg bg-gray-800 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                        <span className="text-green-400 font-bold text-lg">
                            Payroll Generated!
                        </span>
                    </div>

                    <PayrollData header="Gross Salary:" data={payroll.grossSalary} />
                    <PayrollData header="PF Deduction:" data={payroll.pf} isDeduction />
                    <PayrollData header="Tax Deduction:" data={payroll.tax} isDeduction />

                    <div className="border-t border-gray-700 mt-3"></div>

                    <PayrollData header="Net Salary:" data={payroll.netSalary} />
                </div>
            )}
        </div>
    );
};

export default GeneratePayroll;

const PayrollData = ({ header, data, isDeduction = false }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-300 font-medium text-lg">{header}</span>
        <span
            className={`font-semibold text-xl ${isDeduction ? "text-red-400" : "text-green-400"
                }`}
        >
            {isDeduction ? "- " : ""}
            ₹{data}
        </span>
    </div>
);
