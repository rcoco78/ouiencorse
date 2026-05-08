import { Navigation } from "@/components/Navigation";
import { LogoMonogram } from "@/components/LogoMonogram";
import { SiteFooter } from "@/components/SiteFooter";

export default function Index() {
  return (
    <div className="bg-cream min-h-screen w-full font-sans overflow-x-hidden flex flex-col">
      <div className="container mx-auto px-6 sm:px-8 flex flex-col flex-grow">
        {/* Header */}
        <header className="py-8 sm:py-12">
          <div className="flex items-center justify-between">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <LogoMonogram />
            </a>
            <Navigation />
          </div>
        </header>

        {/* Hero Section */}
        <main className="py-12 lg:py-16 flex-grow">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* SVG Section */}
            <div className="order-2 lg:order-1 flex justify-center items-center">
              <div className="relative">
                {/* Corse en fond, déborde derrière la photo */}
                <img
                  src="/corsica2.svg"
                  alt=""
                  aria-hidden
                  className="absolute -top-16 -right-16 z-0 w-[70%] opacity-50 pointer-events-none select-none"
                />
                {/* Photo au-dessus */}
                <div className="relative overflow-hidden rounded shadow-xl group z-10">
                  <img
                    src="/lovable-uploads/2.png"
                    alt="Couple"
                    className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2">
              <div className="font-dancing text-5xl sm:text-6xl lg:text-7xl">
                <h2>Wedding</h2>
                <h2 className="-mt-2 sm:-mt-4">Day</h2>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-3 my-6 sm:my-8">
                <p className="font-sans text-[#6E6E6E] tracking-[0.2em] text-base sm:text-lg">
                11 . 07 . 2026
              </p>
                <span className="text-stone-400 pb-1">•</span>
                <p className="font-sans text-stone-500 text-sm tracking-wider">
                  Calcatoggio
                </p>
              </div>

              <p className="text-gray-600 max-w-md leading-relaxed font-light text-sm sm:text-base text-justify">
                On est très heureux de vous embarquer dans cette belle aventure :
                notre mariage ! Cap sur la Corse, entre mer et maquis, une île
                qu'on aime profondément. On a hâte de vivre ce moment unique
                avec vous, entourés de soleil, d'amour, de notre famille et de
                nos amis.
              </p>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
