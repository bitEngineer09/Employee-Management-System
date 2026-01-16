import React, { useState } from "react";
import useGetAllLeaves from "../hooks/Admin/Leave/useGetAllLeaves";
import useApproveRejectLeave from "../hooks/Admin/Leave/useApproveRejectLeave";
import { Check, X, Eye } from "lucide-react";
import Remove from "../components/Popups/Remove";
import { useNavigate } from "react-router-dom";

const LeaveAdmin = () => {
    const { leaves, isLoading } = useGetAllLeaves();
    // console.log(leaves)
    const { approveRejectLeave, isLoading: actionLoading } = useApproveRejectLeave();

    const [modalOpen, setModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // "APPROVED" | "REJECTED"
    const [selectedLeaveId, setSelectedLeaveId] = useState(null);

    const navigate = useNavigate();

    const openModal = (leaveId, type) => {
        setSelectedLeaveId(leaveId);
        setActionType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedLeaveId(null);
        setActionType(null);
    };

    const handleConfirm = () => {
        approveRejectLeave(
            {
                id: selectedLeaveId,
                status: actionType,
            },
            {
                onSuccess: () => {
                    closeModal();
                },
            }
        );
    };

    if (isLoading) {
        return <div className="p-6 text-gray-400">Loading leaves...</div>;
    }

    if (!leaves || leaves?.leaves?.length === 0) {
        return <div className="p-6 text-gray-400">No leave requests found.</div>;
    }

    return (
        <div className="text-gray-100">
            <h1 className="text-2xl font-semibold mb-4 text-(--text-primary)">Leave Requests</h1>

            {/* Leave table */}
            <div className="overflow-x-auto bg-modal-gradient rounded-lg shadow-lg">
                <table className="min-w-full text-sm">

                    {/* table header */}
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-300">Employee</th>
                            <th className="px-4 py-3 text-left text-gray-300">Employee ID</th>
                            <th className="px-4 py-3 text-left text-gray-300">From</th>
                            <th className="px-4 py-3 text-left text-gray-300">To</th>
                            <th className="px-4 py-3 text-left text-gray-300">Type</th>
                            <th className="px-4 py-3 text-left text-gray-300">Reason</th>
                            <th className="px-4 py-3 text-left text-gray-300">Status</th>
                            <th className="px-4 py-3 text-left text-gray-300">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            leaves.leaves.map((leave) => (
                                <tr
                                    key={leave?.id}
                                    className="border-b border-gray-700 hover:bg-gray-700"
                                >
                                    {/* 👁 Eye Icon + Name */}
                                    <td className="px-4 py-3 text-gray-200">
                                        <div className="flex items-center gap-2 group">
                                            <button
                                                onClick={() => {
                                                    navigate(`/admin/emp/${leave?.employeeId}`);
                                                }}
                                                title="View Employee Details"
                                                className="
                                                text-blue-400 opacity-70
                                                cursor-pointer 
                                                group-hover:opacity-100
                                                hover:text-blue-600 transition-all
                                                ">
                                                <Eye size={16} />
                                            </button>

                                            {/* employee name */}
                                            <span className="group-hover:underline ">
                                                {leave?.employee?.name || "—"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* employee id */}
                                    <td className="px-4 py-3 text-gray-200">
                                        {leave?.employee?.employeeId || "—"}
                                    </td>

                                    {/* from date */}
                                    <td className="px-4 py-3 text-gray-200">
                                        {leave?.fromDate
                                            ? new Date(leave.fromDate).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    {/* to date */}
                                    <td className="px-4 py-3 text-gray-200">
                                        {leave?.toDate
                                            ? new Date(leave.toDate).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    {/* leave type */}
                                    <td className="px-4 py-3 capitalize text-gray-200">
                                        {leave?.type || "—"}
                                    </td>

                                    {/* leave reason */}
                                    <td className="px-4 py-3 text-gray-200">
                                        {leave?.reason || <span className="text-gray-500">—</span>}
                                    </td>

                                    {/* leave status */}
                                    <td className="px-4 py-3">
                                        <StatusBadge status={leave?.status} />
                                    </td>

                                    {/* actions button (approve / reject) */}
                                    <td className="px-4 py-3">
                                        {
                                            leave.status === "PENDING" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => openModal(leave?.id, "APPROVED")}
                                                        className="
                                                        px-3 py-1 text-xs
                                                        rounded bg-green-600
                                                        text-(--text-primary) hover:bg-green-700
                                                        disabled:opacity-50 transition-colors
                                                        ">
                                                        Approve
                                                    </button>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => openModal(leave?.id, "REJECTED")}
                                                        className="
                                                        px-3 py-1 text-xs
                                                        rounded bg-red-600
                                                        text-(--text-primary) hover:bg-red-700
                                                        disabled:opacity-50 transition-colors
                                                        ">
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 text-xs">No Action</span>
                                            )
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {
                modalOpen && (
                    <div
                        className="
                    fixed inset-0 z-50
                    flex items-center justify-center 
                    bg-black/50 backdrop-blur-sm
                ">
                        <Remove
                            state={modalOpen}
                            setState={closeModal}
                            method={handleConfirm}
                            isLoading={actionLoading}
                            icon={actionType === "APPROVED" ? <Check /> : <X />}
                            header={actionType === "APPROVED" ? "Approve Leave" : "Reject Leave"}
                            subHeader={
                                actionType === "APPROVED"
                                    ? "Are you sure you want to approve this leave?"
                                    : "Are you sure you want to reject this leave?"
                            }
                        />
                    </div>
                )
            }
        </div>
    );
};

export default LeaveAdmin;

const StatusBadge = ({ status }) => {
    const base = "px-2 py-1 rounded text-xs font-medium";

    if (status === "APPROVED") {
        return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
    }

    if (status === "REJECTED") {
        return <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>;
    }

    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
};
