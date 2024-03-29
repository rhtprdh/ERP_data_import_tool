
function oracleBdDateLibrary(dateNumber) {
 // Convert Excel date to JavaScript date
 const excelDate = new Date((dateNumber - 1) * 24 * 60 * 60 * 1000 + Date.UTC(1899, 11, 30));

 // Extract day, month, and year
 const day = excelDate.getUTCDate();
 const month = excelDate.getUTCMonth() + 1; // Months are 0-indexed, so add 1
 const year = excelDate.getUTCFullYear();

  // Return formatted date string
  return `${month}/${day}/${year}`;
}

export default oracleBdDateLibrary
