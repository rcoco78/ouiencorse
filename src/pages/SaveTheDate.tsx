"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Navigation } from "@/components/Navigation";
import { LogoMonogram } from "@/components/LogoMonogram";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import React from "react";
import { useSearchParams } from "react-router-dom";

const guestSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit faire au moins 2 caractères." }),
  lastName: z
    .string()
    .min(2, { message: "Le nom doit faire au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez saisir un e-mail valide." }),
});

const formSchema = z.object({
  presence: z.enum(["yes", "no"], {
    required_error: "Veuillez sélectionner une option.",
  }),
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit faire au moins 2 caractères." }),
  lastName: z
    .string()
    .min(2, { message: "Le nom doit faire au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez saisir un e-mail valide." }),
  guests: z.coerce.number().min(0, "Le nombre doit être positif.").default(0),
  accompanyingPersons: z.array(guestSchema).optional(),
});

export default function SaveTheDate() {
  const [searchParams] = useSearchParams();
  const canHaveGuests = searchParams.get("withGuests") === "true";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      guests: 0,
      accompanyingPersons: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "accompanyingPersons",
  });

  const guestsCount = form.watch("guests");
  const presence = form.watch("presence");

  React.useEffect(() => {
    const currentCount = fields.length;
    const newCount = guestsCount || 0;

    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        append({ firstName: "", lastName: "", email: "" });
      }
    } else if (newCount < currentCount) {
      remove(
        Array.from({ length: currentCount - newCount }, (_, i) => newCount + i)
      );
    }
  }, [guestsCount, fields.length, append, remove]);

  React.useEffect(() => {
    if (presence === 'no') {
        form.setValue('guests', 0)
    }
  }, [presence, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const webhookUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("L'URL du webhook Google Sheet n'est pas définie.");
      toast.error("Erreur de configuration, impossible de soumettre.");
      return;
    }

    const toastId = toast.loading("Envoi de votre réponse...");

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      toast.success(
        values.presence === "yes"
          ? "Génial ! Nous avons hâte de célébrer avec vous."
          : "Merci d'avoir prévenu ! Vous nous manquerez.",
        { id: toastId }
      );
      
      // Réinitialiser le formulaire après succès
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi au webhook:", error);
      toast.error("Oups, une erreur est survenue. Veuillez réessayer.", {
        id: toastId,
      });
    }
  }

  return (
    <div className="bg-cream min-h-screen w-full font-sans overflow-x-hidden flex flex-col">
      <div className="container mx-auto px-6 sm:px-8 flex flex-col flex-grow">
        {/* Header */}
        <header className="py-8 sm:py-12">
          <div className="flex items-center justify-between">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <LogoMonogram />
            </a>
            <Navigation />
          </div>
        </header>

        {/* Main Content */}
        <main className="py-12 lg:py-16 flex-grow relative">
          <div className="max-w-4xl mx-auto relative">
            {/* Decorative SVG - Top left */}
            <img
              src="/Calque_21.svg"
              alt="Décor"
              className="absolute top-0 left-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 -translate-x-1/4 opacity-20"
            />
            {/* Decorative SVG - Top right */}
            <img
              src="/corsica2.svg"
              alt="Carte de la Corse"
              className="absolute top-0 right-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 translate-x-1/4 opacity-20"
            />
            {/* Decorative SVG - Bottom left */}
            <img
              src="/Calque_2.svg"
              alt="Décor"
              className="absolute bottom-0 left-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] translate-y-1/4 -translate-x-1/4 opacity-20"
            />

            {/* Title */}
            <div className="text-center mb-12 relative z-10">
              <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800 mb-4">
                Save the Date
              </h1>
              <p className="font-sans text-stone-600 text-lg">
                Nous serions ravis de savoir si vous pensez être des nôtres.
              </p>
            </div>

            {/* Form */}
            <div className="warm-card p-6 sm:p-8 relative z-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="presence"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="font-sans font-medium text-stone-700">
                          Serez-vous présent ?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-sans font-normal">
                                Oui
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-sans font-normal">
                                Non
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans font-medium text-stone-700">
                            Prénom
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="ex: Jean" 
                              {...field}
                              className="bg-white border-savethedate-brown/20 rounded-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans font-medium text-stone-700">
                            Nom
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="ex: Dupont" 
                              {...field}
                              className="bg-white border-savethedate-brown/20 rounded-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-medium text-stone-700">
                          Adresse e-mail
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="ex: jean.dupont@email.com"
                            {...field}
                            className="bg-white border-savethedate-brown/20 rounded-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {presence === "yes" && canHaveGuests && (
                    <>
                      <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-sans font-medium text-stone-700">
                              Je serai accompagné(e) de...
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value, 10))
                              }
                              defaultValue={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white border-savethedate-brown/20 rounded-sm">
                                  <SelectValue placeholder="Sélectionnez le nombre d'accompagnants" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1 personne</SelectItem>
                                <SelectItem value="2">2 personnes</SelectItem>
                                <SelectItem value="3">3 personnes</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="space-y-4 rounded-sm p-4 border border-savethedate-brown/10"
                        >
                          <h3 className="font-sans font-medium text-stone-700">
                            Accompagnant {index + 1}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`accompanyingPersons.${index}.firstName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-sans text-sm font-medium text-stone-600">
                                    Prénom
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="ex: Jeanne"
                                      {...field}
                                      className="bg-white border-savethedate-brown/20 rounded-sm"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accompanyingPersons.${index}.lastName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-sans text-sm font-medium text-stone-600">
                                    Nom
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="ex: Dupont"
                                      {...field}
                                      className="bg-white border-savethedate-brown/20 rounded-sm"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name={`accompanyingPersons.${index}.email`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-sans text-sm font-medium text-stone-600">
                                  Adresse e-mail
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="ex: jeanne.dupont@email.com"
                                    {...field}
                                    className="bg-white border-savethedate-brown/20 rounded-sm"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                    </>
                  )}

                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-savethedate-brown text-white hover:bg-savethedate-brown/90 rounded-sm"
                    >
                      Envoyer ma réponse
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </main>

        <footer className="py-8 text-center">
          <Separator className="my-4 bg-savethedate-brown/20" />
          <div className="flex justify-center items-center">
            <p className="font-sans text-xs font-light tracking-widest text-stone-500">
              10-12.07.2026
              <span className="mx-2 text-stone-400">•</span>
              Calcatoggio, Corse
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

