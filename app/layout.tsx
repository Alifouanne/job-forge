import type React from "react";
// Root layout component for the Next.js application
// This component wraps all pages and provides global styling, fonts, and providers

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/general/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { BackgroundBeams } from "@/components/ui/background-beams";

// Configure the primary sans-serif font (Geist) with CSS variable for global usage
const poppins = Poppins({
  variable: "--font-sans", // CSS custom property for the font
  subsets: ["latin"], // Only load Latin character subset for performance,
  weight: ["300", "400", "500", "600", "700"],
});

// SEO metadata configuration for the application
export const metadata: Metadata = {
  title: "Job Forge", // Browser tab title and search engine title
  description: "Discover a world of opportunities", // Meta description for SEO
};

/**
 * Root layout component that wraps all pages in the application
 * Provides global styling, theme management, notifications, and background effects
 *
 * @param children - All page content that will be rendered within this layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <BackgroundBeams className="-z-50" />
          <Toaster closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
