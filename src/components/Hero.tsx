import * as React from "react";
import { Button } from "@/components/ui/Button";

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
    <main className="flex w-full items-center gap-[40px_64px] justify-center flex-wrap px-16 max-md:max-w-full max-md:px-5">
      <section className="self-stretch min-w-60 w-[594px] my-auto py-[104px] max-md:max-w-full max-md:py-[100px]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/89a9b08bab8236cf36dbdb4ccdd4bd79e5c4d324?placeholderIfAbsent=true"
          alt="Wedding couple portrait"
          className="aspect-[1.17] object-contain w-full rounded max-md:max-w-full"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3416b2ecd3219a71ae438ff05350e9a4f9eff641?placeholderIfAbsent=true"
          alt="Wedding rings or detail shot"
          className="aspect-[0.46] object-contain w-[279px] max-w-full"
        />
      </section>
      
      <section className="self-stretch min-w-60 flex-1 shrink basis-[0%] my-auto py-10 max-md:max-w-full">
        <div className="flex w-full flex-col items-stretch justify-center max-md:max-w-full">
          <div className="text-black text-[69px] font-bold leading-[1.1] tracking-[-1.38px] max-md:max-w-full max-md:text-[40px]">
            <h2>Wedding Day</h2>
          </div>
          <p className="text-black text-2xl font-normal leading-[35px] tracking-[-0.12px] mt-6">
            Go ahead and say just a little more about what you do.
          </p>
        </div>
        
        <div className="flex w-full items-center gap-4 text-lg text-white font-medium text-center tracking-[-0.09px] leading-none flex-wrap mt-8 max-md:max-w-full">
          <Button 
            variant="primary" 
            size="lg"
            className="min-w-60 w-[372px] gap-2"
            onClick={handleSaveTheDate}
            aria-label="Save the wedding date and get updates"
          >
            Save the date
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
