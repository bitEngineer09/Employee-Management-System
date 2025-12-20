import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MainLayout from './Layout/MainLayout'
import Department from './pages/Department'
import Employee from './pages/Employee'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import AuthLayout from './Layout/AuthLayout'
import {Toaster} from 'react-hot-toast'

const App = () => {
  return (
    <>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/emp" element={<Employee />} />
        <Route path="/dept" element={<Department />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<Auth />} />
      </Route>
    </Routes>
    
    <Toaster />
    </>
    
  );
};

export default App;