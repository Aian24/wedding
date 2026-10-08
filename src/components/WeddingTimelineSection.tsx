"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Church,
  Camera,
  Wine,
  Utensils,
  Music,
  PartyPopper,
  Clock,
  Heart,
} from "lucide-react";
import { weddingData } from "@/data/weddingData";

export const WeddingTimelineSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-amber-200" };
    switch (iconName) {
      case "users":
        return <Users {...props} />;
      case "church":
        return <Church {...props} />;
      case "camera":
        return <Camera {...props} />;
      case "wine":
        return <Wine {...props} />;
      case "utensils":
        return <Utensils {...props} />;
      case "music":
        return <Music {...props} />;
      case "party-popper":
        return <PartyPopper {...props} />;
      default:
        return <Clock {...props} />;
    }
  };

  return (
    <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbfc] via-[#eef5fb] to-[#fafbfc] relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
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
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Schedule of the Day</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Wedding Day Timeline
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light">
            Here is what to expect as we rejoice and celebrate from afternoon vows until the midnight toast!
          </p>
        </motion.div>

        {/* Timeline List */}
        <div className="relative">
          {/* Vertical Center Line for desktop */}
          <div className="hidden md:block absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-300 via-blue-400 to-amber-300" />

          {/* Left Vertical Line for mobile */}
          <div className="md:hidden absolute top-6 bottom-6 left-6 w-0.5 bg-gradient-to-b from-blue-300 via-blue-400 to-amber-300" />

          <div className="space-y-8 md:space-y-12">
            {weddingData.timeline.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 35, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline content card */}
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-8">
                    <div
                      className={`glass-card p-6 rounded-3xl border border-blue-100/90 shadow-md hover:shadow-xl transition-all duration-300 relative group ${
                        isEven ? "md:text-left" : "md:text-right"
                      }`}
                    >
                      <span className="inline-block px-3 py-1 rounded-full bg-[#1b3b5f] text-white text-xs font-serif-title font-bold tracking-wider mb-2 shadow-sm">
                        {item.time}
                      </span>
                      <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#1b3b5f] mb-1 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Icon Node */}
                  <div className="absolute left-6 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-[#1b3b5f] to-[#366088] border-4 border-white shadow-xl flex items-center justify-center z-10">
                    {getIcon(item.icon)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
