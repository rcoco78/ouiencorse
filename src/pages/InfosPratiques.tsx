import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";

function Item({ label, detail }: { label: string; detail?: string }) {
  return (
    <div className="text-center">
      <p className="font-sans font-medium text-stone-800 text-sm">{label}</p>
      {detail && <p className="text-stone-600 text-sm mt-0.5">{detail}</p>}
    </div>
  );
}

export default function InfosPratiques() {
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
              <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800 mb-4">Infos pratiques</h1>
              <p className="font-sans text-stone-600 text-lg">Tout ce qu'il faut savoir pour votre venue</p>
            </div>

            <div className="relative z-10 divide-y divide-savethedate-brown/15 max-w-2xl mx-auto">

              {/* Comment venir */}
              <div className="py-10 text-center">
                <h2 className="font-dancing text-3xl text-stone-800 mb-6">Comment venir ?</h2>
                <div className="space-y-5">
                  <Item label="En avion" detail="Aéroport d'Ajaccio (AJX) — vols directs depuis Paris, Lyon, Marseille, Nice" />
                  <Item label="Location de voiture" detail="Recommandée : le lieu est à 25-30 min d'Ajaccio" />
                </div>
              </div>

              {/* Le lieu */}
              <div className="py-10 text-center">
                <h2 className="font-dancing text-3xl text-stone-800 mb-6">Le lieu</h2>
                <div className="mb-6">
                  <p className="font-medium text-stone-800">Calcatoggio</p>
                  <p className="text-stone-500 text-sm mt-0.5">Village corse, 25-30 min en voiture d'Ajaccio</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <img src="https://sf2.telestar.fr/wp-content/uploads/telestarv2/2025/06/capture-decran-2025-06-19-a-08.54.01-645x428.png" alt="Calcatoggio" className="w-full h-44 object-cover rounded-sm" />
                  <img src="https://media-cdn.tripadvisor.com/media/photo-s/02/d8/79/99/plage-de-la-liscia.jpg" alt="Plage de la Liscia" className="w-full h-44 object-cover rounded-sm" />
                  <img src="https://pictures.corsematin.com/cdn-cgi/image/width=800,format=auto,quality=80/media/melody/2023/06/28/la-tour-ferme-la-baie-de-la-liscia-au-sud-dans-le-golfe-de-saone-depuis-le-xvie-siecle-elle-a-ete-ac_e0a057e645436c4a057e6454388a05v_.jpg" alt="Tour de la Liscia" className="w-full h-44 object-cover rounded-sm" />
                </div>
              </div>

              {/* Hébergement */}
              <div className="py-10 text-center">
                <h2 className="font-dancing text-3xl text-stone-800 mb-6">Où dormir ?</h2>
                <div className="space-y-7">
                  <div>
                    <p className="text-stone-400 text-xs uppercase tracking-widest mb-3">Hôtels & résidences</p>
                    <ul className="space-y-2 text-sm text-stone-600">
                      {["Le Castel d'Orcino", "Roc e Mare", "Les sables blancs de la Liscia", "Le Grand Bleu – Club Lookea", "L'Hôtel A Rena d'Oru", "La Résidence Punta Paliagi", "L'allegria"].map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-stone-400 text-xs uppercase tracking-widest mb-3">Maisons & locations</p>
                    <ul className="space-y-2 text-sm">
                      {[
                        { label: "Ruone", href: "https://www.ruone.fr" },
                        { label: "Casa Cinarca", href: "https://www.casa-cinarca.com" },
                        { label: "Airbnb – sélection spéciale", href: "https://www.airbnb.com/l/e81x6Q2h" },
                      ].map(({ label, href }) => (
                        <li key={href}>
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-savethedate-brown hover:underline underline-offset-2">{label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tenue */}
              <div className="py-10 text-center">
                <h2 className="font-dancing text-3xl text-stone-800 mb-4">Tenue</h2>
                <p className="text-stone-600 text-sm">Pas de thème exigé.</p>
                <p className="text-stone-400 text-xs italic mt-2">Si possible, évitez les gros motifs — et pensez qu'il fera chaud.</p>
              </div>

              {/* Contact */}
              <div className="py-10 text-center">
                <h2 className="font-dancing text-3xl text-stone-800 mb-6">Questions ?</h2>
                <p className="text-stone-600 text-sm mb-5">Écrivez-nous directement :</p>
                <div className="space-y-3 text-sm">
                  <p className="text-stone-700">
                    <span className="font-medium">Lorine</span>
                    <span className="text-stone-400 mx-2">—</span>
                    06 75 06 99 59
                  </p>
                  <p className="text-stone-700">
                    <span className="font-medium">Corentin</span>
                    <span className="text-stone-400 mx-2">—</span>
                    06 65 76 17 11
                  </p>
                </div>
                <p className="text-stone-400 text-xs italic mt-5">
                  On met à jour ces infos au fur et à mesure.
                </p>
              </div>

            </div>

            <div className="mt-4 p-5 warm-note relative z-10 max-w-2xl mx-auto">
              <p className="text-center text-stone-600 italic text-sm">
                Le lieu exact vous sera communiqué 2 mois avant la date. En attendant, réservez vos billets et votre hébergement à Ajaccio.
              </p>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
