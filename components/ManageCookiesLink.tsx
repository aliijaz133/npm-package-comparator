"use client";

import { useRouter } from "next/navigation";
import { CONSENT_COOKIE } from "@/lib/consent";

export function ManageCookiesLink() {
  const router = useRouter();

  function reopen() {
    document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={reopen}
      className="text-slate-400 transition-colors hover:text-emerald-400"
    >
      Cookie Preferences
    </button>
  );
}
