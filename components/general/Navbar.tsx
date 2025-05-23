// Main navigation component for the application
// Provides consistent header with branding, navigation, and user authentication
// Adapts to different screen sizes with responsive design

import Link from "next/link";
import Logo from "@/public/icon.png";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { auth } from "@/lib/auth";
import { SparklesText } from "../magicui/sparkles-text";
import UserDropdown from "./UserDropdown";
import ThemeToggleButton from "../ui/theme-toggle-button";
import MobileMenu from "./MobileMenu";

/**
 * Navbar Component
 *
 * This server component provides the main navigation header for the application
 * It handles authentication state, branding, and navigation links
 *
 * Features:
 * - Server-side authentication check for personalized navigation
 * - Responsive design with desktop and mobile layouts
 * - Animated branding with sparkle text effect
 * - Theme toggle for dark/light mode switching
 * - User dropdown menu for authenticated users
 * - Mobile menu for smaller screens
 * - Sticky positioning with backdrop blur for modern UI
 * - Animated post job button with gradient border
 *
 * Layout Structure:
 * 1. Left side: Logo and brand name with link to homepage
 * 2. Right side (Desktop): Theme toggle, Post Job button, User dropdown/Login
 * 3. Right side (Mobile): Hamburger menu with expanded navigation
 *
 * Authentication States:
 * - Logged in: Shows user dropdown with profile and options
 * - Logged out: Shows login button
 */
const Navbar = async () => {
  // Fetch authentication session server-side
  // This provides user information if logged in, or null if not authenticated
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Brand Name - Left Side */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          >
            {/* Application logo with fallback */}
            <Image
              src={Logo || "/placeholder.svg"}
              alt="Logo Image"
              width={40}
              height={40}
              className="object-contain"
            />
            {/* Brand name with sparkle animation effect */}
            <h1 className="text-2xl font-bold">
              <SparklesText text="Job Forge" className="text-2xl font-bold" />
            </h1>
          </Link>

          {/* Desktop Navigation - Right Side (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-5">
            {/* Theme toggle button for dark/light mode */}
            <ThemeToggleButton variant="circle" start="top-left" />

            {/* Post Job button with animated gradient border */}
            <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              {/* Animated gradient border effect */}
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              {/* Button content with backdrop blur */}
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                <Link href="/post-job">Post Job</Link>
              </span>
            </button>

            {/* Conditional rendering based on authentication status */}
            {session?.user ? (
              // Authenticated: Show user dropdown with profile and options
              <UserDropdown
                email={session.user.email as string}
                image={session.user.image as string}
                name={session.user.name as string}
              />
            ) : (
              // Not authenticated: Show login button
              <Link
                href={"/login"}
                className={buttonVariants({
                  size: "lg",
                  className:
                    "transition-transform duration-200 hover:scale-105",
                })}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu - Right Side (Visible only on Mobile) */}
          <div className="md:hidden">
            <MobileMenu session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
