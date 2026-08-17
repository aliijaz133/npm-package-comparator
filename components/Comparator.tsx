"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CompareResponse } from "@/lib/types";
import { SearchBox } from "./SearchBox";
import { ComparisonTable } from "./ComparisonTable";
import { DownloadsChart } from "./DownloadsChart";
import { RecommendationCard } from "./RecommendationCard";
import { useToast } from "./Toast";

export function Comparator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialA = searchParams.get("a");
  const initialB = searchParams.get("b");

  const [selected, setSelected] = useState<string[]>(
    initialA && initialB ? [initialA, initialB] : []
  );
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  const runCompare = useCallback(
    async (names: [string, string]) => {
      setLoading(true);
      setResult(null);
      try {
        const res = await fetch(
          `/api/compare?a=${encodeURIComponent(names[0])}&b=${encodeURIComponent(names[1])}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Comparison failed");
        }
        setResult(data);
        router.replace(`?a=${encodeURIComponent(names[0])}&b=${encodeURIComponent(names[1])}`, {
          scroll: false,
        });
      } catch (error) {
        notify(error instanceof Error ? error.message : "Comparison failed");
      } finally {
        setLoading(false);
      }
    },
    [notify, router]
  );

  useEffect(() => {
    if (!initialA || !initialB) return;
    // Deferred so the initial fetch is triggered from a callback rather than
    // synchronously during the effect, matching the compare-on-mount pattern.
    const id = setTimeout(() => runCompare([initialA, initialB]), 0);
    return () => clearTimeout(id);
    // Only run on mount — subsequent comparisons are user-triggered via handleCompare.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(names: string[]) {
    setSelected(names);
    setResult(null);
  }

  function handleCompare() {
    if (selected.length !== 2) return;
    runCompare([selected[0], selected[1]]);
  }

  const names = result ? ([selected[0], selected[1]] as [string, string]) : null;

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <SearchBox selected={selected} onChange={handleChange} onCompare={handleCompare} loading={loading} />

      {result && names && (
        <>
          <ComparisonTable packages={result.packages} />
          <DownloadsChart names={names} packages={result.packages} />
          <RecommendationCard names={names} packages={result.packages} recommendation={result.recommendation} />
        </>
      )}
    </div>
  );
}
