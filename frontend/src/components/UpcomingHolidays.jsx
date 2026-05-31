import React, { useMemo } from "react";
import { AlertCircle, CalendarDays, Loader } from "lucide-react";
import useGetHolidays from "../hooks/Admin/Holiday/useGetHolidays";
import HolidayCard from "./StyledComponents/HolidayCard";
import PageLoader from "./Loader/PageLoader";

const UpcomingHolidays = () => {
  const { holidays, isLoading, error } = useGetHolidays();

  const upcomingHolidays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return holidays
      ?.filter((h) => new Date(h.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 8);
  }, [holidays]);

  // loading state
  if (isLoading) return <PageLoader />

  // error state
  if (error) {
    return (
      <div className="w-full p-4 bg-red-700/5 rounded-xl border-2 border-red-800">
        <p className="text-red-500 text-center flex items-center justify-center gap-2">
          <AlertCircle />Failed to load holidays
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl mt-18">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="
          p-2.5
          bg-linear-to-br from-purple-500
          to-pink-500 rounded-lg
          shadow-lg shadow-purple-500/20
        ">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <h2 
          className="
          text-xl font-bold
          text-transparent 
          bg-clip-text bg-linear-to-r
          from-purple-400 to-pink-400
        ">
          Upcoming Holidays
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {
          upcomingHolidays.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No upcoming holidays 🎉
            </div>
          ) : (
            upcomingHolidays.map((holiday, index) => (
              <HolidayCard key={holiday.id} holiday={holiday} index={index} />
            ))
          )
        }
      </div>
    </div>
  );
};

export default UpcomingHolidays;


