import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
        />
      </head>
      <body className="min-h-screen bg-[#fafbfc] text-[#1a2530] font-body selection:bg-[#7094b7] selection:text-white">
        {children}
      </body>
    </html>
  );
}
