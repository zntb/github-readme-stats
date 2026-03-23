import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GitHub Readme Stats — URL Builder",
  description:
    "Dynamically generate beautiful stats cards for your GitHub readme with live preview",
  icons: {
    icon: "https://res.cloudinary.com/anuraghazra/image/upload/v1594908242/logo_ccswme.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${manrope.variable}`}
    >
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
