export default function getMonthStartEnd(monthName) {
    const year=new Date().getFullYear()
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const monthIndex = monthNames.indexOf(monthName);
  
    if (monthIndex === -1) {
      throw new Error("Invalid month name");
    }
  
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0); // last day of the month
  
    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
  
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    };
  }