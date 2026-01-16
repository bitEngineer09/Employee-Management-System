import React from 'react';
import { motion as Motion } from 'motion/react';

export const StaggerContainer = ({ children, className="" }) => {
    const containerVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChlidren: 0.2,
            },
        },
    }
    return (
        <Motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {children}
        </Motion.div>
    )
}

export const AnimatedItem = ({ children, className="" }) => {
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: -10,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            },
        }
    };

    return (
        <Motion.div
            variants={itemVariants}
            className={className}
        >
            {children}
        </Motion.div>
    )
}