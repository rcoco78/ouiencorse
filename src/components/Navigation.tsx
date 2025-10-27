import { Menu, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

const NavLinks = () => (
  <div className="flex items-center space-x-8">
    <a
      href="/programme"
      className="font-sans font-light text-stone-700 hover:text-savethedate-brown transition-colors"
    >
      Programme
    </a>
    <a
      href="/infos-pratiques"
      className="font-sans font-light text-stone-700 hover:text-savethedate-brown transition-colors"
    >
      Infos pratiques
    </a>
    <a
      href="/liste-mariage"
      className="font-sans font-light text-stone-700 hover:text-savethedate-brown transition-colors"
    >
      Liste de mariage
    </a>
    <a
      href="/playlist"
      className="font-sans font-light text-stone-700 hover:text-savethedate-brown transition-colors"
    >
      Playlist
    </a>
    <a
      href="#"
      className="flex items-center font-sans font-light text-savethedate-brown"
    >
      Save the date
      <Lock className="ml-2 h-4 w-4" />
    </a>
  </div>
);

export function Navigation() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <nav className="flex items-center space-x-8">
        <NavLinks />
      </nav>
    );
  }

  return null;
} 