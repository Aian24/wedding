"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Heart } from "lucide-react";

interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  category: "all" | "portraits" | "venues" | "details";
  span?: string;
}

export const PhotoGallerySection: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "portraits" | "venues" | "details">("all");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const photos: GalleryPhoto[] = [
    {
      id: "p1",
      src: "/images/hero.jpg",
      title: "Sunset Embrace by the Coast",
      category: "portraits",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      id: "p2",
      src: "/images/story.jpg",
      title: "Forever Love & Pure Joy",
      category: "portraits",
    },
    {
      id: "p3",
      src: "/images/rings.jpg",
      title: "Heirloom Rings & A&D Wax Seal",
      category: "details",
    },
    {
      id: "p4",
      src: "/images/ceremony.jpg",
      title: "Sacred Cathedral Sanctuary",
      category: "venues",
      span: "md:col-span-2",
    },
    {
      id: "p5",
      src: "/images/reception.jpg",
      title: "Grand Sapphire Ballroom & Chandeliers",
      category: "venues",
    },
    {
      id: "p6",
      src: "/images/sunset.jpg",
      title: "Cliffside Stroll into Eternity",
      category: "portraits",
    },
  ];

  const filteredPhotos =
    filter === "all" ? photos : photos.filter((p) => p.category === filter);

  const handleOpenLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const handleNextPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafbfc] relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#7094b7]" />
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Captured Moments</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Prenup &amp; Memory Gallery
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light">
            Glimpses of our love captured under golden skies and endless ocean horizons.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {[
            { key: "all", label: "All Photos" },
            { key: "portraits", label: "Romantic Portraits" },
            { key: "venues", label: "Venues" },
            { key: "details", label: "Details & Rings" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 ${
                filter === tab.key
                  ? "bg-[#1b3b5f] text-white shadow-md border border-amber-200/50"
                  : "bg-white text-slate-600 hover:bg-blue-50 border border-blue-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={`group relative rounded-3xl overflow-hidden shadow-lg border-2 border-white cursor-pointer bg-slate-100 ${
                photo.span || ""
              }`}
              onClick={() => handleOpenLightbox(idx)}
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d2f]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white" />
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center justify-between">
                <div>
                  <p className="font-serif-title text-sm sm:text-base font-bold drop-shadow-md">
                    {photo.title}
                  </p>
                  <p className="text-[11px] text-amber-200 uppercase tracking-wider">
                    Aian &amp; Dang &bull; 2026
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActivePhotoIndex(null)}
          >
            <button
              id="close-lightbox-btn"
              aria-label="Close photo preview"
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              id="prev-lightbox-btn"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <button
              id="next-lightbox-btn"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            <div
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={filteredPhotos[activePhotoIndex].src}
                  alt={filteredPhotos[activePhotoIndex].title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="mt-4 text-center text-white">
                <h3 className="font-serif-title text-lg sm:text-xl font-bold">
                  {filteredPhotos[activePhotoIndex].title}
                </h3>
                <p className="text-xs text-amber-200 uppercase tracking-widest mt-1">
                  Photo {activePhotoIndex + 1} of {filteredPhotos.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
