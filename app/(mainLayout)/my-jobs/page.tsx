// My Jobs dashboard page component
// Displays and manages all job listings created by the authenticated user
// Provides functionality to view, edit, share, and delete job postings

import CopyLink from "@/components/general/CopyLink";
import EmptyState from "@/components/general/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SquarePenIcon } from "@/components/ui/square-pen";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { XIcon } from "@/components/ui/x";
import { reqUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Building2, MoreHorizontalIcon, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Fetches all job postings created by the user's company
 * Retrieves essential job information for display in the dashboard
 *
 * @param userId - The unique identifier of the authenticated user
 * @returns Array of job postings with company information, ordered by creation date (newest first)
 */
const getJobs = async (userId: string) => {
  const data = await prisma.jobPost.findMany({
    where: {
      Company: {
        userId: userId, // Only fetch jobs from the user's company
      },
    },
    select: {
      id: true,
      jobTitle: true,
      status: true,
      createdAt: true,
      Company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Show newest jobs first
    },
  });
  return data;
};

/**
 * My Jobs Page Component
 *
 * This dashboard page allows employers to manage all their job listings
 * It provides a comprehensive view of job status and management actions
 *
 * Features:
 * - Authentication requirement (must be logged in)
 * - Empty state for first-time users with no job postings
 * - Tabular view of all job postings with key information
 * - Quick actions for each job (edit, share, delete)
 * - Visual status indicators for job posting state
 * - Staggered animations for improved perceived performance
 * - Responsive design for all screen sizes
 */
const MyJobsPage = async () => {
  // Ensure user is authenticated before showing job management dashboard
  const session = await reqUser();

  // Fetch all job postings for the authenticated user's company
  const data = await getJobs(session.id as string);

  return (
    <>
      {data.length === 0 ? (
        // Empty state shown when user has no job postings yet
        // Provides clear call-to-action to create first job posting
        <div className="animate-fadeIn">
          <EmptyState
            title="No job posts found"
            description="You don't have any job posts yet."
            buttontext="Create job post now!"
            href="/post-job"
          />
        </div>
      ) : (
        // Job listings dashboard shown when user has at least one job posting
        <div className="animate-fadeIn">
          {/* Header section with title and action button */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium">My Jobs</h1>
              <p className="text-muted-foreground">
                Manage your job listings and applications
              </p>
            </div>
            {/* Primary action button to create new job posting */}
            <Link href="/post-job">
              <Button className="shadow-sm transition-all duration-200 hover:shadow-md active:translate-y-0.5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
            </Link>
          </div>

          {/* Card containing the job listings table */}
          <Card className="overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md">
            <CardContent className="p-0">
              {/* Horizontally scrollable table for responsive design */}
              <div className="overflow-x-auto">
                <Table>
                  {/* Table header with column titles */}
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-[80px]">Logo</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  {/* Table body with job listing rows */}
                  <TableBody>
                    {data.map((listing, index) => (
                      <TableRow
                        key={listing.id}
                        className="group transition-colors duration-200 hover:bg-muted/30"
                        style={{ animationDelay: `${index * 50}ms` }} // Staggered animation for rows
                      >
                        {/* Company logo cell */}
                        <TableCell>
                          {listing.Company.logo ? (
                            // Display company logo if available
                            <div className="overflow-hidden rounded-md shadow-sm transition-all duration-200 group-hover:shadow-md">
                              <Image
                                src={listing.Company.logo || "/placeholder.svg"}
                                alt={`${listing.Company.name} logo`}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-md object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            // Display placeholder icon if no logo is available
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 shadow-sm transition-all duration-200 group-hover:shadow-md">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                          )}
                        </TableCell>

                        {/* Company name cell */}
                        <TableCell className="font-medium">
                          {listing.Company.name}
                        </TableCell>

                        {/* Job title cell */}
                        <TableCell>{listing.jobTitle}</TableCell>

                        {/* Status cell with color-coded badge */}
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              listing.status.toLowerCase() === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {/* Capitalize first letter of status */}
                            {listing.status.charAt(0).toUpperCase() +
                              listing.status.slice(1).toLowerCase()}
                          </span>
                        </TableCell>

                        {/* Creation date cell formatted for readability */}
                        <TableCell>
                          {listing.createdAt.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>

                        {/* Actions cell with dropdown menu */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="transition-all duration-200 hover:bg-muted"
                              >
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px]"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {/* Edit job action */}
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/my-jobs/${listing.id}/edit`}
                                  className="flex cursor-pointer items-center gap-2"
                                >
                                  <SquarePenIcon size={14} />
                                  <span>Edit Job</span>
                                </Link>
                              </DropdownMenuItem>
                              {/* Copy job URL action */}
                              <CopyLink
                                jobUrl={`${process.env.NEXT_PUBLIC_URL}/job/${listing.id}`}
                              />
                              <DropdownMenuSeparator />
                              {/* Delete job action (destructive) */}
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/my-jobs/${listing.id}/delete`}
                                  className="flex cursor-pointer items-center gap-2 text-destructive"
                                >
                                  <XIcon size={14} />
                                  <span>Delete Job</span>
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default MyJobsPage;
