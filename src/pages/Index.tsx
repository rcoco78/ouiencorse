import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { SaveTheDateForm } from "@/components/SaveTheDateForm";
import { Separator } from "@/components/ui/separator";

export default function Index() {
  return (
    <div className="bg-cream min-h-screen w-full font-sans overflow-x-hidden">
      <div className="container mx-auto px-6 sm:px-8">
        {/* Header */}
        <header className="py-8 sm:py-12">
          <div className="flex items-center justify-center md:justify-between">
            {/* L & C Logo */}
            <div className="flex items-center space-x-1">
              <span className="font-dancing text-2xl font-medium text-stone-800">
                L
              </span>
              <span className="font-sans text-sm font-thin text-stone-800">
                &
              </span>
              <span className="font-dancing text-2xl font-medium text-stone-800">
                C
              </span>
            </div>
            <Navigation />
          </div>
        </header>

        {/* Hero Section */}
        <main className="py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* SVG Section */}
            <div className="flex justify-center order-2 lg:order-1">
              <img
                src="/corsica.svg"
                alt="Corse"
                className="w-full max-w-sm lg:max-w-md h-auto text-savethedate-brown/80"
              />
            </div>

            {/* Text Section */}
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2">
              <div className="font-dancing text-5xl sm:text-6xl lg:text-7xl">
                <h2>Wedding</h2>
                <h2 className="-mt-2 sm:-mt-4">Day</h2>
              </div>

              <p className="font-sans text-[#6E6E6E] tracking-[0.2em] text-base sm:text-lg my-6 sm:my-8">
                11 . 07 . 2026
              </p>

              <p className="text-gray-600 max-w-md leading-relaxed mb-8 sm:mb-10 font-light text-sm sm:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco.
              </p>

              <SaveTheDateForm>
                <Button
                  size="lg"
                  className="bg-savethedate-brown text-white hover:bg-savethedate-brown/90 border border-savethedate-brown/50 rounded-sm px-8 text-base sm:text-lg"
                >
                  Save the date
                  <Lock className="ml-3 h-5 w-5" />
                </Button>
              </SaveTheDateForm>
            </div>
          </div>
        </main>

        <footer className="py-8 text-center">
          <Separator className="my-4 bg-savethedate-brown/20" />
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-1">
              <span className="font-dancing text-lg font-medium text-stone-500">
                L
              </span>
              <span className="font-sans text-[10px] font-thin text-stone-500">
                &
              </span>
              <span className="font-dancing text-lg font-medium text-stone-500">
                C
              </span>
            </div>
            <span className="hidden md:inline-block text-stone-400">•</span>
            <p className="font-sans text-[11px] font-light tracking-widest text-stone-400">
              se déroulera à 15 minutes d'Ajaccio le 11.07.2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
