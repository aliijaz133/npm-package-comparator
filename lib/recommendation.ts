import type { PackageMetrics, RecommendationResult } from "./types";

const WEIGHTS = {
  downloads: 0.5,
  testsAndCarefulness: 0.3,
  communityInterest: 0.2,
};

// Packages are compared pairwise, so metrics are normalized relative to each
// other (winner -> 1, loser -> its share of the winner) rather than against
// npms' internal absolute scale, which isn't meaningful in isolation.
function normalizePair(a: number, b: number): [number, number] {
  const max = Math.max(a, b);
  if (max === 0) return [0, 0];
  return [a / max, b / max];
}

function weightedScore(metrics: PackageMetrics, downloadsNorm: number, communityNorm: number): number {
  return (
    WEIGHTS.downloads * downloadsNorm +
    WEIGHTS.testsAndCarefulness * ((metrics.tests + metrics.carefulness) / 2) +
    WEIGHTS.communityInterest * communityNorm
  );
}

export function computeRecommendation(
  packages: [{ name: string; metrics: PackageMetrics }, { name: string; metrics: PackageMetrics }]
): RecommendationResult {
  const [pkgA, pkgB] = packages;

  // downloadsCount and communityInterest are raw, unbounded npms metrics
  // (unlike tests/carefulness, which npms already normalizes to 0-1), so
  // they need pairwise normalization too.
  const [downloadsA, downloadsB] = normalizePair(
    pkgA.metrics.downloadsCount,
    pkgB.metrics.downloadsCount
  );
  const [communityA, communityB] = normalizePair(
    pkgA.metrics.communityInterest,
    pkgB.metrics.communityInterest
  );

  const scores: Record<string, number> = {
    [pkgA.name]: weightedScore(pkgA.metrics, downloadsA, communityA),
    [pkgB.name]: weightedScore(pkgB.metrics, downloadsB, communityB),
  };

  const [winner, loser] =
    scores[pkgA.name] >= scores[pkgB.name] ? [pkgA.name, pkgB.name] : [pkgB.name, pkgA.name];

  const winnerScore = scores[winner];
  const loserScore = scores[loser];
  const multiplier = winnerScore === 0 ? 1 : winnerScore / Math.max(loserScore, 0.0001);

  return { winner, loser, multiplier, scores };
}
