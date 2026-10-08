"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
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
  Search,
  Check,
  UserPlus,
  Sparkles,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import { weddingStore, RsvpEntry, InvitedParty, PartyMember } from "@/lib/weddingStore";

export const RsvpSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [matchingParties, setMatchingParties] = useState<InvitedParty[]>([]);
  const [selectedParty, setSelectedParty] = useState<InvitedParty | null>(null);
  const [isManualGuest, setIsManualGuest] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Accompanied members with individual Present/Absent toggles
  const [membersList, setMembersList] = useState<{ id: string; name: string; role?: string; isAttending: boolean }[]>([]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RsvpEntry | null>(null);

  // Check existing user RSVP in localStorage
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

  // Live search for matching parties as user types
  useEffect(() => {
    if (isManualGuest || selectedParty) return;

    if (!searchTerm.trim()) {
      setMatchingParties([]);
      return;
    }

    const clean = searchTerm.toLowerCase().trim();
    const allParties = weddingStore.getParties();
    const found = allParties.filter((party) => {
      if (party.primaryGuest.toLowerCase().includes(clean)) return true;
      if (party.partyName.toLowerCase().includes(clean)) return true;
      return party.members.some((m) => m.name.toLowerCase().includes(clean));
    });

    setMatchingParties(found);
  }, [searchTerm, isManualGuest, selectedParty]);

  // Handle party selection
  const handleSelectParty = (party: InvitedParty) => {
    setSelectedParty(party);
    setSearchTerm(party.primaryGuest);
    setFullName(party.primaryGuest);
    setEmail(party.email || "");
    setPhone(party.phone || "");
    setMatchingParties([]);

    // Initialize accompanied members list with default isAttending = true
    setMembersList(
      party.members.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role || "Invited Guest",
        isAttending: m.isAttending !== false,
      }))
    );
  };

  // Toggle individual member Present / Absent
  const handleToggleMember = (memberId: string) => {
    setMembersList((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, isAttending: !m.isAttending } : m))
    );
  };

  // Enable manual entry if not in invited list
  const handleEnableManualEntry = () => {
    setIsManualGuest(true);
    setSelectedParty(null);
    setMatchingParties([]);
    setFullName(searchTerm.trim() || "");
    setMembersList([
      { id: "man-1", name: searchTerm.trim() || "Main Guest", role: "Primary Guest", isAttending: true },
    ]);
  };

  // Add custom companion in manual mode
  const handleAddManualCompanion = () => {
    const nextIdx = membersList.length + 1;
    setMembersList([
      ...membersList,
      {
        id: `man-${Date.now()}`,
        name: `Companion ${nextIdx}`,
        role: "Plus One / Guest",
        isAttending: true,
      },
    ]);
  };

  // Update name of manual companion
  const handleUpdateMemberName = (id: string, newName: string) => {
    setMembersList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name: newName } : m))
    );
  };

  // Computed summary
  const attendingCount = useMemo(() => {
    return membersList.filter((m) => m.isAttending).length;
  }, [membersList]);

  const absentCount = useMemo(() => {
    return membersList.filter((m) => !m.isAttending).length;
  }, [membersList]);

  const overallStatus: "attending" | "declined" = attendingCount > 0 ? "attending" : "declined";

  const companionNamesFormatted = useMemo(() => {
    return membersList
      .filter((m, idx) => idx > 0 && m.isAttending)
      .map((m) => m.name)
      .join(", ");
  }, [membersList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() && membersList.length === 0) return;

    const rsvpPayload = {
      partyId: selectedParty?.id,
      fullName: fullName.trim() || membersList[0]?.name || "Wedding Guest",
      email: email.trim(),
      phone: phone.trim(),
      status: overallStatus,
      guestCount: Math.max(1, attendingCount),
      companionNames: companionNamesFormatted,
      memberBreakdown: membersList.map((m) => ({
        name: m.name,
        role: m.role,
        isAttending: m.isAttending,
      })),
      message: message.trim(),
      tableNumber: selectedParty?.tableNumber || "VIP / Assigned Table",
    };

    // 1. Client Store Update
    const record = weddingStore.addRsvp(rsvpPayload);
    localStorage.setItem("aian_dang_wedding_user_rsvp", JSON.stringify(record));
    setSubmittedRecord(record);
    setIsSubmitted(true);

    // 2. Backend API POST
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rsvpPayload),
      });
    } catch {
      // ignore network errors in offline mode
    }

    // 3. Confetti Animation
    try {
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#7094b7", "#1b3b5f", "#dfc28d", "#ffffff"],
      });
    } catch {
      // ignore
    }
  };

  const handleEditRsvp = () => {
    setIsSubmitted(false);
  };

  return (
    <section id="rsvp" className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbfc] via-[#f1f6fa] to-[#0e1d2f] relative text-slate-900 overflow-hidden">
      {/* Corner Botanical Floral Accents */}
      <div className="absolute top-0 -right-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0">
        <Image
          src="/images/floral-corner.jpg"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-1/4 -left-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0 rotate-180">
        <Image
          src="/images/floral-corner.jpg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
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
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Celebrate With Us</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Wedding RSVP &amp; Attendance
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-light">
            Search your name below to view your invitation and toggle attendance for each accompanied member.
          </p>
        </motion.div>

        {/* Form / Pass */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="rsvp-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-200/90 shadow-2xl space-y-6 bg-white/95 relative"
            >
              {/* Form Top Crest Emblem */}
              <div className="flex justify-center -mt-2 mb-2">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md border-2 border-amber-200/80 bg-white">
                  <Image
                    src="/images/wedding-logo.png"
                    alt="Aian & Dang Monogram"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Step 1: Name Search with Autocomplete */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7] mb-2 flex items-center justify-between">
                  <span>Step 1: Search Your Name / Household Party *</span>
                  {selectedParty && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedParty(null);
                        setSearchTerm("");
                        setMembersList([]);
                        setIsManualGuest(false);
                      }}
                      className="text-[11px] text-blue-600 hover:underline normal-case font-normal"
                    >
                      Change Guest
                    </button>
                  )}
                </label>

                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Type your name (e.g. Roberto Gomez, Christian Ramos, Cruz...)"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (selectedParty) setSelectedParty(null);
                      if (isManualGuest) setFullName(e.target.value);
                    }}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-[#1b3b5f] focus:outline-none text-sm transition-colors bg-slate-50/50"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {matchingParties.length > 0 && !selectedParty && (
                  <div className="mt-2 bg-white rounded-2xl border border-blue-200 shadow-xl overflow-hidden divide-y divide-slate-100 z-30">
                    <div className="p-2.5 bg-blue-50/80 text-[11px] text-[#1b3b5f] font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Matching Invitations Found — Click to Select:</span>
                    </div>
                    {matchingParties.map((party) => (
                      <div
                        key={party.id}
                        onClick={() => handleSelectParty(party)}
                        className="p-3.5 hover:bg-blue-50/60 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-serif-title text-sm font-bold text-[#1b3b5f] group-hover:text-blue-700">
                            {party.partyName}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Primary: <strong className="text-slate-700">{party.primaryGuest}</strong> &bull; {party.members.length} Invited Seat(s)
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold group-hover:bg-[#1b3b5f] group-hover:text-white transition-colors">
                          Select &rarr;
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback option if no matches */}
                {searchTerm.trim().length > 2 && matchingParties.length === 0 && !selectedParty && !isManualGuest && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <span className="text-slate-600">Not listed in the pre-registered list?</span>
                    <button
                      type="button"
                      onClick={handleEnableManualEntry}
                      className="px-3 py-1 rounded-lg bg-[#1b3b5f] text-white text-xs font-semibold hover:bg-blue-900 transition-colors"
                    >
                      Fill Out Manually
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Automatic Accompanied Member List with Present / Absent Toggles */}
              {(selectedParty || isManualGuest) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2 border-t border-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7]">
                        Step 2: Accompanied Members &amp; Attendance Status *
                      </label>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">
                        Toggle each member as <strong className="text-emerald-700">Present (Attending)</strong> or <strong className="text-slate-700">Absent</strong>.
                      </p>
                    </div>

                    {/* Headcount Badge */}
                    <div className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-serif-title font-bold text-[#1b3b5f]">
                      {attendingCount} Present / {absentCount} Absent
                    </div>
                  </div>

                  {/* List of Member Cards */}
                  <div className="space-y-2.5">
                    {membersList.map((member, idx) => (
                      <div
                        key={member.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          member.isAttending
                            ? "bg-emerald-50/40 border-emerald-300/80 shadow-xs"
                            : "bg-slate-50/80 border-slate-200 opacity-80"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              member.isAttending
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-300 text-slate-700"
                            }`}
                          >
                            {idx + 1}
                          </div>

                          <div>
                            {isManualGuest && idx > 0 ? (
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => handleUpdateMemberName(member.id, e.target.value)}
                                placeholder="Companion full name"
                                className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#1b3b5f]"
                              />
                            ) : (
                              <p className="font-serif-title text-sm font-bold text-slate-900">
                                {member.name}
                              </p>
                            )}
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                              {member.role || "Guest"}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Present / Absent Toggle Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMember(member.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              member.isAttending
                                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleMember(member.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              !member.isAttending
                                ? "bg-slate-700 text-white shadow-sm ring-2 ring-slate-400/40"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Companion Button for Manual Mode */}
                  {isManualGuest && (
                    <button
                      type="button"
                      onClick={handleAddManualCompanion}
                      className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1b3b5f] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Add Another Companion</span>
                    </button>
                  )}
                </motion.div>
              )}

              {/* Step 3: Contact & Blessing Note */}
              {(selectedParty || isManualGuest) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2 border-t border-slate-100"
                >
                  <label className="block text-xs uppercase font-bold tracking-widest text-[#7094b7]">
                    Step 3: Contact Details &amp; Message
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="name@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1b3b5f] focus:outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="+63 917 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1b3b5f] focus:outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Warm Wishes &amp; Marriage Blessing for Aian &amp; Dang
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Share a heartfelt blessing or message for our wedding day..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-[#1b3b5f] focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1b3b5f] via-[#2a5078] to-[#1b3b5f] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border border-amber-200/40"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>
                      {overallStatus === "attending"
                        ? `Confirm RSVP (${attendingCount} Attending)`
                        : "Submit RSVP (Regretfully Declined)"}
                    </span>
                  </button>
                </motion.div>
              )}
            </motion.form>
          ) : (
            /* Confirmation Pass Card */
            <motion.div
              key="rsvp-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-2xl relative overflow-hidden"
            >
              <div className="text-center pb-5 border-b border-dashed border-blue-200">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-[#7094b7]">
                  Official Wedding Pass &amp; Confirmation
                </span>
                <h3 className="font-serif-title text-2xl font-bold text-[#1b3b5f] mt-1">
                  Thank You, {submittedRecord?.fullName}!
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  RSVP Pass ID: <span className="font-mono">{submittedRecord?.id}</span>
                </p>
              </div>

              <div className="py-5 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-400 uppercase font-bold text-[9px]">Attendance Status</p>
                    <p className="font-serif-title font-bold text-sm text-[#1b3b5f] mt-0.5">
                      {submittedRecord?.status === "attending"
                        ? `Joyfully Confirmed (${submittedRecord.guestCount} Guest${submittedRecord.guestCount > 1 ? "s" : ""})`
                        : "Regretfully Declined"}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-400 uppercase font-bold text-[9px]">Table Assignment</p>
                    <p className="font-serif-title font-bold text-sm text-[#1b3b5f] mt-0.5">
                      {submittedRecord?.tableNumber || "VIP Table"}
                    </p>
                  </div>
                </div>

                {/* Member Breakdown */}
                {submittedRecord?.memberBreakdown && submittedRecord.memberBreakdown.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-400 uppercase font-bold text-[9px] mb-2">
                      Member Attendance Breakdown
                    </p>
                    <div className="space-y-1.5">
                      {submittedRecord.memberBreakdown.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-slate-800 font-medium">{m.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.isAttending
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {m.isAttending ? "Present" : "Absent"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 uppercase font-bold text-[9px]">Date &amp; Time</p>
                  <p className="font-medium text-slate-800 mt-0.5">
                    Saturday, December 12, 2026 &bull; 3:00 PM Sharp
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={handleEditRsvp}
                  className="text-xs font-semibold text-[#7094b7] hover:text-[#1b3b5f] underline"
                >
                  Edit Response / Change Members
                </button>

                <p className="text-[10px] text-slate-400">
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
