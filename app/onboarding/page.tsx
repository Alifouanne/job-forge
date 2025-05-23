// User onboarding page component
// Handles the initial setup process for new users after registration
// Ensures users complete required profile information before accessing the main application

import OnBoardingForm from "@/components/forms/onboarding/OnBoardingForm";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { reqUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

/**
 * Checks if the user has already completed the onboarding process
 * Prevents users from accessing onboarding page multiple times
 *
 * @param userId - The unique identifier of the user to check
 * @returns User data if onboarding is incomplete, redirects to homepage if complete
 */
const checkOnboardingstatus = async (userId: string) => {
  // Query database to get user's onboarding completion status
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onBoardingCompleted: true, // Only fetch the onboarding status field for efficiency
    },
  });

  // If user has already completed onboarding, redirect them to homepage
  // This prevents duplicate onboarding and ensures proper user flow
  if (user?.onBoardingCompleted === true) {
    return redirect("/");
  }

  // Return user data if onboarding is still needed
  return user;
};

/**
 * OnBoarding Page Component
 *
 * This page is shown to new users who need to complete their profile setup
 * It's a crucial step in the user journey that collects essential information
 *
 * Features:
 * - Authentication requirement (must be logged in)
 * - Automatic redirect if onboarding already completed
 * - Full-screen centered layout for focus
 * - Animated background for visual appeal
 * - Integration with onboarding form component
 */
const OnBoardingPage = async () => {
  // Ensure user is authenticated before allowing access to onboarding
  // This prevents unauthorized users from accessing the onboarding flow
  const session = await reqUser();

  // Check if user has already completed onboarding
  // Will redirect to homepage if already done, preventing duplicate setup
  await checkOnboardingstatus(session.id as string);

  return (
    // Full-screen container with centered content for focused user experience
    <div className="min-h-screen w-screen flex flex-col items-center justify-center py-10">
      {/* Animated background beams positioned behind the form */}
      <BackgroundBeams className="-z-30" />

      {/* Main onboarding form component that handles user profile setup */}
      {/* This form will collect essential user information like company details, preferences, etc. */}
      <OnBoardingForm />
    </div>
  );
};

export default OnBoardingPage;
