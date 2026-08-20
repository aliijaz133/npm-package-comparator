import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} uses cookies and handles data.`,
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
        ← Back to {site.name}
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-100">Privacy Policy</h1>
      <p className="mt-1 text-sm text-slate-500">Last updated: August 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-7 text-slate-300">
        <section>
          <h2 className="text-lg font-semibold text-slate-100">Overview</h2>
          <p className="mt-2">
            {site.name} ({site.url}) is a tool for comparing npm packages. This page explains
            what cookies we use and what choices you have.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100">Cookies we use</h2>
          <p className="mt-2">
            The only cookie this site sets is a small preference cookie (
            <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-200">
              cookie_consent
            </code>
            ) that remembers your accept/decline choice below. It contains no personal data.
          </p>
          <p className="mt-2">
            If you accept, this site also loads{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Google AdSense
            </a>
            , which may set its own cookies to serve and measure ads, including personalizing
            them based on your activity across sites. If you decline, AdSense is not loaded and
            no advertising cookies are set. See{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Google&apos;s Privacy Policy
            </a>{" "}
            for how Google handles this data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100">What we don&apos;t do</h2>
          <p className="mt-2">
            We don&apos;t use analytics cookies, don&apos;t require accounts or logins, and
            don&apos;t store the packages you search or compare — comparisons are fetched live
            from the npm/GitHub APIs and only kept in your browser&apos;s URL for sharing, never
            saved on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100">Your choices</h2>
          <p className="mt-2">
            You can change your decision at any time using the &ldquo;Cookie Preferences&rdquo;
            link in the footer, or by clearing cookies for this site in your browser.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent via{" "}
            <a
              href={site.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              {site.author}&apos;s site
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
