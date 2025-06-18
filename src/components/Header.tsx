import * as React from "react";
import { Button } from "@/components/ui/Button";

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
    <header className="flex w-full items-center leading-none justify-between flex-wrap px-16 py-6 max-md:max-w-full max-md:px-5">
      <div className="self-stretch flex-1 shrink basis-[0%] min-w-60 gap-2 text-3xl text-black font-semibold tracking-[-0.6px] my-auto max-md:max-w-full">
        <h1>L & C</h1>
      </div>
      
      <nav className="self-stretch flex min-w-60 items-center gap-6 text-base text-black font-medium tracking-[-0.08px] flex-wrap my-auto">
        <button 
          className="self-stretch my-auto hover:text-[#A79885] transition-colors"
          onClick={() => handleNavClick("Programme")}
          aria-label="View wedding programme"
        >
          Programme
        </button>
        <button 
          className="self-stretch my-auto hover:text-[#A79885] transition-colors"
          onClick={() => handleNavClick("Infos pratiques")}
          aria-label="View practical information"
        >
          Infos pratiques
        </button>
        <Button 
          variant="primary" 
          size="md"
          onClick={handleSaveTheDate}
          aria-label="Save the wedding date"
        >
          Save the date
        </Button>
      </nav>
    </header>
  );
};
