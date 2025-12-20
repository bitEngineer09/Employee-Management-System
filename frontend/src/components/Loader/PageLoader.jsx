import React from 'react'
import { ripples } from 'ldrs'
ripples.register()

const PageLoader = () => {
    return (
        <div>
            <l-ripples
                size="45"
                speed="2"
                color="black"
            ></l-ripples>
        </div>
    )
}

export default PageLoader