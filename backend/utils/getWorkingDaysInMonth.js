export const getWorkingDaysInMonth = async (month, prisma) => {
    // month format: "2025-01"

    const [year, monthNumber] = month.split("-").map(Number); // split into year and month number

    const startDate = new Date(year, monthNumber - 1, 1); // monthNumber - 1 because month is 0-indexed in JavaScript Date
    const endDate = new Date(year, monthNumber, 0); // 0 means last day of previous month, which is the last day of the given month

    const holidays = await prisma.holiday.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    // Create a set of holiday dates for quick lookup (typically in O(1) average time)
    const holidaySet = new Set(
        holidays.map(h => h.date.toDateString())
    );

    let totalWorkingDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const day = currentDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
        const isWeekend = day === 0 || day === 6; // 0=Sun, 6=Sat
        const isHoliday = holidaySet.has(currentDate.toDateString()); // Check if current date is a holiday

        if (!isWeekend && !isHoliday) {
            totalWorkingDays++; // Increment working days count if it's not a weekend and not a holiday
        }

        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return totalWorkingDays;
};
