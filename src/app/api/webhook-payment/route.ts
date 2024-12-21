import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Only need these exports
export const dynamic = "force-dynamic";
export const runtime = "edge";

interface PayloadRow {
  created_at: string;
  message: string;
}

function extractIds(message: string) {
  // Using format: 000XSTALK0PAY{ref}0PROD{id}0CODE{code}0000
  // Make the matching case-insensitive by adding 'i' flag
  const formatMatch = message.match(
    /000XSTALK0PAY(.+?)0PROD(.+?)0CODE(.+?)0000/i
  );

  if (!formatMatch) {
    return {
      paymentReferenceId: null,
      productId: null,
      discountCode: null,
      amount: null,
    };
  }

  const [, paymentReferenceId, productId, discountCode] = formatMatch;

  // Make amount matching case-insensitive too
  const amountMatch = message.match(/^TK 19xxx000 GD: \+([0-9,]+)VND/i);
  const amount = amountMatch
    ? parseFloat(amountMatch[1].replace(",", ""))
    : null;

  return {
    paymentReferenceId,
    productId,
    discountCode,
    amount,
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const row: PayloadRow = payload.data;

    // Extract IDs and amount from the message
    const { paymentReferenceId, productId, amount, discountCode } = extractIds(
      row.message
    );

    // Log the payload with extracted information
    console.log("Webhook Payment Payload:", {
      timestamp: new Date().toISOString(),
      rowIndex: payload.rowIndex,
      created_at: row.created_at,
      extracted: {
        paymentReferenceId,
        productId,
        amount,
        discountCode,
      },
      rawMessage: row.message,
    });

    if (!paymentReferenceId || !productId || amount === null) {
      return NextResponse.json(
        {
          error: "Missing required information",
          details: {
            hasPaymentRefId: !!paymentReferenceId,
            hasProductId: !!productId,
            hasAmount: amount !== null,
          },
        },
        { status: 400 }
      );
    }

    // Get user profile by payment reference ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("auth_id")
      .ilike("payment_reference_id", paymentReferenceId)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          error: "Invalid payment reference ID",
          details: profileError?.message,
        },
        { status: 400 }
      );
    }

    // Get product details and validate amount
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, price")
      .eq("id", productId)
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json(
        {
          error: "Invalid product ID",
          details: productError?.message,
        },
        { status: 400 }
      );
    }

    // Get discount if code exists
    let finalPrice = product.price;
    if (discountCode) {
      const { data: discount } = await supabase
        .from("discount_codes")
        .select("discount_percentage, expires_at")
        .ilike("code", discountCode)
        .eq("is_active", true)
        .maybeSingle();

      if (discount && new Date(discount.expires_at) > new Date()) {
        finalPrice = product.price * (1 - discount.discount_percentage / 100);
      }
    }

    // Validate payment amount against final price
    if (amount !== null) {
      const receivedAmount = parseFloat(amount.toFixed(2));
      const expectedAmount = parseFloat(finalPrice.toFixed(2));

      if (receivedAmount !== expectedAmount) {
        return NextResponse.json(
          {
            error: "Invalid payment amount",
            details: {
              expected: expectedAmount,
              received: receivedAmount,
            },
          },
          { status: 400 }
        );
      }
    }

    // Process payment with validated amount
    const { data: payment, error: paymentError } = await supabase.rpc(
      "process_payment",
      {
        p_user_id: profile.auth_id,
        p_product_id: product.id,
        p_amount: amount, // Use the validated amount
      }
    );

    if (paymentError) {
      console.log("Payment Error:", paymentError);
      return NextResponse.json(
        {
          error: "Failed to process payment",
          details: paymentError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Payment processed successfully",
        payment: {
          ...payment,
          payment_reference_id: paymentReferenceId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook Payment Error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook payload" },
      { status: 500 }
    );
  }
}
