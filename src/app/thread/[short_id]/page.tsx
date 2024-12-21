import TweetCard from "@/components/tweet/TweetCard";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Thread } from "@/lib/types/tweet.types";
import BackButton from "@/components/ui/Button/BackButton";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ short_id: string }>;
}) {
  // First get the tweet with the matching short_id
  const { data: tweet, error: tweetError } = await supabase
    .from("tweets")
    .select("id")
    .eq("short_id", (await params).short_id)
    .maybeSingle();

  if (tweetError || !tweet) {
    notFound();
  }

  // Then fetch the full thread using the real tweet ID
  const { data: threadData, error } = await supabase.rpc("fetch_thread_by_id", {
    main_tweet_id: tweet.id,
  });

  if (error || !threadData || threadData.length === 0) {
    notFound();
  }

  const thread: Thread = threadData[0];

  return (
    <main className="container mx-auto px-4 py-8">
      <BackButton />
      <TweetCard thread={thread} isFullView={true} />
    </main>
  );
}
