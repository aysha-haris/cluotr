import { env } from "@/lib/env";

export const analyticsConfig = {
  gaMeasurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  gscVerification: env.NEXT_PUBLIC_GSC_VERIFICATION,
  pinterestTagId: env.NEXT_PUBLIC_PINTEREST_TAG_ID,
} as const;

export function isAnalyticsEnabled(): boolean {
  return Boolean(
    analyticsConfig.gaMeasurementId ||
      analyticsConfig.gscVerification ||
      analyticsConfig.pinterestTagId,
  );
}
