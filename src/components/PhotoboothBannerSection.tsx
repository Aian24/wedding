"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Sparkles, Download, Printer, Images, ArrowRight } from "lucide-react";
import { useSiteImages } from "@/hooks/useSiteImages";

export const PhotoboothBannerSection: React.FC = () => {
  const siteImages = useSiteImages();

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbfc] via-[#f0f6fc] to-[#fafbfc] relative overflow-hidden">
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

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-6 sm:p-10 border border-blue-100 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#1b3b5f] text-[10px] font-bold uppercase tracking-wider mb-3">
                <Camera className="w-3.5 h-3.5 text-[#7094b7]" />
                <span>Interactive Keepsake</span>
              </div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1b3b5f] mb-2 leading-tight">
                Step into Our Wedding Photo Booth
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mb-6 max-w-lg">
                Strike 4 poses for our camera! Customize your official wedding photo strip in classic Dusty Blue, Slate, or Navy, then download high-res PNG or print your custom souvenir strip.
              </p>

              {/* Highlights Feature Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-6 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-blue-100 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>4 Quick Shots</span>
                </span>
                <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-blue-100 shadow-2xs">
                  <Download className="w-3 h-3 text-[#7094b7]" />
                  <span>Free High-Res PNG</span>
                </span>
                <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-blue-100 shadow-2xs">
                  <Printer className="w-3 h-3 text-emerald-600" />
                  <span>Instant Print</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <Link
                  href="/photobooth"
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#1b3b5f] to-[#2e5782] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-103 transition-all inline-flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4 text-amber-200" />
                  <span>Open Photo Booth</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>

                <Link
                  href="/photobooth/gallery"
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-[#1b3b5f] border border-blue-200 text-xs font-semibold shadow-xs transition-all inline-flex items-center justify-center gap-2"
                >
                  <Images className="w-4 h-4 text-[#7094b7]" />
                  <span>View Live Gallery</span>
                </Link>
              </div>
            </div>

            {/* Right Mini Photo Strip Graphic Representation */}
            <div className="relative shrink-0 w-36 sm:w-44 p-2.5 rounded-2xl bg-white shadow-xl border border-blue-100 rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-lg bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50 border border-slate-200 flex items-center justify-center"
                  >
                    <Camera className="w-4 h-4 text-blue-300" />
                  </div>
                ))}
              </div>
              <div className="mt-2 text-center border-t border-slate-100 pt-1.5">
                <p className="font-serif-title text-[9px] font-bold text-[#1b3b5f]">Aian &amp; Dang</p>
                <p className="text-[7px] text-[#7094b7] font-medium tracking-wider">12.12.2026</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
