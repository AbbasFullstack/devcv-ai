import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevCV AI | Build the resume that gets read",
  description: "AI-powered resume analysis and improvement workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
