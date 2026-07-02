import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";

const REVOLUT_URL = "https://revolut.me/corent1robert/pocket/buM4rAjzrH";
const PHOTOS_URL  = `${window.location.origin}/photos`;

function printCard(id: "photos" | "revolut") {
  document.body.classList.add(`print-${id}`);
  window.print();
  setTimeout(() => document.body.classList.remove(`print-${id}`), 500);
}

function CardWrapper({ id, children }: { id: "photos" | "revolut"; children: React.ReactNode }) {
  return (
    <div className={`qr-card-${id} flex flex-col items-center gap-5`}>
      <div
        className="relative flex flex-col items-center justify-center text-center"
        style={{
          background: "#FAF4EE",
          width: "380px",
          minHeight: "560px",
          border: "1px solid rgba(167,152,133,0.2)",
          padding: "48px 44px",
          gap: "28px",
        }}
      >
        {/* Corse en filigrane */}
        <img
          src="/corsica2.svg"
          alt=""
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] pointer-events-none select-none"
          style={{ opacity: 0.05 }}
        />
        <div className="relative z-10 flex flex-col items-center w-full" style={{ gap: "inherit" }}>
          {children}
        </div>
      </div>

      {/* Bouton imprimer */}
      <button
        onClick={() => printCard(id)}
        className="no-print flex items-center gap-2 text-[10px] tracking-widest text-stone-400 uppercase hover:text-savethedate-brown transition-colors"
      >
        <Printer className="w-3.5 h-3.5" />
        Imprimer
      </button>
    </div>
  );
}

function PhotosCard() {
  return (
    <CardWrapper id="photos">
      {/* Titre */}
      <h2 className="font-dancing text-5xl text-stone-800 leading-snug">
        Le selfie miroir,<br />notre signature…
      </h2>

      {/* Corps */}
      <div className="space-y-4 text-stone-600 font-light text-[17px] leading-relaxed">
        <p>
          Si vous nous connaissez, vous savez qu'on ne résiste jamais à un{" "}
          <span className="font-semibold text-stone-800">selfie miroir</span>.
        </p>
        <p>Alors maintenant, c'est à vous&nbsp;!</p>
        <p>
          Prenez votre plus beau selfie miroir et{" "}
          <span className="font-semibold text-stone-800">scannez ce QR code</span>{" "}
          pour nous l'envoyer.
        </p>
      </div>

      {/* QR */}
      <div className="py-1">
        <div className="p-4 bg-white inline-block" style={{ border: "1px solid rgba(167,152,133,0.2)" }}>
          <QRCodeSVG value={PHOTOS_URL} size={150} bgColor="#ffffff" fgColor="#1c1917" level="M" />
        </div>
      </div>

      {/* Suite du texte */}
      <div className="space-y-4 text-stone-600 font-light text-[17px] leading-relaxed">
        <p>Promis, on les regardera tous… même les plus gênants&nbsp;!</p>
        <p>Merci de nous laisser un souvenir aussi spontané qu'inoubliable.</p>
      </div>

      {/* Signature */}
      <p className="font-dancing text-4xl text-stone-800 pt-1">
        Lorine <span className="font-sans font-thin text-xl">&</span> Corentin
      </p>
    </CardWrapper>
  );
}

function RevolotCard() {
  return (
    <CardWrapper id="revolut">
      {/* Titre */}
      <h2 className="font-dancing text-5xl text-stone-800 leading-snug">
        Un cadeau ?<br />Avec plaisir…
      </h2>

      {/* Corps */}
      <div className="space-y-4 text-stone-600 font-light text-[17px] leading-relaxed">
        <p>
          Si vous souhaitez nous offrir quelque chose, on rêve d'un{" "}
          <span className="font-semibold text-stone-800">voyage au Japon</span>{" "}
          pour notre lune de miel.
        </p>
        <p>Votre contribution, grande ou petite, nous aidera à concrétiser ce rêve.</p>
        <p>
          Scannez ce QR code pour{" "}
          <span className="font-semibold text-stone-800">participer à la cagnotte</span>.
        </p>
      </div>

      {/* QR */}
      <div className="py-1">
        <div className="p-4 bg-white inline-block" style={{ border: "1px solid rgba(167,152,133,0.2)" }}>
          <QRCodeSVG value={REVOLUT_URL} size={150} bgColor="#ffffff" fgColor="#1c1917" level="M" />
        </div>
      </div>

      {/* Suite */}
      <div className="space-y-4 text-stone-600 font-light text-[17px] leading-relaxed">
        <p>Votre présence à nos côtés est déjà le plus beau des cadeaux.</p>
        <p>Merci du fond du cœur.</p>
      </div>

      {/* Signature */}
      <p className="font-dancing text-4xl text-stone-800 pt-1">
        Lorine <span className="font-sans font-thin text-xl">&</span> Corentin
      </p>
    </CardWrapper>
  );
}

export default function PrintQR() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }

          body.print-photos .qr-card-revolut { display: none !important; }
          body.print-photos .qr-card-photos {
            position: fixed; inset: 0;
            display: flex; align-items: center; justify-content: center;
          }
          body.print-photos .qr-card-photos > div:first-child {
            width: 100vw !important;
            min-height: 100vh !important;
            border: none !important;
            justify-content: center !important;
          }

          body.print-revolut .qr-card-photos { display: none !important; }
          body.print-revolut .qr-card-revolut {
            position: fixed; inset: 0;
            display: flex; align-items: center; justify-content: center;
          }
          body.print-revolut .qr-card-revolut > div:first-child {
            width: 100vw !important;
            min-height: 100vh !important;
            border: none !important;
            justify-content: center !important;
          }
        }
        @page { margin: 0; size: A4 portrait; }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      `}</style>

      <div className="bg-cream min-h-screen font-sans flex flex-col items-center gap-12 py-14 px-6">
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
        <div className="flex flex-col sm:flex-row items-start justify-center gap-10 sm:gap-16">
          <PhotosCard />
          <RevolotCard />
        </div>
      </div>
    </>
  );
}
