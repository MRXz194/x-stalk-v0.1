"use client";

import { NextUIProvider } from "@nextui-org/react";
import { PostHogProvider } from "@/components/providers/PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <PostHogProvider>{children}</PostHogProvider>
    </NextUIProvider>
  );
}
