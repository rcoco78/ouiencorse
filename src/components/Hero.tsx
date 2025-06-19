
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { SaveTheDateForm } from "./SaveTheDateForm";

export const Hero: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = React.useState(false);

  // Check URL parameters to determine if plus one is allowed
  const urlParams = new URLSearchParams(window.location.search);
  const allowPlusOne = urlParams.get('plusone') === '1';

  const handleSaveTheDate = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  return (
    <main className="flex w-full items-start gap-8 justify-center px-16 pt-12 max-md:max-w-full max-md:px-5 max-md:flex-col">
      {/* Left side - Images */}
      <section className="flex flex-col items-start gap-4 w-[400px] max-md:w-full">
        <div className="relative">
          <img
            src="/lovable-uploads/1542fdf8-f794-496a-ab73-43b3ae9b35fc.png"
            alt="Wedding couple portrait"
            className="w-[285px] h-[380px] object-cover rounded-lg"
          />
        </div>
        
        {/* Hand-drawn outline element */}
        <div className="relative ml-48 -mt-20">
          <svg width="200" height="300" viewBox="0 0 200 300" className="text-gray-300">
            <path
              d="M10 50 Q 20 10, 50 20 L 150 30 Q 180 35, 180 60 L 170 200 Q 165 250, 140 260 L 60 270 Q 20 265, 15 240 L 10 100 Q 8 75, 10 50 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-60"
            />
          </svg>
        </div>
      </section>
      
      {/* Right side - Content */}
      <section className="flex flex-col justify-start pt-8 flex-1 max-w-[600px] max-md:max-w-full max-md:pt-4">
        {/* Wedding Day title */}
        <div className="mb-8">
          <h2 className="text-black text-[80px] font-bold leading-[0.9] tracking-[-2px] max-md:text-[50px] italic">
            Wedding
          </h2>
          <h2 className="text-black text-[80px] font-bold leading-[0.9] tracking-[-2px] max-md:text-[50px] italic -mt-4">
            Day
          </h2>
        </div>

        {/* Date */}
        <div className="mb-8">
          <p className="text-black text-2xl font-medium tracking-[0.2em]">
            11.07.2026
          </p>
        </div>
        
        {/* Description text */}
        <div className="mb-12 max-w-[500px]">
          <p className="text-black text-base leading-relaxed text-justify">
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
          </p>
        </div>
        
        {/* Save the date button */}
        <div className="flex items-center">
          <Button 
            size="lg"
            className="bg-[#A79885] hover:bg-[#96876E] text-white px-8 py-4 text-lg font-medium flex items-center gap-3"
            onClick={handleSaveTheDate}
            aria-label="Save the wedding date and get updates"
          >
            Save the date
            <Lock size={20} />
          </Button>
        </div>

        {/* Save the Date Form */}
        <SaveTheDateForm 
          isVisible={isFormVisible}
          onClose={handleCloseForm}
          allowPlusOne={allowPlusOne}
        />
      </section>
    </main>
  );
};

