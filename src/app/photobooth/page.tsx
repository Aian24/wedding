"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  RefreshCw,
  Download,
  Printer,
  Sparkles,
  ArrowLeft,
  Check,
  Maximize2,
  Share2,
  FlipHorizontal,
  SwitchCamera,
  Sliders,
  Images,
  Heart,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSiteImages } from "@/hooks/useSiteImages";
import { weddingData } from "@/data/weddingData";
import { swalAlert } from "@/lib/swal";
import { playPhotoboothBeep, playPhotoboothShutter } from "@/lib/soundSynthesizer";

type PhotoFilter = "natural" | "bw" | "warm" | "vintage";
type FrameTheme = "classic-white" | "dusty-blue" | "slate-blue" | "midnight-navy" | "soft-cream";
type StripLayout = "strip" | "grid";

interface FrameConfig {
  id: FrameTheme;
  name: string;
  bgHex: string;
  textColor: string;
  subColor: string;
  borderHex: string;
}

const FRAME_CONFIGS: Record<FrameTheme, FrameConfig> = {
  "classic-white": {
    id: "classic-white",
    name: "Classic White",
    bgHex: "#ffffff",
    textColor: "#1b3b5f",
    subColor: "#7094b7",
    borderHex: "#e2e8f0",
  },
  "dusty-blue": {
    id: "dusty-blue",
    name: "Dusty Blue",
    bgHex: "#7b9ebd",
    textColor: "#ffffff",
    subColor: "#f0f6fc",
    borderHex: "#5a82a5",
  },
  "slate-blue": {
    id: "slate-blue",
    name: "Slate Blue",
    bgHex: "#4c6b8b",
    textColor: "#ffffff",
    subColor: "#d6e5f3",
    borderHex: "#35516e",
  },
  "midnight-navy": {
    id: "midnight-navy",
    name: "Midnight Navy",
    bgHex: "#101f3c",
    textColor: "#dfc28d",
    subColor: "#ffffff",
    borderHex: "#223b6b",
  },
  "soft-cream": {
    id: "soft-cream",
    name: "Warm Champagne",
    bgHex: "#fbf8f2",
    textColor: "#1b3b5f",
    subColor: "#a37f48",
    borderHex: "#ecdcc4",
  },
};

