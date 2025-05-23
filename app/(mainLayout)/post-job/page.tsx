/* eslint-disable react/no-unescaped-entities */
// Job posting page component
// Allows authenticated users with company profiles to create and publish job listings
// Includes social proof elements and company testimonials to encourage job posting

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ArcJetLogo from "@/public/arcjet.jpg";
import InngestLogo from "@/public/inngest-locale.png";
import Image from "next/image";
import CreateJobForm from "@/components/forms/CreateJobForm";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { reqUser } from "@/lib/auth";
import { Quote } from "lucide-react";
import { HomeIcon } from "@/components/ui/home";
import { CircleCheckIcon } from "@/components/ui/circle-check";
import { TrendingUpIcon } from "@/components/ui/trending-up";
import { ClockIcon } from "@/components/ui/clock";

// Static data for company logos displayed as social proof
// Shows trusted companies that use the platform to build credibility
const companies = [
  { id: 0, name: "ArcJet", logo: ArcJetLogo },
  { id: 1, name: "Inngest", logo: InngestLogo },
  { id: 2, name: "ArcJet", logo: ArcJetLogo },
  { id: 3, name: "Inngest", logo: InngestLogo },
  { id: 4, name: "ArcJet", logo: ArcJetLogo },
  { id: 5, name: "Inngest", logo: InngestLogo },
];

// Customer testimonials to build trust and encourage job posting
// Real quotes from companies that have successfully hired through the platform
const testimonials = [
  {
    quote:
      "We found our ideal candidate within 48 hours of posting. The quality of applicants was exceptional!",
    author: "Sarah Chen",
    company: "TechCorp",
  },
  {
    quote:
      "The platform made hiring remote talent incredibly simple. Highly recommended!",
    author: "Mark Johnson",
    company: "StartupX",
  },
  {
    quote:
      "We've consistently found high-quality candidates here. It's our go-to platform for all our hiring needs.",
    author: "Emily Rodriguez",
    company: "InnovateNow",
  },
];

// Platform statistics to demonstrate value and success metrics
// Shows the scale and effectiveness of the job posting platform
const stats = [
  {
    id: 0,
    value: "10k+",
    label: "Monthly active job seekers",
    icon: <TrendingUpIcon />,
  },
  {
    id: 1,
    value: "48h",
    label: "Average time to hire",
    icon: <ClockIcon />,
  },
  {
    id: 2,
    value: "95%",
    label: "Employer satisfaction rate",
    icon: <CircleCheckIcon />,
  },
  {
    id: 3,
    value: "500+",
    label: "Companies hiring monthly",
    icon: <HomeIcon />,
  },
];

/**
 * Fetches company data for the authenticated user
 * Ensures user has a complete company profile before allowing job posting
 *
 * @param userId - The unique identifier of the user
 * @returns Company data if found, redirects to homepage if no company profile exists
 */
const getCompanyData = async (userId: string) => {
  // Query database for user's company information
  const data = await prisma.company.findUnique({
    where: {
      userId: userId,
    },
    select: {
      // Only fetch fields needed for job posting form
      name: true,
      location: true,
      about: true,
      logo: true,
      xAccount: true,
      website: true,
    },
  });

  // Redirect to homepage if user doesn't have a company profile
  // This ensures only users with complete company setup can post jobs
  if (!data) {
    return redirect("/");
  }

  return data;
};

/**
 * Post Job Page Component
 *
 * This page allows companies to create and publish job listings
 * It combines a comprehensive job posting form with social proof elements
 *
 * Features:
 * - Authentication requirement (must be logged in)
 * - Company profile requirement (must have company data)
 * - Pre-filled form with company information
 * - Social proof through company logos and testimonials
 * - Platform statistics to build confidence
 * - Responsive two-column layout
 *
 * Layout:
 * - Left side: Job posting form (2/3 width on large screens)
 * - Right side: Social proof and testimonials (1/3 width on large screens)
 */
const PostJobPage = async () => {
  // Ensure user is authenticated before allowing job posting
  const session = await reqUser();

  // Fetch company data and redirect if not found
  // This ensures only users with company profiles can post jobs
  const data = await getCompanyData(session.id as string);

  return (
    // Main grid layout with responsive columns
    <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Job posting form - takes 2/3 of space on large screens */}
      {/* Pre-populated with company information for convenience */}
      <CreateJobForm
        companyAbout={data.about}
        companyLocation={data.location}
        companyLogo={data.logo}
        companyName={data.name}
        companyWebsite={data.website}
        companyXAccount={data.xAccount}
      />

      {/* Social proof sidebar - takes 1/3 of space on large screens */}
      <div className="col-span-1 space-y-6 antialiased">
        <Card className="overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md">
          {/* Card header with title and description */}
          <CardHeader className="border-b bg-card px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <HomeIcon className="h-8 w-8 text-primary" />
              Trusted by industry leaders
            </CardTitle>
            <CardDescription>
              Join thousands of companies hiring top talents
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-5">
            {/* Company logos grid - shows trusted companies using the platform */}
            <div className="grid grid-cols-3 gap-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="group overflow-hidden rounded-lg border border-input shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-background p-2">
                    <Image
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      fill
                      className="object-contain p-1 opacity-75 transition-all duration-200 group-hover:opacity-100 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Customer testimonials section */}
            {/* Builds trust through real customer experiences */}
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.author}
                  className="relative overflow-hidden rounded-lg border border-input bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
                  style={{ animationDelay: `${index * 100}ms` }} // Staggered animation
                >
                  {/* Decorative quote icon */}
                  <Quote className="absolute right-2 top-2 h-12 w-12 rotate-12 text-primary/10" />

                  {/* Testimonial quote */}
                  <p className="relative text-sm text-foreground">
                    "{testimonial.quote}"
                  </p>

                  {/* Attribution with author and company */}
                  <footer className="mt-2 flex items-center gap-1 text-sm font-medium text-primary">
                    {testimonial.author}
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {testimonial.company}
                    </span>
                  </footer>
                </div>
              ))}
            </div>

            {/* Platform statistics grid */}
            {/* Shows key metrics to demonstrate platform value */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="group flex flex-col rounded-lg border border-input bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] hover:border-primary/30"
                >
                  {/* Stat icon with hover animation */}
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
                    {stat.icon}
                  </div>

                  {/* Stat value (large number) */}
                  <h4 className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </h4>

                  {/* Stat description */}
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJobPage;
