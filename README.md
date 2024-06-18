### Telegram User Agent

## Overview

Telegram User Agent is a backend service that enables a Telegram bot to perform user operations and interact with external APIs using the MTProto Mobile Protocol. It supports session management, stored in JSON files for demo purposes, with a recommendation to use a database in production.

## Features
- Node.js and NestJS for robust backend development
- MTProto Mobile Protocol for Telegram API interaction
- JSON session storage (recommend database for production)


## Getting Started

### Prerequisites
- Node.js
- TELEGRAM_API_ID and TELEGRAM_API_HASH env

## Setup

1. Install dependencies
`yarn install`
2. Set environment variables in a `.env.development` (for dev) file:
  
``` 
  BASE_URL=http://localhost:3000 # The base URL of the backend service
  PORT=3200 # The port number on which the backend service runs

  TELEGRAM_API_ID=your_api_id # Your Telegram API ID, which can be obtained from my.telegram.org
  TELEGRAM_API_HASH=your_api_hash # Your Telegram API hash, also available from my.telegram.org
```

**Additional Information:**

To obtain the `TELEGRAM_API_ID` and `TELEGRAM_API_HASH`, follow these steps:
1. Go to [my.telegram.org](https://my.telegram.org).
2. Log in with your Telegram account.
3. Navigate to "API development tools".
4. Create a new application to get your API ID and hash.

**Running the Application**

For development:
```bash
yarn start:dev
```

For production:
```bash
yarn start:prod
```

For demonstration purposes, authorized sessions are saved in a JSON file. In a production environment, it is recommended to use a database to store session data.
