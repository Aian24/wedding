"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Users,
  Heart,
  Send,
  Mail,
  Phone,
  User,
} from "lucide-react";
import confetti from "canvas-confetti";
import { weddingStore, RsvpEntry } from "@/lib/weddingStore";

export const RsvpSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "attending" as "attending" | "declined",
    guestCount: 1,
    companionNames: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RsvpEntry | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aian_dang_wedding_user_rsvp");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSubmittedRecord(parsed);
          setIsSubmitted(true);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    const record = weddingStore.addRsvp({
      ...formData,
    });

    localStorage.setItem("aian_dang_wedding_user_rsvp", JSON.stringify(record));
    setSubmittedRecord(record);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#7094b7", "#1b3b5f", "#dfc28d", "#ffffff"],
      });
    } catch {
      // ignore
    }
  };

  const handleEditRsvp = () => {
    if (submittedRecord) {
      setFormData({
        fullName: submittedRecord.fullName,
        email: submittedRecord.email,
        phone: submittedRecord.phone,
        status: submittedRecord.status,
        guestCount: submittedRecord.guestCount,
        companionNames: submittedRecord.companionNames,
        message: submittedRecord.message,
      });
    }
    setIsSubmitted(false);
  };

  return (
    <section id="rsvp" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbfc] via-[#f1f6fa] to-[#0e1d2f] relative text-slate-900">
      <div className="max-w-3xl mx-auto">
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
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Celebrate With Us</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Wedding RSVP Form
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light">
            Kindly confirm your presence on or before <strong className="text-[#1b3b5f]">November 1, 2026</strong>.
          </p>
        </motion.div>

        {/* Form / Pass */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="rsvp-form"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="glass-card rounded-3xl p-6 sm:p-10 border border-blue-200/90 shadow-2xl space-y-6 bg-white/95"
            >
              {/* Attendance Choice */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7] mb-3">
                  Will you be attending? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "attending" })}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      formData.status === "attending"
                        ? "bg-[#1b3b5f] text-white border-[#1b3b5f] shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-6 h-6 shrink-0 ${
                        formData.status === "attending" ? "text-amber-300" : "text-slate-400"
                      }`}
                    />
                    <div>
                      <p className="font-serif-title font-bold text-sm">Joyfully Accepts</p>
                      <p className={`text-[11px] ${formData.status === "attending" ? "text-blue-100" : "text-slate-500"}`}>
                        Can&apos;t wait to celebrate!
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "declined" })}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      formData.status === "declined"
                        ? "bg-slate-800 text-white border-slate-800 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <XCircle
                      className={`w-6 h-6 shrink-0 ${
                        formData.status === "declined" ? "text-rose-400" : "text-slate-400"
                      }`}
                    />
                    <div>
                      <p className="font-serif-title font-bold text-sm">Regretfully Declines</p>
                      <p className={`text-[11px] ${formData.status === "declined" ? "text-slate-300" : "text-slate-500"}`}>
                        Will celebrate in spirit
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7] mb-2">
                  Full Name (Main Guest) *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Clara De Los Santos"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-[#1b3b5f] focus:outline-none text-sm transition-colors bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7] mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-[#1b3b5f] focus:outline-none text-sm transition-colors bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7] mb-2">
                    Mobile / Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+63 917 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-[#1b3b5f] focus:outline-none text-sm transition-colors bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Attending Specific Fields */}
              {formData.status === "attending" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7] mb-2">
                      Total Guests
                    </label>
                    <select
                      value={formData.guestCount}
                      onChange={(e) =>
                        setFormData({ ...formData, guestCount: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#1b3b5f] focus:outline-none text-sm transition-colors bg-slate-50/50"
                    >
                      <option value={1}>1 Seat (Just Me)</option>
                      <option value={2}>2 Seats (+1 Companion)</option>
                      <option value={3}>3 Seats (Family/Group)</option>
                      <option value={4}>4 Seats (Family/Group)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7] mb-2">
                      Companion / Plus-One Full Name(s)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Juan De Los Santos"
                      value={formData.companionNames}
                      onChange={(e) =>
                        setFormData({ ...formData, companionNames: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#1b3b5f] focus:outline-none text-sm transition-colors bg-slate-50/50"
                    />
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7] mb-2">
                  Message / Warm Wishes for Aian &amp; Dang
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a sweet note or blessing for our marriage..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:border-[#1b3b5f] focus:outline-none text-sm transition-colors bg-slate-50/50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1b3b5f] via-[#2a5078] to-[#1b3b5f] text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border border-amber-200/40"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Submit RSVP Confirmation</span>
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="rsvp-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-200/80 shadow-2xl relative overflow-hidden"
            >
              <div className="text-center pb-6 border-b border-dashed border-blue-200">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#7094b7]">
                  Official Wedding Pass &amp; Confirmation
                </span>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1b3b5f] mt-1">
                  Thank You, {submittedRecord?.fullName}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  RSVP Record ID: <span className="font-mono">{submittedRecord?.id}</span>
                </p>
              </div>

              <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 uppercase font-bold text-[10px]">Attendance Status</p>
                  <p className="font-serif-title font-bold text-sm text-[#1b3b5f] mt-0.5">
                    {submittedRecord?.status === "attending"
                      ? "Joyfully Attending (Confirmed)"
                      : "Regretfully Declined"}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 uppercase font-bold text-[10px]">Reserved Seats</p>
                  <p className="font-serif-title font-bold text-sm text-[#1b3b5f] mt-0.5">
                    {submittedRecord?.guestCount} Guest(s)
                  </p>
                </div>

                {submittedRecord?.companionNames && (
                  <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Companions</p>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {submittedRecord.companionNames}
                    </p>
                  </div>
                )}

                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 uppercase font-bold text-[10px]">Date &amp; Ceremony</p>
                  <p className="font-medium text-slate-800 mt-0.5">Saturday, December 12, 2026 &bull; 3:00 PM</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={handleEditRsvp}
                  className="text-xs font-semibold text-[#7094b7] hover:text-[#1b3b5f] underline"
                >
                  Edit RSVP Response
                </button>

                <p className="text-[11px] text-slate-400">
                  Submitted on {submittedRecord?.submittedAt}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
