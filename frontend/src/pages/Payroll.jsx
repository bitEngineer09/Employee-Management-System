import { useState } from "react";
import { AlertCircle, IndianRupee } from "lucide-react";
import useGetPayroll from "../hooks/Admin/Payroll/useGetPayroll";
import useGeneratePayroll from "../hooks/Admin/Payroll/useGeneratePayroll";
import useRegeneratePayroll from "../hooks/Admin/Payroll/useRegeneratePayroll";
import ButtonLoader from "../components/Loader/ButtonLoader";

const Payroll = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [month, setMonth] = useState("");

    // Preview hook
    const {
        getPayroll,
        isLoading: isPreviewLoading,
        error: previewError,
        fetchPayroll
    } = useGetPayroll(employeeId, month);

    // Generate hook
    const {
        generatePayroll,
        generatePayrollData,
        isLoading: isGenerating,
        error: generateError,
    } = useGeneratePayroll();

    // Regenerate hook
    const {
        regeneratePayroll,
        isLoading: isRegenerating,
    } = useRegeneratePayroll();

    // handle preview
    const handlePreview = () => {
        if (!employeeId || !month) return;
        fetchPayroll();
    };

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

    // payroll from generate API
    const generatedPayroll = generatePayrollData?.payroll;

    // detect already generated payroll
    const isAlreadyGenerated =
        generateError?.response?.data?.message ===
        "Payroll already generated for this month";

    return (
        <div>
            <p className="flex items-center gap-2 text-(--text-secondary) text-3xl font-medium mb-5">
                <div
                    className="
                    w-11 h-11 
                    text-(--blue-light)
                    flex items-center justify-center 
                    bg-(--blue-primary)/20 rounded-xl
                    border border-(--blue-primary)
                    ">
                    <IndianRupee size={24} />
                </div>
                Payroll
            </p>

            {/* preview section */}
            <div className="mb-8">
                <div className="text-gray-400 mb-4">
                    <h1 className="text-2xl font-bold mb-1 text-gray-100">Payroll Preview</h1>
                    <p>Enter Employee ID and month to preview payroll</p>
                </div>

                {
                    previewError && (
                        <div
                            className="
                            bg-red-900/20 
                            border border-red-700
                            text-red-400 p-4
                            rounded-lg mb-4 
                            flex items-center gap-2
                        ">
                            <AlertCircle />
                            <span>{previewError?.response?.data?.message || "Error fetching payroll"}</span>
                        </div>
                    )
                }

                <div className="flex items-end gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="text-gray-400 mb-2 font-medium">Employee ID</label>
                        <input
                            type="number"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="
                            border border-gray-600
                            bg-slate-800 text-gray-100
                            p-3 rounded-lg
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500
                        "/>
                    </div>

                    <div className="flex flex-col flex-1">
                        <label className="text-gray-400 mb-2 font-medium">Month</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="
                            border border-gray-600
                            bg-slate-800 text-gray-100
                            p-3 rounded-lg focus:outline-none
                            focus:ring-2 focus:ring-blue-500
                        "/>
                    </div>

                    <button
                        onClick={handlePreview}
                        disabled={!employeeId || !month || isPreviewLoading}
                        className="
                        bg-blue-600 hover:bg-blue-700
                        text-white px-6 py-3
                        rounded-lg font-semibold 
                        disabled:opacity-50
                    ">
                        {isPreviewLoading ? <ButtonLoader /> : "Preview"}
                    </button>
                </div>
            </div>

            {/* preview data */}
            {getPayroll && (
                <div className="border border-gray-700 p-6 rounded-lg bg-slate-800 mb-10 space-y-3">
                    <PayrollRow label="Employee" value={getPayroll?.employee?.name} />
                    <PayrollRow label="Month" value={getPayroll?.month} />
                    <PayrollRow label="Total Working Days" value={getPayroll?.payRoll?.totalWorkingDays} />
                    <PayrollRow label="Payable Days" value={getPayroll?.payRoll?.payableDays} />
                    <div className="border-t border-gray-700"></div>
                    <PayrollRow label="Gross Salary" value={`₹${getPayroll?.payRoll?.grossSalary}`} />
                </div>
            )}

            {/* generate / regenerate section*/}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4 text-gray-100">Generate / Regenerate Payroll</h1>

                <div className="flex gap-4">
                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || isRegenerating}
                        className="
                        bg-green-600 hover:bg-green-700
                        text-white px-6 py-3 rounded-lg
                        font-semibold disabled:opacity-50
                        disabled:cursor-not-allowed
                    ">
                        {isGenerating ? <ButtonLoader /> : "Generate"}
                    </button>

                    {/* Regenerate Button */}
                    {isAlreadyGenerated && (
                        <button
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="
                            bg-red-600 hover:bg-red-700
                            text-white px-6 py-3
                            rounded-lg font-semibold 
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ">
                            {isRegenerating ? <ButtonLoader /> : "Regenerate"}
                        </button>
                    )}
                </div>

                {/* Generate Error (except already generated) */}
                {generateError && !isAlreadyGenerated && (
                    <div
                        className="
                        bg-red-900/20 border 
                        border-red-700 text-red-400
                        p-4 rounded-lg mt-4
                    ">
                        {generateError?.response?.data?.message || "Something went wrong"}
                    </div>
                )}
            </div>

            {/* generate payroll card */}
            {generatedPayroll && (
                <div className="border border-gray-700 p-6 rounded-lg bg-gray-800 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                        <span className="text-green-400 font-bold text-lg">
                            Payroll Generated!
                        </span>
                    </div>

                    <PayrollAmount label="Gross Salary" value={generatedPayroll?.grossSalary} />
                    <PayrollAmount label="PF Deduction" value={generatedPayroll?.pf} isDeduction />
                    <PayrollAmount label="Tax Deduction" value={generatedPayroll?.tax} isDeduction />
                    <div className="border-t border-gray-700 mt-3"></div>
                    <PayrollAmount label="Net Salary" value={generatedPayroll?.netSalary} />
                </div>
            )}
        </div>
    );
};

export default Payroll;

const PayrollRow = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-gray-100 font-semibold">{value}</span>
    </div>
);

const PayrollAmount = ({ label, value, isDeduction = false }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-300 font-medium text-lg">{label}</span>
        <span
            className={`font-semibold text-xl ${isDeduction ? "text-red-400" : "text-green-400"
                }`}
        >
            {isDeduction ? "- " : ""}
            ₹{value}
        </span>
    </div>
);
