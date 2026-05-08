import type { VercelRequest, VercelResponse } from "@vercel/node";

interface TokenCache {
  token: string;
  expiresAt: number;
}

// Cache du token en mémoire (valide pour les invocations "chaudes")
let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 10_000) {
    return tokenCache.token;
  }

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to get Spotify token: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return tokenCache.token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { q } = req.query;
  if (!q || typeof q !== "string" || q.trim().length < 2) {
    return res.status(400).json({ tracks: [] });
  }

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    return res.status(503).json({ error: "Spotify not configured" });
  }

  try {
    const token = await getAccessToken();
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=6&market=FR`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!searchRes.ok) throw new Error("Spotify search failed");

    const data = (await searchRes.json()) as {
      tracks: {
        items: {
          id: string;
          name: string;
          artists: { name: string }[];
          album: { name: string; images: { url: string }[] };
          external_urls: { spotify: string };
        }[];
      };
    };

    const tracks = data.tracks.items.map((t) => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      album: t.album.name,
      image: t.album.images[2]?.url ?? t.album.images[0]?.url ?? null,
      spotifyUrl: t.external_urls.spotify,
    }));

    res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.status(200).json({ tracks });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Spotify search error:", msg);
    return res.status(500).json({ error: msg });
  }
}
