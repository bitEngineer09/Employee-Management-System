import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// layout
import MainLayout from './Layout/MainLayout';
import AuthLayout from './Layout/AuthLayout';

// pages
import Department from './pages/Department';
import Employee from './pages/Employee';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import SettingsPage from './pages/SettingsPage';
import LeaveAdmin from './pages/LeaveAdmin';
import Payroll from './pages/Payroll';
import Leave from './pages/User/Leave';
import Attendance from './pages/User/Attendance';
import Salary from './pages/User/Salary';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';

// routes
import ProtectedRoute from './components/Routes/ProtectedRoute';
import PublicRoute from './components/Routes/PublicRoute';

// components
import DepartmentDetail from './components/Departments/DepartmentDetails';
import EmployeeDetail from './components/EmployeeDetail';

// hooks
import useAuth from './hooks/Auth/useAuth';


const App = () => {

  // checking user role
  const { currentUser } = useAuth();
  const ROLE = currentUser?.user?.role;

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {
              ROLE === "ADMIN"
                ? <>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/admin/emp" element={<Employee />} />
                  <Route path="/admin/dept" element={<Department />} />
                  <Route path="/admin/department/:id" element={<DepartmentDetail />} />
                  <Route path="/admin/emp/:id" element={<EmployeeDetail />} />
                  <Route path="/admin/leave" element={<LeaveAdmin />} />
                  <Route path="/admin/payroll" element={<Payroll />} />
                </>
                : <>
                  <Route path="/" element={<Attendance />} />
                  <Route path="/emp/leave" element={<Leave />} />
                  <Route path="/emp/salary" element={<Salary />} />
                </>
            }
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          </Route>
        </Route>
      </Routes>

      <Toaster />
    </>

  );
};

export default App;