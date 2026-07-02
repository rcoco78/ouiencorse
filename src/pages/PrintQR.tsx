import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";

const REVOLUT_URL = "https://revolut.me/corent1robert/pocket/buM4rAjzrH";
const PHOTOS_URL  = `${window.location.origin}/photos`;

function printCard(id: "photos" | "revolut") {
  document.body.classList.add(`print-${id}`);
  window.print();
  // Petit délai pour que le navigateur retire la classe après l'impression
  setTimeout(() => document.body.classList.remove(`print-${id}`), 500);
}

interface QRCardProps {
  id: "photos" | "revolut";
  qrValue: string;
  title: string;
  subtitle: string;
  instruction: string;
}

function QRCard({ id, qrValue, title, subtitle, instruction }: QRCardProps) {
  return (
    <div className={`qr-card-${id} flex flex-col items-center gap-6`}>
      {/* Carte */}
      <div
        className="relative flex flex-col items-center justify-center gap-5 p-10 overflow-hidden"
        style={{
          background: "#FAF4EE",
          width: "320px",
          border: "1px solid rgba(167,152,133,0.25)",
        }}
      >
        {/* Corse en fond */}
        <img
          src="/corsica2.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          style={{ opacity: 0.04 }}
        />
        {/* Contenu au-dessus du fond */}
        <div className="relative z-10 flex flex-col items-center gap-5 w-full">

        {/* Logo */}
        <div className="flex items-center space-x-1">
          <span className="font-dancing text-xl font-medium text-stone-800">L</span>
          <span className="font-sans text-xs font-thin text-stone-800">&</span>
          <span className="font-dancing text-xl font-medium text-stone-800">C</span>
        </div>

        <div className="w-10 h-px bg-savethedate-brown/30" />

        {/* Titre */}
        <div className="text-center space-y-1">
          <h2 className="font-dancing text-3xl text-stone-800">{title}</h2>
          <p className="text-[10px] tracking-widest text-stone-400 uppercase">{subtitle}</p>
        </div>

        {/* QR */}
        <div className="p-4 bg-white" style={{ border: "1px solid rgba(167,152,133,0.15)" }}>
          <QRCodeSVG value={qrValue} size={168} bgColor="#ffffff" fgColor="#1c1917" level="M" />
        </div>

        {/* Instruction */}
        <p className="text-center text-xs text-stone-500 font-light leading-relaxed max-w-[190px]">
          {instruction}
        </p>

        {/* Date */}
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-stone-400 uppercase">
          <span>11 . 07 . 2026</span>
          <span className="text-stone-300">·</span>
          <span>Calcatoggio</span>
        </div>

        </div>{/* fin z-10 */}
      </div>

      {/* Bouton imprimer — masqué à l'impression */}
      <button
        onClick={() => printCard(id)}
        className="no-print flex items-center gap-2 text-xs tracking-widest text-stone-400 uppercase hover:text-savethedate-brown transition-colors"
      >
        <Printer className="w-3.5 h-3.5" />
        Imprimer
      </button>
    </div>
  );
}

export default function PrintQR() {
  return (
    <>
      <style>{`
        /* Par défaut à l'impression : tout masquer sauf si un mode est actif */
        @media print {
          .no-print { display: none !important; }

          /* Impression carte photos uniquement */
          body.print-photos .qr-card-revolut { display: none !important; }
          body.print-photos .qr-card-photos {
            position: fixed; inset: 0;
            display: flex; align-items: center; justify-content: center;
          }

          /* Impression carte revolut uniquement */
          body.print-revolut .qr-card-photos { display: none !important; }
          body.print-revolut .qr-card-revolut {
            position: fixed; inset: 0;
            display: flex; align-items: center; justify-content: center;
          }
        }

        @page { margin: 0; size: A5 portrait; }
      `}</style>

      <div className="bg-cream min-h-screen font-sans flex flex-col items-center justify-center gap-16 py-16 px-6">
        {/* En-tête */}
        <div className="no-print text-center space-y-2">
          <div className="flex items-center justify-center space-x-1">
            <span className="font-dancing text-2xl font-medium text-stone-800">L</span>
            <span className="font-sans text-sm font-thin text-stone-800">&</span>
            <span className="font-dancing text-2xl font-medium text-stone-800">C</span>
          </div>
          <p className="text-xs tracking-widest text-stone-400 uppercase">Cartes à imprimer</p>
        </div>

        {/* Les deux cartes */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20">
          <QRCard
            id="photos"
            qrValue={PHOTOS_URL}
            title="Vos photos"
            subtitle="Album du mariage"
            instruction="Scannez pour partager vos photos et vidéos dans notre album commun"
          />
          <QRCard
            id="revolut"
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
