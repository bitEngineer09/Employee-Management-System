import React from 'react'

const CheckInOut = () => {
    return (
        <div className="flex justify-center my-7">
            <div className="flex gap-10">
                <div
                    className="
              rounded-2xl px-8 py-4
              text-blue-600 font-medium 
              text-2xl bg-blue-700/30
              flex items-center justify-center
              cursor-pointer
              border-2 border-transparent
              hover:border-blue-600
              transition-all duration-300 ease-in-out
              ">
                    Check-In
                </div>

                <div
                    className="
              rounded-2xl px-8 py-4
              text-red-600 font-medium 
              text-2xl bg-red-700/30
              flex items-center justify-center
              cursor-pointer
              border-2 border-transparent
              hover:border-red-600
              transition-all duration-300 ease-in-out
              ">
                    Check-Out
                </div>
            </div>
        </div>
    )
}

export default CheckInOut