import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { method } = request;

  const BLOB_KEY = 'wedding-votes.json';
  const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
  // URL publique du blob (construite à partir du token)
  const BLOB_PUBLIC_URL = `https://jnawyojr66erpw9f.public.blob.vercel-storage.com/${BLOB_KEY}`;

  if (method === 'GET') {
    try {
      if (!BLOB_READ_WRITE_TOKEN) {
        console.error('BLOB_READ_WRITE_TOKEN is not set');
        const defaultVotes = {
          'voyage-noces': 0,
          'projets-futurs': 0,
          'cadeaux-traditionnels': 0,
        };
        return response.status(200).json(defaultVotes);
      }

      // Essayer de récupérer le fichier depuis l'URL publique
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
          const votes = await fetchResponse.json();
          if (votes && typeof votes === 'object') {
            return response.status(200).json(votes);
          }
        }
      } catch (fetchError: any) {
        // Si le fichier n'existe pas ou erreur, retourner les valeurs par défaut
        console.log('No existing votes file or fetch error:', fetchError?.message || fetchError);
      }
      const defaultVotes = {
        'voyage-noces': 0,
        'projets-futurs': 0,
        'cadeaux-traditionnels': 0,
      };
      return response.status(200).json(defaultVotes);
    } catch (error: any) {
      console.error('Error fetching votes:', error);
      console.error('Error details:', error?.message, error?.stack);
      return response.status(200).json({
        'voyage-noces': 0,
        'projets-futurs': 0,
        'cadeaux-traditionnels': 0,
      });
    }
  }

  if (method === 'POST') {
    const { itemId } = request.body;
    
    if (!itemId || typeof itemId !== 'string') {
      return response.status(400).json({ error: 'Invalid itemId' });
    }

    if (!BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not set');
      return response.status(500).json({ error: 'Blob token not configured' });
    }

    try {
      let votes: Record<string, number> = {
        'voyage-noces': 0,
        'projets-futurs': 0,
        'cadeaux-traditionnels': 0,
      };

      // Essayer de récupérer les votes existants depuis l'URL publique
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
          const fetchedVotes = await fetchResponse.json();
          if (fetchedVotes && typeof fetchedVotes === 'object') {
            // Fusionner avec les valeurs par défaut pour s'assurer qu'on a tous les items
            votes = {
              'voyage-noces': fetchedVotes['voyage-noces'] || 0,
              'projets-futurs': fetchedVotes['projets-futurs'] || 0,
              'cadeaux-traditionnels': fetchedVotes['cadeaux-traditionnels'] || 0,
            };
            console.log('Loaded existing votes:', votes);
          }
        } else {
          console.log('Blob file not found or error, status:', fetchResponse.status);
        }
      } catch (fetchError: any) {
        // Fichier n'existe pas encore ou erreur, utiliser les valeurs par défaut
        console.log('No existing votes file or fetch error, using defaults:', fetchError?.message || fetchError);
      }

      // Incrémenter le vote pour l'item demandé
      const currentVoteCount = votes[itemId] || 0;
      votes[itemId] = currentVoteCount + 1;
      console.log(`Voting for ${itemId}: ${currentVoteCount} -> ${votes[itemId]}`);
      
      // Sauvegarder dans Blob
      const jsonString = JSON.stringify(votes);
      const result = await put(BLOB_KEY, jsonString, {
        access: 'public',
        contentType: 'application/json',
        token: BLOB_READ_WRITE_TOKEN,
        allowOverwrite: true,
      });

      console.log('Votes saved successfully:', result.url);

      // Lire immédiatement depuis l'URL retournée pour s'assurer d'avoir les bonnes données
      // (évite les problèmes de cache/propagation)
      try {
        const verifyResponse = await fetch(`${result.url}?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        if (verifyResponse.ok) {
          const verifiedVotes = await verifyResponse.json();
          if (verifiedVotes && typeof verifiedVotes === 'object') {
            votes = {
              'voyage-noces': verifiedVotes['voyage-noces'] || 0,
              'projets-futurs': verifiedVotes['projets-futurs'] || 0,
              'cadeaux-traditionnels': verifiedVotes['cadeaux-traditionnels'] || 0,
            };
            console.log('Verified votes from blob:', votes);
          }
        }
      } catch (verifyError: any) {
        console.log('Could not verify votes from blob, using computed values:', verifyError?.message);
      }

      return response.status(200).json({ 
        success: true, 
        votes: votes[itemId],
        allVotes: votes 
      });
    } catch (error: any) {
      console.error('Error updating votes:', error);
      console.error('Error details:', error?.message, error?.stack);
      return response.status(500).json({ 
        error: 'Failed to update votes',
        message: error?.message || 'Unknown error'
      });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