export default function PhotoboothPage() {
  const siteImages = useSiteImages();

  // Camera & Stream State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Booth Sequence State
  const [shots, setShots] = useState<string[]>([]);
  const [isCapturingSequence, setIsCapturingSequence] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [currentShotStep, setCurrentShotStep] = useState<number>(0);

  // Studio Customization State
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [layout, setLayout] = useState<StripLayout>("strip");
  const [frameTheme, setFrameTheme] = useState<FrameTheme>("dusty-blue");
  const [filter, setFilter] = useState<PhotoFilter>("natural");
  const [guestName, setGuestName] = useState<string>("");
  const [finalStripUrl, setFinalStripUrl] = useState<string | null>(null);
  const [isGeneratingStrip, setIsGeneratingStrip] = useState<boolean>(false);
  const [isSavedToCloud, setIsSavedToCloud] = useState<boolean>(false);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setHasCameraPermission(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setHasCameraPermission(false);
      setCameraError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera permission was denied. Please allow camera access in your browser settings to use the photo booth."
          : "Unable to access your camera device. Please verify your camera is connected and not in use by another app."
      );
    }
  }, [facingMode]);

  // Clean up camera on unmount
  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  // Toggle Camera (Front / Rear)
  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Capture Single Frame from Video Element
  const captureVideoFrame = (): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    if (isMirrored && facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.95);
  };

  // Trigger Automatic 4-Shot Sequence
  const startPhotoSequence = async () => {
    if (isCapturingSequence) return;
    setShots([]);
    setIsCapturingSequence(true);
    setIsCustomizing(false);
    setFinalStripUrl(null);
    setIsSavedToCloud(false);

    const captured: string[] = [];

    for (let shotIndex = 1; shotIndex <= 4; shotIndex++) {
      setCurrentShotStep(shotIndex);

      // 3-second countdown
      for (let count = 3; count >= 1; count--) {
        setCountdown(count);
        if (!isSoundMuted) playPhotoboothBeep(false);
        await new Promise((r) => setTimeout(r, 900));
      }

      setCountdown(0);
      if (!isSoundMuted) {
        playPhotoboothBeep(true);
        playPhotoboothShutter();
      }

      // Flash animation
      setIsFlashing(true);
      const frame = captureVideoFrame();
      if (frame) captured.push(frame);
      setShots([...captured]);

      await new Promise((r) => setTimeout(r, 200));
      setIsFlashing(false);
      setCountdown(null);

      // Brief interval to prepare for next pose (except after 4th shot)
      if (shotIndex < 4) {
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    setIsCapturingSequence(false);
    setCurrentShotStep(0);
    setIsCustomizing(true);
  };

  // Client-side Canvas Photo Strip Renderer
  const renderPhotoStrip = useCallback(async () => {
    if (shots.length < 4) return;
    setIsGeneratingStrip(true);

    try {
      const frameConfig = FRAME_CONFIGS[frameTheme];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Filter settings helper
      const getFilterCSS = (f: PhotoFilter) => {
        if (f === "bw") return "grayscale(100%) contrast(115%)";
        if (f === "warm") return "sepia(25%) saturate(125%) brightness(105%)";
        if (f === "vintage") return "sepia(45%) contrast(95%) brightness(98%)";
        return "none";
      };

      // Load shots into Image elements
      const loadedImages = await Promise.all(
        shots.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new window.Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.src = src;
            })
        )
      );

      if (layout === "strip") {
        // Classic 4-Shot Vertical Strip (1200 x 3600 px - 1:3 ratio)
        canvas.width = 1200;
        canvas.height = 3600;

        // Background
        ctx.fillStyle = frameConfig.bgHex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Frame Border Margin
        const marginX = 80;
        const photoWidth = canvas.width - marginX * 2;
        const photoHeight = Math.round(photoWidth * (3 / 4)); // 4:3 photo aspect ratio
        const photoGap = 50;
        let startY = 120;

        // Top Subtle Wedding Monogram Header
        ctx.save();
        ctx.fillStyle = frameConfig.textColor;
        ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.letterSpacing = "6px";
        ctx.fillText("AIAN & DANG", canvas.width / 2, 75);
        ctx.restore();

        // Draw 4 Photos
        for (let i = 0; i < loadedImages.length; i++) {
          const img = loadedImages[i];
          const y = startY + i * (photoHeight + photoGap);

          // Draw Photo with Filter
          ctx.save();
          ctx.filter = getFilterCSS(filter);

          // Crop and Center Draw (maintain aspect ratio without stretch)
          const imgAspect = img.width / img.height;
          const targetAspect = photoWidth / photoHeight;
          let sx = 0,
            sy = 0,
            sw = img.width,
            sh = img.height;

          if (imgAspect > targetAspect) {
            sw = img.height * targetAspect;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / targetAspect;
            sy = (img.height - sh) / 2;
          }

          ctx.drawImage(img, sx, sy, sw, sh, marginX, y, photoWidth, photoHeight);
          ctx.restore();

          // Subtle photo border
          ctx.strokeStyle = frameConfig.borderHex;
          ctx.lineWidth = 4;
          ctx.strokeRect(marginX, y, photoWidth, photoHeight);
        }

        // Branding Footer Section
        const footerY = startY + 4 * (photoHeight + photoGap) + 40;

        ctx.save();
        ctx.textAlign = "center";

        // Couple Names
        ctx.fillStyle = frameConfig.textColor;
        ctx.font = "bold 64px 'Playfair Display', Georgia, serif";
        ctx.fillText("Aian & Dang", canvas.width / 2, footerY + 60);

        // Subtitle / Date / Venue
        ctx.fillStyle = frameConfig.subColor;
        ctx.font = "500 28px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("DECEMBER 12, 2026 • TAGAYTAY", canvas.width / 2, footerY + 115);

        // Hashtag
        ctx.fillStyle = frameConfig.textColor;
        ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(weddingData.hashtag || "#AianGotHisDangGirl", canvas.width / 2, footerY + 160);

        // Guest Note if provided
        if (guestName.trim()) {
          ctx.fillStyle = frameConfig.subColor;
          ctx.font = "italic 28px 'Playfair Display', Georgia, serif";
          ctx.fillText(`“${guestName.trim()}”`, canvas.width / 2, footerY + 220);
        }

        ctx.restore();
      } else {
        // 2x2 Square Grid Postcard Layout (2400 x 3200 px - 3:4 ratio)
        canvas.width = 2400;
        canvas.height = 3200;

        ctx.fillStyle = frameConfig.bgHex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const padX = 100;
        const padY = 120;
        const gridGap = 60;
        const photoWidth = (canvas.width - padX * 2 - gridGap) / 2;
        const photoHeight = Math.round(photoWidth * (3 / 4));

        // Header
        ctx.save();
        ctx.fillStyle = frameConfig.textColor;
        ctx.font = "bold 44px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("OUR WEDDING PHOTO BOOTH", canvas.width / 2, 75);
        ctx.restore();

        // Draw 2x2 Photos
        for (let i = 0; i < loadedImages.length; i++) {
          const img = loadedImages[i];
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = padX + col * (photoWidth + gridGap);
          const y = padY + row * (photoHeight + gridGap);

          ctx.save();
          ctx.filter = getFilterCSS(filter);

          const imgAspect = img.width / img.height;
          const targetAspect = photoWidth / photoHeight;
          let sx = 0,
            sy = 0,
            sw = img.width,
            sh = img.height;

          if (imgAspect > targetAspect) {
            sw = img.height * targetAspect;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / targetAspect;
            sy = (img.height - sh) / 2;
          }

          ctx.drawImage(img, sx, sy, sw, sh, x, y, photoWidth, photoHeight);
          ctx.restore();

          ctx.strokeStyle = frameConfig.borderHex;
          ctx.lineWidth = 6;
          ctx.strokeRect(x, y, photoWidth, photoHeight);
        }

        // Postcard Footer
        const footerY = padY + 2 * photoHeight + gridGap + 80;
        ctx.save();
        ctx.textAlign = "center";

        ctx.fillStyle = frameConfig.textColor;
        ctx.font = "bold 80px 'Playfair Display', Georgia, serif";
        ctx.fillText("Aian & Dang", canvas.width / 2, footerY + 80);

        ctx.fillStyle = frameConfig.subColor;
        ctx.font = "500 36px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("SATURDAY, DECEMBER 12, 2026 • TAGAYTAY, PHILIPPINES", canvas.width / 2, footerY + 145);

        ctx.fillStyle = frameConfig.textColor;
        ctx.font = "bold 34px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(weddingData.hashtag || "#AianGotHisDangGirl", canvas.width / 2, footerY + 205);

        if (guestName.trim()) {
          ctx.fillStyle = frameConfig.subColor;
          ctx.font = "italic 36px 'Playfair Display', Georgia, serif";
          ctx.fillText(`“${guestName.trim()}”`, canvas.width / 2, footerY + 275);
        }

        ctx.restore();
      }

      const dataUrl = canvas.toDataURL("image/png");
      setFinalStripUrl(dataUrl);

      // Auto-save to cloud & local storage in the background
      if (!isSavedToCloud) {
        fetch("/api/photobooth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photoStripData: dataUrl,
            guestName: guestName || "Wedding Guest",
            individualShots: shots,
            frameTheme,
            filterApplied: filter,
            notes: `${layout} layout`,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setIsSavedToCloud(true);
            }
          })
          .catch((err) => console.log("Photobooth background sync:", err));
      }
    } catch (err) {
      console.error("Failed to render photo strip:", err);
    } finally {
      setIsGeneratingStrip(false);
    }
  }, [shots, layout, frameTheme, filter, guestName, isSavedToCloud]);

  // Re-render when customization options change
  useEffect(() => {
    if (shots.length === 4 && isCustomizing) {
      renderPhotoStrip();
    }
  }, [shots, isCustomizing, layout, frameTheme, filter, guestName, renderPhotoStrip]);

  // Download High-Res Strip PNG
  const handleDownload = () => {
    if (!finalStripUrl) return;
    const link = document.createElement("a");
    link.href = finalStripUrl;
    link.download = `Aian-Dang-Wedding-PhotoBooth-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    swalAlert.toastSuccess("Downloaded!", "Your photo booth souvenir was saved to your device.");
  };

  // Browser Print Dialog
  const handlePrint = () => {
    window.print();
  };

  // Retake All Shots
  const handleRetake = () => {
    setShots([]);
    setIsCustomizing(false);
    setFinalStripUrl(null);
    setIsSavedToCloud(false);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1a2530] relative overflow-x-hidden selection:bg-[#7094b7] selection:text-white">
      {/* Screen Flash Overlay */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Decorative Botanical Corner Floral Accents */}
      <div className="absolute top-0 -right-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0 print:hidden">
        <Image
          src={siteImages.floralCorner}
          alt=""
          fill
          unoptimized
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 -left-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 mix-blend-multiply z-0 rotate-180 print:hidden">
        <Image
          src={siteImages.floralCorner}
          alt=""
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-blue-100 shadow-2xs print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1b3b5f] hover:text-[#7094b7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Invitation</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/photobooth/gallery"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#1b3b5f] hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition-all cursor-pointer"
            >
              <Images className="w-3.5 h-3.5 text-[#7094b7]" />
              <span>Live Gallery</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              title={isSoundMuted ? "Unmute Shutter Sound" : "Mute Shutter Sound"}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        {/* Title & Introduction */}
        <div className="text-center max-w-xl mx-auto mb-8 print:hidden">
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
            <span className="font-script text-2xl sm:text-3xl text-[#7094b7]">Capture the Love</span>
            <span className="h-px w-6 bg-[#7094b7]" />
          </div>
          <h1 className="font-serif-title text-2xl sm:text-4xl font-bold tracking-wide text-[#1b3b5f] uppercase">
            Wedding Photo Booth
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-light">
            Pose for 4 fun shots, pick your favorite wedding frame &amp; filter, and take home your keepsake photo strip!
          </p>
        </div>

        {/* SECTION A: CAMERA VIEWFINDER & LIVE CAPTURE MODE */}
        {!isCustomizing && (
          <div className="max-w-2xl mx-auto">
            {cameraError ? (
              <div className="glass-card rounded-3xl p-8 text-center border border-rose-200 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-serif-title text-xl font-bold text-slate-800 mb-2">Camera Access Required</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-6 py-2.5 rounded-2xl bg-[#1b3b5f] text-white text-xs font-bold shadow-md hover:bg-[#2e5782] transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-4 sm:p-6 border border-blue-100 shadow-xl relative">
                {/* Viewfinder Frame */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner border border-slate-700/60">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className={`w-full h-full object-cover ${
                      isMirrored && facingMode === "user" ? "scale-x-[-1]" : ""
                    }`}
                  />

                  {/* Countdown Overlay */}
                  <AnimatePresence>
                    {countdown !== null && (
                      <motion.div
                        key={countdown}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/25 backdrop-blur-[2px]"
                      >
                        <span className="font-serif-title font-extrabold text-7xl sm:text-9xl text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
                          {countdown === 0 ? "✨ SMILE! ✨" : countdown}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shot Sequence Progress Badge */}
                  {isCapturingSequence && currentShotStep > 0 && (
                    <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-[#1b3b5f]/85 backdrop-blur-md text-white text-xs font-bold border border-amber-200/50 shadow-md flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>Shot {currentShotStep} of 4</span>
                    </div>
                  )}

                  {/* Viewfinder Grid Guide */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>

                  {/* Camera Controls Bar */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMirrored(!isMirrored)}
                      className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md ${
                        isMirrored ? "bg-[#1b3b5f]/80" : "bg-black/50 hover:bg-black/70"
                      }`}
                      title={isMirrored ? "Mirror Mode On" : "Mirror Mode Off"}
                    >
                      <FlipHorizontal className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={toggleCamera}
                      className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md"
                      title="Switch Camera Front/Back"
                    >
                      <SwitchCamera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4 Shots Progress Tray */}
                <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3">
                  {[0, 1, 2, 3].map((idx) => {
                    const shot = shots[idx];
                    return (
                      <div
                        key={idx}
                        className={`aspect-[4/3] rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all ${
                          shot
                            ? "border-blue-400 bg-black shadow-sm"
                            : currentShotStep === idx + 1
                            ? "border-[#1b3b5f] bg-blue-50/70 border-dashed animate-pulse"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        {shot ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={shot}
                              alt={`Shot ${idx + 1}`}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] text-white font-bold">
                              #{idx + 1}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400">Shot {idx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Main Shutter Trigger Button */}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    disabled={isCapturingSequence || !hasCameraPermission}
                    onClick={startPhotoSequence}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#1b3b5f] via-[#244b77] to-[#1b3b5f] hover:opacity-95 text-white font-serif-title font-bold text-sm tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2.5"
                  >
                    <Camera className="w-5 h-5 text-amber-200" />
                    <span>
                      {isCapturingSequence
                        ? `Capturing Pose ${currentShotStep} of 4...`
                        : "Start 4-Shot Photo Booth"}
                    </span>
                  </button>
                  <p className="mt-2 text-[11px] text-slate-400 font-light">
                    Auto-captures 4 shots with a 3-second countdown between poses.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION B: STUDIO CUSTOMIZATION & EXPORT SCREEN */}
        {isCustomizing && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Photo Strip Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                id="printable-strip"
                className="glass-card rounded-3xl p-4 sm:p-5 border border-blue-100 shadow-2xl bg-white max-w-sm w-full flex flex-col items-center"
              >
                {finalStripUrl ? (
                  <div className="relative w-full shadow-md rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={finalStripUrl}
                      alt="Aian & Dang Photo Strip"
                      className="w-full h-auto block"
                    />
                  </div>
                ) : (
                  <div className="aspect-[1/3] w-full flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 text-xs">
                    Rendering high-resolution photo strip...
                  </div>
                )}
              </div>

              {/* Retake Shots Button */}
              <button
                type="button"
                onClick={handleRetake}
                className="mt-4 text-xs text-slate-500 hover:text-[#1b3b5f] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer print:hidden"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photos with Camera</span>
              </button>
            </div>

            {/* Right Column: Customization Controls & Download Studio */}
            <div className="lg:col-span-7 space-y-6 print:hidden">
              {/* Card 1: Layout Selection */}
              <div className="glass-card rounded-3xl p-5 sm:p-6 border border-blue-100 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Sliders className="w-4 h-4 text-[#7094b7]" />
                  <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#1b3b5f]">
                    1. Choose Photo Strip Layout
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLayout("strip")}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      layout === "strip"
                        ? "border-[#1b3b5f] bg-blue-50/60 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <p className="font-bold text-xs text-[#1b3b5f]">Classic Strip (2x6&quot;)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Vertical 4-photo booth strip</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout("grid")}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      layout === "grid"
                        ? "border-[#1b3b5f] bg-blue-50/60 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <p className="font-bold text-xs text-[#1b3b5f]">Postcard Grid (4x6&quot;)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">2x2 modern square layout</p>
                  </button>
                </div>
              </div>

              {/* Card 2: Theme Frame Selection */}
              <div className="glass-card rounded-3xl p-5 sm:p-6 border border-blue-100 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#7094b7]" />
                  <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#1b3b5f]">
                    2. Wedding Frame Color
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(FRAME_CONFIGS) as FrameTheme[]).map((themeKey) => {
                    const cfg = FRAME_CONFIGS[themeKey];
                    const isSelected = frameTheme === themeKey;
                    return (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => setFrameTheme(themeKey)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#1b3b5f] ring-2 ring-[#1b3b5f]/30 bg-blue-50/50"
                            : "border-slate-200 bg-white hover:border-blue-200"
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                          style={{ backgroundColor: cfg.bgHex }}
                        />
                        <span className="text-xs font-semibold text-slate-700 truncate">{cfg.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 3: Photo Filter */}
              <div className="glass-card rounded-3xl p-5 sm:p-6 border border-blue-100 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-[#7094b7]" />
                  <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#1b3b5f]">
                    3. Photo Color Filter
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { id: "natural", name: "Natural Clean" },
                      { id: "bw", name: "B&W Classic" },
                      { id: "warm", name: "Warm Romance" },
                      { id: "vintage", name: "Vintage Film" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-semibold ${
                        filter === f.id
                          ? "border-[#1b3b5f] bg-[#1b3b5f] text-white shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 4: Guest Name & Message Tag */}
              <div className="glass-card rounded-3xl p-5 sm:p-6 border border-blue-100 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-[#7094b7]" />
                  <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#1b3b5f]">
                    4. Add Your Name or Warm Note (Optional)
                  </h3>
                </div>
                <input
                  type="text"
                  maxLength={40}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. With Love, The Ramos Family / Tito Mark & Tita Joy"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#1b3b5f] shadow-2xs"
                />
              </div>

              {/* Action Buttons: Download & Print */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={isGeneratingStrip || !finalStripUrl}
                  onClick={handleDownload}
                  className="flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1b3b5f] to-[#2e5782] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-amber-200" />
                  <span>Download Photo Strip</span>
                </button>

                <button
                  type="button"
                  disabled={isGeneratingStrip || !finalStripUrl}
                  onClick={handlePrint}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#1b3b5f] border-2 border-[#1b3b5f] font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#1b3b5f]" />
                  <span>Print Strip</span>
                </button>
              </div>

              {/* Sharing & Live Gallery Link */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Saved to Wedding Souvenirs!</p>
                    <p className="text-[10px] text-emerald-700">
                      Your photo strip is saved and will appear in the wedding reception gallery.
                    </p>
                  </div>
                </div>

                <Link
                  href="/photobooth/gallery"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors shrink-0"
                >
                  View All Photos
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Print-Only CSS Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-strip,
          #printable-strip * {
            visibility: visible;
          }
          #printable-strip {
            position: fixed;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 100% !important;
            max-width: 4in !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>
    </div>
  );
}

