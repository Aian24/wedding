"use client";

import { useState, useEffect } from "react";
import { weddingStore, SiteImages, getInitialSiteImages } from "@/lib/weddingStore";

/**
 * Custom React hook that subscribes to dynamic site images
 * updated by the admin in real-time.
 */
export function useSiteImages(): SiteImages {
  const [images, setImages] = useState<SiteImages>(getInitialSiteImages());

  useEffect(() => {
    // Read on client mount
    setImages(weddingStore.getSiteImages());

    // Listen for real-time updates broadcast by weddingStore
    const handleUpdate = () => {
      setImages(weddingStore.getSiteImages());
    };

    window.addEventListener("wedding_images_updated", handleUpdate);
    return () => {
      window.removeEventListener("wedding_images_updated", handleUpdate);
    };
  }, []);

  return images;
}
