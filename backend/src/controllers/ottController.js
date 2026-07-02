import { fetchOttReleases } from "../services/geminiService.js";
import { filterReleasesByDate } from "../utils/releaseFilters.js";
import { sortReleases } from "../utils/releaseSort.js";
import { logger } from "../utils/logger.js";

export const getOttReleases = async (req, res) => {
  try {
    // Use validated values from middleware
    const timeframe = req.query.timeframe;
    const limit = req.query.limit;
    const offset = req.query.offset;
    const sortBy = req.query.sortBy;
    const order = req.query.order;

    logger.debug("Fetching OTT releases", { timeframe, limit, offset, sortBy, order });

    const allReleases = await fetchOttReleases(timeframe);
    
    // Filter releases by actual date based on timeframe
    const filteredReleases = filterReleasesByDate(allReleases, timeframe);

    // Sort releases
    const sortedReleases = sortReleases(filteredReleases, sortBy, order);

    // Paginate
    const total = sortedReleases.length;
    const paged = sortedReleases.slice(offset, offset + limit);

    logger.info(`Returning ${paged.length} releases`, { total, timeframe });

    res.status(200).json({
      timeframe,
      total,
      count: paged.length,
      offset,
      limit,
      sortBy,
      order,
      releases: paged,
    });
  } catch (error) {
    logger.error("Error in getOttReleases:", error);
    throw error;
  }
};
