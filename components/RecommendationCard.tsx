import type { ComparedPackage, RecommendationResult } from "@/lib/types";
import { formatCompactNumber } from "@/lib/format";

interface RecommendationCardProps {
  names: [string, string];
  packages: [ComparedPackage, ComparedPackage];
  recommendation: RecommendationResult;
}

export function RecommendationCard({ names, packages, recommendation }: RecommendationCardProps) {
  const winnerIndex = names.indexOf(recommendation.winner);
  const winner = packages[winnerIndex];
  const totalDownloads = winner.downloads.reduce((sum, point) => sum + point.count, 0);
  const health = Math.round(recommendation.scores[recommendation.winner] * 100);
  const languages = winner.languages
    ? Object.keys(winner.languages).sort((a, b) => winner.languages![b] - winner.languages![a])
    : [];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/30">
      <div className="px-6 pt-6 text-center text-lg">
        <span className="mr-1">✨</span>
        <span className="text-slate-300">{recommendation.winner} is</span>{" "}
        <span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text font-bold text-transparent">
          {recommendation.multiplier.toFixed(2)}x better!
        </span>
        <span className="ml-1">✨</span>
      </div>

      <div className="mx-6 my-6 rounded-lg bg-linear-to-r from-blue-500/40 to-emerald-500/40 p-px">
        <div className="flex flex-col justify-between gap-4 rounded-lg bg-slate-900 p-5 sm:flex-row">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span aria-hidden>👑</span>
              <span className="font-semibold text-slate-100">{recommendation.winner}</span>
              <span className="rounded border border-emerald-500/40 bg-linear-to-r from-blue-500/15 to-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                recommended
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              {winner.metadata.description ?? "No description available."}
            </p>

            {languages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {languages.map((language) => (
                  <span
                    key={language}
                    className="rounded border border-slate-700 px-2 py-0.5 text-xs text-slate-300"
                  >
                    {language}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              {winner.metadata.repositoryUrl && (
                <a
                  href={winner.metadata.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Repository
                </a>
              )}
              {winner.metadata.homepage && (
                <a
                  href={winner.metadata.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Documentation
                </a>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-8 text-center sm:pl-6">
            <Stat label="Downloads" value={`${formatCompactNumber(totalDownloads)}+`} accent="text-blue-400" />
            <Stat
              label="Stars"
              value={winner.metrics.stars ? `${formatCompactNumber(winner.metrics.stars)}+` : "N/A"}
              accent="text-amber-400"
            />
            <Stat label="Health" value={`${health}%`} accent="text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-lg font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
