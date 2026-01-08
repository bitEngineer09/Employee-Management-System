import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './Layout/MainLayout'
import Department from './pages/Department'
import Employee from './pages/Employee'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import AuthLayout from './Layout/AuthLayout'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/Routes/ProtectedRoute';
import PublicRoute from './components/Routes/PublicRoute';
import DepartmentDetail from './components/Departments/DepartmentDetails';
import EmployeeDetail from './components/EmployeeDetail'

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/emp" element={<Employee />} />
            <Route path="/dept" element={<Department />} />
            <Route path="/department/:id" element={<DepartmentDetail />} />
            <Route path="/emp/:id" element={<EmployeeDetail />} />
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<Auth />} />
          </Route>
        </Route>
      </Routes>

      <Toaster />
    </>

  );
};

export default App;