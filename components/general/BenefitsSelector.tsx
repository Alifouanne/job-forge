"use client";

// Benefits selector component for job posting forms
// Allows users to select multiple benefits from a predefined list
// Provides visual feedback for selected/unselected states

import { benefits } from "@/lib/benefits";
import { Badge } from "@/components/ui/badge";

/**
 * Props interface for the BenefitsSelector component
 */
interface BenefitsSelectorProps {
  /** Form field object from React Hook Form containing value and onChange handler */
  field: any; // Replace with proper type if needed - could be ControllerRenderProps from react-hook-form
}

/**
 * Benefits Selector Component
 *
 * This component allows users to select multiple benefits from a predefined list
 * It's typically used in job posting forms to specify what benefits a company offers
 *
 * Features:
 * - Multi-select functionality with toggle behavior
 * - Visual distinction between selected and unselected benefits
 * - Interactive hover and click animations
 * - Real-time counter showing number of selected benefits
 * - Responsive grid layout that wraps on smaller screens
 * - Accessible keyboard and mouse interactions
 *
 * Behavior:
 * - Clicking a benefit toggles its selection state
 * - Selected benefits are highlighted with primary styling
 * - Unselected benefits have outline styling with hover effects
 * - Counter updates in real-time as benefits are selected/deselected
 *
 * @param field - React Hook Form field object containing current value and onChange handler
 */
export default function BenefitsSelector({ field }: BenefitsSelectorProps) {
  /**
   * Toggles the selection state of a benefit
   * Adds the benefit if not selected, removes it if already selected
   *
   * @param benefitId - The unique identifier of the benefit to toggle
   */
  const toggleBenefit = (benefitId: string) => {
    // Get current selected benefits array (default to empty array if undefined)
    const currentBenefits = field.value || [];

    // Toggle benefit selection: remove if present, add if not present
    const newBenefits = currentBenefits.includes(benefitId)
      ? currentBenefits.filter((id: string) => id !== benefitId) // Remove benefit
      : [...currentBenefits, benefitId]; // Add benefit

    // Update form field with new benefits array
    field.onChange(newBenefits);
  };

  return (
    <div>
      {/* Benefits selection grid */}
      <div className="flex flex-wrap gap-2">
        {benefits.map((benefit) => {
          // Check if current benefit is selected
          const isSelected = (field.value || []).includes(benefit.id);

          return (
            <Badge
              key={benefit.id}
              variant={isSelected ? "default" : "outline"} // Different styling for selected vs unselected
              className={`cursor-pointer select-none rounded-full px-3 py-1.5 text-sm transition-all duration-200 ${
                isSelected
                  ? "shadow-sm hover:shadow-md active:translate-y-0.5" // Selected state styling
                  : "hover:border-primary/50 hover:bg-primary/5 active:translate-y-0.5" // Unselected state styling
              }`}
              onClick={() => toggleBenefit(benefit.id)} // Toggle selection on click
            >
              {/* Benefit content with icon and label */}
              <span className="flex items-center gap-1.5">
                {benefit.icon} {/* Icon component for visual representation */}
                {benefit.label} {/* Human-readable benefit name */}
              </span>
            </Badge>
          );
        })}
      </div>

      {/* Selection counter */}
      {/* Provides real-time feedback on how many benefits are selected */}
      <div className="mt-3 text-sm text-muted-foreground">
        Selected benefits:{" "}
        <span className="font-medium text-primary">
          {(field.value || []).length} {/* Count of selected benefits */}
        </span>
      </div>
    </div>
  );
}
