export const getPayRollCalc = (attendance, monthlySalary) => {
    let payableDays = 0;

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
    const finalPayableAmount = perDaySalary * payableDays;

    return {
        totalWorkingDays,
        payableDays,
        perDaySalary: Number(perDaySalary.toFixed(2)),
        finalPayableAmount: Number(finalPayableAmount.toFixed(2)),
    };
};
