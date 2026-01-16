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
  // console.log(leaves);

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
        <div
            className="
            w-11 h-11 
            text-(--blue-light)
            flex items-center justify-center 
            bg-(--blue-primary)/20 rounded-xl
            border border-(--blue-primary)
            ">
            <CheckCheck size={24} />
          </div>
        Leave
      </h1>

      <div className="mt-3">
        {/* Leave Balance */}
        <div className="text-(--text-secondary)">
          {
            balanceLoading
              ? <p className="text-gray-500">Loading Your Balances...</p>
              : <div className="grid grid-cols-2 gap-3 text-lg">
                <LeaveBalance leaveType={"Casual Left"} balance={balance?.casualLeft ?? 0} hover={"hover:border-blue-700 hover:scale-102"} bgColor={"bg-blue-700/20"} />
                <LeaveBalance leaveType={"Sick Left"} balance={balance?.sickLeft ?? 0} hover={"hover:border-amber-700 hover:scale-102"} bgColor={"bg-amber-700/20"} />
                <LeaveBalance leaveType={"Paid Left"} balance={balance?.paidLeft ?? 0} hover={"hover:border-emerald-700 hover:scale-102"} bgColor={"bg-emerald-700/20"} />
                <LeaveBalance leaveType={"Unpaid Left"} balance={"Unlimited"} hover={"hover:border-red-700 hover:scale-102"} bgColor={"bg-red-700/20"} />
              </div>
          }
        </div>

        {/* Apply Leave Form */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <h2 className="text-xl text-white font-semibold mb-4">Apply Leave</h2>
            <div className="bg-modal-gradient rounded-2xl mt-2 p-6">

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Leave Type */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium mb-1 text-gray-300">Leave Type</label>
                  <select
                    name="type"
                    id="type"
                    value={formData?.type}
                    onChange={handleChange}
                    className="
                    w-full bg-slate-700
                    text-gray-100 border
                    border-(--border-primary)
                    rounded-lg px-3 py-2
                    focus:outline-none focus:ring-2
                    focus:ring-slate-500
                  "
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
                    <label
                      htmlFor="from"
                      className="block text-sm font-medium mb-1 text-gray-300">From Date</label>
                    <input
                      type="date"
                      id="from"
                      name="fromDate"
                      value={formData?.fromDate}
                      onChange={handleChange}
                      required
                      className="
                      w-full bg-gray-700
                      text-gray-100 border
                      border-(--border-primary)
                      rounded-lg px-3 py-2
                      focus:outline-none focus:ring-2
                      focus:ring-slate-500
                    "/>
                  </div>

                  <div>
                    <label
                      htmlFor="to"
                      className="block text-sm font-medium mb-1 text-gray-300">To Date</label>
                    <input
                      type="date"
                      name="toDate"
                      id="to"
                      value={formData?.toDate}
                      onChange={handleChange}
                      required
                      className="
                      w-full bg-gray-700
                      text-gray-100 border
                      border-(--border-primary)
                      rounded-lg px-3 py-2
                      focus:outline-none focus:ring-2
                      focus:ring-slate-500
                    "/>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium mb-1 text-gray-300">Reason (optional)</label>
                  <textarea
                    name="reason"
                    id="reason"
                    value={formData?.reason}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter reason for leave"
                    className="
                    w-full bg-gray-700 text-gray-100 
                    border border-(--border-primary) rounded-lg 
                    px-3 py-2
                     focus:outline-none focus:ring-2
                     focus:ring-slate-500 placeholder-gray-400
                    "/>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={applying}
                    className="
                    bg-blue-600 text-white
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
            <h2 className="text-xl text-white font-semibold mb-4">
              Your Active Leaves
            </h2>

            <div className="bg-modal-gradient rounded-2xl p-4 space-y-3">

              {
                leaves?.length === 0 && <p className="text-gray-400 text-md p-1">No active leaves</p>
              }

              {
                leaves?.map(leave => (
                  <div
                    key={leave?.id}
                    className="
                    border border-gray-700 rounded-xl p-4 bg-gray-750
                    flex flex-col gap-1
                    hover:bg-gray-700 hover:shadow-lg transition
                    ">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-100">{leave?.type}{" "} LEAVE</span>

                      <span
                        className={`
                          text-sm px-4 py-2 rounded-full font-medium
                          ${leave.status === "PENDING" && "bg-amber-900 text-amber-200"}
                          ${leave.status === "APPROVED" && "bg-emerald-900 text-emerald-200"}
                          ${leave.status === "REJECTED" && "bg-red-900 text-red-200"}
                          `}>
                        {leave.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400">
                      From: {new Date(leave?.fromDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      <br />
                      To:{" "}
                      {new Date(leave?.toDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    {
                      leave?.reason && <p className="text-sm text-gray-400 italic">"{leave?.reason}"</p>
                    }

                    {
                      leave?.approvedByUser && (
                        <p className="text-sm text-gray-400 italic">
                          Approved by: {leave?.approvedByUser?.name} ({leave?.approvedByUser?.designation})
                        </p>
                      )
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