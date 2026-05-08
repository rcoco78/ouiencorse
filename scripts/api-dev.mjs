/**
 * Mini-serveur local pour les routes /api/* en développement Vite.
 * Lit .env.local et expose les fonctions Vercel sur http://localhost:3333/api/*
 */
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Charger .env.local
try {
  const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const [k, ...v] = line.split("=");
    if (k?.trim() && v.length) process.env[k.trim()] = v.join("=").trim();
  }
} catch {}

// ── Spotify search handler ────────────────────────────────────────────────────
let tokenCache = null;

async function getSpotifyToken() {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 10_000) return tokenCache.token;
  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  tokenCache = { token: data.access_token, expiresAt: now + data.expires_in * 1000 };
  return tokenCache.token;
}

async function handleSpotifySearch(q) {
  const token = await getSpotifyToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=6&market=FR`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return data.tracks.items.map((t) => ({
    id: t.id,
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    image: t.album.images[2]?.url ?? t.album.images[0]?.url ?? null,
    spotifyUrl: t.external_urls.spotify,
  }));
}
// ─────────────────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/spotify-search") {
    const q = url.searchParams.get("q") ?? "";
    if (q.trim().length < 2) return res.end(JSON.stringify({ tracks: [] }));
    try {
      const tracks = await handleSpotifySearch(q);
      res.end(JSON.stringify({ tracks }));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(3333, () => {
  console.log("API dev server ready on http://localhost:3333");
});
