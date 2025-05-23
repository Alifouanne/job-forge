"use client";

// Salary range selector component for job posting forms
// Provides dual-handle slider for setting minimum and maximum salary values
// Integrates with React Hook Form for seamless form state management

import { useState } from "react";
import { Slider } from "../ui/slider";
import { type Control, useController } from "react-hook-form";
import { formatCurrency } from "@/lib/formatCurrency";

/**
 * Props interface for the SalaryRange component
 */
interface Props {
  /** React Hook Form control object for managing form state */
  control: Control<any>;
  /** Minimum allowed salary value for the slider */
  minSalary: number;
  /** Maximum allowed salary value for the slider */
  maxSalary: number;
  /** Step increment for slider values (e.g., 1000 for $1k increments) */
  step: number;
  /** Currency code for formatting display (e.g., "USD") */
  currency: string;
}

/**
 * Salary Range Component
 *
 * This component provides an intuitive dual-handle slider for selecting salary ranges
 * It's designed for job posting forms where employers need to specify min/max compensation
 *
 * Features:
 * - Dual-handle slider for minimum and maximum salary selection
 * - Real-time currency formatting for better readability
 * - Integration with React Hook Form for form validation and state management
 * - Visual feedback with hover effects on salary displays
 * - Configurable min/max bounds and step increments
 * - Automatic synchronization between slider and form fields
 * - Responsive design that works on all device sizes
 *
 * Form Integration:
 * - Connects to "salaryFrom" and "salaryTo" form fields
 * - Updates form state in real-time as user drags slider handles
 * - Maintains form validation and error handling
 *
 * @param control - React Hook Form control for managing form state
 * @param currency - Currency code for formatting (e.g., "USD")
 * @param maxSalary - Maximum allowed salary value
 * @param minSalary - Minimum allowed salary value
 * @param step - Step increment for slider values
 */
const SalaryRange = ({
  control,
  currency,
  maxSalary,
  minSalary,
  step,
}: Props) => {
  // Connect to React Hook Form fields for salary range
  const { field: fromField } = useController({
    name: "salaryFrom", // Form field for minimum salary
    control: control,
  });
  const { field: toField } = useController({
    name: "salaryTo", // Form field for maximum salary
    control: control,
  });

  // Local state for slider values with initial values from form or defaults
  const [range, setRange] = useState<[number, number]>([
    fromField.value || minSalary, // Use form value or minimum as default
    toField.value || maxSalary / 2, // Use form value or half of maximum as default
  ]);

  /**
   * Handles slider value changes and updates both local state and form fields
   * Ensures synchronization between the visual slider and form data
   *
   * @param value - Array of two numbers representing the new slider range
   */
  const handleChangeRange = (value: number[]) => {
    // Convert to tuple for type safety
    const newRange: [number, number] = [value[0], value[1]];

    // Update local state for immediate UI feedback
    setRange(newRange);

    // Update form fields to maintain form state synchronization
    fromField.onChange(newRange[0]); // Update minimum salary field
    toField.onChange(newRange[1]); // Update maximum salary field
  };

  return (
    <div className="w-full space-y-4">
      {/* Dual-handle slider for range selection */}
      <div className="px-1">
        <Slider
          min={minSalary} // Set minimum boundary
          max={maxSalary} // Set maximum boundary
          step={step} // Set increment step (e.g., 1000 for $1k steps)
          value={range} // Current slider values
          onValueChange={handleChangeRange} // Handle value changes
          className="transition-all duration-200" // Smooth transitions for interactions
        />
      </div>

      {/* Display current salary range values with currency formatting */}
      <div className="flex justify-between text-sm font-medium">
        {/* Minimum salary display */}
        <span className="rounded-md bg-primary/10 px-2 py-1 text-primary transition-all duration-200 hover:bg-primary/15">
          {formatCurrency(range[0])}
        </span>

        {/* Maximum salary display */}
        <span className="rounded-md bg-primary/10 px-2 py-1 text-primary transition-all duration-200 hover:bg-primary/15">
          {formatCurrency(range[1])}
        </span>
      </div>
    </div>
  );
};

export default SalaryRange;
