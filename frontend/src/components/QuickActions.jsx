import { Clapperboard, House, Lock, TentTree, User } from 'lucide-react'
import React, { useState } from 'react'
import CreateEmpPopup from "../components/Popups/CreateEmpPopup";
import CreateDepartmentPopup from '../components/Popups/CreateDepartmentPopup';
import CreateHolidayPopup from '../components/Popups/CreateHolidayPopup';
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
    const navigate = useNavigate();
    const [createEmp, setCreateEmp] = useState(false);
    const [createDept, setCreateDept] = useState(false);
    const [createHldy, setCreateHldy] = useState(false);

    return (
        <div className='my-8 pb-4'>
            <p className="flex gap-2 text-xl">Quick Actions <Clapperboard /></p>
            <div className="grid grid-cols-2 gap-4 mt-3">
                <div
                    className="flex items-center justify-center gap-4 border-2 border-(--border-secondary) rounded-full p-4 cursor-pointer hover:font-medium hover:text-blue-600 hover:border-blue-600 hover:bg-blue-600/10 transition-all"
                    onClick={() => setCreateEmp(!createEmp)}
                >
                    Add Employee <User />
                </div>
                <div
                    onClick={() => setCreateDept(!createDept)}
                    className="flex items-center justify-center gap-4 border-2 border-(--border-secondary) rounded-full p-4 cursor-pointer hover:font-medium hover:text-purple-600 hover:border-purple-600 hover:bg-purple-600/10 transition-all">
                    Add Department <House />
                </div>
                <div
                    onClick={() => setCreateHldy(!createHldy)}
                    className="flex items-center justify-center gap-4 border-2 border-(--border-secondary) rounded-full p-4 cursor-pointer hover:font-medium hover:text-pink-600 hover:border-pink-600 hover:bg-pink-600/10 transition-all">
                    Create Holiday <TentTree />
                </div>
                <div
                    onClick={() => navigate("/settings")}
                    className="flex items-center justify-center gap-4 border-2 border-(--border-secondary) rounded-full p-4 cursor-pointer hover:font-medium hover:text-amber-600 hover:border-amber-600 hover:bg-amber-600/10 transition-all">
                    Change Password <Lock />
                </div>
            </div>

            {/* Popup */}
            {
                createEmp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <CreateEmpPopup createEmp={createEmp} setCreateEmp={setCreateEmp} />
                    </div>
                )
            }

            {
                createDept && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <CreateDepartmentPopup createDept={createDept} setCreateDept={setCreateDept} />
                    </div>
                )
            }

            {
                createHldy && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <CreateHolidayPopup createHldy={createHldy} setCreateHldy={setCreateHldy} />
                    </div>
                )
            }
        </div>
    )
}

export default QuickActions