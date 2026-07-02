/**
 * Get the current week range (Monday to Sunday)
 * @returns {Object} Object with start and end date strings in YYYY-MM-DD format
 */
export const getCurrentWeekRange = () => {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1;

  const firstDay = new Date(today);
  firstDay.setDate(first);
  
  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);

  return {
    start: firstDay.toISOString().split("T")[0],
    end: lastDay.toISOString().split("T")[0],
  };
};

/**
 * Get the current month range
 * @returns {Object} Object with start and end date strings in YYYY-MM-DD format
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};

/**
 * Check if a date string is valid
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }
  return date.toISOString().split("T")[0];
};
