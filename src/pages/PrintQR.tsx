import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const REVOLUT_URL = "https://revolut.me/corent1robert/pocket/buM4rAjzrH";
const PHOTOS_URL  = `${window.location.origin}/photos`;

interface QRCardProps {
  qrValue: string;
  title: string;
  subtitle: string;
  instruction: string;
}

function QRCard({ qrValue, title, subtitle, instruction }: QRCardProps) {
  return (
    <div
      className="qr-card flex flex-col items-center justify-center gap-5 p-10"
      style={{
        background: "#FAF4EE",
        width: "100%",
        maxWidth: "360px",
        border: "1px solid rgba(167,152,133,0.2)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center space-x-1">
        <span className="font-dancing text-xl font-medium text-stone-800">L</span>
        <span className="font-sans text-xs font-thin text-stone-800">&</span>
        <span className="font-dancing text-xl font-medium text-stone-800">C</span>
      </div>

      {/* Séparateur fin */}
      <div className="w-12 h-px bg-savethedate-brown/30" />

      {/* Titre */}
      <div className="text-center space-y-1">
        <h2 className="font-dancing text-3xl text-stone-800">{title}</h2>
        <p className="text-xs tracking-widest text-stone-400 uppercase">{subtitle}</p>
      </div>

      {/* QR Code */}
      <div className="p-4 bg-white rounded-sm shadow-sm" style={{ border: "1px solid rgba(167,152,133,0.15)" }}>
        <QRCodeSVG
          value={qrValue}
          size={160}
          bgColor="#ffffff"
          fgColor="#1c1917"
          level="M"
        />
      </div>

      {/* Instruction */}
      <p className="text-center text-xs text-stone-500 font-light leading-relaxed max-w-[200px]">
        {instruction}
      </p>

      {/* Date */}
      <div className="flex items-center gap-2 text-[10px] tracking-widest text-stone-400 uppercase">
        <span>11 . 07 . 2026</span>
        <span className="text-stone-300">·</span>
        <span>Calcatoggio</span>
      </div>
    </div>
  );
}

export default function PrintQR() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; margin: 0; }
          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            width: 100%;
            height: 100vh;
          }
          .qr-card {
            max-width: 100% !important;
            height: 100%;
            border: none !important;
            page-break-inside: avoid;
          }
        }
        @page { margin: 1cm; size: A4 landscape; }
      `}</style>

      <div className="bg-cream min-h-screen font-sans">
        {/* Bouton imprimer */}
        <div className="no-print flex justify-center pt-10 pb-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-1">
              <span className="font-dancing text-2xl font-medium text-stone-800">L</span>
              <span className="font-sans text-sm font-thin text-stone-800">&</span>
              <span className="font-dancing text-2xl font-medium text-stone-800">C</span>
            </div>
            <p className="text-xs tracking-widest text-stone-400 uppercase">Cartes à imprimer</p>
            <Button
              onClick={() => window.print()}
              className="bg-savethedate-brown hover:bg-savethedate-brown/90 text-white font-light tracking-wide"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer les deux cartes
            </Button>
          </div>
        </div>

        {/* Les deux cartes */}
        <div className="print-grid flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 px-6 pb-12">
          <QRCard
            qrValue={PHOTOS_URL}
            title="Vos photos"
            subtitle="Album du mariage"
            instruction="Scannez pour partager vos photos et vidéos dans notre album commun"
          />
          <QRCard
            qrValue={REVOLUT_URL}
            title="La cagnotte"
            subtitle="Voyage de noces"
            instruction="Scannez pour participer à notre voyage de noces — merci du fond du cœur"
          />
        </div>
      </div>
    </>
  );
}
