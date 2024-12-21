import { Thread } from "@/lib/types/tweet.types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Update your Thread type to include pagination info
type PaginatedThreadsResponse = {
  data: Thread[];
  total_count: number;
  total_pages: number;
};

export async function getThreadsPaginated({
  page,
  limit = 10,
}: {
  page: number;
  limit: number;
}): Promise<PaginatedThreadsResponse> {
  try {
    const { data, error } = await supabase.rpc("fetch_threads", {
      limit_count: limit,
      offset_count: (page - 1) * limit,
    });

    if (error) throw error;

    if (data.length === 0) {
      return {
        data: [],
        total_count: 0,
        total_pages: 0,
      };
    }

    // The first item contains the pagination info
    const { total_count, total_pages } = data[0];

    return {
      data,
      total_count,
      total_pages,
    };
  } catch (error) {
    console.error("Error fetching tweets:", error);
    throw new Error("Failed to fetch tweets");
  }
}
