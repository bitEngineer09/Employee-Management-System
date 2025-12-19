import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className='flex flex-col h-screen'>
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainLayout;