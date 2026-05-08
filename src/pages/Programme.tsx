import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";

function Item({ label, detail, note }: { label: string; detail?: string; note?: string }) {
  return (
    <div className="text-center">
      <p className="font-sans font-medium text-stone-800 text-sm">{label}</p>
      {detail && <p className="text-stone-600 text-sm mt-0.5">{detail}</p>}
      {note && <p className="text-stone-400 text-xs italic mt-0.5">{note}</p>}
    </div>
  );
}

export default function Programme() {
  return (
    <div className="bg-cream min-h-screen w-full font-sans overflow-x-hidden flex flex-col">
      <div className="container mx-auto px-6 sm:px-8 flex flex-col flex-grow">
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
            <img src="/Calque_21.svg" alt="" aria-hidden className="absolute top-0 left-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 -translate-x-1/4 opacity-20 pointer-events-none" />
            <img src="/corsica2.svg" alt="" aria-hidden className="absolute top-0 right-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 translate-x-1/4 opacity-20 pointer-events-none" />
            <img src="/Calque_2.svg" alt="" aria-hidden className="absolute bottom-0 left-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] translate-y-1/4 -translate-x-1/4 opacity-20 pointer-events-none" />

            <div className="text-center mb-12 relative z-10">
              <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800 mb-4">Programme</h1>
              <p className="font-sans text-stone-600 text-lg">10-12 juillet 2026 · Corse</p>
            </div>

            <div className="relative z-10 divide-y divide-savethedate-brown/15 max-w-2xl mx-auto">
              {/* Vendredi */}
              <div className="py-10 text-center">
                <div className="mb-6">
                  <h2 className="font-dancing text-3xl text-stone-800">Vendredi 10 juillet</h2>
                  <span className="text-stone-400 text-xs italic">Pour ceux qui peuvent arriver la veille</span>
                </div>
                <div className="space-y-5">
                  <Item label="Mariage civil" detail="À Ajaccio" note="Vers 14h30 – 15h" />
                  <Item label="Après-midi plage & apéro" />
                </div>
              </div>

              {/* Samedi */}
              <div className="py-10 text-center">
                <div className="mb-6">
                  <h2 className="font-dancing text-3xl text-stone-800">Samedi 11 juillet</h2>
                  <span className="text-savethedate-brown text-xs font-medium tracking-widest uppercase">Le grand jour</span>
                </div>
                <div className="space-y-5">
                  <Item label="Calcatoggio" detail="Village corse, 25 min d'Ajaccio" />
                  <Item label="Cérémonie laïque" detail="Vers 16h30" note="Horaire à confirmer" />
                  <Item label="Cocktail, dîner & soirée dansante" />
                </div>
              </div>

              {/* Dimanche */}
              <div className="py-10 text-center">
                <div className="mb-6">
                  <h2 className="font-dancing text-3xl text-stone-800">Dimanche 12 juillet</h2>
                </div>
                <div className="space-y-5">
                  <Item label="Brunch" detail="Piscine, soleil et chill" />
                </div>
              </div>
            </div>

            <div className="mt-4 p-5 warm-note relative z-10 max-w-2xl mx-auto">
              <p className="text-center text-stone-600 italic text-sm">
                On vous donnera tous les détails quelques semaines avant. D'ici là — préparez vos plus belles histoires et vos chaussures de danse.
              </p>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
