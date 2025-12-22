import { prisma } from './client.js';

export const generateEmployeeId = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");;
    const datePart = `${year}${month}`;

    let sequence = 1;
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

    if (lastEmployee) {
        const lastSequence = parseInt(lastEmployee.employeeId.split("-")[2]);
        sequence += lastSequence;
    };

    const sequencePart = String(sequence).padStart(4, "0");

    return `EMP-${datePart}-${sequencePart}`;
}