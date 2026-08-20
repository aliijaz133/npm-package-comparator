"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { CONSENT_COOKIE, CONSENT_MAX_AGE, type ConsentValue } from "@/lib/consent";

function setConsentCookie(value: ConsentValue) {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`;
}

export function CookieConsent({ initialConsent }: { initialConsent: ConsentValue | null }) {
  const router = useRouter();
  const [visible, setVisible] = useState(initialConsent === null);
  // router.refresh() (accept/decline/manage) delivers a new initialConsent prop
  // without remounting this component, so useState's initial value alone won't
  // react to it — sync visibility here whenever the prop actually changes.
  const [trackedConsent, setTrackedConsent] = useState(initialConsent);
  if (initialConsent !== trackedConsent) {
    setTrackedConsent(initialConsent);
    setVisible(initialConsent === null);
  }

  function respond(value: ConsentValue) {
    setConsentCookie(value);
    setVisible(false);
    router.refresh();
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:px-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-300">
          We use cookies to show ads through Google AdSense. Accepting lets us serve
          personalized ads that help keep this tool free; declining keeps ads off entirely.{" "}
          <Link href="/privacy" className="text-blue-400 underline hover:text-blue-300">
            Privacy Policy
          </Link>
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => respond("declined")}
            className="flex-1 rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-400 hover:bg-slate-800 sm:flex-none"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => respond("accepted")}
            className="flex-1 rounded-md bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-950/40 transition-all hover:from-blue-400 hover:to-emerald-400 sm:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
