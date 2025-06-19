
import * as React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  attendance: "yes" | "no" | "unsure" | "";
  hasPlusOne: "yes" | "no" | "";
  plusOneFirstName: string;
  plusOneLastName: string;
  plusOneEmail: string;
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
    phone: "",
    attendance: "",
    hasPlusOne: "",
    plusOneFirstName: "",
    plusOneLastName: "",
    plusOneEmail: "",
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setCurrentStep(1);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        attendance: "",
        hasPlusOne: "",
        plusOneFirstName: "",
        plusOneLastName: "",
        plusOneEmail: "",
      });
    }, 2000);
  };

  const canProceedToStep2 = formData.firstName && formData.lastName && formData.email && formData.phone;
  const canProceedToStep3 = formData.attendance;
  const showPlusOneFields = allowPlusOne && formData.hasPlusOne === "yes";
  const canSubmit = formData.attendance && (!allowPlusOne || formData.hasPlusOne) && 
    (!showPlusOneFields || (formData.plusOneFirstName && formData.plusOneLastName));

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
            {/* Step 1: Personal Information */}
            {currentStep >= 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Vos informations personnelles
                </h3>
                
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
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A79885] focus:border-transparent"
                    placeholder="+33 6 12 34 56 78"
                    required
                  />
                </div>

                {canProceedToStep2 && (
                  <Button 
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-[#A79885] hover:bg-[#96876E]"
                  >
                    Continuer
                  </Button>
                )}
              </div>
            )}

            {/* Step 2: Attendance Confirmation */}
            {currentStep >= 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Confirmation de présence
                </h3>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Serez-vous disponible et comptez-vous venir ? *
                  </p>
                  <div className="space-y-2">
                    {[
                      { value: "yes", label: "Oui, je serai présent(e)" },
                      { value: "no", label: "Non, je ne pourrai pas venir" },
                      { value: "unsure", label: "Pas encore sûr(e)" }
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
                        />
                        <span className="text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {canProceedToStep3 && (
                  <Button 
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="w-full bg-[#A79885] hover:bg-[#96876E]"
                  >
                    Continuer
                  </Button>
                )}
              </div>
            )}

            {/* Step 3: Plus One (Conditional) */}
            {currentStep >= 3 && allowPlusOne && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Accompagnant(e)
                </h3>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Souhaitez-vous venir avec un·e accompagnant·e ? *
                  </p>
                  <div className="space-y-2">
                    {[
                      { value: "yes", label: "Oui" },
                      { value: "no", label: "Non" }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="hasPlusOne"
                          value={option.value}
                          checked={formData.hasPlusOne === option.value}
                          onChange={(e) => updateFormData("hasPlusOne", e.target.value)}
                          className="text-[#A79885] focus:ring-[#A79885]"
                          required
                        />
                        <span className="text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {showPlusOneFields && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-800">Informations de votre accompagnant(e)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="plusOneFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom de l'accompagnant(e) *
                        </label>
                        <input
                          type="text"
                          id="plusOneFirstName"
                          value={formData.plusOneFirstName}
                          onChange={(e) => updateFormData("plusOneFirstName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A79885] focus:border-transparent"
                          placeholder="Prénom"
                          required={showPlusOneFields}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="plusOneLastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de l'accompagnant(e) *
                        </label>
                        <input
                          type="text"
                          id="plusOneLastName"
                          value={formData.plusOneLastName}
                          onChange={(e) => updateFormData("plusOneLastName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A79885] focus:border-transparent"
                          placeholder="Nom"
                          required={showPlusOneFields}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="plusOneEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail de l'accompagnant(e) (optionnel)
                      </label>
                      <input
                        type="email"
                        id="plusOneEmail"
                        value={formData.plusOneEmail}
                        onChange={(e) => updateFormData("plusOneEmail", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A79885] focus:border-transparent"
                        placeholder="email.accompagnant@exemple.com"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {currentStep >= 3 && canSubmit && (
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-[#A79885] hover:bg-[#96876E]"
                >
                  Envoyer ma réponse
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            )}

            {/* Navigation buttons for steps */}
            {currentStep > 1 && currentStep < 3 && (
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  Retour
                </Button>
              </div>
            )}
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

