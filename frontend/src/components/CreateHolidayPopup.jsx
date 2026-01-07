import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import useCreateHoliday from '../hooks/Admin/Holiday/useCreateHoliday';
import { TentTree } from 'lucide-react';

const CreateHolidayPopup = ({ createHldy, setCreateHldy }) => {

    const { createHoliday } = useCreateHoliday();

    const [formData, setFormData] = useState({
        name: "",
        date: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        createHoliday({
            name: formData.name,
            date: formData.date,
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div
            className='
                bg-white 
                w-full max-w-2xl
                rounded-2xl 
                p-6 shadow-2xl 
                border border-(--border-primary)
            '>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='flex items-center gap-2 text-2xl font-semibold text-(--bg-secondary)'>
                        Create Holiday <TentTree />
                    </h1>
                    <p className='text-(--text-disabled) text-sm mt-1'>
                        Add holiday details
                    </p>
                </div>
                <RxCross2
                    onClick={() => setCreateHldy(!createHldy)}
                    className='cursor-pointer text-2xl text-(--bg-secondary) hover:text-red-700 transition-colors'
                />
            </div>

            <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>

                {/* Holiday Name */}
                <div className='col-span-2 flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--bg-secondary)'>
                        Holiday Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter holiday name"
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                            focus:border-pink-400
                            focus:ring-3 focus:ring-pink-400
                            transition-all
                        '
                    />
                </div>

                {/* Holiday Date */}
                <div className='col-span-2 flex flex-col gap-2'>
                    <label className='text-sm font-medium text-(--bg-secondary)'>
                        Holiday Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className='
                            border border-(--border-primary)
                            py-3 px-4
                            outline-none rounded-xl
                            text-(--bg-secondary)
                            focus:border-pink-400
                            focus:ring-3 focus:ring-pink-400
                            transition-all
                        '
                    />
                </div>

                {/* Buttons */}
                <div className='col-span-2 flex gap-4 mt-4'>
                    <button
                        type="submit"
                        className='
                            flex-1 bg-pink-600
                            text-white py-3
                            rounded-xl hover:bg-pink-700
                            cursor-pointer
                            transition-colors font-medium
                        '>
                        Create Holiday
                    </button>
                    <button
                        type="button"
                        onClick={() => setCreateHldy(false)}
                        className='
                            flex-1 bg-gray-200
                            text-(--bg-secondary)
                            py-3 rounded-xl
                            hover:bg-gray-300
                            cursor-pointer
                            transition-colors font-medium
                        '>
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    )
}

export default CreateHolidayPopup;
