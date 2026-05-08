import { cn } from "@/lib/utils";

interface LogoMonogramProps {
  className?: string;
}

/**
 * Monogramme entrelacé L & C.
 *
 * Effet d'entrelacement :
 *   - C est derrière L dans la zone de croisement centrale (z-index 1)
 *   - L est devant C (z-index 2) → le fût de L passe devant le corps de C
 *   - La partie haute du C repasse devant L (z-index 3, clip-path sur 40 %) 
 *     → l'arc supérieur du C croise par-dessus la hampe du L
 *
 * Le résultat : L et C se croisent en deux points, ce qui donne l'illusion
 * d'un entrelacement de deux brins.
 */
export function LogoMonogram({ className }: LogoMonogramProps) {
  return (
    <span
      className={cn("relative inline-block select-none", className)}
      style={{ width: "29px", height: "34px" }}
      role="img"
      aria-label="L & C"
    >
      {/* C — couche inférieure (derrière L au centre) */}
      <span
        className="absolute bottom-0 right-0 font-dancing font-semibold text-stone-800 leading-none"
        style={{ fontSize: "28px", zIndex: 1 }}
        aria-hidden="true"
      >
        C
      </span>

      {/* L — couche centrale (devant C dans la zone de croisement) */}
      <span
        className="absolute bottom-0 left-0 font-dancing font-semibold text-stone-800 leading-none"
        style={{ fontSize: "28px", zIndex: 2 }}
        aria-hidden="true"
      >
        L
      </span>

      {/* C haut — couche supérieure, seulement l'arc du haut (croise devant le fût de L) */}
      <span
        className="absolute bottom-0 right-0 font-dancing font-semibold text-stone-800 leading-none"
        style={{
          fontSize: "28px",
          zIndex: 3,
          clipPath: "inset(0 0 60% 0)",
        }}
        aria-hidden="true"
      >
        C
      </span>

      {/* & — minuscule, flottant entre les deux lettres */}
      <span
        className="absolute font-sans font-extralight text-stone-400 leading-none"
        style={{
          fontSize: "7px",
          left: "56%",
          transform: "translateX(-50%)",
          top: "1px",
          zIndex: 4,
        }}
        aria-hidden="true"
      >
        &amp;
      </span>
    </span>
  );
}
