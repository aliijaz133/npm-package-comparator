"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  slot: string;
  label?: string;
  className?: string;
}

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSlot({ slot, label = "Advertisement", className = "" }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!adsenseClientId || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense push failed:", error);
    }
  }, []);

  if (!adsenseClientId) {
    return (
      <div
        className={`flex min-h-24 w-full items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/40 text-xs text-slate-600 ${className}`}
      >
        Ad space — set NEXT_PUBLIC_ADSENSE_CLIENT_ID to enable
      </div>
    );
  }

  return (
    <div className={`ad-slot w-full ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-slate-600">
        {label}
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseClientId}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}
