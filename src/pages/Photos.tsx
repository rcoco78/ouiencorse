import { useState, useRef, useCallback, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { upload } from "@vercel/blob/client";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import {
  Camera,
  Upload,
  X,
  ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Sparkles,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PHOTOS_URL = "/api/photos";
const SITE_URL = `${window.location.origin}/photos`;

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

async function downloadPhoto(url: string, type: "image" | "video") {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `souvenir-mariage-L&C.${type === "video" ? "mp4" : "jpg"}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  } catch {
    window.open(url, "_blank");
  }
}

function sanitizeName(name: string) {
  return (
    name
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 20) || "anonyme"
  );
}

function fireConfetti() {
  const colors = ["#c4a882", "#d4b896", "#e8d5b7", "#f5ece0", "#8b7355"];
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    shapes: ["circle", "square"],
    scalar: 0.9,
  });
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.2, y: 0.7 },
      colors,
      scalar: 0.8,
    });
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.8, y: 0.7 },
      colors,
      scalar: 0.8,
    });
  }, 200);
}

interface MasonryGridProps {
  photos: PhotoEntry[];
  onPhotoClick: (idx: number) => void;
  visibleCount: number;
}

function MasonryGrid({ photos, onPhotoClick, visibleCount }: MasonryGridProps) {
  return (
    <div className="columns-2 sm:columns-3 gap-2 sm:gap-3 space-y-0">
      {photos.map((photo, idx) => (
        <div
          key={photo.id}
          onClick={() => onPhotoClick(idx)}
          className="break-inside-avoid mb-2 sm:mb-3 relative rounded-lg overflow-hidden cursor-pointer group bg-stone-100"
          style={{
            animation: idx < visibleCount
              ? `fadeSlideIn 0.5s ease-out ${Math.min(idx, 8) * 60}ms both`
              : "none",
            opacity: idx < visibleCount ? undefined : 0,
          }}
        >
          {photo.type === "video" ? (
            <>
              <video
                src={photo.url}
                className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                muted
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Video className="w-5 h-5 text-white drop-shadow" />
                </div>
              </div>
            </>
          ) : (
            <img
              src={photo.url}
              alt=""
              loading="lazy"
              className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          )}

          {/* Overlay nom au survol */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-xs truncate font-light">
              {photo.uploaderName ?? "Anonyme"} · {formatRelativeTime(photo.uploadedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
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
  const [isDragging, setIsDragging] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const prevCountRef = useRef(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: photos = [], isLoading } = useQuery<PhotoEntry[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await fetch(PHOTOS_URL);
      if (!res.ok) throw new Error("Erreur de chargement");
      return res.json();
    },
    refetchInterval: 15000,
  });

  // Notification live quand de nouvelles photos arrivent (hors upload personnel)
  useEffect(() => {
    if (prevCountRef.current > 0 && photos.length > prevCountRef.current && !isUploading) {
      const diff = photos.length - prevCountRef.current;
      toast(`${diff === 1 ? "Nouvelle photo" : `${diff} nouvelles photos`} partagée${diff > 1 ? "s" : ""} ! ✨`, {
        duration: 4000,
      });
    }
    if (photos.length > visibleCount) {
      setVisibleCount(photos.length);
    }
    prevCountRef.current = photos.length;
  }, [photos.length]);

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
      setIsDragging(false);
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
      const type = file.type.startsWith("video/") ? "vid" : "img";
      const name = sanitizeName(uploaderName);
      // Métadonnées encodées dans le nom de fichier — pas de race condition possible
      const filename = `wedding-photos/${Date.now()}_${type}_${name}.${ext}`;

      const blob = await upload(filename, file, {
        access: "public",
        handleUploadUrl: `${PHOTOS_URL}?action=upload`,
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });

      // Ajout immédiat dans la galerie sans attendre le rechargement
      const newPhoto: PhotoEntry = {
        id: filename,
        url: blob.url,
        type: type === "vid" ? "video" : "image",
        uploaderName: uploaderName.trim() || undefined,
        uploadedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<PhotoEntry[]>(["photos"], (old = []) => [newPhoto, ...old]);

      fireConfetti();
      toast.success("Merci, c'est dans l'album ! 💛");
      setFile(null);
      setPreview(null);
      setProgress(0);
      // Refetch en arrière-plan pour synchroniser
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
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes pulseBorder {
          0%, 100% { border-color: rgba(139, 115, 85, 0.4); }
          50%       { border-color: rgba(139, 115, 85, 0.9); box-shadow: 0 0 20px rgba(139, 115, 85, 0.15); }
        }
      `}</style>

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
            <div className="text-center space-y-3" style={{ animation: "fadeSlideIn 0.6s ease-out both" }}>
              <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800">
                Vos photos
              </h1>
              <p className="text-stone-500 font-light text-sm tracking-wider">
                Partagez vos plus beaux moments du jour J
              </p>
            </div>

            {/* Zone d'upload */}
            <div
              className="max-w-lg mx-auto space-y-5"
              style={{ animation: "fadeSlideIn 0.6s ease-out 0.1s both" }}
            >
              {!file ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 group"
                  style={{
                    borderColor: isDragging ? "rgba(139,115,85,0.9)" : "rgba(139,115,85,0.3)",
                    background: isDragging ? "rgba(139,115,85,0.06)" : "transparent",
                    animation: isDragging ? "pulseBorder 1s ease-in-out infinite" : "none",
                    transform: isDragging ? "scale(1.01)" : "scale(1)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isDragging ? "rgba(139,115,85,0.15)" : "rgba(139,115,85,0.08)",
                      transform: isDragging ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <Camera
                      className="w-7 h-7 transition-colors duration-300"
                      style={{ color: isDragging ? "#6b5537" : "#8b7355" }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-stone-700 font-light">
                      {isDragging ? "Lâchez pour ajouter !" : "Appuyez pour choisir une photo ou vidéo"}
                    </p>
                    <p className="text-stone-400 text-xs mt-1">
                      Photos · Vidéos jusqu'à 10 secondes
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="relative rounded-xl overflow-hidden shadow-md"
                  style={{ animation: "fadeSlideIn 0.4s ease-out both" }}
                >
                  {file.type.startsWith("video/") ? (
                    <video src={preview ?? ""} controls className="w-full max-h-80 object-contain bg-black" />
                  ) : (
                    <img src={preview ?? ""} alt="Aperçu" className="w-full max-h-80 object-contain bg-stone-100" />
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
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />

              {file && (
                <div className="space-y-4" style={{ animation: "fadeSlideIn 0.3s ease-out both" }}>
                  <Input
                    placeholder="Votre prénom (facultatif)"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    className="border-savethedate-brown/20 focus:border-savethedate-brown/50 bg-white/60 font-light"
                  />

                  {isUploading && (
                    <div className="space-y-1.5">
                      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
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
                    className="w-full bg-savethedate-brown hover:bg-savethedate-brown/90 text-white font-light tracking-wide transition-all duration-200 active:scale-[0.98]"
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Partager dans l'album
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Galerie */}
            <div className="space-y-6" style={{ animation: "fadeSlideIn 0.6s ease-out 0.2s both" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-dancing text-3xl text-stone-800">L'album</h2>
                  {photos.length > 0 && (
                    <span className="text-xs text-stone-400 font-light tabular-nums">
                      {photos.length} {photos.length === 1 ? "souvenir" : "souvenirs"}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowQR(true)}
                  className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-savethedate-brown transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">QR Code</span>
                </button>
              </div>

              {isLoading ? (
                <div className="columns-2 sm:columns-3 gap-2 sm:gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="break-inside-avoid mb-2 sm:mb-3 bg-stone-200 rounded-lg animate-pulse"
                      style={{ height: `${[180, 240, 160, 220, 200, 260][i]}px` }}
                    />
                  ))}
                </div>
              ) : photos.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto">
                    <Sparkles className="w-7 h-7 text-stone-300" />
                  </div>
                  <div>
                    <p className="text-stone-500 font-light">L'album est vide pour l'instant</p>
                    <p className="text-stone-400 text-sm font-light mt-1">Soyez le premier à partager un souvenir !</p>
                  </div>
                </div>
              ) : (
                <MasonryGrid photos={photos} onPhotoClick={setLightboxIndex} visibleCount={visibleCount} />
              )}
            </div>
          </main>

          <SiteFooter />
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-0 overflow-hidden">
          <div className="relative flex items-center justify-center min-h-[60vh]">
            {currentPhoto?.type === "video" ? (
              <video src={currentPhoto.url} controls autoPlay className="max-h-[85vh] max-w-full" />
            ) : (
              <img src={currentPhoto?.url} alt="" className="max-h-[85vh] max-w-full object-contain" />
            )}

            {lightboxIndex !== null && lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i ?? 1) - 1); }}
                className="absolute left-3 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full p-2.5 text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {lightboxIndex !== null && lightboxIndex < photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i ?? 0) + 1); }}
                className="absolute right-3 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full p-2.5 text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {currentPhoto && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
                <div className="flex items-center justify-between text-white/70 text-xs font-light">
                  <span>{currentPhoto.uploaderName ?? "Anonyme"}</span>
                  <div className="flex items-center gap-3">
                    <span>{formatRelativeTime(currentPhoto.uploadedAt)}</span>
                    <button
                      onClick={() => downloadPhoto(currentPhoto.url, currentPhoto.type)}
                      className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-sm text-center space-y-5">
          <div>
            <h2 className="font-dancing text-3xl text-stone-800">QR Code</h2>
            <p className="text-stone-500 text-sm font-light mt-1">À imprimer sur les tables du mariage</p>
          </div>
          <div className="flex justify-center">
            <div className="p-5 bg-white rounded-2xl shadow-sm border border-stone-100">
              <QRCodeSVG value={SITE_URL} size={180} bgColor="#ffffff" fgColor="#1c1917" level="M" />
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
    </>
  );
}
