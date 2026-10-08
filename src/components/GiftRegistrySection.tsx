"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  CreditCard,
  Copy,
  Check,
  Heart,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { weddingData } from "@/data/weddingData";
import { weddingStore, RegistryItem } from "@/lib/weddingStore";

export const GiftRegistrySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"wishing-well" | "registry">("wishing-well");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [registryItems, setRegistryItems] = useState<RegistryItem[]>([]);
  const [claimingItem, setClaimingItem] = useState<string | null>(null);
  const [guestGifterName, setGuestGifterName] = useState<string>("");

  useEffect(() => {
    setRegistryItems(weddingStore.getRegistry());

    const handleUpdate = () => {
      setRegistryItems(weddingStore.getRegistry());
    };
    window.addEventListener("wedding_registry_updated", handleUpdate);
    return () => window.removeEventListener("wedding_registry_updated", handleUpdate);
  }, []);

  const handleCopyAccount = (accNum: string, index: number) => {
    navigator.clipboard.writeText(accNum.replace(/-/g, ""));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleClaimGift = (itemId: string) => {
    if (!guestGifterName.trim()) return;

    const updated = registryItems.map((item) =>
      item.id === itemId
        ? { ...item, isClaimed: true, claimedBy: guestGifterName.trim() }
        : item
    );

    weddingStore.saveRegistry(updated);
    setRegistryItems(updated);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#7094b7", "#dfc28d", "#ffffff"],
      });
    } catch {
      // ignore
    }

    setClaimingItem(null);
    setGuestGifterName("");
  };

  return (
    <section id="gifts" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbfc] via-[#f1f6fa] to-[#fafbfc] relative">
      <div className="max-w-5xl mx-auto">
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
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Blessings &amp; Gifts</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Gift Guide &amp; Wishing Well
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-light italic max-w-xl mx-auto">
            &ldquo;{weddingData.gifts.wishingWellMessage}&rdquo;
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveTab("wishing-well")}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === "wishing-well"
                ? "bg-[#1b3b5f] text-white shadow-lg border border-amber-200/50"
                : "bg-white text-slate-600 hover:bg-blue-50 border border-blue-100"
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span>Digital Wishing Well</span>
          </button>

          <button
            onClick={() => setActiveTab("registry")}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === "registry"
                ? "bg-[#1b3b5f] text-white shadow-lg border border-amber-200/50"
                : "bg-white text-slate-600 hover:bg-blue-50 border border-blue-100"
            }`}
          >
            <Gift className="w-4 h-4 text-amber-300" />
            <span>Home Gift Registry</span>
          </button>
        </div>

        {/* Tab 1: Digital Wishing Well */}
        {activeTab === "wishing-well" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {weddingData.gifts.bankAccounts.map((account, idx) => (
              <motion.div
                key={account.provider}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1b3b5f] text-[11px] font-bold uppercase tracking-wider border border-blue-100">
                      {account.badge}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[#7094b7] font-semibold">
                      {account.type}
                    </span>
                  </div>

                  <h3 className="font-serif-title text-xl font-bold text-[#1b3b5f] mb-1">
                    {account.provider}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 font-light">
                    Account Name: <span className="font-medium text-slate-700">{account.accountName}</span>
                  </p>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        Account Number
                      </p>
                      <p className="font-mono text-base sm:text-lg font-bold text-[#1b3b5f] tracking-wider">
                        {account.accountNumber}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyAccount(account.accountNumber, idx)}
                      className="px-3.5 py-2 rounded-xl bg-[#1b3b5f] hover:bg-[#132c49] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-200" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tab 2: Physical Gift Registry */}
        {activeTab === "registry" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {registryItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`glass-card rounded-3xl p-6 border shadow-md transition-all flex flex-col justify-between ${
                    item.isClaimed
                      ? "border-emerald-200 bg-emerald-50/30 opacity-80"
                      : "border-blue-100 hover:border-blue-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-widest text-[#7094b7] font-semibold">
                        {item.category}
                      </span>
                      {item.isClaimed ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3" /> Claimed
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                          Available
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif-title text-base font-bold text-[#1b3b5f] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mb-4">
                      Est: {item.priceEstimate}
                    </p>
                  </div>

                  <div>
                    {item.isClaimed ? (
                      <p className="text-xs text-slate-500 italic bg-white/70 p-2.5 rounded-xl border border-slate-100 text-center">
                        Gifted with love by: <span className="font-semibold text-emerald-800">{item.claimedBy}</span>
                      </p>
                    ) : (
                      <button
                        onClick={() => setClaimingItem(item.id)}
                        className="w-full py-2.5 rounded-xl bg-[#1b3b5f] hover:bg-[#132c49] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Heart className="w-3.5 h-3.5 text-amber-200" />
                        <span>Reserve this Gift</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Claim Modal */}
      <AnimatePresence>
        {claimingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-blue-100">
              <h3 className="font-serif-title text-xl font-bold text-[#1b3b5f] mb-2">
                Reserve Wedding Gift
              </h3>
              <p className="text-xs text-slate-600 mb-4 font-light leading-relaxed">
                Thank you so much! Please enter your name so we can mark this item as reserved.
              </p>

              <input
                type="text"
                value={guestGifterName}
                onChange={(e) => setGuestGifterName(e.target.value)}
                placeholder="Your Name (e.g., Uncle Robert & Family)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-sm mb-4"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setClaimingItem(null)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleClaimGift(claimingItem)}
                  className="px-5 py-2.5 rounded-xl bg-[#1b3b5f] hover:bg-[#132c49] text-white text-xs font-semibold uppercase tracking-wider shadow-md"
                >
                  Confirm Reservation
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
