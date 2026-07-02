import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";

const REVOLUT_URL = "https://revolut.me/corent1robert/pocket/buM4rAjzrH";
const PHOTOS_URL  = `${window.location.origin}/photos`;

function printCard(id: "photos" | "revolut") {
  document.body.classList.add(`print-${id}`);
  window.print();
  setTimeout(() => document.body.classList.remove(`print-${id}`), 500);
}

interface CardProps {
  id: "photos" | "revolut";
  title: string;
  lines: { text: string; bold?: string[] }[];
  qrValue: string;
  afterLines: string[];
}

function Card({ id, title, lines, qrValue, afterLines }: CardProps) {
  function renderLine(item: { text: string; bold?: string[] }) {
    if (!item.bold?.length) return item.text;
    let result = item.text;
    // on retourne du JSX inline via un split sur les mots en gras
    const parts: (string | JSX.Element)[] = [];
    let remaining = item.text;
    item.bold.forEach((bold, i) => {
      const idx = remaining.indexOf(bold);
      if (idx === -1) return;
      if (idx > 0) parts.push(remaining.slice(0, idx));
      parts.push(<strong key={i} className="font-semibold text-stone-800">{bold}</strong>);
      remaining = remaining.slice(idx + bold.length);
    });
    if (remaining) parts.push(remaining);
    return parts;
  }

  return (
    <div className={`qr-card-${id} screen-card`}>
      {/* Carte */}
      <div className="card-inner">
        {/* Corse */}
        <img src="/corsica2.svg" alt="" aria-hidden className="corsica-bg" />

        <div className="card-content">
          {/* Titre */}
          <h2 className="card-title font-dancing" dangerouslySetInnerHTML={{ __html: title }} />

          {/* Lignes avant QR */}
          <div className="card-body">
            {lines.map((line, i) => (
              <p key={i}>{renderLine(line)}</p>
            ))}
          </div>

          {/* QR */}
          <div className="qr-wrapper">
            <QRCodeSVG value={qrValue} size={180} bgColor="#ffffff" fgColor="#1c1917" level="M" />
          </div>

          {/* Lignes après QR */}
          <div className="card-body">
            {afterLines.map((line, i) => <p key={i}>{line}</p>)}
          </div>

          {/* Signature */}
          <p className="card-signature font-dancing">
            Lorine <span className="amp">&amp;</span> Corentin
          </p>
        </div>
      </div>

      {/* Bouton */}
      <button onClick={() => printCard(id)} className="no-print print-btn">
        <Printer size={14} />
        Imprimer
      </button>
    </div>
  );
}

export default function PrintQR() {
  return (
    <>
      <style>{`
        /* ── Styles impression ─────────────────────────────── */
        @page { margin: 0; size: 210mm 297mm portrait; }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        @media print {
          html, body { margin: 0; padding: 0; background: #FAF4EE; }
          .no-print { display: none !important; }
          .screen-header { display: none !important; }
          .screen-layout { display: block !important; }

          /* Masquer la carte non concernée */
          body.print-photos .qr-card-revolut { display: none !important; }
          body.print-revolut .qr-card-photos { display: none !important; }

          /* La carte active prend toute la page A4 */
          .screen-card { display: block !important; }
          .card-inner {
            position: fixed !important;
            inset: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            border: none !important;
            padding: 18mm 16mm !important;
            gap: 7mm !important;
          }
          .card-title  { font-size: 28pt !important; }
          .card-body   { font-size: 12pt !important; line-height: 1.7 !important; }
          .card-body p { margin: 3mm 0 !important; }
          .card-signature { font-size: 22pt !important; }
          .corsica-bg { width: 65% !important; }
          .qr-wrapper svg { width: 48mm !important; height: 48mm !important; }
          .qr-wrapper { padding: 4mm !important; }
          .amp { font-size: 16pt !important; }
        }

        /* ── Styles écran ──────────────────────────────────── */
        .screen-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 48px;
          padding: 56px 24px;
          min-height: 100vh;
          background: #FAF4EE;
          font-family: Inter, sans-serif;
        }
        .screen-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
          justify-content: center;
          align-items: flex-start;
        }
        .screen-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .card-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 360px;
          min-height: 530px;
          background: #FAF4EE;
          border: 1px solid rgba(167,152,133,0.2);
          padding: 44px 40px;
          gap: 20px;
        }
        .corsica-bg {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 65%;
          opacity: 0.05;
          pointer-events: none;
          user-select: none;
        }
        .card-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: inherit;
          width: 100%;
        }
        .card-title {
          font-size: 30px;
          color: #1c1917;
          line-height: 1.25;
          margin: 0;
        }
        .card-body {
          font-size: 15px;
          color: #57534e;
          font-weight: 300;
          line-height: 1.7;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .card-body p { margin: 0; }
        .qr-wrapper {
          background: white;
          padding: 14px;
          border: 1px solid rgba(167,152,133,0.2);
        }
        .card-signature {
          font-size: 26px;
          color: #1c1917;
          margin: 0;
        }
        .amp {
          font-family: Inter, sans-serif;
          font-weight: 100;
          font-size: 18px;
        }
        .print-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a8a29e;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .print-btn:hover { color: #A79885; }
      `}</style>

      <div className="screen-layout">
        {/* En-tête écran */}
        <div className="screen-header no-print" style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: "24px", color: "#1c1917" }}>L</span>
            <span style={{ fontWeight: 100, fontSize: "14px", color: "#1c1917" }}>&</span>
            <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: "24px", color: "#1c1917" }}>C</span>
          </div>
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a8a29e", marginTop: "6px" }}>
            Cartes à imprimer
          </p>
        </div>

        <div className="screen-cards">
          <Card
            id="photos"
            title="Le selfie miroir,<br/>notre signature…"
            lines={[
              { text: "Si vous nous connaissez, vous savez qu'on ne résiste jamais à un selfie miroir.", bold: ["selfie miroir"] },
              { text: "Alors maintenant, c'est à vous !" },
              { text: "Prenez votre plus beau selfie miroir et scannez ce QR code pour nous l'envoyer.", bold: ["scannez ce QR code"] },
            ]}
            qrValue={PHOTOS_URL}
            afterLines={[
              "Promis, on les regardera tous… même les plus gênants !",
              "Merci de nous laisser un souvenir aussi spontané qu'inoubliable.",
            ]}
          />
          <Card
            id="revolut"
            title="Un cadeau ?<br/>Avec plaisir…"
            lines={[
              { text: "Si vous souhaitez nous offrir quelque chose, on rêve d'un voyage au Japon pour notre lune de miel.", bold: ["voyage au Japon"] },
              { text: "Votre contribution, grande ou petite, nous aidera à concrétiser ce rêve." },
              { text: "Scannez ce QR code pour participer à la cagnotte.", bold: ["participer à la cagnotte"] },
            ]}
            qrValue={REVOLUT_URL}
            afterLines={[
              "Votre présence à nos côtés est déjà le plus beau des cadeaux.",
              "Merci du fond du cœur.",
            ]}
          />
        </div>
      </div>
    </>
  );
}
