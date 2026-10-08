"use client";

import React, { useState } from "react";
import { OpeningEnvelope } from "@/components/OpeningEnvelope";
import { MusicPlayer } from "@/components/MusicPlayer";
import { HeroSection } from "@/components/HeroSection";
import { WeddingDetailsSection } from "@/components/WeddingDetailsSection";
import { WeddingTimelineSection } from "@/components/WeddingTimelineSection";
import { DressCodeSection } from "@/components/DressCodeSection";
import { PhotoGallerySection } from "@/components/PhotoGallerySection";
import { RsvpSection } from "@/components/RsvpSection";
import { WishesGuestbookSection } from "@/components/WishesGuestbookSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#fafbfc] text-[#1a2530] relative selection:bg-[#7094b7] selection:text-white">
      {/* 1. Rosie Creative Studio Style Interactive Opening Envelope Cover */}
      <OpeningEnvelope
        isOpen={isEnvelopeOpen}
        onOpen={() => setIsEnvelopeOpen(true)}
      />

      {/* 2. Floating Romantic Music Player */}
      <MusicPlayer />

      {/* 3. Hero Section with Live Countdown & Scroll Cue */}
      <HeroSection />

      {/* 5. Wedding Events & Venues (Ceremony & Reception) */}
      <WeddingDetailsSection />

      {/* 6. Day of Wedding Timeline */}
      <WeddingTimelineSection />

      {/* 7. Dress Code & White & Blue Color Palette */}
      <DressCodeSection />

      {/* 8. Photo Gallery & Lightbox */}
      <PhotoGallerySection />

      {/* 9. Interactive RSVP Form */}
      <RsvpSection />

      {/* 10. Live Wishes & Guestbook Wall */}
      <WishesGuestbookSection />

      {/* 11. Footer with Admin Portal Link */}
      <Footer onReopenEnvelope={() => setIsEnvelopeOpen(false)} />
    </main>
  );
}
