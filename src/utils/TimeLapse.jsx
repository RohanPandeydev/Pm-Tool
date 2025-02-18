const lastStatusTime = '17:06:24';  // Ensure this is a string

function TimeDiff (){


// Parse the time string into a Date object
const now = new Date();
const [hours, minutes, seconds] = lastStatusTime.split(':').map(Number);
const lastStatusDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);

// Calculate the time difference
const timeDiff = now - lastStatusDate;

// Convert the time difference to a readable format
const diffHours = Math.floor(timeDiff / (1000 * 60 * 60));
const diffMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
const diffSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

//console.log(`Time difference is ${diffHours} hours, ${diffMinutes} minutes, and ${diffSeconds} seconds.`);
 return timeDiff
} 

export default TimeDiff