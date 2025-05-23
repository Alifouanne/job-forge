"use client";

// Job filters component for filtering job listings by type and location
// Manages URL-based filter state for shareable and bookmarkable search results
// Provides real-time filtering without page reloads

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FilterX, Globe } from "lucide-react";
import { countryList } from "@/lib/countriesList";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Available job types for filtering
 * These correspond to the employment types available in job postings
 */
const JobTypes = ["full-time", "part-time", "contract", "internship"];

/**
 * Job Filters Component
 *
 * This component provides filtering functionality for job listings
 * It manages filter state through URL parameters for shareable searches
 *
 * Features:
 * - Multi-select job type filtering with checkboxes
 * - Location filtering with country dropdown
 * - URL-based state management for shareable/bookmarkable filters
 * - Real-time filtering without page reloads
 * - Clear all filters functionality
 * - Responsive design with hover effects
 * - Visual feedback for active filters
 *
 * Filter Types:
 * 1. Job Type: Multiple selection (full-time, part-time, contract, internship)
 * 2. Location: Single selection (worldwide/remote or specific countries)
 *
 * URL Structure:
 * - jobTypes: Comma-separated list of selected job types
 * - location: Selected location string
 */
const JobFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract current applied filters from URL parameters
  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];
  const currentLocation = searchParams.get("location") || "";

  /**
   * Clears all applied filters by navigating to the base URL
   * Removes all filter parameters and resets the job listings
   */
  const clearAllFilters = () => {
    router.push("/");
  };

  /**
   * Creates a new query string with updated filter parameters
   * Preserves existing parameters while updating or removing specific ones
   *
   * @param name - The parameter name to update
   * @param value - The new value for the parameter (empty string removes it)
   * @returns Updated query string
   */
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value); // Set parameter if value exists
    } else {
      params.delete(name); // Remove parameter if value is empty
    }
    return params.toString();
  };

  /**
   * Handles job type filter changes (checkbox interactions)
   * Manages multiple selection by adding/removing job types from the filter
   *
   * @param jobType - The job type being toggled
   * @param checked - Whether the checkbox is being checked or unchecked
   */
  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    const current = new Set(currentJobTypes);

    if (checked) {
      current.add(jobType); // Add job type to filter
    } else {
      current.delete(jobType); // Remove job type from filter
    }

    // Convert set back to comma-separated string for URL
    const newValue = Array.from(current).join(",");
    router.push(`?${createQueryString("jobTypes", newValue)}`);
  };

  /**
   * Handles location filter changes (dropdown selection)
   * Updates the location filter with the selected value
   *
   * @param location - The selected location value
   */
  const handleLocationChange = (location: string) => {
    router.push(`?${createQueryString("location", location)}`);
  };

  return (
    <Card className="h-fit overflow-hidden border bg-card transition-all duration-200">
      {/* Filter Header with Clear All Button */}
      <CardHeader className="flex flex-row items-center justify-between bg-muted/30 px-4 py-3">
        <CardTitle className="text-lg font-medium">Filters</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
          onClick={clearAllFilters}
        >
          <span className="text-xs">Clear All</span>
          <FilterX className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-5 p-4">
        {/* Job Type Filter Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Job Type</Label>
          <div className="grid grid-cols-2 gap-3">
            {JobTypes.map((job, index) => (
              <div
                key={index}
                className="group flex items-center space-x-2 rounded-md border border-transparent p-1.5 transition-all duration-200 hover:border-primary/20 hover:bg-primary/5"
              >
                <Checkbox
                  id={job}
                  className="h-4 w-4 border-muted-foreground/50 transition-all duration-200 group-hover:border-primary"
                  checked={currentJobTypes.includes(job)} // Check if job type is currently selected
                  onCheckedChange={(checked) =>
                    handleJobTypeChange(job, checked as boolean)
                  }
                />
                <Label
                  htmlFor={job}
                  className="cursor-pointer text-xs font-medium capitalize transition-colors duration-200 group-hover:text-primary"
                >
                  {job}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-1" />

        {/* Location Filter Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Location</Label>
          <Select
            value={currentLocation} // Set current selected location
            onValueChange={(location) => {
              handleLocationChange(location);
            }}
          >
            <SelectTrigger className="h-9 border-input bg-background text-sm shadow-sm transition-all duration-200 focus:border-primary/50 focus:shadow-md">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              {/* Worldwide/Remote Option */}
              <SelectGroup>
                <SelectLabel className="text-xs">Worldwide</SelectLabel>
                <SelectItem
                  value="worldwide"
                  className="flex items-center gap-2 text-sm"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Worldwide / Remote</span>
                </SelectItem>
              </SelectGroup>

              {/* Country List Options */}
              <SelectGroup>
                <SelectLabel className="text-xs">Location</SelectLabel>
                {countryList.map((country) => (
                  <SelectItem
                    value={country.name}
                    key={country.code}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span>{country.flagEmoji}</span>
                    <span>{country.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Commented out Apply Filters button - filters are applied in real-time */}
        {/* <Separator className="my-1" />

        <Button className="mt-2 w-full shadow-sm transition-all duration-200 hover:shadow-md active:translate-y-0.5">
          Apply Filters
        </Button> */}
      </CardContent>
    </Card>
  );
};

export default JobFilters;
