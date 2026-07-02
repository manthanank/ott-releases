# OTT Releases Backend

Backend API for the OTT Releases application, providing OTT movie and web series release information using Google's Gemini AI.

## Features

- **RESTful API** for fetching OTT releases
- **AI-powered** content using Google Gemini
- **Caching** to reduce API calls and improve performance
- **Query filtering** and sorting
- **Pagination** support
- **Error handling** with proper logging
- **Health check** endpoint

## Project Structure

```tree
backend/
├── server.js                 # Main application entry point
├── src/
│   ├── config/              # Configuration files
│   │   └── gemini.js       # Gemini AI configuration
│   ├── controllers/         # Request handlers
│   │   └── ottController.js
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.js # Centralized error handling
│   │   └── validateQuery.js # Query parameter validation
│   ├── routes/              # API routes
│   │   └── ottRoutes.js
│   ├── services/            # Business logic layer
│   │   └── geminiService.js
│   └── utils/               # Utility functions
│       ├── dateUtils.js
│       ├── logger.js
│       ├── releaseFilters.js
│       └── releaseSort.js
└── package.json
```

## Setup

- Install dependencies:

  ```bash
  npm install
  ```

- Create a `.env` file in the `backend/` directory:

  ```bash
  GEMINI_API_KEY=your_gemini_api_key_here
  PORT=5000
  NODE_ENV=development
  LOG_LEVEL=INFO
  ```

- Start the server:

  ```bash
  # Development mode (with auto-reload)
  npm run dev

  # Production mode
  npm start
  ```

## API Endpoints

### GET /api/ott/releases

Fetch OTT releases with optional filters.

**Query Parameters:**

- `timeframe` (optional): `week` or `month` (default: `week`)
- `limit` (optional): Number of results per page, max 100 (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `sortBy` (optional): Field to sort by - `release_date`, `title`, or `platform` (default: `release_date`)
- `order` (optional): Sort order - `asc` or `desc` (default: `asc`)

**Example:**

```bash
GET /api/ott/releases?timeframe=week&limit=10&sortBy=release_date&order=desc
```

**Response:**

```json
{
  "timeframe": "week",
  "total": 25,
  "count": 10,
  "offset": 0,
  "limit": 10,
  "sortBy": "release_date",
  "order": "desc",
  "releases": [
    {
      "title": "Example Movie",
      "platform": "Netflix",
      "genre": "Action",
      "release_date": "2024-01-15"
    }
  ]
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /

API information and available endpoints.

## Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Gemini AI** - AI content generation
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, WARN, ERROR) | No | INFO |

## Architecture

The backend follows a layered architecture:

1. **Routes** - Define endpoints and middleware
2. **Controllers** - Handle HTTP requests/responses
3. **Services** - Business logic and external API calls
4. **Middlewares** - Request processing and validation
5. **Utils** - Reusable utility functions

This separation ensures:

- **Maintainability** - Clear separation of concerns
- **Testability** - Each layer can be tested independently
- **Scalability** - Easy to add new features
- **Reusability** - Common logic in utils

## Error Handling

All errors are handled by the centralized `errorHandler` middleware:

- Logs errors with context
- Returns appropriate HTTP status codes
- Hides stack traces in production

## Caching

The service implements a 5-minute in-memory cache to:

- Reduce Gemini API calls
- Improve response times
- Lower costs

Cache key format: `{timeframe}-{YYYY-MM-DD}`

## Logging

Structured logging with configurable levels:

- **DEBUG** - Detailed debugging information
- **INFO** - General informational messages
- **WARN** - Warning messages
- **ERROR** - Error messages

Control log verbosity via `LOG_LEVEL` environment variable.

## License

MIT
