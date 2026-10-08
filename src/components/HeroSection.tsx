"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, ChevronDown } from "lucide-react";
import { weddingData } from "@/data/weddingData";

export const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-12-12T15:00:00+08:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-start pt-6 sm:pt-8 md:pt-10 pb-10 px-4 overflow-hidden">
      {/* Looping Hero Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero.jpg"
          className="w-full h-full object-cover object-center"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1d2f]/75 via-[#0e1d2f]/45 to-[#0e1d2f]/80" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center text-white w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Monogram Crest / Official Floral Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-2 sm:mb-3 relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-2xl border-2 border-white/60 ring-4 ring-white/20 bg-white"
          >
            <Image
              src="/images/wedding-logo.png"
              alt="Aian & Dang Monogram Crest Logo"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-script text-2xl sm:text-4xl lg:text-5xl text-amber-200 mb-1 drop-shadow-md"
          >
            Together with our families
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-blue-100 font-semibold mb-1.5"
          >
            We invite you to celebrate the marriage of
          </motion.p>

          {/* Names */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-white uppercase drop-shadow-lg mb-1"
          >
            Aian <span className="font-script text-3xl sm:text-5xl lg:text-6xl text-amber-200 lowercase">&amp;</span> Dang
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-[11px] sm:text-xs font-light tracking-[0.2em] uppercase text-slate-200 mb-3.5 sm:mb-4"
          >
            Aian Christopher Ramos &amp; Ma. Andrea Santos
          </motion.p>

          {/* Date & Location Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-5"
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-medium tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Saturday, December 12, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-medium tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Tagaytay, Philippines</span>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="w-full max-w-xl mx-auto mb-5 sm:mb-6"
          >
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-amber-200 font-semibold mb-2">
              Counting Down To Forever
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#0e1d2f]/80 backdrop-blur-lg border border-blue-300/40 rounded-2xl p-2.5 sm:p-3.5 text-center shadow-lg"
                >
                  <span className="font-serif-title text-xl sm:text-3xl font-bold text-white block">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-widest text-blue-200 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scripture */}
          <div className="pt-3 border-t border-white/20 max-w-md mx-auto">
            <p className="font-serif-title italic text-xs sm:text-sm text-slate-200 leading-relaxed">
              &ldquo;I have found the one whom my soul loves.&rdquo;
            </p>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-200/90 mt-0.5 font-semibold">
              — Song of Solomon 3:4
            </p>
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-5 text-white/70 hover:text-white transition-colors flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => {
              const el = document.querySelector("#details");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="text-[9px] uppercase tracking-widest">Scroll Down</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
