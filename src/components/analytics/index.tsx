import { GoogleAnalytics } from "./google-analytics";
import { PinterestTag } from "./pinterest-tag";

export function AnalyticsScripts() {
  return (
    <>
      <GoogleAnalytics />
      <PinterestTag />
    </>
  );
}

export { GoogleAnalytics } from "./google-analytics";
export { GoogleSearchConsole } from "./google-search-console";
export { PinterestTag } from "./pinterest-tag";
