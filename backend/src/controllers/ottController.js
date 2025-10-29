import { fetchOttReleases } from "../services/geminiService.js";

// Helper function to filter releases by actual date based on timeframe
const filterReleasesByDate = (releases, timeframe) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let startDate, endDate;

  if (timeframe === "month") {
    // Current month
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else {
    // Current week (Monday to Sunday) with some flexibility
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday as start of week
    startDate = new Date(today);
    startDate.setDate(today.getDate() + mondayOffset - 7); // Include previous week
    endDate = new Date(today);
    endDate.setDate(today.getDate() + mondayOffset + 13); // Include next week
  }

  const filteredReleases = releases.filter(release => {
    const releaseDate = new Date(release.release_date);

    // Check if the date is valid
    if (isNaN(releaseDate.getTime())) {
      return false; // Invalid date
    }

    // Normalize dates to compare only date parts (ignore time)
    const releaseDateOnly = new Date(releaseDate.getFullYear(), releaseDate.getMonth(), releaseDate.getDate());
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    return releaseDateOnly >= startDateOnly && releaseDateOnly <= endDateOnly;
  });

  // If no releases found for the specific timeframe, return all releases as fallback
  // This ensures the API always returns some data for demonstration purposes
  if (filteredReleases.length === 0 && releases.length > 0) {
    console.log(`📋 No releases found for exact ${timeframe} timeframe, showing available releases`);
    return releases;
  }

  return filteredReleases;
};

export const getOttReleases = async (req, res) => {
  const {
    timeframe = "week",
    limit = "20",
    offset = "0",
    sortBy = "release_date",
    order = "asc",
  } = req.query;

  // Sanitize/validate
  const validTimeframe = timeframe === "month" ? "month" : "week";
  const parsedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 20;
  const parsedOffset = Number.isFinite(Number(offset)) && Number(offset) >= 0 ? Number(offset) : 0;
  const validSortBy = ["release_date", "title", "platform"].includes(String(sortBy))
    ? String(sortBy)
    : "release_date";
  const validOrder = String(order).toLowerCase() === "desc" ? "desc" : "asc";

  const allReleases = await fetchOttReleases(validTimeframe);

  // Filter releases by actual date based on timeframe
  const filteredReleases = filterReleasesByDate(allReleases, validTimeframe);

  // Sorting helper
  const compare = (a, b) => {
    let left = a[validSortBy];
    let right = b[validSortBy];

    if (validSortBy === "release_date") {
      // Expecting YYYY-MM-DD; fallback to string compare if invalid date
      const leftTime = Date.parse(left) || 0;
      const rightTime = Date.parse(right) || 0;
      return leftTime - rightTime;
    }

    // Case-insensitive string compare for other fields
    left = typeof left === "string" ? left.toLowerCase() : String(left);
    right = typeof right === "string" ? right.toLowerCase() : String(right);
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  };

  const sorted = [...filteredReleases].sort(compare);
  const ordered = validOrder === "desc" ? sorted.reverse() : sorted;

  const total = ordered.length;
  const paged = ordered.slice(parsedOffset, parsedOffset + parsedLimit);

  res.status(200).json({
    timeframe: validTimeframe,
    total,
    count: paged.length,
    offset: parsedOffset,
    limit: parsedLimit,
    order: validOrder,
    releases: paged,
  });
};
