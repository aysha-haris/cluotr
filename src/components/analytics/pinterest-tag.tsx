import Script from "next/script";

import { analyticsConfig } from "@/lib/analytics/config";

/**
 * Pinterest Tag placeholder — wire up when NEXT_PUBLIC_PINTEREST_TAG_ID is set.
 */
export function PinterestTag() {
  const tagId = analyticsConfig.pinterestTagId;
  if (!tagId) return null;

  return (
    <Script id="pinterest-tag" strategy="afterInteractive">
      {`
        !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
        pintrk('load', '${tagId}');
        pintrk('page');
      `}
    </Script>
  );
}
