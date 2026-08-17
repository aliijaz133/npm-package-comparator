import { Suspense } from "react";
import Image from "next/image";
import { Comparator } from "@/components/Comparator";
import { ToastProvider } from "@/components/Toast";

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

        <main className="flex flex-1 justify-center px-6 py-10">
          <Suspense>
            <Comparator />
          </Suspense>
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
