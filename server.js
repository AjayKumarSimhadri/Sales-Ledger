// Optional Node.js web server for hosts that want a running process
// (Render, Railway, Azure App Service, Heroku, a VPS ...).
// The dashboard itself is a static site, so GitHub Pages does NOT need this file.
//
//   npm run build && npm start        ->  http://localhost:3000

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const port = process.env.PORT || 3000;

const app = express();
app.disable("x-powered-by");

// Health check for hosting platforms
app.get("/healthz", (_req, res) => res.type("text").send("ok"));

// Basic hardening headers (the app loads only its own files + Google Fonts)
app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "SAMEORIGIN"
  });
  next();
});

// Hashed build assets can be cached for a long time; index.html must always be revalidated.
app.use("/assets", express.static(path.join(dist, "assets"), { immutable: true, maxAge: "1y" }));
app.use(express.static(dist, { maxAge: 0 }));

app.listen(port, () => console.log(`Sales Ledger running on http://localhost:${port}`));
