import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { shortId, username } = await request.json();
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ requireAuth: true }, { status: 401 });
    }

    // Check user's role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // If user is not premium, return 403
    if (profile.role !== "premium") {
      return NextResponse.json({ requireUpgrade: true }, { status: 403 });
    }

    // Get the real tweet ID using short_id
    const { data: tweet, error: tweetError } = await supabase
      .from("tweets")
      .select("id")
      .eq("short_id", shortId)
      .maybeSingle();

    if (tweetError || !tweet) {
      console.log(shortId, tweetError);
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }

    // Return the tweet URL with the real ID
    const tweetUrl = `https://x.com/${username}/status/${tweet.id}`;
    return NextResponse.json({ url: tweetUrl });
  } catch (error) {
    console.error("Error processing tweet URL request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
