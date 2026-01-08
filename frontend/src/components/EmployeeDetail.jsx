import React from 'react';
import { useParams } from 'react-router-dom';
import PageLoader from './Loader/PageLoader';
import useGetEmployeeById from '../hooks/Admin/useGetEmployeeById';

// icons
import { Mail, Phone, Briefcase, Building2, CalendarDays, IndianRupee, CheckCircle2, } from 'lucide-react';

const EmployeeDetail = () => {

    // id parameter
    const { id } = useParams();

    // employee by id
    const { employeeById, isLoading } = useGetEmployeeById(id);
    const employee = employeeById?.data;
    console.log(employee)

    if (isLoading) return <PageLoader />

    return (
        <div>
            <div className="mx-auto space-y-8">

                <div className="flex items-center justify-center bg-blue-700/20 p-8 rounded-3xl border-2 border-blue-800 ">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-(--text-primary) text-6xl">
                            {employee?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-(--text-primary) mb-2 tracking-wide">{employee?.name}</h1>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-gray-800/60 rounded-lg text-(--text-secondary) text-sm font-medium border border-gray-700/50">
                                    ID: {employee?.employeeId}
                                </span>
                                {employee?.isActive ? (
                                    <span className="px-3 py-1 bg-green-500/20 rounded-lg text-green-400 text-sm font-medium border border-green-500/30 flex items-center gap-1">
                                        <CheckCircle2 size={14} />
                                        Active
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-500/20 rounded-lg text-red-400 text-sm font-medium border border-red-500/30 flex items-center gap-1">
                                        <XCircle size={14} />
                                        Inactive
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* employee info cards  */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                        icon={<Mail size={20} />}
                        label="Email Address"
                        value={employee?.email}
                        bgColor="bg-blue-700/20"
                        iconBg="from-blue-500 to-cyan-500"
                    />
                    <InfoCard
                        icon={<Phone size={20} />}
                        label="Phone Number"
                        value={employee?.phoneNumber || "N/A"}
                        bgColor="bg-emerald-700/20"
                        iconBg="from-green-500 to-emerald-500"
                    />
                    <InfoCard
                        icon={<Briefcase size={20} />}
                        label="Designation"
                        value={employee?.designation}
                        bgColor="bg-fuchsia-700/20"
                        iconBg="from-purple-500 to-pink-500"
                    />
                    <InfoCard
                        icon={<Building2 size={20} />}
                        label="Department"
                        value={employee?.department?.name}
                        bgColor="bg-purple-700/20"
                        iconBg="from-orange-500 to-red-500"
                    />
                    <InfoCard
                        icon={<CalendarDays size={20} />}
                        label="Joined On"
                        value={employee?.createdAt?.split("T")[0]}
                        bgColor="bg-cyan-700/20"
                        iconBg="from-teal-500 to-cyan-500"
                    />
                    <InfoCard
                        icon={<CheckCircle2 size={20} />}
                        label="Account Status"
                        value={employee?.isActive ? "Active Member" : "Inactive Member"}
                        bgColor="bg-indigo-700/20"
                        iconBg="from-indigo-500 to-purple-500"
                    />
                </div>

                {/* Salary Info Card */}
                <div className="bg-amber-700/20  p-8 rounded-3xl border-2 border-amber-800 ">
                    <div className="relative flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                                    <IndianRupee size={20} className="text-(--text-primary)" />
                                </div>
                                <h2 className="text-xl text-(--text-secondary) font-semibold">Monthly Salary</h2>
                            </div>
                            <p className="text-5xl text-(--text-primary) font-bold tracking-tight">
                                ₹ {employee?.monthlySalary?.toLocaleString()}
                            </p>
                            <p className="text-(--text-tertiary) mt-2">Per Month</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetail;

const InfoCard = ({ icon, label, value, bgColor, iconBg }) => (
    <div className={`${bgColor} p-6 rounded-2xl border-2 border-white/5 hover:scale-105 transition-all duration-300`}>
        <div className="relative flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full bg-linear-to-br ${iconBg} flex items-center justify-center`}>
                <div className="text-(--text-primary)">{icon}</div>
            </div>
            <div className="flex-1">
                <p className="text-(--text-tertiary) text-sm font-medium mb-1">{label}</p>
                <p className="text-(--text-primary) text-lg font-semibold ">{value}</p>
            </div>
        </div>
    </div>
)