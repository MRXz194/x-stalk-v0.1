"use client";

import { Thread } from "@/lib/types/tweet.types";
import TweetMedia from "./TweetMedia";
import TweetSummary from "./TweetSummary";
import TweetActions from "./TweetActions";
import {
  FaRegHeart,
  FaRegComment,
  FaRetweet,
  FaRegBookmark,
  FaRegEye,
} from "react-icons/fa";
import Link from "next/link";
import QuotedTweet from "./QuotedTweet";
import ThreadReplies from "./ThreadReplies";
import { usePostHog } from "posthog-js/react";
import TweetContent from "./TweetContent";
import TweetLink from "./TweetLink";

interface TweetCardProps {
  thread: Thread;
  index?: number;
  isFullView?: boolean;
}

export default function TweetCard({
  thread,
  index,
  isFullView = false,
}: TweetCardProps) {
  const posthog = usePostHog();
  const { main_tweet, quoted_tweet, replies } = thread;

  const handleProfileClick = () => {
    posthog?.capture("click_x_profile", {
      username: main_tweet.x_account.username,
      source: isFullView ? "thread_view" : "timeline",
    });
  };

  return (
    <div className="py-1.5">
      {/* Index row */}
      {index && (
        <div className="text-gray-500 font-normal text-sm px-4 mb-1">
          {index}.
        </div>
      )}

      {/* Content row with indentation */}
      <div className="flex">
        {/* Indentation column */}
        {!isFullView && <div className="w-6" />}

        {/* Main content column */}
        <div className="flex-1 px-4">
          <div className="flex items-center justify-between">
            <a
              href={`https://x.com/${main_tweet.x_account.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 text-sm"
              onClick={handleProfileClick}
            >
              @{main_tweet.x_account.username}
            </a>
            <TweetLink
              shortId={main_tweet.short_id}
              username={main_tweet.x_account.username}
              className="text-gray-500 hover:text-gray-700 text-xs"
              source={isFullView ? "thread_view" : "timeline"}
            >
              Open in X →
            </TweetLink>
          </div>

          <div className="mt-1">
            <div className={`${!isFullView ? "line-clamp-3" : ""} text-sm`}>
              <TweetContent
                content={main_tweet.content}
                linkInText={main_tweet.link_in_text}
              />
            </div>

            {!isFullView && (
              <div className="mt-1">
                <Link
                  href={`/thread/${main_tweet.short_id}`}
                  className="text-blue-500 hover:text-blue-600 text-xs"
                >
                  View full thread →
                </Link>
              </div>
            )}

            {main_tweet.media && main_tweet.media.length > 0 && (
              <TweetMedia
                media={main_tweet.media}
                shortId={main_tweet.short_id}
              />
            )}

            <div className="flex gap-3 text-xs text-gray-500 mt-1.5 mb-4">
              <span className="flex items-center gap-0.5">
                <FaRegEye className="w-3 h-3" /> {main_tweet.stats.views}
              </span>
              <span className="flex items-center gap-0.5">
                <FaRegComment className="w-3 h-3" /> {main_tweet.stats.replies}
              </span>
              <span className="flex items-center gap-0.5">
                <FaRegHeart className="w-3 h-3" /> {main_tweet.stats.likes}
              </span>
              <span className="flex items-center gap-0.5">
                <FaRetweet className="w-3 h-3" /> {main_tweet.stats.retweets}
              </span>
              <span className="flex items-center gap-0.5">
                <FaRegBookmark className="w-3 h-3" />{" "}
                {main_tweet.stats.bookmarks}
              </span>
            </div>

            <TweetSummary
              summaries={main_tweet.summaries}
              screenshot_url={main_tweet.screenshot_url}
            />
            <TweetActions tweet={main_tweet} />

            {isFullView && quoted_tweet?.short_id && (
              <QuotedTweet tweet={quoted_tweet} />
            )}
            {isFullView && replies && replies.length > 0 && (
              <ThreadReplies replies={replies} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
