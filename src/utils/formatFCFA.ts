import { CURRENCY_LABEL, DEFAULT_LOCALE } from "@/constants/app";

export function formatFCFA(amount: number): string {
  const formatted = new Intl.NumberFormat(DEFAULT_LOCALE, {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ${CURRENCY_LABEL}`;
}
