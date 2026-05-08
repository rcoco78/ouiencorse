import { Gift, Plane, Home, Copy, Check } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { useState } from "react";
import { toast } from "sonner";

// ── À compléter par les mariés ───────────────────────────────────────────────
const CAGNOTTE_URL = ""; // ex: https://www.leetchi.com/…
const IBAN = "";         // ex: FR76 XXXX XXXX XXXX XXXX XXXX XXX
const BIC = "";
// ─────────────────────────────────────────────────────────────────────────────

interface GiftCategory {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  detail: string;
  action?: { label: string; href?: string; copy?: string };
}

const CATEGORIES: GiftCategory[] = [
  {
    id: "voyage",
    icon: Plane,
    title: "Voyage de noces",
    description: "Notre aventure au Japon",
    detail:
      "Après 12 ans ensemble, on rêve de découvrir le Japon pour notre voyage de noces. Votre participation, même modeste, nous aidera à concrétiser ce rêve.",
    action: CAGNOTTE_URL
      ? { label: "Participer à la cagnotte", href: CAGNOTTE_URL }
      : undefined,
  },
  {
    id: "maison",
    icon: Home,
    title: "Notre futur chez-nous",
    description: "Aménagement & projets",
    detail:
      "On cherche encore notre nid douillet. Une contribution pour l'aménagement ou de futurs projets serait magnifique.",
    action: IBAN
      ? { label: "Copier l'IBAN", copy: IBAN }
      : undefined,
  },
  {
    id: "cadeaux",
    icon: Gift,
    title: "Cadeaux traditionnels",
    description: "Art de la table, linge, déco…",
    detail:
      "Si vous préférez offrir quelque chose de concret : art de la table (vaisselle, couverts, verres), cuisine (robot, casseroles), décoration, linge de maison ou petit électroménager.",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("IBAN copié !");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center space-x-2 text-sm text-savethedate-brown border border-savethedate-brown/30 rounded-sm px-3 py-2 hover:bg-savethedate-brown/5 transition-colors"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? "Copié !" : text}</span>
    </button>
  );
}

export default function ListeMariage() {
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

        <main className="py-12 lg:py-16 flex-grow relative">
          <div className="max-w-4xl mx-auto relative">
            {/* Décors */}
            <img src="/Calque_21.svg" alt="" aria-hidden className="absolute top-0 left-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 -translate-x-1/4 opacity-20 pointer-events-none" />
            <img src="/corsica2.svg" alt="" aria-hidden className="absolute top-0 right-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 translate-x-1/4 opacity-20 pointer-events-none" />
            <img src="/Calque_2.svg" alt="" aria-hidden className="absolute bottom-0 left-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] translate-y-1/4 -translate-x-1/4 opacity-20 pointer-events-none" />

            {/* Titre + intro éditorial */}
            <div className="text-center mb-2 relative z-10 max-w-2xl mx-auto">
              <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800 mb-8">
                Liste de Mariage
              </h1>
              <p className="font-dancing text-2xl text-stone-700 mb-3">
                Votre présence nous suffit.
              </p>
              <p className="text-stone-600 leading-relaxed text-sm max-w-md mx-auto">
                Après 12 ans ensemble, on a déjà tout ce dont on a besoin. Votre présence à nos côtés est le plus beau des cadeaux.
              </p>
              <p className="text-stone-400 text-sm mt-3 italic">
                Si vous tenez à nous faire un cadeau, voici ce qui nous toucherait vraiment.
              </p>
            </div>

            {/* Catégories — éditorial avec dividers */}
            <div className="relative z-10 divide-y divide-savethedate-brown/15 max-w-2xl mx-auto mt-4">
              {CATEGORIES.map(({ id, icon: Icon, title, description, detail, action }) => (
                <div key={id} className="py-10 text-center">
                  <div className="mb-2">
                    <h2 className="font-dancing text-3xl text-stone-800">{title}</h2>
                    <span className="text-savethedate-brown text-xs tracking-wide">{description}</span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-5 max-w-md mx-auto">{detail}</p>
                  {action && (
                    action.href ? (
                      <a href={action.href} target="_blank" rel="noopener noreferrer"
                        className="warm-cta inline-flex items-center text-sm bg-savethedate-brown text-white rounded-sm px-4 py-2 hover:bg-savethedate-brown/90 transition-colors">
                        {action.label}
                      </a>
                    ) : action.copy ? (
                      <div className="flex flex-col items-center">
                        <p className="text-stone-400 text-xs mb-2">IBAN pour virement</p>
                        <CopyButton text={action.copy} />
                      </div>
                    ) : null
                  )}
                </div>
              ))}
            </div>

            {/* Note finale */}
            <div className="mt-4 p-5 warm-note relative z-10 max-w-2xl mx-auto">
              <p className="text-center text-stone-600 italic text-sm">
                Des questions sur la liste ? Écrivez-nous. La seule chose indispensable, c'est vous.
              </p>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
