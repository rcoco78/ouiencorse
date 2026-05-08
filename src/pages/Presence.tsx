import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    vendredi: z.boolean(),
    samedi: z.boolean(),
    brunch: z.boolean(),
    notes: z.string().optional(),
  })
  .refine((d) => d.vendredi || d.samedi || d.brunch, {
    message: "Cochez au moins une journée",
    path: ["samedi"],
  });

type FormValues = z.infer<typeof formSchema>;

const JOURS = [
  {
    name: "vendredi" as const,
    label: "Vendredi 10 juillet",
    sublabel: "Mariage civil & après-midi plage",
    note: "Pour ceux qui peuvent prendre un jour de plus",
  },
  {
    name: "samedi" as const,
    label: "Samedi 11 juillet",
    sublabel: "Cérémonie, cocktail & soirée",
    note: "",
    highlight: true,
  },
  {
    name: "brunch" as const,
    label: "Dimanche 12 juillet",
    sublabel: "Brunch, piscine, farniente",
    note: "",
  },
];

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


export default function Presence() {
  const [submitted, setSubmitted] = useState(false);
  const [hasAccompanist, setHasAccompanist] = useState(false);
  const [accompFirstName, setAccompFirstName] = useState("");
  const [accompLastName, setAccompLastName] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      vendredi: false,
      samedi: true,
      brunch: false,
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const toastId = toast.loading("Envoi en cours…");
    try {
      const submissions = [values];
      if (hasAccompanist && accompFirstName.trim()) {
        submissions.push({ ...values, firstName: accompFirstName.trim(), lastName: accompLastName.trim() });
      }
      await Promise.all(submissions.map(data =>
        fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then(r => { if (!r.ok) throw new Error(); })
      ));
      toast.success("C'est noté. On vous attend avec impatience.", { id: toastId });
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
                Vos jours de fête
              </h1>
              <p className="font-sans text-stone-600">
                Trois jours vous attendent — dites-nous jusqu'où vous pouvez rester.
              </p>
            </div>

            {submitted ? (
              <div className="warm-card p-10 text-center relative z-10">
                <CheckCircle className="w-12 h-12 text-savethedate-brown mx-auto mb-4" />
                <h2 className="font-dancing text-3xl text-stone-800 mb-3">
                  Parfait, c'est noté.
                </h2>
                <p className="text-stone-600">
                  On a tellement hâte de vous avoir en Corse.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                  {/* Identité */}
                  <div className="warm-card p-6 space-y-4">
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

                    {hasAccompanist && (
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-savethedate-brown/10">
                        <div>
                          <label className="text-sm font-medium text-stone-700 block mb-1.5">Prénom</label>
                          <Input
                            placeholder="Marie"
                            value={accompFirstName}
                            onChange={e => setAccompFirstName(e.target.value)}
                            className="bg-cream border-savethedate-brown/20 rounded-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-stone-700 block mb-1.5">Nom</label>
                          <Input
                            placeholder="Dupont"
                            value={accompLastName}
                            onChange={e => setAccompLastName(e.target.value)}
                            className="bg-cream border-savethedate-brown/20 rounded-sm"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => { setHasAccompanist(v => !v); setAccompFirstName(""); setAccompLastName(""); }}
                      className="flex items-center gap-1.5 text-sm text-savethedate-brown/70 hover:text-savethedate-brown transition-colors"
                    >
                      {hasAccompanist
                        ? <><X className="w-3.5 h-3.5" /> Retirer l'accompagnant(e)</>
                        : <><UserPlus className="w-3.5 h-3.5" /> Ajouter un(e) accompagnant(e)</>
                      }
                    </button>
                  </div>

                  {/* Jours */}
                  <div className="space-y-3">
                    {JOURS.map(({ name, label, sublabel, note, highlight }) => (
                    <FormField key={name} control={form.control} name={name} render={({ field }) => (
                      <FormItem>
                        <div
                          className={`rounded-sm border p-5 cursor-pointer transition-all duration-200 ${
                            field.value
                              ? "bg-savethedate-brown/[0.12] border-savethedate-brown/40 shadow-[0_2px_12px_rgba(139,90,43,0.10)]"
                              : "bg-[#fdfaf7] border-savethedate-brown/20 hover:border-savethedate-brown/30 hover:bg-savethedate-brown/[0.04]"
                          }`}
                          onClick={() => field.onChange(!field.value)}
                        >
                          <div className="flex items-start space-x-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-0.5 border-savethedate-brown/40 data-[state=checked]:bg-savethedate-brown data-[state=checked]:border-savethedate-brown"
                              />
                            </FormControl>
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-0.5">
                                <FormLabel className="font-sans font-medium text-stone-800 cursor-pointer">
                                  {label}
                                </FormLabel>
                                {highlight && (
                                  <span className="text-xs text-savethedate-brown font-medium tracking-wide">
                                    Le grand jour
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-500 text-sm">{sublabel}</p>
                              {note && (
                                <p className="text-stone-400 text-xs italic mt-0.5">{note}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                  </div>

                  {/* Notes */}
                  <div className="warm-card p-6">
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-stone-700">
                          Une question ou un commentaire ?
                          <span className="text-stone-400 font-normal ml-1">(optionnel)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex : on arrivera vendredi soir…"
                            className="bg-cream border-savethedate-brown/20 rounded-sm mt-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-savethedate-brown text-white hover:bg-savethedate-brown/90 rounded-sm"
                  >
                    {form.formState.isSubmitting ? "Envoi…" : "Confirmer ma présence"}
                  </Button>
                </form>
              </Form>
            )}

            {/* Note */}
            <div className="mt-10 p-5 warm-note relative z-10">
              <p className="text-center text-stone-600 italic text-sm">
                Pas d'inquiétude si vous ne savez pas encore pour le vendredi — vous pourrez nous le dire plus tard.
              </p>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
