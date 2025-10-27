"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Separator } from "./ui/separator";

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

export function SaveTheDateForm({ children }: { children: React.ReactNode }) {
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
        mode: "no-cors", // Important pour les webhooks Apps Script simples
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // Avec mode: 'no-cors', on ne peut pas lire la réponse,
      // on suppose donc que tout s'est bien passé si fetch ne lève pas d'erreur.
      toast.success(
        values.presence === "yes"
          ? "Génial ! Nous avons hâte de célébrer avec vous."
          : "Merci d'avoir prévenu ! Vous nous manquerez.",
        { id: toastId }
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi au webhook:", error);
      toast.error("Oups, une erreur est survenue. Veuillez réessayer.", {
        id: toastId,
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-11/12 max-w-4xl bg-cream border-savethedate-brown/20 p-0 rounded-lg">
        <div className="grid md:grid-cols-2">
          <div className="hidden md:flex items-start justify-center rounded-l-lg p-8">
            <img
              src="/corsica.svg"
              alt="Mariage en Corse"
              className="object-contain h-full w-full"
            />
          </div>

          <div className="p-8">
            <DialogHeader>
              <DialogTitle className="font-dancing text-3xl text-stone-800">
                Save the Date
              </DialogTitle>
              <DialogDescription className="font-sans text-stone-600 pt-2">
                Nous serions ravis de savoir si vous pensez être des nôtres.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-6 -mr-6 py-4">
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans font-medium text-stone-700">
                            Prénom
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Jean" {...field} />
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
                            <Input placeholder="ex: Dupont" {...field} />
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
                                <SelectTrigger>
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
                          className="space-y-4 rounded-lg p-4 border border-savethedate-brown/10"
                        >
                          <h3 className="font-sans font-medium text-stone-700">
                            Accompagnant {index + 1}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
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
                                    placeholder="ex: jeanne.dupont@email.com"
                                    {...field}
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
                </div>

                <DialogFooter className="pt-6">
                  <Button
                    type="submit"
                    className="bg-savethedate-brown text-white hover:bg-savethedate-brown/90"
                  >
                    Envoyer ma réponse
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
