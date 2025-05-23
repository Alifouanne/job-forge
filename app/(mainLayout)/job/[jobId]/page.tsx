// Job details page component
// Displays comprehensive information about a specific job posting
// Includes job description, company details, benefits, and application options

import JsonToHtml from "@/components/general/JsonToHtml";
import { SaveJobButton } from "@/components/general/SubmitButtons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HandHeartIcon } from "@/components/ui/hand-heart";
import { saveJobPost, unSaveJobPost } from "@/lib/actions";
import arcjet, { detectBot, tokenBucket } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { benefits } from "@/lib/benefits";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { request } from "@arcjet/next";
import { CalendarIcon, Clock, MapPin, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * Configure Arcjet bot detection
 * Allows search engines and preview bots while protecting against malicious bots
 */
const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"], // Allow legitimate bots
  })
);

/**
 * Get appropriate rate limiting client based on authentication status
 * Authenticated users get higher rate limits than anonymous users
 *
 * @param session - Boolean indicating if user is authenticated
 * @returns Configured Arcjet client with appropriate rate limits
 */
const getClient = (session: boolean) => {
  if (session) {
    // Higher rate limits for authenticated users
    return aj.withRule(
      tokenBucket({
        mode: "DRY_RUN",
        capacity: 100,
        interval: 60,
        refillRate: 30, // 30 requests per minute
      })
    );
  } else {
    // Lower rate limits for anonymous users
    return aj.withRule(
      tokenBucket({
        mode: "DRY_RUN",
        capacity: 100,
        interval: 60,
        refillRate: 10, // 10 requests per minute
      })
    );
  }
};

/**
 * Fetches job data and saved status for the specified job ID
 * Performs parallel queries for efficiency
 *
 * @param jobId - The unique identifier of the job to display
 * @param userId - Optional user ID to check if job is saved by the user
 * @returns Job data and saved status, or triggers 404 if job not found
 */
