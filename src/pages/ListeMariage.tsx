import { Gift, Heart, Plane, Home, Coffee } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Separator } from "@/components/ui/separator";

export default function ListeMariage() {
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
                Liste de mariage
              </h1>
              <p className="font-sans text-stone-600 text-lg">
                Votre présence est le plus beau des cadeaux
              </p>
            </div>

            {/* Message principal */}
            <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-8 mb-8">
              <div className="text-center">
                <Heart className="w-12 h-12 text-savethedate-brown mx-auto mb-4" />
                <h2 className="font-dancing text-3xl text-stone-800 mb-4">
                  Votre présence nous suffit !
                </h2>
                <p className="text-stone-600 text-lg leading-relaxed mb-6">
                  Après 12 ans ensemble, nous avons déjà tout ce dont nous avons besoin. 
                  Votre présence à nos côtés pour célébrer ce moment unique est le plus beau des cadeaux.
                </p>
                <p className="text-stone-600 text-base leading-relaxed">
                  Si vous souhaitez vraiment nous faire plaisir, nous serions ravis de recevoir 
                  une participation pour notre voyage de noces ou pour nos projets futurs.
                </p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-6">
              {/* Voyage de noces */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Plane className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Voyage de noces
                  </h2>
                </div>
                <div className="space-y-3">
                  <p className="text-stone-600">
                    Nous rêvons d'un voyage de noces au Japon pour découvrir la culture, 
                    les paysages et la gastronomie de ce pays qui nous fascine.
                  </p>
                  <div className="p-4 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
                    <p className="text-savethedate-brown font-medium mb-2 text-sm">
                      💳 Participation financière
                    </p>
                    <p className="text-stone-600 text-sm">
                      Toute contribution sera précieuse pour réaliser ce rêve. 
                      Vous pouvez nous faire un virement ou nous remettre un chèque le jour J.
                    </p>
                  </div>
                </div>
              </div>

              {/* Projets futurs */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Projets futurs
                  </h2>
                </div>
                <div className="space-y-3">
                  <p className="text-stone-600">
                    Nous avons de beaux projets en perspective : aménager notre chez-nous, 
                    voyager, et pourquoi pas fonder une famille...
                  </p>
                  <div className="p-4 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
                    <p className="text-savethedate-brown font-medium mb-2 text-sm">
                      🏠 Aménagement de la maison
                    </p>
                    <p className="text-stone-600 text-sm">
                      Nous cherchons encore notre futur chez-nous. 
                      Une participation pour l'aménagement serait très appréciée.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cadeaux traditionnels */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Si vous préférez un cadeau traditionnel
                  </h2>
                </div>
                <div className="space-y-3">
                  <p className="text-stone-600">
                    Voici quelques idées si vous souhaitez offrir un objet :
                  </p>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li>• <strong>Art de la table</strong> : Vaisselle, couverts, verres</li>
                    <li>• <strong>Cuisine</strong> : Robot, casseroles, ustensiles</li>
                    <li>• <strong>Décoration</strong> : Cadres, vases, objets déco</li>
                    <li>• <strong>Linge de maison</strong> : Draps, serviettes, nappes</li>
                    <li>• <strong>Électroménager</strong> : Aspirateur, petit électroménager</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Note finale */}
            <div className="mt-12 p-6 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
              <div className="text-center">
                <Coffee className="w-8 h-8 text-savethedate-brown mx-auto mb-3" />
                <p className="text-stone-600 italic">
                  Dans tous les cas, n'hésitez pas à nous contacter si vous avez des questions. 
                  L'important est de passer un moment magique ensemble !
                </p>
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
