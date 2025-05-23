"use client";

// User type selection form component
// First step in the onboarding process where users choose their account type
// Provides visual selection between company (employer) and job seeker roles

import { Button } from "@/components/ui/button";
import { HomeIcon } from "@/components/ui/home";
import { UserIcon } from "@/components/ui/user";

/**
 * User type definition for account selection
 * Determines the user's role and subsequent onboarding flow
 */
type UserSelectionType = "company" | "jobSeeker";

/**
 * Props interface for the UserTypeForm component
 */
interface Props {
  /**
   * Callback function triggered when user selects an account type
   * Passes the selected type back to parent component
   */
  onSelect: (type: UserSelectionType) => void;
}

/**
 * User Type Selection Form Component
 *
 * This component presents the initial choice between company and job seeker accounts
 * It's the first step in the onboarding process and determines the subsequent flow
 *
 * Features:
 * - Clear visual distinction between account types
 * - Descriptive text explaining each option
 * - Interactive hover and click effects
 * - Iconic representation of each account type
 * - Responsive design for all device sizes
 *
 * UX Considerations:
 * - Large, easy-to-click target areas
 * - Visual feedback on interaction (hover, active states)
 * - Clear, concise descriptions of each option
 * - Consistent styling with the platform's design language
 *
 * @param onSelect - Callback function to handle user selection
 */
const UserTypeForm = ({ onSelect }: Props) => {
  return (
    <div className="space-y-6">
      {/* Header section with welcome message */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium">
          Welcome! Let&apos;s get started
        </h2>
        <p className="text-muted-foreground">
          Choose how you would like to use our platform
        </p>
      </div>

      {/* Account type selection buttons */}
      <div className="grid gap-4">
        {/* Company/Employer option */}
        <Button
          onClick={() => onSelect("company")}
          variant="outline"
          className="group relative w-full h-auto p-5 flex items-center gap-4 border border-input bg-background shadow-sm transition-all duration-150 hover:shadow-md hover:border-primary/50 hover:translate-y-[-1px] active:translate-y-[1px]"
        >
          {/* Company icon with animation */}
          <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <HomeIcon className="size-5 text-primary" />
          </div>

          {/* Company description text */}
          <div className="text-left">
            <h3 className="font-medium text-base">Company</h3>
            <p className="text-sm text-muted-foreground">
              Post jobs and find great talent
            </p>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-md" />
        </Button>

        {/* Job Seeker option */}
        <Button
          onClick={() => onSelect("jobSeeker")}
          variant="outline"
          className="group relative w-full h-auto p-5 flex items-center gap-4 border border-input bg-background shadow-sm transition-all duration-150 hover:shadow-md hover:border-primary/50 hover:translate-y-[-1px] active:translate-y-[1px]"
        >
          {/* Job seeker icon with animation */}
          <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <UserIcon className="size-5 text-primary" />
          </div>

          {/* Job seeker description text */}
          <div className="text-left">
            <h3 className="font-medium text-base">Job Seeker</h3>
            <p className="text-sm text-muted-foreground">
              Find your dream job opportunity
            </p>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-md" />
        </Button>
      </div>
    </div>
  );
};

export default UserTypeForm;
