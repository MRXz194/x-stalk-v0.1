"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// Create a separate component for pageview tracking
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/ingest`,
      ui_host: "https://us.posthog.com",
      capture_pageview: false, // Disable automatic pageview capture
      capture_pageleave: true,
      loaded: (posthogInstance) => {
        if (process.env.NODE_ENV === "development") {
          // Type-safe way to expose PostHog in development
          (window as { posthog?: typeof posthogInstance }).posthog =
            posthogInstance;
        }
      },
    });
  }, []);

  // Wrap with Suspense to avoid useSearchParams causing client-side rendering
  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </Provider>
  );
}
