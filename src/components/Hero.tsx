
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

export const Hero: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSaveTheDate = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsFormVisible(false);
        setIsSubmitted(false);
        setName("");
        setEmail("");
      }, 2000);
    }
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setName("");
    setEmail("");
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
            variant="primary" 
            size="lg"
            className="bg-[#A79885] hover:bg-[#96876E] text-white px-8 py-4 text-lg font-medium flex items-center gap-3"
            onClick={handleSaveTheDate}
            aria-label="Save the wedding date and get updates"
          >
            Save the date
            <Lock size={20} />
          </Button>
        </div>

        {/* Save the Date Form Modal */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-black">Save the Date</h3>
                <button 
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>
              
              {!isSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A79885] focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A79885] focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="flex-1"
                    >
                      Save My Date
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={handleCloseForm}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="text-green-600 text-lg font-medium mb-2">
                    ✓ Thank you, {name}!
                  </div>
                  <p className="text-gray-600">
                    We'll send wedding details to {email}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
