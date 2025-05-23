// Job editing page component
// Allows authenticated users to modify their existing job postings
// Ensures users can only edit jobs they own through proper authorization

import EditJobForm from "@/components/forms/EditJobForm";
import { reqUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

/**
 * Fetches job posting data for editing
 * Includes authorization check to ensure user owns the job posting
 *
 * @param jobId - The unique identifier of the job posting to edit
 * @param userId - The unique identifier of the authenticated user
 * @returns Job posting data with company information, or triggers 404 if not found/unauthorized
 */
const getData = async (jobId: string, userId: string) => {
  // Query database for job posting with authorization check
  const data = await prisma.jobPost.findUnique({
    where: {
      id: jobId,
      Company: {
        userId: userId, // Ensures user can only edit their own company's jobs
      },
    },
    select: {
      // Job posting fields needed for editing
      benefits: true,
      id: true,
      jobTitle: true,
      jobDescription: true,
      salaryFrom: true,
      salaryTo: true,
      location: true,
      employmentType: true,
      listingDuration: true,
      Company: {
        select: {
          // Company information to pre-populate form fields
          about: true,
          name: true,
          location: true,
          website: true,
          xAccount: true,
          logo: true,
        },
      },
    },
  });

  // Return 404 if job not found or user doesn't have permission to edit
  // This prevents unauthorized access to job editing functionality
  if (!data) {
    return notFound();
  }

  return data;
};

/**
 * Edit Job Page Component
 *
 * This page allows users to modify their existing job postings
 * It provides a pre-populated form with current job data for easy editing
 *
 * Features:
 * - Authentication requirement (must be logged in)
 * - Authorization check (can only edit own jobs)
 * - Pre-populated form with existing job data
 * - Company information integration
 * - Automatic 404 handling for invalid/unauthorized access
 *
 * Security:
 * - Users can only edit jobs from their own company
 * - Invalid job IDs result in 404 responses
 * - Authentication is required before any data access
 *
 * @param params - Route parameters containing the job ID to edit
 */
const EditPage = async ({ params }: { params: Promise<{ jobId: string }> }) => {
  // Extract job ID from route parameters
  const { jobId } = await params;

  // Ensure user is authenticated before allowing job editing
  // This prevents unauthorized access to the editing interface
  const session = await reqUser();

  // Fetch job data with authorization check
  // Will return 404 if job doesn't exist or user doesn't own it
  const data = await getData(jobId, session.id as string);

  // Render the edit form with pre-populated job data
  // Note: There's a typo in the prop name "JobPsot" - should be "JobPost"
  return <EditJobForm JobPsot={data} />;
};

export default EditPage;
