// Main application layout component
// Provides consistent structure for all authenticated/main application pages
// Includes navigation, responsive container, and common UI elements

import Navbar from "@/components/general/Navbar";
import type React from "react";

/**
 * Main Layout Component
 *
 * This layout wraps all the primary application pages that require navigation
 * and consistent container sizing. It's typically used for authenticated pages
 * after login/onboarding is complete.
 *
 * Features:
 * - Global navigation bar for application-wide navigation
 * - Responsive container with appropriate padding for different screen sizes
 * - Consistent bottom padding for all pages
 * - Centralized layout management for the main application flow
 *
 * Route group:
 * This component is likely placed in a route group (main) to separate it from
 * authentication flows, marketing pages, or other specialized sections
 *
 * @param children - The page content to be rendered within this layout
 */
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // Main container with responsive width and padding
    // max-w-7xl (1280px) provides a good balance for readability on large screens
    // while maintaining a focused layout
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
      {/* Global navigation component */}
      {/* Provides consistent navigation across all main application pages */}
      {/* Includes links to key sections, user profile, and application controls */}
      <Navbar />

      {/* Page content container */}
      {/* Each page within the (main) route group will be rendered here */}
      {/* This allows for consistent layout while page content changes */}
      {children}
    </div>
  );
};

export default MainLayout;
