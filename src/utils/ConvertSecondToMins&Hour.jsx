function convertSeconds(seconds) {
    if (seconds === 0) {
        return "0 min";
    }
    const hours = Math.floor(seconds / 3600); // 3600 seconds in an hour
    const remainingSeconds = seconds % 3600; // Remaining seconds after extracting hours
    const minutes = Math.floor(remainingSeconds / 60); // 60 seconds in a minute
    const remainingMinutes = remainingSeconds % 60; // Remaining seconds after extracting minutes

    // If the time exceeds 60 minutes, return the value in hours
    if (hours > 0) {
        const totalHours = hours + (minutes / 60); // Convert minutes to fraction of hours
        return totalHours.toFixed(1) + ' hr';
    } else {
        // If the time is less than 60 minutes, return the value in minutes
        return Math.min(59, minutes) + ' min';
    }
}
export default convertSeconds;