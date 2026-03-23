import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Readme Stats",
  description: "Dynamically generate stats for your GitHub readme",
  icons: {
    icon: "https://res.cloudinary.com/anuraghazra/image/upload/v1594908242/logo_ccswme.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
