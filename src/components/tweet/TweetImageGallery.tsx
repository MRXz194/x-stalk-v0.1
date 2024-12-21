"use client";

import { Media } from "@/lib/types/tweet.types";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { FaPlus, FaPlay } from "react-icons/fa";

interface TweetImageGalleryProps {
  media: Media[];
  onMediaClick: () => void;
}

export default function TweetImageGallery({
  media,
  onMediaClick,
}: TweetImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const imageItems = media.map((item) => ({
    src: item.url,
    alt: item.alt || "Tweet media",
  }));

  const handleImageClick = (index: number, isVideo: boolean) => {
    if (isVideo) {
      onMediaClick();
    } else {
      setPhotoIndex(index);
      setIsOpen(true);
    }
  };

  const getGalleryClassName = () => {
    const baseClass = "tweet-gallery";
    const count = media.length;

    if (count === 1) return `${baseClass} tweet-gallery-single`;
    if (count === 2)
      return `${baseClass} tweet-gallery-grid tweet-gallery-grid-2`;
    if (count === 3)
      return `${baseClass} tweet-gallery-grid tweet-gallery-grid-3`;
    return `${baseClass} tweet-gallery-grid tweet-gallery-grid-4`;
  };

  return (
    <>
      <div className={getGalleryClassName()}>
        {media.slice(0, 4).map((item, index) => {
          const isLastVisible = index === 3 && media.length > 4;
          const isVideo = item.type !== "image";

          return (
            <div
              key={index}
              className="tweet-gallery-image"
              onClick={() => handleImageClick(index, isVideo)}
            >
              <Image
                src={item.url}
                alt={item.alt || "Tweet media"}
                fill
                className={`object-cover ${isVideo ? "brightness-75" : ""}`}
              />
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                    <FaPlay className="text-white w-5 h-5 ml-1" />
                  </div>
                </div>
              )}
              {isLastVisible && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white flex items-center gap-2">
                    <FaPlus />
                    <span>{media.length - 4}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={imageItems}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 5,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
        toolbar={{
          buttons: [
            <div
              key="toolbar-buttons"
              className="flex items-center justify-between w-full"
            >
              <div className="w-20" />
              <button
                type="button"
                className="text-white hover:text-blue-400 w-20 text-right"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>,
          ],
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}
