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
  invitedParties: {
    id: string;
    partyName: string;
    primaryGuest: string;
    email?: string;
    phone?: string;
    maxSeats: number;
    members: {
      id: string;
      name: string;
      role?: string;
      isAttending: boolean;
    }[];
    tableNumber?: string;
    status?: "pending" | "confirmed" | "declined";
    notes?: string;
  }[];
}

export const weddingData: WeddingData = {
  invitedParties: [
    {
      id: "pty-guest-1",
      partyName: "Tito & Gloria Basagre",
      primaryGuest: "Tito Basagre",
      maxSeats: 2,
      tableNumber: "Table 1",
      status: "confirmed",
      members: [
        { id: "m-1-1", name: "Tito Basagre", role: "Primary Guest", isAttending: true },
        { id: "m-1-2", name: "Gloria Basagre", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-2",
      partyName: "Cecilia De Jesus & Danilo Rivera",
      primaryGuest: "Cecilia De Jesus",
      maxSeats: 2,
      tableNumber: "Table 1",
      status: "confirmed",
      members: [
        { id: "m-2-1", name: "Cecilia De Jesus", role: "Primary Guest", isAttending: true },
        { id: "m-2-2", name: "Danilo Rivera", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-3",
      partyName: "Daniela Rivera",
      primaryGuest: "Daniela Rivera",
      maxSeats: 1,
      tableNumber: "Table 2",
      status: "confirmed",
      members: [
        { id: "m-3-1", name: "Daniela Rivera", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-4",
      partyName: "Gian Basagre",
      primaryGuest: "Gian Basagre",
      maxSeats: 1,
      tableNumber: "Table 2",
      status: "confirmed",
      members: [
        { id: "m-4-1", name: "Gian Basagre", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-5",
      partyName: "Michelle Accad & Melvin Garcia",
      primaryGuest: "Michelle Accad",
      maxSeats: 4,
      tableNumber: "Table 3",
      status: "confirmed",
      members: [
        { id: "m-5-1", name: "Michelle Accad", role: "Primary Guest", isAttending: true },
        { id: "m-5-2", name: "Melvin Garcia", role: "Guest", isAttending: true },
        { id: "m-5-3", name: "Malia Garcia", role: "Flower Girl", isAttending: true },
        { id: "m-5-4", name: "Cassey Garcia", role: "Flower Girl", isAttending: true },
      ],
    },
    {
      id: "pty-guest-6",
      partyName: "Michael Rivera & Clariz Penoz",
      primaryGuest: "Michael Rivera",
      maxSeats: 3,
      tableNumber: "Table 3",
      status: "confirmed",
      members: [
        { id: "m-6-1", name: "Michael Rivera", role: "Primary Guest", isAttending: true },
        { id: "m-6-2", name: "Clariz Penoz", role: "Guest", isAttending: true },
        { id: "m-6-3", name: "Dylan Penoz", role: "Secondary Sponsor", isAttending: true },
      ],
    },
    {
      id: "pty-guest-7",
      partyName: "Jessa Rivera",
      primaryGuest: "Jessa Rivera",
      maxSeats: 1,
      tableNumber: "Table 4",
      status: "confirmed",
      members: [
        { id: "m-7-1", name: "Jessa Rivera", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-8",
      partyName: "Ma. Cherry Lane Oriola & Rain",
      primaryGuest: "Ma. Cherry Lane Oriola",
      maxSeats: 2,
      tableNumber: "Table 4",
      status: "confirmed",
      members: [
        { id: "m-8-1", name: "Ma. Cherry Lane Oriola", role: "Primary Guest", isAttending: true },
        { id: "m-8-2", name: "Rain", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-9",
      partyName: "Jhean Anne Revillo",
      primaryGuest: "Jhean Anne Revillo",
      maxSeats: 1,
      tableNumber: "Table 4",
      status: "confirmed",
      members: [
        { id: "m-9-1", name: "Jhean Anne Revillo", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-10",
      partyName: "Carmina Alea Logatiman",
      primaryGuest: "Carmina Alea Logatiman",
      maxSeats: 1,
      tableNumber: "Table 4",
      status: "confirmed",
      members: [
        { id: "m-10-1", name: "Carmina Alea Logatiman", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-11",
      partyName: "Elyza Balontong",
      primaryGuest: "Elyza Balontong",
      maxSeats: 1,
      tableNumber: "Table 5",
      status: "confirmed",
      members: [
        { id: "m-11-1", name: "Elyza Balontong", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-12",
      partyName: "MJ Portes & Gian Carlo Rivera",
      primaryGuest: "MJ Portes",
      maxSeats: 2,
      tableNumber: "Table 5",
      status: "confirmed",
      members: [
        { id: "m-12-1", name: "MJ Portes", role: "Primary Guest", isAttending: true },
        { id: "m-12-2", name: "Gian Carlo Rivera", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-13",
      partyName: "John Merk Tagacay",
      primaryGuest: "John Merk Tagacay",
      maxSeats: 1,
      tableNumber: "Table 5",
      status: "confirmed",
      members: [
        { id: "m-13-1", name: "John Merk Tagacay", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-14",
      partyName: "Christian Accad & Star",
      primaryGuest: "Christian Accad",
      maxSeats: 2,
      tableNumber: "Table 5",
      status: "confirmed",
      members: [
        { id: "m-14-1", name: "Christian Accad", role: "Primary Guest", isAttending: true },
        { id: "m-14-2", name: "Star", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-15",
      partyName: "Jed Steven",
      primaryGuest: "Jed Steven",
      maxSeats: 1,
      tableNumber: "Table 6",
      status: "confirmed",
      members: [
        { id: "m-15-1", name: "Jed Steven", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-16",
      partyName: "Michael Riera",
      primaryGuest: "Michael Riera",
      maxSeats: 1,
      tableNumber: "Table 6",
      status: "confirmed",
      members: [
        { id: "m-16-1", name: "Michael Riera", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-17",
      partyName: "Angelo Gabriel Celicous",
      primaryGuest: "Angelo Gabriel Celicous",
      maxSeats: 1,
      tableNumber: "Table 6",
      status: "confirmed",
      members: [
        { id: "m-17-1", name: "Angelo Gabriel Celicous", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-18",
      partyName: "Jayson Falabi & Wife",
      primaryGuest: "Jayson Falabi",
      maxSeats: 2,
      tableNumber: "Table 6",
      status: "confirmed",
      members: [
        { id: "m-18-1", name: "Jayson Falabi", role: "Primary Guest", isAttending: true },
        { id: "m-18-2", name: "Wife of Jayson", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-19",
      partyName: "Angelo Gayda",
      primaryGuest: "Angelo Gayda",
      maxSeats: 1,
      tableNumber: "Table 6",
      status: "confirmed",
      members: [
        { id: "m-19-1", name: "Angelo Gayda", role: "Primary Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-20",
      partyName: "Arnel & Monaliza De Jesus",
      primaryGuest: "Arnel De Jesus",
      maxSeats: 2,
      tableNumber: "Table 7",
      status: "confirmed",
      members: [
        { id: "m-20-1", name: "Arnel De Jesus", role: "Primary Guest", isAttending: true },
        { id: "m-20-2", name: "Monaliza De Jesus", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-21",
      partyName: "Marco & Jona Molina",
      primaryGuest: "Marco Molina",
      maxSeats: 5,
      tableNumber: "Table 7",
      status: "confirmed",
      members: [
        { id: "m-21-1", name: "Marco Molina", role: "Primary Guest", isAttending: true },
        { id: "m-21-2", name: "Jona Molina", role: "Guest", isAttending: true },
        { id: "m-21-3", name: "MJ Molina", role: "Secondary Sponsor", isAttending: true },
        { id: "m-21-4", name: "Najah Molina", role: "Guest", isAttending: true },
        { id: "m-21-5", name: "Jenna Molina", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-22",
      partyName: "KC & JR Ofilas",
      primaryGuest: "KC Ofilas",
      maxSeats: 4,
      tableNumber: "Table 8",
      status: "confirmed",
      members: [
        { id: "m-22-1", name: "KC Ofilas", role: "Primary Guest", isAttending: true },
        { id: "m-22-2", name: "JR Ofilas", role: "Guest", isAttending: true },
        { id: "m-22-3", name: "Azriel Ofilas", role: "Flower Boy", isAttending: true },
        { id: "m-22-4", name: "Sabria Ofilas", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-23",
      partyName: "Zyler Viel & Marvin Rivera",
      primaryGuest: "Zyler Viel Rivera",
      maxSeats: 2,
      tableNumber: "Table 8",
      status: "confirmed",
      members: [
        { id: "m-23-1", name: "Zyler Viel Rivera", role: "Primary Guest", isAttending: true },
        { id: "m-23-2", name: "Marvin Rivera", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-24",
      partyName: "Zachary Rivera & Companion",
      primaryGuest: "Zachary Rivera",
      maxSeats: 2,
      tableNumber: "Table 8",
      status: "confirmed",
      members: [
        { id: "m-24-1", name: "Zachary Rivera", role: "Primary Guest", isAttending: true },
        { id: "m-24-2", name: "Yaya", role: "Guest", isAttending: true },
      ],
    },
    {
      id: "pty-guest-25",
      partyName: "Bella Martina De Jesus & Companions",
      primaryGuest: "Bella Martina De Jesus",
      maxSeats: 3,
      tableNumber: "Table 8",
      status: "confirmed",
      members: [
        { id: "m-25-1", name: "Bella Martina De Jesus", role: "Primary Guest", isAttending: true },
        { id: "m-25-2", name: "Julie Baisi", role: "Guest", isAttending: true },
        { id: "m-25-3", name: "Jane Tutor", role: "Guest", isAttending: true },
      ],
    },
  ],
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
      { name: "Dusty Blue", hex: "#7B9EBD", desc: "For Bridesmaids & Groomsmen" },
      { name: "Slate Blue", hex: "#4C6B8B", desc: "For Ninang & Ninong" },
      { name: "Classic Blue", hex: "#2B5B84", desc: "For Guests" },
      { name: "Navy Blue", hex: "#1B365D", desc: "For Bearers & Little Attendants" },
      { name: "Midnight Blue", hex: "#101F3C", desc: "For Principal Sponsors" },
      { name: "Soft Blue", hex: "#A5C8E4", desc: "For Guests" },
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
      icon: "party-popper",
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
      category: "Secondary Sponsors",
      members: [
        { role: "Candle Sponsors", name: "Justin Ramos & Sofia Mendoza" },
        { role: "Veil Sponsors", name: "Miguel Santos & Stephanie Tan" },
        { role: "Cord Sponsors", name: "Gabriel Lopez & Janice Yu" },
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
      category: "Bridesmaids & Groomsmen",
      members: [
        { role: "Bridesmaid", name: "Camille Joy Perez" },
        { role: "Groomsman", name: "Mark Anthony Lim" },
        { role: "Bridesmaid", name: "Alyssa Marie Garcia" },
        { role: "Groomsman", name: "John David Sy" },
        { role: "Bridesmaid", name: "Bea Nicole Flores" },
        { role: "Groomsman", name: "Patrick Vince Hernandez" },
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
