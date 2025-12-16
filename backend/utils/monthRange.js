export const getMonthRange = (month) => { // "2025 02"
    const [year, mon] = month.split("-");

    // new Date(year, mon-1, 1) 1 means es month ki pehli date
    const startDate = new Date(year, mon - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    // new Date(year, mon, 0) 0 means given month se pichhle month ki last date
    const endDate = new Date(year, mon, 0);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
}