import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export const metadata: Metadata = {
  title: {
    default: "SKYFALL — Free Fire India Tournament Management Platform",
    template: "%s | SKYFALL",
  },
  description:
    "Discover, register, and compete in Free Fire India esports tournaments with automated brackets and verified manual UPI payments.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-skyfall-500 selection:text-white">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
