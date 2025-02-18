export default function getCurrentDateTimeIST() {
    // Create a new Date object with the current time
    const currentDate = new Date();

    // Convert the current time to UTC
    const utcOffset = currentDate.getTimezoneOffset() * 60000;
    const utcDate = new Date(currentDate.getTime() + utcOffset);

    // IST offset is UTC+5:30
    const istOffset = 5.5 * 60 * 60000;
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format the date
    const day = istDate.getDate().toString().padStart(2, '0');
    const month = (istDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = istDate.getFullYear();

    // Format the time
    const hours = istDate.getHours().toString().padStart(2, '0');
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const seconds = istDate.getSeconds().toString().padStart(2, '0');

    // Combine date and time
    const date = `${day}-${month}-${year}`;
    const time = `${hours}:${minutes}:${seconds}`;

    return { date, time };
}


export function formatRemainingTime(totalHours, totalWorkingTimeInSeconds) {
    const totalHoursInSeconds = totalHours * 3600; // Convert total hours to seconds
    const remainingTimeInSeconds = totalHoursInSeconds - totalWorkingTimeInSeconds;

    if (remainingTimeInSeconds <= 0) {
        return '0 mins';
    }
    const hours = Math.floor(remainingTimeInSeconds / 3600);
    const remainingSeconds = remainingTimeInSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    if (hours > 0) {
        const totalHoursWithMinutes = hours + (minutes / 60);
        return `${totalHoursWithMinutes.toFixed(1)} hr`;
    } else {
        return `${Math.min(59, minutes)} min`;
    }
}
export function formatRemainingTimeInHour(totalHours, totalWorkingTime) {
    //console.log("===============>",totalHours, totalWorkingTime)
    const totalHoursInSeconds = totalHours * 3600; // Convert total hours to seconds
    const totalWorkingTimeInSeconds=totalWorkingTime * 3600
    const remainingTimeInSeconds = totalHoursInSeconds - totalWorkingTimeInSeconds;

    if (remainingTimeInSeconds <= 0) {
        return '0 mins';
    }
    const hours = Math.floor(remainingTimeInSeconds / 3600);
    const remainingSeconds = remainingTimeInSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    if (hours > 0) {
        const totalHoursWithMinutes = hours + (minutes / 60);
        return `${totalHoursWithMinutes.toFixed(1)} hr`;
    } else {
        return `${Math.min(59, minutes)} min`;
    }
}

export function convertToHoursOrMinutes(decimalHour) {
    const totalMinutes = decimalHour * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
  
    if (totalMinutes < 60) {
      return `${minutes} min`;
    } else {
      return `${hours} hrs ${minutes} min`;
    }
  }