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

export interface DressCodeItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  reminder: string;
  image?: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: string;
}

export interface CoupleInfo {
  groomName: string;
  groomNickname: string;
  groomParents: string;
  brideName: string;
  brideNickname: string;
  brideParents: string;
  weddingDate: string;
  weddingTime: string;
  hashtag: string;
  // Opening Envelope texts
  envelopeTitle: string;
  envelopeDate: string;
  envelopeAction: string;
  envelopeSubtitle: string;

  // Hero Section
  heroLocation: string;
  heroVerse: string;
  heroVerseCitation: string;
  countdownIsoDate?: string;

  // Ceremony Venue & Navigation
  ceremonyName: string;
  ceremonySubtitle: string;
  ceremonySchedule: string;
  ceremonyAddress: string;
  ceremonyCity: string;
  ceremonyNotes: string;
  ceremonyMapsUrl: string;
  ceremonyWazeUrl: string;

  // Reception Venue & Navigation
  receptionName: string;
  receptionSubtitle: string;
  receptionSchedule: string;
  receptionAddress: string;
  receptionCity: string;
  receptionNotes: string;
  receptionMapsUrl: string;
  receptionWazeUrl: string;

  // Footer Scripture & Credits
  footerVerse: string;
  footerVerseCitation: string;
  footerCredit: string;

  // Background Music (YouTube)
  bgMusicYoutubeUrl: string;
  bgMusicTitle?: string;
  bgMusicArtist?: string;
}

export interface SiteImages {
  logo: string;
  heroPoster: string;
  heroVideo: string;
  invitationVideo: string;
  envelopeCover: string;
  ceremonyVenue: string;
  receptionVenue: string;
  ladiesAttire: string;
  menAttire: string;
  guestAttire: string;
  floralCorner: string;
  floralDivider: string;
}

const STORAGE_KEYS = {
  COUPLE_INFO: "aian_dang_wedding_couple_info",
  ENTOURAGE: "aian_dang_wedding_entourage",
  RSVPS: "aian_dang_wedding_all_rsvps",
  PARTIES: "aian_dang_wedding_invited_parties",
  THEME: "aian_dang_wedding_theme_palette",
  REGISTRY: "aian_dang_wedding_registry_items",
  GUESTBOOK: "aian_dang_wedding_guestbook",
  ADMIN_AUTH: "aian_dang_admin_session",
  SITE_IMAGES: "aian_dang_wedding_site_images",
  DRESS_CODES: "aian_dang_wedding_dress_codes",
  TIMELINE: "aian_dang_wedding_timeline",
};

export const getInitialSiteImages = (): SiteImages => {
  return {
    logo: "/images/wedding-logo.png",
    heroPoster: "/images/hero.jpg",
    heroVideo: "/hero-video.mp4",
    invitationVideo: "/invitation.mp4",
    envelopeCover: "/images/envelope-cover.jpg",
    ceremonyVenue: "/images/ceremony.jpg",
    receptionVenue: "/images/reception.jpg",
    ladiesAttire: "/images/sample-dress-ladies.jpg",
    menAttire: "/images/sample-attire-men.jpg",
    guestAttire: "/images/sample-attire-men.jpg",
    floralCorner: "/images/floral-corner.jpg",
    floralDivider: "/images/floral-divider.jpg",
  };
};

