import React from 'react'
import { ring } from 'ldrs'
ring.register()


const PageLoader = () => {
    return (
        <div className='w-full h-full flex items-center justify-center bg-black/20'>
            <l-ring
                size="35"
                stroke="5"
                bg-opacity="0"
                speed="2"
                color="white"
            ></l-ring>
        </div>
    )
}

export default PageLoader