/**
 * Location Validation Service
 * Uses the Haversine formula to check if a user's coordinates
 * are within OFFICE_RADIUS_METERS of the configured office location.
 */

const EARTH_RADIUS_METERS = 6371000; // Average radius of Earth in meters, need for Haversine formula
const OFFICE_RADIUS_METERS = 100;

const toRadians = (degrees) => (degrees * Math.PI) / 180; // cuz JavaScript's Math functions use radians

// calculates the distance between two points on Earth given their latitudes and longitudes.
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const dLat = toRadians(lat2 - lat1); // Difference in latitude in degrees then converted to radians
    const dLng = toRadians(lng2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_METERS * c;
};


// checks if the user's location is within a certain radius of the office location.
export const isWithinOffice = (lat, lng) => {
    const officeLat = parseFloat(process.env.OFFICE_LAT);
    const officeLng = parseFloat(process.env.OFFICE_LNG);

    if (isNaN(officeLat) || isNaN(officeLng)) {
        throw new Error("Office coordinates not configured (OFFICE_LAT / OFFICE_LNG missing in .env)");
    }

    const distanceMeters = haversineDistance(officeLat, officeLng, lat, lng);
    return {
        valid: distanceMeters <= OFFICE_RADIUS_METERS,
        distanceMeters: Number(distanceMeters.toFixed(2)),
    };
};
