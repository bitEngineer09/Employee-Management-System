import React from 'react';
import { IoSearch } from "react-icons/io5";
import { FaTeamspeak } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    return (
        <div className='w-full h-15 flex items-center relative px-2 border-b border-zinc-200'>

            {/* Logo */}
            <div className='absolute left-5 flex items-center gap-1 text-2xl'>
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
                        <div className='flex items-center rounded border border-zinc-300 px-2'>
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