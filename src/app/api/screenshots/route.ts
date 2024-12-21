import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const tweetId = formData.get("tweetId") as string;

    if (!file || !tweetId) {
      return NextResponse.json(
        { error: "File and tweet ID are required" },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("tweet-screenshots")
      .upload(`tweets/${tweetId}.png`, file, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("tweet-screenshots")
      .getPublicUrl(`tweets/${tweetId}.png`);

    // Return the URL without updating the tweet
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error handling screenshot:", error);
    return NextResponse.json(
      { error: "Failed to process screenshot" },
      { status: 500 }
    );
  }
}
