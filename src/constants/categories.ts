export const DEFAULT_CATEGORY_NAMES = ["Personnel", "Papa", "Église", "Autres"] as const;

export const CHURCH_CATEGORY_NAME = "Église";

export const PERSONAL_CATEGORY_NAME = "Personnel";

/**
 * Categories whose `nom` drives special calculation logic elsewhere (Personnel's auto-computed
 * balance, Église's merge with cotisations). Renaming or deleting them would silently break
 * that logic, so their name and existence are protected in the UI.
 */
export const PROTECTED_CATEGORY_NAMES = [PERSONAL_CATEGORY_NAME, CHURCH_CATEGORY_NAME] as const;

export function isProtectedCategoryName(nom: string): boolean {
  return (PROTECTED_CATEGORY_NAMES as readonly string[]).includes(nom);
}
