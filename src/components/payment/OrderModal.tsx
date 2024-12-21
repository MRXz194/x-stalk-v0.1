"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Profile {
  payment_reference_id: number;
  role: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface DiscountCode {
  code: string;
  discount_percentage: number;
  expires_at: string;
}

interface ProductDetails {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
  };
  discount: DiscountCode | null;
  finalPrice: number;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [discount, setDiscount] = useState<DiscountCode | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
      fetchProductDetails(2000);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!discount?.expires_at) return;

    const saleEndDate = new Date(discount.expires_at);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = saleEndDate.getTime() - now.getTime();

      if (difference <= 0) {
        setDiscount(null);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [discount?.expires_at]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/profile");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile");
      }

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductDetails = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/price`);
      const data = await response.json();

      console.log(data);

      if (response.ok) {
        setProductDetails(data);
        setDiscount(data.discount);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handlePayment = () => {
    if (!profile?.payment_reference_id || !productDetails) {
      setError("Payment reference ID not found");
      return;
    }

    let content = `000XSTALK0PAY${
      profile.payment_reference_id
    }0PROD${productDetails.product.id.toString().padStart(4, "0")}`;

    if (discount?.code) {
      content += `0CODE${discount.code}`;
    }

    content += "0000";

    const encodedContent = encodeURIComponent(content);
    const qrUrl = `https://qrcode.io.vn/api/generate/970422/199419940000/${productDetails.finalPrice}/${encodedContent}`;

    setQrCode(qrUrl);
    setShowQR(true);
  };

  const handleRefresh = () => {
    onClose();
    router.refresh();
  };

  const originalPrice = productDetails?.product.price ?? 99000;
  const discountedPrice = productDetails?.finalPrice ?? originalPrice;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : showQR ? (
          <div>
            <h3 className="text-xl font-bold mb-4">Scan QR Code to Pay</h3>
            <div className="mb-4 font-medium uppercase text-left">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <p className="text-gray-600">Bank:</p>
                <p className="text-blue-600">MBBank</p>

                <p className="text-gray-600">Amount:</p>
                <p className="text-blue-600">
                  {discountedPrice.toLocaleString("vi-VN")} VND
                </p>

                <p className="text-gray-600">Content:</p>
                <div>
                  <div className="bg-blue-50 border border-blue-100 rounded p-2 text-xs break-all">
                    <span className="text-blue-700 font-mono">
                      {`000XSTALK0PAY${
                        profile?.payment_reference_id
                      }0PROD${productDetails?.product.id
                        .toString()
                        .padStart(4, "0")}${
                        discount?.code ? `0CODE${discount.code}` : ""
                      }0000`}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 normal-case italic">
                    (auto entered, don&apos;t change)
                  </p>
                </div>
              </div>
            </div>
            {qrCode && (
              <>
                <div className="mb-4 text-center">
                  <Image
                    src={qrCode}
                    alt="Payment QR Code"
                    className="mx-auto max-w-[250px]"
                    width={250}
                    height={250}
                  />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800">
                    After payment, please wait 1-3 minutes for our system to
                    process your transaction. Click the refresh button below to
                    check your premium status.
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors mb-4"
                >
                  Refresh Status
                </button>
              </>
            )}
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open your mobile banking app</li>
                <li>Select the QR payment/scan option</li>
                <li>Scan this QR code</li>
                <li>Complete the transaction</li>
              </ol>
            </div>
            <button
              onClick={() => setShowQR(false)}
              className="mt-4 text-blue-500 hover:text-blue-600"
            >
              ← Back to package details
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Early Bird Package</h3>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-lg font-semibold text-blue-600">
                    {discountedPrice.toLocaleString("vi-VN")} VND
                  </p>
                  {discount && (
                    <p className="text-gray-500 line-through">
                      {originalPrice.toLocaleString("vi-VN")} VND
                    </p>
                  )}
                </div>
                {discount && (
                  <div className="bg-red-50 border border-red-100 rounded-md p-2 mb-2">
                    <p className="text-red-600 font-medium text-sm">
                      {discount.discount_percentage}% OFF - Limited Time Offer
                    </p>
                    <div className="text-xs text-gray-600 mt-1">
                      Ends in: {timeLeft.days}d {timeLeft.hours}h{" "}
                      {timeLeft.minutes}m {timeLeft.seconds}s
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-600">(one-time payment)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Lifetime access to premium features
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    View the original tweet
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Access to all future premium features
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={handlePayment}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              {discount
                ? `Buy Now at ${discount.discount_percentage}% OFF`
                : "Buy Now"}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
