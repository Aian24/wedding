"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Heart, Sparkles } from "lucide-react";
import { weddingStore, EntourageCategory } from "@/lib/weddingStore";

export const EntourageSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [entourage, setEntourage] = useState<EntourageCategory[]>([]);

  useEffect(() => {
    setEntourage(weddingStore.getEntourage());

    const handleUpdate = () => {
      setEntourage(weddingStore.getEntourage());
    };
    window.addEventListener("wedding_entourage_updated", handleUpdate);
    return () => window.removeEventListener("wedding_entourage_updated", handleUpdate);
  }, []);

  if (entourage.length === 0) return null;

  return (
    <section id="entourage" className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-[#fafbfc] relative overflow-hidden">
      {/* Corner Botanical Floral Accents */}
      <div className="absolute top-0 -right-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0">
        <Image
          src="/images/floral-corner.jpg"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 -left-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0 rotate-180">
        <Image
          src="/images/floral-corner.jpg"
          alt=""
          fill
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
              src="/images/floral-divider.jpg"
              alt="Dusty Blue Floral Header"
              fill
              className="object-contain mix-blend-multiply"
            />
          </div>
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <span className="h-px w-8 bg-[#7094b7]" />
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Our Bridal Party</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            The Wedding Entourage
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-light">
            We are eternally blessed to stand beside the wonderful family and friends who have shaped our lives.
          </p>
        </motion.div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {entourage.map((cat, idx) => (
            <button
              key={cat.id || cat.category}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                activeTab === idx
                  ? "bg-[#1b3b5f] text-white shadow-md scale-105 border border-amber-200/50"
                  : "bg-white/80 text-slate-600 hover:bg-blue-50 hover:text-[#1b3b5f] border border-blue-100"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Active Entourage Member Cards */}
        {entourage[activeTab] && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="glass-card rounded-3xl p-6 sm:p-10 border border-blue-100 shadow-xl max-w-4xl mx-auto"
          >
            <div className="text-center mb-6 pb-3 border-b border-blue-100 flex flex-col items-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#7094b7] font-bold">
                Category Showcase
              </span>
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#1b3b5f]">
                {entourage[activeTab].category}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {entourage[activeTab].members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-blue-50/40 to-white border border-blue-100 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-center text-center group"
                >
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#7094b7] font-semibold mb-1 group-hover:text-blue-800 transition-colors">
                    {member.role}
                  </p>
                  <p className="font-serif-title text-sm sm:text-base font-bold text-[#1b3b5f]">
                    {member.name}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
