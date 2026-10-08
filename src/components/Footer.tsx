"use client";

import React from "react";
import { Heart, Mail, ShieldCheck } from "lucide-react";
import { weddingData } from "@/data/weddingData";

interface FooterProps {
  onReopenEnvelope: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReopenEnvelope }) => {
  return (
    <footer className="bg-[#0e1d2f] text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-blue-900/60 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1b3b5f] to-[#3a628c] text-amber-200 border-2 border-amber-200/50 flex items-center justify-center mx-auto mb-6 shadow-xl">
          <span className="font-serif-title font-bold text-xl tracking-widest">
            A&amp;D
          </span>
        </div>

        <p className="font-script text-3xl sm:text-4xl text-amber-200 mb-2">
          We can&apos;t wait to celebrate with you!
        </p>

        <h3 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-widest text-white uppercase mb-2">
          Aian &amp; Dang
        </h3>

        <p className="text-xs uppercase tracking-[0.3em] text-blue-300 font-semibold mb-6">
          {weddingData.hashtag}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-10">
          <button
            onClick={onReopenEnvelope}
            className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#7094b7]" />
            <span>Invitation Cover</span>
          </button>
          <span>&bull;</span>
          <a href="#hero" className="hover:text-amber-200 transition-colors">
            Back to Top
          </a>
          <span>&bull;</span>
          <a href="#details" className="hover:text-amber-200 transition-colors">
            Venues &amp; Map
          </a>
          <span>&bull;</span>
          <a href="#rsvp" className="hover:text-amber-200 transition-colors text-amber-300 font-bold">
            RSVP
          </a>
          <span>&bull;</span>
          <a href="/admin" className="hover:text-amber-200 transition-colors text-slate-400">
            Admin Portal
          </a>
        </div>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent mx-auto mb-8" />

        <p className="font-serif-title italic text-xs text-slate-400 max-w-lg mx-auto leading-relaxed mb-8">
          &ldquo;Love is patient, love is kind. It does not envy, it does not boast, it is not proud... It always protects, always trusts, always hopes, always perseveres. Love never fails.&rdquo;
          <span className="block not-italic text-[10px] uppercase tracking-widest text-amber-200/80 mt-1">
            — 1 Corinthians 13:4-8
          </span>
        </p>

        <div className="pt-6 border-t border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> for Aian Christopher &amp; Ma. Andrea &bull; 2026
          </p>

          <a
            href="/admin"
            className="hover:text-amber-200 transition-colors flex items-center gap-1 text-slate-400"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Couple / Admin Portal</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
