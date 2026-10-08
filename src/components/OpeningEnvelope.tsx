"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MailOpen, Mail } from "lucide-react";
import confetti from "canvas-confetti";
import { weddingAudio } from "@/lib/soundSynthesizer";

interface OpeningEnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({ onOpen, isOpen }) => {
  const [guestName, setGuestName] = useState<string>("Special Guest & Family");
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("guest") || params.get("name");
      if (to) {
        setGuestName(decodeURIComponent(to));
      }
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsOpeningAnim(true);

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7094b7", "#ffffff", "#dfc28d", "#a3c1dd", "#1b3b5f"],
      });
    } catch {
      // ignore
    }

    try {
      weddingAudio.play();
    } catch {
      // ignore
    }

    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: "easeInOut" } }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e1d2f]/95 p-4 backdrop-blur-xl overflow-hidden"
      >
        {/* Soft background ambient glow */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-200/15 blur-3xl animate-pulse" />
        </div>

        {/* Envelope Box */}
        <div className="relative w-full max-w-lg mx-auto">
          <motion.div
            initial={{ y: 25, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative bg-gradient-to-b from-[#fbfdff] via-[#f2f7fc] to-[#e6eff8] rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/60 text-center overflow-hidden"
            style={{
              boxShadow: "0 25px 60px -15px rgba(14, 29, 47, 0.4), 0 0 0 1px rgba(255,255,255,0.8) inset",
            }}
          >
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-300 via-amber-200 to-blue-400" />

            {/* Monogram */}
            <div className="mx-auto mb-4 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#1b3b5f] to-[#3a6088] text-white flex items-center justify-center shadow-lg border-2 border-amber-200/80">
                <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-widest text-amber-100">
                  A &amp; D
                </span>
              </div>
            </div>

            {/* Header */}
            <p className="font-script text-2xl sm:text-3xl text-[#7094b7] mb-1">
              You are cordially invited
            </p>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-wider text-[#0e1d2f] uppercase">
              Aian &amp; Dang
            </h1>
            <div className="flex items-center justify-center gap-2 my-2 text-xs uppercase tracking-[0.25em] text-[#7094b7]">
              <span>Together with their families</span>
            </div>

            {/* Recipient Ribbon Card */}
            <div className="my-6 p-4 rounded-2xl bg-white/90 border border-blue-100 shadow-sm backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                Specially Prepared For
              </p>
              <p className="font-serif-title text-lg sm:text-xl font-bold text-[#1b3b5f]">
                {guestName}
              </p>
            </div>

            {/* Date Details */}
            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-600 mb-8">
              <span>Saturday</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="font-semibold text-[#1b3b5f]">December 12, 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Tagaytay</span>
            </div>

            {/* Open Button */}
            <div className="relative flex flex-col items-center justify-center">
              <motion.button
                id="open-invitation-btn"
                onClick={handleOpenInvitation}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                animate={
                  isOpeningAnim
                    ? { rotate: 360, scale: 0.8, opacity: 0 }
                    : { y: [0, -3, 0] }
                }
                transition={{
                  y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                }}
                className="group relative cursor-pointer px-8 py-4 rounded-full bg-gradient-to-r from-[#1b3b5f] via-[#2d5682] to-[#1b3b5f] text-white font-semibold text-sm sm:text-base tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 border border-amber-200/50"
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-slate-900 flex items-center justify-center text-xs font-bold shadow-inner">
                  AD
                </span>
                <span>Open Digital Invitation</span>
                <MailOpen className="w-5 h-5 text-amber-200 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <p className="mt-3 text-[11px] tracking-wider text-slate-500 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                Tap to unlock the celebration details &amp; music
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
