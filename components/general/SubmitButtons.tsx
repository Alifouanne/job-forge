"use client";

// Submit button components for form submissions with loading states
// Provides consistent button styling and loading indicators for better UX
// Includes specialized variants for different actions like saving jobs

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { HandHeartIcon } from "../ui/hand-heart";

/**
 * Props interface for the GeneralSubmitButton component
 */
interface Props {
  /** Button text content */
  text: string;
  /** Button style variant from shadcn/ui button component */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  /** Additional CSS classes to apply to the button */
  className?: string;
  /** Optional icon element to display before the text */
  icon?: ReactNode;
}

/**
 * General Submit Button Component
 *
 * This component provides a consistent button for form submissions
 * with automatic loading state handling and icon support
 *
 * Features:
 * - Automatic pending state detection using useFormStatus
 * - Loading spinner during form submission
 * - Support for all button variants from shadcn/ui
 * - Optional icon placement before text
 * - Consistent loading text ("Submitting...")
 * - Automatic disabling during submission to prevent double-clicks
 * - Flexible styling through className prop
 *
 * Common Use Cases:
 * - Form submission buttons
 * - Authentication actions
 * - Data saving operations
 * - Any server action that requires loading feedback
 *
 * @param text - Button text content
 * @param variant - Button style variant
 * @param className - Additional CSS classes
 * @param icon - Optional icon element
 */
export const GeneralSubmitButton = ({
  text,
  variant,
  className,
  icon,
}: Props) => {
  // Get form submission status from React's useFormStatus hook
  // This automatically tracks if the parent form is currently submitting
  const { pending } = useFormStatus();

  return (
    <Button variant={variant} className={cn(className)} disabled={pending}>
      {pending ? (
        // Loading state with spinner and "Submitting..." text
        <>
          <Loader2 className="size-4 animate-spin" /> <span>Submiting...</span>
        </>
      ) : (
        // Default state with optional icon and text
        <>
          {icon && <div>{icon}</div>}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
};

/**
 * Save Job Button Component
 *
 * This specialized button component handles job saving functionality
 * with visual feedback for saved/unsaved states
 *
 * Features:
 * - Visual distinction between saved and unsaved states
 * - Heart icon that fills with color when job is saved
 * - Automatic loading state during save operation
 * - Consistent styling with other application buttons
 * - Automatic disabling during submission to prevent double-clicks
 *
 * States:
 * - Unsaved: Outline button with "Save Job" text and unfilled heart icon
 * - Saved: Outline button with "Saved" text and filled red heart icon
 * - Loading: Disabled button with spinner and "Saving..." text
 *
 * @param savedJob - Boolean indicating if the job is currently saved
 */
export const SaveJobButton = ({ savedJob }: { savedJob: boolean }) => {
  // Get form submission status from React's useFormStatus hook
  // This automatically tracks if the parent form is currently submitting
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" type="submit" disabled={pending}>
      {pending ? (
        // Loading state with spinner and "Saving..." text
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        // Default state with heart icon and appropriate text
        <>
          <HandHeartIcon
            className={cn(
              savedJob ? "fill-current text-red-500" : "", // Fill heart with red when saved
              "size-4 transition-colors" // Smooth color transition effect
            )}
          />
          {savedJob ? "Saved" : "Save Job"}{" "}
          {/* Text changes based on saved state */}
        </>
      )}
    </Button>
  );
};
