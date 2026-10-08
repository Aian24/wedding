"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import confetti from "canvas-confetti";
import { weddingMusic } from "@/lib/youtubeAudio";

interface OpeningEnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({ onOpen, isOpen }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [guestName, setGuestName] = useState<string>("");

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
    if (isOpening) return;
    setIsOpening(true);

    // 1. Play YouTube Wedding Song "Dear Biyenan"
    try {
      weddingMusic.play();
    } catch {
      // ignore
    }

    // 2. Confetti blast
    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#7094b7", "#ffffff", "#dfc28d", "#a3c1dd", "#1b3b5f"],
      });
    } catch {
      // ignore
    }

    // 3. Smooth transition to main invitation
    setTimeout(() => {
      onOpen();
    }, 900);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.06,
          transition: { duration: 0.8, ease: "easeInOut" },
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f5f0] p-4 sm:p-6 overflow-hidden select-none"
      >
        {/* Subtle Ambient Paper Glow */}
        <div className="absolute inset-0 bg-radial from-white via-[#f7f5f0] to-[#e7e3d9] pointer-events-none" />

        {/* Envelope Presentation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={
            isOpening
              ? { scale: 1.04, opacity: 0.95 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: 0.7, ease: "easeOut" }}
          onClick={handleOpenInvitation}
          className="relative w-full max-w-[460px] bg-[#fbf9f5] rounded-3xl sm:rounded-[36px] p-6 sm:p-8 shadow-[0_25px_70px_rgba(27,59,95,0.18),0_10px_25px_rgba(0,0,0,0.06)] border border-[#e8e2d5] cursor-pointer flex flex-col items-center justify-between aspect-[3/4.2] overflow-hidden group transition-all duration-300 hover:shadow-[0_30px_90px_rgba(27,59,95,0.25)]"
        >
          {/* Top Names & Date Header */}
          <div className="text-center pt-2 sm:pt-4 z-20">
            <h1 className="font-script text-4xl sm:text-5xl lg:text-6xl text-[#1b3b5f] tracking-wide leading-tight drop-shadow-xs">
              Aian &bull; Dang
            </h1>
            <p className="font-editorial text-sm sm:text-base font-semibold tracking-[0.25em] text-[#53779d] mt-1 sm:mt-1.5 uppercase">
              12.12.26
            </p>

            {guestName && (
              <div className="mt-2 inline-block px-3.5 py-0.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-[11px] text-[#1b3b5f] font-serif-title tracking-wider">
                Prepared for <span className="font-bold">{guestName}</span>
              </div>
            )}
          </div>

          {/* Center Realistic Envelope with Botanical Flowers */}
          <div className="relative w-full flex-1 my-2 flex items-center justify-center">
            <div className="relative w-[92%] sm:w-[96%] aspect-[4/3] rounded-2xl overflow-hidden shadow-md group-hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/images/envelope-cover.jpg"
                alt="Aian & Dang Wedding Invitation Envelope"
                fill
                priority
                sizes="(max-width: 640px) 90vw, 450px"
                className="object-cover object-center rounded-2xl"
              />

              {/* Official Botanical Monogram Wax Seal */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={
                    isOpening
                      ? { scale: [1, 1.8, 0], opacity: [1, 0.8, 0] }
                      : { scale: [1, 1.06, 1], opacity: [0.95, 1, 0.95] }
                  }
                  transition={{
                    duration: isOpening ? 0.5 : 2.5,
                    repeat: isOpening ? 0 : Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-[0_4px_25px_rgba(27,59,95,0.4),0_0_15px_rgba(223,194,141,0.6)] border-2 border-amber-200/90 bg-white"
                >
                  <Image
                    src="/images/wedding-logo.png"
                    alt="Aian & Dang Seal"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="text-center pb-2 sm:pb-3 z-20 flex flex-col items-center">
            <motion.p
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="font-editorial text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#1b3b5f] drop-shadow-xs"
            >
              CLICK TO OPEN
            </motion.p>
            <p className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#53779d] -mt-1 sm:-mt-0.5 tracking-wide">
              The Magic...
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
