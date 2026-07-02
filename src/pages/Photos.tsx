import { useState, useRef, useCallback, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { upload } from "@vercel/blob/client";
import { QRCodeSVG } from "qrcode.react";
import {
  Camera,
  Upload,
  X,
  ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const PHOTOS_URL = "/api/photos";
const SITE_URL = "https://ouiencorse.vercel.app/photos";

interface PhotoEntry {
  id: string;
  url: string;
  type: "image" | "video";
  uploaderName?: string;
  uploadedAt: string;
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function Photos() {
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const { data: photos = [], isLoading } = useQuery<PhotoEntry[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await fetch(PHOTOS_URL);
      if (!res.ok) throw new Error("Erreur de chargement");
      return res.json();
    },
    refetchInterval: 15000,
  });

  // Rafraîchissement automatique après upload
  useEffect(() => {
    if (!isUploading) {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    }
  }, [isUploading, queryClient]);

  const handleFileChange = useCallback((selected: File | null) => {
    if (!selected) return;

    const isImage = selected.type.startsWith("image/");
    const isVideo = selected.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Seules les photos et vidéos sont acceptées.");
      return;
    }

    if (isVideo) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 10) {
          toast.error("La vidéo doit faire 10 secondes maximum.");
          return;
        }
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
      };
      video.src = URL.createObjectURL(selected);
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFileChange(e.dataTransfer.files[0] ?? null);
    },
    [handleFileChange]
  );

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `wedding-photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const blob = await upload(filename, file, {
        access: "public",
        handleUploadUrl: `${PHOTOS_URL}?action=upload`,
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });

      const type = file.type.startsWith("video/") ? "video" : "image";

      await fetch(`${PHOTOS_URL}?action=metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url, type, uploaderName }),
      });

      toast.success("Photo partagée ! Merci 💛");
      setFile(null);
      setPreview(null);
      setProgress(0);
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    } catch {
      toast.error("Une erreur est survenue, réessaie.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") setLightboxIndex((i) => Math.min((i ?? 0) + 1, photos.length - 1));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => Math.max((i ?? 0) - 1, 0));
      if (e.key === "Escape") setLightboxIndex(null);
    },
    [lightboxIndex, photos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <div className="bg-cream min-h-screen w-full font-sans overflow-x-hidden flex flex-col">
      <div className="container mx-auto px-6 sm:px-8 flex flex-col flex-grow">
        {/* Header */}
        <header className="py-8 sm:py-12">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
              <span className="font-dancing text-2xl font-medium text-stone-800">L</span>
              <span className="font-sans text-sm font-thin text-stone-800">&</span>
              <span className="font-dancing text-2xl font-medium text-stone-800">C</span>
            </a>
            <Navigation />
          </div>
        </header>

        <main className="py-8 flex-grow space-y-16">
          {/* Titre */}
          <div className="text-center space-y-3">
            <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800">
              Vos photos
            </h1>
            <p className="text-stone-500 font-light text-sm tracking-wider">
              Partagez vos plus beaux moments du jour J
            </p>
          </div>

          {/* Zone d'upload */}
          <div className="max-w-lg mx-auto space-y-5">
            {!file ? (
              <div
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-savethedate-brown/30 rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-savethedate-brown/60 hover:bg-savethedate-brown/5 transition-all duration-200 group"
              >
                <div className="w-14 h-14 rounded-full bg-savethedate-brown/10 flex items-center justify-center group-hover:bg-savethedate-brown/15 transition-colors">
                  <Camera className="w-6 h-6 text-savethedate-brown" />
                </div>
                <div className="text-center">
                  <p className="text-stone-700 font-light">
                    Appuyez pour choisir une photo ou vidéo
                  </p>
                  <p className="text-stone-400 text-xs mt-1">
                    Photos · Vidéos jusqu'à 10 secondes
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden shadow-md">
                {file.type.startsWith("video/") ? (
                  <video
                    src={preview ?? ""}
                    controls
                    className="w-full max-h-80 object-contain bg-black"
                  />
                ) : (
                  <img
                    src={preview ?? ""}
                    alt="Aperçu"
                    className="w-full max-h-80 object-contain bg-stone-100"
                  />
                )}
                <button
                  onClick={() => { setFile(null); setPreview(null); setProgress(0); }}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4 text-stone-700" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />

            {file && (
              <div className="space-y-4">
                <Input
                  placeholder="Votre prénom (facultatif)"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  className="border-savethedate-brown/20 focus:border-savethedate-brown/50 bg-white/60 font-light"
                />

                {isUploading && (
                  <div className="space-y-1.5">
                    <div className="w-full bg-stone-200 rounded-full h-1.5">
                      <div
                        className="bg-savethedate-brown h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-stone-400 text-center">{progress}%</p>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-savethedate-brown hover:bg-savethedate-brown/90 text-white font-light tracking-wide"
                >
                  {isUploading ? (
                    "Envoi en cours…"
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Partager
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Galerie */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-dancing text-3xl text-stone-800">
                L'album du mariage
              </h2>
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2 text-xs text-stone-400 hover:text-savethedate-brown transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">QR Code</span>
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-stone-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <ImageIcon className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-stone-400 font-light">
                  Soyez le premier à partager une photo !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-stone-100"
                  >
                    {photo.type === "video" ? (
                      <>
                        <video
                          src={photo.url}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <Video className="w-8 h-8 text-white/90 drop-shadow" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={photo.url}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {photo.uploaderName && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">{photo.uploaderName}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {photos.length > 0 && (
              <p className="text-center text-xs text-stone-400 font-light">
                {photos.length} {photos.length === 1 ? "souvenir partagé" : "souvenirs partagés"}
              </p>
            )}
          </div>
        </main>

        <SiteFooter />
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0 overflow-hidden">
          <div className="relative flex items-center justify-center min-h-[60vh]">
            {currentPhoto?.type === "video" ? (
              <video
                src={currentPhoto.url}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full"
              />
            ) : (
              <img
                src={currentPhoto?.url}
                alt=""
                className="max-h-[80vh] max-w-full object-contain"
              />
            )}

            {/* Navigation lightbox */}
            {lightboxIndex !== null && lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i ?? 1) - 1); }}
                className="absolute left-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {lightboxIndex !== null && lightboxIndex < photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i ?? 0) + 1); }}
                className="absolute right-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Infos */}
            {currentPhoto && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4">
                <div className="flex items-center justify-between text-white/80 text-xs">
                  <span>{currentPhoto.uploaderName ?? "Anonyme"}</span>
                  <span>{formatRelativeTime(currentPhoto.uploadedAt)}</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modale QR Code */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-sm text-center space-y-5">
          <div>
            <h2 className="font-dancing text-3xl text-stone-800">QR Code</h2>
            <p className="text-stone-500 text-sm font-light mt-1">
              À imprimer sur les tables du mariage
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-100">
              <QRCodeSVG
                value={SITE_URL}
                size={180}
                bgColor="#ffffff"
                fgColor="#1c1917"
                level="M"
              />
            </div>
          </div>
          <p className="text-xs text-stone-400 break-all">{SITE_URL}</p>
          <Button
            variant="outline"
            className="w-full border-savethedate-brown/20 text-savethedate-brown hover:bg-savethedate-brown/5"
            onClick={() => window.print()}
          >
            Imprimer
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
