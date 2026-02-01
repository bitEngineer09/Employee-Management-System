import React, { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { FaTeamspeak } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchEmployees } from '../hooks/Admin/useSearchEmployee';
import { useDebounce } from '../hooks/Admin/useDebounce';
import useAuth from '../hooks/Auth/useAuth';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const { employeeSearchData, isLoading } = useSearchEmployees(debouncedSearch);

    const { currentUser } = useAuth();
    const ROLE = currentUser?.user?.role;

    return (
        <div
            className='
                w-full h-15 px-2 
                bg-navbar-gradient
                text-(--text-primary)
                flex items-center
                relative
                border-b shrink-0 
                border-(--border-primary)
            '>
            {/* Logo */}
            <div
                onClick={() => navigate("/")}
                className='absolute left-5 flex items-center gap-2 text-2xl cursor-pointer'>
                <FaTeamspeak />
                <p>
                    <span className="font-bold">T</span>eam{" "}
                    <span className="font-bold">T</span>rack
                </p>
            </div>

            {/* Search */}
            {
                (location.pathname !== "/auth" && ROLE == "ADMIN") &&
                <div className='flex items-center justify-center mx-auto relative bg-slate-950'>
                    <div className='flex items-center rounded-lg border border-(--border-secondary) px-2'>
                        <IoSearch />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Search employee...'
                            className='w-200 p-2 outline-none' />
                    </div>
                </div>
            }

            {
                debouncedSearch && (
                    <div
                        className='
                        absolute top-16 
                        w-full bg-gray-800
                        text-(--text-secondary)
                        shadow-lg rounded max-h-60
                        overflow-y-auto z-50
                        '>
                        {isLoading && <p className='p-2'>Searching...</p>}

                        {employeeSearchData?.length === 0 && !isLoading && (
                            <p className='p-2'>No employee found</p>
                        )}

                        {employeeSearchData?.map(emp => {
                            const { id, name, employeeId } = emp;
                            return (
                                <div
                                    key={emp.id}
                                    className='p-2 hover:bg-slate-700 border-b border-slate-700 cursor-pointer'
                                    onClick={() => {
                                        navigate(`/admin/emp/${id}`);
                                        setSearch("");
                                    }}
                                >
                                    <p className='font-semibold'>{name}</p>
                                    <p className='text-sm text-gray-500'>
                                        {employeeId} • {emp.department?.name}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
        </div>
    );
}

export default Navbar;