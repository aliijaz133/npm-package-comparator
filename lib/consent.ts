export const CONSENT_COOKIE = "cookie_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export type ConsentValue = "accepted" | "declined";

export function isConsentValue(value: string | undefined): value is ConsentValue {
  return value === "accepted" || value === "declined";
}
