// Favorites page component
// Displays all job postings that the authenticated user has saved for later viewing
// Provides easy access to jobs the user is interested in applying to

import EmptyState from "@/components/general/EmptyState";
import JobCard from "@/components/general/JobCard";
import { reqUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Fetches all saved job postings for the specified user
 * Retrieves job details along with company information for display
 *
 * @param userId - The unique identifier of the authenticated user
 * @returns Array of saved job postings with nested job and company data
 */
const getFavorites = async (userId: string) => {
  const data = prisma.savedJobPost.findMany({
    where: {
      userId: userId, // Only fetch jobs saved by this specific user
    },
    select: {
      JobPost: {
        select: {
          // Essential job information for card display
          id: true,
          jobTitle: true,
          salaryFrom: true,
          salaryTo: true,
          employmentType: true,
          location: true,
          createdAt: true,
          Company: {
            select: {
              // Company information for job card display
              name: true,
              logo: true,
              location: true,
              about: true,
            },
          },
        },
      },
    },
  });
  return data;
};

/**
 * Favorites Page Component
 *
 * This page displays all job postings that the user has saved/favorited
 * It serves as a personal collection of interesting job opportunities
 *
 * Features:
 * - Authentication requirement (must be logged in to have favorites)
 * - Empty state for users with no saved jobs
 * - Grid layout of job cards for easy browsing
 * - Direct access to saved job details
 * - Encourages job discovery when no favorites exist
 *
 * User Experience:
 * - Shows empty state with call-to-action when no favorites exist
 * - Displays saved jobs in familiar card format for consistency
 * - Provides quick access to jobs user has shown interest in
 * - Maintains user's job search workflow and decision-making process
 */
const FavoritesPage = async () => {
  // Ensure user is authenticated before showing favorites
  // This prevents unauthorized access to personal saved jobs
  const session = await reqUser();

  // Fetch all saved jobs for the authenticated user
  const data = await getFavorites(session?.id as string);

  // Show empty state if user hasn't saved any jobs yet
  if (data.length === 0) {
    return (
      <EmptyState
        title="No Favorites Found"
        description="you don't have any favorites yet." // Note: lowercase "you" - could be capitalized for consistency
        buttontext="Find a job"
        href="/" // Redirects to main job search page
      />
    );
  }

  // Display saved jobs in a grid layout
  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {data.map((favorite) => (
        // Render each saved job using the standard JobCard component
        // This maintains visual consistency with other job listing pages
        <JobCard key={favorite.JobPost.id} job={favorite.JobPost} />
      ))}
    </div>
  );
};

export default FavoritesPage;
