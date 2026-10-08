import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aian-dang-wedding.vercel.app"),
  title: "Aian & Dang | Wedding Celebration Invitation",
  description:
    "We cordially invite you to celebrate the holy matrimony and wedding celebration of Aian Christopher & Ma. Andrea 'Dang'. Saturday, December 12, 2026.",
  openGraph: {
    title: "Aian & Dang Wedding Invitation",
    description: "December 12, 2026 • Classic White & Dusty Blue Wedding",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Aian & Dang Wedding Invitation",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${greatVibes.variable} ${plusJakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#fafbfc] text-[#1a2530] font-body selection:bg-[#7094b7] selection:text-white">
        {children}
      </body>
    </html>
  );
}
