import React from 'react'
import ButtonLoader from './Loader/ButtonLoader';
import useCheckIn from '../hooks/User/Attendance/useCheckIn';
import useCheckOut from '../hooks/User/Attendance/useCheckOut';


const CheckInOut = () => {

    const { checkIn, isLoading: checkInLoading } = useCheckIn();
    const { checkOut, isLoading: checkOutLoading } = useCheckOut();

    return (
        <div className="flex justify-center my-7">
            <div className="flex gap-10">
                <Button
                    buttonFnName={"Check-In"}
                    method={checkIn}
                    isLoading={checkInLoading}
                    style={"text-emerald-600 bg-emerald-700/20 hover:border-emerald-600"}
                />

                <Button
                    buttonFnName={"Check-Out"}
                    method={checkOut}
                    isLoading={checkOutLoading}
                    style={"text-blue-600 bg-blue-700/20 hover:border-blue-600"}
                />

            </div>
        </div>
    )
}

export default CheckInOut;

const Button = ({ buttonFnName, isLoading, method, style }) => (
    <button
        onClick={method}
        disabled={isLoading}
        className={`
            w-55 rounded-2xl px-8 py-4 font-medium text-2xl
            flex items-center justify-center
            cursor-pointer border-2 border-transparent
            transition-all duration-300 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed
            ${style}
        `}>
        {
            isLoading ? <ButtonLoader /> : buttonFnName
        }
    </button>
);
