"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Navigation, ExternalLink, Copy, Check, Church, Utensils } from "lucide-react";
import { weddingData } from "@/data/weddingData";

export const WeddingDetailsSection: React.FC = () => {
  const [copiedCeremony, setCopiedCeremony] = useState(false);
  const [copiedReception, setCopiedReception] = useState(false);

  const copyToClipboard = (text: string, isCeremony: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCeremony) {
      setCopiedCeremony(true);
      setTimeout(() => setCopiedCeremony(false), 2500);
    } else {
      setCopiedReception(true);
      setTimeout(() => setCopiedReception(false), 2500);
    }
  };

  return (
    <section id="details" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafbfc] relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#7094b7]" />
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Where &amp; When</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Ceremony &amp; Reception
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light">
            We cannot wait to celebrate this sacred milestone with our closest family and friends.
          </p>
        </div>

        {/* Venue Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Ceremony Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl overflow-hidden shadow-xl border border-blue-200/80 flex flex-col"
          >
            {/* Image Banner */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <Image
                src={weddingData.ceremony.image}
                alt={weddingData.ceremony.name}
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d2f]/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#1b3b5f]/90 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 border border-amber-200/50">
                  <Church className="w-3.5 h-3.5 text-amber-300" />
                  The Ceremony
                </span>
              </div>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <h3 className="font-serif-title text-xl sm:text-2xl font-bold tracking-wide">
                  {weddingData.ceremony.name}
                </h3>
                <p className="text-xs text-amber-200 font-light">
                  {weddingData.ceremony.subtitle}
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Time info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                    <Clock className="w-4 h-4 text-[#1b3b5f]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-[#7094b7]">
                      Ceremony Schedule
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-[#1b3b5f]">
                      {weddingData.ceremony.time}
                    </p>
                  </div>
                </div>

                {/* Location info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                    <MapPin className="w-4 h-4 text-[#1b3b5f]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase font-bold tracking-wider text-[#7094b7]">
                      Location Address
                    </p>
                    <p className="text-sm sm:text-base font-medium text-slate-800">
                      {weddingData.ceremony.address}, {weddingData.ceremony.city}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-slate-600 leading-relaxed font-light">
                  <span className="font-semibold text-[#1b3b5f]">Reminder: </span>
                  {weddingData.ceremony.notes}
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
                <a
                  href={weddingData.ceremony.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#1b3b5f] hover:bg-[#132c49] text-white text-xs font-semibold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-200" />
                  <span>Google Maps</span>
                </a>

                <a
                  href={weddingData.ceremony.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#7094b7] hover:bg-[#587c9f] text-white text-xs font-semibold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Waze</span>
                </a>

                <button
                  onClick={() =>
                    copyToClipboard(
                      `${weddingData.ceremony.name}, ${weddingData.ceremony.address}, ${weddingData.ceremony.city}`,
                      true
                    )
                  }
                  className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
                  title="Copy address"
                >
                  {copiedCeremony ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Reception Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card rounded-3xl overflow-hidden shadow-xl border border-blue-200/80 flex flex-col"
          >
            {/* Image Banner */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <Image
                src={weddingData.reception.image}
                alt={weddingData.reception.name}
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d2f]/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#1b3b5f]/90 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 border border-amber-200/50">
                  <Utensils className="w-3.5 h-3.5 text-amber-300" />
                  The Reception
                </span>
              </div>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <h3 className="font-serif-title text-xl sm:text-2xl font-bold tracking-wide">
                  {weddingData.reception.name}
                </h3>
                <p className="text-xs text-amber-200 font-light">
                  {weddingData.reception.subtitle}
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Time info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                    <Clock className="w-4 h-4 text-[#1b3b5f]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-[#7094b7]">
                      Reception Schedule
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-[#1b3b5f]">
                      {weddingData.reception.time}
                    </p>
                  </div>
                </div>

                {/* Location info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                    <MapPin className="w-4 h-4 text-[#1b3b5f]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase font-bold tracking-wider text-[#7094b7]">
                      Location Address
                    </p>
                    <p className="text-sm sm:text-base font-medium text-slate-800">
                      {weddingData.reception.address}, {weddingData.reception.city}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-slate-600 leading-relaxed font-light">
                  <span className="font-semibold text-[#1b3b5f]">Highlights: </span>
                  {weddingData.reception.notes}
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
                <a
                  href={weddingData.reception.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#1b3b5f] hover:bg-[#132c49] text-white text-xs font-semibold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-200" />
                  <span>Google Maps</span>
                </a>

                <a
                  href={weddingData.reception.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#7094b7] hover:bg-[#587c9f] text-white text-xs font-semibold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Waze</span>
                </a>

                <button
                  onClick={() =>
                    copyToClipboard(
                      `${weddingData.reception.name}, ${weddingData.reception.address}, ${weddingData.reception.city}`,
                      false
                    )
                  }
                  className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
                  title="Copy address"
                >
                  {copiedReception ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
