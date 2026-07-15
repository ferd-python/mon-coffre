import { useState } from "react";
import { PinScreen } from "@/components/ui";

export interface PinSetupFlowProps {
  onComplete: (pin: string) => void;
  onCancel: () => void;
}

export function PinSetupFlow({ onComplete, onCancel }: PinSetupFlowProps) {
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (pin: string) => {
    if (firstPin === null) {
      setFirstPin(pin);
      setError(undefined);
      return;
    }

    if (pin === firstPin) {
      onComplete(pin);
      return;
    }

    setError("Les codes ne correspondent pas. Réessayez.");
    setFirstPin(null);
  };

  return (
    <PinScreen
      title={firstPin === null ? "Créez votre code PIN" : "Confirmez votre code PIN"}
      subtitle={
        firstPin === null ? "Choisissez un code à 4 chiffres" : "Saisissez à nouveau le même code"
      }
      error={error}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
