import type { DownloadPoint } from "./types";

interface NpmDownloadsRangeResponse {
  downloads: { day: string; downloads: number }[];
}

export async function fetchDownloadsRange(packageName: string): Promise<DownloadPoint[]> {
  const url = `https://api.npmjs.org/downloads/range/last-year/${encodeURIComponent(packageName)}`;
  const res = await fetch(url);

  if (!res.ok) {
    // Packages younger than the requested range (or unpublished) return 404/400 — treat as no data.
    return [];
  }

  const data: NpmDownloadsRangeResponse = await res.json();
  return (data.downloads ?? []).map((point) => ({
    date: point.day,
    count: point.downloads,
  }));
}
