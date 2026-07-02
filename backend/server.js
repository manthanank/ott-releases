import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ottRoutes from "./src/routes/ottRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { logger } from "./src/utils/logger.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { query: req.query });
  next();
});

// Routes
app.use("/api/ott", ottRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "OTT Releases API",
    version: "1.0.0",
    endpoints: {
      releases: "/api/ott/releases",
      health: "/health"
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});
