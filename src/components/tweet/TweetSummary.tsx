"use client";

import { Summary } from "@/lib/types/tweet.types";
import { useState } from "react";
import { FaRegCopy, FaRegImage } from "react-icons/fa6";

export default function TweetSummary({
  summaries,
  screenshot_url,
}: {
  summaries?: Summary[] | null;
  screenshot_url?: string | null;
}) {
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [activeButton, setActiveButton] = useState<string | null>(null);

  if (!summaries) return null;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaries[0]?.content || "");
      setCopyStatus("Copied!");
      setActiveButton("summary");
      setTimeout(() => {
        setCopyStatus("");
        setActiveButton(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setCopyStatus("Failed");
      setActiveButton("summary");
      setTimeout(() => {
        setCopyStatus("");
        setActiveButton(null);
      }, 2000);
    }
  };

  const handleCopyScreenshot = async () => {
    if (!screenshot_url) {
      setCopyStatus("No screenshot available");
      setActiveButton("screenshot");
      setTimeout(() => {
        setCopyStatus("");
        setActiveButton(null);
      }, 2000);
      return;
    }

    try {
      const response = await fetch(screenshot_url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopyStatus("Copied!");
      setActiveButton("screenshot");
      setTimeout(() => {
        setCopyStatus("");
        setActiveButton(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setCopyStatus("Failed");
      setActiveButton("screenshot");
      setTimeout(() => {
        setCopyStatus("");
        setActiveButton(null);
      }, 2000);
    }
  };

  return (
    <div className="summary-section">
      <div className="flex items-center justify-between">
        <div className="summary-label">Tóm tắt</div>
        <div className="flex gap-1">
          <div className="relative">
            <button
              onClick={handleCopySummary}
              className="p-1.5 text-secondary-text hover:text-primary-text transition-colors"
              title="Copy summary"
            >
              <FaRegCopy className="w-3.5 h-3.5" />
            </button>
            {copyStatus && activeButton === "summary" && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap">
                {copyStatus}
              </div>
            )}
          </div>
          {screenshot_url && (
            <div className="relative">
              <button
                onClick={handleCopyScreenshot}
                className="p-1.5 text-secondary-text hover:text-primary-text transition-colors"
                title="Copy screenshot"
              >
                <FaRegImage className="w-3.5 h-3.5" />
              </button>
              {copyStatus && activeButton === "screenshot" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap">
                  {copyStatus}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="summary-content">{summaries[0]?.content}</div>
    </div>
  );
}
