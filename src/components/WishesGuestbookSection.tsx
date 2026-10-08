"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Send, User } from "lucide-react";
import confetti from "canvas-confetti";

interface Wish {
  id: string;
  name: string;
  relationship: string;
  message: string;
  likes: number;
  date: string;
}

export const WishesGuestbookSection: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aian_dang_wedding_guestbook");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Filter out old default mock wishes if they exist in localStorage
            const filtered = parsed.filter(
              (w) => w.id !== "w-1" && w.id !== "w-2" && w.id !== "w-3"
            );
            setWishes(filtered);
            localStorage.setItem("aian_dang_wedding_guestbook", JSON.stringify(filtered));
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handlePostWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: Wish = {
      id: "w-" + Date.now(),
      name: name.trim(),
      relationship: relationship.trim() || "Cherished Guest",
      message: message.trim(),
      likes: 1,
      date: "Just now",
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    localStorage.setItem("aian_dang_wedding_guestbook", JSON.stringify(updated));

    setName("");
    setRelationship("");
    setMessage("");

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#7094b7", "#dfc28d", "#ffffff"],
      });
    } catch {
      // ignore
    }
  };

  const handleLike = (id: string) => {
    if (likedIds[id]) return;

    const updated = wishes.map((w) =>
      w.id === id ? { ...w, likes: w.likes + 1 } : w
    );
    setWishes(updated);
    setLikedIds({ ...likedIds, [id]: true });
    localStorage.setItem("aian_dang_wedding_guestbook", JSON.stringify(updated));
  };

  return (
    <section id="wishes" className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-[#fafbfc] relative overflow-hidden">
      {/* Corner Botanical Floral Accents */}
      <div className="absolute top-0 -right-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0">
        <Image
          src="/images/floral-corner.jpg"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 -left-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0 rotate-180">
        <Image
          src="/images/floral-corner.jpg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8"
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
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Wishes &amp; Blessings</span>
            <span className="h-px w-8 bg-[#7094b7]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Guestbook Messages
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-light">
            Leave a message of love, advice, or sweet memories for the newlyweds.
          </p>
        </motion.div>

        {/* Form to leave wish */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl mb-14 max-w-2xl mx-auto"
        >
          <form onSubmit={handlePostWish} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-[#7094b7] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1b3b5f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-[#7094b7] mb-1">
                  Relationship / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. College Friend / Cousin"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1b3b5f] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-[#7094b7] mb-1">
                Your Heartfelt Message *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Write your blessing, favorite memory, or well-wishes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs focus:border-[#1b3b5f] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1b3b5f] hover:bg-[#132c49] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5 text-amber-200" />
              <span>Post to Guestbook</span>
            </button>
          </form>
        </motion.div>

        {/* Wishes Wall Grid */}
        {wishes.length === 0 ? (
          <div className="text-center py-10 px-6 rounded-3xl bg-white/80 border border-dashed border-blue-200 max-w-lg mx-auto shadow-xs">
            <MessageSquare className="w-8 h-8 text-[#7094b7] mx-auto mb-2 opacity-70" />
            <p className="font-serif-title font-bold text-sm text-[#1b3b5f]">
              Be the first to leave a blessing!
            </p>
            <p className="text-xs text-slate-500 font-light mt-1">
              Share your love, congratulations, or sweet marriage advice for Aian &amp; Dang using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishes.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="glass-card rounded-3xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1b3b5f] flex items-center justify-center font-bold text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] leading-none">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.relationship}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-light leading-relaxed italic mb-4">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Sent with love
                  </span>
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                      likedIds[item.id]
                        ? "text-rose-600 bg-rose-50"
                        : "text-slate-500 hover:text-rose-500 hover:bg-rose-50/50"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        likedIds[item.id] ? "fill-rose-600" : ""
                      }`}
                    />
                    <span>{item.likes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
