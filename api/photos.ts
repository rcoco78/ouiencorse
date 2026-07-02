import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

const METADATA_KEY = 'wedding-photos-metadata.json';
const METADATA_URL = `https://jnawyojr66erpw9f.public.blob.vercel-storage.com/${METADATA_KEY}`;

interface PhotoEntry {
  id: string;
  url: string;
  type: 'image' | 'video';
  uploaderName?: string;
  uploadedAt: string;
}

async function loadMetadata(): Promise<PhotoEntry[]> {
  try {
    const res = await fetch(`${METADATA_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (_) {}
  return [];
}

async function saveMetadata(entries: PhotoEntry[]) {
  await put(METADATA_KEY, JSON.stringify(entries), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — liste toutes les photos
  if (req.method === 'GET') {
    const entries = await loadMetadata();
    return res.json(entries.reverse()); // plus récentes en premier
  }

  // POST ?action=upload — échange de token pour upload client direct
  if (req.method === 'POST' && req.query.action === 'upload') {
    try {
      const jsonResponse = await handleUpload({
        body: req.body as HandleUploadBody,
        request: req as unknown as Request,
        onBeforeGenerateToken: async (pathname) => ({
          allowedContentTypes: [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic',
            'video/mp4', 'video/quicktime', 'video/webm', 'video/mov',
          ],
          maximumSizeInBytes: 150 * 1024 * 1024, // 150 MB
          tokenPayload: pathname,
        }),
        onUploadCompleted: async () => {
          // Le client enregistre les métadonnées séparément
        },
      });
      return res.json(jsonResponse);
    } catch (err) {
      return res.status(400).json({ error: String(err) });
    }
  }

  // POST ?action=metadata — enregistre les métadonnées après upload
  if (req.method === 'POST' && req.query.action === 'metadata') {
    const { url, type, uploaderName } = req.body as {
      url: string;
      type: 'image' | 'video';
      uploaderName?: string;
    };

    if (!url || !type) {
      return res.status(400).json({ error: 'url et type requis' });
    }

    const entries = await loadMetadata();
    const newEntry: PhotoEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url,
      type,
      uploaderName: uploaderName?.trim() || undefined,
      uploadedAt: new Date().toISOString(),
    };
    entries.push(newEntry);
    await saveMetadata(entries);
    return res.json(newEntry);
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
