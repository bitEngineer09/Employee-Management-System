import React from 'react';
import { IoSearch } from "react-icons/io5";
import { FaTeamspeak } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    return (
        <div
            className='
                w-full h-15 px-2
                bg-(--bg-tertiary)
                text-(--text-primary)
                flex items-center
                relative
                border-b
                border-(--border-primary)
            '>
            {/* Logo */}
            <div className='absolute left-5 flex items-center gap-2 text-2xl'>
                <FaTeamspeak />
                <p>
                    <span className="font-bold">T</span>eam{" "}
                    <span className="font-bold">T</span>rack
                </p>
            </div>

            {/* Search */}
            {
                location.pathname !== "/auth" ?
                    <div className='flex items-center justify-center mx-auto'>
                        <div className='flex items-center rounded-lg border border-(--border-secondary) px-2'>
                            <IoSearch />
                            <input
                                name=''
                                placeholder='search'
                                className='w-200 p-2 outline-none' />
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default Navbar;