export const getInitialCoupleInfo = (): CoupleInfo => {
  return {
    groomName: defaultData.groom.fullName || "Aian Christopher Ramos",
    groomNickname: defaultData.groom.nickname || "Aian",
    groomParents: defaultData.groom.parents || "Mr. Eduardo Ramos & Mrs. Cristina Ramos",
    brideName: defaultData.bride.fullName || "Ma. Andrea Santos",
    brideNickname: defaultData.bride.nickname || "Dang",
    brideParents: defaultData.bride.parents || "Mr. Antonio Santos & Mrs. Evelyn Santos",
    weddingDate: defaultData.date.fullDate || "Saturday, December 12, 2026",
    weddingTime: defaultData.date.time || "3:00 PM (PHT)",
    hashtag: defaultData.hashtag || "#AianGotHisDangGirl",
    envelopeTitle: "You're Invited",
    envelopeDate: "12.12.26",
    envelopeAction: "CLICK TO SEE",
    envelopeSubtitle: "The Magic...",

    // Hero Section
    heroLocation: "Tagaytay, Philippines",
    heroVerse: "I have found the one whom my soul loves.",
    heroVerseCitation: "— Song of Solomon 3:4",
    countdownIsoDate: "2026-12-12T15:00:00+08:00",

    // Ceremony Venue & Navigation
    ceremonyName: defaultData.ceremony.name || "St. Mary's Coastal Cathedral",
    ceremonySubtitle: defaultData.ceremony.subtitle || "Holy Matrimony & Sacred Vows Exchange",
    ceremonySchedule: defaultData.ceremony.time || "3:00 PM Sharp (Guests to be seated by 2:30 PM)",
    ceremonyAddress: defaultData.ceremony.address || "Seaside Boulevard, Oceanview Promenade",
    ceremonyCity: defaultData.ceremony.city || "Tagaytay / Metro Coastal",
    ceremonyNotes: defaultData.ceremony.notes || "Please arrive promptly by 2:30 PM to settle in before the processional commences. We respectfully request an unplugged ceremony.",
    ceremonyMapsUrl: defaultData.ceremony.mapsUrl || "https://maps.google.com/?q=Cathedral+Wedding+Venue",
    ceremonyWazeUrl: defaultData.ceremony.wazeUrl || "https://waze.com/ul",

    // Reception Venue & Navigation
    receptionName: defaultData.reception.name || "The Grand Sapphire Pavilion & Ballroom",
    receptionSubtitle: defaultData.reception.subtitle || "Dinner Banquet, Cocktails & Evening Dancing",
    receptionSchedule: defaultData.reception.time || "5:30 PM Onwards",
    receptionAddress: defaultData.reception.address || "Estate Grounds, Royal Garden View",
    receptionCity: defaultData.reception.city || "Tagaytay / Metro Coastal",
    receptionNotes: defaultData.reception.notes || "Cocktails and sunset canapés will be served upon arrival at 5:00 PM, followed by the grand entrance and sumptuous dinner banquet.",
    receptionMapsUrl: defaultData.reception.mapsUrl || "https://maps.google.com/?q=Sapphire+Ballroom+Reception",
    receptionWazeUrl: defaultData.reception.wazeUrl || "https://waze.com/ul",

    // Footer Scripture & Credits
    footerVerse: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud... It always protects, always trusts, always hopes, always perseveres. Love never fails.",
    footerVerseCitation: "— 1 Corinthians 13:4-8",
    footerCredit: "",

    // Background Music (YouTube)
    bgMusicYoutubeUrl: "https://www.youtube.com/watch?v=5e_KM3SuBjE",
    bgMusicTitle: "Dear Biyenan",
    bgMusicArtist: "Breezy Boys • JE Beats",
  };
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

// Real guest list starts clean and empty for the couple
export const getInitialRsvps = (): RsvpEntry[] => {
  return [];
};

export const getInitialParties = (): InvitedParty[] => {
  return [];
};

export const getInitialThemeColors = (): ThemeColor[] => {
  return defaultData.theme.colors.map((c, idx) => ({
    id: `color-${idx}`,
    name: c.name,
    hex: c.hex,
    desc: c.desc,
  }));
};

export const getInitialDressCodes = (): DressCodeItem[] => [
  {
    id: "dc-bride-groom",
    category: "Brides and Grooms",
    title: "Bridal Gown & Bespoke Groom Suit",
    subtitle: "Pure Pearl White & Midnight Navy Tuxedo",
    description: "The bride is adorned in a bespoke pure pearl white bridal gown, while the groom dons a tailored Midnight Navy 2-piece suit and tuxedo.",
    reminder: "Kindly note that pure white is strictly reserved for our radiant bride Dang.",
    image: "/images/hero.jpg",
  },
  {
    id: "dc-ninang-ninong",
    category: "Ninang and Ninong",
    title: "Principal Sponsors: Elegant Long Gowns & Piña Barong",
    subtitle: "Shades of Slate Blue, Midnight Navy & Formal Piña",
    description: "Ninangs: Floor-length formal evening gowns in slate blue or midnight navy. Ninongs: Traditional formal Embroidered Piña Barong Tagalog with dark trousers.",
    reminder: "Principal sponsors are requested to arrive promptly by 2:30 PM for the processional lineup.",
    image: "/images/sample-dress-ladies.jpg",
  },
  {
    id: "dc-guest",
    category: "Guest",
    title: "Cherished Guests: Formal & Semi-Formal Attire",
    subtitle: "Dusty Blue, Slate, Navy, Ice Blue & Champagne",
    description: "Ladies: Floor-length or midi formal dresses in our official wedding palette. Gentlemen: Tailored suits or Barong Tagalog with dress trousers.",
    reminder: "Gentle Reminder: We kindly request all lovely guests to refrain from wearing all-white, ivory, or cream dresses.",
    image: "/images/sample-attire-men.jpg",
  },
];

export const getInitialTimeline = (): TimelineEvent[] =>
  defaultData.timeline.map((item, idx) => ({
    id: `tl-${idx}`,
    time: item.time,
    title: item.title,
    description: item.description,
    icon: item.icon,
  }));

export const isLocalEnvironment = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".local")
  );
};

