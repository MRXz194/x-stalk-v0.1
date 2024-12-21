import { Thread } from "@/lib/types/tweet.types";
import TweetCard from "@/components/tweet/TweetCard";
import Pagination from "../common/Pagination";

export default function TweetList({
  threads,
  currentPage,
  totalPages,
}: {
  threads: Thread[];
  currentPage: number;
  totalPages: number;
}) {
  const ITEMS_PER_PAGE = 10; // This should match your API limit

  return (
    <div className="container min-h-screen flex flex-col">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        urlPattern="path"
      />
      <div className="flex-grow">
        {threads.map((thread, index) => (
          <TweetCard
            key={thread.main_tweet.short_id}
            thread={thread}
            index={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        urlPattern="path"
      />
    </div>
  );
}
