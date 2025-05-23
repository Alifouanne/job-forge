"use client";

// Mobile navigation menu component for responsive design
// Provides a collapsible menu for mobile devices with user authentication features
// Includes theme toggle, job posting access, and user account management

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import ThemeToggleButton from "../ui/theme-toggle-button";
import type { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { HandHeartIcon } from "../ui/hand-heart";
import { LayersIcon } from "../ui/layers";
import { LogoutIcon } from "../ui/logout";
import { handleSignOut } from "@/lib/actions";

/**
 * Props interface for the MobileMenu component
 */
interface MobileMenuProps {
  /** User session object containing authentication state and user information */
  session: Session | null;
}

/**
 * Mobile Menu Component
 *
 * This component provides a responsive navigation menu for mobile devices
 * It adapts its content based on user authentication status and provides
 * essential navigation options in a compact, touch-friendly format
 *
 * Features:
 * - Collapsible hamburger menu with smooth animations
 * - Theme toggle integration for dark/light mode switching
 * - Conditional rendering based on authentication status
 * - User profile display with avatar and account information
 * - Quick access to key features (favorites, job listings, job posting)
 * - Secure logout functionality with server action
 * - Animated entrance with slide-in effect
 * - Auto-close on navigation to improve UX
 *
 * Layout Structure:
 * 1. Hamburger/X toggle button
 * 2. Dropdown menu with:
 *    - Theme toggle control
 *    - Post Job button (with animated border)
 *    - User section (if authenticated):
 *      - Avatar and user info
 *      - Navigation links (Favorites, My Jobs)
 *      - Logout button
 *    - Login button (if not authenticated)
 *
 * @param session - User session object for authentication state
 */
const MobileMenu = ({ session }: MobileMenuProps) => {
  // State to control menu open/closed status
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggles the mobile menu open/closed state
   * Provides smooth transition between hamburger and X icons
   */
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger/X toggle button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle mobile menu" // Accessibility label for screen readers
      >
        {/* Dynamic icon based on menu state */}
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Dropdown menu - only rendered when open */}
      {isOpen && (
        <div className="absolute top-16 right-4 w-56 rounded-md border bg-background shadow-lg animate-in slide-in-from-top-5">
          <div className="p-3 flex flex-col gap-2">
            {/* Theme toggle section */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggleButton variant="circle" start="top-left" />
            </div>

            {/* Post Job button with animated border effect */}
            <Link
              href="/post-job"
              className="relative w-full overflow-hidden rounded-md p-[1px] focus:outline-none"
              onClick={() => setIsOpen(false)} // Close menu on navigation
            >
              {/* Animated gradient border */}
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              {/* Button content with backdrop blur effect */}
              <span className="block w-full rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white text-center backdrop-blur-3xl">
                Post Job
              </span>
            </Link>

            {/* Conditional rendering based on authentication status */}
            {session?.user ? (
              // Authenticated user section
              <div className="pt-2">
                {/* User profile display */}
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={(session.user.image as string) || "/placeholder.svg"}
                      alt={session.user.name as string}
                    />
                    <AvatarFallback>
                      {/* Fallback to first letter of name or 'U' */}
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    {/* User name with text truncation for long names */}
                    <span className="text-sm font-medium truncate max-w-[180px]">
                      {session.user.name}
                    </span>
                    {/* User email with muted styling and truncation */}
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {session.user.email}
                    </span>
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Navigation links section */}
                <div className="space-y-1 pt-1">
                  {/* Favorites link */}
                  <Link
                    href="/favorites"
                    className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setIsOpen(false)} // Close menu on navigation
                  >
                    <HandHeartIcon size={16} className="opacity-60" />
                    <span>Favorites Jobs</span>
                  </Link>

                  {/* My Job Listings link */}
                  <Link
                    href="/my-jobs"
                    className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setIsOpen(false)} // Close menu on navigation
                  >
                    <LayersIcon size={16} className="opacity-60" />
                    <span>My Job Listings</span>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Logout form with server action */}
                  <form action={handleSignOut} className="w-full">
                    <button
                      type="submit"
                      className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-left hover:bg-accent"
                      // Note: onClick to close menu is commented out because form submission
                      // will redirect the user, making menu closure unnecessary
                    >
                      <LogoutIcon size={16} className="opacity-60" />
                      <span>Logout</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              // Non-authenticated user section - show login button
              <Link
                href="/login"
                className={buttonVariants({
                  className: "w-full",
                })}
                onClick={() => setIsOpen(false)} // Close menu on navigation
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
