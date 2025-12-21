import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center text-(--text-primary) gap-2'>
            <p className='text-6xl'>404</p>
            <p className='text-sm tracking-wide'>Something went wrong!</p>
            <p className='text-sm tracking-wide'>PAGE NOT FOUND</p>
            <div className='flex gap-5'>
                <Link to="" className='border border-(--border-primary) px-6 py-2 rounded-full cursor-pointer hover:text-(--blue-primary) hover:border-(--blue-hover) transition-colors'>GO BACK</Link>
                <Link to="/" className='border border-(--border-primary) px-6 py-2 rounded-full cursor-pointer hover:text-(--blue-primary) hover:border-(--blue-hover) transition-colors'>GO HOME</Link>
            </div>
        </div>
    )
}

export default ErrorPage;