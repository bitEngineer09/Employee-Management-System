import React from 'react'
import { AnimatePresence, motion as Motion } from 'motion/react';

const AnimateModal = ({ isOpen, children }) => {
    return (
        <AnimatePresence>
            {
                isOpen && (
                    <Motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.98,
                            filter: "blur(10px)"
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.98,
                            filter: "blur(10pxx)"
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)"
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut"
                        }}
                        className='fixed inset-0 z-50'
                    >
                        {children}
                    </Motion.div>
                )
            }
        </AnimatePresence>
    )
}

export default AnimateModal