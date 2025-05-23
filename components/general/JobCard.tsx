// Job card component for displaying job listings in a grid or list format
// Provides a comprehensive overview of job details with company information
// Includes interactive hover effects and responsive design

import Link from "next/link";
import { Card } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/lib/formatCurrency";
import { Briefcase, Clock, MapPin } from "lucide-react";
import formatTime from "@/lib/formatTime";

/**
 * Props interface for the JobCard component
 */
interface Props {
  /** Job data object containing all necessary information for display */
  job: {
    /** Unique identifier for the job posting */
    id: string;
    /** Company information associated with the job */
    Company: {
      /** Company description/about text */
      about: string;
      /** Company name */
      name: string;
      /** Company location */
      location: string;
      /** Company logo URL */
      logo: string;
    };
    /** Job title/position name */
    jobTitle: string;
    /** Type of employment (full-time, part-time, contract, etc.) */
    employmentType: string;
    /** Job location (can be different from company location) */
    location: string;
    /** Minimum salary range */
    salaryFrom: number;
    /** Maximum salary range */
    salaryTo: number;
    /** Date when the job was posted */
    createdAt: Date;
  };
}

/**
 * Job Card Component
 *
 * This component displays a job listing in a card format with comprehensive
 * information including company details, job specifics, and posting metadata.
 *
 * Features:
 * - Clickable card that navigates to full job details
 * - Company logo display with fallback to company initial
 * - Responsive layout that adapts to different screen sizes
 * - Visual hierarchy with proper typography and spacing
 * - Hover effects for better interactivity
 * - Salary range formatting with currency display
 * - Employment type and location badges
 * - Relative time display for posting date
 * - Gradient accent bar for visual appeal
 *
 * Layout Structure:
 * - Header with gradient accent bar
 * - Company logo (left side)
 * - Job details (center/main content)
 * - Posted time (right side on desktop, bottom on mobile)
 *
 * @param job - Job data object containing all information to display
 */
const JobCard = ({ job }: Props) => {
  return (
    <Link href={`/job/${job.id}`} className="block">
      <Card className="overflow-hidden border bg-card p-0 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md">
        <div className="relative">
          {/* Subtle gradient highlight bar at the top for visual appeal */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary/80 to-primary/30" />

          <div className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Company Logo Section */}
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border bg-background shadow-sm">
                  {job.Company.logo ? (
                    // Display company logo if available
                    <Image
                      src={job.Company.logo || "/placeholder.svg"}
                      alt={job.Company.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // Fallback to company name initial if no logo
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                      {job.Company.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Job Details Section */}
              <div className="flex-1">
                {/* Job Title */}
                <h2 className="mb-1 line-clamp-1 text-lg font-medium">
                  {job.jobTitle}
                </h2>

                {/* Company Name and Location */}
                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  <span>{job.Company.name}</span>
                  {/* Separator dot (hidden on mobile) */}
                  <span className="hidden text-xs text-muted-foreground/50 sm:inline-block">
                    •
                  </span>
                  {/* Job location with map pin icon */}
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                </div>

                {/* Employment Type and Salary Badges */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {/* Employment type badge */}
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-xs font-normal"
                  >
                    <Briefcase className="mr-1 h-3 w-3" />
                    {job.employmentType}
                  </Badge>

                  {/* Salary range badge */}
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-xs font-normal"
                  >
                    {formatCurrency(job.salaryFrom)} -{" "}
                    {formatCurrency(job.salaryTo)}
                  </Badge>
                </div>

                {/* Company Description (truncated to 2 lines) */}
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {job.Company.about}
                </p>
              </div>

              {/* Posted Time Section */}
              {/* Responsive: inline with clock icon on mobile, block on desktop */}
              <div className="mt-2 flex items-center text-xs text-muted-foreground sm:mt-0 sm:block sm:text-right">
                <Clock className="mr-1 inline h-3 w-3 sm:mr-0" />
                <span className="sm:mt-1 sm:block">
                  {formatTime(job.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default JobCard;
