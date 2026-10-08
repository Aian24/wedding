"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { weddingData } from "@/data/weddingData";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbfc] via-[#eef5fb] to-[#fafbfc] relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#7094b7]" />
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Questions &amp; Answers</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light">
            Everything you need to know to ensure a seamless and joyful wedding celebration.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {weddingData.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-card rounded-2xl border border-blue-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1b3b5f] font-bold text-xs flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#1b3b5f]">
                      {faq.question}
                    </h3>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-[#7094b7] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-blue-900" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 font-light leading-relaxed border-t border-slate-100"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Still have questions note */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b3b5f] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif-title font-bold text-sm text-[#1b3b5f]">
                Still have unanswered questions?
              </p>
              <p className="text-xs text-slate-500 font-light">
                Feel free to message our wedding coordinator directly.
              </p>
            </div>
          </div>

          <a
            href="https://m.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#1b3b5f] hover:bg-[#132c49] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all whitespace-nowrap"
          >
            Contact Coordinator
          </a>
        </div>
      </div>
    </section>
  );
};
