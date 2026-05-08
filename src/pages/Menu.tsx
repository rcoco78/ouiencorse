import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── À personnaliser avec les vrais plats ─────────────────────────────────────
const ENTREES = [
  { value: "entree-1", label: "À compléter par les mariés" },
];

const PLATS = [
  { value: "plat-poisson", label: "Poisson" },
  { value: "plat-viande", label: "Viande" },
  { value: "plat-vegetarien", label: "Végétarien" },
];

const DESSERTS = [
  { value: "dessert-1", label: "À compléter par les mariés" },
];
// ─────────────────────────────────────────────────────────────────────────────

const formSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  entree: z.string({ required_error: "Choisissez une entrée" }),
  plat: z.string({ required_error: "Choisissez un plat" }),
  dessert: z.string({ required_error: "Choisissez un dessert" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function PageHeader() {
  return (
    <header className="py-8 sm:py-12">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
          <span className="font-dancing text-2xl font-medium text-stone-800">L</span>
          <span className="font-sans text-sm font-thin text-stone-800">&</span>
          <span className="font-dancing text-2xl font-medium text-stone-800">C</span>
        </a>
        <Navigation />
      </div>
    </header>
  );
}


export default function Menu() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", notes: "" },
  });

  async function onSubmit(values: FormValues) {
    const toastId = toast.loading("Envoi en cours…");
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      toast.success("Parfait, on a noté vos choix.", { id: toastId });
      setSubmitted(true);
    } catch {
      toast.error("Oups, une erreur est survenue. Réessayez.", { id: toastId });
    }
  }

  return (
    <div className="bg-cream min-h-screen w-full font-sans overflow-x-hidden flex flex-col">
      <div className="container mx-auto px-6 sm:px-8 flex flex-col flex-grow">
        <PageHeader />

        <main className="py-12 lg:py-16 flex-grow relative">
          <div className="max-w-2xl mx-auto relative">
            {/* Décors */}
            <img src="/Calque_21.svg" alt="" aria-hidden className="absolute top-0 left-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 -translate-x-1/4 opacity-20 pointer-events-none" />
            <img src="/corsica2.svg" alt="" aria-hidden className="absolute top-0 right-0 z-0 w-full max-w-[10rem] sm:max-w-[12rem] -translate-y-1/4 translate-x-1/4 opacity-20 pointer-events-none" />

            {/* Titre */}
            <div className="text-center mb-10 relative z-10">
              <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800 mb-3">
                Menu du soir
              </h1>
              <p className="font-sans text-stone-600">
                Pour que le 11 juillet soit parfait jusqu'au dessert — dites-nous ce qui vous fait envie.
              </p>
            </div>

            {submitted ? (
              <div className="warm-card p-10 text-center relative z-10">
                <CheckCircle className="w-12 h-12 text-savethedate-brown mx-auto mb-4" />
                <h2 className="font-dancing text-3xl text-stone-800 mb-3">
                  C'est noté.
                </h2>
                <p className="text-stone-600">
                  On s'occupe du reste. À très vite en Corse.
                </p>
              </div>
            ) : (
              <div className="warm-card p-8 relative z-10">
                <p className="text-stone-500 text-sm mb-8 italic">Un choix par personne — si vous êtes en couple, prenez chacun deux minutes.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Identité */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-stone-700">Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean" className="bg-cream border-savethedate-brown/20 rounded-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-stone-700">Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Dupont" className="bg-cream border-savethedate-brown/20 rounded-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <Separator className="bg-savethedate-brown/10" />

                    {/* Entrée */}
                    <FormField control={form.control} name="entree" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-stone-700">Entrée</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-cream border-savethedate-brown/20 rounded-sm">
                              <SelectValue placeholder="Choisir une entrée" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-cream">
                            {ENTREES.map((e) => (
                              <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Plat */}
                    <FormField control={form.control} name="plat" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-stone-700">Plat principal</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-cream border-savethedate-brown/20 rounded-sm">
                              <SelectValue placeholder="Choisir un plat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-cream">
                            {PLATS.map((p) => (
                              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Dessert */}
                    <FormField control={form.control} name="dessert" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-stone-700">Dessert</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-cream border-savethedate-brown/20 rounded-sm">
                              <SelectValue placeholder="Choisir un dessert" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-cream">
                            {DESSERTS.map((d) => (
                              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Notes allergies */}
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-stone-700">
                          Allergies / régime alimentaire
                          <span className="text-stone-400 font-normal ml-1">(optionnel)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex : végétarien, sans gluten…" className="bg-cream border-savethedate-brown/20 rounded-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full bg-savethedate-brown text-white hover:bg-savethedate-brown/90 rounded-sm"
                    >
                      {form.formState.isSubmitting ? "Envoi…" : "Valider mes choix"}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </main>

              <SiteFooter />
      </div>
    </div>
  );
}
