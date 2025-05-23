// Job deletion confirmation page component
// Provides a safety confirmation step before permanently deleting a job posting
// Ensures users understand the irreversible nature of deletion

import { GeneralSubmitButton } from "@/components/general/SubmitButtons";
import { ArrowLeftIcon } from "@/components/ui/arrow-left";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteIcon } from "@/components/ui/delete";
import { deleteJobPost } from "@/lib/actions";
import { reqUser } from "@/lib/auth";
import Link from "next/link";

/**
 * Delete Job Confirmation Page Component
 *
 * This page provides a confirmation step before permanently deleting a job posting
 * It helps prevent accidental deletions by requiring explicit confirmation
 *
 * Features:
 * - Authentication requirement (must be logged in)
 * - Clear warning about permanent deletion
 * - Easy cancellation option to return to job listings
 * - Destructive styling for the delete button to indicate severity
 * - Server action integration for secure deletion process
 *
 * Security:
 * - Authentication check before showing deletion interface
 * - Server-side action handles actual deletion with proper authorization
 * - Job ID is passed securely through server action
 *
 * UX Considerations:
 * - Centered card layout draws attention to the critical action
 * - Clear, direct language about consequences
 * - Visual distinction between cancel and delete actions
 * - Icon reinforcement for both actions
 *
 * @param params - Route parameters containing the job ID to delete
 */
const DeletePage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  // Extract job ID from route parameters
  const { jobId } = await params;

  // Ensure user is authenticated before showing deletion confirmation
  // This prevents unauthorized access to the deletion interface
  await reqUser();

  return (
    <div>
      {/* Confirmation card with centered layout for focus */}
      <Card className="max-w-lg mx-auto mt-28">
        <CardHeader>
          {/* Clear warning title */}
          <CardTitle>Are you absolutely sure?</CardTitle>

          {/* Detailed explanation of consequences */}
          {/* Note: There's a typo "permentaly" that should be "permanently" */}
          <CardDescription>
            This action cannot be undone. This will permentaly delete your job
            listing and remove all of your data from our servers.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex items-center justify-between">
          {/* Cancel button with left arrow icon */}
          {/* Returns user safely to job listings without taking action */}
          <Link
            href="/my-jobs"
            className={buttonVariants({ variant: "secondary" })}
          >
            <ArrowLeftIcon /> Cancel
          </Link>

          {/* Delete confirmation form with server action */}
          {/* When submitted, triggers the server-side deletion process */}
          <form
            action={async () => {
              "use server";
              await deleteJobPost(jobId);
            }}
          >
            {/* Delete button with destructive styling */}
            {/* Uses custom submit button component with loading state support */}
            <GeneralSubmitButton
              text="Delete Job"
              variant="destructive"
              icon={<DeleteIcon />}
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeletePage;
