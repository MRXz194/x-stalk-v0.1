"use client";

import { Tweet } from "@/lib/types/tweet.types";

export default function TweetActions({ tweet }: { tweet: Tweet }) {
  return (
    <div className="tweet-curator">
      <button className="upvote-button">
        <span className="upvote-icon" />
        <span className="upvote-count">
          {tweet.upvotes_count?.[0]?.count || 0}
        </span>
      </button>
      <div className="curator-info">
        Picked by{" "}
        <span className="curator-name">@{tweet.curator.username}</span>
      </div>
    </div>
  );
}
