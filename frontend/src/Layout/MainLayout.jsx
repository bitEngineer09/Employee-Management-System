import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import useLogout from '../hooks/Auth/useLogout';
import useUser from '../hooks/Auth/useUser';
import PageLoader from '../components/Loader/PageLoader';
import ErrorPage from '../components/Loader/ErrorPage';

const MainLayout = () => {
    const { logoutLoading } = useLogout();
    const { userLoading } = useUser();

    const isPageLoading = logoutLoading || userLoading;
    // const errorOccur = true;

    return (
        <div className='flex flex-col h-screen'>
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 relative">
                    {
                        isPageLoading && (
                            <div className="absolute inset-0 z-50">
                                <PageLoader />
                            </div>
                        )
                    }
                    {/* {
                        errorOccur && (
                            <div className="absolute inset-0 z-50">
                                <ErrorPage />
                            </div>
                        )
                    } */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainLayout;