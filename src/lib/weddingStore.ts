import { weddingData as defaultData, WeddingData } from "@/data/weddingData";

export interface EntourageMember {
  id: string;
  role: string;
  name: string;
}

export interface EntourageCategory {
  id: string;
  category: string;
  members: EntourageMember[];
}

export interface PartyMember {
  id: string;
  name: string;
  role?: string;
  isAttending: boolean;
}

export interface InvitedParty {
  id: string;
  partyName: string;
  primaryGuest: string;
  email?: string;
  phone?: string;
  maxSeats: number;
  members: PartyMember[];
  tableNumber?: string;
  status?: "pending" | "confirmed" | "declined";
  lastUpdated?: string;
  notes?: string;
}

export interface MemberAttendance {
  name: string;
  role?: string;
  isAttending: boolean;
}

export interface RsvpEntry {
  id: string;
  partyId?: string;
  fullName: string;
  email: string;
  phone: string;
  status: "attending" | "declined";
  guestCount: number;
  companionNames: string;
  memberBreakdown?: MemberAttendance[];
  message: string;
  tableNumber?: string;
  submittedAt: string;
}

export interface ThemeColor {
  id: string;
  name: string;
  hex: string;
  desc: string;
}

export interface RegistryItem {
  id: string;
  name: string;
  category: string;
  priceEstimate: string;
  isClaimed: boolean;
  claimedBy?: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  relationship: string;
  message: string;
  likes: number;
  date: string;
}

const STORAGE_KEYS = {
  ENTOURAGE: "aian_dang_wedding_entourage",
  RSVPS: "aian_dang_wedding_all_rsvps",
  PARTIES: "aian_dang_wedding_invited_parties",
  THEME: "aian_dang_wedding_theme_palette",
  REGISTRY: "aian_dang_wedding_registry_items",
  GUESTBOOK: "aian_dang_wedding_guestbook",
  ADMIN_AUTH: "aian_dang_admin_session",
};

// Initial entourage with unique IDs
export const getInitialEntourage = (): EntourageCategory[] => {
  return defaultData.entourage.map((cat, catIdx) => ({
    id: `cat-${catIdx}`,
    category: cat.category,
    members: cat.members.map((m, mIdx) => ({
      id: `m-${catIdx}-${mIdx}-${Date.now()}`,
      role: m.role,
      name: m.name,
    })),
  }));
};

