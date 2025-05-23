// Payment success confirmation page component
// Displays a congratulatory message when a payment process completes successfully
// Typically shown after successful job posting payment or subscription purchase
// Requires user authentication before showing the success confirmation

import { Card } from "@/components/ui/card";
import { CircleCheckIcon } from "@/components/ui/circle-check";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { reqUser } from "@/lib/auth";

/**
 * Success Page Component
 *
 * This page is typically reached after a successful payment transaction
 * (e.g., job posting payment, subscription purchase, or premium feature unlock)
 *
 * Features:
 * - User authentication requirement for security
 * - Animated success feedback with green checkmark
 * - Clear confirmation messaging
 * - Smooth navigation back to homepage
 * - Consistent styling with cancel page for unified UX
 */
const SuccessPage = async () => {
  // Ensure user is authenticated before showing success page
  // This prevents unauthorized access and maintains payment security
  // Also ensures we have proper user context for any follow-up actions
  await reqUser();

  return (
    // Full-screen container with centered layout for focus on success message
    <div className="flex min-h-screen w-full flex-1 items-center justify-center">
      {/* Animated background beams effect positioned behind the main content */}
      <BackgroundBeams className="-z-30" />

      {/* Main success card with entrance animation and hover effects */}
      <Card className="w-[350px] animate-fadeIn border shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="p-6">
          {/* Success icon section with centered green checkmark */}
          <div className="flex w-full justify-center">
            {/* Bouncing animation container for visual celebration */}
            <div className="animate-success-bounce">
              {/* Green checkmark icon with semi-transparent background */}
              {/* Indicates successful completion of payment process */}
              <CircleCheckIcon className="size-12 rounded-full bg-green-500/30 p-2 text-green-500" />
            </div>
          </div>

          {/* Content section with success message and navigation */}
          <div className="mt-4 w-full text-center sm:mt-5">
            {/* Main heading confirming successful payment */}
            <h2 className="text-xl font-medium">Payment Successful</h2>

            {/* Detailed success message explaining what happened */}
            {/* Confirms payment completion and job activation status */}
            <p className="mt-2 text-balance text-sm text-muted-foreground">
              Congratulations! Your payment was successful. Your job is now
              active!
            </p>

            {/* Call-to-action button to return to main application */}
            <Button
              asChild // Renders as Link component for proper navigation
              className="mt-6 w-full shadow-sm transition-all duration-200 hover:shadow-md active:translate-y-0.5"
            >
              {/* Navigation link back to homepage where user can see their active job */}
              <Link href="/">Go back to Homepage</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuccessPage;
