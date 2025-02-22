const formattedDate = (isoDate) => {

  const date = new Date(isoDate); // Convert it to a Date object

  // Get the local formatted date
  const formattedDate = date.toLocaleString('en-US', {
    weekday: 'long',  // e.g., "Tuesday"
    year: 'numeric',  // e.g., "2024"
    month: 'long',    // e.g., "December"
    day: 'numeric',   // e.g., "31"
    hour: '2-digit',  // e.g., "04"
    minute: '2-digit', // e.g., "32"
    second: '2-digit', // e.g., "43"
    hour12: true       // e.g., AM/PM format
  });

  return formattedDate;
  // Output: "Tuesday, December 31, 2024, 04:32:43 PM"
}

export { formattedDate };