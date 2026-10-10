"use client";

import React, { useState, useEffect } from "react";
import { Music, Volume2, VolumeX, Play, Pause, Disc, ExternalLink } from "lucide-react";
import { weddingMusic } from "@/lib/youtubeAudio";
import { weddingStore, CoupleInfo, getInitialCoupleInfo } from "@/lib/weddingStore";
import { motion, AnimatePresence } from "framer-motion";

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(getInitialCoupleInfo());

  useEffect(() => {
    setCoupleInfo(weddingStore.getCoupleInfo());
    const handleCoupleUpdate = () => {
      setCoupleInfo(weddingStore.getCoupleInfo());
    };
    window.addEventListener("wedding_couple_updated", handleCoupleUpdate);

    const unsubscribe = weddingMusic.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsMuted(state.isMuted);
    });

    return () => {
      window.removeEventListener("wedding_couple_updated", handleCoupleUpdate);
      unsubscribe();
    };
  }, []);

  const togglePlayback = () => {
    weddingMusic.toggle();
  };

  const toggleMute = () => {
    weddingMusic.toggleMute();
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <div className="flex items-center gap-2">
        {/* Main Floating Music Pill */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 bg-[#0e1d2f]/90 text-white backdrop-blur-md px-3.5 py-2.5 rounded-full shadow-2xl border border-blue-400/30 hover:border-amber-300/60 transition-all duration-300 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Rotating vinyl icon */}
          <div className="relative flex items-center justify-center">
            <Disc
              className={`w-6 h-6 text-amber-300 ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "3.5s" }}
            />
            {isPlaying && (
              <span className="absolute w-2 h-2 rounded-full bg-emerald-400 -top-0.5 -right-0.5 animate-ping" />
            )}
          </div>

          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="text-[10px] uppercase tracking-wider text-amber-200 font-semibold leading-none">
              Now Playing
            </span>
            <span className="text-xs font-medium text-white truncate max-w-[130px]">
              {isPlaying ? (coupleInfo.bgMusicTitle || "Dear Biyenan") : "Music Paused"}
            </span>
          </div>

          {/* Play / Pause button inside pill */}
          <button
            id="music-toggle-btn"
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
            onClick={(e) => {
              e.stopPropagation();
              togglePlayback();
            }}
            className="w-7 h-7 rounded-full bg-blue-600/60 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-sm ml-1"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            )}
          </button>
        </motion.div>

        {/* Mute button */}
        <button
          id="music-mute-btn"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:text-blue-900 hover:bg-white shadow-lg border border-blue-100 flex items-center justify-center transition-all backdrop-blur-sm"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-blue-700" />
          )}
        </button>
      </div>

      {/* Expanded Details popup */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-14 left-0 w-72 p-4 rounded-2xl bg-[#0e1d2f]/95 text-white backdrop-blur-xl border border-blue-400/40 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-300" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">
                  Official Wedding Song
                </span>
              </div>
              <a
                href={coupleInfo.bgMusicYoutubeUrl || "https://www.youtube.com/watch?v=5e_KM3SuBjE"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1"
                title="Open on YouTube"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-sm font-serif-title font-bold text-white mb-0.5">
              {coupleInfo.bgMusicTitle || "Dear Biyenan"}
            </p>
            <p className="text-[11px] text-amber-200/90 font-medium mb-1">
              {coupleInfo.bgMusicArtist || "Breezy Boys • JE Beats"}
            </p>
            <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
              Special wedding soundtrack dedicated to {coupleInfo.groomNickname || "Aian"} &amp; {coupleInfo.brideNickname || "Dang"}&apos;s holy matrimony.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-blue-800/60">
              <button
                onClick={togglePlayback}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isPlaying ? "Pause Music" : "Play Music"}
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
