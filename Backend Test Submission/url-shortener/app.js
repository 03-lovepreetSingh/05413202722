const express = require("express");
const cors = require("cors");
const app = express();
const logger = require("./logger");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
const { readDB, writeDB, generateShortCode } = require("./utils");

app.use(express.json());
app.use(logger);
console.log("app.js loaded");

app.post("/test", (req, res) => {
  res.status(200).json({ message: "POST request received successfully" });
});

// Create short URL
app.post("/shorturls", (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !/^https?:\/\/.+\..+/.test(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const db = readDB();
  let code = shortcode || generateShortCode();

  // Check if shortcode exists
  if (db.urls.some((u) => u.shortcode === code)) {
    if (shortcode)
      return res.status(409).json({ error: "Shortcode already in use" });
    do {
      code = generateShortCode();
    } while (db.urls.some((u) => u.shortcode === code));
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000).toISOString();

  const entry = {
    shortcode: code,
    originalUrl: url,
    createdAt: now.toISOString(),
    expiresAt: expiry,
    clickCount: 0,
  };

  db.urls.push(entry);
  writeDB(db);

  res.status(201).json({
    shortLink: `http://localhost:8000/${code}`,
    expiry,
  });
});

// Redirect handler
app.get("/:shortcode", (req, res) => {
  const db = readDB();
  const entry = db.urls.find((u) => u.shortcode === req.params.shortcode);

  if (!entry) return res.status(404).json({ error: "Shortcode not found" });
  if (new Date(entry.expiresAt) < new Date())
    return res.status(410).json({ error: "Link expired" });

  entry.clickCount += 1;
  db.clicks.push({
    shortcode: entry.shortcode,
    timestamp: new Date().toISOString(),
    referrer: req.get("Referrer") || "direct",
    ip: req.ip,
  });

  writeDB(db);
  res.redirect(entry.originalUrl);
});

// Get stats
app.get("/shorturls/:shortcode", (req, res) => {
  const db = readDB();
  const entry = db.urls.find((u) => u.shortcode === req.params.shortcode);
  if (!entry) return res.status(404).json({ error: "Shortcode not found" });

  const clicks = db.clicks.filter((c) => c.shortcode === entry.shortcode);

  res.json({
    shortcode: entry.shortcode,
    originalUrl: entry.originalUrl,
    createdAt: entry.createdAt,
    expiresAt: entry.expiresAt,
    totalClicks: entry.clickCount,
    clickDetails: clicks,
  });
});

// Get all URLs
app.get("/shorturls", (req, res) => {
  const db = readDB();
  res.json({
    count: db.urls.length,
    urls: db.urls.map((u) => ({
      shortcode: u.shortcode,
      originalUrl: u.originalUrl,
      createdAt: u.createdAt,
      expiresAt: u.expiresAt,
      clickCount: u.clickCount,
    })),
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
