"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import AuthModal from "../auth/AuthModal";
import OrderModal from "../payment/OrderModal";

interface TweetLinkProps {
  shortId: string;
  username: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => Promise<void>;
  source?: string;
  openInNewTab?: boolean;
}

export default function TweetLink({
  shortId,
  username,
  children,
  className = "",
  onClick,
  source = "timeline",
  openInNewTab = true,
}: TweetLinkProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const posthog = usePostHog();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (onClick) {
      await onClick();
    }

    try {
      const response = await fetch("/api/tweet-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shortId,
          username,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setShowAuthModal(true);
        return;
      }

      if (response.status === 403) {
        setShowOrderModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to get tweet URL");
      }

      posthog?.capture("click_open_in_twitter", {
        username,
        tweet_id: shortId,
        source,
      });

      if (openInNewTab) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening tweet:", error);
    }
  };

  return (
    <>
      <a href="#" onClick={handleClick} className={className}>
        {children}
      </a>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setShowOrderModal(true);
        }}
      />
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </>
  );
}
