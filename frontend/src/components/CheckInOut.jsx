import React from 'react'
import { Link } from 'react-router-dom';
import useCheckIn from '../hooks/User/Attendance/useCheckIn';
import useCheckOut from '../hooks/User/Attendance/useCheckOut';
import useAuth from '../hooks/Auth/useAuth';
import CheckInOutInfoPanel from './CheckInOutInfoPanel';
import FaceCheckIn from './FaceCheckIn/FaceCheckIn';
import { ScanFace, AlertTriangle } from 'lucide-react';
import CameraGuidePanel from './CameraGuidePanel';


const CheckInOut = () => {
    const { currentUser } = useAuth();
    const { checkIn, isLoading: checkInLoading } = useCheckIn();
    const { checkOut, isLoading: checkOutLoading } = useCheckOut();

    const hasFace = !!currentUser?.user?.faceDescriptor;

    return (
        <div className="flex flex-col items-start justify-center mt-4 mb-9 gap-6 flex-wrap">
            <CheckInOutInfoPanel />

            {hasFace ? (
                <div className="flex gap-6 flex-wrap justify-center">
                    <CameraGuidePanel />
                    <FaceCheckIn
                        mode="checkin"
                        onSubmit={checkIn}
                        isLoading={checkInLoading}
                    />
                    <FaceCheckIn
                        mode="checkout"
                        onSubmit={checkOut}
                        isLoading={checkOutLoading}
                    />

                </div>
            ) : (
                /* ── Face not registered warning ── */
                <div className="
                    flex-1 flex flex-col items-center justify-center gap-4
                    p-6 rounded-xl
                    border border-yellow-500/30
                    bg-yellow-500/5
                    text-center
                ">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="font-semibold text-white mb-1">Face Registration Required</p>
                        <p className="text-sm text-(--text-tertiary) max-w-xs leading-relaxed">
                            You must register your face before you can mark attendance.
                        </p>
                    </div>
                    <Link
                        to="/register-face"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-all"
                    >
                        <ScanFace size={16} />
                        Register Face Now
                    </Link>
                </div>
            )}
        </div>
    )
}

export default CheckInOut;

