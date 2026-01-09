import React from 'react'
import useCheckIn from '../hooks/User/Attendance/useCheckIn';
import useCheckOut from '../hooks/User/Attendance/useCheckOut';
import ButtonClicky from './StyledComponents/ButtonClicky';
import CheckInOutInfoPanel from './CheckInOutInfoPanel';


const CheckInOut = () => {

    const { checkIn, isLoading: checkInLoading } = useCheckIn();
    const { checkOut, isLoading: checkOutLoading } = useCheckOut();

    return (
        <div className="flex items-center justify-center mt-4 mb-9 gap-10">
            <CheckInOutInfoPanel />
            <div className="flex gap-10">
                <div className="flex flex-col items-center gap-10">
                    <ButtonClicky
                        buttonFnName="Check-In"
                        method={checkIn}
                        isLoading={checkInLoading}
                        variant="checkin"
                    />

                    <ButtonClicky
                        buttonFnName="Check-Out"
                        method={checkOut}
                        isLoading={checkOutLoading}
                        variant="checkout"
                    />
                </div>
            </div>
        </div>
    )
}

export default CheckInOut;