"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Trash2 } from "lucide-react";
import { weddingStore, RsvpEntry } from "@/lib/weddingStore";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setRsvps(weddingStore.getRsvps());
    }
  }, [isOpen]);

  const attendingCount = rsvps.filter((r) => r.status === "attending").length;
  const declinedCount = rsvps.filter((r) => r.status === "declined").length;
  const totalHeadcount = rsvps
    .filter((r) => r.status === "attending")
    .reduce((sum, r) => sum + (r.guestCount || 1), 0);

  const exportToCsv = () => {
    if (rsvps.length === 0) return;

    const headers = [
      "ID",
      "Full Name",
      "Status",
      "Headcount",
      "Companions",
      "Email",
      "Phone",
      "Message",
      "Submitted At",
    ];

    const rows = rsvps.map((r) => [
      `"${r.id}"`,
      `"${r.fullName}"`,
      `"${r.status}"`,
      `"${r.guestCount || 1}"`,
      `"${r.companionNames || ""}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      `"${r.submittedAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aian_Dang_Wedding_RSVPs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      >
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-blue-200 overflow-hidden">
          <div className="p-6 bg-[#0e1d2f] text-white flex items-center justify-between border-b border-blue-900">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                Couple &amp; Coordinator Portal
              </span>
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold">
                Aian &amp; Dang &bull; Quick Guest Manager
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-blue-50/50 border-b border-blue-100">
            <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total RSVPs</p>
              <p className="font-serif-title text-2xl font-bold text-[#1b3b5f]">
                {rsvps.length}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-emerald-600">Confirmed Attending</p>
              <p className="font-serif-title text-2xl font-bold text-emerald-700">
                {attendingCount}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-blue-600">Total Headcount</p>
              <p className="font-serif-title text-2xl font-bold text-blue-800">
                {totalHeadcount} <span className="text-xs font-normal text-slate-400">Seats</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-rose-500">Declined</p>
              <p className="font-serif-title text-2xl font-bold text-rose-600">
                {declinedCount}
              </p>
            </div>
          </div>

          <div className="p-4 sm:px-6 bg-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Showing all recorded submissions from guests:
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={exportToCsv}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export to CSV</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap min-w-[850px]">
                <thead className="bg-slate-50 text-[11px] uppercase font-bold text-[#1b3b5f] border-b border-slate-200">
                  <tr>
                    <th className="p-3 whitespace-nowrap">Guest Name</th>
                    <th className="p-3 whitespace-nowrap">Status</th>
                    <th className="p-3 whitespace-nowrap">Seats</th>
                    <th className="p-3 whitespace-nowrap">Companions</th>
                    <th className="p-3 whitespace-nowrap">Contact</th>
                    <th className="p-3 whitespace-nowrap">Special Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/40">
                      <td className="p-3 font-semibold text-[#1b3b5f] whitespace-nowrap">{r.fullName}</td>
                      <td className="p-3 whitespace-nowrap">
                        {r.status === "attending" ? (
                           <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] whitespace-nowrap inline-block">
                            Attending
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] whitespace-nowrap inline-block">
                            Declined
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-[#1b3b5f] whitespace-nowrap">{r.guestCount || 1}</td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">{r.companionNames || "-"}</td>
                      <td className="p-3 whitespace-nowrap">
                        <p className="whitespace-nowrap">{r.email}</p>
                        <p className="text-slate-400 font-mono text-[10px] whitespace-nowrap">{r.phone}</p>
                      </td>
                      <td className="p-3 max-w-xs whitespace-nowrap">
                        {r.message ? (
                          <p className="text-[11px] text-slate-500 italic whitespace-nowrap">
                            &ldquo;{r.message}&rdquo;
                          </p>
                        ) : (
                          <span className="text-slate-400 whitespace-nowrap">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
