export default function convertTo12HourFormat(time24) {
    // Split the input time into hours and minutes
    let [hours, minutes] = time24.split(':').map(Number);
    
    // Determine AM/PM period
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Adjust hours to 12-hour format
    hours = hours % 12 || 12; // Convert '0' hours to '12'
    
    // Format minutes to always be two digits
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutes} ${period}`;
}

export function convertGMTtoIST12Hour(timeString) {
    // Parse the input time string
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    
    // Convert time to seconds
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    // Apply IST offset
    const IST_OFFSET_SECONDS = 5 * 3600 + 30 * 60; // 5 hours and 30 minutes offset
    let istTotalSeconds = totalSeconds + IST_OFFSET_SECONDS;
    
    // Handle wrap-around if needed
    const SECONDS_IN_A_DAY = 24 * 3600;
    istTotalSeconds = ((istTotalSeconds % SECONDS_IN_A_DAY) + SECONDS_IN_A_DAY) % SECONDS_IN_A_DAY;

    // Calculate hours, minutes, and seconds for IST
    let istHours = Math.floor(istTotalSeconds / 3600);
    const istMinutes = Math.floor((istTotalSeconds % 3600) / 60);
    const istSeconds = Math.floor(istTotalSeconds % 60);
    
    // Convert to 12-hour format
    const period = istHours >= 12 ? 'PM' : 'AM';
    istHours = istHours % 12 || 12; // Convert 0 to 12 for 12 AM/PM

    // Format hours, minutes, and seconds as two digits
    const formattedHours = String(istHours).padStart(2, '0');
    const formattedMinutes = String(istMinutes).padStart(2, '0');
    const formattedSeconds = String(istSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${period}`;
}