import Script from "next/script";

import { analyticsConfig } from "@/lib/analytics/config";

/**
 * Google Analytics placeholder — wire up when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 */
export function GoogleAnalytics() {
  const measurementId = analyticsConfig.gaMeasurementId;
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
