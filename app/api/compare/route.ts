import { NextRequest, NextResponse } from "next/server";
import { fetchPackageInfo, parseGithubRepo } from "@/lib/npms";
import { fetchDownloadsRange } from "@/lib/npm-downloads";
import { fetchLanguages } from "@/lib/github";
import { computeRecommendation } from "@/lib/recommendation";
import type { ComparedPackage, CompareResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const a = request.nextUrl.searchParams.get("a");
  const b = request.nextUrl.searchParams.get("b");

  if (!a || !b) {
    return NextResponse.json({ error: "Two package names are required" }, { status: 400 });
  }
  if (a === b) {
    return NextResponse.json({ error: "Pick two different packages" }, { status: 400 });
  }

  let info;
  try {
    info = await fetchPackageInfo([a, b]);
  } catch (error) {
    console.error("Failed to fetch package info:", error);
    return NextResponse.json(
      { error: `Couldn't find one or both packages: ${a}, ${b}` },
      { status: 404 }
    );
  }

  const names: [string, string] = [a, b];

  const packages = await Promise.all(
    names.map(async (name): Promise<ComparedPackage> => {
      const { metadata, metrics } = info[name];
      const repo = parseGithubRepo(metadata.repositoryUrl);

      const [downloads, languages] = await Promise.all([
        fetchDownloadsRange(name),
        repo ? fetchLanguages(repo.owner, repo.repo) : Promise.resolve(null),
      ]);

      return { metadata, metrics, downloads, languages };
    })
  );

  const recommendation = computeRecommendation([
    { name: a, metrics: packages[0].metrics },
    { name: b, metrics: packages[1].metrics },
  ]);

  const response: CompareResponse = {
    packages: [packages[0], packages[1]],
    recommendation,
  };

  return NextResponse.json(response);
}
