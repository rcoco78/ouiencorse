import { ArrowUp, Music2, Plus, Search, X } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string | null;
  spotifyUrl: string;
}

function SpotifySearch({
  onSelect,
}: {
  onSelect: (track: SpotifyTrack) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SpotifyTrack | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected || query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/spotify-search?q=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.tracks ?? []);
          setOpen(true);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, selected]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(track: SpotifyTrack) {
    setSelected(track);
    setQuery(track.title);
    setOpen(false);
    onSelect(track);
  }

  function handleClear() {
    setSelected(null);
    setQuery("");
    setResults([]);
    onSelect({ id: "", title: "", artist: "", album: "", image: null, spotifyUrl: "" });
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="text-sm font-medium text-stone-700 mb-1 block">
        Chercher un morceau
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
          placeholder="Titre, artiste…"
          className="bg-white border-savethedate-brown/20 rounded-sm pl-9 pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-savethedate-brown/20 rounded-sm shadow-lg overflow-hidden">
          {loading ? (
            <p className="p-3 text-sm text-stone-500 text-center">Recherche…</p>
          ) : results.length === 0 ? (
            <p className="p-3 text-sm text-stone-500 text-center">Aucun résultat</p>
          ) : (
            results.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => handleSelect(track)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-savethedate-brown/5 transition-colors text-left"
              >
                {track.image ? (
                  <img
                    src={track.image}
                    alt={track.album}
                    className="w-9 h-9 rounded-sm object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-sm bg-stone-100 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{track.title}</p>
                  <p className="text-xs text-stone-500 truncate">{track.artist}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Confirmation de la sélection */}
      {selected && (
        <div className="mt-2 flex items-center gap-2 bg-savethedate-brown/5 border border-savethedate-brown/20 rounded-sm px-3 py-2">
          {selected.image && (
            <img src={selected.image} alt="" className="w-8 h-8 rounded-sm object-cover flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium text-stone-800 truncate">{selected.title}</p>
            <p className="text-xs text-stone-500 truncate">{selected.artist}</p>
          </div>
        </div>
      )}
    </div>
  );
}

async function fetchSongs() {
  const response = await fetch('/api/playlist', {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch songs');
  return response.json() as Promise<Song[]>;
}

async function addSong(song: { title: string; artist: string; addedBy?: string; comment?: string; albumImage?: string; spotifyUrl?: string }) {
  const response = await fetch('/api/playlist', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    cache: 'no-store',
    body: JSON.stringify({ action: 'add', song }),
  });
  if (!response.ok) throw new Error('Failed to add song');
  return response.json();
}

async function voteForSong(songId: string) {
  const response = await fetch('/api/playlist', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    cache: 'no-store',
    body: JSON.stringify({ action: 'vote', songId }),
  });
  if (!response.ok) throw new Error('Failed to vote');
  return response.json();
}

export default function Playlist() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [albumImage, setAlbumImage] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [addedBy, setAddedBy] = useState('');
  const [votedSongs, setVotedSongs] = useState<Set<string>>(new Set());
  const refetchPausedUntil = useRef<number>(0);

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: fetchSongs,
    staleTime: Infinity,   // Ne jamais considérer les données comme périmées
    refetchOnMount: true,  // Charger une fois au montage
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const addSongMutation = useMutation({
    mutationFn: addSong,
    onSuccess: (data) => {
      // Mise à jour optimiste : injecter la nouvelle chanson directement dans le cache
      if (data?.song) {
        queryClient.setQueryData<Song[]>(['songs'], (prev = []) => [
          ...prev,
          data.song,
        ]);
      }
      // Invalider pour avoir la version serveur ensuite (rattrape le CDN)
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['songs'] });
      }, 3000);
      setIsDialogOpen(false);
      setTitle('');
      setArtist('');
      setAlbumImage('');
      setSpotifyUrl('');
      setAddedBy('');
    },
  });

  const voteMutation = useMutation({
    mutationFn: voteForSong,
    onMutate: async (songId) => {
      await queryClient.cancelQueries({ queryKey: ['songs'] });
      const previousSongs = queryClient.getQueryData<Song[]>(['songs']);
      // Mise à jour optimiste instantanée (compte + classement)
      if (previousSongs) {
        const updated = previousSongs
          .map(s => s.id === songId ? { ...s, votes: (s.votes || 0) + 1 } : s)
          .sort((a, b) => b.votes - a.votes);
        queryClient.setQueryData(['songs'], updated);
      }
      // Marquer comme voté immédiatement
      setVotedSongs(prev => new Set(prev).add(songId));
      // Geler le refetch 5s pour que le CDN ait le temps de se mettre à jour
      refetchPausedUntil.current = Date.now() + 5_000;
      return { previousSongs };
    },
    onSuccess: (data) => {
      // Le serveur renvoie la liste fraîche post-écriture — on l'utilise directement
      if (data?.allSongs) {
        queryClient.setQueryData(['songs'], data.allSongs);
      }
    },
    onError: (_err, _songId, context) => {
      if (context?.previousSongs) {
        queryClient.setQueryData(['songs'], context.previousSongs);
      }
    },
  });

  const handleAddSong = () => {
    if (title.trim() && artist.trim()) {
      addSongMutation.mutate({
        title: title.trim(),
        artist: artist.trim(),
        addedBy: addedBy.trim() || undefined,
        albumImage: albumImage || undefined,
        spotifyUrl: spotifyUrl || undefined,
      });
    }
  };

  const handleVote = (songId: string) => {
    if (!voteMutation.isPending) {
      voteMutation.mutate(songId);
    }
  };

  return (
    <div className="bg-cream min-h-screen w-full font-sans overflow-x-hidden flex flex-col">
      <div className="container mx-auto px-6 sm:px-8 flex flex-col flex-grow">
        {/* Header */}
        <header className="py-8 sm:py-12">
          <div className="flex items-center justify-between">
            {/* L & C Logo */}
            <a href="/" className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
              <span className="font-dancing text-2xl font-medium text-stone-800">
                L
              </span>
              <span className="font-sans text-sm font-thin text-stone-800">
                &
              </span>
              <span className="font-dancing text-2xl font-medium text-stone-800">
                C
              </span>
            </a>
            <Navigation />
          </div>
        </header>

        {/* Main Content */}
        <main className="py-12 lg:py-16 flex-grow relative">
          <div className="max-w-4xl mx-auto relative">
            {/* Decorative SVG - Top left */}
            <img
              src="/Calque_21.svg"
              alt="Décor"
              className="absolute top-0 left-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 -translate-x-1/4 opacity-20"
            />
            {/* Decorative SVG - Top right */}
            <img
              src="/corsica2.svg"
              alt="Carte de la Corse"
              className="absolute top-0 right-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 translate-x-1/4 opacity-20"
            />
            {/* Decorative SVG - Bottom left */}
            <img
              src="/Calque_2.svg"
              alt="Décor"
              className="absolute bottom-0 left-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] translate-y-1/4 -translate-x-1/4 opacity-20"
            />
            {/* Title */}
            <div className="text-center mb-12 relative z-10">
              <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800 mb-4">
                Playlist
              </h1>
              <p className="font-sans text-stone-600 text-lg">
                Glissez vos sons dans la set list. On s'occupe du reste.
              </p>
            </div>

            {/* Message principal */}
            <div className="mb-10 relative z-10 text-center">
                <p className="text-stone-600 leading-relaxed mb-6">
                  Proposez les morceaux qui vous font bouger, votez pour ceux des autres.<br />
                  On partagera la liste avec le DJ — il ne pourra pas tout passer, mais les plus votés auront leurs chances.
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-savethedate-brown text-white hover:bg-savethedate-brown/90 border border-savethedate-brown/50 rounded-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une chanson
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-cream border-savethedate-brown/20">
                    <DialogHeader>
                      <DialogTitle className="font-dancing text-2xl">Ajouter une chanson</DialogTitle>
                      <DialogDescription>
                        Proposez une chanson pour la playlist
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <SpotifySearch
                        onSelect={(track) => {
                          setTitle(track.title);
                          setArtist(track.artist);
                          setAlbumImage(track.image ?? '');
                          setSpotifyUrl(track.spotifyUrl);
                        }}
                      />
                      <div>
                        <label className="text-sm font-medium text-stone-700 mb-1 block">Votre prénom <span className="text-stone-400 font-normal">(optionnel)</span></label>
                        <Input
                          value={addedBy}
                          onChange={(e) => setAddedBy(e.target.value)}
                          placeholder="Ex : Marie"
                          className="bg-white border-savethedate-brown/20 rounded-sm"
                        />
                      </div>
                      <Button
                        onClick={handleAddSong}
                        disabled={!title.trim() || !artist.trim() || addSongMutation.isPending}
                        className="w-full bg-savethedate-brown text-white hover:bg-savethedate-brown/90 rounded-sm"
                      >
                        {addSongMutation.isPending ? 'Ajout…' : 'Ajouter à la playlist'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
            </div>

            {/* Liste des chansons */}
            <div className="space-y-4 relative z-10">
              {isLoading ? (
                <div className="text-center text-stone-600 py-8">Chargement...</div>
              ) : songs.length === 0 ? (
                <div className="warm-card p-8 text-center">
                  <p className="text-stone-600">Aucune chanson pour le moment. Soyez le premier à en proposer une !</p>
                </div>
              ) : (
                songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="warm-card p-6 flex items-start space-x-4 hover:shadow-[0_4px_24px_rgba(139,90,43,0.10)] hover:border-savethedate-brown/25 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 flex-grow">
                      {/* Numéro */}
                      <div className="flex-shrink-0 w-6 text-center pt-1">
                        <span className="font-sans text-sm font-light text-stone-400 tabular-nums">
                          {index + 1}
                        </span>
                      </div>

                      {/* Pochette */}
                      {song.albumImage ? (
                        <img
                          src={song.albumImage}
                          alt=""
                          className="w-12 h-12 rounded-sm object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-sm bg-savethedate-brown/10 flex-shrink-0 flex items-center justify-center">
                          <Music2 className="w-5 h-5 text-savethedate-brown/30" />
                        </div>
                      )}

                      {/* Contenu */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-dancing text-2xl text-stone-800 leading-tight">
                          {song.spotifyUrl ? (
                            <a
                              href={song.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-savethedate-brown transition-colors"
                            >
                              {song.title}
                            </a>
                          ) : song.title}
                        </h3>
                        <p className="text-stone-600 text-sm mt-0.5">
                          {song.artist}
                        </p>
                        {song.comment && (
                          <p className="text-stone-500 text-xs italic mt-2">
                            "{song.comment}"
                            {song.addedBy && ` — ${song.addedBy}`}
                          </p>
                        )}
                        {song.addedBy && !song.comment && (
                          <p className="text-stone-500 text-xs italic mt-2">
                            Proposé par {song.addedBy}
                          </p>
                        )}
                      </div>

                      {/* Vote */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleVote(song.id)}
                          className={`flex flex-col items-center justify-center w-14 h-14 border rounded-sm transition-all duration-200 group active:scale-95 ${
                            votedSongs.has(song.id)
                              ? 'bg-savethedate-brown border-savethedate-brown cursor-default'
                              : 'border-savethedate-brown/30 hover:bg-savethedate-brown/10 hover:border-savethedate-brown/50 hover:shadow-sm cursor-pointer'
                          }`}
                          disabled={votedSongs.has(song.id)}
                        >
                          <ArrowUp className={`w-5 h-5 transition-transform duration-200 ${
                            votedSongs.has(song.id) ? 'text-white' : 'text-savethedate-brown group-hover:scale-110'
                          }`} />
                          <span className={`text-xs font-semibold mt-1 transition-all duration-200 ${
                            votedSongs.has(song.id) ? 'text-white' : 'text-savethedate-brown'
                          }`}>
                            {song.votes || 0}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Note finale */}
            <div className="mt-12 p-6 warm-note relative z-10">
              <div className="text-center">
                <p className="text-stone-600 italic text-sm">
                  Plus vous êtes, meilleure sera la nuit.
                </p>
              </div>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
