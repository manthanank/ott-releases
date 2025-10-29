import { ai } from "../config/gemini.js";

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchOttReleases = async (timeframe = "week") => {
  // Check cache first
  const cacheKey = `${timeframe}-${new Date().toISOString().split('T')[0]}`;
  const cached = cache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`📦 Returning cached data for ${timeframe}`);
    return cached.data;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 0-indexed
  const currentWeek = Math.ceil(currentDate.getDate() / 7);

  const currentDateStr = currentDate.toISOString().split('T')[0];

  const prompt = `
You are an expert OTT entertainment assistant with access to current entertainment industry data.

Provide OTT movie and web series releases ${
    timeframe === "month"
      ? `for the current month (${currentYear}-${currentMonth.toString().padStart(2, '0')})`
      : `for the current week (${currentYear}-${currentMonth.toString().padStart(2, '0')})`
  }.

Include only major platforms: Netflix, Amazon Prime Video, Disney+ Hotstar, Hulu, Apple TV+, SonyLIV, Zee5.

REQUIREMENTS:
- Provide realistic and believable OTT releases
- Use dates within the requested timeframe when possible
- If no real releases exist for the exact timeframe, provide recent or upcoming releases
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
    console.log(`🔍 Fetching OTT releases for ${timeframe}...`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text;

    // try to parse JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("❌ No valid JSON array found in response");
      return [];
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const releases = JSON.parse(jsonString);

    // Cache the results
    cache.set(cacheKey, {
      data: releases,
      timestamp: Date.now()
    });

    console.log(`✅ Successfully fetched ${releases.length} releases`);
    return releases;
  } catch (err) {
    console.error("❌ Error fetching OTT releases:", err.message);
    return [];
  }
};
