# NPM Package Comparator

Compare & Recommend the best NPM package for a keyword. Search two npm packages, see them compared side by side, and get a data-driven recommendation on which one to use.

## Features

- **Search & select** — autocomplete search for npm packages, restricted to exactly two selections at a time (with a toast if you try for a third).
- **Comparison table** — description, keywords, license, repository links, last modification date, authors/publishers, and maintainers for both packages.
- **Downloads chart** — a full year of daily download counts for both packages, plotted side by side.
- **Weighted recommendation** — a winner is picked using 50% downloads, 30% tests & carefulness, and 20% community interest, computed pairwise from live [npms.io](https://api-docs.npms.io/) data.
- **Language breakdown** — the winning package's GitHub language composition (via the [GitHub REST API](https://docs.github.com/en/rest)).
- Shareable comparisons — the selected packages are synced to the URL (`?a=&b=`), so a comparison can be bookmarked or shared.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

### Optional: GitHub token

Language breakdowns are fetched from the GitHub API, which is capped at 60 requests/hour when unauthenticated. Copy `.env.example` to `.env` and set `GITHUB_TOKEN` to a personal access token (no scopes required, public repo read access only) to raise that limit.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, Route Handlers)
- React & TypeScript
- Tailwind CSS
- [Recharts](https://recharts.org) for the downloads chart
- [npms.io API](https://api-docs.npms.io/) and the [GitHub REST API](https://docs.github.com/en/rest) for package data

## Deploy

Deploy on [Vercel](https://vercel.com/new) like any Next.js app — set the `GITHUB_TOKEN` environment variable in the project settings if you want authenticated GitHub API access.

---

Developed by [Ali Ijaz](https://aliijaz-portfolio.vercel.app/).
