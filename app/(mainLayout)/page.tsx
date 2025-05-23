// Homepage component for the Job Forge application
// Serves as the main entry point for job searching functionality
// Displays job listings with filtering capabilities and pagination

import JobFilters from "@/components/general/JobFillters";
import JobListings from "@/components/general/JobListings";

/**
 * Homepage Component
 *
 * This is the main landing page for authenticated users of the application
 * It provides a comprehensive job search interface with filters and listings
 *
 * Features:
 * - URL-based search parameters for shareable/bookmarkable searches
 * - Job type filtering (full-time, part-time, contract, etc.)
 * - Location-based filtering
 * - Pagination for browsing through large sets of job listings
 * - Responsive layout that adapts to different screen sizes
 * - Staggered animations for improved perceived performance
 *
 * @param searchParams - URL query parameters for filtering and pagination
 *   - page: Current page number for pagination
 *   - jobTypes: Comma-separated list of job types to filter by
 *   - location: Location string to filter jobs by geographic area
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    jobTypes?: string;
    location?: string;
  }>;
}) {
  // Extract and process search parameters from URL
  const { page, jobTypes, location } = await searchParams;

  // Convert page parameter to number with default of 1
  const currentPage = Number(page) || 1;

  // Split comma-separated job types into array or use empty array if none provided
  const jobTypesSplit = jobTypes?.split(",") || [];

  // Use provided location or empty string as default
  const locationmod = location || "";

  return (
    // Main container with responsive padding
    <div className="container mx-auto px-4 py-6">
      {/* Page header section with title and description */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="mb-2 text-2xl font-medium">
          Find Your Next Opportunity
        </h1>
        <p className="text-muted-foreground">
          Browse through our curated list of job opportunities
        </p>
      </div>

      {/* Main content grid with filters and job listings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Filters sidebar - sticks to top on large screens */}
        {/* Animation is delayed slightly for staggered entrance effect */}
        <div className="animate-fadeIn [animation-delay:100ms] lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-md border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md">
            {/* Job filters component handles all filtering UI and logic */}
            <JobFilters />
          </div>
        </div>

        {/* Job listings section - takes 2/3 of space on large screens */}
        {/* Animation is delayed further for staggered entrance effect */}
        <div className="col-span-1 flex animate-fadeIn flex-col gap-6 [animation-delay:200ms] lg:col-span-2">
          {/* Job listings component displays the actual job cards */}
          {/* Receives filter parameters from URL search params */}
          <JobListings
            currentPage={currentPage}
            jobTypes={jobTypesSplit}
            location={locationmod}
          />
        </div>
      </div>
    </div>
  );
}
