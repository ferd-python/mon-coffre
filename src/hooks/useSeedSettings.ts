import { useEffect, useState } from "react";
import { settingsService } from "@/services";

export function useSeedSettings(enabled: boolean) {
  const [isSeeded, setIsSeeded] = useState(false);

  useEffect(() => {
    if (!enabled || isSeeded) {
      return;
    }

    let isCancelled = false;

    settingsService.ensureExists().then(() => {
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