// Initial demo RSVPs for immediate visual richness
export const getInitialRsvps = (): RsvpEntry[] => {
  return [
    {
      id: "rsvp-1",
      fullName: "Hon. Roberto Gomez & Dra. Maria Teresa Gomez",
      email: "mtgomez@gmail.com",
      phone: "+63 917 555 1234",
      status: "attending",
      guestCount: 2,
      companionNames: "Hon. Roberto Gomez",
      message: "Looking forward to your blessed wedding day! Congratulations Aian & Dang!",
      tableNumber: "VIP Table 1 (Ninongs & Ninangs)",
      submittedAt: "10/08/2026, 10:15 AM",
    },
    {
      id: "rsvp-2",
      fullName: "Christian Paul Ramos",
      email: "christian.ramos@gmail.com",
      phone: "+63 917 888 1122",
      status: "attending",
      guestCount: 2,
      companionNames: "Sofia Mendoza",
      message: "Can't wait to give my Best Man speech bro! Cheers!",
      tableNumber: "Table 2 (Entourage)",
      submittedAt: "10/08/2026, 11:00 AM",
    },
    {
      id: "rsvp-3",
      fullName: "Katarina Denise Santos",
      email: "katarina.santos@yahoo.com",
      phone: "+63 918 222 3344",
      status: "attending",
      guestCount: 1,
      companionNames: "",
      message: "Sister of the bride is ready! Love you both so much!",
      tableNumber: "Table 2 (Entourage)",
      submittedAt: "10/08/2026, 11:45 AM",
    },
    {
      id: "rsvp-4",
      fullName: "Engr. Manuel Cruz & Mrs. Patricia Cruz",
      email: "manuel.cruz@engineering.ph",
      phone: "+63 920 777 9900",
      status: "attending",
      guestCount: 2,
      companionNames: "Mrs. Patricia Cruz",
      message: "May God grant you a lifetime of peace, prosperity, and endless love.",
      tableNumber: "VIP Table 1 (Ninongs & Ninangs)",
      submittedAt: "10/08/2026, 01:20 PM",
    },
    {
      id: "rsvp-5",
      fullName: "Mark Anthony Lim",
      email: "mark.lim@gmail.com",
      phone: "+63 915 333 4455",
      status: "attending",
      guestCount: 1,
      companionNames: "",
      message: "So hyped for the party! Congrats brother!",
      tableNumber: "Table 3 (Groomsmen)",
      submittedAt: "10/08/2026, 02:15 PM",
    },
    {
      id: "rsvp-6",
      fullName: "Camille Joy Perez",
      email: "camille.perez@hotmail.com",
      phone: "+63 919 666 7788",
      status: "attending",
      guestCount: 2,
      companionNames: "David Tan",
      message: "Bridesmaid duties activated! You will be the most stunning bride Dang!",
      tableNumber: "Table 4 (Bridesmaids)",
      submittedAt: "10/08/2026, 03:00 PM",
    },
    {
      id: "rsvp-7",
      fullName: "Atty. Fernando Rivera & Mrs. Carmela Rivera",
      email: "frivera.law@gmail.com",
      phone: "+63 917 444 5566",
      status: "attending",
      guestCount: 2,
      companionNames: "Mrs. Carmela Rivera",
      message: "Best wishes on your holy matrimony from the Rivera family.",
      tableNumber: "VIP Table 1 (Ninongs & Ninangs)",
      submittedAt: "10/08/2026, 04:10 PM",
    },
    {
      id: "rsvp-8",
      fullName: "Marcus Aurelius Tan",
      email: "marcustan@outlook.com",
      phone: "+63 920 111 2233",
      status: "declined",
      guestCount: 1,
      companionNames: "",
      message: "Sending love from Canada! Wishing you both a lifetime of happiness!",
      tableNumber: "-",
      submittedAt: "10/08/2026, 05:30 PM",
    },
    {
      id: "rsvp-9",
      fullName: "Bea Nicole Flores",
      email: "bea.flores@gmail.com",
      phone: "+63 917 999 8811",
      status: "attending",
      guestCount: 1,
      companionNames: "",
      message: "So thrilled to witness your vows! Love you lots!",
      tableNumber: "Table 4 (Bridesmaids)",
      submittedAt: "10/08/2026, 06:20 PM",
    },
  ];
};

export const getInitialParties = (): InvitedParty[] => {
  return defaultData.invitedParties.map((p) => ({
    ...p,
    status: p.members.every((m) => m.isAttending)
      ? "confirmed"
      : p.members.some((m) => m.isAttending)
      ? "confirmed"
      : "pending",
  }));
};

export const getInitialThemeColors = (): ThemeColor[] => {
  return defaultData.theme.colors.map((c, idx) => ({
    id: `color-${idx}`,
    name: c.name,
    hex: c.hex,
    desc: c.desc,
  }));
};

