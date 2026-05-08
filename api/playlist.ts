import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  addedBy?: string;
  comment?: string;
  albumImage?: string;
  spotifyUrl?: string;
}

const BLOB_KEY = 'wedding-playlist.json';
// URL publique du blob (construite à partir du token)
const BLOB_PUBLIC_URL = `https://jnawyojr66erpw9f.public.blob.vercel-storage.com/${BLOB_KEY}`;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { method } = request;

  const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (method === 'GET') {
    try {
      // Ajouter un paramètre de cache-busting pour forcer la récupération de la dernière version
      try {
        const fetchResponse = await fetch(`${BLOB_PUBLIC_URL}?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        if (fetchResponse.ok) {
          const songs = await fetchResponse.json() as Record<string, Song>;
          if (songs && typeof songs === 'object') {
            const songsArray = Object.values(songs).sort((a, b) => b.votes - a.votes);
            return response.status(200).json(songsArray);
          }
        }
      } catch (fetchError: any) {
        // Fichier n'existe pas encore ou erreur
        console.log('No existing playlist file or fetch error:', fetchError?.message || fetchError);
      }
      return response.status(200).json([]);
    } catch (error) {
      console.error('Error fetching songs:', error);
      return response.status(200).json([]);
    }
  }

  if (method === 'POST') {
    const { action, songId, song } = request.body;

    try {
      let songs: Record<string, Song> = {};

      // Récupérer les chansons existantes depuis l'URL publique
      // Ajouter un paramètre de cache-busting pour forcer la récupération de la dernière version
      try {
        const fetchResponse = await fetch(`${BLOB_PUBLIC_URL}?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        if (fetchResponse.ok) {
          const fetchedSongs = await fetchResponse.json() as Record<string, Song>;
          if (fetchedSongs && typeof fetchedSongs === 'object') {
            songs = fetchedSongs;
          }
        }
      } catch (fetchError: any) {
        // Fichier n'existe pas encore ou erreur
        console.log('No existing playlist file or fetch error, starting fresh:', fetchError?.message || fetchError);
      }

      if (action === 'add') {
        if (!song || !song.title || !song.artist) {
          return response.status(400).json({ error: 'Title and artist are required' });
        }

        const id = `song-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newSong: Song = {
          id,
          title: song.title,
          artist: song.artist,
          votes: 0,
          addedBy: song.addedBy || 'Anonyme',
          comment: song.comment,
          albumImage: song.albumImage,
          spotifyUrl: song.spotifyUrl,
        };

        songs[id] = newSong;
        const jsonString = JSON.stringify(songs);
        await put(BLOB_KEY, jsonString, {
          access: 'public',
          contentType: 'application/json',
          token: BLOB_READ_WRITE_TOKEN,
          allowOverwrite: true,
        });
        return response.status(200).json({ success: true, song: newSong });
      }

      if (action === 'vote') {
        if (!songId || typeof songId !== 'string') {
          return response.status(400).json({ error: 'Invalid songId' });
        }

        if (songs[songId]) {
          songs[songId].votes = (songs[songId].votes || 0) + 1;
          const jsonString = JSON.stringify(songs);
          await put(BLOB_KEY, jsonString, {
            access: 'public',
            contentType: 'application/json',
            token: BLOB_READ_WRITE_TOKEN,
            allowOverwrite: true,
          });
          const songsArray = Object.values(songs).sort((a, b) => b.votes - a.votes);
          return response.status(200).json({ 
            success: true, 
            votes: songs[songId].votes,
            allSongs: songsArray
          });
        } else {
          return response.status(404).json({ error: 'Song not found' });
        }
      }

      return response.status(400).json({ error: 'Invalid action' });
    } catch (error) {
      console.error('Error updating playlist:', error);
      return response.status(500).json({ error: 'Failed to update playlist' });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
