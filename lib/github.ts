import type { LanguageBreakdown } from "./types";

export async function fetchLanguages(
  owner: string,
  repo: string
): Promise<LanguageBreakdown | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
    headers,
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}
