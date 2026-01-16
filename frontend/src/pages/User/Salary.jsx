import React, { useState } from 'react';
import useGetPaySlip from '../../hooks/User/Payslip/useGetPaySlip';
import useGeneratePayslipPdf from '../../hooks/User/Payslip/useGeneratePayslipPdf';
import { AlertCircle, Download, Eye, IndianRupee } from "lucide-react";
import ButtonLoader from '../../components/Loader/ButtonLoader';

const Salary = () => {
  const [month, setMonth] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const { payslip, isLoading, error } = useGetPaySlip(month);
  const { downloadPayslip, isLoading: isDownloading } = useGeneratePayslipPdf();

  // handle payslip preview
  const handlePreview = () => {
    if (!payslip) return;
    console.log(payslip)
    setShowPreview(true);
  };

  // handle pdf download
  const handleDownload = () => {
    if (!month || !payslip) return;
    downloadPayslip(month);
  };

  return (
    <div>
      {/* header */}
      <h1 className="flex items-center gap-2 text-3xl font-bold mb-6 text-(--text-secondary)">
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
        My Payslip
      </h1>

      {/* Month Selector */}
      <div className="flex items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-gray-400 mb-2 font-medium">Select Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setShowPreview(false);
            }}
            className="border border-gray-600 bg-slate-800 text-gray-100 p-3 scheme-dark rounded-lg"
          />
        </div>

        {/* Preview Button */}
        <button
          onClick={handlePreview}
          disabled={!month || isLoading}
          className="
            flex items-center gap-2
            bg-indigo-600 hover:bg-indigo-700
            text-white px-6 py-3 rounded-lg font-semibold
            transition-all duration-300 ease-in-out
            hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            ">
          <Eye size={18} />
          Preview
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!month || !payslip || isDownloading}
          className="
            flex items-center gap-2
            bg-blue-600 hover:bg-blue-700
            text-white px-6 py-3 rounded-lg font-semibold
            transition-all duration-300 ease-in-out
            hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            ">
          {isDownloading ? <ButtonLoader /> : <Download size={18} />}
          Download
        </button>
      </div>

      {/* Loading */}
      {
        isLoading && month && (
          <p className="text-gray-400 mb-4">Loading payslip...</p>
        )
      }

      {/* Error */}
      {
        error && month && (
          <div
            className="
            bg-red-900/20
            border border-red-700 
            text-red-400 p-4 rounded-lg mb-6
            flex gap-2
          ">
            <AlertCircle />{error?.response?.data?.message || "Payslip not available"}
          </div>
        )
      }

      {/* Preview Section */}
      {
        showPreview && payslip && (
          <div
            className="
            border border-gray-700
            p-5 rounded-lg
            bg-gray-800 space-y-4
            max-w-3xl transition-all
            duration-300 ease-in-out
          ">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <div>
                <p className="text-lg font-bold text-gray-100">
                  {payslip?.employee?.name}
                </p>
                <p className="text-sm text-gray-400">
                  {payslip?.employee?.designation || "-"} •{" "}
                  {payslip?.employee?.department?.name || "-"}
                </p>

              </div>
              <span className="text-gray-400 font-medium">
                {payslip?.month}
              </span>
            </div>

            {/* Work Info */}
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Total Working Days" value={payslip?.totalWorkingDays} />
              <InfoRow label="Payable Days" value={payslip?.payableDays} />
            </div>

            <div className="border-t border-gray-700 my-3"></div>

            {/* Earnings */}
            <SectionTitle title="Earnings" />
            <AmountRow label="Gross Salary" value={payslip?.earnings?.gross} />

            {/* Deductions */}
            <SectionTitle title="Deductions" />
            <AmountRow label="PF" value={payslip?.deductions?.pf} isDeduction />
            <AmountRow label="Tax" value={payslip?.deductions?.tax} isDeduction />

            <div className="border-t border-gray-700 my-3"></div>

            {/* Net */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-200">Net Salary</span>
              <span className="text-2xl font-bold text-green-400">
                ₹{payslip?.netSalary}
              </span>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Salary;

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}</span>
    <span className="text-gray-100 font-semibold">{value}</span>
  </div>
);

const AmountRow = ({ label, value, isDeduction = false }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-300">{label}</span>
    <span className={`font-semibold ${isDeduction ? "text-red-400" : "text-green-400"}`}>
      {isDeduction ? "- " : ""}₹{value}
    </span>
  </div>
);

const SectionTitle = ({ title }) => (
  <p className="text-gray-400 font-semibold uppercase tracking-wide text-sm">
    {title}
  </p>
);