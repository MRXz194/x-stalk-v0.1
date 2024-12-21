"use client";
import { Media } from "@/lib/types/tweet.types";
import { usePostHog } from "posthog-js/react";
import TweetImageGallery from "./TweetImageGallery";

export default function TweetMedia({
  media,
  shortId,
}: {
  media: Media[];
  shortId: string;
}) {
  const posthog = usePostHog();

  const handleMediaClick = () => {
    posthog?.capture("click_tweet_media", {
      tweet_id: shortId,
    });
  };

  return (
    <div className="mt-2 mb-4">
      <TweetImageGallery media={media} onMediaClick={handleMediaClick} />
    </div>
  );
}
