import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const productId = parseInt((await params).productId);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, price, description")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get active default discount for the product
    const { data: discount, error: discountError } = await supabase
      .from("discount_codes")
      .select("code, discount_percentage, expires_at")
      .eq("product_id", productId)
      .eq("type", "default")
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (discountError) {
      return NextResponse.json(
        { error: "Failed to fetch discount" },
        { status: 500 }
      );
    }

    // Calculate final price
    const finalPrice = discount
      ? product.price * (1 - discount.discount_percentage / 100)
      : product.price;

    return NextResponse.json({
      product,
      discount,
      finalPrice,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
