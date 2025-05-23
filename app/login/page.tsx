// Login page component
// Provides user authentication interface with email/password and social login options
// Serves as the entry point for returning users to access their accounts

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/icon.png";
import LoginForm from "@/components/forms/LoginForm";
import { BackgroundBeams } from "@/components/ui/background-beams";

/**
 * Login Page Component
 *
 * This page handles user authentication for existing users
 * It provides a clean, focused interface for logging into the application
 *
 * Features:
 * - Brand identity with logo and name
 * - Navigation back to homepage
 * - Clean card-based layout for the login form
 * - Visual background effects for enhanced UX
 * - Responsive design that works on all devices
 * - Integration with the main authentication form component
 */
const LoginPage = () => {
  return (
    // Full-screen container with centered content for focused login experience
    <main className="min-h-screen w-full grid place-items-center">
      {/* Animated background effect positioned behind the login form */}
      <BackgroundBeams className="-z-30" />

      {/* Content container with width constraints for optimal form size */}
      <div className="w-full max-w-sm mx-auto p-6 space-y-8">
        {/* Logo and Brand Section */}
        {/* Provides visual identity and navigation back to homepage */}
        <Link
          href="/"
          className="flex items-center gap-3 justify-center transition-transform duration-200 hover:scale-105"
        >
          {/* Application logo with priority loading for fast LCP */}
          <Image
            src={Logo || "/placeholder.svg"} // Fallback to placeholder if logo is unavailable
            alt="Logo" // Accessible alt text for screen readers
            className="size-12 object-contain" // Maintain aspect ratio
            priority // Load with high priority as it's above the fold
          />

          {/* Brand name with highlighted accent color on "Forge" */}
          <h1 className="text-3xl font-bold tracking-tight">
            Job <span className="text-primary">Forge</span>
          </h1>
        </Link>

        {/* Login Form Card Container */}
        {/* Provides visual separation and elevation for the form */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          {/* Login form component handles all authentication logic */}
          {/* This includes email/password login, social providers, and error handling */}
          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
