import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { Comparator } from "@/components/Comparator";
import { ToastProvider } from "@/components/Toast";
import { AdSlot } from "@/components/AdSlot";
import { ManageCookiesLink } from "@/components/ManageCookiesLink";
import { CONSENT_COOKIE, isConsentValue } from "@/lib/consent";

export default async function Home() {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get(CONSENT_COOKIE)?.value;
  const consent = isConsentValue(consentCookie) ? consentCookie : null;
  const adsAllowed = Boolean(adsenseClientId) && consent === "accepted";

  return (
    <ToastProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/60 px-6 py-4 backdrop-blur-sm">
          <Image
            src="/logo/logo.png"
            alt="NPM Package Comparator logo"
            width={36}
            height={36}
            className="rounded-md"
            priority
          />
          <h1 className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-lg font-bold text-transparent">
            NPM Package Comparator
          </h1>
          <span className="hidden text-sm text-slate-500 sm:inline">
            Compare &amp; Recommend the best NPM package
          </span>
        </header>

        <main className="flex flex-1 flex-col items-center gap-6 px-4 py-6 sm:px-6 sm:py-10">
          <div className="w-full max-w-3xl">
            <AdSlot slot="9128568448" enabled={adsAllowed} label="Advertisement" />
          </div>

          <Suspense>
            <Comparator />
          </Suspense>

          <div className="w-full max-w-3xl">
            <AdSlot slot="4155443362" enabled={adsAllowed} label="Advertisement" />
          </div>
        </main>

        <footer className="flex flex-col items-center gap-2 py-6 text-center text-sm text-slate-500">
          <p>
            Copyright ©{new Date().getFullYear()}{" "}
            <a
              href="https://aliijaz-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-emerald-400"
            >
              Ali Ijaz
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="text-slate-400 transition-colors hover:text-emerald-400">
              Privacy Policy
            </Link>
            <span aria-hidden className="text-slate-700">
              •
            </span>
            <ManageCookiesLink />
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
