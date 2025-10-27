import { Clock, MapPin, Utensils, Music, Heart, Calendar, Wine, Waves } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Separator } from "@/components/ui/separator";

export default function Programme() {
  return (
    <div className="bg-cream min-h-screen w-full font-sans overflow-x-hidden flex flex-col">
      <div className="container mx-auto px-6 sm:px-8 flex flex-col flex-grow">
        {/* Header */}
        <header className="py-8 sm:py-12">
          <div className="flex items-center justify-center md:justify-between">
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
        <main className="py-12 lg:py-16 flex-grow">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800 mb-4">
                Programme
              </h1>
              <p className="font-sans text-stone-600 text-lg">
                10-12 juillet 2026 • Corse
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-8">
              {/* Jour 1 - 10 Juillet */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Vendredi 10 juillet
                  </h2>
                  <span className="text-sm text-stone-500 italic">(pour ceux qui veulent)</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Heart className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        Mariage à l'église
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Cérémonie religieuse pour ceux qui souhaitent y participer
                      </p>
                      <p className="text-stone-500 text-xs italic mt-1">
                        Horaire à confirmer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        Après-midi libre
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Temps libre pour découvrir la Corse ou se reposer
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jour 2 - 11 Juillet */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Samedi 11 juillet
                  </h2>
                  <span className="text-sm text-savethedate-brown font-medium">Le grand jour !</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Heart className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        16h00 - Cérémonie laïque
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Cérémonie en plein air avec vue sur la mer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Wine className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        17h30 - Cocktail
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Apéritif avec spécialités corses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Utensils className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        21h00 - Dîner
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Menu traditionnel corse avec produits locaux
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Music className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        22h30 - Soirée dansante
                      </h3>
                      <p className="text-stone-600 text-sm">
                        DJ et ambiance festive jusqu'au bout de la nuit
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jour 3 - 12 Juillet */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Dimanche 12 juillet
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Clock className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        Brunch de 10h à 16h
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Petit-déjeuner tardif pour se remettre en douceur
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Waves className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        Piscine disponible
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Détente au bord de la piscine pour ceux qui le souhaitent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-12 p-6 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
              <p className="text-center text-stone-600 italic">
                Les horaires et lieux exacts seront communiqués plus proche de la date. 
                En attendant, préparez-vous à 3 jours magiques en Corse ! ✨
              </p>
            </div>
          </div>
        </main>

        <footer className="py-8 text-center">
          <Separator className="my-4 bg-savethedate-brown/20" />
          <div className="flex justify-center items-center">
            <p className="font-sans text-xs font-light tracking-widest text-stone-500">
              10-12.07.2026
              <span className="mx-2 text-stone-400">•</span>
              Calcatoggio, Corse
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
