export const OFFICE_START_HOUR = 10;
export const LATE_CHECKIN_MINUTES = 15;
export const HALF_DAY_HOURS = 4;
export const FULL_DAY_HOURS = 8;

// Office GPS coordinates — used for geolocation-based check-in validation
export const OFFICE_LAT = parseFloat(process.env.OFFICE_LAT) || 28.6139;
export const OFFICE_LNG = parseFloat(process.env.OFFICE_LNG) || 77.2090;
