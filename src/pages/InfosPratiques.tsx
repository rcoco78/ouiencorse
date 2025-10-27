import { Plane, Car, Bed, Phone, Mail, MapPin, Calendar, Clock, MessageCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Separator } from "@/components/ui/separator";

export default function InfosPratiques() {
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
                Infos pratiques
              </h1>
              <p className="font-sans text-stone-600 text-lg">
                Tout ce qu'il faut savoir pour votre venue
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {/* Transport */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Plane className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Comment venir ?
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Plane className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        En avion
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Aéroport d'Ajaccio (AJX) - Vols directs depuis Paris, Lyon, Marseille, Nice
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Car className="w-5 h-5 text-savethedate-brown mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-stone-800 mb-1">
                        Location de voiture
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Recommandée pour se déplacer facilement. Le lieu du mariage est à 15 minutes d'Ajaccio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lieu */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Le lieu
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
                    <p className="text-stone-800 font-medium mb-1">
                      Calcatoggio
                    </p>
                    <p className="text-stone-600 text-sm">
                      Le mariage se déroulera à Calcatoggio, charmant village corse à 15 minutes en voiture d'Ajaccio.
                    </p>
                  </div>
                  
                  
                </div>
              </div>

              {/* Hébergement */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Bed className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Où dormir ?
                  </h2>
                </div>
                <div className="space-y-3">
                  <p className="text-stone-600">
                    Nous vous recommandons de réserver votre hébergement à Ajaccio ou dans les environs.
                  </p>
                  
                  <div className="p-4 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
                    <p className="text-savethedate-brown font-medium mb-2 text-sm">
                      Villages et villes proches pour se loger :
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-xs text-stone-700">
                      <div>
                        <p className="font-medium mb-1 text-stone-800">À moins de 20 min :</p>
                        <ul className="space-y-1">
                          <li>• <strong>Ajaccio</strong> (15 min) - Aéroport, hôtels</li>
                          <li>• <strong>Porticcio</strong> (20 min) - Station balnéaire</li>
                          <li>• <strong>Cargèse</strong> (15 min) - Village côtier</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1 text-stone-800">À moins de 30 min :</p>
                        <ul className="space-y-1">
                          <li>• <strong>Propriano</strong> (25 min) - Port de plaisance</li>
                          <li>• <strong>Sagone</strong> (20 min) - Plage et hébergements</li>
                          <li>• <strong>Vico</strong> (30 min) - Village de montagne</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-stone-500 italic">
                    Nous vous enverrons une liste détaillée d'hébergements recommandés prochainement.
                  </p>
                </div>
              </div>

              {/* Tenue */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Tenue de mariage
                  </h2>
                </div>
                <div className="space-y-3">
                  <p className="text-stone-600">
                    <strong>Dress code :</strong> Chic et élégant, mais confortable pour la chaleur estivale corse.
                  </p>
                  <div className="p-4 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
                    <p className="text-sm text-savethedate-brown font-medium mb-2">
                      Prévoir de fortes chaleurs en juillet !
                    </p>
                    <p className="text-sm text-stone-700">
                      Privilégiez le lin et les couleurs claires pour votre confort.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">Pour les femmes :</h4>
                      <ul className="space-y-1 text-stone-600">
                        <li>• Robe ou ensemble élégant</li>
                        <li>• Éviter les talons trop hauts (terrain naturel)</li>
                        <li>• Chapeau ou accessoire soleil bienvenu</li>
                        <li>• <strong>Lin et couleurs claires recommandés</strong></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">Pour les hommes :</h4>
                      <ul className="space-y-1 text-stone-600">
                        <li>• Costume ou pantalon + chemise</li>
                        <li>• Cravate optionnelle</li>
                        <li>• Chaussures confortables</li>
                        <li>• <strong>Pas de short</strong> (même pour le brunch du dimanche)</li>
                        <li>• <strong>Lin et couleurs claires recommandés</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Questions ?
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-stone-600">
                    N'hésitez pas à nous contacter pour toute question :
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span className="text-stone-600 font-medium">WhatsApp :</span>
                    </div>
                    <div className="ml-7 space-y-1">
                      <p className="text-sm text-stone-600">Lorine : XX XX XX XX</p>
                      <p className="text-sm text-stone-600">Corentin : 06 65 76 17 11</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-stone-500 italic">
                    Nous mettrons à jour ces informations au fur et à mesure de l'organisation.
                  </p>
                </div>
              </div>
            </div>

            {/* Note importante */}
            <div className="mt-12 p-6 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-savethedate-brown mt-1" />
                <div>
                  <h3 className="font-sans font-medium text-stone-800 mb-2">
                    Informations importantes
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Le lieu exact du mariage vous sera communiqué 2 mois avant la date. 
                    En attendant, vous pouvez déjà réserver vos billets d'avion et votre hébergement à Ajaccio.
                  </p>
                </div>
              </div>
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
