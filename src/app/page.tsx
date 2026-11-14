"use client";

import React, { useState } from "react";
import { OpeningEnvelope } from "@/components/OpeningEnvelope";
import { MusicPlayer } from "@/components/MusicPlayer";
import { HeroSection } from "@/components/HeroSection";
import { WeddingDetailsSection } from "@/components/WeddingDetailsSection";
import { EntourageSection } from "@/components/EntourageSection";
import { DressCodeSection } from "@/components/DressCodeSection";
import { RsvpSection } from "@/components/RsvpSection";
import { PhotoboothBannerSection } from "@/components/PhotoboothBannerSection";
import { WishesGuestbookSection } from "@/components/WishesGuestbookSection";
import { WeddingTimelineSection } from "@/components/WeddingTimelineSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#fafbfc] text-[#1a2530] relative selection:bg-[#7094b7] selection:text-white">
      {/* 1. Interactive Opening Envelope Cover */}
      <OpeningEnvelope
        isOpen={isEnvelopeOpen}
        onOpen={() => setIsEnvelopeOpen(true)}
      />

      {/* 2. Floating Romantic Music Player */}
      <MusicPlayer />

      {/* 3. Hero Section with Live Countdown & Video Background */}
      <HeroSection />

      {/* 4. Wedding Events & Venues (Ceremony & Reception) */}
      <WeddingDetailsSection />

      {/* 5. Wedding Entourage & Bridal Party Showcase */}
      <EntourageSection />

      {/* 6. Dress Code & Sample Dresses Lookbook */}
      <DressCodeSection />

      {/* 7. Interactive RSVP Form with Accompanied Member Toggles */}
      <RsvpSection />

      {/* 8. Interactive 4-Shot Wedding Photo Booth Souvenir */}
      <PhotoboothBannerSection />

      {/* 9. Live Wishes & Guestbook Wall */}
      <WishesGuestbookSection />

      {/* 10. Day of Wedding Timeline (at last before footer) */}
      <WeddingTimelineSection />

      {/* 11. Footer with Couple Monogram & Admin Portal Link */}
      <Footer onReopenEnvelope={() => setIsEnvelopeOpen(false)} />
    </main>
  );
}
