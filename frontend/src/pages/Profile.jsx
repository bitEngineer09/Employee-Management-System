import React from 'react';
import { User, Mail, Phone, Calendar, Briefcase, DollarSign, Building } from 'lucide-react';
import useAuth from '../hooks/Auth/useAuth';
import ErrorPage from '../components/Loader/ErrorPage';
import PageLoader from '../components/Loader/PageLoader';

const Profile = () => {

    const { currentUser, isLoading, error } = useAuth();
    const user = currentUser?.user;

    // chage date format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // age calculator
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const dobText = user?.dob
        ? `${formatDate(user?.dob)} (${calculateAge(user?.dob)} years)`
        : "N/A";


    if (error) return <ErrorPage />
    if (isLoading) return <PageLoader />

    return (
        <div>
            <div>
                {/* Header Card */}
                <div className="bg-navbar-gradient rounded-2xl mb-6 border border-(--border-primary)">
                    <div className="p-8">
                        <div className="flex items-end">
                            <div
                                className="
                                    w-32 h-32
                                    flex items-center justify-center
                                    bg-linear-to-br from-blue-500 to-cyan-600
                                    rounded-full shadow-2xl
                                    border-4 border-gray-800
                                ">
                                <span className="text-(--text-primary) text-4xl font-bold">
                                    {user?.name?.charAt(0)}
                                </span>
                            </div>
                            <div className="ml-6 text-left flex-1">
                                <h1 className="text-3xl font-bold text-(--text-primary)">
                                    {user?.name}
                                </h1>
                                <p className="text-(--text-tertiary) text-lg mt-1">
                                    {user?.designation}
                                </p>
                                <div className="flex items-center justify-start gap-2 mt-2">
                                    <span
                                        className={`
                                            px-3 py-1
                                            rounded-full text-sm
                                            font-medium 
                                            ${user?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                        `}>
                                        {user?.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                        {user?.employeeId}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-navbar-gradient rounded-xl shadow-xl p-4 border border-(--border-primary)">
                        <h2 className="text-xl font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Personal Information
                        </h2>
                        <div className="space-y-4">
                            <InfoCard icon={<Mail />} header={"Email ID"} data={user?.email} />
                            <InfoCard icon={<Phone />} header={"Phone Number"} data={user?.phoneNumber} />
                            <InfoCard icon={<Calendar />} header={"Date of Birth"} data={dobText} />
                            <InfoCard icon={<User />} header={"Gender"} data={user?.gender?.toUpperCase()} />
                        </div>
                    </div>

                    {/* Employment Information */}
                    <div className="bg-navbar-gradient rounded-xl shadow-xl p-4 border border-(--border-primary)">
                        <h2 className="text-xl font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-400" />
                            Employment Details
                        </h2>
                        <div className="space-y-4">
                            <InfoCard icon={<Briefcase />} header={"Designation"} data={user?.designation} />
                            <InfoCard icon={<Building />} header={"Department ID"} data={user?.departmentId} />
                            <InfoCard icon={<User />} header={"Role"} data={user?.role?.toLowerCase()} />
                            <InfoCard icon={<Calendar />} header={"Joined On"} data={formatDate(user?.createdAt)} />
                        </div>
                    </div>

                    {/* Salary Information */}
                    <div className="bg-navbar-gradient rounded-xl shadow-xl p-6 md:col-span-2 border border-(--border-primary)">
                        <h2 className="text-xl font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-blue-400" />
                            Salary Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-linear-to-br from-green-900 to-emerald-900 rounded-lg p-6 border border-green-700">
                                <p className="text-sm text-green-300 mb-1">
                                    Monthly Salary
                                </p>
                                <p className="text-3xl font-bold text-green-400">
                                    ₹{user?.monthlySalary?.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="bg-linear-to-br from-blue-900 to-indigo-900 rounded-lg p-6 border border-blue-700">
                                <p className="text-sm text-blue-300 mb-1">
                                    Basic Salary
                                </p>
                                <p className="text-3xl font-bold text-blue-400">
                                    ₹{user?.basicSalary?.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Profile;

const InfoCard = ({ icon, header, data }) => {
    if (!data) return null;

    return (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/70 transition-colors">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-500/10 rounded-lg text-blue-400">
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{header}</p>
                <p className="text-slate-200 font-medium mt-0.5">{data}</p>
            </div>
        </div>
    );
};
