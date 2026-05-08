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
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const k = trimmed.slice(0, eqIdx).trim();
    const v = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (k) process.env[k] = v;
  }
} catch {}

// ── Spotify search ────────────────────────────────────────────────────────────
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

// ── Vercel Blob helpers ───────────────────────────────────────────────────────
async function blobGet(key) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const url = `https://blob.vercel-storage.com/${key}?token=${token}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function blobPut(key, data) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const res = await fetch(`https://blob.vercel-storage.com/${key}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-version": "7",
      "x-allow-overwrite": "1",
      "x-cache-control-max-age": "0",
      "x-add-random-suffix": "0",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Blob PUT failed: ${res.status} ${txt}`);
  }
  return res.json();
}

// ── /api/playlist ─────────────────────────────────────────────────────────────
const PLAYLIST_KEY = "wedding-playlist.json";
const BLOB_PUBLIC_URL = `https://jnawyojr66erpw9f.public.blob.vercel-storage.com/${PLAYLIST_KEY}`;

async function getPlaylist() {
  try {
    const res = await fetch(`${BLOB_PUBLIC_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) return res.json();
  } catch {}
  return {};
}

async function handlePlaylist(req, res) {
  if (req.method === "GET") {
    const songs = await getPlaylist();
    const arr = Object.values(songs).sort((a, b) => b.votes - a.votes);
    res.end(JSON.stringify(arr));
    return;
  }

  if (req.method === "POST") {
    const body = await readBody(req);
    const { action, songId, song } = body;
    let songs = await getPlaylist();

    if (action === "add") {
      if (!song?.title || !song?.artist) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Title and artist are required" }));
        return;
      }
      const id = `song-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const newSong = {
        id,
        title: song.title,
        artist: song.artist,
        votes: 0,
        addedBy: song.addedBy || "Anonyme",
        comment: song.comment,
        albumImage: song.albumImage,
        spotifyUrl: song.spotifyUrl,
      };
      songs[id] = newSong;
      await blobPut(PLAYLIST_KEY, songs);
      res.end(JSON.stringify({ success: true, song: newSong }));
      return;
    }

    if (action === "vote") {
      if (!songId || !songs[songId]) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Song not found" }));
        return;
      }
      songs[songId].votes = (songs[songId].votes || 0) + 1;
      await blobPut(PLAYLIST_KEY, songs);
      const arr = Object.values(songs).sort((a, b) => b.votes - a.votes);
      res.end(JSON.stringify({ success: true, votes: songs[songId].votes, allSongs: arr }));
      return;
    }

    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid action" }));
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method not allowed" }));
}

// ── /api/menu & /api/presence ─────────────────────────────────────────────────
async function handleAppend(req, res, blobKey) {
  if (req.method === "POST") {
    const body = await readBody(req);
    let existing = [];
    try {
      const url = `https://jnawyojr66erpw9f.public.blob.vercel-storage.com/${blobKey}?t=${Date.now()}`;
      const r = await fetch(url, { cache: "no-store" });
      if (r.ok) existing = await r.json();
    } catch {}
    existing.push({ ...body, timestamp: new Date().toISOString() });
    await blobPut(blobKey, existing);
    res.end(JSON.stringify({ success: true }));
    return;
  }
  if (req.method === "GET") {
    try {
      const url = `https://jnawyojr66erpw9f.public.blob.vercel-storage.com/${blobKey}?t=${Date.now()}`;
      const r = await fetch(url, { cache: "no-store" });
      if (r.ok) { res.end(await r.text()); return; }
    } catch {}
    res.end("[]");
    return;
  }
  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method not allowed" }));
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

// ── Serveur principal ─────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") { res.statusCode = 200; res.end(); return; }

  const url = new URL(req.url, "http://localhost");

  try {
    if (url.pathname === "/api/spotify-search") {
      const q = url.searchParams.get("q") ?? "";
      if (q.trim().length < 2) { res.end(JSON.stringify({ tracks: [] })); return; }
      const tracks = await handleSpotifySearch(q);
      res.end(JSON.stringify({ tracks }));
      return;
    }

    if (url.pathname === "/api/playlist") {
      await handlePlaylist(req, res);
      return;
    }

    if (url.pathname === "/api/menu") {
      await handleAppend(req, res, "wedding-menu.json");
      return;
    }

    if (url.pathname === "/api/presence") {
      await handleAppend(req, res, "wedding-presence.json");
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found" }));
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

server.listen(3333, () => {
  console.log("API dev server ready on http://localhost:3333");
  console.log("  /api/spotify-search  → Spotify");
  console.log("  /api/playlist        → Vercel Blob");
  console.log("  /api/menu            → Vercel Blob");
  console.log("  /api/presence        → Vercel Blob");
});
