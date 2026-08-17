import type { ReactNode } from "react";
import type { ComparedPackage } from "@/lib/types";
import { formatRelativeDate } from "@/lib/format";

interface ComparisonTableProps {
  packages: [ComparedPackage, ComparedPackage];
}

const LINK_ACCENT = ["text-blue-400 hover:text-blue-300", "text-emerald-400 hover:text-emerald-300"];

export function ComparisonTable({ packages }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/30">
      <h2 className="px-6 pt-6 text-lg font-semibold text-slate-100">Comparison</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <tbody>
            <Row
              label="Package Name"
              values={packages.map(
                (pkg) => `${pkg.metadata.name} (v${pkg.metadata.version})`
              )}
            />
            <Row
              label="Description"
              values={packages.map((pkg) => pkg.metadata.description ?? "N/A")}
            />
            <Row
              label="Keywords"
              values={packages.map((pkg) =>
                pkg.metadata.keywords.length ? (
                  <div className="flex flex-wrap gap-1.5" key="keywords">
                    {pkg.metadata.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded border border-slate-700 px-2 py-0.5 text-xs text-slate-300"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  "N/A"
                )
              )}
            />
            <Row
              label="Repository"
              values={packages.map((pkg, index) => (
                <div className="flex flex-wrap gap-4" key="repo">
                  {pkg.metadata.homepage && (
                    <a
                      href={pkg.metadata.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${LINK_ACCENT[index]} hover:underline`}
                    >
                      Homepage
                    </a>
                  )}
                  {pkg.metadata.bugsUrl && (
                    <a
                      href={pkg.metadata.bugsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${LINK_ACCENT[index]} hover:underline`}
                    >
                      Bugs
                    </a>
                  )}
                  {pkg.metadata.repositoryUrl && (
                    <a
                      href={pkg.metadata.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${LINK_ACCENT[index]} hover:underline`}
                    >
                      GitHub
                    </a>
                  )}
                </div>
              ))}
            />
            <Row
              label="License"
              values={packages.map((pkg) =>
                pkg.metadata.license ? (
                  <span
                    key="license"
                    className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300"
                  >
                    {pkg.metadata.license}
                  </span>
                ) : (
                  "N/A"
                )
              )}
            />
            <Row
              label="Last Modification Date"
              values={packages.map((pkg) => formatRelativeDate(pkg.metadata.date))}
            />
            <Row
              label="Authors/Publishers"
              values={packages.map((pkg, index) =>
                pkg.metadata.publisher ? (
                  <a
                    key="publisher"
                    href={`https://www.npmjs.com/~${pkg.metadata.publisher.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${LINK_ACCENT[index]} hover:underline`}
                  >
                    {pkg.metadata.publisher.username}
                  </a>
                ) : (
                  "N/A"
                )
              )}
            />
            <Row
              label="Maintainers"
              values={packages.map((pkg) =>
                pkg.metadata.maintainers.length
                  ? pkg.metadata.maintainers.map((m) => m.email ?? m.username).join(", ")
                  : "N/A"
              )}
            />
          </tbody>
        </table>
      </div>
      <div className="h-2" />
    </div>
  );
}

function Row({
  label,
  values,
}: {
  label: string;
  values: ReactNode[];
}) {
  return (
    <tr className="border-t border-slate-800">
      <td className="w-1/4 px-6 py-4 align-top font-medium text-slate-500">{label}</td>
      {values.map((value, index) => (
        <td key={index} className="w-[37.5%] px-6 py-4 align-top text-slate-200">
          {value}
        </td>
      ))}
    </tr>
  );
}
