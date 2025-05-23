// Job listings component for displaying paginated job search results
// Handles data fetching, filtering, pagination, and loading states
// Provides a comprehensive job browsing experience with real-time filtering

import { prisma } from "@/lib/db";
import { Suspense } from "react";
import EmptyState from "./EmptyState";
import JobCard from "./JobCard";
import { Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MainPagination from "./MainPagination";
import { JobPostStatus } from "@prisma/client";

/**
 * Fetches job listings from the database with filtering and pagination
 * Performs parallel queries for job data and total count for optimal performance
 *
 * @param page - Current page number for pagination (1-based)
 * @param pageSize - Number of jobs to display per page
 * @param jobTypes - Array of employment types to filter by (e.g., ['full-time', 'part-time'])
 * @param location - Location string to filter jobs by (empty string or 'worldwide' for no location filter)
 * @returns Object containing filtered job data and total page count
 */
const getData = async ({
  page = 1,
  pageSize = 2,
  jobTypes = [],
  location = "",
}: {
  page: number;
  pageSize: number;
  jobTypes: string[];
  location: string;
}) => {
  // Calculate how many records to skip for pagination
  const skip = (page - 1) * pageSize;

  // Build dynamic where clause based on filters
  const where = {
    status: JobPostStatus.ACTIVE, // Only show active job postings
    // Add employment type filter if job types are specified
    ...(jobTypes.length > 0 && {
      employmentType: {
        in: jobTypes, // Match any of the specified job types
      },
    }),
    // Add location filter if location is specified and not worldwide
    ...(location &&
      location !== "worldwide" && {
        location: location, // Exact location match
      }),
  };

  // Execute both queries in parallel for better performance
  const [data, totalCount] = await Promise.all([
    // Fetch paginated job listings with company information
    prisma.jobPost.findMany({
      where: where,
      take: pageSize, // Limit number of results
      skip: skip, // Skip records for pagination
      select: {
        // Only select fields needed for job cards to optimize query performance
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        location: true,
        createdAt: true,
        Company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Show newest jobs first
      },
    }),
    // Get total count of active jobs for pagination calculation
    prisma.jobPost.count({
      where: {
        status: "ACTIVE", // Count only active jobs
      },
    }),
  ]);

  return { jobs: data, totalPages: Math.ceil(totalCount / pageSize) };
};

/**
 * Loading Skeleton Component
 *
 * Displays placeholder content while job listings are being fetched
 * Provides visual feedback during loading states to improve perceived performance
 *
 * Features:
 * - Mimics the structure of actual job cards
 * - Shows skeleton for header with job count
 * - Displays 3 placeholder job cards with realistic proportions
 * - Uses consistent styling with the main job listings
 */
function JobListingsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header skeleton with title and count placeholders */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-40 rounded-md bg-muted"></div>
        <div className="h-6 w-20 rounded-md bg-muted"></div>
      </div>

      {/* Job card skeletons - 3 placeholder cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-md border bg-card p-4 shadow-sm">
          <div className="flex gap-4">
            {/* Company logo skeleton */}
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="flex-1 space-y-2">
              {/* Job title skeleton */}
              <Skeleton className="h-5 w-3/4" />
              {/* Company name and location skeleton */}
              <Skeleton className="h-4 w-1/2" />
              {/* Badge skeletons for employment type and salary */}
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Job Listings Content Component
 *
 * Renders the actual job listings data after it's been fetched
 * Handles empty states and displays job cards with pagination
 *
 * Features:
 * - Empty state handling when no jobs match filters
 * - Job count display in header
 * - Staggered animations for job cards
 * - Hover effects for better interactivity
 * - Pagination controls at the bottom
 *
 * @param currentPage - Current page number for pagination
 * @param jobTypes - Array of employment types being filtered
 * @param location - Location being filtered
 */
const JobListingsContent = async ({
  currentPage,
  jobTypes,
  location,
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
}) => {
  // Fetch job data with current filters and pagination
  const { jobs, totalPages } = await getData({
    page: currentPage,
    pageSize: 2, // Display 2 jobs per page
    jobTypes: jobTypes,
    location: location,
  });

  // Show empty state if no jobs found with current filters
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs found"
        description="Try searching for a different job title or location"
        buttontext="Clear all filters"
        href="/" // Reset to homepage without filters
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header section with job count and branding */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">Available Positions</h2>
        </div>
        {/* Display count of jobs found */}
        <span className="text-sm text-muted-foreground">
          {jobs.length} jobs found
        </span>
      </div>

      {/* Job cards container with staggered animations */}
      <div className="flex flex-col gap-4">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="animate-fadeIn transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
            style={{ animationDelay: `${index * 100}ms` }} // Staggered entrance animation
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>

      {/* Pagination controls centered at bottom */}
      <div className="flex justify-center mt-6">
        <MainPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
};

/**
 * Main Job Listings Component
 *
 * Wrapper component that handles Suspense for loading states
 * Manages the transition between loading skeleton and actual content
 *
 * Features:
 * - Suspense boundary for graceful loading states
 * - Dynamic key generation for proper re-rendering when filters change
 * - Separation of concerns between loading and content states
 *
 * The suspenseKey ensures that when filters change, React treats it as a new
 * component instance and shows the loading skeleton while fetching new data
 *
 * @param currentPage - Current page number for pagination
 * @param jobTypes - Array of employment types to filter by
 * @param location - Location string to filter by
 */
const JobListings = ({
  currentPage,
  jobTypes,
  location,
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
}) => {
  // Create unique key based on current filters to trigger re-render when filters change
  // This ensures the loading skeleton is shown when filters are updated
  const suspenseKey = `page=${currentPage};types=${jobTypes.join(",")};location=${location}`;

  return (
    <Suspense fallback={<JobListingsSkeleton />} key={suspenseKey}>
      <JobListingsContent
        currentPage={currentPage}
        jobTypes={jobTypes}
        location={location}
      />
    </Suspense>
  );
};

export default JobListings;
