import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1, // Immediately send events
      flushInterval: 0,
    });
  }
  return posthogClient;
}

// Helper to ensure events are sent before the serverless function ends
export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}
