import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  logger.error("GEMINI_API_KEY is not set in environment variables");
  throw new Error("GEMINI_API_KEY is required but not set");
}

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

logger.info("Gemini AI client initialized successfully");
