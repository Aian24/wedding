"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { weddingData } from "@/data/weddingData";

export const DressCodeSection: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <section id="dress-code" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbfc] via-[#f0f6fc] to-[#fafbfc] relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#7094b7]" />
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Palette &amp; Attire</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Wedding Color Palette
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light">
            {weddingData.theme.description}
          </p>
        </motion.div>

        {/* Color Palette Swatches */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 sm:p-10 border border-blue-100 shadow-xl"
        >
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#7094b7] font-bold">
              Official Wedding Swatches
            </span>
            <h3 className="font-serif-title text-2xl font-bold text-[#1b3b5f]">
              {weddingData.theme.name}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {weddingData.theme.colors.map((color) => (
              <div
                key={color.name}
                onClick={() => handleCopyHex(color.hex)}
                className="cursor-pointer group flex flex-col items-center text-center p-3 rounded-2xl hover:bg-white/80 transition-all"
              >
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md border-4 border-white mb-3 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 relative flex items-center justify-center"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full inset-0 absolute flex items-center justify-center text-white text-xs font-medium">
                    {copiedHex === color.hex ? (
                      <Check className="w-5 h-5 text-emerald-300" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <p className="font-serif-title text-sm font-bold text-[#1b3b5f]">
                  {color.name}
                </p>
                <p className="text-[11px] font-mono font-medium text-slate-400 uppercase">
                  {color.hex}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-light leading-tight">
                  {color.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
