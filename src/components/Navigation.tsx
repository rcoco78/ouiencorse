import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

const INFO_LINKS = [
  { href: "/programme",       label: "Programme" },
  { href: "/infos-pratiques", label: "Infos pratiques" },
  { href: "/liste-mariage",   label: "Liste de mariage" },
  { href: "/playlist",        label: "Playlist" },
];

const ACTION_LINKS = [
  { href: "/presence", label: "Confirmer ma présence" },
  { href: "/menu",     label: "Menu du soir" },
];

const linkClass = "relative font-sans font-light text-stone-700 hover:text-savethedate-brown transition-colors after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-savethedate-brown after:transition-[width] after:duration-300 hover:after:w-full";
const actionLinkClass = "relative font-sans font-light text-savethedate-brown hover:text-savethedate-brown/70 transition-colors after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-savethedate-brown/50 after:transition-[width] after:duration-300 hover:after:w-full";

export function Navigation() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <nav className="flex items-center space-x-6 lg:space-x-8">
        {INFO_LINKS.map(({ href, label }) => (
          <a key={href} href={href} className={linkClass}>{label}</a>
        ))}
        <span className="text-stone-300 select-none">|</span>
        {ACTION_LINKS.map(({ href, label }) => (
          <a key={href} href={href} className={actionLinkClass}>{label}</a>
        ))}
      </nav>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-stone-700">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-cream">
        <div className="flex flex-col mt-8">
          <p className="text-xs tracking-widest text-stone-400 uppercase mb-4">Infos</p>
          <div className="flex flex-col space-y-5">
            {INFO_LINKS.map(({ href, label }) => (
              <a key={href} href={href} className={`${linkClass} text-lg`}>{label}</a>
            ))}
          </div>
          <div className="my-8 border-t border-savethedate-brown/15" />
          <p className="text-xs tracking-widest text-stone-400 uppercase mb-4">À faire</p>
          <div className="flex flex-col space-y-5">
            {ACTION_LINKS.map(({ href, label }) => (
              <a key={href} href={href} className={`${actionLinkClass} text-lg`}>{label}</a>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}