import { Tweet } from "@/lib/types/tweet.types";
import TweetSummary from "./TweetSummary";
import TweetMedia from "./TweetMedia";
import TweetContent from "./TweetContent";
import TweetLink from "./TweetLink";

export default function QuotedTweet({ tweet }: { tweet: Tweet }) {
  return (
    <div className="quoted-tweet">
      <div className="tweet-header">
        <div className="tweet-authors">
          <span className="x-account">@{tweet.x_account?.username}</span>
        </div>
      </div>
      <TweetLink
        shortId={tweet.short_id}
        username={tweet.x_account.username}
        source="quoted_tweet"
      >
        <div className="original-tweet">
          <TweetContent
            content={tweet.content}
            linkInText={tweet.link_in_text}
          />
        </div>
        {tweet.media && tweet.media.length > 0 && (
          <TweetMedia media={tweet.media} shortId={tweet.short_id} />
        )}
      </TweetLink>
      <TweetSummary summaries={tweet.summaries} />
    </div>
  );
}
