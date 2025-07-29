// log.js
require('dotenv').config(); 
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];
const validPackages = {
  backend: ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"],
  frontend: ["api", "component", "hook", "page", "state", "style"],
  common: ["auth", "config", "middleware", "utils"]
};

async function Log(stack, level, packageName, message) {
  try {
    if (!validStacks.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
    if (!validLevels.includes(level)) throw new Error(`Invalid level: ${level}`);

    const allowedPackages = [...validPackages.common, ...validPackages[stack]];
    if (!allowedPackages.includes(packageName)) {
      throw new Error(`Invalid package '${packageName}' for stack '${stack}'`);
    }

    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.AUTH_TOKEN 
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    console.log("Log created:", data);

  } catch (err) {
    console.error("Logging failed:", err.message);
  }
}

module.exports = Log;