export const shouldSyncToNeon = (): boolean => {
  if (typeof window === "undefined") return true;
  // On production (e.g., deployed on Vercel), always push directly to Neon cloud DB
  if (!isLocalEnvironment()) return true;
  // On localhost, keep changes in local storage by default to protect Vercel
  // Only push if explicitly enabled by the user in the admin header toggle
  return localStorage.getItem("admin_sync_to_neon") === "true";
};

export const setLocalNeonSync = (enabled: boolean) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("admin_sync_to_neon", enabled ? "true" : "false");
  window.dispatchEvent(new Event("admin_sync_mode_changed"));
};

export const weddingStore = {
  // Parties / Master Guest List
  getParties(): InvitedParty[] {
    if (typeof window === "undefined") return getInitialParties();
    const saved = localStorage.getItem(STORAGE_KEYS.PARTIES);
    if (saved) {
      try {
        const parsed: InvitedParty[] = JSON.parse(saved);
        // If legacy demo parties exist with IDs pty-1, pty-2, or mock demo primary guest, purge them
        const hasLegacyMock = parsed.some(
          (p) =>
            ["pty-1", "pty-2", "pty-3", "pty-4", "pty-5"].includes(p.id) ||
            (p.primaryGuest && p.primaryGuest.toLowerCase().includes("roberto gomez"))
        );
        if (hasLegacyMock) {
          localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify([]));
          return [];
        }
        return parsed;
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
    if (shouldSyncToNeon()) {
      fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parties }),
      }).catch(console.error);
    }
  },

  addParty(party: Omit<InvitedParty, "id">): InvitedParty {
    const parties = this.getParties();
    const newParty: InvitedParty = {
      id: "pty-" + Date.now(),
      ...party,
    };
    const updated = [newParty, ...parties];
    this.saveParties(updated);
    if (shouldSyncToNeon()) {
      fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newParty),
      }).catch(console.error);
    }
    return newParty;
  },

  updateParty(id: string, updates: Partial<InvitedParty>) {
    const parties = this.getParties();
    const updated = parties.map((p) => (p.id === id ? { ...p, ...updates, lastUpdated: new Date().toLocaleString() } : p));
    this.saveParties(updated);
    const target = updated.find((p) => p.id === id);
    if (target && shouldSyncToNeon()) {
      fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      }).catch(console.error);
    }
  },

  deleteParty(id: string) {
    const parties = this.getParties();
    const updated = parties.filter((p) => p.id !== id);
    this.saveParties(updated);
    if (shouldSyncToNeon()) {
      fetch(`/api/guests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }).catch(console.error);
    }
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
    if (shouldSyncToNeon()) {
      fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "theme_colors", data: colors }),
      }).catch(console.error);
    }
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

  // Couple & Wedding Ceremony Information
  getCoupleInfo(): CoupleInfo {
    if (typeof window === "undefined") return getInitialCoupleInfo();
    const saved = localStorage.getItem(STORAGE_KEYS.COUPLE_INFO);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const defaults = getInitialCoupleInfo();
        return {
          ...defaults,
          ...parsed,
          envelopeTitle: parsed.envelopeTitle || defaults.envelopeTitle,
          envelopeDate: parsed.envelopeDate || defaults.envelopeDate,
          envelopeAction: parsed.envelopeAction || defaults.envelopeAction,
          envelopeSubtitle: parsed.envelopeSubtitle || defaults.envelopeSubtitle,
          heroLocation: parsed.heroLocation || defaults.heroLocation,
          heroVerse: parsed.heroVerse || defaults.heroVerse,
          heroVerseCitation: parsed.heroVerseCitation || defaults.heroVerseCitation,
          ceremonyName: parsed.ceremonyName || defaults.ceremonyName,
          ceremonySubtitle: parsed.ceremonySubtitle || defaults.ceremonySubtitle,
          ceremonySchedule: parsed.ceremonySchedule || defaults.ceremonySchedule,
          ceremonyAddress: parsed.ceremonyAddress || defaults.ceremonyAddress,
          ceremonyCity: parsed.ceremonyCity || defaults.ceremonyCity,
          ceremonyNotes: parsed.ceremonyNotes || defaults.ceremonyNotes,
          ceremonyMapsUrl: parsed.ceremonyMapsUrl || defaults.ceremonyMapsUrl,
          ceremonyWazeUrl: parsed.ceremonyWazeUrl || defaults.ceremonyWazeUrl,
          receptionName: parsed.receptionName || defaults.receptionName,
          receptionSubtitle: parsed.receptionSubtitle || defaults.receptionSubtitle,
          receptionSchedule: parsed.receptionSchedule || defaults.receptionSchedule,
          receptionAddress: parsed.receptionAddress || defaults.receptionAddress,
          receptionCity: parsed.receptionCity || defaults.receptionCity,
          receptionNotes: parsed.receptionNotes || defaults.receptionNotes,
          receptionMapsUrl: parsed.receptionMapsUrl || defaults.receptionMapsUrl,
          receptionWazeUrl: parsed.receptionWazeUrl || defaults.receptionWazeUrl,
          footerVerse: parsed.footerVerse || defaults.footerVerse,
          footerVerseCitation: parsed.footerVerseCitation || defaults.footerVerseCitation,
          footerCredit: parsed.footerCredit ?? defaults.footerCredit,
          bgMusicYoutubeUrl: parsed.bgMusicYoutubeUrl || defaults.bgMusicYoutubeUrl,
          bgMusicTitle: parsed.bgMusicTitle || defaults.bgMusicTitle,
          bgMusicArtist: parsed.bgMusicArtist || defaults.bgMusicArtist,
        };
      } catch {
        return getInitialCoupleInfo();
      }
    }
    const init = getInitialCoupleInfo();
    localStorage.setItem(STORAGE_KEYS.COUPLE_INFO, JSON.stringify(init));
    return init;
  },

  saveCoupleInfo(info: CoupleInfo) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.COUPLE_INFO, JSON.stringify(info));
    window.dispatchEvent(new Event("wedding_couple_updated"));
    if (shouldSyncToNeon()) {
      fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "couple_info", data: info }),
      }).catch(console.error);
    }
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
    if (shouldSyncToNeon()) {
      fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "entourage", data: entourage }),
      }).catch(console.error);
    }
  },

  addEntourageMember(categoryIndex: number, member: { role: string; name: string }): EntourageMember | null {
    const list = this.getEntourage();
    if (!list[categoryIndex]) return null;
    const newMember: EntourageMember = {
      id: `m-${categoryIndex}-${Date.now()}`,
      role: member.role.trim(),
      name: member.name.trim(),
    };
    list[categoryIndex].members.push(newMember);
    this.saveEntourage(list);
    return newMember;
  },

  updateEntourageMember(categoryIndex: number, memberId: string, updates: { role: string; name: string }) {
    const list = this.getEntourage();
    if (!list[categoryIndex]) return;
    list[categoryIndex].members = list[categoryIndex].members.map((m) =>
      m.id === memberId
        ? { ...m, role: updates.role.trim(), name: updates.name.trim() }
        : m
    );
    this.saveEntourage(list);
  },

  deleteEntourageMember(categoryIndex: number, memberId: string) {
    const list = this.getEntourage();
    if (!list[categoryIndex]) return;
    list[categoryIndex].members = list[categoryIndex].members.filter((m) => m.id !== memberId);
    this.saveEntourage(list);
  },

  addEntourageCategory(categoryName: string) {
    const list = this.getEntourage();
    list.push({
      id: "cat-" + Date.now(),
      category: categoryName.trim(),
      members: [],
    });
    this.saveEntourage(list);
  },

  // Clear demo / test data helper
  clearAllGuestData() {
    this.saveParties([]);
    this.saveRsvps([]);
    if (shouldSyncToNeon()) {
      fetch("/api/guests?clearAll=true", { method: "DELETE" }).catch(console.error);
      fetch("/api/rsvp?clearAll=true", { method: "DELETE" }).catch(console.error);
    }
  },

  // RSVPs
  getRsvps(): RsvpEntry[] {
    if (typeof window === "undefined") return getInitialRsvps();
    const saved = localStorage.getItem(STORAGE_KEYS.RSVPS);
    if (saved) {
      try {
        const parsed: RsvpEntry[] = JSON.parse(saved);
        const hasLegacyMock = parsed.some(
          (r) =>
            ["rsvp-1", "rsvp-2"].includes(r.id) ||
            (r.fullName && r.fullName.toLowerCase().includes("roberto gomez"))
        );
        if (hasLegacyMock) {
          localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify([]));
          return [];
        }
        return parsed;
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
    if (shouldSyncToNeon()) {
      fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsvps }),
      }).catch(console.error);
    }
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

    if (shouldSyncToNeon()) {
      fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      }).catch(console.error);
    }

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
    if (shouldSyncToNeon()) {
      fetch("/api/rsvp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      }).catch(console.error);
    }
  },

  deleteRsvp(id: string) {
    const rsvps = this.getRsvps();
    const updated = rsvps.filter((r) => r.id !== id);
    this.saveRsvps(updated);
    if (shouldSyncToNeon()) {
      fetch(`/api/rsvp?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }).catch(console.error);
    }
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

  // Site Images & Media Assets
  getSiteImages(): SiteImages {
    if (typeof window === "undefined") return getInitialSiteImages();
    const saved = localStorage.getItem(STORAGE_KEYS.SITE_IMAGES);
    if (saved) {
      try {
        return { ...getInitialSiteImages(), ...JSON.parse(saved) };
      } catch {
        return getInitialSiteImages();
      }
    }
    const init = getInitialSiteImages();
    localStorage.setItem(STORAGE_KEYS.SITE_IMAGES, JSON.stringify(init));
    return init;
  },

  saveSiteImages(images: SiteImages) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_IMAGES, JSON.stringify(images));
    } catch (err) {
      console.warn("Storage quota warning (iOS/WebKit): saving to memory/remote:", err);
    }
    window.dispatchEvent(new Event("wedding_images_updated"));
    if (shouldSyncToNeon()) {
      fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "site_images", data: images }),
      }).catch(console.error);
    }
  },

  updateSiteImage(key: keyof SiteImages, url: string) {
    const current = this.getSiteImages();
    current[key] = url;
    this.saveSiteImages(current);

    // Keep dress code cards in sync if attire or hero poster is updated
    if (key === "guestAttire") {
      this.updateDressCode("dc-guest", { image: url });
    } else if (key === "ladiesAttire") {
      this.updateDressCode("dc-ninang-ninong", { image: url });
    } else if (key === "heroPoster") {
      this.updateDressCode("dc-bride-groom", { image: url });
    }
  },

  resetSiteImage(key: keyof SiteImages) {
    const defaults = getInitialSiteImages();
    this.updateSiteImage(key, defaults[key]);
  },

  resetAllSiteImages() {
    this.saveSiteImages(getInitialSiteImages());
  },

  // 3 Dress Code Guidelines (Brides & Grooms, Ninang & Ninong, Guests)
  getDressCodes(): DressCodeItem[] {
    if (typeof window === "undefined") return getInitialDressCodes();
    const saved = localStorage.getItem(STORAGE_KEYS.DRESS_CODES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
      } catch {
        return getInitialDressCodes();
      }
    }
    const init = getInitialDressCodes();
    localStorage.setItem(STORAGE_KEYS.DRESS_CODES, JSON.stringify(init));
    return init;
  },

  saveDressCodes(dressCodes: DressCodeItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.DRESS_CODES, JSON.stringify(dressCodes));
    window.dispatchEvent(new Event("wedding_dress_codes_updated"));
    if (shouldSyncToNeon()) {
      fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "dress_codes", data: dressCodes }),
      }).catch(console.error);
    }
  },

  updateDressCode(id: string, updates: Partial<DressCodeItem>) {
    const list = this.getDressCodes();
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    this.saveDressCodes(updated);
  },

  resetDressCodes() {
    this.saveDressCodes(getInitialDressCodes());
  },

  // Wedding Timeline
  getTimeline(): TimelineEvent[] {
    if (typeof window === "undefined") return getInitialTimeline();
    const saved = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return getInitialTimeline();
      }
    }
    const init = getInitialTimeline();
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(init));
    return init;
  },

  saveTimeline(timeline: TimelineEvent[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(timeline));
    window.dispatchEvent(new Event("wedding_timeline_updated"));
    if (shouldSyncToNeon()) {
      fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "timeline", data: timeline }),
      }).catch(console.error);
    }
  },

  addTimelineItem(item: Omit<TimelineEvent, "id">): TimelineEvent {
    const current = this.getTimeline();
    const newItem: TimelineEvent = {
      id: "tl-" + Date.now(),
      ...item,
    };
    const updated = [...current, newItem];
    this.saveTimeline(updated);
    return newItem;
  },

  updateTimelineItem(id: string, updates: Partial<TimelineEvent>) {
    const current = this.getTimeline();
    const updated = current.map((i) => (i.id === id ? { ...i, ...updates } : i));
    this.saveTimeline(updated);
  },

  deleteTimelineItem(id: string) {
    const current = this.getTimeline();
    const updated = current.filter((i) => i.id !== id);
    this.saveTimeline(updated);
  },

  resetTimeline() {
    this.saveTimeline(getInitialTimeline());
  },

  // Global Neon Database Hydration
  async syncFromDb() {
    if (typeof window === "undefined") return;
    try {
      const [configRes, guestsRes, rsvpsRes] = await Promise.all([
        fetch("/api/config").then((r) => r.json()).catch(() => null),
        fetch("/api/guests").then((r) => r.json()).catch(() => null),
        fetch("/api/rsvp").then((r) => r.json()).catch(() => null),
      ]);

      if (configRes && configRes.success) {
        if (configRes.coupleInfo) {
          localStorage.setItem(STORAGE_KEYS.COUPLE_INFO, JSON.stringify(configRes.coupleInfo));
          window.dispatchEvent(new Event("wedding_couple_updated"));
        }
        if (configRes.themeColors) {
          localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(configRes.themeColors));
          window.dispatchEvent(new Event("wedding_theme_updated"));
        }
        if (configRes.entourage) {
          localStorage.setItem(STORAGE_KEYS.ENTOURAGE, JSON.stringify(configRes.entourage));
          window.dispatchEvent(new Event("wedding_entourage_updated"));
        }
        if (configRes.siteImages) {
          localStorage.setItem(STORAGE_KEYS.SITE_IMAGES, JSON.stringify(configRes.siteImages));
          window.dispatchEvent(new Event("wedding_images_updated"));
        }
        if (configRes.dressCodes) {
          localStorage.setItem(STORAGE_KEYS.DRESS_CODES, JSON.stringify(configRes.dressCodes));
          window.dispatchEvent(new Event("wedding_dress_codes_updated"));
        }
        if (configRes.timeline) {
          localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(configRes.timeline));
          window.dispatchEvent(new Event("wedding_timeline_updated"));
        }
      }

      if (guestsRes && guestsRes.success && Array.isArray(guestsRes.parties)) {
        localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(guestsRes.parties));
        window.dispatchEvent(new Event("wedding_parties_updated"));
      }

      if (rsvpsRes && rsvpsRes.success && Array.isArray(rsvpsRes.rsvps)) {
        localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(rsvpsRes.rsvps));
        window.dispatchEvent(new Event("wedding_rsvps_updated"));
      }
    } catch (err) {
      console.warn("Neon DB sync skipped:", err);
    }
  },
};

// Automatic hydration from Neon PostgreSQL on client load
if (typeof window !== "undefined") {
  setTimeout(() => {
    weddingStore.syncFromDb().catch(() => {});
  }, 100);
}

