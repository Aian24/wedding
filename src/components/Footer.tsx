"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Mail, ShieldCheck } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { weddingStore, CoupleInfo, getInitialCoupleInfo } from "@/lib/weddingStore";
import { useSiteImages } from "@/hooks/useSiteImages";

interface FooterProps {
  onReopenEnvelope: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReopenEnvelope }) => {
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(getInitialCoupleInfo());
  const siteImages = useSiteImages();

  useEffect(() => {
    setCoupleInfo(weddingStore.getCoupleInfo());
    const handleCoupleUpdate = () => {
      setCoupleInfo(weddingStore.getCoupleInfo());
    };
    window.addEventListener("wedding_couple_updated", handleCoupleUpdate);
    return () => window.removeEventListener("wedding_couple_updated", handleCoupleUpdate);
  }, []);

  return (
    <footer className="bg-[#0e1d2f] text-white pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-t border-blue-900/60 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-4 shadow-2xl border-2 border-amber-200/80 ring-4 ring-white/10 bg-white">
          <Image
            src={siteImages.logo}
            alt="Official Wedding Monogram Crest Logo"
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <p className="font-script text-3xl sm:text-4xl text-amber-200 mb-2">
          We can&apos;t wait to celebrate with you!
        </p>

        <h3 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-widest text-white uppercase mb-2">
          {coupleInfo.groomNickname} &amp; {coupleInfo.brideNickname}
        </h3>

        <p className="text-xs uppercase tracking-[0.3em] text-blue-300 font-semibold mb-6">
          {coupleInfo.hashtag}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-10">
          <button
            onClick={onReopenEnvelope}
            className="hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#7094b7]" />
            <span>Invitation Cover</span>
          </button>
          <span>&bull;</span>
          <a href="#hero" className="hover:text-amber-200 transition-colors">
            Back to Top
          </a>
          <span>&bull;</span>
          <a href="#details" className="hover:text-amber-200 transition-colors">
            Venues &amp; Map
          </a>
          <span>&bull;</span>
          <a href="#rsvp" className="hover:text-amber-200 transition-colors text-amber-300 font-bold">
            RSVP
          </a>
        </div>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent mx-auto mb-8" />

        <p className="font-serif-title italic text-xs text-slate-400 max-w-lg mx-auto leading-relaxed mb-8">
          &ldquo;{coupleInfo.footerVerse || "Love is patient, love is kind. It does not envy, it does not boast, it is not proud... It always protects, always trusts, always hopes, always perseveres. Love never fails."}&rdquo;
          <span className="block not-italic text-[10px] uppercase tracking-widest text-amber-200/80 mt-1">
            {coupleInfo.footerVerseCitation || "— 1 Corinthians 13:4-8"}
          </span>
        </p>

        <div className="pt-6 border-t border-blue-900/50 flex flex-col items-center justify-center gap-3 text-[11px] text-slate-400">
          <p className="flex items-center gap-1 text-center">
            {coupleInfo.footerCredit ? (
              <span>{coupleInfo.footerCredit}</span>
            ) : (
              <>
                Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" /> for {coupleInfo.groomNickname || coupleInfo.groomName} &amp; {coupleInfo.brideNickname || coupleInfo.brideName} &bull; 2026
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};
