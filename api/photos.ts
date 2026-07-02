import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

// Format du nom de fichier : wedding-photos/{timestamp}_{type}_{nom}.{ext}
// type = "img" | "vid"
// nom = alphanumeric + tirets, "anonyme" si absent
const PREFIX = 'wedding-photos/';

function parseBlob(pathname: string, url: string, uploadedAt: Date) {
  const filename = pathname.replace(PREFIX, '');
  const parts = filename.split('_');
  if (parts.length < 3) return null;

  const type = parts[1] === 'vid' ? 'video' : 'image';
  const nameWithExt = parts.slice(2).join('_');
  const rawName = nameWithExt.replace(/\.[^.]+$/, '').replace(/-/g, ' ').trim();

  return {
    id: pathname,
    url,
    type: type as 'image' | 'video',
    uploaderName: rawName && rawName !== 'anonyme' ? rawName : undefined,
    uploadedAt: uploadedAt.toISOString(),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — liste toutes les photos via blob list()
  if (req.method === 'GET') {
    const blobs: Awaited<ReturnType<typeof list>>['blobs'] = [];
    let cursor: string | undefined;

    // Récupère toutes les pages
    do {
      const result = await list({ prefix: PREFIX, cursor, limit: 1000 });
      blobs.push(...result.blobs);
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    const photos = blobs
      .map((b) => parseBlob(b.pathname, b.url, b.uploadedAt))
      .filter(Boolean)
      .sort((a, b) => new Date(b!.uploadedAt).getTime() - new Date(a!.uploadedAt).getTime());

    return res.json(photos);
  }

  // POST ?action=upload — échange de token pour upload client direct
  if (req.method === 'POST' && req.query.action === 'upload') {
    try {
      const jsonResponse = await handleUpload({
        body: req.body as HandleUploadBody,
        request: req as unknown as Request,
        onBeforeGenerateToken: async (pathname) => {
          // Valide que le fichier suit bien notre format
          if (!pathname.startsWith(PREFIX)) {
            throw new Error('Chemin invalide');
          }
          return {
            allowedContentTypes: [
              'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
              'image/webp', 'image/heic', 'image/heif',
              'video/mp4', 'video/quicktime', 'video/webm', 'video/mov',
            ],
            maximumSizeInBytes: 150 * 1024 * 1024,
          };
        },
        onUploadCompleted: async () => {
          // Rien à faire : les métadonnées sont dans le nom de fichier
        },
      });
      return res.json(jsonResponse);
    } catch (err) {
      return res.status(400).json({ error: String(err) });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
