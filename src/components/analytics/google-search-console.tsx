import { analyticsConfig } from "@/lib/analytics/config";

/**
 * Google Search Console verification meta tag placeholder.
 */
export function GoogleSearchConsole() {
  const verification = analyticsConfig.gscVerification;
  if (!verification) return null;

  return <meta name="google-site-verification" content={verification} />;
}
