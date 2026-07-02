const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLogLevel = process.env.LOG_LEVEL || "INFO";

const shouldLog = (level) => {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
};

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

export const logger = {
  debug: (message, meta) => {
    if (shouldLog("DEBUG")) {
      console.debug(formatMessage("DEBUG", message, meta));
    }
  },
  
  info: (message, meta) => {
    if (shouldLog("INFO")) {
      console.log(formatMessage("INFO", message, meta));
    }
  },
  
  warn: (message, meta) => {
    if (shouldLog("WARN")) {
      console.warn(formatMessage("WARN", message, meta));
    }
  },
  
  error: (message, meta) => {
    if (shouldLog("ERROR")) {
      console.error(formatMessage("ERROR", message, meta));
    }
  },
};

