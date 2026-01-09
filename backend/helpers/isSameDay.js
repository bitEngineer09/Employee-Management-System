export const isSameDay = (date1, date2) => {
  const a = new Date(date1);
  const b = new Date(date2);

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};
