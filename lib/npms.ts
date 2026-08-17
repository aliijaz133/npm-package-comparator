import type { PackageMetadata, PackageMetrics, PackageSuggestion } from "./types";

const NPMS_API_BASE = "https://api.npms.io/v2";

interface NpmsSuggestion {
  package: {
    name: string;
    version: string;
    description?: string | null;
  };
}

interface NpmsMaintainer {
  username: string;
  email?: string | null;
}

interface NpmsPackageInfo {
  collected: {
    metadata: {
      name: string;
      version: string;
      description?: string | null;
      keywords?: string[];
      date?: string | null;
      license?: string | null;
      links?: {
        homepage?: string | null;
        repository?: string | null;
        bugs?: string | null;
      };
      publisher?: NpmsMaintainer | null;
      maintainers?: NpmsMaintainer[];
    };
    github?: {
      starsCount?: number;
    } | null;
  };
  evaluation: {
    quality: {
      carefulness: number;
      tests: number;
    };
    popularity: {
      communityInterest: number;
      downloadsCount: number;
    };
  };
}

type NpmsMgetResponse = Record<string, NpmsPackageInfo>;

export async function fetchSuggestions(query: string): Promise<PackageSuggestion[]> {
  if (!query.trim()) return [];

  const url = `${NPMS_API_BASE}/search/suggestions?q=${encodeURIComponent(query)}&size=8`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`npms suggestions request failed: ${res.status}`);
  }

  const data: NpmsSuggestion[] = await res.json();
  return data.map((item) => ({
    name: item.package.name,
    description: item.package.description ?? null,
    version: item.package.version,
  }));
}

export async function fetchPackageInfo(
  names: [string, string]
): Promise<Record<string, { metadata: PackageMetadata; metrics: PackageMetrics }>> {
  const res = await fetch(`${NPMS_API_BASE}/package/mget`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(names),
  });

  if (!res.ok) {
    throw new Error(`npms mget request failed: ${res.status}`);
  }

  const data: NpmsMgetResponse = await res.json();

  const result: Record<string, { metadata: PackageMetadata; metrics: PackageMetrics }> = {};
  for (const name of names) {
    const info = data[name];
    if (!info) {
      throw new Error(`Package not found: ${name}`);
    }

    const { metadata } = info.collected;
    result[name] = {
      metadata: {
        name: metadata.name,
        version: metadata.version,
        description: metadata.description ?? null,
        keywords: metadata.keywords ?? [],
        license: metadata.license ?? null,
        date: metadata.date ?? null,
        homepage: metadata.links?.homepage ?? null,
        repositoryUrl: metadata.links?.repository ?? null,
        bugsUrl: metadata.links?.bugs ?? null,
        publisher: metadata.publisher
          ? { username: metadata.publisher.username, email: metadata.publisher.email ?? null }
          : null,
        maintainers: (metadata.maintainers ?? []).map((m) => ({
          username: m.username,
          email: m.email ?? null,
        })),
      },
      metrics: {
        stars: info.collected.github?.starsCount ?? null,
        downloadsCount: info.evaluation.popularity.downloadsCount,
        communityInterest: info.evaluation.popularity.communityInterest,
        tests: info.evaluation.quality.tests,
        carefulness: info.evaluation.quality.carefulness,
      },
    };
  }

  return result;
}

export function parseGithubRepo(repositoryUrl: string | null): { owner: string; repo: string } | null {
  if (!repositoryUrl) return null;

  const match = repositoryUrl.match(/github\.com[/:]([^/]+)\/([^/#]+?)(?:\.git)?\/?$/);
  if (!match) return null;

  return { owner: match[1], repo: match[2] };
}
