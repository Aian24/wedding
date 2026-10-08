export interface WeddingData {
  groom: {
    fullName: string;
    nickname: string;
    parents: string;
    bio: string;
  };
  bride: {
    fullName: string;
    nickname: string;
    parents: string;
    bio: string;
  };
  date: {
    fullDate: string; // e.g. "December 12, 2026"
    time: string; // e.g. "3:00 PM"
    dayOfWeek: string;
    isoDateTime: string; // "2026-12-12T15:00:00"
  };
  hashtag: string;
  theme: {
    name: string;
    description: string;
    colors: { name: string; hex: string; desc: string }[];
  };
  ceremony: {
    name: string;
    subtitle: string;
    time: string;
    address: string;
    city: string;
    mapsUrl: string;
    wazeUrl: string;
    image: string;
    notes: string;
  };
  reception: {
    name: string;
    subtitle: string;
    time: string;
    address: string;
    city: string;
    mapsUrl: string;
    wazeUrl: string;
    image: string;
    notes: string;
  };
  loveStory: {
    year: string;
    title: string;
    description: string;
    tag: string;
  }[];
  timeline: {
    time: string;
    title: string;
    description: string;
    icon: string;
  }[];
  entourage: {
    category: string;
    members: { role: string; name: string }[];
  }[];
  dressCode: {
    title: string;
    description: string;
    guidelines: {
      category: string;
      attire: string;
      description: string;
    }[];
    importantNote: string;
  };
  accommodations: {
    name: string;
    distance: string;
    address: string;
    rateRange: string;
    phone: string;
    website: string;
    highlight: string;
  }[];
  faqs: {
    question: string;
    answer: string;
    category: string;
  }[];
  gifts: {
    wishingWellMessage: string;
    bankAccounts: {
      provider: string;
      accountName: string;
      accountNumber: string;
      qrPlaceholder?: string;
      type: "Bank Transfer" | "E-Wallet";
      badge: string;
    }[];
    registryItems: {
      id: string;
      name: string;
      category: string;
      priceEstimate: string;
      isClaimed: boolean;
      claimedBy?: string;
    }[];
  };
}

