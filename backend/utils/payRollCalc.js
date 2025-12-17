export const payrollCalculator = (attendance, monthlySalary) => {
    let payableDays = 0;

    if (attendance.length === 0) {
        return {
            totalWorkingDays: 0,
            payableDays: 0,
            perDaySalary: 0,
            grossSalary: 0
        };
    }

    attendance.forEach(a => {
        switch (a.status) {
            case "PRESENT":
            case "HOLIDAY":
            case "LEAVE_PAID":
                payableDays += 1;
                break;

            case "ABSENT":
            case "LEAVE_UNPAID":
                payableDays += 0;
                break;

            case "HALF_DAY":
                payableDays += 0.5;
                break;
        }
    });

    const totalWorkingDays = attendance.length;
    const perDaySalary = monthlySalary / totalWorkingDays;
    const grossSalary = perDaySalary * payableDays;

    return {
        totalWorkingDays,
        payableDays,
        perDaySalary: Number(perDaySalary.toFixed(2)),
        grossSalary: Number(grossSalary.toFixed(2)),
    };
};
