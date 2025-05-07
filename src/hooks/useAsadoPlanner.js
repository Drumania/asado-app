import { useMemo } from "react";
import combos from "@/data/combos.json";

const GRAMS_PER_ADULT = 600;
const GRAMS_PER_KID = 300;

export function useAsadoPlanner({ adults = 0, kids = 0 }) {
  const totalGrams = adults * GRAMS_PER_ADULT + kids * GRAMS_PER_KID;

  const suggestions = useMemo(() => {
    return combos.map((combo) => {
      const items = Object.entries(combo.distribution).map(([cut, ratio]) => ({
        cut,
        grams: Math.round(totalGrams * ratio),
      }));
      return { ...combo, items };
    });
  }, [totalGrams]);

  return { totalGrams, suggestions };
}