export const weddingData: WeddingData = {
  groom: {
    fullName: "Aian Christopher Ramos",
    nickname: "Aian",
    parents: "Mr. Eduardo Ramos & Mrs. Cristina Ramos",
    bio: "The calm to her storm, her constant anchor, and the man who fell head over heels the moment she walked into his life.",
  },
  bride: {
    fullName: "Ma. Andrea 'Dang' Santos",
    nickname: "Dang",
    parents: "Mr. Antonio Santos & Mrs. Evelyn Santos",
    bio: "The vibrant spark of joy, full of laughter and grace, who found her lifetime best friend and soulmate in Aian.",
  },
  date: {
    fullDate: "Saturday, December 12, 2026",
    time: "3:00 PM (PHT)",
    dayOfWeek: "Saturday",
    isoDateTime: "2026-12-12T15:00:00",
  },
  hashtag: "#AianGotHisDangGirl",
  theme: {
    name: "Classic White & Dusty Blue Elegance",
    description:
      "A serene and timeless palette celebrating crisp pure white, delicate dusty blues, rich slate navy, and luminous champagne accents.",
    colors: [
      { name: "Dusty Blue", hex: "#7B9EBD", desc: "For Bridesmaids & Accent Details" },
      { name: "Slate Blue", hex: "#4C6B8B", desc: "For Secondary Sponsors & Florals" },
      { name: "Midnight Navy", hex: "#1A2E44", desc: "For Groomsmen Suits & Tuxedos" },
      { name: "Ice Blue", hex: "#D6E5F3", desc: "For Linens & Delicate Ribbons" },
      { name: "Pure Pearl", hex: "#FFFFFF", desc: "Strictly Reserved for the Bride" },
      { name: "Champagne Gold", hex: "#DFC28D", desc: "For Accessories & Stationery Gold Foil" },
    ],
  },
  ceremony: {
    name: "St. Mary's Coastal Cathedral",
    subtitle: "Holy Matrimony & Sacred Vows Exchange",
    time: "3:00 PM Sharp (Guests to be seated by 2:30 PM)",
    address: "Seaside Boulevard, Oceanview Promenade",
    city: "Tagaytay / Metro Coastal",
    mapsUrl: "https://maps.google.com/?q=Cathedral+Wedding+Venue",
    wazeUrl: "https://waze.com/ul",
    image: "/images/ceremony.jpg",
    notes:
      "Please arrive promptly by 2:30 PM to settle in before the processional commences. We respectfully request an unplugged ceremony.",
  },
  reception: {
    name: "The Grand Sapphire Pavilion & Ballroom",
    subtitle: "Dinner Banquet, Cocktails & Evening Dancing",
    time: "5:30 PM Onwards",
    address: "Estate Grounds, Royal Garden View",
    city: "Tagaytay / Metro Coastal",
    mapsUrl: "https://maps.google.com/?q=Sapphire+Ballroom+Reception",
    wazeUrl: "https://waze.com/ul",
    image: "/images/reception.jpg",
    notes:
      "Cocktails and sunset canapés will be served upon arrival at 5:00 PM, followed by the grand entrance and sumptuous dinner banquet.",
  },
  loveStory: [
    {
      year: "2018",
      title: "Where It All Began",
      description:
        "A chance encounter on a rainy afternoon turned into a 4-hour conversation over warm matcha latte. What started as friendly banter quickly sparked a connection neither of them saw coming.",
      tag: "First Encounter",
    },
    {
      year: "2020",
      title: "Growing Stronger Through Everyday Moments",
      description:
        "Through countless road trips, cooking experiments, late-night talks, and supporting each other's dreams, their love blossomed into a steady, unconditional sanctuary.",
      tag: "The Journey",
    },
    {
      year: "2024",
      title: "Under the Sunset Bluffs: She Said YES!",
      description:
        "Overlooking the boundless ocean at golden hour, Aian got down on one knee with tears of joy. Dang exclaimed YES before he could even finish his speech!",
      tag: "The Proposal",
    },
    {
      year: "2026",
      title: "Our Forever Chapter Begins",
      description:
        "Surrounded by the people who mean the world to us, we step into eternity hand-in-hand to pledge our forever vows before God and family.",
      tag: "The Wedding Day",
    },
  ],
  timeline: [
    {
      time: "02:00 PM",
      title: "Guest Arrival & Welcome Drinks",
      description: "Arrive at the cathedral, sign the guest registry, and enjoy refreshing iced lemon tea.",
      icon: "users",
    },
    {
      time: "03:00 PM",
      title: "Holy Matrimony & Vow Ceremony",
      description: "Bridal processional, exchange of sacred wedding vows and rings.",
      icon: "church",
    },
    {
      time: "04:30 PM",
      title: "Solemn Blessings & Group Photos",
      description: "Family, sponsor, and entourage commemorative photography with the newlyweds.",
      icon: "camera",
    },
    {
      time: "05:00 PM",
      title: "Sunset Cocktails & Grazing Table",
      description: "Head over to the Ballroom terrace for artisanal cocktails, champagne, and appetizers.",
      icon: "wine",
    },
    {
      time: "06:15 PM",
      title: "Grand Entrance & Welcome Remarks",
      description: "Welcome the newly wedded couple Aian & Dang with cheer and sparklers!",
      icon: "sparkles",
    },
    {
      time: "06:45 PM",
      title: "Dinner Feast & Celebratory Speeches",
      description: "Lavish plated dinner banquet accompanied by live acoustic serenade.",
      icon: "utensils",
    },
    {
      time: "07:45 PM",
      title: "Cake Cutting, Toast & First Dance",
      description: "The couple's romantic first dance under starry fairy chandeliers.",
      icon: "music",
    },
    {
      time: "08:30 PM",
      title: "Bouquet Toss, Games & Open Bar Party",
      description: "Live DJ, open cocktail bar, dancing, and midnight snacks.",
      icon: "party-popper",
    },
  ],
  entourage: [
    {
      category: "Parents of the Couple",
      members: [
        { role: "Parents of the Groom", name: "Mr. Eduardo Ramos & Mrs. Cristina Ramos" },
        { role: "Parents of the Bride", name: "Mr. Antonio Santos & Mrs. Evelyn Santos" },
      ],
    },
    {
      category: "Principal Sponsors (Ninongs & Ninangs)",
      members: [
        { role: "Godfather & Godmother", name: "Hon. Roberto Gomez & Dra. Maria Teresa Gomez" },
        { role: "Godfather & Godmother", name: "Engr. Manuel Cruz & Mrs. Patricia Cruz" },
        { role: "Godfather & Godmother", name: "Atty. Fernando Rivera & Mrs. Carmela Rivera" },
        { role: "Godfather & Godmother", name: "Dr. Arthur Tan & Dra. Sylvia Tan" },
      ],
    },
    {
      category: "Best Man & Maid of Honor",
      members: [
        { role: "Best Man", name: "Christian Paul Ramos" },
        { role: "Maid of Honor", name: "Katarina Denise Santos" },
      ],
    },
    {
      category: "Groomsmen & Bridesmaids",
      members: [
        { role: "Groomsman", name: "Mark Anthony Lim" },
        { role: "Bridesmaid", name: "Camille Joy Perez" },
        { role: "Groomsman", name: "John David Sy" },
        { role: "Bridesmaid", name: "Alyssa Marie Garcia" },
        { role: "Groomsman", name: "Patrick Vince Hernandez" },
        { role: "Bridesmaid", name: "Bea Nicole Flores" },
      ],
    },
    {
      category: "Secondary Sponsors",
      members: [
        { role: "Candle Sponsors", name: "Justin Ramos & Sofia Mendoza" },
        { role: "Veil Sponsors", name: "Miguel Santos & Stephanie Tan" },
        { role: "Cord Sponsors", name: "Gabriel Lopez & Janice Yu" },
      ],
    },
    {
      category: "Bearers & Flower Angels",
      members: [
        { role: "Ring Bearer", name: "Liam Alexander Santos" },
        { role: "Coin Bearer", name: "Lucas Gabriel Ramos" },
        { role: "Bible Bearer", name: "Mateo Elijah Cruz" },
        { role: "Flower Girl", name: "Mia Isabella Rivera" },
        { role: "Flower Girl", name: "Chloe Danielle Gomez" },
      ],
    },
  ],
  dressCode: {
    title: "Formal / Black Tie Optional in Shades of Blue & Slate",
    description:
      "We would love for our cherished guests to look and feel radiant in our wedding color palette of Dusty Blue, Slate Blue, Navy, and Soft Neutrals.",
    guidelines: [
      {
        category: "Ninongs & Gentlemen",
        attire: "Classic Formal Suit / Barong Tagalog",
        description:
          "Dark Navy or Slate Blue 2-piece/3-piece suit with necktie, or formal Embroidered Piña Barong Tagalog paired with black dress trousers and formal leather shoes.",
      },
      {
        category: "Ninangs & Ladies",
        attire: "Floor-Length or Elegant Midi Gown",
        description:
          "Evening gowns in shades of dusty blue, steel blue, pastel sapphire, or slate blue. Soft flowing fabrics like chiffon, silk, or lace are warmly encouraged.",
      },
    ],
    importantNote:
      "Note of Courtesy: We kindly request all lovely guests to refrain from wearing all-white, ivory, or cream dresses so our gorgeous bride Dang can shine on her special day.",
  },
  accommodations: [
    {
      name: "The Royal Vista Grand Resort & Spa",
      distance: "5 minutes from Venue (Official Partner)",
      address: "Ridge Point Highway, Tagaytay Highlands",
      rateRange: "Special Wedding Rate: 20% OFF with code 'AIANDANG2026'",
      phone: "+63 (02) 8888-7711",
      website: "https://example.com/hotel-vista",
      highlight: "Complimentary shuttle service to and from the church & reception.",
    },
    {
      name: "Sapphire Cliffside Boutique Hotel",
      distance: "8 minutes from Venue",
      address: "Sunset Strip Blvd, Tagaytay",
      rateRange: "From ₱4,500 / night",
      phone: "+63 (02) 8877-2233",
      website: "https://example.com/sapphire-hotel",
      highlight: "Stunning balcony views overlooking the sunset bay.",
    },
    {
      name: "Azure Garden Suites",
      distance: "12 minutes from Venue",
      address: "Botanical Valley Road, Tagaytay",
      rateRange: "From ₱3,200 / night",
      phone: "+63 (02) 8822-4499",
      website: "https://example.com/azure-suites",
      highlight: "Family-friendly villas and garden pools.",
    },
  ],
  faqs: [
    {
      category: "RSVP & Attendance",
      question: "When is the RSVP deadline?",
      answer:
        "Please confirm your attendance on or before November 1, 2026 using the built-in RSVP form below. This enables our caterer and seating planners to prepare your personalized dinner seat.",
    },
    {
      category: "RSVP & Attendance",
      question: "Can I bring a Plus One or extra companion?",
      answer:
        "Due to limited venue capacity and intimate seating arrangements, we can only accommodate guests formally listed on your invitation envelope / RSVP pass. Thank you for your warm understanding!",
    },
    {
      category: "Event Logistics",
      question: "What is an Unplugged Ceremony?",
      answer:
        "We have hired top-tier professional photographers and cinematographers to capture our sacred vows. We kindly ask guests to keep phones and cameras silenced and tucked away during the church ceremony so everyone can be fully present with us.",
    },
    {
      category: "Event Logistics",
      question: "Is there parking available at the church and ballroom?",
      answer:
        "Yes! Both the cathedral and reception ballroom feature ample complimentary guest parking with valet assistance at the grand ballroom drop-off entrance.",
    },
    {
      category: "Attire & Family",
      question: "Are children permitted at the reception?",
      answer:
        "While we adore your little ones, unless they are an appointed member of our wedding entourage, our reception will be an adult-focused evening of celebration and cocktails.",
    },
    {
      category: "Reception",
      question: "What kind of dinner will be served at the reception?",
      answer:
        "A lavish 5-course gourmet banquet dinner accompanied by an open cocktail bar, champagne toast, and midnight treats will be served for all our guests.",
    },
  ],
  gifts: {
    wishingWellMessage:
      "Your presence, prayers, and heartfelt blessings on our wedding day are the greatest gift we could ever receive. However, if you wish to honor us with a gift to help us build our new home and embark on our dream honeymoon journey, a monetary gift to our wishing well would be deeply appreciated.",
    bankAccounts: [
      {
        provider: "GCash",
        accountName: "Aian Christopher Ramos",
        accountNumber: "0917-888-2426",
        type: "E-Wallet",
        badge: "Instant Mobile Transfer",
      },
      {
        provider: "BPI (Bank of the Philippine Islands)",
        accountName: "Aian Ramos or Andrea Santos",
        accountNumber: "4329-1092-88",
        type: "Bank Transfer",
        badge: "Savings Account",
      },
      {
        provider: "BDO Unibank",
        accountName: "Ma. Andrea Santos",
        accountNumber: "0064-2819-3301",
        type: "Bank Transfer",
        badge: "Savings Account",
      },
      {
        provider: "Maya",
        accountName: "Ma. Andrea Santos",
        accountNumber: "0918-999-1212",
        type: "E-Wallet",
        badge: "Digital Wallet",
      },
    ],
    registryItems: [
      {
        id: "reg-1",
        name: "Artisanal Espresso Machine & Grinder",
        category: "Kitchen & Home",
        priceEstimate: "₱18,500",
        isClaimed: false,
      },
      {
        id: "reg-2",
        name: "Luxury French Linen Bedding Set (King)",
        category: "Master Bedroom",
        priceEstimate: "₱9,200",
        isClaimed: true,
        claimedBy: "Tita Elena & Tito Raul",
      },
      {
        id: "reg-3",
        name: "Smart Robotic Vacuum & Mop Cleaner",
        category: "Smart Home",
        priceEstimate: "₱14,800",
        isClaimed: false,
      },
      {
        id: "reg-4",
        name: "Le Creuset Enameled Cast Iron Dutch Oven (Cerulean Blue)",
        category: "Cookware",
        priceEstimate: "₱16,000",
        isClaimed: false,
      },
      {
        id: "reg-5",
        name: "Honeymoon Romantic Sunset Cruise in Amalfi Coast",
        category: "Honeymoon Experience",
        priceEstimate: "₱12,000",
        isClaimed: true,
        claimedBy: "College Best Friends",
      },
    ],
  },
};
