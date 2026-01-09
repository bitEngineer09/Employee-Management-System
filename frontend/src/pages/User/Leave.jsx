import { useState } from "react";
import useApplyLeave from "../../hooks/User/Leave/useApplyLeave";
import useGetLeaveBalance from "../../hooks/User/Leave/useGetLeaveBalance";
import useGetActiveLeave from "../../hooks/User/Leave/useGetActiveLeave";
import { CheckCheck } from "lucide-react";
import ButtonLoader from "../../components/Loader/ButtonLoader";

const Leave = () => {
  const { applyLeave, isLoading: applying } = useApplyLeave();
  const { getLeaveBalance, isLoading: balanceLoading } = useGetLeaveBalance();
  const { getActiveLeave } = useGetActiveLeave();
  const leaves = getActiveLeave?.leaves
  console.log(leaves);

  const [formData, setFormData] = useState({
    type: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    if (!formData.type || !formData.fromDate || !formData.toDate) {
      alert("Please fill all required fields");
      return;
    }

    applyLeave(formData);
  };

  const balance = getLeaveBalance?.balance;

  return (
    <div>

      {/* header */}
      <h1 className='flex items-center gap-2 text-(--text-secondary) text-3xl font-medium'>
        Leave <CheckCheck size={28} strokeWidth={2} />
      </h1>

      <div className="mt-3">
        {/* Leave Balance */}
        <div className="text-(--text-secondary)">
          {
            balanceLoading
              ? <p className="text-gray-500">Loading Your Balances...</p>
              : <div className="grid grid-cols-2 gap-3 text-lg">
                <LeaveBalance leaveType={"Casual Left"} balance={balance?.casualLeft ?? 0} hover={"hover:border-blue-700"} bgColor={"bg-blue-700/20"} />
                <LeaveBalance leaveType={"Sick Left"} balance={balance?.sickLeft ?? 0} hover={"hover:border-amber-700"} bgColor={"bg-amber-700/20"} />
                <LeaveBalance leaveType={"Paid Left"} balance={balance?.paidLeft ?? 0} hover={"hover:border-emerald-700"} bgColor={"bg-emerald-700/20"} />
                <LeaveBalance leaveType={"Unpaid Left"} balance={"Unlimited"} hover={"hover:border-red-700"} bgColor={"bg-red-700/20"} />
              </div>
          }
        </div>

        {/* Apply Leave Form */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <h2 className="text-xl text-(--text-secondary) font-semibold mb-4">Apply Leave</h2>
            <div className="bg-(--text-secondary) rounded-2xl mt-2 p-6">

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Leave Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">Leave Type</label>
                  <select
                    name="type"
                    id="type"
                    value={formData?.type}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="CASUAL">Casual</option>
                    <option value="SICK">Sick</option>
                    <option value="PAID">Paid</option>
                    <option value="UNPAID">Unpaid</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="from" className="block text-sm font-medium mb-1">From Date</label>
                    <input
                      type="date"
                      id="from"
                      name="fromDate"
                      value={formData?.fromDate}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="to" className="block text-sm font-medium mb-1">To Date</label>
                    <input
                      type="date"
                      name="toDate"
                      id="to"
                      value={formData?.toDate}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium mb-1">Reason (optional)</label>
                  <textarea
                    name="reason"
                    id="reason"
                    value={formData?.reason}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter reason for leave"
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={applying}
                    className="
                    bg-stone-900 text-(--text-secondary)
                    px-6 py-2 rounded-lg 
                    hover:bg-blue-700
                    transition 
                    disabled:opacity-50 disabled:cursor-not-allowed
                  ">
                    {applying ? <ButtonLoader /> : "Apply Leave"}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* active leaves */}
          <div>
            <h2 className="text-xl text-(--text-secondary) font-semibold mb-4">
              Your Active Leaves
            </h2>

            <div className="bg-(--text-secondary) rounded-2xl">

              {
                leaves?.length === 0 && <p className="text-gray-500 text-sm">No active leaves</p>
              }

              {
                leaves?.map(leave => (
                  <div
                    key={leave.id}
                    className="
                    border border-gray-200 rounded-xl p-4
                    flex flex-col gap-1
                    hover:shadow-sm transition
                    ">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{leave.type}{" "} LEAVE</span>

                      <span
                        className={`
                          text-sm px-4 py-2 rounded-full
                          ${leave.status === "PENDING" && "bg-amber-100 text-amber-700"}
                          ${leave.status === "APPROVED" && "bg-emerald-100 text-emerald-700"}
                          ${leave.status === "REJECTED" && "bg-red-100 text-red-700"}
                          `}>
                        {leave.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      From: {new Date(leave.fromDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      <br />
                      To:{" "}
                      {new Date(leave.toDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    {
                      leave.reason && <p className="text-sm text-gray-500 italic">"{leave.reason}"</p>
                    }

                    {
                      leave.approvedBy ? <p className="text-sm text-gray-500 italic">"{leave.approvedBy}"</p> : ""
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;

const LeaveBalance = ({ leaveType, balance, hover, bgColor }) => (
  <div
    className={`
      text-(--text-primary)
      flex justify-between 
      border-2 border-transparent
      ${hover} transition-all
      ${bgColor}
      p-3 rounded-xl
    `}>
    <span>{leaveType}</span>
    <span className="font-medium">{balance}</span>
  </div>
);