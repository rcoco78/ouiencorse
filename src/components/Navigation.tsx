import { Menu, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NavLinks = () => (
  <TooltipProvider>
    <div className="flex items-center space-x-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-not-allowed select-none font-sans font-light text-stone-500">
            Programme
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>En cours de préparation</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-not-allowed select-none font-sans font-light text-stone-500">
            Infos pratiques
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>En cours de préparation</p>
        </TooltipContent>
      </Tooltip>
      <a
        href="#"
        className="flex items-center font-sans font-light text-savethedate-brown"
      >
        Save the date
        <Lock className="ml-2 h-4 w-4" />
      </a>
    </div>
  </TooltipProvider>
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