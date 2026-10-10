"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import confetti from "canvas-confetti";
import { weddingMusic } from "@/lib/youtubeAudio";
import { useSiteImages } from "@/hooks/useSiteImages";
import { weddingStore, CoupleInfo } from "@/lib/weddingStore";

interface OpeningEnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({ onOpen, isOpen }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(() => weddingStore.getCoupleInfo());
  const videoRef = useRef<HTMLVideoElement>(null);
  const siteImages = useSiteImages();

  useEffect(() => {
    const handleUpdate = () => {
      setCoupleInfo(weddingStore.getCoupleInfo());
    };
    window.addEventListener("wedding_couple_updated", handleUpdate);
    return () => {
      window.removeEventListener("wedding_couple_updated", handleUpdate);
    };
  }, []);

  // Multi-cannon celebratory confetti burst
  const triggerConfetti = () => {
    try {
      // 1. Center vibrant burst
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.6, x: 0.5 },
        zIndex: 999999,
        colors: ["#7094b7", "#ffffff", "#dfc28d", "#a3c1dd", "#1b3b5f", "#ffd700"],
      });

      // 2. Left and right celebratory cannons
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 70,
          origin: { x: 0.15, y: 0.7 },
          zIndex: 999999,
          colors: ["#7094b7", "#dfc28d", "#ffffff", "#1b3b5f"],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 70,
          origin: { x: 0.85, y: 0.7 },
          zIndex: 999999,
          colors: ["#7094b7", "#dfc28d", "#ffffff", "#1b3b5f"],
        });
      }, 200);
    } catch {
      // ignore
    }
  };

  // Click handler on envelope: starts muted video, autoplays main YouTube music, and fires confetti!
  const handleCardClick = () => {
    if (!hasStarted) {
      setHasStarted(true);

      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.warn("Video play error:", err);
        });
      }

      // Autoplay main YouTube music on click
      try {
        weddingMusic.play();
      } catch (err) {
        console.warn("YouTube audio play error:", err);
      }

      // Fire celebratory confetti on click!
      triggerConfetti();
    } else {
      // If clicked again while playing, allow instant closing/entering
      handleAutoCloseInvitation();
    }
  };

  // Auto close the wedding invitation when video is done or when clicked again
  const handleAutoCloseInvitation = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Make sure main YouTube music is playing
    try {
      weddingMusic.play();
    } catch {
      // ignore
    }

    // Fire celebratory confetti again on auto-close/entrance!
    triggerConfetti();

    setTimeout(() => {
      onOpen();
    }, 700);
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f5f0] p-4 sm:p-6 overflow-y-auto select-none"
      >
        {/* Subtle Ambient Paper Glow */}
        <div className="absolute inset-0 bg-radial from-white via-[#f7f5f0] to-[#e7e3d9] pointer-events-none" />

        {/* Envelope Presentation Card - Expanded Width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={
            isOpening
              ? { scale: 1.04, opacity: 0.95 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: 0.7, ease: "easeOut" }}
          onClick={handleCardClick}
          className="relative w-full max-w-[620px] sm:max-w-[700px] md:max-w-[760px] bg-[#fbf9f5] rounded-3xl sm:rounded-[36px] p-6 sm:p-10 shadow-[0_25px_80px_rgba(27,59,95,0.2),0_10px_25px_rgba(0,0,0,0.06)] border border-[#e8e2d5] cursor-pointer flex flex-col items-center justify-between gap-5 sm:gap-6 overflow-hidden group transition-all duration-300 hover:shadow-[0_30px_90px_rgba(27,59,95,0.25)] my-auto"
        >
          {/* Top Header: Dynamic Invitation Title & Date */}
          <div className="text-center pt-2 sm:pt-3 z-20">
            <h1 className="font-script text-4xl sm:text-5xl lg:text-6xl text-[#1b3b5f] tracking-wide leading-tight drop-shadow-xs">
              {coupleInfo.envelopeTitle || "You're Invited"}
            </h1>
            <p className="font-editorial text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#53779d] mt-1 uppercase">
              {coupleInfo.envelopeDate || "12.12.26"}
            </p>
          </div>

          {/* Center Realistic Envelope with Dynamic Video - Widescreen & Prominent */}
          <div className="relative w-full flex items-center justify-center">
            <div className="relative w-full aspect-video max-h-[380px] sm:max-h-[430px] rounded-2xl overflow-hidden shadow-md group-hover:scale-[1.01] transition-transform duration-500 bg-slate-900">
              <video
                ref={videoRef}
                key={siteImages.invitationVideo}
                src={siteImages.invitationVideo}
                muted
                playsInline
                poster={siteImages.envelopeCover}
                onEnded={() => handleAutoCloseInvitation()}
                className="w-full h-full object-cover object-center rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-2xl" />

              {/* Official Botanical Monogram Wax Seal (Visible before click, animates away on play) */}
              <AnimatePresence>
                {!hasStarted && (
                  <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.06, 1], opacity: [0.95, 1, 0.95] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-full overflow-hidden shadow-[0_4px_25px_rgba(27,59,95,0.4),0_0_15px_rgba(223,194,141,0.6)] border-2 border-amber-200/90 bg-white flex items-center justify-center"
                    >
                      <Image
                        src={siteImages.logo}
                        alt="Wedding Seal"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Call to Action - Dynamic Action Text & Script Subtitle */}
          <div className="text-center pb-1 sm:pb-2 z-20 flex flex-col items-center">
            <motion.p
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="font-editorial text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#1b3b5f] drop-shadow-xs"
            >
              {coupleInfo.envelopeAction || "CLICK TO SEE"}
            </motion.p>
            <p className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#53779d] -mt-1 sm:-mt-0.5 tracking-wide">
              {coupleInfo.envelopeSubtitle || "The Magic..."}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
