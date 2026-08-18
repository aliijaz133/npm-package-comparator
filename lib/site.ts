const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://npm-package-comparator.vercel.app";

export const site = {
  name: "NPM Package Comparator",
  shortName: "NPM Comparator",
  description:
    "Compare any two npm packages side by side — downloads, license, maintainers, GitHub languages, and a weighted recommendation based on live downloads, test coverage, and community interest.",
  url: rawSiteUrl.replace(/\/$/, ""),
  keywords: [
    "npm package comparator",
    "compare npm packages",
    "npm package comparison tool",
    "which npm package to use",
    "npm downloads comparison",
    "npm alternatives",
    "javascript package comparison",
    "node package recommendation",
  ],
  author: "Ali Ijaz",
  authorUrl: "https://aliijaz-portfolio.vercel.app/",
  themeColor: "#05070f",
  logoPath: "/logo/logo.png",
};
