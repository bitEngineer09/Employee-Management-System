export const getWorkingDaysInMonth = async (month, prisma) => {
    // month format: "2025-01"

    const [year, monthNumber] = month.split("-").map(Number);

    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0);

    const holidays = await prisma.holiday.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    const holidaySet = new Set(
        holidays.map(h => h.date.toDateString())
    );

    let totalWorkingDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const day = currentDate.getDay();
        const isWeekend = day === 0 || day === 6; // 0=Sun, 6=Sat
        const isHoliday = holidaySet.has(currentDate.toDateString());

        if (!isWeekend && !isHoliday) {
            totalWorkingDays++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalWorkingDays;
};
