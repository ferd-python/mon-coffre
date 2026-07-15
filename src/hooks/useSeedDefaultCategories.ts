import { useEffect, useState } from "react";
import { categoryService } from "@/services";

export function useSeedDefaultCategories(enabled: boolean) {
  const [isSeeded, setIsSeeded] = useState(false);

  useEffect(() => {
    if (!enabled || isSeeded) {
      return;
    }

    let isCancelled = false;

    categoryService.seedDefaultCategories().then(() => {
      if (!isCancelled) {
        setIsSeeded(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [enabled, isSeeded]);

  return isSeeded;
}
