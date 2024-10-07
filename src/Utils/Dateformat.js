export function convertDate(dateString) {
    // Split the input date by the hyphen (-) to get an array of [yyyy, mm, dd]
    const [year, month, day] = dateString.split("-");
    
    // Return the date in dd/mm/yyyy format
    return `${day}/${month}/${year}`;
  }