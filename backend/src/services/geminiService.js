import { ai } from "../config/gemini.js";
import { logger } from "../utils/logger.js";
import { getCurrentWeekRange, getCurrentMonthRange } from "../utils/dateUtils.js";

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchOttReleases = async (timeframe = "week") => {
  // Check cache first
  const cacheKey = `${timeframe}-${new Date().toISOString().split('T')[0]}`;
  const cached = cache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    logger.info(`📦 Returning cached data for ${timeframe}`);
    return cached.data;
  }

  // Get the exact date range based on timeframe
  const dateRange = timeframe === "month" ? getCurrentMonthRange() : getCurrentWeekRange();
  
  const prompt = `
You are an expert OTT entertainment assistant with access to current entertainment industry data.

Provide OTT movie and web series releases for the ${
    timeframe === "month" ? "current month" : "current week"
  } (${dateRange.start} to ${dateRange.end}).

Include only major platforms: Netflix, Amazon Prime Video, Disney+ Hotstar, Hulu, Apple TV+, SonyLIV, Zee5.

REQUIREMENTS:
- Provide realistic and believable OTT releases
- Use dates within the date range ${dateRange.start} to ${dateRange.end} when possible
- If no real releases exist for the exact dates, provide recent or upcoming releases within 1 month of ${dateRange.end}
- Focus on popular and notable titles
- Use realistic release dates (YYYY-MM-DD format)

Return output strictly as a JSON array like:
[
  {
    "title": "string",
    "platform": "string",
    "genre": "string",
    "release_date": "YYYY-MM-DD"
  }
]
Do not include any extra text or markdown. Provide at least 5-10 releases if possible.
`;

  try {
    logger.info(`🔍 Fetching OTT releases for ${timeframe}...`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    if (!response || !response.text) {
      logger.error("❌ Empty response from Gemini API");
      throw new Error("Empty response from Gemini API");
    }

    const text = response.text;

    // Try to parse JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      logger.error("❌ No valid JSON array found in response");
      logger.debug("Response text:", { text });
      return [];
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const releases = JSON.parse(jsonString);

    // Validate releases structure
    if (!Array.isArray(releases)) {
      logger.error("❌ Parsed data is not an array");
      return [];
    }

    // Cache the results
    cache.set(cacheKey, {
      data: releases,
      timestamp: Date.now()
    });

    logger.info(`✅ Successfully fetched ${releases.length} releases`);
    return releases;
  } catch (err) {
    logger.error("❌ Error fetching OTT releases:", { error: err.message, stack: err.stack });
    
    // Return cached data if available, even if expired
    const cached = cache.get(cacheKey);
    if (cached && cached.data) {
      logger.warn("⚠️ Returning stale cached data due to error");
      return cached.data;
    }
    
    throw new Error(`Failed to fetch OTT releases: ${err.message}`);
  }
};
