export interface Tweet {
  id: bigint;
  short_id: string;
  content: string;
  media: Media[] | null;
  stats: TweetStats;
  created_at: string;
  curator_id: bigint;
  x_account_id: bigint;
  thread_id?: bigint;
  quote_tweet_id?: bigint;
  updated_at: string;
  is_draft: boolean;
  screenshot_url: string | null;
  link_in_text: string | null;
  summaries: Summary[] | null;
  curator: {
    username: string;
  };
  x_account: {
    username: string;
  };
  upvotes_count:
    | [
        {
          count: number;
        }
      ]
    | null;
  quoted_tweet?: Tweet;
  replies?: Tweet[];
}

export interface Media {
  type: "image" | "video";
  url: string;
  alt?: string;
}

export interface Summary {
  id: number;
  tweet_id: bigint;
  content: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface TweetStats {
  likes: number;
  replies: number;
  retweets: number;
  bookmarks: number;
  views: number;
}

export interface Curator {
  username: string;
  upvotes: number;
}

export interface Thread {
  main_tweet: Tweet;
  quoted_tweet: Tweet | null;
  replies: Tweet[];
}
