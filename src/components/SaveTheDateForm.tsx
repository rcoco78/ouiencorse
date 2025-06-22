
import * as React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  attendance: "yes" | "no" | "unsure" | "";
}

interface SaveTheDateFormProps {
  isVisible: boolean;
  onClose: () => void;
  allowPlusOne?: boolean;
}

export const SaveTheDateForm: React.FC<SaveTheDateFormProps> = ({ 
  isVisible, 
  onClose, 
  allowPlusOne = false 
}) => {
  const [formData, setFormData] = React.useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    attendance: "",
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  // Webhook URL - vous devrez remplacer cette URL par votre webhook Google Sheets
  const WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/"; // Remplacez par votre URL

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sendToGoogleSheets = async (data: FormData) => {
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        attendance: data.attendance,
        attendanceLabel: data.attendance === "yes" ? "Oui, je compte venir !" : 
                        data.attendance === "no" ? "Non, je ne pourrai malheureusement pas venir" : 
                        "Je ne sais pas encore",
        allowPlusOne: allowPlusOne,
        source: "Save the Date Form"
      };

      console.log("Sending to webhook:", payload);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      return true;
    } catch (error) {
      console.error("Error sending to Google Sheets:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Envoyer vers Google Sheets
      await sendToGoogleSheets(formData);
      
      console.log("Form submitted successfully:", formData);
      setIsSubmitted(true);
      
      toast({
        title: "Réponse envoyée !",
        description: `Merci ${formData.firstName}, votre réponse a été enregistrée.`,
      });

      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          attendance: "",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = formData.firstName && formData.lastName && formData.email && formData.attendance;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Save the Date - L & C</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Fermer le formulaire"
          >
            <X size={24} />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A79885] focus:border-transparent"
                    placeholder="Votre prénom"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A79885] focus:border-transparent"
                    placeholder="Votre nom"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A79885] focus:border-transparent"
                  placeholder="votre.email@exemple.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Comptez-vous venir à notre mariage le 11 juillet 2026 ? *
                </p>
                <div className="space-y-2">
                  {[
                    { value: "yes", label: "Oui, je compte venir !" },
                    { value: "no", label: "Non, je ne pourrai malheureusement pas venir" },
                    { value: "unsure", label: "Je ne sais pas encore" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value={option.value}
                        checked={formData.attendance === option.value}
                        onChange={(e) => updateFormData("attendance", e.target.value)}
                        className="text-[#A79885] focus:ring-[#A79885]"
                        required
                        disabled={isLoading}
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-[#A79885] hover:bg-[#96876E]"
                disabled={!canSubmit || isLoading}
              >
                {isLoading ? "Envoi en cours..." : "Envoyer ma réponse"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-green-600 text-xl font-medium mb-4">
              ✓ Merci {formData.firstName} !
            </div>
            <p className="text-gray-600 text-lg">
              Votre réponse a bien été enregistrée.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Nous vous enverrons plus d'informations à {formData.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
