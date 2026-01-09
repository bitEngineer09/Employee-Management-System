import React from 'react'
import useCheckIn from '../hooks/User/Attendance/useCheckIn';
import useCheckOut from '../hooks/User/Attendance/useCheckOut';
import ButtonClicky from './StyledComponents/ButtonClicky';


const CheckInOut = () => {

    const { checkIn, isLoading: checkInLoading } = useCheckIn();
    const { checkOut, isLoading: checkOutLoading } = useCheckOut();

    return (
        <div className="flex justify-center my-7">
            <div className="flex gap-10">
                <div className="flex gap-10">
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