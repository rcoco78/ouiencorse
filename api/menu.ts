import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

const BLOB_KEY = 'wedding-menu.json';
const BLOB_PUBLIC_URL = `https://jnawyojr66erpw9f.public.blob.vercel-storage.com/${BLOB_KEY}`;

interface MenuSubmission {
  id: string;
  submittedAt: string;
  firstName: string;
  lastName: string;
  entree: string;
  plat: string;
  dessert: string;
  notes?: string;
}

async function loadSubmissions(): Promise<MenuSubmission[]> {
  try {
    const res = await fetch(`${BLOB_PUBLIC_URL}?t=${Date.now()}`, {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'GET') {
    const submissions = await loadSubmissions();
    return res.status(200).json(submissions);
  }

  if (req.method === 'POST') {
    const { firstName, lastName, entree, plat, dessert, notes } = req.body;
    if (!firstName || !lastName || !entree || !plat || !dessert) {
      return res.status(400).json({ error: 'Champs manquants' });
    }
    if (!BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ error: 'Blob token non configuré' });
    }

    const submissions = await loadSubmissions();
    const entry: MenuSubmission = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      submittedAt: new Date().toISOString(),
      firstName,
      lastName,
      entree,
      plat,
      dessert,
      notes: notes || undefined,
    };
    submissions.push(entry);

    await put(BLOB_KEY, JSON.stringify(submissions), {
      access: 'public',
      contentType: 'application/json',
      token: BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    });

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
