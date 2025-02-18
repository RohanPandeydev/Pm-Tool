export default function convertSecondsToHHMMSS(seconds) {
  // Calculate hours
  const hours = Math.floor(seconds / 3600);
  // Calculate remaining minutes
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  // Calculate remaining seconds
  const remainingSeconds = Math.floor(seconds % 60);

  // Format hours, minutes, and seconds as two digits
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(remainingMinutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function convertGMTtoIST(timeInSeconds) {
  const IST_OFFSET_SECONDS = 5 * 3600 + 30 * 60; // 5 hours and 30 minutes offset
  let totalSeconds = timeInSeconds + IST_OFFSET_SECONDS;

  // Determine if the total time is negative
  const isNegative = totalSeconds < 0;
  totalSeconds = Math.abs(totalSeconds);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Format hours, minutes, and seconds as two digits
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // If the total time was negative, add a minus sign to the output
  return `${isNegative ? '-' : ''}${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
  export const TimeConversion=(seconds)=>{
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  } 


  export  function convertHHMMSS_HM(value, type = 'seconds') {
    let totalSeconds;
    totalSeconds = (value * 3600);

    // Convert the input value to seconds based on the type
    // switch (type) {
     
    //   case 'hours':
    //     totalSeconds = value * 3600;
    //     break;
    // }
  
    // Calculate hours
    const hours = Math.floor(totalSeconds / 3600);
    // Calculate remaining minutes
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    // Calculate remaining seconds
    const remainingSeconds = Math.floor(totalSeconds % 60);
  
    // Format hours, minutes, and seconds as two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(remainingMinutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }




  
  
  

 export function customRound(value) {
    const firstDigit = Math.floor(value * 10) % 10;
    const secondDigit = Math.floor(value * 100) % 10;

    if (firstDigit > 5) {
        return Math.ceil(value);
    } else if (secondDigit > 5) {
        return Math.floor(value * 10) / 10 + 0.01;
    } else {
        return value;
    }
}


export function convertMillisecondsToTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format the hours and minutes to ensure they are always two digits
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}
