import { logger } from "../utils/logger.js";

const validTimeframes = ["week", "month"];
const validSortByFields = ["release_date", "title", "platform"];
const validOrders = ["asc", "desc"];

const validateNumber = (value, defaultValue, min = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min) {
    return defaultValue;
  }
  return parsed;
};

export const validateQueryParams = (req, res, next) => {
  const { timeframe, limit, offset, sortBy, order } = req.query;

  // Validate timeframe
  req.query.timeframe = validTimeframes.includes(timeframe) ? timeframe : "week";
  
  // Validate limit (default: 20, max: 100)
  req.query.limit = validateNumber(limit, 20, 1);
  if (req.query.limit > 100) {
    req.query.limit = 100;
    logger.warn("Limit exceeded maximum, capping at 100");
  }
  
  // Validate offset
  req.query.offset = validateNumber(offset, 0);
  
  // Validate sortBy
  req.query.sortBy = validSortByFields.includes(sortBy) ? sortBy : "release_date";
  
  // Validate order
  req.query.order = validOrders.includes(String(order).toLowerCase()) 
    ? String(order).toLowerCase() 
    : "asc";

  next();
};

