import React from 'react'
import ButtonLoader from '../../components/Loader/ButtonLoader'
import { X } from 'lucide-react';

const Remove = ({
    onClose,
    method,
    isLoading,
    header,
    subHeader,
    icon
}) => {

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className='
                w-lg
                bg-modal-gradient rounded-2xl 
                p-6 shadow-2xl
            '>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='flex items-center gap-2 text-2xl font-semibold text-(--text-secondary)'>
                        {header} {icon}
                    </h1>
                    <p className='text-(--text-tertiary) text-sm mt-1'>
                        {subHeader}
                    </p>
                </div>
                <X
                    onClick={onClose}
                    className='cursor-pointer text-2xl text-(--text-secondary) hover:text-red-700 transition-colors'
                />
            </div>

            <div className='grid grid-cols-2 gap-3'>
                <button
                    disabled={isLoading}
                    onClick={method}
                    className='
                        flex-1 bg-red-700
                        text-white py-3
                        rounded-xl hover:bg-red-800
                        cursor-pointer
                        transition-colors font-medium
                        disabled:opacity-50
                        disabled:cursor-not-allowed 
                        '>
                    {
                        isLoading ? <ButtonLoader /> : "Yes"
                    }
                </button>

                <button
                    disabled={isLoading}
                    onClick={onClose}
                    className='
                        flex-1 bg-emerald-600
                        text-white py-3
                        rounded-xl hover:bg-emerald-700
                        cursor-pointer
                        transition-colors font-medium
                        disabled:opacity-50
                        disabled:cursor-not-allowed 
                        '>
                    {
                        isLoading ? <ButtonLoader /> : "No"
                    }
                </button>
            </div>
        </div>
    )
}

export default Remove;