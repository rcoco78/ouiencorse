
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSaveTheDate = () => {
    // Simple alert for demonstration - could be replaced with modal or form
    alert("Thank you for your interest! We'll send you more details soon.");
  };

  const handleNavClick = (section: string) => {
    // Simple alert for demonstration - could be replaced with actual navigation
    alert(`Navigating to ${section} section`);
  };

  return (
    <header className="flex w-full items-center justify-between px-16 py-8 max-md:max-w-full max-md:px-5">
      <div className="flex-1">
        <h1 className="text-4xl text-black font-light italic tracking-wide">
          L & C
        </h1>
      </div>
      
      <nav className="flex items-center gap-12 text-base text-black font-normal">
        <button 
          className="hover:text-[#A79885] transition-colors"
          onClick={() => handleNavClick("Programme")}
          aria-label="View wedding programme"
        >
          Programme
        </button>
        <button 
          className="hover:text-[#A79885] transition-colors"
          onClick={() => handleNavClick("Infos pratiques")}
          aria-label="View practical information"
        >
          Infos pratiques
        </button>
        <button 
          className="text-gray-400 hover:text-[#A79885] transition-colors flex items-center gap-2"
          onClick={handleSaveTheDate}
          aria-label="Save the wedding date"
        >
          Save the date
          <Lock size={16} className="text-gray-400" />
        </button>
      </nav>
    </header>
  );
};
