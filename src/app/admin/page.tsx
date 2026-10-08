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
  Sparkles,
  Check,
} from "lucide-react";
import {
  weddingStore,
  RsvpEntry,
  EntourageCategory,
  EntourageMember,
  InvitedParty,
  PartyMember,
  ThemeColor,
  GuestbookEntry,
} from "@/lib/weddingStore";
import { weddingData } from "@/data/weddingData";

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
    "dashboard" | "rsvps" | "parties" | "palette" | "entourage" | "wishes"
  >("dashboard");

  // Store data states
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [parties, setParties] = useState<InvitedParty[]>([]);
  const [colors, setColors] = useState<ThemeColor[]>([]);
  const [entourage, setEntourage] = useState<EntourageCategory[]>([]);
  const [wishes, setWishes] = useState<GuestbookEntry[]>([]);

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

  // Party modal form state
  const [partyFormName, setPartyFormName] = useState("");
  const [partyFormPrimary, setPartyFormPrimary] = useState("");
  const [partyFormEmail, setPartyFormEmail] = useState("");
  const [partyFormPhone, setPartyFormPhone] = useState("");
  const [partyFormTable, setPartyFormTable] = useState("");
  const [partyFormNotes, setPartyFormNotes] = useState("");
  const [partyFormMembers, setPartyFormMembers] = useState<{ id: string; name: string; role: string; isAttending: boolean }[]>([]);

  // Check auth on mount
  useEffect(() => {
    if (weddingStore.isAuthenticated()) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const loadAllData = () => {
    setRsvps(weddingStore.getRsvps());
    setParties(weddingStore.getParties());
    setColors(weddingStore.getThemeColors());
    setEntourage(weddingStore.getEntourage());

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === "admin" && passwordInput === "Aianbasagre2") {
      weddingStore.login(rememberMe);
      setIsAuthenticated(true);
      setAuthError("");
      loadAllData();
    } else {
      setAuthError("Invalid credentials. Username is 'admin' and password is case-sensitive.");
    }
  };

  const handleLogout = () => {
    weddingStore.logout();
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  // RSVP Actions
  const handleToggleStatus = (id: string, currentStatus: "attending" | "declined") => {
    const nextStatus = currentStatus === "attending" ? "declined" : "attending";
    weddingStore.updateRsvp(id, { status: nextStatus });
    loadAllData();
  };

  const handleDeleteRsvp = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete RSVP entry for "${name}"?`)) {
      weddingStore.deleteRsvp(id);
      loadAllData();
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
    if (!partyFormPrimary.trim() || !partyFormName.trim()) return;

    const cleanMembers = partyFormMembers.filter((m) => m.name.trim().length > 0);
    if (cleanMembers.length === 0) {
      cleanMembers.push({ id: "m-1", name: partyFormPrimary.trim(), role: "Primary Guest", isAttending: true });
    }

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
  };

  const handleDeleteParty = (id: string, name: string) => {
    if (window.confirm(`Delete party "${name}"?`)) {
      weddingStore.deleteParty(id);
      loadAllData();
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
    if (!newColorName.trim() || !newColorHex.trim()) return;

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
  };

  const handleDeleteColor = (id: string, name: string) => {
    if (window.confirm(`Delete swatch "${name}"?`)) {
      weddingStore.deleteThemeColor(id);
      loadAllData();
    }
  };

  // Entourage member actions
  const handleAddEntourageMember = (catIdx: number, role: string, name: string) => {
    if (!role.trim() || !name.trim()) return;
    const current = [...entourage];
    current[catIdx].members.push({
      id: "m-" + Date.now(),
      role: role.trim(),
      name: name.trim(),
    });
    weddingStore.saveEntourage(current);
    loadAllData();
  };

  const handleDeleteEntourageMember = (catIdx: number, memberId: string) => {
    const current = [...entourage];
    current[catIdx].members = current[catIdx].members.filter((m) => m.id !== memberId);
    weddingStore.saveEntourage(current);
    loadAllData();
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 xl:w-72 bg-[#0e1d2f] text-white flex flex-col justify-between border-r border-blue-900/60 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Sidebar Header Brand */}
          <div className="p-6 border-b border-blue-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-200/50 shadow-md bg-white shrink-0">
                <Image
                  src="/images/wedding-logo.png"
                  alt="Aian & Dang Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-serif-title text-sm sm:text-base font-bold text-white uppercase tracking-wider leading-tight whitespace-nowrap">
                  Aian &amp; Dang
                </h2>
                <p className="text-[10px] text-amber-200/80 uppercase tracking-widest">
                  Admin Dashboard
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Analytics</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("parties");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "parties"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4" />
                <span>Master Guest List</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white">
                {parties.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("rsvps");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "rsvps"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>RSVP Responses</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-[10px] text-white">
                {rsvps.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("palette");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "palette"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4" />
                <span>Dress &amp; Palette Colors</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white">
                {colors.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("entourage");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "entourage"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4" />
                <span>Entourage Roster</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white">
                {entourage.reduce((a, c) => a + c.members.length, 0)}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("wishes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all ${
                activeTab === "wishes"
                  ? "bg-[#1b3b5f] text-amber-200 shadow-md border border-amber-200/40"
                  : "text-slate-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Guestbook Wishes</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 text-[10px] text-white">
                {wishes.length}
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
              <h1 className="font-serif-title font-bold text-base sm:text-lg text-[#1b3b5f] capitalize truncate">
                {activeTab === "dashboard" && "Analytics Overview"}
                {activeTab === "parties" && "Master Guest List (Invitation Parties)"}
                {activeTab === "rsvps" && "RSVP Responses & Table Assignments"}
                {activeTab === "palette" && "Wedding Theme & Dress Palette Colors"}
                {activeTab === "entourage" && "Wedding Entourage Roster"}
                {activeTab === "wishes" && "Guestbook Blessings & Messages"}
              </h1>
              <p className="text-[10px] text-slate-400 whitespace-nowrap truncate">
                Saturday, December 12, 2026 &bull; Tagaytay Celebration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {activeTab === "parties" && (
              <button
                onClick={handleOpenAddParty}
                className="px-3.5 py-2 rounded-xl bg-[#1b3b5f] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Add Party</span>
                <span className="sm:hidden">+ Party</span>
              </button>
            )}

            {activeTab === "palette" && (
              <button
                onClick={handleOpenAddColor}
                className="px-3.5 py-2 rounded-xl bg-[#1b3b5f] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Add Palette Swatch</span>
                <span className="sm:hidden">+ Color</span>
              </button>
            )}

            {activeTab === "rsvps" && (
              <button
                onClick={exportToCsv}
                className="px-3.5 py-2 rounded-xl bg-[#7094b7] hover:bg-[#587c9f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => setActiveTab("parties")}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-[#1b3b5f] cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1b3b5f] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#1b3b5f]">
                    Master Guest List &amp; Household Parties
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                    Add invited families, set accompanied member names, and view member attendance.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("palette")}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-[#1b3b5f] cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#1b3b5f]">
                    Theme Palette &amp; Dress Code Swatches
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                    Live edit color swatches, add new HEX colors, and customize guest attire rules.
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
                    RSVP Responses &amp; Table Allocations
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                    Manage table seatings, export CSV spreadsheets, and filter confirmed guests.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. PARTIES TAB */}
          {activeTab === "parties" && (
            <div className="space-y-6 min-w-0 max-w-full">
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs min-w-0 max-w-full">
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

                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    Showing <strong>{parties.length}</strong> Registered Parties
                  </span>
                </div>

                {/* Mobile scroll swipe helper hint */}
                <div className="sm:hidden flex items-center justify-between text-[11px] text-blue-700 bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-100 mb-3 font-medium">
                  <span>&larr; Swipe horizontally to view all columns &rarr;</span>
                </div>

                <div className="overflow-x-auto w-full max-w-full touch-pan-x pb-2">
                  <table className="w-full text-left text-xs whitespace-nowrap min-w-[1100px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="p-3.5 whitespace-nowrap min-w-[280px]">Party / Primary Guest</th>
                        <th className="p-3.5 whitespace-nowrap min-w-[180px]">Table Assignment</th>
                        <th className="p-3.5 whitespace-nowrap min-w-[340px]">Invited Members &amp; Status</th>
                        <th className="p-3.5 whitespace-nowrap min-w-[220px]">Contact</th>
                        <th className="p-3.5 text-right whitespace-nowrap min-w-[100px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parties
                        .filter(
                          (p) =>
                            p.partyName.toLowerCase().includes(partySearch.toLowerCase()) ||
                            p.primaryGuest.toLowerCase().includes(partySearch.toLowerCase())
                        )
                        .map((party) => (
                          <tr key={party.id} className="hover:bg-slate-50/60 transition-colors">
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
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors inline-flex"
                                title="Edit Party"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteParty(party.id, party.partyName)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors inline-flex"
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

                  <div className="flex items-center gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="attending">Attending Only</option>
                      <option value="declined">Declined Only</option>
                    </select>
                  </div>
                </div>

                {/* Mobile scroll swipe helper hint */}
                <div className="sm:hidden flex items-center justify-between text-[11px] text-blue-700 bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-100 mb-3 font-medium">
                  <span>&larr; Swipe horizontally to view all columns &rarr;</span>
                </div>

                <div className="overflow-x-auto w-full max-w-full touch-pan-x pb-2">
                  <table className="w-full text-left text-xs whitespace-nowrap min-w-[1100px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
                        <tr key={rsvp.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-3.5 whitespace-nowrap min-w-[240px]">
                            <p className="font-serif-title font-bold text-sm text-[#1b3b5f] whitespace-nowrap">
                              {rsvp.fullName}
                            </p>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{rsvp.submittedAt}</span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap min-w-[130px]">
                            <button
                              onClick={() => handleToggleStatus(rsvp.id, rsvp.status)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap inline-flex items-center ${
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
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors inline-flex"
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
              </div>
            </div>
          )}

          {/* 5. ENTOURAGE TAB */}
          {activeTab === "entourage" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entourage.map((cat, catIdx) => (
                  <div
                    key={cat.id}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <h4 className="font-serif-title font-bold text-base text-[#1b3b5f]">
                          {cat.category}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold">
                          {cat.members.length} Members
                        </span>
                      </div>

                      <div className="space-y-2">
                        {cat.members.map((m) => (
                          <div
                            key={m.id}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="space-y-0.5">
                                {m.name.split("&").map((singleName, sIdx) => (
                                  <p key={sIdx} className="font-bold text-slate-800">
                                    {singleName.trim()}
                                  </p>
                                ))}
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase">{m.role}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteEntourageMember(catIdx, m.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
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
              <h3 className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                Guestbook Wishes Wall ({wishes.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishes.map((w) => (
                  <div key={w.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <p className="font-bold text-[#1b3b5f]">{w.name} ({w.relationship})</p>
                    <p className="italic text-slate-600 my-2">&ldquo;{w.message}&rdquo;</p>
                    <span className="text-[10px] text-slate-400">{w.date} &bull; {w.likes} ❤️</span>
                  </div>
                ))}
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
                    className="text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    + Add Member
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
    </div>
  );
}
