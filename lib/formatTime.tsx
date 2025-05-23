/**
 * Time formatting utility for displaying relative posting dates
 * Converts absolute timestamps into human-readable relative time strings
 * Used primarily for job posting dates throughout the application
 *
 * @param date - The date to format (typically a job posting creation date)
 * @returns A human-readable string indicating how long ago the date was
 */
const formatTime = (date: Date) => {
  // Get current date/time for comparison
  const now = new Date();

  // Calculate difference in days between now and the provided date
  // Uses millisecond conversion: 1000ms * 60s * 60min * 24hr = 1 day
  const diffInDays = Math.floor(
    (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Format the time difference into a human-readable string
  if (diffInDays === 0) {
    // For posts made today
    return "Posted Today";
  } else if (diffInDays === 1) {
    // For posts made yesterday (singular form)
    return "Posted 1 Day ago";
  } else {
    // For posts made 2+ days ago (plural form)
    return `Posted ${diffInDays} days ago`;
  }
};

export default formatTime;
