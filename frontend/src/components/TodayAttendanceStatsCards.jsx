import React from 'react';

const TodayAttendanceStatsCards = ({ name, index, bgColor, hover, value, color, icon }) => {
    return (
        <div
            key={index}
            className={`
                    w-71 h-32
                    border-2 border-transparent
                    flex items-center justify-between
                    text-(--text-secondary)
                    bg-(--bg-primary)
                    px-5 rounded-2xl
                    transition-all
                    ${bgColor}
                    ${hover}
                    `}>
            <div className='flex flex-col gap-2'>
                <p>{name}</p>
                <p className='text-3xl font-medium'>{value}</p>
            </div>
            <div
                className={`
                      size-12
                      text-2xl
                      flex items-center justify-center
                      rounded-full
                      ${color}
                      `}>
                {icon}
            </div>
        </div>
    )
}

export default TodayAttendanceStatsCards;