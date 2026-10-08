"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Phone, ExternalLink, Car, Compass, CheckCircle2 } from "lucide-react";
import { weddingData } from "@/data/weddingData";

export const AccommodationsSection: React.FC = () => {
  return (
    <section id="accommodations" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafbfc] relative">
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
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Stay &amp; Travel</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Accommodations &amp; Travel
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light">
            For our cherished out-of-town guests, here are recommended partner resorts and nearby lodging options.
          </p>
        </motion.div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {weddingData.accommodations.map((hotel, idx) => (
            <motion.div
              key={hotel.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-8 border border-blue-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b3b5f] flex items-center justify-center mb-4 border border-blue-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100/70 text-blue-900 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                  {hotel.distance}
                </span>
                <h3 className="font-serif-title text-xl font-bold text-[#1b3b5f] mb-1">
                  {hotel.name}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1 font-light">
                  <MapPin className="w-3.5 h-3.5 text-[#7094b7]" />
                  {hotel.address}
                </p>

                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 mb-4 text-xs text-amber-900 font-medium">
                  {hotel.rateRange}
                </div>

                <p className="text-xs text-slate-600 font-light leading-relaxed mb-6">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 inline mr-1" />
                  {hotel.highlight}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1b3b5f]">
                <a
                  href={`tel:${hotel.phone}`}
                  className="hover:text-blue-700 flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {hotel.phone}
                </a>
                <a
                  href={hotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-700 flex items-center gap-1 text-[#7094b7]"
                >
                  <span>Book</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Travel Tips Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 border border-blue-200/80 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1b3b5f] text-white flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] mb-1">
                Shuttle Transfers
              </h4>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                Complimentary guest shuttles will depart from the official hotel partner lobby at 1:45 PM.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1b3b5f] text-white flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] mb-1">
                Scenic Mountain Air
              </h4>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                Evenings in Tagaytay can get pleasantly cool (20°C / 68°F). A light evening wrap is recommended.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1b3b5f] text-white flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] mb-1">
                Smooth Travel Timing
              </h4>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                Weekend expressway traffic may occur. We suggest allowing an extra 30-45 minutes travel buffer.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