const getJob = async (jobId: string, userId?: string) => {
  // Run both queries in parallel for better performance
  const [jobData, savedJob] = await Promise.all([
    // Query for job details
    await prisma.jobPost.findUnique({
      where: {
        status: "ACTIVE", // Only show active job listings
        id: jobId,
      },
      select: {
        // Select only the fields needed for display
        jobTitle: true,
        jobDescription: true,
        location: true,
        employmentType: true,
        benefits: true,
        createdAt: true,
        listingDuration: true,
        Company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
    }),
    // Query for saved status (only if user is logged in)
    userId
      ? prisma.savedJobPost.findUnique({
          where: {
            userId_jobPostId: {
              userId: userId,
              jobPostId: jobId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,
  ]);

  // Return 404 if job not found or inactive
  if (!jobData) {
    return notFound();
  }

  return { jobData, savedJob };
};

/**
 * Job Details Page Component
 *
 * This page displays comprehensive information about a specific job posting
 * It serves as the main conversion point for job applications
 *
 * Features:
 * - Detailed job information with company details
 * - Save job functionality for authenticated users
 * - Rich text job description
 * - Visual benefits display
 * - Application section
 * - Company profile information
 * - Rate limiting protection against abuse
 * - Responsive layout for all device sizes
 *
 * @param params - Route parameters containing the job ID
 */
const JobIdPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  // Extract job ID from route parameters
  const { jobId } = await params;

  // Get authentication status
  const session = await auth();

  // Apply rate limiting based on authentication status
  const req = await request();
  const decision = await getClient(!!session).protect(req, { requested: 10 });

  // Block request if rate limit exceeded
  if (decision.isDenied()) {
    throw new Error("forbidden");
  }

  // Fetch job data and saved status
  const { jobData: data, savedJob } = await getJob(jobId, session?.user?.id);

  return (
    // Main container with responsive padding
    <div className="container mx-auto py-6">
      {/* Two-column layout on large screens, single column on mobile */}
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Main content area - takes 2/3 of space on large screens */}
        <div className="space-y-6 lg:col-span-2">
          {/* Job header section with title, company, and save button */}
          <div className="rounded-lg border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              {/* Job title and metadata */}
              <div className="space-y-1">
                <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                  {data.jobTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Company name */}
                  <p className="font-medium text-primary">
                    {data.Company.name}
                  </p>
                  {/* Separator dot (hidden on mobile) */}
                  <div className="hidden h-1 w-1 rounded-full bg-muted-foreground md:inline" />
                  {/* Employment type badge */}
                  <Badge className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0 text-primary">
                    <Briefcase className="h-3 w-3" />
                    {data.employmentType}
                  </Badge>
                  {/* Separator dot (hidden on mobile) */}
                  <div className="hidden h-1 w-1 rounded-full bg-muted-foreground md:inline" />
                  {/* Location badge */}
                  <Badge className="flex items-center gap-1 rounded-full px-2 py-0">
                    <MapPin className="h-3 w-3" />
                    {data.location}
                  </Badge>
                </div>
              </div>

              {/* Save job button - different versions for logged in vs anonymous users */}
              {session?.user ? (
                // For logged in users: Toggle save/unsave with server action
                <form
                  action={
                    savedJob
                      ? unSaveJobPost.bind(null, savedJob.id) // Unsave if already saved
                      : saveJobPost.bind(null, jobId) // Save if not saved
                  }
                >
                  <SaveJobButton savedJob={!!savedJob} />
                </form>
              ) : (
                // For anonymous users: Redirect to login
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "gap-2 transition-all duration-200 hover:shadow-sm active:translate-y-0.5",
                  })}
                  href="/login"
                >
                  <HandHeartIcon className="h-4 w-4" />
                  Save Job
                </Link>
              )}
            </div>
          </div>

          {/* Job description card */}
          <Card className="overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="border-b p-5">
              <h2 className="text-lg font-medium">Job Description</h2>
            </div>
            <div className="p-5">
              {/* Convert stored JSON to HTML for rich text display */}
              <JsonToHtml json={JSON.parse(data.jobDescription)} />
            </div>
          </Card>

          {/* Benefits card */}
          <Card className="shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="border-b p-5">
              <h2 className="text-lg font-medium">Benefits</h2>
              <p className="text-sm text-muted-foreground">
                Highlighted benefits are offered by this company
              </p>
            </div>
            <div className="p-5">
              {/* Benefits grid with visual distinction between offered and not offered */}
              <div className="flex flex-wrap gap-2">
                {benefits.map((benefit) => {
                  // Check if this benefit is offered by the company
                  const isOffered = data.benefits.includes(benefit.id);
                  return (
                    <Badge
                      key={benefit.id}
                      variant={isOffered ? "default" : "outline"}
                      className={cn(
                        isOffered
                          ? "bg-primary/10 text-primary hover:bg-primary/15" // Highlighted for offered benefits
                          : "opacity-60 hover:opacity-80", // Dimmed for benefits not offered
                        "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-all duration-200 cursor-not-allowed"
                      )}
                    >
                      {benefit.icon}
                      {benefit.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - takes 1/3 of space on large screens */}
        <div className="space-y-6">
          {/* Application card */}
          <Card className="shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="border-b p-5">
              <h3 className="text-lg font-medium">Apply for this position</h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {/* Attribution message to help with platform growth */}
                <p className="text-sm text-muted-foreground">
                  Please let {data.Company.name} know you found this job on Job
                  Forge. This helps us grow!
                </p>
                {/* Primary call-to-action button */}
                <Button
                  className="w-full gap-2 shadow-sm transition-all duration-200 hover:shadow-md active:translate-y-0.5"
                  size="lg"
                >
                  Apply now
                </Button>
              </div>
            </div>
          </Card>

          {/* Job details card */}
          <Card className="shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="border-b p-5">
              <h3 className="text-lg font-medium">Job Details</h3>
            </div>
            <div className="divide-y">
              {/* Application deadline */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Apply before</span>
                </div>
                <span className="text-sm font-medium">
                  {/* Calculate application deadline based on creation date and duration */}
                  {new Date(
                    data.createdAt.getTime() +
                      data.listingDuration * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Posted date */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Posted on</span>
                </div>
                <span className="text-sm font-medium">
                  {data.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Employment type */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>Employment type</span>
                </div>
                <span className="text-sm font-medium">
                  {data.employmentType}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
                <span className="text-sm font-medium">{data.location}</span>
              </div>
            </div>
          </Card>

          {/* Company information card */}
          <Card className="overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="border-b p-5">
              <h3 className="text-lg font-medium">About the Company</h3>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Company logo */}
                <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-background shadow-sm">
                  <Image
                    src={data.Company.logo || "/placeholder.svg"}
                    alt={`${data.Company.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Company name and description */}
                <div className="flex-1">
                  <h4 className="font-medium">{data.Company.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                    {data.Company.about}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobIdPage;
