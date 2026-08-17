export interface PackageSuggestion {
  name: string;
  description: string | null;
  version: string;
}

export interface PackageMetadata {
  name: string;
  version: string;
  description: string | null;
  keywords: string[];
  license: string | null;
  date: string | null;
  homepage: string | null;
  repositoryUrl: string | null;
  bugsUrl: string | null;
  publisher: { username: string; email: string | null } | null;
  maintainers: { username: string; email: string | null }[];
}

export interface PackageMetrics {
  stars: number | null;
  downloadsCount: number;
  communityInterest: number;
  tests: number;
  carefulness: number;
}

export interface DownloadPoint {
  date: string;
  count: number;
}

export interface LanguageBreakdown {
  [language: string]: number;
}

export interface ComparedPackage {
  metadata: PackageMetadata;
  metrics: PackageMetrics;
  downloads: DownloadPoint[];
  languages: LanguageBreakdown | null;
}

export interface RecommendationResult {
  winner: string;
  loser: string;
  multiplier: number;
  scores: Record<string, number>;
}

export interface CompareResponse {
  packages: [ComparedPackage, ComparedPackage];
  recommendation: RecommendationResult;
}
