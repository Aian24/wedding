"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  Download,
  Share2,
  Search,
  RefreshCw,
  Sparkles,
  X,
  Maximize2,
  Calendar,
} from "lucide-react";
import { useSiteImages } from "@/hooks/useSiteImages";
import { weddingData } from "@/data/weddingData";
import { swalAlert } from "@/lib/swal";

interface GalleryPhoto {
  id: string;
  guest_name?: string;
  photo_strip_url: string;
  frame_theme?: string;
  filter_applied?: string;
  notes?: string;
  created_at?: string;
}

export default function PhotoboothGalleryPage() {
  const siteImages = useSiteImages();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/photobooth");
      const data = await res.json();
      if (data.success && Array.isArray(data.photos)) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.error("Failed to load photobooth photos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const filteredPhotos = photos.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.guest_name && p.guest_name.toLowerCase().includes(q)) ||
      (p.notes && p.notes.toLowerCase().includes(q))
    );
  });

  const handleDownload = (photo: GalleryPhoto) => {
    const link = document.createElement("a");
    link.href = photo.photo_strip_url;
    link.download = `Aian-Dang-PhotoBooth-${photo.guest_name || "Guest"}-${photo.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    swalAlert.toastSuccess("Downloaded!", "Photo strip saved.");
  };

  const handleShareGallery = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      swalAlert.toastSuccess("Link Copied!", "Gallery URL copied to your clipboard.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1a2530] relative overflow-x-hidden selection:bg-[#7094b7] selection:text-white">
      {/* Decorative Botanical Corner Floral Accents */}
      <div className="absolute top-0 -right-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0">
        <Image
          src={siteImages.floralCorner}
          alt=""
          fill
          unoptimized
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 -left-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0 rotate-180">
        <Image
          src={siteImages.floralCorner}
          alt=""
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-blue-100 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1b3b5f] hover:text-[#7094b7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Wedding Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareGallery}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Gallery</span>
            </button>

            <Link
              href="/photobooth"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1b3b5f] hover:bg-[#2e5782] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-amber-200" />
              <span>Take Photos</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {/* Banner */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="relative w-28 sm:w-36 h-8 sm:h-10 mx-auto mb-1 opacity-80">
            <Image
              src={siteImages.floralDivider}
              alt="Floral Divider"
              fill
              unoptimized
              className="object-contain mix-blend-multiply"
            />
          </div>
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <span className="h-px w-6 bg-[#7094b7]" />
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Cherished Moments</span>
            <span className="h-px w-6 bg-[#7094b7]" />
          </div>
          <h1 className="font-serif-title text-2xl sm:text-4xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Photo Booth Live Gallery
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-light">
            Browse, enjoy, and download keepsake photo strips captured by our lovely wedding guests!
          </p>
        </div>

        {/* Search & Stats Bar */}
        <div className="glass-card rounded-2xl p-3 sm:p-4 border border-blue-100 shadow-sm max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by guest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#1b3b5f]"
            />
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs font-semibold text-slate-500">
              Total Souvenirs: <strong className="text-[#1b3b5f]">{filteredPhotos.length}</strong>
            </span>
            <button
              onClick={fetchPhotos}
              className="p-2 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-[#1b3b5f] transition-colors"
              title="Refresh Gallery"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-blue-200 border-t-[#1b3b5f] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Loading wedding photo strips...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto border border-blue-100 shadow-md">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#7094b7] flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f] mb-1">
              {searchQuery ? "No Matching Photos Found" : "Be the First to Take a Photo!"}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {searchQuery
                ? "Try searching for a different guest name."
                : "Step into our interactive 4-shot photo booth and create your souvenir strip!"}
            </p>
            <Link
              href="/photobooth"
              className="px-6 py-2.5 rounded-full bg-[#1b3b5f] hover:bg-[#2e5782] text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-amber-200" />
              <span>Open Photo Booth</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="glass-card rounded-2xl overflow-hidden border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group bg-white"
              >
                {/* Photo Strip Image Container */}
                <div
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative aspect-[1/3] w-full overflow-hidden bg-slate-50 cursor-pointer"
                >
                  <img
                    src={photo.photo_strip_url}
                    alt={photo.guest_name || "Wedding Photo Strip"}
                    className="w-full h-full object-contain p-2 group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/80 backdrop-blur-xs text-[#1b3b5f] shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="p-3 border-t border-slate-100 bg-[#fafbfc] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-serif-title font-bold text-xs text-[#1b3b5f] truncate">
                      {photo.guest_name || "Cherished Guest"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {photo.created_at
                        ? new Date(photo.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Dec 12"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(photo)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-[#1b3b5f] transition-colors shrink-0 shadow-2xs"
                    title="Download Photo Strip"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <p className="font-serif-title font-bold text-sm text-[#1b3b5f]">
                  {selectedPhoto.guest_name || "Wedding Guest"}
                </p>
                <p className="text-[10px] text-slate-400">
                  Aian &amp; Dang Wedding Photo Booth Keepsake
                </p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="p-4 overflow-y-auto max-h-[70vh] flex justify-center bg-slate-900/5">
              <img
                src={selectedPhoto.photo_strip_url}
                alt={selectedPhoto.guest_name || "Photo Strip"}
                className="h-auto max-h-[65vh] object-contain rounded-xl shadow-lg border border-slate-200"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {selectedPhoto.notes || "Classic Photo Strip"}
              </span>
              <button
                onClick={() => handleDownload(selectedPhoto)}
                className="px-4 py-2 rounded-xl bg-[#1b3b5f] hover:bg-[#2e5782] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-200" />
                <span>Download Photo Strip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
