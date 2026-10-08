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

export interface RsvpEntry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "attending" | "declined";
  guestCount: number;
  companionNames: string;
  message: string;
  tableNumber?: string;
  submittedAt: string;
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

export const weddingStore = {
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
