"use client";

export default function NewTweetsBanner() {
  return (
    <div
      className="new-tweets-indicator"
      onClick={() => window.location.reload()}
    >
      New tweets available! Tap to load.
    </div>
  );
}
