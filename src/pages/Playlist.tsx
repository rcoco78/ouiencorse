import { Music, Heart, Plus, Vote, Play } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Playlist() {
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
                Playlist collaborative
              </h1>
              <p className="font-sans text-stone-600 text-lg">
                Aidez-nous à créer la playlist parfaite pour notre soirée
              </p>
            </div>

            {/* Message principal */}
            <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-8 mb-8">
              <div className="text-center">
                <Music className="w-12 h-12 text-savethedate-brown mx-auto mb-4" />
                <h2 className="font-dancing text-3xl text-stone-800 mb-4">
                  Participez à notre playlist !
                </h2>
                <p className="text-stone-600 text-lg leading-relaxed mb-6">
                  Nous voulons que notre soirée soit inoubliable avec les chansons qui nous rassemblent. 
                  Proposez vos morceaux préférés et votez pour ceux des autres invités.
                </p>
                <p className="text-stone-600 text-base leading-relaxed">
                  La playlist finale sera créée à partir des suggestions les plus votées !
                </p>
              </div>
            </div>

            {/* Comment participer */}
            <div className="space-y-6">
              {/* Comment proposer */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Comment proposer une chanson ?
                  </h2>
                </div>
                <div className="space-y-3">
                  <p className="text-stone-600">
                    Envoyez-nous vos suggestions par WhatsApp avec :
                  </p>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li>• <strong>Titre</strong> de la chanson</li>
                    <li>• <strong>Artiste</strong></li>
                    <li>• <strong>Pourquoi</strong> cette chanson vous fait penser à nous</li>
                  </ul>
                  <div className="p-4 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
                    <p className="text-savethedate-brown font-medium mb-2 text-sm">
                      📱 Exemple de message
                    </p>
                    <p className="text-stone-600 text-sm italic">
                      "Salut ! Je propose 'La Vie en Rose' d'Édith Piaf - 
                      ça me fait penser à votre amour romantique 💕"
                    </p>
                  </div>
                </div>
              </div>

              {/* Comment voter */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Vote className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Comment voter ?
                  </h2>
                </div>
                <div className="space-y-3">
                  <p className="text-stone-600">
                    Nous publierons régulièrement les suggestions reçues. 
                    Vous pourrez voter en réagissant aux messages :
                  </p>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li>• <strong>❤️</strong> = J'adore cette chanson !</li>
                    <li>• <strong>👍</strong> = C'est une bonne idée</li>
                    <li>• <strong>🎵</strong> = Parfait pour danser</li>
                  </ul>
                </div>
              </div>

              {/* Suggestions déjà reçues */}
              <div className="bg-white rounded-lg shadow-sm border border-savethedate-brown/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-savethedate-brown/10 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-savethedate-brown" />
                  </div>
                  <h2 className="font-sans font-semibold text-xl text-stone-800">
                    Suggestions reçues
                  </h2>
                </div>
                <div className="space-y-3">
                  <p className="text-stone-600 mb-4">
                    Voici les premières suggestions de nos invités :
                  </p>
                  
                  {/* Exemples de suggestions */}
                  <div className="space-y-3">
                    <div className="p-4 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-stone-800">La Vie en Rose</p>
                          <p className="text-sm text-stone-600">Édith Piaf</p>
                        </div>
                        <div className="flex space-x-1">
                          <span className="text-red-500 text-sm">❤️ 5</span>
                          <span className="text-blue-500 text-sm">👍 3</span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-500 italic">
                        "Ça me fait penser à votre amour romantique" - Marie
                      </p>
                    </div>

                    <div className="p-4 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-stone-800">September</p>
                          <p className="text-sm text-stone-600">Earth, Wind & Fire</p>
                        </div>
                        <div className="flex space-x-1">
                          <span className="text-red-500 text-sm">❤️ 8</span>
                          <span className="text-green-500 text-sm">🎵 6</span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-500 italic">
                        "Parfait pour danser et faire la fête !" - Pierre
                      </p>
                    </div>

                    <div className="p-4 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-stone-800">All of Me</p>
                          <p className="text-sm text-stone-600">John Legend</p>
                        </div>
                        <div className="flex space-x-1">
                          <span className="text-red-500 text-sm">❤️ 12</span>
                          <span className="text-blue-500 text-sm">👍 4</span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-500 italic">
                        "Une chanson d'amour magnifique pour votre premier slow" - Sophie
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note finale */}
            <div className="mt-12 p-6 bg-savethedate-brown/5 rounded-lg border border-savethedate-brown/20">
              <div className="text-center">
                <Heart className="w-8 h-8 text-savethedate-brown mx-auto mb-3" />
                <p className="text-stone-600 italic">
                  Merci de participer à cette playlist collaborative ! 
                  Plus il y aura de suggestions, plus la soirée sera magique 🎵✨
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
