"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Heart, MapPin, Check, ChevronDown } from "lucide-react";
import { weddingData } from "@/data/weddingData";

export const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [calendarAdded, setCalendarAdded] = useState(false);

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

  const handleAddToCalendar = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Aian and Dang Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "SUMMARY:Wedding of Aian & Dang",
      "DESCRIPTION:Holy Matrimony and Wedding Celebration of Aian Christopher & Ma. Andrea (Dang). Dress Code: Shades of Blue & Slate.",
      "LOCATION:St. Mary's Coastal Cathedral & The Sapphire Ballroom, Tagaytay",
      "DTSTART:20261212T070000Z",
      "DTEND:20261212T150000Z",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Aian-and-Dang-Wedding.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "Wedding of Aian & Dang"
    )}&dates=20261212T150000/20261212T230000&details=${encodeURIComponent(
      "Holy Matrimony and Reception of Aian Christopher & Ma. Andrea (Dang). #AianGotHisDangGirl"
    )}&location=${encodeURIComponent("St. Mary's Coastal Cathedral, Tagaytay")}`;

    window.open(googleCalUrl, "_blank");

    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 4000);
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 overflow-hidden">
      {/* Background with subtle zoom */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Aian & Dang Wedding Celebration"
          fill
          priority
          className="object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1d2f]/85 via-[#1b3b5f]/50 to-[#fafbfc]" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center text-white pt-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Monogram Crest */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 backdrop-blur-md border border-amber-200/60 shadow-2xl"
          >
            <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-widest text-amber-200">
              A&amp;D
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-script text-3xl sm:text-4xl lg:text-5xl text-amber-200 mb-2 drop-shadow-md"
          >
            Together with our families
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs sm:text-sm uppercase tracking-[0.3em] text-blue-100 font-semibold mb-3"
          >
            We invite you to celebrate the marriage of
          </motion.p>

          {/* Names */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-bold tracking-wide text-white uppercase drop-shadow-lg mb-2"
          >
            Aian <span className="font-script text-4xl sm:text-6xl lg:text-7xl text-amber-200 lowercase">&amp;</span> Dang
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xs sm:text-sm font-light tracking-[0.2em] uppercase text-slate-200 mb-6"
          >
            Aian Christopher Ramos &amp; Ma. Andrea Santos
          </motion.p>

          {/* Date & Location Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-medium tracking-wider">
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Saturday, December 12, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-medium tracking-wider">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Tagaytay, Philippines</span>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="w-full max-w-xl mx-auto mb-10"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-amber-200 font-semibold mb-3">
              Counting Down To Forever
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#0e1d2f]/80 backdrop-blur-lg border border-blue-300/40 rounded-2xl p-3 sm:p-4 text-center shadow-lg"
                >
                  <span className="font-serif-title text-2xl sm:text-4xl font-bold text-white block">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-200 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#rsvp"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>RSVP Your Attendance</span>
            </a>

            <button
              onClick={handleAddToCalendar}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              {calendarAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Calendar Saved!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 text-amber-200" />
                  <span>Add To Calendar</span>
                </>
              )}
            </button>
          </motion.div>

          {/* Scripture */}
          <div className="mt-12 pt-6 border-t border-white/20 max-w-lg mx-auto">
            <p className="font-serif-title italic text-xs sm:text-sm text-slate-200 leading-relaxed">
              &ldquo;I have found the one whom my soul loves.&rdquo;
            </p>
            <p className="text-[11px] uppercase tracking-widest text-amber-200/90 mt-1 font-semibold">
              — Song of Solomon 3:4
            </p>
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 text-white/60 hover:text-white transition-colors flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => {
              const el = document.querySelector("#details");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll Down</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
