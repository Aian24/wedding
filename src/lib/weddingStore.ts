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
    localStorage.setItem(STORAGE_KEYS.SITE_IMAGES, JSON.stringify(images));
    window.dispatchEvent(new Event("wedding_images_updated"));
  },

  updateSiteImage(key: keyof SiteImages, url: string) {
    const current = this.getSiteImages();
    current[key] = url;
    this.saveSiteImages(current);
  },

  resetSiteImage(key: keyof SiteImages) {
    const defaults = getInitialSiteImages();
    this.updateSiteImage(key, defaults[key]);
  },

  resetAllSiteImages() {
    this.saveSiteImages(getInitialSiteImages());
  },
};
