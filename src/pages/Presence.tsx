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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MENU_OPTIONS = [
  { value: "viande", label: "Viande", sublabel: "Veau corse" },
  { value: "poisson", label: "Poisson", sublabel: "Rascasse" },
] as const;

type MenuChoice = "viande" | "poisson";

const formSchema = z
  .object({
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    vendredi: z.boolean(),
    samedi: z.boolean(),
    brunch: z.boolean(),
    menuChoice: z.enum(["viande", "poisson"]).optional(),
    notes: z.string().optional(),
  })
  .refine((d) => d.vendredi || d.samedi || d.brunch, {
    message: "Cochez au moins une journée",
    path: ["samedi"],
  })
  .refine((d) => !d.samedi || d.menuChoice !== undefined, {
    message: "Merci de choisir votre menu",
    path: ["menuChoice"],
  });

type FormValues = z.infer<typeof formSchema>;

const JOURS = [
  {
    name: "vendredi" as const,
    label: "Vendredi 10 juillet",
    time: "À partir de 14h30",
    sublabel: "Mariage civil & après-midi plage",
    note: "Pour ceux qui peuvent prendre un jour de plus",
  },
  {
    name: "samedi" as const,
    label: "Samedi 11 juillet",
    time: "À partir de 16h",
    sublabel: "Cérémonie, cocktail & soirée",
    note: "",
    highlight: true,
  },
  {
    name: "brunch" as const,
    label: "Dimanche 12 juillet",
    time: "À partir de 11h",
    sublabel: "Brunch, piscine, farniente",
    note: "",
  },
];

function MenuPicker({
  value,
  onChange,
  error,
}: {
  value: MenuChoice | undefined;
  onChange: (v: MenuChoice) => void;
  error?: string;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-savethedate-brown/10">
      <p className="text-xs text-stone-400 italic mb-3">Votre menu pour le dîner du samedi</p>
      <div className="flex flex-col gap-2">
        {MENU_OPTIONS.map(({ value: v, label, sublabel }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex items-center justify-between text-left px-4 py-3 rounded-sm border transition-all duration-200 ${
              value === v
                ? "bg-savethedate-brown/[0.10] border-savethedate-brown/40"
                : "border-savethedate-brown/15 hover:border-savethedate-brown/25 hover:bg-savethedate-brown/[0.03]"
            }`}
          >
            <span className="text-sm text-stone-800">{label}</span>
            <span className="text-xs text-stone-400 italic">{sublabel}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

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
  const [accompanists, setAccompanists] = useState<{
    firstName: string;
    lastName: string;
    menuChoice?: MenuChoice;
  }[]>([]);

  function addAccompanist() {
    setAccompanists(prev => [...prev, { firstName: "", lastName: "", menuChoice: undefined }]);
  }
  function removeAccompanist(i: number) {
    setAccompanists(prev => prev.filter((_, idx) => idx !== i));
  }
  function updateAccompanist(i: number, field: "firstName" | "lastName" | "menuChoice", value: string) {
    setAccompanists(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a));
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      vendredi: false,
      samedi: true,
      brunch: false,
      menuChoice: undefined,
      notes: "",
    },
  });

  const samediChecked = form.watch("samedi");

  // Validation accompagnants : menu requis si samedi coché
  const [accompMenuErrors, setAccompMenuErrors] = useState<Record<number, string>>({});

  async function onSubmit(values: FormValues) {
    // Valider les menus des accompagnants
    if (samediChecked) {
      const errors: Record<number, string> = {};
      accompanists.forEach((a, i) => {
        if (a.firstName.trim() && !a.menuChoice) {
          errors[i] = "Merci de choisir un menu";
        }
      });
      if (Object.keys(errors).length > 0) {
        setAccompMenuErrors(errors);
        return;
      }
    }
    setAccompMenuErrors({});

    const toastId = toast.loading("Envoi en cours…");
    try {
      const submissions = [
        values,
        ...accompanists
          .filter(a => a.firstName.trim())
          .map(a => ({
            ...values,
            firstName: a.firstName.trim(),
            lastName: a.lastName.trim(),
            menuChoice: a.menuChoice,
          })),
      ];
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

        <main className="py-12 lg:py-16 flex-grow">
          <div className="max-w-2xl mx-auto">

            {/* Titre */}
            <div className="text-center mb-10">
              <h1 className="font-dancing text-5xl sm:text-6xl text-stone-800 mb-3">
                Vos jours de fête
              </h1>
              <p className="font-sans text-stone-600">
                Trois jours vous attendent — dites-nous jusqu'où vous pouvez rester.
              </p>
            </div>

            {submitted ? (
              <div className="warm-card p-10 text-center">
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Identité */}
                  <div className="warm-card p-6 space-y-4">
                    {/* Personne principale */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    {/* Menu principal si samedi */}
                    {samediChecked && (
                      <FormField control={form.control} name="menuChoice" render={({ field }) => (
                        <FormItem>
                          <MenuPicker
                            value={field.value}
                            onChange={field.onChange}
                            error={form.formState.errors.menuChoice?.message}
                          />
                        </FormItem>
                      )} />
                    )}

                    {/* Accompagnants */}
                    {accompanists.map((a, i) => (
                      <div key={i} className="pt-3 border-t border-savethedate-brown/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-stone-700 block mb-1.5">Prénom</label>
                            <Input
                              placeholder="Marie"
                              value={a.firstName}
                              onChange={e => updateAccompanist(i, "firstName", e.target.value)}
                              className="bg-cream border-savethedate-brown/20 rounded-sm"
                            />
                          </div>
                          <div className="relative">
                            <label className="text-sm font-medium text-stone-700 block mb-1.5">Nom</label>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Dupont"
                                value={a.lastName}
                                onChange={e => updateAccompanist(i, "lastName", e.target.value)}
                                className="bg-cream border-savethedate-brown/20 rounded-sm flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => removeAccompanist(i)}
                                className="text-stone-400 hover:text-stone-600 transition-colors flex-shrink-0"
                                aria-label="Retirer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {samediChecked && (
                          <MenuPicker
                            value={a.menuChoice}
                            onChange={(v) => updateAccompanist(i, "menuChoice", v)}
                            error={accompMenuErrors[i]}
                          />
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addAccompanist}
                      className="flex items-center gap-1.5 text-sm text-savethedate-brown/70 hover:text-savethedate-brown transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Ajouter un(e) accompagnant(e)
                    </button>
                  </div>

                  {/* Jours */}
                  <div className="space-y-3">
                    {JOURS.map(({ name, label, time, sublabel, note, highlight }) => (
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
                            <div className={`mt-0.5 w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-colors ${
                              field.value
                                ? "bg-savethedate-brown border-savethedate-brown"
                                : "border-savethedate-brown/40 bg-transparent"
                            }`}>
                              {field.value && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-sans font-medium text-stone-800 text-sm">
                                  {label}
                                </span>
                                {highlight && (
                                  <span className="text-xs text-savethedate-brown font-medium tracking-wide">
                                    Le grand jour
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-500 text-sm">{sublabel}</p>
                              {time && (
                                <p className="text-savethedate-brown/60 text-xs mt-1 tabular-nums">{time}</p>
                              )}
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

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="warm-cta w-full bg-savethedate-brown text-white hover:bg-savethedate-brown/90 rounded-sm"
                  >
                    {form.formState.isSubmitting ? "Envoi…" : "Confirmer ma présence"}
                  </Button>
                </form>
              </Form>
            )}

          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
