"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  User,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Download,
  Plus,
  Edit2,
  Trash2,
  Eye,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Printer,
  Heart,
  Crown,
  Palette,
  MessageSquare,
  LayoutDashboard,
  UserCheck,
  Menu,
  X,
  Calendar,
  ExternalLink,
  Mail,
  Check,
  Upload,
  FileSpreadsheet,
  FileDown,
  CheckSquare,
  Square,
  ImageIcon,
  RotateCcw,
  UploadCloud,
  Image as ImageLucide,
  Video,
  Film,
  Play,
  Pause,
  Music,
  Volume2,
  MapPin,
  Church,
  Utensils,
  Navigation,
  BookOpen,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  weddingStore,
  RsvpEntry,
  EntourageCategory,
  EntourageMember,
  InvitedParty,
  PartyMember,
  ThemeColor,
  GuestbookEntry,
  CoupleInfo,
  getInitialCoupleInfo,
  SiteImages,
  getInitialSiteImages,
} from "@/lib/weddingStore";
import { weddingMusic, extractYouTubeId } from "@/lib/youtubeAudio";
import { weddingData } from "@/data/weddingData";
import swalAlert from "@/lib/swal";

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Sidebar navigation state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "couple"
    | "envelope"
    | "venues"
    | "music"
    | "footer"
    | "parties"
    | "rsvps"
    | "palette"
    | "entourage"
    | "wishes"
    | "images"
  >("dashboard");

  // Store data states
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [parties, setParties] = useState<InvitedParty[]>([]);
  const [colors, setColors] = useState<ThemeColor[]>([]);
  const [entourage, setEntourage] = useState<EntourageCategory[]>([]);
  const [wishes, setWishes] = useState<GuestbookEntry[]>([]);
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(getInitialCoupleInfo());

  // Theme text info
  const [themeTitle, setThemeTitle] = useState(weddingData.theme.name);
  const [themeDesc, setThemeDesc] = useState(weddingData.theme.description);

  // DataTable States for RSVPs
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof RsvpEntry>("submittedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Party Search State
  const [partySearch, setPartySearch] = useState("");

  // Modals
  const [isAddPartyOpen, setIsAddPartyOpen] = useState<boolean>(false);
  const [editingParty, setEditingParty] = useState<InvitedParty | null>(null);

  const [isAddColorOpen, setIsAddColorOpen] = useState<boolean>(false);
  const [editingColor, setEditingColor] = useState<ThemeColor | null>(null);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#7B9EBD");
  const [newColorDesc, setNewColorDesc] = useState("");

  const [isAddRsvpOpen, setIsAddRsvpOpen] = useState<boolean>(false);
  const [editingRsvp, setEditingRsvp] = useState<RsvpEntry | null>(null);
  const [selectedRsvpView, setSelectedRsvpView] = useState<RsvpEntry | null>(null);

  // Entourage Modal state
  const [isEntourageModalOpen, setIsEntourageModalOpen] = useState<boolean>(false);
  const [editingEntourageMember, setEditingEntourageMember] = useState<{
    categoryIndex: number;
    memberId: string | null;
    role: string;
    name: string;
  } | null>(null);

  // Party modal form state
  const [partyFormName, setPartyFormName] = useState("");
  const [partyFormPrimary, setPartyFormPrimary] = useState("");
  const [partyFormEmail, setPartyFormEmail] = useState("");
  const [partyFormPhone, setPartyFormPhone] = useState("");
  const [partyFormTable, setPartyFormTable] = useState("");
  const [partyFormNotes, setPartyFormNotes] = useState("");
  const [partyFormMembers, setPartyFormMembers] = useState<{ id: string; name: string; role: string; isAttending: boolean }[]>([]);

  // Multi-Selection States for Data Tables
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([]);
  const [selectedRsvpIds, setSelectedRsvpIds] = useState<string[]>([]);

  // Excel / CSV Import States
  const [isPartyImportOpen, setIsPartyImportOpen] = useState<boolean>(false);
  const [partyImportPreview, setPartyImportPreview] = useState<InvitedParty[]>([]);
  const [partyImportMode, setPartyImportMode] = useState<"append" | "replace">("append");

  const [isRsvpImportOpen, setIsRsvpImportOpen] = useState<boolean>(false);
  const [rsvpImportPreview, setRsvpImportPreview] = useState<RsvpEntry[]>([]);
  const [rsvpImportMode, setRsvpImportMode] = useState<"append" | "replace">("append");

  const partyFileInputRef = React.useRef<HTMLInputElement>(null);
  const rsvpFileInputRef = React.useRef<HTMLInputElement>(null);

  // Site Images & Media States
  const [siteImages, setSiteImages] = useState<SiteImages>(getInitialSiteImages());
  const [imageSuccessMsg, setImageSuccessMsg] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    if (weddingStore.isAuthenticated()) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  // Listen for image store updates
  useEffect(() => {
    const handleImagesUpdated = () => {
      setSiteImages(weddingStore.getSiteImages());
    };
    window.addEventListener("wedding_images_updated", handleImagesUpdated);
    return () => window.removeEventListener("wedding_images_updated", handleImagesUpdated);
  }, []);

  const loadAllData = () => {
    setRsvps(weddingStore.getRsvps());
    setParties(weddingStore.getParties());
    setColors(weddingStore.getThemeColors());
    setEntourage(weddingStore.getEntourage());
    setCoupleInfo(weddingStore.getCoupleInfo());
    setSiteImages(weddingStore.getSiteImages());

    if (typeof window !== "undefined") {
      const savedWishes = localStorage.getItem("aian_dang_wedding_guestbook");
      if (savedWishes) {
        try {
          setWishes(JSON.parse(savedWishes));
        } catch {
          // ignore
        }
      }
    }
  };

  // Media & Video Management Handlers
  const handleMediaFileSelect = async (
    key: keyof SiteImages,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(key);

    const isVideo =
      file.type.startsWith("video/") ||
      Boolean(file.name.match(/\.(mp4|webm|mov|m4v|ogg)$/i));

    // For videos or large media (> 2MB), upload directly to server to prevent localStorage quota errors
    if (isVideo || file.size > 2 * 1024 * 1024) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("key", key);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            weddingStore.updateSiteImage(key, data.url);
            setSiteImages(weddingStore.getSiteImages());
            setImageSuccessMsg(
              `${isVideo ? "Video" : "Media"} uploaded and saved successfully! Changes are live across the site.`
            );
            swalAlert.toastSuccess(
              "Upload Successful!",
              `${isVideo ? "Video" : "Image"} uploaded and updated live on the site.`
            );
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          swalAlert.error("Upload Failed", errData.error || "Failed to upload file to the server.");
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        swalAlert.error("Upload Error", err.message || "A network or server error occurred during upload.");
      } finally {
        setIsUploadingImage(null);
        setTimeout(() => setImageSuccessMsg(""), 4000);
      }
      return;
    }

    // For smaller images, provide immediate local base64 preview while uploading permanently
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        weddingStore.updateSiteImage(key, dataUrl);
        setSiteImages(weddingStore.getSiteImages());
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("key", key);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            weddingStore.updateSiteImage(key, data.url);
            setSiteImages(weddingStore.getSiteImages());
          }
        }
      } catch (err) {
        console.warn("Server upload fallback:", err);
      } finally {
        setIsUploadingImage(null);
        setImageSuccessMsg("Media asset updated successfully! Changes are live across the website.");
        swalAlert.toastSuccess("Asset Updated!", "Your media item is now live across the wedding site.");
        setTimeout(() => setImageSuccessMsg(""), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetImage = async (key: keyof SiteImages) => {
    const confirmed = await swalAlert.confirm({
      title: "Reset Media Asset?",
      text: "Reset this photo/video back to its original default asset?",
      confirmButtonText: "Yes, Reset to Default",
      cancelButtonText: "Cancel",
      icon: "warning",
    });
    if (confirmed) {
      weddingStore.resetSiteImage(key);
      setSiteImages(weddingStore.getSiteImages());
      setImageSuccessMsg("Media asset restored to original default.");
      swalAlert.toastSuccess("Media Reset", "Image was restored to its default asset.");
      setTimeout(() => setImageSuccessMsg(""), 3000);
    }
  };

  const handleResetAllImages = async () => {
    const confirmed = await swalAlert.confirmDelete({
      title: "Reset ALL Website Media?",
      text: "Are you sure you want to reset ALL website photos, hero banners, videos, and logos to factory defaults? Any custom uploads will be replaced.",
      confirmButtonText: "Yes, Reset All to Defaults",
      cancelButtonText: "Cancel, Keep Custom",
    });
    if (confirmed) {
      weddingStore.resetAllSiteImages();
      setSiteImages(weddingStore.getSiteImages());
      setImageSuccessMsg("All website photos and logos reset to defaults.");
      swalAlert.success("All Media Reset", "All website photos, banners, and logos were restored to factory defaults.");
      setTimeout(() => setImageSuccessMsg(""), 3000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === "admin" && passwordInput === "Aianbasagre2") {
      weddingStore.login(rememberMe);
      setIsAuthenticated(true);
      setAuthError("");
      loadAllData();
      swalAlert.toastSuccess("Welcome Back!", "Logged in to Wedding Administration Portal.");
    } else {
      setAuthError("Invalid credentials. Username is 'admin' and password is case-sensitive.");
      swalAlert.error("Access Denied", "Invalid username or password. Please check your credentials and try again.");
    }
  };

  const handleLogout = async () => {
    const confirmed = await swalAlert.confirm({
      title: "End Admin Session?",
      text: "Are you sure you want to log out of the Wedding Admin Portal?",
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "Stay Logged In",
      icon: "question",
    });
    if (confirmed) {
      weddingStore.logout();
      setIsAuthenticated(false);
      setUsernameInput("");
      setPasswordInput("");
      swalAlert.toastSuccess("Logged Out", "You have safely ended your admin session.");
    }
  };

  // RSVP Actions
  const handleToggleStatus = (id: string, currentStatus: "attending" | "declined") => {
    const nextStatus = currentStatus === "attending" ? "declined" : "attending";
    weddingStore.updateRsvp(id, { status: nextStatus });
    loadAllData();
    swalAlert.toastSuccess(
      "Status Updated",
      `RSVP marked as ${nextStatus === "attending" ? "Attending" : "Declined"}.`
    );
  };

  const handleDeleteRsvp = async (id: string, name: string) => {
    const confirmed = await swalAlert.confirmDelete({
      title: "Delete RSVP Entry?",
      text: `Are you sure you want to delete the RSVP entry for "${name}"? This action cannot be undone.`,
      confirmButtonText: "Yes, Delete RSVP",
      cancelButtonText: "Cancel",
    });
    if (confirmed) {
      weddingStore.deleteRsvp(id);
      loadAllData();
      swalAlert.toastSuccess("RSVP Deleted", `RSVP for "${name}" has been removed.`);
    }
  };

  // Party Actions
  const handleOpenAddParty = () => {
    setEditingParty(null);
    setPartyFormName("");
    setPartyFormPrimary("");
    setPartyFormEmail("");
    setPartyFormPhone("");
    setPartyFormTable("VIP Table 1");
    setPartyFormNotes("");
    setPartyFormMembers([
      { id: "m-" + Date.now(), name: "", role: "Primary Guest", isAttending: true },
    ]);
    setIsAddPartyOpen(true);
  };

  const handleOpenEditParty = (party: InvitedParty) => {
    setEditingParty(party);
    setPartyFormName(party.partyName);
    setPartyFormPrimary(party.primaryGuest);
    setPartyFormEmail(party.email || "");
    setPartyFormPhone(party.phone || "");
    setPartyFormTable(party.tableNumber || "");
    setPartyFormNotes(party.notes || "");
    setPartyFormMembers(
      party.members.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role || "Guest",
        isAttending: m.isAttending !== false,
      }))
    );
    setIsAddPartyOpen(true);
  };

  const handleAddMemberToPartyForm = () => {
    setPartyFormMembers([
      ...partyFormMembers,
      { id: "m-" + Date.now(), name: "", role: "Plus One / Guest", isAttending: true },
    ]);
  };

  const handleRemoveMemberFromPartyForm = (id: string) => {
    if (partyFormMembers.length <= 1) return;
    setPartyFormMembers(partyFormMembers.filter((m) => m.id !== id));
  };

  const handleSaveParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyFormPrimary.trim() || !partyFormName.trim()) {
      swalAlert.error(
        "Missing Required Information",
        "Please provide both a Party/Household Name and Primary Guest Name."
      );
      return;
    }

    const cleanMembers = partyFormMembers.filter((m) => m.name.trim().length > 0);
    if (cleanMembers.length === 0) {
      cleanMembers.push({ id: "m-1", name: partyFormPrimary.trim(), role: "Primary Guest", isAttending: true });
    }

    const isEditing = !!editingParty;
    if (editingParty) {
      weddingStore.updateParty(editingParty.id, {
        partyName: partyFormName.trim(),
        primaryGuest: partyFormPrimary.trim(),
        email: partyFormEmail.trim(),
        phone: partyFormPhone.trim(),
        maxSeats: cleanMembers.length,
        tableNumber: partyFormTable.trim(),
        notes: partyFormNotes.trim(),
        members: cleanMembers,
      });
    } else {
      weddingStore.addParty({
        partyName: partyFormName.trim(),
        primaryGuest: partyFormPrimary.trim(),
        email: partyFormEmail.trim(),
        phone: partyFormPhone.trim(),
        maxSeats: cleanMembers.length,
        tableNumber: partyFormTable.trim(),
        notes: partyFormNotes.trim(),
        members: cleanMembers,
      });
    }

    setIsAddPartyOpen(false);
    loadAllData();
    swalAlert.toastSuccess(
      isEditing ? "Party Updated!" : "Party Added!",
      `Party "${partyFormName.trim()}" (${cleanMembers.length} seats) saved successfully.`
    );
  };

  const handleDeleteParty = async (id: string, name: string) => {
    const confirmed = await swalAlert.confirmDelete({
      title: "Delete Guest Party?",
      text: `Are you sure you want to delete "${name}" from the master guest list? All assigned seat slots will be removed.`,
      confirmButtonText: "Yes, Delete Party",
      cancelButtonText: "Cancel",
    });
    if (confirmed) {
      weddingStore.deleteParty(id);
      loadAllData();
      swalAlert.toastSuccess("Party Deleted", `Party "${name}" was removed.`);
    }
  };

  // Color Palette Actions
  const handleOpenAddColor = () => {
    setEditingColor(null);
    setNewColorName("");
    setNewColorHex("#7B9EBD");
    setNewColorDesc("");
    setIsAddColorOpen(true);
  };

  const handleOpenEditColor = (color: ThemeColor) => {
    setEditingColor(color);
    setNewColorName(color.name);
    setNewColorHex(color.hex);
    setNewColorDesc(color.desc);
    setIsAddColorOpen(true);
  };

  const handleSaveColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim() || !newColorHex.trim()) {
      swalAlert.error("Missing Information", "Please enter a color name and valid HEX color code.");
      return;
    }

    const isEditing = !!editingColor;
    if (editingColor) {
      weddingStore.updateThemeColor(editingColor.id, {
        name: newColorName.trim(),
        hex: newColorHex.trim(),
        desc: newColorDesc.trim(),
      });
    } else {
      weddingStore.addThemeColor({
        name: newColorName.trim(),
        hex: newColorHex.trim(),
        desc: newColorDesc.trim(),
      });
    }

    setIsAddColorOpen(false);
    loadAllData();
    swalAlert.toastSuccess(
      isEditing ? "Color Swatch Updated" : "Color Swatch Added",
      `Color "${newColorName.trim()}" is now live in the dress code palette.`
    );
  };

  const handleDeleteColor = async (id: string, name: string) => {
    const confirmed = await swalAlert.confirmDelete({
      title: "Delete Color Swatch?",
      text: `Are you sure you want to remove swatch "${name}" from the wedding theme palette?`,
      confirmButtonText: "Yes, Delete Swatch",
      cancelButtonText: "Cancel",
    });
    if (confirmed) {
      weddingStore.deleteThemeColor(id);
      loadAllData();
      swalAlert.toastSuccess("Swatch Removed", `Color "${name}" was deleted.`);
    }
  };

  // Couple Information Actions
  const handleSaveCoupleInfo = (e?: React.SyntheticEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    weddingStore.saveCoupleInfo(coupleInfo);
    swalAlert.success("Success");
  };

  // Clear demo / all guest data helper
  const handleClearAllGuests = async () => {
    const confirmed = await swalAlert.confirmDelete({
      title: "Reset All Guest & RSVP Data?",
      text: "Are you sure you want to completely clear all guest list parties and RSVP responses? This will reset the guest lists to 0 so you can input your real guests.",
      confirmButtonText: "Yes, Clear All Guests",
      cancelButtonText: "Cancel, Keep Data",
    });
    if (confirmed) {
      weddingStore.clearAllGuestData();
      loadAllData();
      swalAlert.success(
        "Guest List Cleared",
        "All guest parties and RSVP records have been reset to 0."
      );
    }
  };

  // Entourage member actions
  const handleOpenAddEntourage = (defaultCategoryIndex: number = 0) => {
    setEditingEntourageMember({
      categoryIndex: defaultCategoryIndex,
      memberId: null,
      role: "",
      name: "",
    });
    setIsEntourageModalOpen(true);
  };

  const handleOpenEditEntourage = (catIdx: number, member: EntourageMember) => {
    setEditingEntourageMember({
      categoryIndex: catIdx,
      memberId: member.id,
      role: member.role,
      name: member.name,
    });
    setIsEntourageModalOpen(true);
  };

  const handleSaveEntourageMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingEntourageMember ||
      !editingEntourageMember.name.trim() ||
      !editingEntourageMember.role.trim()
    ) {
      swalAlert.error(
        "Missing Information",
        "Please provide both member name and their wedding entourage role."
      );
      return;
    }

    const isEditing = !!editingEntourageMember.memberId;
    if (editingEntourageMember.memberId) {
      weddingStore.updateEntourageMember(
        editingEntourageMember.categoryIndex,
        editingEntourageMember.memberId,
        {
          role: editingEntourageMember.role.trim(),
          name: editingEntourageMember.name.trim(),
        }
      );
    } else {
      weddingStore.addEntourageMember(editingEntourageMember.categoryIndex, {
        role: editingEntourageMember.role.trim(),
        name: editingEntourageMember.name.trim(),
      });
    }

    const memberName = editingEntourageMember.name.trim();
    setIsEntourageModalOpen(false);
    setEditingEntourageMember(null);
    loadAllData();
    swalAlert.toastSuccess(
      isEditing ? "Entourage Member Updated" : "Entourage Member Added",
      `"${memberName}" was saved to the entourage roster.`
    );
  };

  const handleDeleteEntourageMember = async (catIdx: number, memberId: string) => {
    const confirmed = await swalAlert.confirmDelete({
      title: "Remove Entourage Member?",
      text: "Are you sure you want to remove this member from the wedding entourage roster?",
      confirmButtonText: "Yes, Remove Member",
      cancelButtonText: "Cancel",
    });
    if (confirmed) {
      weddingStore.deleteEntourageMember(catIdx, memberId);
      loadAllData();
      swalAlert.toastSuccess("Member Removed", "Entourage member was removed.");
    }
  };

  // Filtered and Sorted RSVPs
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((r) => {
      const matchSearch =
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.companionNames.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rsvps, searchTerm, statusFilter]);

  const sortedRsvps = useMemo(() => {
    return [...filteredRsvps].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      if (sortField === "guestCount") {
        aVal = a.guestCount || 1;
        bVal = b.guestCount || 1;
      } else {
        const aRaw = a[sortField];
        const bRaw = b[sortField];
        aVal = typeof aRaw === "string" || typeof aRaw === "number" ? aRaw : "";
        bVal = typeof bRaw === "string" || typeof bRaw === "number" ? bRaw : "";
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRsvps, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedRsvps.length / pageSize) || 1;
  const paginatedRsvps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRsvps.slice(start, start + pageSize);
  }, [sortedRsvps, currentPage, pageSize]);

  // Analytics KPI Computations
  const totalRsvpCount = rsvps.length;
  const attendingRsvps = rsvps.filter((r) => r.status === "attending");
  const declinedRsvps = rsvps.filter((r) => r.status === "declined");
  const totalHeadcount = attendingRsvps.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const targetCapacity = 180;
  const capacityPercent = Math.min(100, Math.round((totalHeadcount / targetCapacity) * 100));

  const totalInvitedPartiesCount = parties.length;
  const totalInvitedSeatsCount = parties.reduce((acc, curr) => acc + curr.maxSeats, 0);

  // Export CSV
  const exportToCsv = () => {
    const headers = [
      "ID",
      "Full Name",
      "Status",
      "Seats (Headcount)",
      "Companions",
      "Table Assignment",
      "Email",
      "Phone",
      "Special Message",
      "Date Submitted",
    ];

    const rows = filteredRsvps.map((r) => [
      `"${r.id}"`,
      `"${r.fullName}"`,
      `"${r.status}"`,
      `"${r.guestCount || 1}"`,
      `"${r.companionNames || ""}"`,
      `"${r.tableNumber || "Unassigned"}"`,
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
    link.setAttribute("download", `Aian_Dang_Wedding_Guests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Parties
  const filteredParties = useMemo(() => {
    if (!partySearch.trim()) return parties;
    const q = partySearch.toLowerCase();
    return parties.filter(
      (p) =>
        p.partyName.toLowerCase().includes(q) ||
        p.primaryGuest.toLowerCase().includes(q) ||
        (p.tableNumber && p.tableNumber.toLowerCase().includes(q)) ||
        p.members.some((m) => m.name.toLowerCase().includes(q))
    );
  }, [parties, partySearch]);

  // Parties Multi-Selection Handlers
  const isAllPartiesSelected =
    filteredParties.length > 0 &&
    filteredParties.every((p) => selectedPartyIds.includes(p.id));

  const isSomePartiesSelected =
    selectedPartyIds.length > 0 && !isAllPartiesSelected;

  const handleToggleSelectParty = (id: string) => {
    setSelectedPartyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllParties = () => {
    if (isAllPartiesSelected) {
      setSelectedPartyIds([]);
    } else {
      setSelectedPartyIds(filteredParties.map((p) => p.id));
    }
  };

  const handleDeleteSelectedParties = async () => {
    if (selectedPartyIds.length === 0) return;
    const count = selectedPartyIds.length;
    const confirmed = await swalAlert.confirmDelete({
      title: `Delete ${count} Guest Parties?`,
      text: `Are you sure you want to delete ${count} selected guest ${
        count === 1 ? "party" : "parties"
      }? This action cannot be undone.`,
      confirmButtonText: "Yes, Delete Selected",
      cancelButtonText: "Cancel",
    });
    if (confirmed) {
      const updated = parties.filter((p) => !selectedPartyIds.includes(p.id));
      weddingStore.saveParties(updated);
      setSelectedPartyIds([]);
      loadAllData();
      swalAlert.success(
        "Parties Deleted",
        `Successfully deleted ${count} guest ${count === 1 ? "party" : "parties"}.`
      );
    }
  };

  const handleExportSelectedParties = () => {
    const toExport = parties.filter((p) => selectedPartyIds.includes(p.id));
    if (toExport.length === 0) return;
    exportPartiesToCsv(toExport, `Aian_Dang_Selected_Parties_${Date.now()}.csv`);
    swalAlert.toastSuccess("CSV Exported", `Downloaded spreadsheet for ${toExport.length} parties.`);
  };

  // RSVPs Multi-Selection Handlers
  const isAllRsvpsSelected =
    paginatedRsvps.length > 0 &&
    paginatedRsvps.every((r) => selectedRsvpIds.includes(r.id));

  const isSomeRsvpsSelected =
    selectedRsvpIds.length > 0 && !isAllRsvpsSelected;

  const handleToggleSelectRsvp = (id: string) => {
    setSelectedRsvpIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllRsvps = () => {
    if (isAllRsvpsSelected) {
      setSelectedRsvpIds([]);
    } else {
      const currentIds = paginatedRsvps.map((r) => r.id);
      setSelectedRsvpIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleDeleteSelectedRsvps = async () => {
    if (selectedRsvpIds.length === 0) return;
    const count = selectedRsvpIds.length;
    const confirmed = await swalAlert.confirmDelete({
      title: `Delete ${count} RSVP Submissions?`,
      text: `Are you sure you want to permanently delete ${count} selected RSVP ${
        count === 1 ? "entry" : "entries"
      }?`,
      confirmButtonText: "Yes, Delete Selected",
      cancelButtonText: "Cancel",
    });
    if (confirmed) {
      const updated = rsvps.filter((r) => !selectedRsvpIds.includes(r.id));
      weddingStore.saveRsvps(updated);
      setSelectedRsvpIds([]);
      loadAllData();
      swalAlert.success(
        "RSVPs Deleted",
        `Successfully removed ${count} RSVP ${count === 1 ? "entry" : "entries"}.`
      );
    }
  };

  const handleBulkMarkRsvpStatus = (status: "attending" | "declined") => {
    if (selectedRsvpIds.length === 0) return;
    const count = selectedRsvpIds.length;
    const updated = rsvps.map((r) =>
      selectedRsvpIds.includes(r.id) ? { ...r, status } : r
    );
    weddingStore.saveRsvps(updated);
    loadAllData();
    swalAlert.toastSuccess(
      "Status Updated",
      `Marked ${count} RSVPs as ${status === "attending" ? "Attending" : "Declined"}.`
    );
  };

  const handleExportSelectedRsvps = () => {
    const toExport = rsvps.filter((r) => selectedRsvpIds.includes(r.id));
    if (toExport.length === 0) return;
    exportRsvpsListToCsv(toExport, `Aian_Dang_Selected_RSVPs_${Date.now()}.csv`);
    swalAlert.toastSuccess("CSV Exported", `Downloaded spreadsheet for ${toExport.length} RSVPs.`);
  };

  // Download CSV Helper
  const downloadCsvFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Parties to CSV
  const exportPartiesToCsv = (partiesToExport: InvitedParty[], filename: string) => {
    const headers = [
      "Party ID",
      "Party / Household Name",
      "Primary Guest",
      "Table Assignment",
      "Max Seats",
      "Members Count",
      "Invited Members",
      "Phone",
      "Email",
      "Notes",
      "Status",
    ];
    const rows = partiesToExport.map((p) => [
      `"${p.id}"`,
      `"${(p.partyName || "").replace(/"/g, '""')}"`,
      `"${(p.primaryGuest || "").replace(/"/g, '""')}"`,
      `"${(p.tableNumber || "Unassigned").replace(/"/g, '""')}"`,
      `"${p.maxSeats}"`,
      `"${p.members.length}"`,
      `"${p.members.map((m) => m.name).join("; ").replace(/"/g, '""')}"`,
      `"${p.phone || ""}"`,
      `"${p.email || ""}"`,
      `"${(p.notes || "").replace(/"/g, '""')}"`,
      `"${p.status || "pending"}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCsvFile(filename, csvContent);
  };

  // Export RSVPs to CSV
  const exportRsvpsListToCsv = (rsvpsToExport: RsvpEntry[], filename: string) => {
    const headers = [
      "RSVP ID",
      "Full Name",
      "Status",
      "Seats (Headcount)",
      "Companions",
      "Table Assignment",
      "Email",
      "Phone",
      "Special Message",
      "Date Submitted",
    ];
    const rows = rsvpsToExport.map((r) => [
      `"${r.id}"`,
      `"${(r.fullName || "").replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.guestCount || 1}"`,
      `"${(r.companionNames || "").replace(/"/g, '""')}"`,
      `"${(r.tableNumber || "Unassigned").replace(/"/g, '""')}"`,
      `"${r.email || ""}"`,
      `"${r.phone || ""}"`,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      `"${r.submittedAt}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCsvFile(filename, csvContent);
  };

  // Download Templates
  const handleDownloadPartyTemplate = () => {
    const sample =
`Party Name,Primary Guest,Table Number,Max Seats,Members,Phone,Email,Notes
"Mr. & Mrs. Juan dela Cruz","Juan dela Cruz","VIP Table 1",2,"Juan dela Cruz, Maria dela Cruz","+63 917 123 4567","juan@example.com","Close Family"
"Santos Family","Robert Santos","Table 3",4,"Robert Santos, Elena Santos, Marco Santos, Chloe Santos","+63 918 987 6543","robert@example.com","Ninong and family"
"Engr. & Mrs. Manuel Cruz","Manuel Cruz","Principal Sponsors Table",2,"Manuel Cruz, Patricia Cruz","+63 917 555 1234","manuel@example.com","Principal Sponsor"`;
    downloadCsvFile("Aian_Dang_Guest_List_Template.csv", sample);
    swalAlert.toastSuccess("Template Downloaded", "Guest List CSV template is ready to fill and import.");
  };

  const handleDownloadRsvpTemplate = () => {
    const sample =
`Full Name,Status,Guest Count,Companion Names,Table Number,Phone,Email,Message
"Juan dela Cruz","attending",2,"Maria dela Cruz","VIP Table 1","+63 917 123 4567","juan@example.com","Warmest congratulations to Aian & Dang!"
"Elena Santos","attending",4,"Robert Santos, Marco Santos, Chloe Santos","Table 3","+63 918 987 6543","elena@example.com","So excited to celebrate with you!"
"Manuel Cruz","declined",1,"","Principal Sponsors Table","+63 917 555 1234","manuel@example.com","Sending love and best wishes from afar!"`;
    downloadCsvFile("Aian_Dang_RSVP_Template.csv", sample);
    swalAlert.toastSuccess("Template Downloaded", "RSVP CSV template is ready to fill and import.");
  };

  // SheetJS Parsers
  const parsePartiesFromSheet = (jsonData: any[]): InvitedParty[] => {
    const result: InvitedParty[] = [];
    jsonData.forEach((row, index) => {
      const getVal = (aliases: string[]): string => {
        for (const key of Object.keys(row)) {
          const cleanKey = key.trim().toLowerCase();
          for (const alias of aliases) {
            if (cleanKey === alias.toLowerCase()) {
              const val = row[key];
              return val !== undefined && val !== null ? String(val).trim() : "";
            }
          }
        }
        return "";
      };

      const primaryGuest = getVal(["primary guest", "guest name", "primary", "name", "full name"]);
      const rawPartyName = getVal(["party name", "household", "family", "party title", "party"]);
      const partyName = rawPartyName || (primaryGuest ? `${primaryGuest} Party` : `Party #${index + 1}`);
      const actualPrimary = primaryGuest || rawPartyName || `Guest #${index + 1}`;

      const tableNumber = getVal(["table number", "table", "table assignment", "seating"]) || "VIP Table 1";
      const phone = getVal(["phone", "mobile", "contact", "cellphone"]);
      const email = getVal(["email", "e-mail"]);
      const notes = getVal(["notes", "note", "remarks", "dietary"]);
      const rawMaxSeats = getVal(["max seats", "seats", "headcount", "allowed seats", "seats count"]);

      const membersVal = getVal(["members", "member names", "companions", "plus ones", "guests"]);
      let memberNames: string[] = [];
      if (membersVal) {
        memberNames = membersVal
          .split(/[,;\n\r&]+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }

      if (actualPrimary && !memberNames.some((m) => m.toLowerCase() === actualPrimary.toLowerCase())) {
        memberNames.unshift(actualPrimary);
      }
      if (memberNames.length === 0) {
        memberNames = [actualPrimary];
      }

      const maxSeats = rawMaxSeats ? parseInt(rawMaxSeats, 10) || memberNames.length : memberNames.length;

      const partyMembers: PartyMember[] = memberNames.map((name, mIdx) => ({
        id: `imp-m-${index}-${mIdx}-${Date.now()}`,
        name,
        role: mIdx === 0 ? "Primary Guest" : "Guest / Plus One",
        isAttending: true,
      }));

      result.push({
        id: `pty-imp-${Date.now()}-${index}`,
        partyName,
        primaryGuest: actualPrimary,
        email,
        phone,
        maxSeats: Math.max(maxSeats, partyMembers.length),
        members: partyMembers,
        tableNumber,
        notes,
        status: "pending",
        lastUpdated: new Date().toLocaleString(),
      });
    });
    return result;
  };

  const parseRsvpsFromSheet = (jsonData: any[]): RsvpEntry[] => {
    const result: RsvpEntry[] = [];
    jsonData.forEach((row, index) => {
      const getVal = (aliases: string[]): string => {
        for (const key of Object.keys(row)) {
          const cleanKey = key.trim().toLowerCase();
          for (const alias of aliases) {
            if (cleanKey === alias.toLowerCase()) {
              const val = row[key];
              return val !== undefined && val !== null ? String(val).trim() : "";
            }
          }
        }
        return "";
      };

      const fullName = getVal(["full name", "guest name", "name", "primary guest"]) || `Guest #${index + 1}`;
      const rawStatus = getVal(["status", "attending status", "attendance"]).toLowerCase();
      const status: "attending" | "declined" =
        rawStatus.includes("no") || rawStatus.includes("decline") || rawStatus.includes("absent")
          ? "declined"
          : "attending";

      const rawGuestCount = getVal(["guest count", "seats", "seats (headcount)", "headcount"]);
      const companionsVal = getVal(["companions", "companion names", "members", "plus ones"]);
      const companionList = companionsVal
        ? companionsVal.split(/[,;\n\r&]+/).map((s) => s.trim()).filter(Boolean)
        : [];
      const guestCount = rawGuestCount ? parseInt(rawGuestCount, 10) || (companionList.length + 1) : (companionList.length + 1);

      const tableNumber = getVal(["table assignment", "table number", "table"]) || "VIP Table 1";
      const phone = getVal(["phone", "mobile", "contact"]);
      const email = getVal(["email", "e-mail"]);
      const message = getVal(["special message", "message", "blessing", "wishes"]);

      const memberBreakdown = [
        { name: fullName, isAttending: status === "attending" },
        ...companionList.map((c) => ({ name: c, isAttending: status === "attending" })),
      ];

      result.push({
        id: `rsvp-imp-${Date.now()}-${index}`,
        fullName,
        email,
        phone,
        status,
        guestCount,
        companionNames: companionList.join(", "),
        memberBreakdown,
        message,
        tableNumber,
        submittedAt: new Date().toLocaleString(),
      });
    });
    return result;
  };

  // File Upload Handlers
  const handlePartyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.SheetNames[0];
        if (!firstSheet) {
          swalAlert.error("No Sheets Found", "The uploaded file contains no sheets.");
          return;
        }
        const rawJson = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: "" });
        if (rawJson.length === 0) {
          swalAlert.error("Empty Sheet", "The uploaded sheet has no rows of data.");
          return;
        }
        const parsed = parsePartiesFromSheet(rawJson);
        if (parsed.length === 0) {
          swalAlert.error(
            "Format Error",
            "Could not detect any valid parties from this sheet. Please ensure column headers match the template."
          );
          return;
        }
        setPartyImportPreview(parsed);
        setIsPartyImportOpen(true);
      } catch (err) {
        console.error(err);
        swalAlert.error("Parse Error", "Failed to parse file. Please upload a valid .xlsx, .xls, or .csv file.");
      } finally {
        if (partyFileInputRef.current) partyFileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleRsvpFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.SheetNames[0];
        if (!firstSheet) {
          swalAlert.error("No Sheets Found", "The uploaded file contains no sheets.");
          return;
        }
        const rawJson = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: "" });
        if (rawJson.length === 0) {
          swalAlert.error("Empty Sheet", "The uploaded sheet has no rows of data.");
          return;
        }
        const parsed = parseRsvpsFromSheet(rawJson);
        if (parsed.length === 0) {
          swalAlert.error(
            "Format Error",
            "Could not detect any valid RSVP entries from this sheet. Please verify column headers."
          );
          return;
        }
        setRsvpImportPreview(parsed);
        setIsRsvpImportOpen(true);
      } catch (err) {
        console.error(err);
        swalAlert.error("Parse Error", "Failed to parse file. Please upload a valid .xlsx, .xls, or .csv file.");
      } finally {
        if (rsvpFileInputRef.current) rsvpFileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmPartyImport = () => {
    if (partyImportPreview.length === 0) return;
    const count = partyImportPreview.length;
    let finalParties: InvitedParty[] = [];
    if (partyImportMode === "replace") {
      finalParties = partyImportPreview;
    } else {
      finalParties = [...partyImportPreview, ...parties];
    }
    weddingStore.saveParties(finalParties);
    setIsPartyImportOpen(false);
    setPartyImportPreview([]);
    loadAllData();
    swalAlert.success(
      "Parties Imported Successfully!",
      `Imported ${count} guest parties (${finalParties.reduce((acc, p) => acc + p.members.length, 0)} total seats) into your master list.`
    );
  };

  const handleConfirmRsvpImport = () => {
    if (rsvpImportPreview.length === 0) return;
    const count = rsvpImportPreview.length;
    let finalRsvps: RsvpEntry[] = [];
    if (rsvpImportMode === "replace") {
      finalRsvps = rsvpImportPreview;
    } else {
      finalRsvps = [...rsvpImportPreview, ...rsvps];
    }
    weddingStore.saveRsvps(finalRsvps);
    setIsRsvpImportOpen(false);
    setRsvpImportPreview([]);
    loadAllData();
    swalAlert.success(
      "RSVPs Imported Successfully!",
      `Imported ${count} RSVP responses into your wedding database.`
    );
  };

  /* ----------------- LOGIN VIEW ----------------- */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0e1d2f] via-[#1b3b5f] to-[#0e1d2f] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-amber-200/50 text-center">
          <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 shadow-lg border-2 border-amber-200/80 bg-white">
            <Image
              src="/images/wedding-logo.png"
              alt="Aian & Dang Logo"
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>

          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1b3b5f] uppercase mb-1">
            Couple &amp; Admin Portal
          </h1>
          <p className="text-xs text-slate-500 font-light mb-6">
            Aian &amp; Dang Wedding Management Suite
          </p>

          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-left">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-[#7094b7] mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1b3b5f] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-[#7094b7] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1b3b5f] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#1b3b5f]"
                />
                <span>Remember me</span>
              </label>

              <span className="text-[11px] text-slate-400">
                Default: admin / Aianbasagre2
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1b3b5f] to-[#2e5782] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border border-amber-200/40"
            >
              <ShieldCheck className="w-4 h-4 text-amber-200" />
              <span>Login to Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/"
              className="text-xs font-semibold text-[#7094b7] hover:text-[#1b3b5f] transition-colors inline-flex items-center gap-1"
            >
              &larr; Back to Wedding Invitation Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------- AUTHENTICATED SIDEBAR DASHBOARD ----------------- */
  return (
    <div className="min-h-screen bg-[#f4f7fa] flex text-slate-800">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ======================= LEFT SIDEBAR ======================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-56 sm:w-64 xl:w-72 bg-[#0e1d2f] text-white flex flex-col justify-between border-r border-blue-900/60 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Sidebar Header Brand */}
          <div className="p-4 sm:p-6 border-b border-blue-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-amber-200/50 shadow-md bg-white shrink-0">
                <Image
                  src="/images/wedding-logo.png"
                  alt="Aian & Dang Logo"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-serif-title text-xs sm:text-base font-bold text-white uppercase tracking-wider leading-tight whitespace-nowrap">
                  Aian &amp; Dang
                </h2>
                <p className="text-[9px] sm:text-[10px] text-amber-200/80 uppercase tracking-widest">
                  Admin Dashboard
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2.5 sm:p-4 space-y-1 sm:space-y-1.5 flex-1">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="truncate">
                <span className="sm:hidden">Overview</span>
                <span className="hidden sm:inline">Overview Analytics</span>
              </span>
            </button>

            {/* INVITATION CONTENT SECTION */}
            <div className="pt-2 pb-1 px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-300/60">
              Invitation Content
            </div>

            <button
              onClick={() => {
                setActiveTab("couple");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "couple"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Couple</span>
                  <span className="hidden sm:inline">Couple &amp; Story</span>
                </span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                Names
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("envelope");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "envelope"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Envelope</span>
                  <span className="hidden sm:inline">Opening Envelope</span>
                </span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                Texts
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("venues");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "venues"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <Church className="w-4 h-4 text-sky-300 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Venues</span>
                  <span className="hidden sm:inline">Venues &amp; Links</span>
                </span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                Maps
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("music");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "music"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <Music className="w-4 h-4 text-indigo-300 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Music</span>
                  <span className="hidden sm:inline">Background Music</span>
                </span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                YouTube
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("footer");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "footer"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <BookOpen className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Footer</span>
                  <span className="hidden sm:inline">Footer &amp; Verse</span>
                </span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                Scripture
              </span>
            </button>

            {/* GUESTS & ATTENDANCE SECTION */}
            <div className="pt-2.5 pb-1 px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-300/60">
              Guests &amp; Content
            </div>

            <button
              onClick={() => {
                setActiveTab("parties");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "parties"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <UserCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Guests</span>
                  <span className="hidden sm:inline">Master Guest List</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                {parties.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("rsvps");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "rsvps"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <Users className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">RSVPs</span>
                  <span className="hidden sm:inline">RSVP Responses</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-[10px] text-white shrink-0">
                {rsvps.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("palette");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "palette"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <Palette className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Colors</span>
                  <span className="hidden sm:inline">Dress &amp; Palette Colors</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                {colors.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("entourage");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "entourage"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <Crown className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Entourage</span>
                  <span className="hidden sm:inline">Entourage Roster</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                {entourage.reduce((a, c) => a + c.members.length, 0)}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("wishes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "wishes"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Wishes</span>
                  <span className="hidden sm:inline">Guestbook Wishes</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                {wishes.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("images");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "images"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 truncate">
                <Film className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Media</span>
                  <span className="hidden sm:inline">Photos, Videos &amp; Logos</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white shrink-0">
                11
              </span>
            </button>
          </nav>

          {/* Sidebar Footer Actions */}
          <div className="p-4 border-t border-blue-900/60 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Invitation</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================= MAIN CONTENT AREA ======================= */}
      <div className="flex-1 flex flex-col lg:pl-64 xl:pl-72 min-h-screen min-w-0 max-w-full overflow-x-hidden">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-serif-title font-bold text-sm sm:text-base lg:text-lg text-[#1b3b5f] capitalize truncate">
                {activeTab === "dashboard" && "Analytics Overview"}
                {activeTab === "couple" && "Couple Names & Story"}
                {activeTab === "envelope" && "Opening Envelope Texts"}
                {activeTab === "venues" && "Ceremony & Reception Venues"}
                {activeTab === "music" && "Background Music"}
                {activeTab === "footer" && "Footer Verse & Credits"}
                {activeTab === "parties" && "Master Guest List"}
                {activeTab === "rsvps" && "RSVP Responses"}
                {activeTab === "palette" && "Dress Palette Colors"}
                {activeTab === "entourage" && "Entourage Roster"}
                {activeTab === "wishes" && "Guestbook Blessings"}
                {activeTab === "images" && "Photos & Media"}
              </h1>
              <p className="text-[10px] text-slate-400 whitespace-nowrap truncate">
                {coupleInfo.weddingDate} &bull; {coupleInfo.hashtag}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">

            {activeTab === "parties" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => partyFileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition-all whitespace-nowrap cursor-pointer"
                  title="Import guests from Excel or CSV file"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Import Excel/CSV</span>
                  <span className="sm:hidden">Import</span>
                </button>
                {parties.length > 0 && (
                  <button
                    onClick={handleClearAllGuests}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-all whitespace-nowrap"
                    title="Clear demo and reset guest list"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Guest List</span>
                    <span className="sm:hidden">Reset</span>
                  </button>
                )}
                <button
                  onClick={handleOpenAddParty}
                  className="px-3.5 py-2 rounded-xl bg-[#1b3b5f] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Party</span>
                  <span className="sm:hidden">Party</span>
                </button>
              </div>
            )}

            {activeTab === "entourage" && (
              <button
                onClick={() => handleOpenAddEntourage(0)}
                className="px-3.5 py-2 rounded-xl bg-[#1b3b5f] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Entourage Member</span>
                <span className="sm:hidden">Member</span>
              </button>
            )}

            {activeTab === "palette" && (
              <button
                onClick={handleOpenAddColor}
                className="px-3.5 py-2 rounded-xl bg-[#1b3b5f] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Palette Swatch</span>
                <span className="sm:hidden">Color</span>
              </button>
            )}

            {activeTab === "rsvps" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => rsvpFileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition-all whitespace-nowrap cursor-pointer"
                  title="Import RSVPs from Excel or CSV file"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Import Excel/CSV</span>
                  <span className="sm:hidden">Import</span>
                </button>
                <button
                  onClick={exportToCsv}
                  className="px-3.5 py-2 rounded-xl bg-[#7094b7] hover:bg-[#587c9f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}

            {activeTab === "images" && (
              <button
                onClick={handleResetAllImages}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 hover:border-rose-300 shadow-xs transition-all whitespace-nowrap cursor-pointer"
                title="Reset all media assets and logos back to initial defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset All to Defaults</span>
                <span className="sm:hidden">Reset All</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="p-4 sm:p-8 flex-1 min-w-0 max-w-full overflow-x-hidden">
          {/* 1. DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                      Confirmed Attending
                    </p>
                    <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-emerald-700 mt-0.5">
                      {totalHeadcount} <span className="text-xs font-sans font-normal text-slate-500">Seats</span>
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                      Declined
                    </p>
                    <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-700 mt-0.5">
                      {declinedRsvps.length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <XCircle className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                      Invited Parties
                    </p>
                    <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1b3b5f] mt-0.5">
                      {totalInvitedPartiesCount} <span className="text-xs font-sans font-normal text-slate-500">({totalInvitedSeatsCount} Max Seats)</span>
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1b3b5f] flex items-center justify-center font-bold">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                      Venue Capacity
                    </p>
                    <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1b3b5f] mt-0.5">
                      {capacityPercent}% <span className="text-xs font-sans font-normal text-slate-500">/ {targetCapacity}</span>
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Crown className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Quick Jump Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  onClick={() => setActiveTab("couple")}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-[#1b3b5f] cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#1b3b5f]">
                    Couple &amp; Wedding Details
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                    Edit Bride &amp; Groom full names, nicknames, parents, ceremony date &amp; hashtag.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("parties")}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-[#1b3b5f] cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1b3b5f] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#1b3b5f]">
                    Master Guest List
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                    Add invited families, set accompanied member names, and view member attendance.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("entourage")}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-[#1b3b5f] cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Crown className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#1b3b5f]">
                    Wedding Entourage
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                    Edit names of the bridal party, ninongs, ninangs, best man, and bearers.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("rsvps")}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-[#1b3b5f] cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#1b3b5f]">
                    RSVP Responses
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                    Manage table seatings, export CSV spreadsheets, and filter confirmed guests.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 1.5. COUPLE & STORY TAB */}
          {activeTab === "couple" && (
            <div className="space-y-6 w-full">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
                  <div>
                    <h3 className="font-serif-title font-bold text-xl text-[#1b3b5f] flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      <span>Couple Names &amp; Story Details</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Change the names of the couple, parents, official ceremony date, hashtag, and hero scripture quote.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveCoupleInfo} className="space-y-6 text-xs">
                  {/* Groom & Bride Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Groom Section */}
                    <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/80 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-blue-200/50">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1b3b5f]" />
                        <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] uppercase tracking-wider">
                          The Groom
                        </h4>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Groom Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.groomName}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, groomName: e.target.value })
                          }
                          placeholder="e.g. Aian Christopher Ramos"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Displayed in the hero banner subtitle &amp; groom bio card.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Groom Nickname / Display Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.groomNickname}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, groomNickname: e.target.value })
                          }
                          placeholder="e.g. Aian"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Used in primary title &ldquo;Aian &amp; Dang&rdquo;, navigation, and envelope cover.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Parents of the Groom
                        </label>
                        <input
                          type="text"
                          value={coupleInfo.groomParents}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, groomParents: e.target.value })
                          }
                          placeholder="e.g. Mr. Eduardo Ramos & Mrs. Cristina Ramos"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Displayed in the Groom profile card and entourage roster.
                        </span>
                      </div>
                    </div>

                    {/* Bride Section */}
                    <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100/80 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-rose-200/50">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7094b7]" />
                        <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] uppercase tracking-wider">
                          The Bride
                        </h4>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Bride Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.brideName}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, brideName: e.target.value })
                          }
                          placeholder="e.g. Ma. Andrea Santos"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Displayed in the hero banner subtitle &amp; bride bio card.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Bride Nickname / Display Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.brideNickname}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, brideNickname: e.target.value })
                          }
                          placeholder="e.g. Dang"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Used in primary title &ldquo;Aian &amp; Dang&rdquo;, navigation, and envelope cover.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Parents of the Bride
                        </label>
                        <input
                          type="text"
                          value={coupleInfo.brideParents}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, brideParents: e.target.value })
                          }
                          placeholder="e.g. Mr. Antonio Santos & Mrs. Evelyn Santos"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Displayed in the Bride profile card and entourage roster.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wedding Ceremony & Date Settings */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                      <Calendar className="w-4 h-4 text-[#1b3b5f]" />
                      <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] uppercase tracking-wider">
                        Ceremony Schedule, Dates &amp; Hero Section
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Wedding Date Display *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.weddingDate}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, weddingDate: e.target.value })
                          }
                          placeholder="Saturday, December 12, 2026"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Main date shown in hero and banners.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Ceremony Time *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.weddingTime}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, weddingTime: e.target.value })
                          }
                          placeholder="3:00 PM (PHT)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Official start time for the ceremony.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Official Wedding Hashtag *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.hashtag}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, hashtag: e.target.value })
                          }
                          placeholder="#AianGotHisDangGirl"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Social media wedding hashtag.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Hero Badge Location *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.heroLocation}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, heroLocation: e.target.value })
                          }
                          placeholder="Tagaytay, Philippines"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          City / location badge in hero banner.
                        </span>
                      </div>
                    </div>

                    {/* Hero Scripture Quote & Citation */}
                    <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Hero Scripture Verse Quote *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.heroVerse}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, heroVerse: e.target.value })
                          }
                          placeholder="I have found the one whom my soul loves."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Scripture verse displayed under countdown timer.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Hero Verse Citation *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.heroVerseCitation}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, heroVerseCitation: e.target.value })
                          }
                          placeholder="— Song of Solomon 3:4"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Citation source (e.g. — Song of Solomon 3:4).
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Save Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1b3b5f] to-[#2e5782] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center gap-2 border border-amber-200/40 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-amber-200" />
                      <span>Save Couple &amp; Story Details</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DIGITAL OPENING ENVELOPE PRESENTATION TEXTS TAB */}
          {activeTab === "envelope" && (
            <div className="space-y-6 w-full">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
                  <div>
                    <h3 className="font-serif-title font-bold text-xl text-[#1b3b5f] flex items-center gap-2">
                      <Mail className="w-5 h-5 text-amber-600" />
                      <span>Digital Opening Envelope Presentation Texts</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customize the typography headings, date badge, and interactive prompt displayed on the initial envelope presentation card.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveCoupleInfo} className="space-y-6 text-xs">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#fbf9f5] to-amber-50/40 border border-amber-200/80 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-200/60 gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#1b3b5f] flex items-center justify-center shadow-xs">
                          <Mail className="w-4 h-4 text-amber-700" />
                        </div>
                        <div>
                          <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] uppercase tracking-wider">
                            Presentation Typography &amp; Prompts
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Configure the exact phrases that welcome your guests on the cover of the wedding invitation envelope.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/90 border border-amber-200 text-[#1b3b5f] self-start sm:self-auto shadow-2xs">
                        Interactive Envelope Intro
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 1. Envelope Title */}
                      <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-2xs">
                        <label className="block font-bold text-slate-700 mb-1">
                          You&apos;re Invited Heading *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.envelopeTitle}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, envelopeTitle: e.target.value })
                          }
                          placeholder="You're Invited"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          Top calligraphy script title (default: <span className="font-semibold text-slate-600">You&apos;re Invited</span>).
                        </span>
                      </div>

                      {/* 2. Envelope Date */}
                      <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-2xs">
                        <label className="block font-bold text-slate-700 mb-1">
                          Envelope Date Display *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.envelopeDate}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, envelopeDate: e.target.value })
                          }
                          placeholder="12.12.26"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          Uppercase sub-date below title (default: <span className="font-semibold text-slate-600">12.12.26</span>).
                        </span>
                      </div>

                      {/* 3. Button Action Prompt */}
                      <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-2xs">
                        <label className="block font-bold text-slate-700 mb-1">
                          Click Action Prompt *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.envelopeAction}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, envelopeAction: e.target.value })
                          }
                          placeholder="CLICK TO SEE"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium uppercase tracking-wider focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          Uppercase prompt text (default: <span className="font-semibold text-slate-600">CLICK TO SEE</span>).
                        </span>
                      </div>

                      {/* 4. Subtitle Magic */}
                      <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-2xs">
                        <label className="block font-bold text-slate-700 mb-1">
                          The Magic Subtitle *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.envelopeSubtitle}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, envelopeSubtitle: e.target.value })
                          }
                          placeholder="The Magic..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          Calligraphy script below prompt (default: <span className="font-semibold text-slate-600">The Magic...</span>).
                        </span>
                      </div>
                    </div>

                    {/* Live Interactive Envelope Visual Preview */}
                    <div className="p-4 rounded-xl bg-white/80 border border-dashed border-amber-300 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1b3b5f] text-amber-200 flex items-center justify-center shrink-0 shadow-xs">
                          <Mail className="w-5 h-5 text-amber-300" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1b3b5f]">
                            Envelope Live Visual Preview
                          </p>
                          <p className="text-[10px] text-slate-500">
                            This preview reflects how guests see the opening card before starting the invitation video &amp; music.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 px-5 py-3 rounded-2xl bg-[#fbf9f5] border border-amber-200/70 text-center shadow-xs">
                        <div>
                          <p className="font-script text-xl sm:text-2xl text-[#1b3b5f] leading-none">
                            {coupleInfo.envelopeTitle || "You're Invited"}
                          </p>
                          <p className="font-editorial text-[9px] font-semibold text-[#53779d] tracking-widest uppercase mt-1">
                            {coupleInfo.envelopeDate || "12.12.26"}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <div>
                          <p className="font-editorial text-[10px] font-bold text-[#1b3b5f] tracking-widest uppercase">
                            {coupleInfo.envelopeAction || "CLICK TO SEE"}
                          </p>
                          <p className="font-script text-base text-[#53779d] leading-none mt-0.5">
                            {coupleInfo.envelopeSubtitle || "The Magic..."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-600 text-[11px] leading-relaxed flex items-start gap-3">
                      <Mail className="w-4 h-4 text-[#1b3b5f] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#1b3b5f]">Interactive Guest Experience:</span> When a guest arrives on the site, this elegant presentation card is shown. Once they click the prompt, the gold wax seal releases, the invitation envelope video plays smoothly, and the wedding soundtrack begins streaming automatically.
                      </div>
                    </div>
                  </div>

                  {/* Submit Save Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1b3b5f] to-[#2e5782] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center gap-2 border border-amber-200/40 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-amber-200" />
                      <span>Save Envelope Presentation Texts</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* THE CEREMONY VENUE & NAVIGATION LINKS TAB */}
          {activeTab === "venues" && (
            <div className="space-y-6 w-full">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
                  <div>
                    <h3 className="font-serif-title font-bold text-xl text-[#1b3b5f] flex items-center gap-2">
                      <Church className="w-5 h-5 text-sky-600" />
                      <span>The Ceremony Venue &amp; Navigation Links</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure church and reception ballroom names, street addresses, schedules, guest reminders, Google Maps links, and Waze navigation links.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveCoupleInfo} className="space-y-6 text-xs">
                  {/* Ceremony Venue & Navigation */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/40 border border-blue-200/80 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-blue-200/60 gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#1b3b5f] text-white flex items-center justify-center shadow-xs">
                          <Church className="w-4 h-4 text-amber-200" />
                        </div>
                        <div>
                          <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] uppercase tracking-wider">
                            The Ceremony Venue &amp; Navigation Links
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Configure church name, address, reminder notes, Google Maps link, and Waze link.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {coupleInfo.ceremonyMapsUrl && (
                          <a
                            href={coupleInfo.ceremonyMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[#1b3b5f] hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <Navigation className="w-3 h-3 text-amber-600" />
                            <span>Test Maps</span>
                          </a>
                        )}
                        {coupleInfo.ceremonyWazeUrl && (
                          <a
                            href={coupleInfo.ceremonyWazeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[#1b3b5f] hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <ExternalLink className="w-3 h-3 text-[#7094b7]" />
                            <span>Test Waze</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Ceremony Venue Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.ceremonyName}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, ceremonyName: e.target.value })
                          }
                          placeholder="St. Mary's Coastal Cathedral"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Ceremony Subtitle *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.ceremonySubtitle}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, ceremonySubtitle: e.target.value })
                          }
                          placeholder="Holy Matrimony & Sacred Vows Exchange"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Ceremony Time Schedule *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.ceremonySchedule}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, ceremonySchedule: e.target.value })
                          }
                          placeholder="3:00 PM Sharp (Guests to be seated by 2:30 PM)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.ceremonyAddress}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, ceremonyAddress: e.target.value })
                          }
                          placeholder="Seaside Boulevard, Oceanview Promenade"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          City / Province *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.ceremonyCity}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, ceremonyCity: e.target.value })
                          }
                          placeholder="Tagaytay / Metro Coastal"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Google Maps URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={coupleInfo.ceremonyMapsUrl}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, ceremonyMapsUrl: e.target.value })
                          }
                          placeholder="https://maps.google.com/?q=..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Waze Navigation URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={coupleInfo.ceremonyWazeUrl}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, ceremonyWazeUrl: e.target.value })
                          }
                          placeholder="https://waze.com/ul?ll=..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Direct Waze app navigation link for guests.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Guest Reminder Notes
                        </label>
                        <input
                          type="text"
                          value={coupleInfo.ceremonyNotes}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, ceremonyNotes: e.target.value })
                          }
                          placeholder="Please arrive promptly by 2:30 PM..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Shown inside the ceremony card reminder box.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reception Venue & Navigation */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/30 border border-amber-200/80 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-200/60 gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#7094b7] text-white flex items-center justify-center shadow-xs">
                          <Utensils className="w-4 h-4 text-amber-200" />
                        </div>
                        <div>
                          <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] uppercase tracking-wider">
                            The Reception Venue &amp; Navigation Links
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Configure reception ballroom name, address, highlights notes, Google Maps link, and Waze link.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {coupleInfo.receptionMapsUrl && (
                          <a
                            href={coupleInfo.receptionMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-[#1b3b5f] hover:bg-amber-50 transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <Navigation className="w-3 h-3 text-amber-600" />
                            <span>Test Maps</span>
                          </a>
                        )}
                        {coupleInfo.receptionWazeUrl && (
                          <a
                            href={coupleInfo.receptionWazeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-[#1b3b5f] hover:bg-amber-50 transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#7094b7]" />
                            <span>Test Waze</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Reception Venue Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.receptionName}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, receptionName: e.target.value })
                          }
                          placeholder="The Grand Sapphire Pavilion & Ballroom"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Reception Subtitle *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.receptionSubtitle}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, receptionSubtitle: e.target.value })
                          }
                          placeholder="Dinner Banquet, Cocktails & Evening Dancing"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Reception Time Schedule *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.receptionSchedule}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, receptionSchedule: e.target.value })
                          }
                          placeholder="5:30 PM Onwards"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.receptionAddress}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, receptionAddress: e.target.value })
                          }
                          placeholder="Estate Grounds, Royal Garden View"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          City / Province *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.receptionCity}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, receptionCity: e.target.value })
                          }
                          placeholder="Tagaytay / Metro Coastal"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Google Maps URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={coupleInfo.receptionMapsUrl}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, receptionMapsUrl: e.target.value })
                          }
                          placeholder="https://maps.google.com/?q=..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Waze Navigation URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={coupleInfo.receptionWazeUrl}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, receptionWazeUrl: e.target.value })
                          }
                          placeholder="https://waze.com/ul?ll=..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Direct Waze app navigation link for guests.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Reception Highlights / Notes
                        </label>
                        <input
                          type="text"
                          value={coupleInfo.receptionNotes}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, receptionNotes: e.target.value })
                          }
                          placeholder="Cocktails and sunset canapés will be served..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Shown inside the reception card highlights box.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Save Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1b3b5f] to-[#2e5782] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center gap-2 border border-amber-200/40 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-amber-200" />
                      <span>Save Venue &amp; Navigation Details</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MAIN BACKGROUND WEDDING MUSIC TAB */}
          {activeTab === "music" && (
            <div className="space-y-6 w-full">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
                  <div>
                    <h3 className="font-serif-title font-bold text-xl text-[#1b3b5f] flex items-center gap-2">
                      <Music className="w-5 h-5 text-indigo-600" />
                      <span>Background Wedding Music (YouTube Link)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure the official wedding song that plays as background music when guests open the envelope or listen to the floating player.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveCoupleInfo} className="space-y-6 text-xs">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 border border-indigo-200/80 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-200/60 gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-xs">
                          <Music className="w-4 h-4 text-amber-200" />
                        </div>
                        <div>
                          <h4 className="font-serif-title font-bold text-sm text-[#1b3b5f] uppercase tracking-wider">
                            YouTube Soundtrack Configuration
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Change the soundtrack that plays automatically when guests click the envelope or interact with the music pill.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            weddingMusic.setVideo(coupleInfo.bgMusicYoutubeUrl, true);
                            weddingMusic.play();
                          }}
                          className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#1b3b5f] text-white hover:bg-[#132c49] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Test Play Music</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => weddingMusic.pause()}
                          className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Pause className="w-3 h-3" />
                          <span>Pause</span>
                        </button>
                        {coupleInfo.bgMusicYoutubeUrl && (
                          <a
                            href={coupleInfo.bgMusicYoutubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-all flex items-center gap-1 shadow-2xs"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open on YouTube</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          YouTube Music Video Link or ID *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.bgMusicYoutubeUrl}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, bgMusicYoutubeUrl: e.target.value })
                          }
                          placeholder="https://www.youtube.com/watch?v=5e_KM3SuBjE or video ID"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          Paste any YouTube link: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">https://www.youtube.com/watch?v=...</code>, short link <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">https://youtu.be/...</code>, or 11-char ID. Current detected video ID: <span className="font-mono font-bold text-indigo-700">{extractYouTubeId(coupleInfo.bgMusicYoutubeUrl)}</span>
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Song Title Display
                        </label>
                        <input
                          type="text"
                          value={coupleInfo.bgMusicTitle || ""}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, bgMusicTitle: e.target.value })
                          }
                          placeholder="Dear Biyenan"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          Shown in the floating player pill &amp; expanded popup.
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Artist / Performance Credits
                        </label>
                        <input
                          type="text"
                          value={coupleInfo.bgMusicArtist || ""}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, bgMusicArtist: e.target.value })
                          }
                          placeholder="Breezy Boys • JE Beats"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#1b3b5f]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Artist subtitle shown in the player details popup.
                        </span>
                      </div>

                      {/* Embedded YouTube Audio Preview Card */}
                      <div className="p-3 rounded-xl bg-white/80 border border-indigo-200 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <Volume2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {coupleInfo.bgMusicTitle || "Dear Biyenan"}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {coupleInfo.bgMusicArtist || "Wedding Soundtrack"} &bull; ID: {extractYouTubeId(coupleInfo.bgMusicYoutubeUrl)}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-semibold px-2 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700">
                          Active Audio Source
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Save Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1b3b5f] to-[#2e5782] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center gap-2 border border-amber-200/40 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-amber-200" />
                      <span>Save Music Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* FOOTER SCRIPTURE & CLOSING CREDITS TAB */}
          {activeTab === "footer" && (
            <div className="space-y-6 w-full">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
                  <div>
                    <h3 className="font-serif-title font-bold text-xl text-[#1b3b5f] flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      <span>Footer Scripture &amp; Closing Credits</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customize the scripture verse, biblical citation, and bottom credits line shown at the base of the wedding invitation website.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveCoupleInfo} className="space-y-6 text-xs">
                  {/* Footer Scripture & Credits Customization */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0e1d2f]/95 to-[#1b3b5f] text-white border border-blue-900/80 shadow-md space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-200 flex items-center justify-center border border-amber-300/30 shadow-xs">
                          <BookOpen className="w-4 h-4 text-amber-300" />
                        </div>
                        <div>
                          <h4 className="font-serif-title font-bold text-sm text-white uppercase tracking-wider">
                            Footer Scripture &amp; Closing Credits
                          </h4>
                          <p className="text-[11px] text-blue-200">
                            Customize the 1 Corinthians Bible scripture and bottom footer credit line.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-amber-200 self-start sm:self-auto">
                        Invitation Footer
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-900">
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-white text-xs mb-1">
                          Footer Scripture Verse *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={coupleInfo.footerVerse}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, footerVerse: e.target.value })
                          }
                          placeholder="Love is patient, love is kind. It does not envy, it does not boast..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white font-medium focus:outline-none focus:border-amber-300 text-xs text-slate-900"
                        />
                        <span className="text-[10px] text-blue-200/80 mt-1 block">
                          Main reflective scripture displayed above the bottom copyright bar.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-white text-xs mb-1">
                          Scripture Citation *
                        </label>
                        <input
                          type="text"
                          required
                          value={coupleInfo.footerVerseCitation}
                          onChange={(e) =>
                            setCoupleInfo({ ...coupleInfo, footerVerseCitation: e.target.value })
                          }
                          placeholder="— 1 Corinthians 13:4-8"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white font-medium focus:outline-none focus:border-amber-300 text-xs text-slate-900"
                        />
                        <span className="text-[10px] text-blue-200/80 mt-1 block">
                          Citation source (e.g. — 1 Corinthians 13:4-8).
                        </span>
                      </div>
                    </div>

                    <div className="text-slate-900">
                      <label className="block font-bold text-white text-xs mb-1">
                        Custom Footer Credit Line (Optional)
                      </label>
                      <input
                        type="text"
                        value={coupleInfo.footerCredit}
                        onChange={(e) =>
                          setCoupleInfo({ ...coupleInfo, footerCredit: e.target.value })
                        }
                        placeholder="Leave blank to use default: Made with ❤️ for {couple} • 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white font-medium focus:outline-none focus:border-amber-300 text-xs text-slate-900"
                      />
                      <span className="text-[10px] text-blue-200/80 mt-1 block">
                        If left blank, automatically displays &ldquo;Made with ❤️ for {coupleInfo.groomNickname || coupleInfo.groomName} &amp; {coupleInfo.brideNickname || coupleInfo.brideName} &bull; 2026&rdquo;.
                      </span>
                    </div>

                    {/* Footer Live Preview */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
                      <p className="font-serif-title italic text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                        &ldquo;{coupleInfo.footerVerse || "Love is patient, love is kind..."}&rdquo;
                        <span className="block not-italic text-[10px] uppercase tracking-widest text-amber-200/90 mt-1">
                          {coupleInfo.footerVerseCitation || "— 1 Corinthians 13:4-8"}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 pt-2 border-t border-white/10">
                        {coupleInfo.footerCredit || `Made with ❤️ for ${coupleInfo.groomNickname || coupleInfo.groomName} & ${coupleInfo.brideNickname || coupleInfo.brideName} • 2026`}
                      </p>
                    </div>
                  </div>

                  {/* Submit Save Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1b3b5f] to-[#2e5782] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center gap-2 border border-amber-200/40 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-amber-200" />
                      <span>Save Footer Details</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 2. PARTIES TAB */}
          {activeTab === "parties" && (
            <div className="space-y-6 min-w-0 max-w-full">
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs min-w-0 max-w-full">
                {parties.length === 0 ? (
                  <div className="text-center py-14 px-4">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#1b3b5f] flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
                      <UserCheck className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif-title font-bold text-lg sm:text-xl text-[#1b3b5f]">
                      Guest List is Empty
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
                      Start adding your invited wedding guests, families, and VIP tables, or import them directly via Excel / CSV.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => partyFileInputRef.current?.click()}
                        className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Import Guests via Excel / CSV</span>
                      </button>
                      <button
                        onClick={handleDownloadPartyTemplate}
                        className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-2 border border-slate-300 shadow-2xs transition-all cursor-pointer"
                      >
                        <FileDown className="w-4 h-4 text-slate-500" />
                        <span>Download CSV Template</span>
                      </button>
                      <button
                        onClick={handleOpenAddParty}
                        className="px-5 py-3 rounded-2xl bg-[#1b3b5f] hover:bg-blue-900 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Guest / Household Party</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search party name or guest..."
                          value={partySearch}
                          onChange={(e) => setPartySearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => partyFileInputRef.current?.click()}
                          className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition-all cursor-pointer"
                          title="Import guests from Excel or CSV file"
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Import Excel/CSV</span>
                        </button>
                        <button
                          onClick={handleDownloadPartyTemplate}
                          className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                          title="Download CSV sample template"
                        >
                          <FileDown className="w-3.5 h-3.5 text-slate-500" />
                          <span>Template</span>
                        </button>
                        <button
                          onClick={() =>
                            exportPartiesToCsv(
                              filteredParties,
                              `Aian_Dang_All_Parties_${Date.now()}.csv`
                            )
                          }
                          className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center gap-1.5 border border-blue-200 transition-all cursor-pointer"
                          title="Export all visible parties to CSV"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                          <span>Export CSV</span>
                        </button>
                        <button
                          onClick={handleClearAllGuests}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-medium hover:underline ml-1 cursor-pointer"
                        >
                          Clear All Data
                        </button>
                      </div>
                    </div>

                    {/* Bulk Action Toolbar for Parties */}
                    {selectedPartyIds.length > 0 && (
                      <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 mb-3 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                          <span className="text-xs font-bold text-[#1b3b5f]">
                            {selectedPartyIds.length} of {parties.length} parties selected
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPartyIds([])}
                            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                          >
                            Deselect All
                          </button>
                          <button
                            onClick={handleExportSelectedParties}
                            className="text-xs text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-600" />
                            <span>Export Selected ({selectedPartyIds.length})</span>
                          </button>
                          <button
                            onClick={handleDeleteSelectedParties}
                            className="text-xs text-rose-700 bg-rose-100 hover:bg-rose-200 border border-rose-300 font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Delete Selected ({selectedPartyIds.length})</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mobile scroll swipe helper hint */}
                    <div className="sm:hidden flex items-center justify-between text-[11px] text-blue-700 bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-100 mb-3 font-medium">
                      <span>&larr; Swipe horizontally to view all columns &rarr;</span>
                    </div>

                    <div className="overflow-x-auto w-full max-w-full touch-pan-x pb-2">
                      <table className="w-full text-left text-xs whitespace-nowrap min-w-[1100px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <th className="p-3.5 w-12 text-center">
                              <input
                                type="checkbox"
                                checked={isAllPartiesSelected}
                                ref={(el) => {
                                  if (el) el.indeterminate = isSomePartiesSelected;
                                }}
                                onChange={handleToggleSelectAllParties}
                                className="w-4 h-4 rounded border-slate-300 text-[#1b3b5f] focus:ring-[#1b3b5f] cursor-pointer"
                                title={isAllPartiesSelected ? "Deselect all" : "Select all"}
                              />
                            </th>
                            <th className="p-3.5 whitespace-nowrap min-w-[280px]">Party / Primary Guest</th>
                            <th className="p-3.5 whitespace-nowrap min-w-[180px]">Table Assignment</th>
                            <th className="p-3.5 whitespace-nowrap min-w-[340px]">Invited Members &amp; Status</th>
                            <th className="p-3.5 whitespace-nowrap min-w-[220px]">Contact</th>
                            <th className="p-3.5 text-right whitespace-nowrap min-w-[100px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredParties.map((party) => (
                            <tr
                              key={party.id}
                              className={`transition-colors ${
                                selectedPartyIds.includes(party.id)
                                  ? "bg-blue-50/50 hover:bg-blue-50/80"
                                  : "hover:bg-slate-50/60"
                              }`}
                            >
                              <td className="p-3.5 w-12 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedPartyIds.includes(party.id)}
                                  onChange={() => handleToggleSelectParty(party.id)}
                                  className="w-4 h-4 rounded border-slate-300 text-[#1b3b5f] focus:ring-[#1b3b5f] cursor-pointer"
                                />
                              </td>
                              <td className="p-3.5 whitespace-nowrap min-w-[280px]">
                                <p className="font-serif-title font-bold text-sm text-[#1b3b5f] whitespace-nowrap">
                                  {party.partyName}
                                </p>
                                <p className="text-[11px] text-slate-500 whitespace-nowrap mt-0.5">
                                  Primary: <span className="font-semibold text-slate-700">{party.primaryGuest}</span> ({party.members.length} Max Seats)
                                </p>
                              </td>
                              <td className="p-3.5 whitespace-nowrap min-w-[180px]">
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-[10px] font-semibold border border-blue-100 whitespace-nowrap inline-flex items-center shrink-0">
                                  {party.tableNumber || "Unassigned"}
                                </span>
                              </td>
                              <td className="p-3.5 whitespace-nowrap min-w-[340px]">
                                <div className="flex items-center gap-1.5 whitespace-nowrap flex-nowrap">
                                  {party.members.map((m) => (
                                    <span
                                      key={m.id}
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap shrink-0 inline-flex items-center ${
                                        m.isAttending
                                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                          : "bg-slate-100 text-slate-600 border border-slate-200"
                                      }`}
                                    >
                                      {m.name} ({m.isAttending ? "Present" : "Absent"})
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3.5 text-slate-500 text-[11px] whitespace-nowrap min-w-[220px]">
                                <div className="space-y-0.5 whitespace-nowrap">
                                  {party.phone && <p className="whitespace-nowrap font-mono text-slate-700">{party.phone}</p>}
                                  {party.email && <p className="text-slate-400 whitespace-nowrap">{party.email}</p>}
                                </div>
                              </td>
                              <td className="p-3.5 text-right space-x-2 whitespace-nowrap min-w-[100px]">
                                <button
                                  onClick={() => handleOpenEditParty(party)}
                                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors inline-flex cursor-pointer"
                                  title="Edit Party"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteParty(party.id, party.partyName)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors inline-flex cursor-pointer"
                                  title="Delete Party"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 3. PALETTE TAB */}
          {activeTab === "palette" && (
            <div className="space-y-6 min-w-0 max-w-full">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs min-w-0 max-w-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                      Live Color Palette Swatches
                    </h3>
                    <p className="text-xs text-slate-500">
                      These swatches are rendered live across the wedding website.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddColor}
                    className="px-3 py-1.5 rounded-xl bg-[#1b3b5f] text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Color</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {colors.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between group hover:border-blue-300 transition-all bg-white"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-12 h-12 rounded-2xl shadow-inner border-2 border-white shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div>
                          <p className="font-serif-title font-bold text-sm text-[#1b3b5f]">
                            {c.name}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400 uppercase">
                            {c.hex}
                          </p>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5">
                            {c.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditColor(c)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteColor(c.id, c.name)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. RSVPS TAB */}
          {activeTab === "rsvps" && (
            <div className="space-y-6 min-w-0 max-w-full">
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs min-w-0 max-w-full">
                {rsvps.length === 0 ? (
                  <div className="text-center py-14 px-4">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif-title font-bold text-lg sm:text-xl text-[#1b3b5f]">
                      No RSVP Submissions Yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-5 leading-relaxed">
                      As your guests submit their RSVPs on the website or via spreadsheet import, their confirmations, accompanied members, and table seatings will automatically appear here.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => rsvpFileInputRef.current?.click()}
                        className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Import RSVPs via Excel / CSV</span>
                      </button>
                      <button
                        onClick={handleDownloadRsvpTemplate}
                        className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-2 border border-slate-300 shadow-2xs transition-all cursor-pointer"
                      >
                        <FileDown className="w-4 h-4 text-slate-500" />
                        <span>Download CSV Template</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search guest or companion..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1b3b5f]"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 focus:outline-none bg-white cursor-pointer"
                        >
                          <option value="all">All Status</option>
                          <option value="attending">Attending Only</option>
                          <option value="declined">Declined Only</option>
                        </select>

                        <button
                          onClick={() => rsvpFileInputRef.current?.click()}
                          className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition-all cursor-pointer"
                          title="Import RSVPs from Excel or CSV file"
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Import Excel/CSV</span>
                        </button>

                        <button
                          onClick={handleDownloadRsvpTemplate}
                          className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                          title="Download CSV sample template"
                        >
                          <FileDown className="w-3.5 h-3.5 text-slate-500" />
                          <span>Template</span>
                        </button>

                        <button
                          onClick={exportToCsv}
                          className="px-3 py-2 rounded-xl bg-[#7094b7] hover:bg-[#587c9f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Bulk Action Toolbar for RSVPs */}
                    {selectedRsvpIds.length > 0 && (
                      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 mb-3 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span className="text-xs font-bold text-[#1b3b5f]">
                            {selectedRsvpIds.length} of {rsvps.length} RSVP submissions selected
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setSelectedRsvpIds([])}
                            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                          >
                            Deselect All
                          </button>
                          <button
                            onClick={() => handleBulkMarkRsvpStatus("attending")}
                            className="text-xs text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-100/60 font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mark Attending</span>
                          </button>
                          <button
                            onClick={() => handleBulkMarkRsvpStatus("declined")}
                            className="text-xs text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span>Mark Declined</span>
                          </button>
                          <button
                            onClick={handleExportSelectedRsvps}
                            className="text-xs text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-600" />
                            <span>Export Selected ({selectedRsvpIds.length})</span>
                          </button>
                          <button
                            onClick={handleDeleteSelectedRsvps}
                            className="text-xs text-rose-700 bg-rose-100 hover:bg-rose-200 border border-rose-300 font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Delete Selected ({selectedRsvpIds.length})</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mobile scroll swipe helper hint */}
                    <div className="sm:hidden flex items-center justify-between text-[11px] text-blue-700 bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-100 mb-3 font-medium">
                      <span>&larr; Swipe horizontally to view all columns &rarr;</span>
                    </div>

                    <div className="overflow-x-auto w-full max-w-full touch-pan-x pb-2">
                      <table className="w-full text-left text-xs whitespace-nowrap min-w-[1100px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <th className="p-3.5 w-12 text-center">
                              <input
                                type="checkbox"
                                checked={isAllRsvpsSelected}
                                ref={(el) => {
                                  if (el) el.indeterminate = isSomeRsvpsSelected;
                                }}
                                onChange={handleToggleSelectAllRsvps}
                                className="w-4 h-4 rounded border-slate-300 text-[#1b3b5f] focus:ring-[#1b3b5f] cursor-pointer"
                                title={isAllRsvpsSelected ? "Deselect all" : "Select all"}
                              />
                            </th>
                            <th className="p-3.5 whitespace-nowrap min-w-[240px]">Guest Name</th>
                            <th className="p-3.5 whitespace-nowrap min-w-[130px]">Status</th>
                            <th className="p-3.5 whitespace-nowrap min-w-[80px]">Seats</th>
                            <th className="p-3.5 whitespace-nowrap min-w-[340px]">Member Breakdown</th>
                            <th className="p-3.5 whitespace-nowrap min-w-[160px]">Table</th>
                            <th className="p-3.5 whitespace-nowrap min-w-[220px]">Contact</th>
                            <th className="p-3.5 text-right whitespace-nowrap min-w-[100px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedRsvps.map((rsvp) => (
                            <tr
                              key={rsvp.id}
                              className={`transition-colors ${
                                selectedRsvpIds.includes(rsvp.id)
                                  ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                                  : "hover:bg-slate-50/60"
                              }`}
                            >
                              <td className="p-3.5 w-12 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedRsvpIds.includes(rsvp.id)}
                                  onChange={() => handleToggleSelectRsvp(rsvp.id)}
                                  className="w-4 h-4 rounded border-slate-300 text-[#1b3b5f] focus:ring-[#1b3b5f] cursor-pointer"
                                />
                              </td>
                              <td className="p-3.5 whitespace-nowrap min-w-[240px]">
                                <p className="font-serif-title font-bold text-sm text-[#1b3b5f] whitespace-nowrap">
                                  {rsvp.fullName}
                                </p>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap">{rsvp.submittedAt}</span>
                              </td>
                              <td className="p-3.5 whitespace-nowrap min-w-[130px]">
                                <button
                                  onClick={() => handleToggleStatus(rsvp.id, rsvp.status)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap inline-flex items-center cursor-pointer ${
                                    rsvp.status === "attending"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {rsvp.status === "attending" ? "Confirmed" : "Declined"}
                                </button>
                              </td>
                              <td className="p-3.5 font-bold text-slate-700 whitespace-nowrap min-w-[80px]">
                                {rsvp.guestCount || 1}
                              </td>
                              <td className="p-3.5 whitespace-nowrap min-w-[340px]">
                                {rsvp.memberBreakdown && rsvp.memberBreakdown.length > 0 ? (
                                  <div className="flex items-center gap-1 whitespace-nowrap flex-nowrap">
                                    {rsvp.memberBreakdown.map((m, idx) => (
                                      <span
                                        key={idx}
                                        className={`px-2 py-0.5 rounded-full text-[9px] font-medium whitespace-nowrap shrink-0 inline-flex items-center ${
                                          m.isAttending
                                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                            : "bg-slate-100 text-slate-600 border border-slate-200"
                                        }`}
                                      >
                                        {m.name} ({m.isAttending ? "Present" : "Absent"})
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-[11px] whitespace-nowrap">—</span>
                                )}
                              </td>
                              <td className="p-3.5 whitespace-nowrap min-w-[160px]">
                                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 text-[10px] font-semibold border border-blue-100 whitespace-nowrap inline-block">
                                  {rsvp.tableNumber || "Unassigned"}
                                </span>
                              </td>
                              <td className="p-3.5 text-[11px] text-slate-500 whitespace-nowrap min-w-[220px]">
                                <div className="space-y-0.5 whitespace-nowrap">
                                  {rsvp.phone && <p className="whitespace-nowrap font-mono text-slate-700">{rsvp.phone}</p>}
                                  {rsvp.email && <p className="text-slate-400 whitespace-nowrap">{rsvp.email}</p>}
                                </div>
                              </td>
                              <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap min-w-[100px]">
                                <button
                                  onClick={() => handleDeleteRsvp(rsvp.id, rsvp.fullName)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors inline-flex cursor-pointer"
                                  title="Delete RSVP"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* RSVP Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                        <span className="text-slate-500">
                          Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({sortedRsvps.length} entries)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Previous</span>
                          </button>
                          <button
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* 5. ENTOURAGE TAB */}
          {activeTab === "entourage" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                    Wedding Entourage &amp; Bridal Party
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize and update the names and roles of all entourage members across each ceremony category.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAddEntourage(0)}
                  className="px-4 py-2.5 rounded-2xl bg-[#1b3b5f] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Entourage Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entourage.map((cat, catIdx) => (
                  <div
                    key={cat.id || catIdx}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div>
                          <h4 className="font-serif-title font-bold text-base text-[#1b3b5f]">
                            {cat.category}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {cat.members.length} {cat.members.length === 1 ? "Member" : "Members"}
                          </span>
                        </div>
                        <button
                          onClick={() => handleOpenAddEntourage(catIdx)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1b3b5f] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Member</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {cat.members.map((m) => (
                          <div
                            key={m.id}
                            className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                          >
                            <div>
                              <div className="space-y-0.5">
                                {m.name.split("&").map((singleName, sIdx) => (
                                  <p key={sIdx} className="font-bold text-slate-800">
                                    {singleName.trim()}
                                  </p>
                                ))}
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">
                                {m.role}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditEntourage(catIdx, m)}
                                className="p-1.5 text-blue-600 hover:bg-blue-100/60 rounded-lg transition-colors cursor-pointer"
                                title="Edit Entourage Member"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEntourageMember(catIdx, m.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-100/60 rounded-lg transition-colors cursor-pointer"
                                title="Remove Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {cat.members.length === 0 && (
                          <div className="text-center py-6 text-slate-400 text-xs">
                            <p>No members in this category yet.</p>
                            <button
                              onClick={() => handleOpenAddEntourage(catIdx)}
                              className="mt-1 text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer"
                            >
                              Add first member
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. WISHES TAB */}
          {activeTab === "wishes" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                    Guestbook Wishes Wall ({wishes.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Read and moderate warm blessings submitted by wedding guests.
                  </p>
                </div>
              </div>
              {wishes.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No wishes posted yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishes.map((w) => (
                    <div key={w.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-[#1b3b5f]">
                            {w.name} <span className="text-[11px] font-normal text-slate-500">({w.relationship})</span>
                          </p>
                          <button
                            onClick={async () => {
                              const confirmed = await swalAlert.confirmDelete({
                                title: "Delete Blessing Message?",
                                text: `Are you sure you want to delete the message from "${w.name}"?`,
                                confirmButtonText: "Yes, Delete Message",
                                cancelButtonText: "Cancel",
                              });
                              if (confirmed) {
                                const updated = wishes.filter((item) => item.id !== w.id);
                                setWishes(updated);
                                if (typeof window !== "undefined") {
                                  localStorage.setItem("aian_dang_wedding_guestbook", JSON.stringify(updated));
                                }
                                swalAlert.toastSuccess("Message Deleted", `Blessing from "${w.name}" was removed.`);
                              }
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete this message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="italic text-slate-600 my-2">&ldquo;{w.message}&rdquo;</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{w.date}</span>
                        <span>{w.likes || 1} ❤️</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7. IMAGES & LOGOS MANAGEMENT TAB */}
          {activeTab === "images" && (
            <div className="space-y-6">
              {/* Success Notification Banner */}
              {imageSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{imageSuccessMsg}</span>
                  </div>
                  <button
                    onClick={() => setImageSuccessMsg("")}
                    className="text-emerald-600 hover:text-emerald-900 cursor-pointer p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Header Overview Card */}
              <div className="bg-gradient-to-r from-[#1b3b5f] to-[#2a4e75] text-white p-6 sm:p-7 rounded-3xl shadow-sm border border-blue-900/40 relative overflow-hidden">
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-[11px] font-semibold uppercase tracking-wider mb-2.5 border border-amber-300/30">
                    <Film className="w-3.5 h-3.5" />
                    <span>Full Site Media &amp; Video Customizer</span>
                  </div>
                  <h2 className="font-serif-title text-xl sm:text-2xl font-bold tracking-wide">
                    Change Website Photos, Videos, Lookbooks &amp; Logos
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-blue-100 font-light leading-relaxed">
                    Upload new cinematography, couple photography, wedding monogram crests, lookbook dress styles, and venue imagery.
                    Changes are saved automatically and broadcast live across the invitation in real time.
                  </p>
                </div>
              </div>

              {/* Background Music Card in Media Tab */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-[#1b3b5f] to-[#244b77] text-white border border-indigo-400/30 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-200 flex items-center justify-center border border-amber-300/30 shadow-xs">
                      <Music className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-serif-title font-bold text-base text-white tracking-wide">
                        Official Background Music Soundtrack (YouTube Link)
                      </h4>
                      <p className="text-xs text-blue-200">
                        Plays automatically when guests click &ldquo;CLICK TO SEE / The Magic...&rdquo; or start the floating music player.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        weddingMusic.setVideo(coupleInfo.bgMusicYoutubeUrl, true);
                        weddingMusic.play();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Test Play</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => weddingMusic.pause()}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                    {coupleInfo.bgMusicYoutubeUrl && (
                      <a
                        href={coupleInfo.bgMusicYoutubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Watch on YouTube</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-xs text-blue-200 mb-1">
                      YouTube Link or Video ID
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={coupleInfo.bgMusicYoutubeUrl}
                        onChange={(e) =>
                          setCoupleInfo({ ...coupleInfo, bgMusicYoutubeUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=5e_KM3SuBjE"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-white/20 bg-slate-900/60 font-mono text-xs text-white focus:outline-none focus:border-amber-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          weddingStore.saveCoupleInfo(coupleInfo);
                          weddingMusic.setVideo(coupleInfo.bgMusicYoutubeUrl);
                          setImageSuccessMsg("YouTube music soundtrack updated and saved live!");
                          setTimeout(() => setImageSuccessMsg(""), 4000);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Music</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-blue-200/80 mt-1.5 block">
                      Detected YouTube Video ID: <span className="font-mono font-bold text-amber-300">{extractYouTubeId(coupleInfo.bgMusicYoutubeUrl)}</span>
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-blue-200 mb-1">
                      Song Title Display
                    </label>
                    <input
                      type="text"
                      value={coupleInfo.bgMusicTitle || ""}
                      onChange={(e) =>
                        setCoupleInfo({ ...coupleInfo, bgMusicTitle: e.target.value })
                      }
                      placeholder="Dear Biyenan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-slate-900/60 text-xs text-white focus:outline-none focus:border-amber-300"
                    />
                    <span className="text-[10px] text-blue-200/80 mt-1.5 block">
                      Title shown in now playing widget.
                    </span>
                  </div>
                </div>
              </div>

              {/* 11 Media Items Grid (Images, Videos & Logos) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    key: "heroVideo" as const,
                    title: "Hero Background Looping Video",
                    category: "Cinematic Video",
                    desc: "Cinematic atmospheric background video that auto-plays on the main Hero section.",
                    recommended: "MP4 or WebM, 1080p, compressed (under 25MB recommended)",
                    aspect: "aspect-video max-h-56",
                    contain: false,
                    isVideo: true,
                  },
                  {
                    key: "invitationVideo" as const,
                    title: "Opening Envelope Invitation Video",
                    category: "Envelope Video",
                    desc: "Video displayed and looping inside the interactive opening envelope cover before guests unlock it.",
                    recommended: "MP4 or WebM, 1080p (under 30MB recommended)",
                    aspect: "aspect-video max-h-56",
                    contain: false,
                    isVideo: true,
                  },
                  {
                    key: "logo" as const,
                    title: "Official Monogram Crest & Logo",
                    category: "Global Branding",
                    desc: "Featured on navigation bar, wax seal envelope, footer, and section headers.",
                    recommended: "PNG Transparent (or SVG), recommended 500 × 500 px",
                    aspect: "aspect-square max-h-56",
                    contain: true,
                    isVideo: false,
                  },
                  {
                    key: "envelopeCover" as const,
                    title: "Envelope Poster / Fallback Cover",
                    category: "Envelope Poster",
                    desc: "Displayed as the pre-play poster or fallback cover behind the opening envelope video.",
                    recommended: "JPG or PNG, recommended 1200 × 900 px",
                    aspect: "aspect-[4/3] max-h-56",
                    contain: false,
                    isVideo: false,
                  },
                  {
                    key: "heroPoster" as const,
                    title: "Hero Background Poster / Photo",
                    category: "Hero Banner",
                    desc: "Primary couple portrait used as video pre-load poster and mobile banner.",
                    recommended: "JPG or PNG, recommended 1920 × 1080 px",
                    aspect: "aspect-video max-h-56",
                    contain: false,
                    isVideo: false,
                  },
                  {
                    key: "ceremonyVenue" as const,
                    title: "Ceremony Church / Chapel Photo",
                    category: "Wedding Details",
                    desc: "Featured in the 'Where & When' section on the Ceremony card.",
                    recommended: "JPG or PNG, recommended 1200 × 800 px",
                    aspect: "aspect-video max-h-56",
                    contain: false,
                    isVideo: false,
                  },
                  {
                    key: "receptionVenue" as const,
                    title: "Reception Ballroom Photo",
                    category: "Wedding Details",
                    desc: "Featured in the 'Where & When' section on the Reception card.",
                    recommended: "JPG or PNG, recommended 1200 × 800 px",
                    aspect: "aspect-video max-h-56",
                    contain: false,
                    isVideo: false,
                  },
                  {
                    key: "ladiesAttire" as const,
                    title: "Ladies' Dress Code Inspiration",
                    category: "Attire Lookbook",
                    desc: "Sample dress style photo displayed in the Dress Code section for ladies.",
                    recommended: "JPG or PNG, recommended 800 × 1060 px (portrait)",
                    aspect: "aspect-[3/4] max-h-64",
                    contain: false,
                    isVideo: false,
                  },
                  {
                    key: "menAttire" as const,
                    title: "Gentlemen's Attire & Barong Lookbook",
                    category: "Attire Lookbook",
                    desc: "Sample formal suit/barong photo displayed in the Dress Code section for gentlemen.",
                    recommended: "JPG or PNG, recommended 800 × 1060 px (portrait)",
                    aspect: "aspect-[3/4] max-h-64",
                    contain: false,
                    isVideo: false,
                  },
                  {
                    key: "floralDivider" as const,
                    title: "Dusty Blue Floral Divider Garland",
                    category: "Floral Accents",
                    desc: "Decorative floral divider garland placed above major section titles.",
                    recommended: "PNG Transparent or JPG, recommended 600 × 200 px",
                    aspect: "aspect-[3/1] max-h-48",
                    contain: true,
                    isVideo: false,
                  },
                  {
                    key: "floralCorner" as const,
                    title: "Floral Botanical Corner Watermark",
                    category: "Floral Accents",
                    desc: "Corner botanical bouquets positioned in page background corners.",
                    recommended: "PNG Transparent or JPG, recommended 600 × 600 px",
                    aspect: "aspect-square max-h-56",
                    contain: true,
                    isVideo: false,
                  },
                ].map((item) => {
                  const currentValue = siteImages[item.key];
                  const isUploading = isUploadingImage === item.key;
                  const inputId = `file-input-${item.key}`;

                  return (
                    <div
                      key={item.key}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                    >
                      {/* Card Header */}
                      <div className="p-5 pb-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              item.isVideo
                                ? "bg-purple-50 text-purple-800 border-purple-200"
                                : "bg-blue-50 text-[#1b3b5f] border-blue-100"
                            }`}
                          >
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.key}
                          </span>
                        </div>
                        <h3 className="font-serif-title font-bold text-slate-800 text-sm leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      {/* Media / Video Preview Container */}
                      <div className="px-5 py-2 flex-1 flex flex-col justify-center">
                        <div
                          className={`relative w-full ${item.aspect} rounded-2xl overflow-hidden border border-slate-200 ${
                            item.contain
                              ? "bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 p-3 flex items-center justify-center"
                              : "bg-slate-900 flex items-center justify-center"
                          }`}
                        >
                          {item.isVideo ? (
                            currentValue ? (
                              <video
                                key={currentValue}
                                src={currentValue}
                                controls
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                                <Video className="w-6 h-6 opacity-40" />
                                <span>No video set</span>
                              </div>
                            )
                          ) : currentValue ? (
                            <img
                              src={currentValue}
                              alt={item.title}
                              className={`w-full h-full ${
                                item.contain ? "object-contain" : "object-cover"
                              } transition-transform duration-300 hover:scale-105`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              No image set
                            </div>
                          )}

                          {isUploading && (
                            <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-2xs flex flex-col items-center justify-center text-white text-xs gap-2 z-10">
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span className="font-medium">
                                Uploading {item.isVideo ? "Video" : "Media"}...
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 mt-2 truncate">
                          <span className="font-semibold text-slate-500">Spec:</span> {item.recommended}
                        </p>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-4 pt-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                        <input
                          id={inputId}
                          type="file"
                          accept={
                            item.isVideo
                              ? "video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                              : "image/*"
                          }
                          className="hidden"
                          onChange={(e) => handleMediaFileSelect(item.key, e)}
                        />

                        <label
                          htmlFor={inputId}
                          className={`flex-1 py-2 px-3 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-center ${
                            item.isVideo
                              ? "bg-purple-900 hover:bg-purple-950"
                              : "bg-[#1b3b5f] hover:bg-blue-900"
                          }`}
                        >
                          {item.isVideo ? (
                            <Video className="w-3.5 h-3.5 text-amber-200" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5 text-amber-200" />
                          )}
                          <span>
                            Change{" "}
                            {item.isVideo
                              ? "Video"
                              : item.key === "logo"
                              ? "Logo"
                              : "Photo"}
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleResetImage(item.key)}
                          className="py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-medium border border-slate-200 hover:border-rose-200 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Reset to default media"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Reset</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================= MODALS ======================= */}
      {/* 1. Add/Edit Party Modal */}
      {isAddPartyOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                {editingParty ? "Edit Invited Party" : "Add New Household Party"}
              </h3>
              <button
                onClick={() => setIsAddPartyOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParty} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Party / Household Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hon. Roberto Gomez & Dra. Maria Teresa Gomez"
                  value={partyFormName}
                  onChange={(e) => setPartyFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b3b5f]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Primary Guest Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roberto Gomez"
                  value={partyFormPrimary}
                  onChange={(e) => setPartyFormPrimary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b3b5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={partyFormEmail}
                    onChange={(e) => setPartyFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b3b5f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+63 917 123 4567"
                    value={partyFormPhone}
                    onChange={(e) => setPartyFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b3b5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Table Number</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Table 1"
                  value={partyFormTable}
                  onChange={(e) => setPartyFormTable(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b3b5f]"
                />
              </div>

              {/* Accompanying Members List */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700">
                    Invited Members in this Party ({partyFormMembers.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMemberToPartyForm}
                    className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {partyFormMembers.map((m, idx) => (
                    <div key={m.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder={`Member ${idx + 1} Name`}
                        value={m.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPartyFormMembers(
                            partyFormMembers.map((item) =>
                              item.id === m.id ? { ...item, name: val } : item
                            )
                          );
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Role / Relation"
                        value={m.role}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPartyFormMembers(
                            partyFormMembers.map((item) =>
                              item.id === m.id ? { ...item, role: val } : item
                            )
                          );
                        }}
                        className="w-32 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      />
                      {partyFormMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMemberFromPartyForm(m.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPartyOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1b3b5f] text-white font-bold hover:bg-blue-900"
                >
                  Save Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add/Edit Color Modal */}
      {isAddColorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                {editingColor ? "Edit Color Swatch" : "Add New Palette Color"}
              </h3>
              <button
                onClick={() => setIsAddColorOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveColor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Color Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cerulean Blue"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b3b5f]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">HEX Code *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    required
                    placeholder="#7B9EBD"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-[#1b3b5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description / Guest Role Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. For Bridesmaids & Accent Details"
                  value={newColorDesc}
                  onChange={(e) => setNewColorDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b3b5f]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddColorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1b3b5f] text-white font-bold hover:bg-blue-900"
                >
                  Save Swatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add/Edit Entourage Member Modal */}
      {isEntourageModalOpen && editingEntourageMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                {editingEntourageMember.memberId
                  ? "Edit Entourage Member"
                  : "Add Entourage Member"}
              </h3>
              <button
                onClick={() => setIsEntourageModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntourageMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  disabled={editingEntourageMember.memberId !== null}
                  value={editingEntourageMember.categoryIndex}
                  onChange={(e) =>
                    setEditingEntourageMember({
                      ...editingEntourageMember,
                      categoryIndex: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1b3b5f]"
                >
                  {entourage.map((c, idx) => (
                    <option key={c.id || idx} value={idx}>
                      {c.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Role / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best Man, Principal Sponsor, Bridesmaid, Ring Bearer"
                  value={editingEntourageMember.role}
                  onChange={(e) =>
                    setEditingEntourageMember({
                      ...editingEntourageMember,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b3b5f]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Member Name(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Christian Paul Ramos (or use & for couples)"
                  value={editingEntourageMember.name}
                  onChange={(e) =>
                    setEditingEntourageMember({
                      ...editingEntourageMember,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b3b5f]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Tip: If pair or couple (e.g. Ninong &amp; Ninang), separate names with &amp; to display on separate lines.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEntourageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1b3b5f] text-white font-bold hover:bg-blue-900"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden File Inputs for Excel / CSV Import */}
      <input
        type="file"
        ref={partyFileInputRef}
        onChange={handlePartyFileChange}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />
      <input
        type="file"
        ref={rsvpFileInputRef}
        onChange={handleRsvpFileChange}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />

      {/* 4. Party Excel / CSV Import Modal */}
      {isPartyImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                    Import Guest List ({partyImportPreview.length} Detected)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review spreadsheet contents and choose your import strategy.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPartyImportOpen(false);
                  setPartyImportPreview([]);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {/* Import Mode Selection */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-700 mb-2">Import Strategy:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      partyImportMode === "append"
                        ? "bg-white border-[#1b3b5f] shadow-xs"
                        : "border-slate-200 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="partyMode"
                      value="append"
                      checked={partyImportMode === "append"}
                      onChange={() => setPartyImportMode("append")}
                      className="mt-0.5 text-[#1b3b5f] focus:ring-[#1b3b5f] cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-slate-800">Append to Current List</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Keep existing {parties.length} parties and add these {partyImportPreview.length} new entries.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      partyImportMode === "replace"
                        ? "bg-white border-rose-600 shadow-xs"
                        : "border-slate-200 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="partyMode"
                      value="replace"
                      checked={partyImportMode === "replace"}
                      onChange={() => setPartyImportMode("replace")}
                      className="mt-0.5 text-rose-600 focus:ring-rose-600 cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-rose-700">Replace Entire List</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Clear existing guest list and start fresh with these {partyImportPreview.length} entries.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Preview Table */}
              <div>
                <p className="font-bold text-slate-700 mb-1.5">
                  Spreadsheet Preview (First {Math.min(5, partyImportPreview.length)} of {partyImportPreview.length} Parties):
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-[11px] whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-semibold">
                      <tr>
                        <th className="p-2.5">Party / Household</th>
                        <th className="p-2.5">Primary Guest</th>
                        <th className="p-2.5">Table</th>
                        <th className="p-2.5">Seats</th>
                        <th className="p-2.5">Members</th>
                        <th className="p-2.5">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {partyImportPreview.slice(0, 5).map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-[#1b3b5f]">{p.partyName}</td>
                          <td className="p-2.5 text-slate-700">{p.primaryGuest}</td>
                          <td className="p-2.5 text-slate-600">{p.tableNumber || "VIP Table 1"}</td>
                          <td className="p-2.5 font-bold text-slate-800">{p.maxSeats}</td>
                          <td className="p-2.5 text-slate-500 max-w-[200px] truncate">
                            {p.members.map((m) => m.name).join(", ")}
                          </td>
                          <td className="p-2.5 text-slate-500">{p.phone || p.email || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {partyImportPreview.length > 5 && (
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    ...and {partyImportPreview.length - 5} more parties included in this spreadsheet.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsPartyImportOpen(false);
                  setPartyImportPreview([]);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPartyImport}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Import {partyImportPreview.length} Parties</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. RSVP Excel / CSV Import Modal */}
      {isRsvpImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                    Import RSVPs ({rsvpImportPreview.length} Detected)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and confirm RSVP submissions from spreadsheet.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsRsvpImportOpen(false);
                  setRsvpImportPreview([]);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-700 mb-2">Import Strategy:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      rsvpImportMode === "append"
                        ? "bg-white border-[#1b3b5f] shadow-xs"
                        : "border-slate-200 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rsvpMode"
                      value="append"
                      checked={rsvpImportMode === "append"}
                      onChange={() => setRsvpImportMode("append")}
                      className="mt-0.5 text-[#1b3b5f] focus:ring-[#1b3b5f] cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-slate-800">Append to Current RSVPs</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Keep existing {rsvps.length} entries and add these {rsvpImportPreview.length} submissions.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      rsvpImportMode === "replace"
                        ? "bg-white border-rose-600 shadow-xs"
                        : "border-slate-200 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rsvpMode"
                      value="replace"
                      checked={rsvpImportMode === "replace"}
                      onChange={() => setRsvpImportMode("replace")}
                      className="mt-0.5 text-rose-600 focus:ring-rose-600 cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-rose-700">Replace Entire List</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Clear existing RSVP list and start fresh with these {rsvpImportPreview.length} entries.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-700 mb-1.5">
                  Spreadsheet Preview (First {Math.min(5, rsvpImportPreview.length)} of {rsvpImportPreview.length} RSVPs):
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-[11px] whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-semibold">
                      <tr>
                        <th className="p-2.5">Guest Name</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Seats</th>
                        <th className="p-2.5">Companions</th>
                        <th className="p-2.5">Table</th>
                        <th className="p-2.5">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rsvpImportPreview.slice(0, 5).map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-[#1b3b5f]">{r.fullName}</td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r.status === "attending"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {r.status === "attending" ? "Confirmed" : "Declined"}
                            </span>
                          </td>
                          <td className="p-2.5 font-bold text-slate-800">{r.guestCount}</td>
                          <td className="p-2.5 text-slate-500">{r.companionNames || "—"}</td>
                          <td className="p-2.5 text-slate-600">{r.tableNumber || "Unassigned"}</td>
                          <td className="p-2.5 text-slate-500">{r.phone || r.email || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rsvpImportPreview.length > 5 && (
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    ...and {rsvpImportPreview.length - 5} more RSVPs included in this file.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsRsvpImportOpen(false);
                  setRsvpImportPreview([]);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRsvpImport}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Import {rsvpImportPreview.length} RSVPs</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