export const weddingStore = {
  // Parties / Master Guest List
  getParties(): InvitedParty[] {
    if (typeof window === "undefined") return getInitialParties();
    const saved = localStorage.getItem(STORAGE_KEYS.PARTIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getInitialParties();
      }
    }
    const init = getInitialParties();
    localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(init));
    return init;
  },

  saveParties(parties: InvitedParty[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(parties));
    window.dispatchEvent(new Event("wedding_parties_updated"));
  },

  addParty(party: Omit<InvitedParty, "id">): InvitedParty {
    const parties = this.getParties();
    const newParty: InvitedParty = {
      id: "pty-" + Date.now(),
      ...party,
    };
    const updated = [newParty, ...parties];
    this.saveParties(updated);
    return newParty;
  },

  updateParty(id: string, updates: Partial<InvitedParty>) {
    const parties = this.getParties();
    const updated = parties.map((p) => (p.id === id ? { ...p, ...updates, lastUpdated: new Date().toLocaleString() } : p));
    this.saveParties(updated);
  },

  deleteParty(id: string) {
    const parties = this.getParties();
    const updated = parties.filter((p) => p.id !== id);
    this.saveParties(updated);
  },

  findPartyByGuestName(nameQuery: string): InvitedParty | null {
    if (!nameQuery || !nameQuery.trim()) return null;
    const clean = nameQuery.trim().toLowerCase();
    const parties = this.getParties();
    return (
      parties.find((p) => {
        if (p.primaryGuest.toLowerCase().includes(clean) || p.partyName.toLowerCase().includes(clean)) {
          return true;
        }
        return p.members.some((m) => m.name.toLowerCase().includes(clean));
      }) || null
    );
  },

  // Theme & Palette Swatches
  getThemeColors(): ThemeColor[] {
    if (typeof window === "undefined") return getInitialThemeColors();
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getInitialThemeColors();
      }
    }
    const init = getInitialThemeColors();
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(init));
    return init;
  },

  saveThemeColors(colors: ThemeColor[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(colors));
    window.dispatchEvent(new Event("wedding_theme_updated"));
  },

  addThemeColor(color: Omit<ThemeColor, "id">): ThemeColor {
    const colors = this.getThemeColors();
    const newColor: ThemeColor = {
      id: "color-" + Date.now(),
      ...color,
    };
    const updated = [...colors, newColor];
    this.saveThemeColors(updated);
    return newColor;
  },

  updateThemeColor(id: string, updates: Partial<ThemeColor>) {
    const colors = this.getThemeColors();
    const updated = colors.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.saveThemeColors(updated);
  },

  deleteThemeColor(id: string) {
    const colors = this.getThemeColors();
    const updated = colors.filter((c) => c.id !== id);
    this.saveThemeColors(updated);
  },

  // Entourage
  getEntourage(): EntourageCategory[] {
    if (typeof window === "undefined") return getInitialEntourage();
    const saved = localStorage.getItem(STORAGE_KEYS.ENTOURAGE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getInitialEntourage();
      }
    }
    const init = getInitialEntourage();
    localStorage.setItem(STORAGE_KEYS.ENTOURAGE, JSON.stringify(init));
    return init;
  },

  saveEntourage(entourage: EntourageCategory[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ENTOURAGE, JSON.stringify(entourage));
    window.dispatchEvent(new Event("wedding_entourage_updated"));
  },

  // RSVPs
  getRsvps(): RsvpEntry[] {
    if (typeof window === "undefined") return getInitialRsvps();
    const saved = localStorage.getItem(STORAGE_KEYS.RSVPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getInitialRsvps();
      }
    }
    const init = getInitialRsvps();
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(init));
    return init;
  },

  saveRsvps(rsvps: RsvpEntry[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(rsvps));
    window.dispatchEvent(new Event("wedding_rsvps_updated"));
  },

  addRsvp(entry: Omit<RsvpEntry, "id" | "submittedAt">): RsvpEntry {
    const rsvps = this.getRsvps();
    const newEntry: RsvpEntry = {
      id: "rsvp-" + Date.now(),
      ...entry,
      submittedAt: new Date().toLocaleString(),
    };
    const updated = [newEntry, ...rsvps];
    this.saveRsvps(updated);

    // If matching party found, update party member states too
    if (entry.partyId) {
      const parties = this.getParties();
      const party = parties.find((p) => p.id === entry.partyId);
      if (party && entry.memberBreakdown) {
        const updatedMembers = party.members.map((m) => {
          const breakdown = entry.memberBreakdown?.find(
            (b) => b.name.toLowerCase() === m.name.toLowerCase()
          );
          return breakdown ? { ...m, isAttending: breakdown.isAttending } : m;
        });
        this.updateParty(party.id, {
          members: updatedMembers,
          status: entry.status === "attending" ? "confirmed" : "declined",
          phone: entry.phone || party.phone,
          email: entry.email || party.email,
        });
      }
    }

    return newEntry;
  },

  updateRsvp(id: string, updates: Partial<RsvpEntry>) {
    const rsvps = this.getRsvps();
    const updated = rsvps.map((r) => (r.id === id ? { ...r, ...updates } : r));
    this.saveRsvps(updated);
  },

  deleteRsvp(id: string) {
    const rsvps = this.getRsvps();
    const updated = rsvps.filter((r) => r.id !== id);
    this.saveRsvps(updated);
  },

  // Registry
  getRegistry(): RegistryItem[] {
    if (typeof window === "undefined") return defaultData.gifts.registryItems;
    const saved = localStorage.getItem(STORAGE_KEYS.REGISTRY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultData.gifts.registryItems;
      }
    }
    const init = defaultData.gifts.registryItems;
    localStorage.setItem(STORAGE_KEYS.REGISTRY, JSON.stringify(init));
    return init;
  },

  saveRegistry(items: RegistryItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.REGISTRY, JSON.stringify(items));
    window.dispatchEvent(new Event("wedding_registry_updated"));
  },

  // Auth helpers for /admin
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "true" ||
      localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "true";
  },

  login(remember: boolean = false) {
    if (typeof window === "undefined") return;
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
    }
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
  },

  logout() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  },
};
