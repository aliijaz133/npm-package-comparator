import { Suspense } from "react";
import Image from "next/image";
import { Comparator } from "@/components/Comparator";
import { ToastProvider } from "@/components/Toast";
import { AdSlot } from "@/components/AdSlot";

export default function Home() {
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

        <main className="flex flex-1 flex-col items-center gap-6 px-6 py-10">
          <div className="w-full max-w-3xl">
            <AdSlot slot="1111111111" label="Advertisement" />
          </div>

          <Suspense>
            <Comparator />
          </Suspense>

          <div className="w-full max-w-3xl">
            <AdSlot slot="2222222222" label="Advertisement" />
          </div>
        </main>

        <footer className="py-6 text-center text-sm text-slate-500">
          Copyright ©{new Date().getFullYear()}{" "}
          <a
            href="https://aliijaz-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition-colors hover:text-emerald-400"
          >
            Ali Ijaz
          </a>
        </footer>
      </div>
    </ToastProvider>
  );
}
