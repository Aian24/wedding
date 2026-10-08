"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Heart } from "lucide-react";
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
    <section id="entourage" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafbfc] relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#7094b7]" />
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Our Bridal Party</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            The Wedding Entourage
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light">
            We are eternally blessed to stand beside the wonderful family and friends who have shaped our lives.
          </p>
        </motion.div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {entourage.map((cat, idx) => (
            <button
              key={cat.id || cat.category}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 ${
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl p-8 sm:p-12 border border-blue-100 shadow-xl max-w-4xl mx-auto"
          >
            <div className="text-center mb-8 pb-4 border-b border-blue-100">
              <span className="text-xs uppercase tracking-[0.25em] text-[#7094b7] font-bold">
                Category Showcase
              </span>
              <h3 className="font-serif-title text-2xl font-bold text-[#1b3b5f]">
                {entourage[activeTab].category}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {entourage[activeTab].members.map((member) => (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white via-blue-50/40 to-white border border-blue-100 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-center text-center group"
                >
                  <p className="text-[11px] uppercase tracking-widest text-[#7094b7] font-semibold mb-1 group-hover:text-blue-800 transition-colors">
                    {member.role}
                  </p>
                  <p className="font-serif-title text-base sm:text-lg font-bold text-[#1b3b5f]">
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
