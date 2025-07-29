const logger = require('../middlewares/logger');
import { nanoid } from 'nanoid';

const urls = new Map();  // In-memory store
const clicks = new Map();

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !isValidURL(url)) {
    await logger("backend", "error", "controller", "Invalid URL format");
    return res.status(400).json({ error: "Invalid URL format" });
  }

  let code = shortcode || nanoid(6);

  if (urls.has(code)) {
    await logger("backend", "error", "controller", "Shortcode already exists");
    return res.status(409).json({ error: "Shortcode already exists" });
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);

  urls.set(code, {
    originalUrl: url,
    createdAt: now.toISOString(),
    expiry: expiry.toISOString(),
    clicks: []
  });

  await logger("backend", "info", "controller", `Shortened URL created with code: ${code}`);

  res.status(201).json({
    shortLink: `http://localhost:3000/${code}`,
    expiry: expiry.toISOString()
  });
};

const redirectToLongUrl = async (req, res) => {
  const { shortcode } = req.params;
  const entry = urls.get(shortcode);

  if (!entry) {
    await logger("backend", "warn", "controller", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  const now = new Date();
  if (new Date(entry.expiry) < now) {
    await logger("backend", "warn", "controller", "Shortcode expired");
    return res.status(410).json({ error: "Link has expired" });
  }

  entry.clicks.push({
    timestamp: now.toISOString(),
    referrer: req.get('referer') || 'direct',
    location: "unknown" // Add geo-IP lookup later if needed
  });

  res.redirect(entry.originalUrl);
};

const getShortUrlStats = async (req, res) => {
  const { shortcode } = req.params;
  const entry = urls.get(shortcode);

  if (!entry) {
    await logger("backend", "error", "controller", "Shortcode stats not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json({
    originalUrl: entry.originalUrl,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    clickCount: entry.clicks.length,
    clicks: entry.clicks
  });
};

module.exports = {
  createShortUrl,
  redirectToLongUrl,
  getShortUrlStats
};
