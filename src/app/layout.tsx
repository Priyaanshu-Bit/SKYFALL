import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKYFALL — Free Fire India Tournament Management Platform",
  description:
    "Organise, register, and compete in Free Fire India esports tournaments. Real-time brackets, manual UPI verification, and competitive esports leagues.",
  keywords: ["Free Fire", "Tournament", "Esports", "SKYFALL", "Gaming"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#090d16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="bg-background text-foreground antialiased min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
