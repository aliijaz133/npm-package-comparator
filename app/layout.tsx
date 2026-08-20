import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { CONSENT_COOKIE, isConsentValue } from "@/lib/consent";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Compare & Recommend the Best NPM Package`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.author, url: site.authorUrl }],
  creator: site.author,
  applicationName: site.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: site.logoPath,
    apple: site.logoPath,
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Compare & Recommend the Best NPM Package`,
    description: site.description,
    images: [{ url: site.logoPath, width: 1254, height: 1254, alt: site.name }],
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${site.name} — Compare & Recommend the Best NPM Package`,
    description: site.description,
    images: [site.logoPath],
  },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: site.name,
  url: site.url,
  description: site.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: site.author,
    url: site.authorUrl,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get(CONSENT_COOKIE)?.value;
  const consent = isConsentValue(consentCookie) ? consentCookie : null;
  const adsAllowed = Boolean(adsenseClientId) && consent === "accepted";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {adsAllowed && (
          // Rendered as a plain <script> (not next/script) so Google's AdSense
          // site-verification crawler finds a literal tag in the static HTML —
          // every next/script strategy defers real insertion to client-side JS.
          // Only included once cookie consent is accepted.
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <CookieConsent initialConsent={consent} />
      </body>
    </html>
  );
}
