import { Metadata } from "next";
import { getThreadsPaginated } from "@/app/api/get-threads-paginated";
import TweetList from "@/components/tweet/TweetList";

export const metadata: Metadata = {
  title: "X-stalk",
  description: "Cutting through the noise, highlighting the signal",
};

export async function generateStaticParams() {
  // We'll get the first page to know total pages
  const { total_pages } = await getThreadsPaginated({ page: 1, limit: 10 });

  return Array.from({ length: total_pages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const pageParam = (await params).page;
  const page = parseInt(pageParam);

  const { data: threads, total_pages } = await getThreadsPaginated({
    page,
    limit: 10,
  });

  return (
    <main>
      <header className="text-center mb-12">
        <h1 className="site-title mb-2 pt-8">X-stalk</h1>
        <p className="site-tagline">
          Cutting Through the Noise, Highlighting the Signal
        </p>
      </header>
      <TweetList
        threads={threads}
        currentPage={page}
        totalPages={total_pages}
      />
    </main>
  );
}
