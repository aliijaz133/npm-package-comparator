export async function GET() {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  const body = adsenseClientId
    ? `google.com, ${adsenseClientId.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`
    : "# Set NEXT_PUBLIC_ADSENSE_CLIENT_ID to publish this site's ads.txt entry.\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
