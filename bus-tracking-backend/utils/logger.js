const isProduction = process.env.NODE_ENV === "production";

const logger = {
  info: (message, meta = {}) => {
    if (isProduction) {
      console.log(JSON.stringify({ level: "info", timestamp: new Date(), message, ...meta }));
    } else {
      console.log(`[INFO] ${new Date().toLocaleTimeString()}: ${message}`, Object.keys(meta).length ? meta : "");
    }
  },
  warn: (message, meta = {}) => {
    if (isProduction) {
      console.warn(JSON.stringify({ level: "warn", timestamp: new Date(), message, ...meta }));
    } else {
      console.warn(`[WARN] ${new Date().toLocaleTimeString()}: ${message}`, Object.keys(meta).length ? meta : "");
    }
  },
  error: (message, error = {}, meta = {}) => {
    if (isProduction) {
      console.error(JSON.stringify({
        level: "error",
        timestamp: new Date(),
        message,
        errorMessage: error.message,
        errorStack: error.stack,
        ...meta
      }));
    } else {
      console.error(`[ERROR] ${new Date().toLocaleTimeString()}: ${message}`, error, Object.keys(meta).length ? meta : "");
    }
  }
};

module.exports = logger;
