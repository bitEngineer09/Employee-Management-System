import { prisma } from './client.js';

export const generateEmployeeId = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");;
    const datePart = `${year}${month}`; // e.g., "202406"

    let sequence = 1; 

    // Find the last employee ID that starts with the current date part
    const lastEmployee = await prisma.user.findFirst({
        where: {
            employeeId: {
                startsWith: `EMP-${datePart}`,
            },
        },
        orderBy: {
            employeeId: "desc",
        },
    });

    // If an employee ID exists for the current date part, extract the sequence number and increment it
    if (lastEmployee) {
        const lastSequence = parseInt(lastEmployee.employeeId.split("-")[2]);
        sequence += lastSequence;
    };

    // Pad the sequence number with leading zeros to ensure it is 4 digits long
    const sequencePart = String(sequence).padStart(4, "0");

    return `EMP-${datePart}-${sequencePart}`;
}