const getDaysBetween = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1; // 1000 * 60 * 60 * 24 = 86400000 ms
    return days;
}

//! NOTE =>
// from = 1 Aug 2025
// to   = 3 Aug 2025

//* end - start = 172800000 ms
//* 1000 * 60 * 60 * 24 = 86400000 ms

// Unit	        Value
// 1 second	    1000 ms
// 1 minute	    60 sec
// 1 hour	    60 min
// 1 day	    24 hr
// 172800000 / 86400000 = 2


//!NOTE (+1 kyu kiya)
// suppose hum lete hai
// from 1 Aug to 1 Aug => diff is (end - start) = 0
// but actually it is one day
// Therefor 0 + 1 = 1