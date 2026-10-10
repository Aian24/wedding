"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Calendar, Compass } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { weddingStore, CoupleInfo, getInitialCoupleInfo } from "@/lib/weddingStore";

export const LoveStorySection: React.FC = () => {
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(getInitialCoupleInfo());

  useEffect(() => {
    setCoupleInfo(weddingStore.getCoupleInfo());
    const handleCoupleUpdate = () => {
      setCoupleInfo(weddingStore.getCoupleInfo());
    };
    window.addEventListener("wedding_couple_updated", handleCoupleUpdate);
    return () => window.removeEventListener("wedding_couple_updated", handleCoupleUpdate);
  }, []);

  return (
    <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbfc] via-[#f1f6fa] to-[#fafbfc] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#7094b7]" />
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Our Journey</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            How Two Hearts Became One
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Every love story is beautiful, but ours is our favorite fairy tale written in God&apos;s perfect timing.
          </p>
        </motion.div>

        {/* Bride & Groom Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-8 text-center relative border border-blue-200/80 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#1b3b5f] text-amber-200 flex items-center justify-center mx-auto mb-4 font-serif-title font-bold text-lg shadow-md border border-amber-200/50">
              {coupleInfo.groomNickname.charAt(0)}
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7094b7] font-semibold mb-1">
              The Groom
            </p>
            <h3 className="font-serif-title text-2xl font-bold text-[#1b3b5f] mb-1">
              {coupleInfo.groomName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Son of {coupleInfo.groomParents}
            </p>
            <p className="text-sm text-slate-600 font-light italic leading-relaxed">
              &ldquo;{weddingData.groom.bio}&rdquo;
            </p>
          </motion.div>

          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card rounded-3xl p-8 text-center relative border border-blue-200/80 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#7094b7] text-white flex items-center justify-center mx-auto mb-4 font-serif-title font-bold text-lg shadow-md border border-white/60">
              {coupleInfo.brideNickname.charAt(0)}
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7094b7] font-semibold mb-1">
              The Bride
            </p>
            <h3 className="font-serif-title text-2xl font-bold text-[#1b3b5f] mb-1">
              {coupleInfo.brideName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Daughter of {coupleInfo.brideParents}
            </p>
            <p className="text-sm text-slate-600 font-light italic leading-relaxed">
              &ldquo;{weddingData.bride.bio}&rdquo;
            </p>
          </motion.div>
        </div>

        {/* Story Visual & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Story Photo */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]"
            >
              <Image
                src="/images/story.jpg"
                alt="Aian & Dang Love Story"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d2f]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                <p className="font-script text-2xl text-amber-200">She said YES!</p>
                <p className="font-serif-title text-sm tracking-wider uppercase">
                  Sunset Bluffs &bull; 2024
                </p>
              </div>
            </motion.div>

            {/* Floating Romantic Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 rounded-2xl shadow-xl border border-blue-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Together
                </p>
                <p className="font-serif-title text-sm font-bold text-[#1b3b5f]">
                  8 Golden Years
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            {weddingData.loveStory.map((milestone, idx) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 relative border border-blue-100 hover:border-blue-300 transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#1b3b5f] text-white text-xs font-serif-title font-bold tracking-wider">
                    {milestone.year}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#7094b7] font-semibold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    {milestone.tag}
                  </span>
                </div>
                <h3 className="font-serif-title text-lg font-bold text-[#1b3b5f] mb-2 group-hover:text-blue-700 transition-colors">
                  {milestone.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  {milestone.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
