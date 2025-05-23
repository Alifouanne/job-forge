// Payment cancellation page component
// Displays a user-friendly message when a payment process is cancelled
// Requires user authentication before showing the cancellation confirmation

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { XIcon } from "@/components/ui/x";
import { reqUser } from "@/lib/auth";

/**
 * Cancel Page Component
 *
 * This page is typically reached when a user cancels a payment process
 * (e.g., during job posting payment or subscription cancellation)
 *
 * Features:
 * - User authentication requirement
 * - Animated success/error feedback
 * - Clear messaging about no charges
 * - Easy navigation back to homepage
 */
const CancelPage = async () => {
  // Ensure user is authenticated before showing cancellation page
  // This prevents unauthorized access and ensures proper user context
  await reqUser();

  return (
    // Full-screen container with centered content
    <div className="flex min-h-screen w-full flex-1 items-center justify-center">
      {/* Animated background effect positioned behind the card */}
      <BackgroundBeams className="-z-30" />

      {/* Main content card with hover effects and animations */}
      <Card className="w-[350px] animate-fadeIn border shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="p-6">
          {/* Icon section with centered red X icon indicating cancellation */}
          <div className="flex w-full justify-center">
            <div className="animate-success-bounce">
              {/* Red X icon with background styling to indicate cancellation/error state */}
              <XIcon className="size-12 rounded-full bg-red-500/30 p-2 text-red-500" />
            </div>
          </div>

          {/* Content section with title, description, and action button */}
          <div className="mt-4 w-full text-center sm:mt-5">
            {/* Main heading indicating payment was cancelled */}
            <h2 className="text-xl font-medium">Payment Cancelled</h2>

            {/* Reassuring message that no charges were made */}
            {/* Note: There's a typo "yoy" that should be "you" */}
            <p className="mt-2 text-balance text-sm text-muted-foreground">
              No worries! yoy will not be charged. please try again
            </p>

            {/* Call-to-action button to return to homepage */}
            <Button
              asChild // Renders as Link component instead of button element
              className="mt-6 w-full shadow-sm transition-all duration-200 hover:shadow-md active:translate-y-0.5"
            >
              {/* Navigation link back to the main application */}
              <Link href="/">Go back to Homepage</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CancelPage;
