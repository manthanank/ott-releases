import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error("Error occurred:", { 
    error: err.message, 
    stack: err.stack,
    path: req.path,
    method: req.method 
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";
  
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
    ...(isDevelopment && { stack: err.stack })
  });
};

