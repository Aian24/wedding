"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Mail, UserCheck, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { weddingStore, CoupleInfo, getInitialCoupleInfo } from "@/lib/weddingStore";
import { useSiteImages } from "@/hooks/useSiteImages";

interface NavbarProps {
  onReopenEnvelope: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReopenEnvelope }) => {
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(getInitialCoupleInfo());
  const siteImages = useSiteImages();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCoupleInfo(weddingStore.getCoupleInfo());
    const handleCoupleUpdate = () => {
      setCoupleInfo(weddingStore.getCoupleInfo());
    };
    window.addEventListener("wedding_couple_updated", handleCoupleUpdate);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wedding_couple_updated", handleCoupleUpdate);
    };
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Venues", href: "#details" },
    { label: "Timeline", href: "#timeline" },
    { label: "Dress Code", href: "#dress-code" },
    { label: "Gallery", href: "#gallery" },
    { label: "Wishes", href: "#wishes" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-blue-100"
          : "bg-gradient-to-b from-[#0e1d2f]/90 via-[#0e1d2f]/60 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Monogram Brand - Single line, no wrapping */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0 whitespace-nowrap"
        >
          <div
            className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-serif-title font-bold text-xs tracking-wider shadow-md transition-all duration-300 border relative ${
              scrolled
                ? "bg-[#1b3b5f] text-white border-blue-200"
                : "bg-white/20 backdrop-blur-md text-amber-200 border-amber-200/60 group-hover:bg-white/30"
            }`}
          >
            {siteImages.logo ? (
              <img
                src={siteImages.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{coupleInfo.groomNickname.charAt(0)}&amp;{coupleInfo.brideNickname.charAt(0)}</span>
            )}
          </div>
          <span
            className={`font-serif-title text-sm sm:text-base font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${
              scrolled ? "text-[#1b3b5f]" : "text-white drop-shadow-sm"
            }`}
          >
            {coupleInfo.groomNickname} &amp; {coupleInfo.brideNickname}
          </span>
        </a>

        {/* Desktop Navigation Links - No text wrap, clean horizontal flex */}
        <nav className="hidden xl:flex items-center space-x-6 text-[12px] xl:text-[13px] font-semibold tracking-wider uppercase whitespace-nowrap">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`transition-all duration-200 hover:scale-105 whitespace-nowrap flex-shrink-0 ${
                scrolled
                  ? "text-slate-600 hover:text-[#1b3b5f]"
                  : "text-slate-200 hover:text-amber-200 drop-shadow-sm"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions - No text wrap */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
          {/* Re-open Envelope Button */}
          <button
            id="reopen-envelope-nav-btn"
            onClick={onReopenEnvelope}
            title="View Invitation Envelope"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-sm whitespace-nowrap ${
              scrolled
                ? "bg-blue-50 text-[#1b3b5f] hover:bg-blue-100 border border-blue-200"
                : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/40"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-amber-300" />
            <span>Envelope</span>
          </button>

          {/* RSVP Button */}
          <a
            href="#rsvp"
            onClick={(e) => handleNavClick(e, "#rsvp")}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center gap-1.5 border border-amber-200 whitespace-nowrap shrink-0"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-950" />
            <span>RSVP</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`xl:hidden p-2 rounded-xl transition-colors ${
              scrolled
                ? "text-slate-700 hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white/98 backdrop-blur-2xl border-b border-blue-100 shadow-2xl px-6 py-6"
          >
            <div className="grid grid-cols-2 gap-2.5 text-center mb-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="py-2.5 px-3 rounded-xl bg-blue-50/60 hover:bg-blue-100 text-[#1b3b5f] text-xs font-bold tracking-wide uppercase transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReopenEnvelope();
                }}
                className="w-full py-2.5 rounded-xl bg-blue-50 text-[#1b3b5f] text-xs font-bold uppercase flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>View Invitation Envelope Cover</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
