import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = [
  {
    group: "Le mariage",
    links: [
      { href: "/programme",       label: "Programme" },
      { href: "/infos-pratiques", label: "Infos pratiques" },
      { href: "/liste-mariage",   label: "Liste de mariage" },
      { href: "/playlist",        label: "Playlist" },
    ],
  },
  {
    group: "Votre participation",
    links: [
      { href: "/presence", label: "Confirmer ma présence" },
      { href: "/menu",     label: "Choisir mon menu" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="pt-8 pb-10">
      <Separator className="mb-10 bg-savethedate-brown/20" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
        {/* Branding */}
        <div className="col-span-2 sm:col-span-2">
          <a href="/" className="inline-flex items-center space-x-1 hover:opacity-80 transition-opacity mb-3">
            <span className="font-dancing text-2xl font-medium text-stone-800">L</span>
            <span className="font-sans text-sm font-thin text-stone-800">&</span>
            <span className="font-dancing text-2xl font-medium text-stone-800">C</span>
          </a>
          <p className="text-stone-500 text-sm font-light leading-relaxed max-w-xs">
            11 juillet 2026 · Calcatoggio, Corse
          </p>
          <p className="text-stone-400 text-xs mt-3 italic">
            Une question ? Écrivez-nous, on répond vite.
          </p>
        </div>

        {/* Liens groupés */}
        {FOOTER_LINKS.map(({ group, links }) => (
          <div key={group}>
            <p className="text-xs tracking-widest text-stone-400 uppercase mb-3">{group}</p>
            <ul className="space-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="relative text-sm font-light text-stone-600 hover:text-savethedate-brown transition-colors after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-savethedate-brown after:transition-[width] after:duration-300 hover:after:w-full"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator className="mb-6 bg-savethedate-brown/10" />
      <p className="text-center font-sans text-xs font-light tracking-widest text-stone-400">
        10–12.07.2026
        <span className="mx-2 text-stone-300">•</span>
        Calcatoggio, Corse
      </p>
    </footer>
  );
}
