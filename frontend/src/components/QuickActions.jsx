import { Clapperboard, House, Lock, TentTree, User } from 'lucide-react'
import React, { useState } from 'react'
import CreateEmpPopup from "../components/Popups/CreateEmpPopup";
import CreateDepartmentPopup from '../components/Popups/CreateDepartmentPopup';
import CreateHolidayPopup from '../components/Popups/CreateHolidayPopup';
import { useNavigate } from "react-router-dom";
import AnimateModal from './Animation/AnimateModal';

const QuickActions = () => {
    const navigate = useNavigate();
    const [createEmp, setCreateEmp] = useState(false);
    const [createDept, setCreateDept] = useState(false);
    const [createHldy, setCreateHldy] = useState(false);

    return (
        <>
            <p className="flex gap-2 text-xl">Quick Actions <Clapperboard /></p>
            <div className="grid grid-cols-1 gap-4 mt-3">
                <div
                    className="flex items-center justify-center gap-4 border-2 border-(--border-secondary) rounded-full p-3 cursor-pointer hover:font-medium hover:text-cyan-400 hover:border-cyan-400 hover:bg-blue-600/10 transition-all"
                    onClick={() => setCreateEmp(!createEmp)}
                >
                    Add Employee <User />
                </div>
                <div
                    onClick={() => setCreateDept(!createDept)}
                    className="flex items-center justify-center gap-4 border-2 border-(--border-secondary) rounded-full p-3 cursor-pointer hover:font-medium hover:text-purple-400 hover:border-purple-400 hover:bg-purple-600/10 transition-all">
                    Add Department <House />
                </div>
                <div
                    onClick={() => setCreateHldy(!createHldy)}
                    className="flex items-center justify-center gap-4 border-2 border-(--border-secondary) rounded-full p-3 cursor-pointer hover:font-medium hover:text-pink-400 hover:border-pink-400 hover:bg-pink-600/10 transition-all">
                    Create Holiday <TentTree />
                </div>
                <div
                    onClick={() => navigate("/settings")}
                    className="flex items-center justify-center gap-4 border-2 border-(--border-secondary) rounded-full p-3 cursor-pointer hover:font-medium hover:text-amber-400 hover:border-amber-400 hover:bg-amber-600/10 transition-all">
                    Change Password <Lock />
                </div>
            </div>

            {/* Popup */}
            <AnimateModal isOpen={createEmp}>
            {
                createEmp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <CreateEmpPopup createEmp={createEmp} setCreateEmp={setCreateEmp} />
                    </div>
                )
            }
            </AnimateModal>

            <AnimateModal isOpen={createDept}>
            {
                createDept && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <CreateDepartmentPopup createDept={createDept} setCreateDept={setCreateDept} />
                    </div>
                )
            }
            </AnimateModal>

            <AnimateModal isOpen={createHldy}>
            {
                createHldy && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <CreateHolidayPopup createHldy={createHldy} setCreateHldy={setCreateHldy} />
                    </div>
                )
            }
            </AnimateModal>
        </>
    )
}

export default QuickActions