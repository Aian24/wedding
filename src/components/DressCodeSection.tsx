"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { weddingStore, ThemeColor, DressCodeItem } from "@/lib/weddingStore";
import { weddingData } from "@/data/weddingData";
import { useSiteImages } from "@/hooks/useSiteImages";

export const DressCodeSection: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [colors, setColors] = useState<ThemeColor[]>([]);
  const [dressCodes, setDressCodes] = useState<DressCodeItem[]>([]);
  const siteImages = useSiteImages();

  useEffect(() => {
    setColors(weddingStore.getThemeColors());
    setDressCodes(weddingStore.getDressCodes());

    const handleThemeUpdate = () => {
      setColors(weddingStore.getThemeColors());
    };
    const handleDressUpdate = () => {
      setDressCodes(weddingStore.getDressCodes());
    };

    window.addEventListener("wedding_theme_updated", handleThemeUpdate);
    window.addEventListener("wedding_dress_codes_updated", handleDressUpdate);
    return () => {
      window.removeEventListener("wedding_theme_updated", handleThemeUpdate);
      window.removeEventListener("wedding_dress_codes_updated", handleDressUpdate);
    };
  }, []);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <section id="dress-code" className="pt-10 sm:pt-14 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbfc] via-[#f0f6fc] to-[#fafbfc] relative overflow-hidden">
      {/* Corner Botanical Floral Accents */}
      <div className="absolute top-0 -right-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0">
        <Image
          src={siteImages.floralCorner}
          alt=""
          fill
          unoptimized
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 -left-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0 rotate-180">
        <Image
          src={siteImages.floralCorner}
          alt=""
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          {/* Floral Header Banner */}
          <div className="relative w-36 sm:w-44 h-10 sm:h-14 mx-auto mb-1 opacity-85">
            <Image
              src={siteImages.floralDivider}
              alt="Dusty Blue Floral Header"
              fill
              unoptimized
              className="object-contain mix-blend-multiply"
            />
          </div>
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <span className="h-px w-8 bg-[#7094b7]" />
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Palette &amp; Attire</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Wedding Color Palette &amp; Dress Code
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-light">
            {weddingData.theme.description}
          </p>
        </motion.div>

        {/* Color Palette Swatches (3 colors per line on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-4 sm:p-8 border border-blue-100 shadow-xl relative mb-12"
        >
          <div className="text-center mb-6 flex flex-col items-center">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mb-1.5 border border-blue-200 shadow-md">
              <Image
                src={siteImages.logo}
                alt="A&D Crest"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#7094b7] font-bold">
              Official Wedding Swatches (Click to Copy HEX)
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#1b3b5f]">
              {weddingData.theme.name}
            </h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {colors.map((color) => (
              <div
                key={color.id || color.name}
                onClick={() => handleCopyHex(color.hex)}
                className="cursor-pointer group flex flex-col items-center text-center p-2 sm:p-3 rounded-2xl hover:bg-white/90 transition-all border border-transparent hover:border-blue-200 shadow-2xs hover:shadow-md"
              >
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full shadow-md border-2 sm:border-4 border-white mb-2 group-hover:scale-105 transition-all duration-300 relative flex items-center justify-center shrink-0"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full inset-0 absolute flex items-center justify-center text-white text-xs font-medium">
                    {copiedHex === color.hex ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </div>
                </div>

                <p className="font-serif-title text-[11px] sm:text-xs lg:text-sm font-bold text-[#1b3b5f] truncate max-w-full">
                  {color.name}
                </p>
                <p className="text-[9px] sm:text-[10px] font-mono font-medium text-slate-400 uppercase">
                  {color.hex}
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 font-light leading-tight line-clamp-2">
                  {color.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3 Dress Code Categories (Brides & Grooms, Ninang & Ninong, Guests) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {dressCodes.map((item, index) => {
            const fallbackImage =
              index === 0
                ? (siteImages.ladiesAttire || "/images/attire-bridesmaids-groomsmen.jpg")
                : index === 1
                ? (siteImages.menAttire || "/images/attire-ninang-ninong.jpg")
                : (siteImages.guestAttire || "/images/attire-guests.jpg");

            // Guard: Hero background photo (couple portrait) must NEVER appear on dress code cards
            const isHeroBgImage =
              item.image &&
              (item.image === siteImages.heroPoster ||
                item.image.includes("/images/hero.jpg") ||
                item.image.includes("heroPoster"));

            const displayImage =
              item.image && !isHeroBgImage ? item.image : fallbackImage;

            return (
              <motion.div
                key={item.id || item.category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-3xl overflow-hidden border border-blue-100 shadow-xl flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden group bg-slate-100">
                  <Image
                    src={displayImage}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#1b3b5f]/90 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-amber-200/50">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-title text-lg sm:text-xl font-bold text-[#1b3b5f] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#7094b7] font-semibold uppercase tracking-wider mb-2">
                      {item.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>
                  {item.reminder && (
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed mt-auto">
                      {item.reminder}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
