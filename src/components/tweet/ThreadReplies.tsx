import { Tweet } from "@/lib/types/tweet.types";
import TweetMedia from "./TweetMedia";
import TweetSummary from "./TweetSummary";
import {
  FaRegHeart,
  FaRegComment,
  FaRetweet,
  FaRegBookmark,
  FaRegEye,
} from "react-icons/fa";
import TweetContent from "./TweetContent";
import TweetLink from "./TweetLink";

export default function ThreadReplies({ replies }: { replies: Tweet[] }) {
  if (!replies.length) return null;

  return (
    <div className="thread-replies">
      {replies.map((reply) => {
        return (
          <div key={reply.short_id} className="thread-reply">
            <div className="tweet-header">
              <span className="username">@{reply.x_account.username}</span>
              <TweetLink
                shortId={reply.short_id}
                username={reply.x_account.username}
                className="twitter-link"
                source="thread_reply"
              >
                Open in Twitter →
              </TweetLink>
            </div>
            <div className="original-tweet">
              <TweetContent
                content={reply.content}
                linkInText={reply.link_in_text}
              />
            </div>
            {reply.media && reply.media.length > 0 && (
              <TweetMedia media={reply.media} shortId={reply.short_id} />
            )}
            <div className="tweet-stats">
              <span>
                <FaRegEye className="tweet-stat-icon" /> {reply.stats.views}
              </span>
              <span>
                <FaRegComment className="tweet-stat-icon" />{" "}
                {reply.stats.replies}
              </span>
              <span>
                <FaRegHeart className="tweet-stat-icon" /> {reply.stats.likes}
              </span>
              <span>
                <FaRetweet className="tweet-stat-icon" /> {reply.stats.retweets}
              </span>
              <span>
                <FaRegBookmark className="tweet-stat-icon" />{" "}
                {reply.stats.bookmarks}
              </span>
            </div>
            <TweetSummary summaries={reply.summaries} />
          </div>
        );
      })}
    </div>
  );
}
