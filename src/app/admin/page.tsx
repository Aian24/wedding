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
  Gift,
  MessageSquare,
  LayoutDashboard,
  UserCheck,
  Menu,
  X,
  Calendar,
  ExternalLink,
} from "lucide-react";
import {
  weddingStore,
  RsvpEntry,
  EntourageCategory,
  EntourageMember,
  RegistryItem,
  GuestbookEntry,
} from "@/lib/weddingStore";

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
    "dashboard" | "rsvps" | "entourage" | "wishes"
  >("dashboard");

  // Store data states
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [entourage, setEntourage] = useState<EntourageCategory[]>([]);
  const [registry, setRegistry] = useState<RegistryItem[]>([]);
  const [wishes, setWishes] = useState<GuestbookEntry[]>([]);

  // DataTable States for RSVPs
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof RsvpEntry>("submittedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modals
  const [isAddRsvpOpen, setIsAddRsvpOpen] = useState<boolean>(false);
  const [editingRsvp, setEditingRsvp] = useState<RsvpEntry | null>(null);
  const [selectedRsvpView, setSelectedRsvpView] = useState<RsvpEntry | null>(null);

  // Entourage Edit State
  const [editingCategoryIdx, setEditingCategoryIdx] = useState<number | null>(null);
  const [newMemberRole, setNewMemberRole] = useState<string>("");
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [editingMember, setEditingMember] = useState<{ catIdx: number; member: EntourageMember } | null>(null);

  // Check auth on mount
  useEffect(() => {
    if (weddingStore.isAuthenticated()) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const loadAllData = () => {
    setRsvps(weddingStore.getRsvps());
    setEntourage(weddingStore.getEntourage());
    setRegistry(weddingStore.getRegistry());

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

  const handleSaveEditRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRsvp) return;
    weddingStore.updateRsvp(editingRsvp.id, editingRsvp);
    setEditingRsvp(null);
    loadAllData();
  };

  const handleCreateManualRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    weddingStore.addRsvp({
      fullName: (formData.get("fullName") as string) || "Guest",
      email: (formData.get("email") as string) || "offline@guest.com",
      phone: (formData.get("phone") as string) || "N/A",
      status: (formData.get("status") as "attending" | "declined") || "attending",
      guestCount: parseInt((formData.get("guestCount") as string) || "1", 10),
      companionNames: (formData.get("companionNames") as string) || "",
      message: (formData.get("message") as string) || "Manual RSVP entered by couple/admin.",
      tableNumber: (formData.get("tableNumber") as string) || "Unassigned",
    });

    setIsAddRsvpOpen(false);
    loadAllData();
  };

  // Entourage Actions
  const handleAddMemberToCategory = (catIdx: number) => {
    if (!newMemberRole.trim() || !newMemberName.trim()) return;

    const updated = [...entourage];
    const newMember: EntourageMember = {
      id: `m-${Date.now()}`,
      role: newMemberRole.trim(),
      name: newMemberName.trim(),
    };
    updated[catIdx].members.push(newMember);
    weddingStore.saveEntourage(updated);
    setEntourage(updated);
    setNewMemberRole("");
    setNewMemberName("");
    setEditingCategoryIdx(null);
  };

  const handleDeleteEntourageMember = (catIdx: number, memberId: string) => {
    const updated = [...entourage];
    updated[catIdx].members = updated[catIdx].members.filter((m) => m.id !== memberId);
    weddingStore.saveEntourage(updated);
    setEntourage(updated);
  };

  const handleUpdateEntourageMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const updated = [...entourage];
    const memberIdx = updated[editingMember.catIdx].members.findIndex(
      (m) => m.id === editingMember.member.id
    );
    if (memberIdx !== -1) {
      updated[editingMember.catIdx].members[memberIdx] = editingMember.member;
      weddingStore.saveEntourage(updated);
      setEntourage(updated);
    }
    setEditingMember(null);
  };

  // Wishes moderation
  const handleDeleteWish = (id: string) => {
    const updated = wishes.filter((w) => w.id !== id);
    setWishes(updated);
    localStorage.setItem("aian_dang_wedding_guestbook", JSON.stringify(updated));
  };

  // Filtered & Paginated RSVPs
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((r) => {
      const matchSearch =
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.companionNames && r.companionNames.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === "all" ? true : r.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [rsvps, searchTerm, statusFilter]);

  const sortedRsvps = useMemo(() => {
    return [...filteredRsvps].sort((a, b) => {
      let aVal: any = a[sortField] || "";
      let bVal: any = b[sortField] || "";

      if (sortField === "guestCount") {
        aVal = a.guestCount || 1;
        bVal = b.guestCount || 1;
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

  // Entourage total count
  const totalEntourageCount = useMemo(() => {
    return entourage.reduce((acc, cat) => acc + cat.members.length, 0);
  }, [entourage]);

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

  const handlePrint = () => {
    window.print();
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
            Aian &amp; Dang Wedding Reservation &amp; Entourage Manager
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1b3b5f] focus:outline-none bg-slate-50/50"
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
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1b3b5f] focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#1b3b5f]"
                />
                <span>Remember session</span>
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
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="p-4 space-y-1.5 flex-1">
            <p className="px-3 py-2 text-[10px] uppercase font-bold tracking-[0.2em] text-blue-300/60">
              Overview &amp; Planning
            </p>

            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-blue-600 to-[#1b3b5f] text-white shadow-md border border-blue-400/40"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-amber-300" />
                <span>Dashboard Analytics</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("rsvps");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "rsvps"
                  ? "bg-gradient-to-r from-blue-600 to-[#1b3b5f] text-white shadow-md border border-blue-400/40"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-amber-300" />
                <span>Guest Reservations</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-amber-200 text-[10px] font-bold">
                {rsvps.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("entourage");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "entourage"
                  ? "bg-gradient-to-r from-blue-600 to-[#1b3b5f] text-white shadow-md border border-blue-400/40"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Entourage &amp; Sponsors</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-amber-200 text-[10px] font-bold">
                {totalEntourageCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("wishes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "wishes"
                  ? "bg-gradient-to-r from-blue-600 to-[#1b3b5f] text-white shadow-md border border-blue-400/40"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Wishes Guestbook</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-amber-200 text-[10px] font-bold">
                {wishes.length}
              </span>
            </button>
          </div>

          {/* Sidebar Bottom Profile & Links */}
          <div className="p-4 border-t border-blue-900/60 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-blue-300" />
                <span>View Public Site</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>

            <div className="flex items-center justify-between pt-2 border-t border-blue-900/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-800/60 text-amber-200 flex items-center justify-center text-xs font-bold">
                  AD
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">admin</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">Online &bull; Organizer</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ======================= RIGHT MAIN CONTENT ======================= */}
      <div className="flex-1 lg:pl-64 xl:pl-72 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-serif-title text-base sm:text-lg font-bold text-[#1b3b5f] capitalize">
                {activeTab === "dashboard" && "Dashboard & Analytics Overview"}
                {activeTab === "rsvps" && "Guest Reservations & Seating Table"}
                {activeTab === "entourage" && "Entourage & Bridal Party Directory"}
                {activeTab === "wishes" && "Guestbook Wishes Moderation"}
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                Wedding Date: Saturday, December 12, 2026 &bull; Tagaytay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsAddRsvpOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#1b3b5f] hover:bg-[#132c49] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add RSVP</span>
            </button>

            <button
              onClick={exportToCsv}
              className="hidden sm:flex px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main className="p-4 sm:p-8 space-y-8 flex-1">
          {/* ======================= TAB 1: DASHBOARD & ANALYTICS ======================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      Confirmed Headcount
                    </p>
                    <p className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b3b5f] mt-1">
                      {totalHeadcount} <span className="text-xs font-normal text-slate-400">Seats</span>
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      {capacityPercent}% of {targetCapacity} venue target
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1b3b5f] flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-emerald-600">
                      Attending RSVPs
                    </p>
                    <p className="font-serif-title text-3xl sm:text-4xl font-bold text-emerald-700 mt-1">
                      {attendingRsvps.length}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Parties joyfully accepted
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-rose-500">
                      Regretfully Declined
                    </p>
                    <p className="font-serif-title text-3xl sm:text-4xl font-bold text-rose-600 mt-1">
                      {declinedRsvps.length}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Unable to attend
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-[#7094b7]">
                      Total RSVP Records
                    </p>
                    <p className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b3b5f] mt-1">
                      {totalRsvpCount}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {totalEntourageCount} Entourage members
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#7094b7] flex items-center justify-center">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-title text-lg font-bold text-[#1b3b5f]">
                      Venue Seating &amp; Capacity Meter
                    </h3>
                    <p className="text-xs text-slate-500">
                      Sapphire Grand Ballroom reserved headcount progress
                    </p>
                  </div>
                  <span className="font-serif-title font-bold text-lg text-[#1b3b5f]">
                    {totalHeadcount} / {targetCapacity} Seats
                  </span>
                </div>

                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-[#1b3b5f] to-amber-400 rounded-full transition-all duration-1000"
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>0 Seats</span>
                  <span>{targetCapacity - totalHeadcount} Remaining Available Seats</span>
                  <span>{targetCapacity} Max Target</span>
                </div>
              </div>

              {/* Recent Messages & Overview Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif-title text-lg font-bold text-[#1b3b5f]">
                      Recent Guest Wishes &amp; RSVP Messages
                    </h3>
                    <p className="text-xs text-slate-500">
                      Heartfelt notes sent by guests in their reservations
                    </p>
                  </div>
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rsvps
                    .filter((r) => r.message && r.message.trim().length > 0)
                    .slice(0, 6)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 flex flex-col justify-between text-xs"
                      >
                        <p className="text-slate-700 italic mb-3">&ldquo;{r.message}&rdquo;</p>
                        <div className="pt-2 border-t border-blue-100/60 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#1b3b5f]">{r.fullName}</span>
                          <span className="text-slate-400">{r.submittedAt}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 2: GUEST RESERVATIONS DATATABLE ======================= */}
          {activeTab === "rsvps" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
              <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="font-serif-title text-xl font-bold text-[#1b3b5f]">
                    Guest Reservations &amp; Seating Table
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage confirmed attendees, companions, and seating assignments.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setIsAddRsvpOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#1b3b5f] hover:bg-[#132c49] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>Add Manual RSVP</span>
                  </button>

                  <button
                    onClick={exportToCsv}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="p-4 sm:px-6 bg-slate-50/80 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search guest name, email, companion..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#1b3b5f]"
                  />
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#1b3b5f]"
                  >
                    <option value="all">All Statuses (Attending + Declined)</option>
                    <option value="attending">Joyfully Attending Only</option>
                    <option value="declined">Regretfully Declined Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
                  <span>Show entries:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value, 10));
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#1b3b5f]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-[11px] uppercase font-bold text-[#1b3b5f] border-b border-slate-200">
                    <tr>
                      <th
                        className="p-3.5 cursor-pointer hover:bg-slate-200 transition-colors"
                        onClick={() => {
                          setSortField("fullName");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>Guest Name</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="p-3.5">Status</th>
                      <th
                        className="p-3.5 cursor-pointer hover:bg-slate-200 transition-colors"
                        onClick={() => {
                          setSortField("guestCount");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>Seats</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="p-3.5">Companions</th>
                      <th className="p-3.5">Table Assignment</th>
                      <th className="p-3.5">Contact Info</th>
                      <th
                        className="p-3.5 cursor-pointer hover:bg-slate-200 transition-colors"
                        onClick={() => {
                          setSortField("submittedAt");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>Submitted</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedRsvps.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400">
                          No guest reservations matching the search/filter criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedRsvps.map((r) => (
                        <tr key={r.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-3.5 font-bold text-[#1b3b5f]">
                            {r.fullName}
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleStatus(r.id, r.status)}
                              title="Click to toggle status"
                              className="cursor-pointer"
                            >
                              {r.status === "attending" ? (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1 hover:bg-emerald-200 transition-colors">
                                  <CheckCircle2 className="w-3 h-3" /> Attending
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] inline-flex items-center gap-1 hover:bg-rose-200 transition-colors">
                                  <XCircle className="w-3 h-3" /> Declined
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="p-3.5 font-bold text-[#1b3b5f]">
                            {r.guestCount || 1}
                          </td>
                          <td className="p-3.5 text-slate-600">
                            {r.companionNames || "-"}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                              {r.tableNumber || "Unassigned"}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <p className="font-medium">{r.email}</p>
                            <p className="text-slate-400 font-mono text-[10px]">{r.phone}</p>
                          </td>
                          <td className="p-3.5 text-slate-400 text-[10px] whitespace-nowrap">
                            {r.submittedAt}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedRsvpView(r)}
                                title="View Details"
                                className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-600 hover:text-blue-900 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingRsvp(r)}
                                title="Edit"
                                className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRsvp(r.id, r.fullName)}
                                title="Delete"
                                className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <p>
                  Showing {sortedRsvps.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(currentPage * pageSize, sortedRsvps.length)} of {sortedRsvps.length} entries
                </p>

                <div className="flex items-center space-x-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1">...</span>}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            currentPage === p
                              ? "bg-[#1b3b5f] text-white"
                              : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-medium"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 3: ENTOURAGE MANAGER ======================= */}
          {activeTab === "entourage" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif-title text-xl font-bold text-[#1b3b5f]">
                    Wedding Entourage &amp; Sponsor Directory Manager
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update Principal Sponsors (Ninongs &amp; Ninangs), Groomsmen, Bridesmaids, Best Man, Maid of Honor, and Parents.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entourage.map((cat, catIdx) => (
                  <div
                    key={cat.id || catIdx}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#7094b7]">
                            Category #{catIdx + 1}
                          </span>
                          <h3 className="font-serif-title text-lg font-bold text-[#1b3b5f]">
                            {cat.category}
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#1b3b5f] text-xs font-bold">
                          {cat.members.length} Members
                        </span>
                      </div>

                      <div className="space-y-2.5 mb-6">
                        {cat.members.map((member) => (
                          <div
                            key={member.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-blue-50/50 transition-colors group"
                          >
                            <div>
                              <p className="text-[10px] uppercase font-bold text-[#7094b7]">
                                {member.role}
                              </p>
                              <p className="font-serif-title font-bold text-sm text-[#1b3b5f]">
                                {member.name}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => setEditingMember({ catIdx, member })}
                                className="p-1 rounded-lg hover:bg-amber-100 text-slate-500 hover:text-amber-800"
                                title="Edit Member"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEntourageMember(catIdx, member.id)}
                                className="p-1 rounded-lg hover:bg-rose-100 text-slate-500 hover:text-rose-700"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {editingCategoryIdx === catIdx ? (
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                        <p className="text-xs font-bold text-[#1b3b5f] uppercase tracking-wider">
                          Add New Entourage Member
                        </p>
                        <input
                          type="text"
                          placeholder="Role / Title (e.g. Ninong / Groomsman)"
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Full Name (e.g. Hon. Juan Dela Cruz)"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingCategoryIdx(null)}
                            className="px-3 py-1.5 text-xs text-slate-500 font-semibold uppercase"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddMemberToCategory(catIdx)}
                            className="px-4 py-1.5 rounded-lg bg-[#1b3b5f] text-white text-xs font-bold uppercase"
                          >
                            Add Member
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCategoryIdx(catIdx);
                          setNewMemberRole("");
                          setNewMemberName("");
                        }}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#1b3b5f] text-slate-500 hover:text-[#1b3b5f] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Member to {cat.category}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= TAB 4: WISHES GUESTBOOK ======================= */}
          {activeTab === "wishes" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif-title text-xl font-bold text-[#1b3b5f]">
                    Guestbook Wishes Wall &amp; Message Moderation
                  </h2>
                  <p className="text-xs text-slate-500">
                    Review and moderate messages left by wedding guests on the public guestbook.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishes.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
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
                      <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-rose-500" /> {item.likes} Likes
                      </span>

                      <button
                        onClick={() => handleDeleteWish(item.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================= MODAL: ADD MANUAL RSVP ======================= */}
      {isAddRsvpOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 my-8">
            <h3 className="font-serif-title text-xl font-bold text-[#1b3b5f] mb-1">
              Add Manual Guest Reservation
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Manually enter a guest who confirmed via phone, SMS, or in person.
            </p>

            <form onSubmit={handleCreateManualRsvp} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                  Full Guest Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Mayor Juan Dela Cruz"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                    Attendance Status
                  </label>
                  <select name="status" className="w-full px-3 py-2.5 rounded-xl border border-slate-300">
                    <option value="attending">Joyfully Attending</option>
                    <option value="declined">Regretfully Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                    Reserved Seats
                  </label>
                  <select name="guestCount" className="w-full px-3 py-2.5 rounded-xl border border-slate-300">
                    <option value="1">1 Seat</option>
                    <option value="2">2 Seats (+1)</option>
                    <option value="3">3 Seats</option>
                    <option value="4">4 Seats</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                  Companion Names
                </label>
                <input
                  type="text"
                  name="companionNames"
                  placeholder="e.g. Mrs. Maria Dela Cruz"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="guest@gmail.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+63 917 123 4567"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                  Table Assignment
                </label>
                <input
                  type="text"
                  name="tableNumber"
                  placeholder="e.g. VIP Table 1"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                  Message / Notes
                </label>
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Notes or greetings..."
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddRsvpOpen(false)}
                  className="px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b3b5f] text-white font-bold uppercase tracking-wider shadow-md hover:bg-[#132c49]"
                >
                  Save Guest RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: EDIT RSVP ======================= */}
      {editingRsvp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 my-8">
            <h3 className="font-serif-title text-xl font-bold text-[#1b3b5f] mb-1">
              Edit RSVP &bull; {editingRsvp.fullName}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Update seating count, companion names, or table assignment.
            </p>

            <form onSubmit={handleSaveEditRsvp} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                  Full Guest Name
                </label>
                <input
                  type="text"
                  value={editingRsvp.fullName}
                  onChange={(e) => setEditingRsvp({ ...editingRsvp, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                    Status
                  </label>
                  <select
                    value={editingRsvp.status}
                    onChange={(e) =>
                      setEditingRsvp({ ...editingRsvp, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="attending">Joyfully Attending</option>
                    <option value="declined">Regretfully Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                    Reserved Seats
                  </label>
                  <select
                    value={editingRsvp.guestCount}
                    onChange={(e) =>
                      setEditingRsvp({ ...editingRsvp, guestCount: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                  >
                    <option value={1}>1 Seat</option>
                    <option value={2}>2 Seats</option>
                    <option value={3}>3 Seats</option>
                    <option value={4}>4 Seats</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                  Companions
                </label>
                <input
                  type="text"
                  value={editingRsvp.companionNames}
                  onChange={(e) =>
                    setEditingRsvp({ ...editingRsvp, companionNames: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingRsvp.email}
                    onChange={(e) =>
                      setEditingRsvp({ ...editingRsvp, email: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editingRsvp.phone}
                    onChange={(e) =>
                      setEditingRsvp({ ...editingRsvp, phone: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                  Table Assignment
                </label>
                <input
                  type="text"
                  value={editingRsvp.tableNumber || ""}
                  onChange={(e) =>
                    setEditingRsvp({ ...editingRsvp, tableNumber: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRsvp(null)}
                  className="px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b3b5f] text-white font-bold uppercase tracking-wider shadow-md hover:bg-[#132c49]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: VIEW RSVP DETAILS ======================= */}
      {selectedRsvpView && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7094b7]">
                Guest RSVP Details
              </span>
              <h3 className="font-serif-title text-xl font-bold text-[#1b3b5f] mt-0.5">
                {selectedRsvpView.fullName}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">ID: {selectedRsvpView.id}</p>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Status:</span>
                <span className="font-bold text-[#1b3b5f] capitalize">{selectedRsvpView.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Seats:</span>
                <span className="font-bold text-[#1b3b5f]">{selectedRsvpView.guestCount} Guest(s)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Companions:</span>
                <span>{selectedRsvpView.companionNames || "None"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Table:</span>
                <span className="font-semibold">{selectedRsvpView.tableNumber || "Unassigned"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Contact:</span>
                <span>{selectedRsvpView.email} / {selectedRsvpView.phone}</span>
              </div>
              {selectedRsvpView.message && (
                <div className="py-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Message to Couple:</span>
                  <p className="text-slate-600 italic">&ldquo;{selectedRsvpView.message}&rdquo;</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedRsvpView(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================= MODAL: EDIT ENTOURAGE MEMBER ======================= */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-serif-title text-xl font-bold text-[#1b3b5f] mb-4">
              Edit Entourage Member
            </h3>

            <form onSubmit={handleUpdateEntourageMember} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={editingMember.member.role}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      member: { ...editingMember.member, role: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block uppercase font-bold tracking-wider text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingMember.member.name}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      member: { ...editingMember.member, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1b3b5f] text-white font-bold uppercase tracking-wider"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
