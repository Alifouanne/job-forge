"use client";

// Duration selector component for job listing pricing tiers
// Allows users to select job posting duration with visual pricing information
// Integrates with React Hook Form for form state management

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import type { ControllerRenderProps } from "react-hook-form";
import { jobListingPricing } from "@/lib/jobListingPricing";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { CalendarDays, Check } from "lucide-react";

/**
 * Props interface for the DurationSelector component
 */
interface Props {
  /** React Hook Form field object containing value, onChange, and other form control properties */
  field: ControllerRenderProps;
}

/**
 * Duration Selector Component
 *
 * This component allows users to select the duration for their job listing
 * from predefined pricing tiers. Each option displays duration, price, and description.
 *
 * Features:
 * - Radio group selection with single choice behavior
 * - Visual pricing cards with hover and selection states
 * - Price per day calculation for easy comparison
 * - Smooth animations and transitions
 * - Accessible keyboard navigation
 * - Integration with React Hook Form
 * - Visual feedback with icons (calendar/checkmark)
 *
 * Pricing Display:
 * - Shows total price prominently
 * - Calculates and displays price per day
 * - Includes descriptive text for each tier
 * - Visual distinction between selected and unselected options
 *
 * @param field - React Hook Form controller field for managing form state
 */
const DurationSelector = ({ field }: Props) => {
  return (
    <RadioGroup
      value={field.value?.toString()} // Convert number to string for radio group
      onValueChange={(value) => field.onChange(Number.parseInt(value))} // Convert back to number for form
    >
      <div className="flex flex-col gap-3">
        {jobListingPricing.map((duration) => {
          // Check if current duration option is selected
          const isSelected = field.value === duration.days;

          return (
            <div key={duration.days} className="relative">
              {/* Hidden radio input for accessibility */}
              <RadioGroupItem
                value={duration.days.toString()}
                id={duration.days.toString()}
                className="sr-only" // Screen reader only - visually hidden but accessible
              />

              {/* Clickable label that wraps the entire card */}
              <Label
                className="flex cursor-pointer flex-col"
                htmlFor={duration.days.toString()}
              >
                <Card
                  className={cn(
                    "border-2 p-4 transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md" // Selected state styling
                      : "border-input shadow-sm hover:border-primary/30 hover:bg-secondary/30 hover:shadow-md hover:translate-y-[-1px] active:translate-y-[1px]" // Unselected state with hover effects
                  )}
                >
                  <div className="flex items-center justify-between">
                    {/* Left side: Icon and duration information */}
                    <div className="flex items-start gap-3">
                      {/* Icon container with conditional styling */}
                      <div
                        className={cn(
                          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                          isSelected
                            ? "bg-primary text-primary-foreground" // Selected icon styling
                            : "bg-muted text-muted-foreground" // Unselected icon styling
                        )}
                      >
                        {/* Show checkmark for selected, calendar for unselected */}
                        {isSelected ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <CalendarDays className="h-5 w-5" />
                        )}
                      </div>

                      {/* Duration details */}
                      <div>
                        {/* Duration in days */}
                        <p className="text-base font-medium">
                          {duration.days} Days
                        </p>

                        {/* Description of the duration tier */}
                        <p className="text-sm text-muted-foreground">
                          {duration.description}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Pricing information */}
                    <div className="text-right">
                      {/* Total price prominently displayed */}
                      <p className="text-xl font-bold text-primary">
                        ${duration.price}
                      </p>

                      {/* Price per day calculation for easy comparison */}
                      <p className="text-sm text-muted-foreground">
                        ${(duration.price / duration.days).toFixed(2)}/day
                      </p>
                    </div>
                  </div>
                </Card>
              </Label>
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
};

export default DurationSelector;
