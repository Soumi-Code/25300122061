# Logging Middleware

A simple Node.js logging middleware that sends log messages to a remote evaluation service.

## Features

- Validates stack, level, and package before sending logs
- Supports backend and frontend stacks with common packages
- Sends logs via HTTP POST with authorization
- Uses environment variables for sensitive data

## Setup

1. **Clone the repository**

2. **Install dependencies**
   `npm install`

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following content:
   `AUTH_TOKEN=your_authorization_token_here`

## Usage

Import and use the `Log` function in your code:

```js
const Log = require("./log.js");

Log("backend", "error", "handler", "received string, expected bool");
Log("backend", "fatal", "db", "Critical database connection failure");
```

### Parameters

- `stack`: `"backend"` or `"frontend"`
- `level`: `"debug"`, `"info"`, `"warn"`, `"error"`, or `"fatal"`
- `packageName`: Valid package for the stack (see below)
- `message`: Log message string

#### Valid Packages

- **backend**: `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`
- **frontend**: `api`, `component`, `hook`, `page`, `state`, `style`
- **common**: `auth`, `config`, `middleware`, `utils`

## Error Handling

If an invalid parameter is provided or the server returns an error, an error message will be printed to the console.
