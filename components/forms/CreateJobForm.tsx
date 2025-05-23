"use client";

// Job posting creation form component
// Allows employers to create comprehensive job listings with company information
// Handles form validation, rich text editing, and image uploads

import { countryList } from "@/lib/countriesList";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Briefcase,
  Globe,
  Twitter,
  XIcon,
  Building2,
  Clock,
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { UploadDropzone } from "@/components/general/UploadThing";
import { useState } from "react";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "@/lib/zodSchemas";
import SalaryRange from "../general/SalaryRange";
import JobDescriptionEditor from "../TextEditor/JobDescriptionEditor";
import BenefitsSelector from "../general/BenefitsSelector";
import DurationSelector from "../general/DurationSelector";
import { createJob } from "@/lib/actions";

/**
 * Props interface for the CreateJobForm component
 * Receives company information to pre-populate form fields
 */
interface CreateJobFormProps {
  /** Company name to pre-populate in the form */
  companyName: string;
  /** Company location to pre-populate in the form */
  companyLocation: string;
  /** Company description to pre-populate in the form */
  companyAbout: string;
  /** Company logo URL to pre-populate in the form */
  companyLogo: string;
  /** Company X (Twitter) account to pre-populate in the form (optional) */
  companyXAccount: string | null;
  /** Company website to pre-populate in the form */
  companyWebsite: string;
}

/**
 * Create Job Form Component
 *
 * This form allows employers to create comprehensive job listings
 * It pre-populates company information and handles all aspects of job creation
 *
 * Features:
 * - Form validation with Zod schema
 * - Rich text editor for job descriptions
 * - Salary range selection with min/max values
 * - Benefits selection with visual indicators
 * - Company information management
 * - Logo upload functionality
 * - Job listing duration selection with pricing tiers
 * - Loading state handling during submission
 * - Error notifications via toast messages
 *
 * Form Structure:
 * 1. Job Information section (title, type, location, salary, description, benefits)
 * 2. Company Information section (name, location, website, social, about, logo)
 * 3. Listing Duration section (duration with pricing tiers)
 *
 * @param companyAbout - Company description to pre-populate
 * @param companyLocation - Company location to pre-populate
 * @param companyLogo - Company logo URL to pre-populate
 * @param companyXAccount - Company X (Twitter) account to pre-populate
 * @param companyName - Company name to pre-populate
 * @param companyWebsite - Company website to pre-populate
 */
export default function CreateJobForm({
  companyAbout,
  companyLocation,
  companyLogo,
  companyXAccount,
  companyName,
  companyWebsite,
}: CreateJobFormProps) {
  // Initialize form with Zod validation schema and pre-populated company values
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      benefits: [], // Empty array for benefits selection
      companyAbout: companyAbout, // Pre-populate company description
      companyLocation: companyLocation, // Pre-populate company location
      companyName: companyName, // Pre-populate company name
      companyWebsite: companyWebsite, // Pre-populate company website
      companyXAccount: companyXAccount || "", // Pre-populate X account or empty string
      employmentType: "", // Empty string for employment type selection
      jobDescription: "", // Empty string for job description
      jobTitle: "", // Empty string for job title
      location: "", // Empty string for job location
      salaryFrom: 0, // Default minimum salary
      salaryTo: 0, // Default maximum salary
      companyLogo: companyLogo, // Pre-populate company logo
      listingDuration: 30, // Default listing duration (30 days)
    },
  });

  // State to track form submission status
  const [pending, setPending] = useState(false);

  /**
   * Form submission handler
   * Submits validated data to server action and handles loading/error states
   *
   * @param values - Validated job data from the form
   */
  async function onSubmit(values: z.infer<typeof jobSchema>) {
    try {
      setPending(true); // Set loading state
      await createJob(values); // Submit data to server action
    } catch {
      // Show error notification if submission fails
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false); // Reset loading state
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="col-span-1 flex flex-col gap-6 lg:col-span-2"
      >
        {/* Job Information Card */}
        <Card className="overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-card border-b px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Briefcase className="h-5 w-5 text-primary" />
              Job Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            {/* Job Title and Employment Type - 2 columns on larger screens */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Job Title field */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                    <FormLabel className="text-sm font-medium">
                      Job Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Job Title"
                        {...field}
                        className="border-input shadow-sm transition-all duration-200 focus:border-primary/50 focus:shadow-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employment Type field with dropdown */}
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                    <FormLabel className="text-sm font-medium">
                      Employment Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-input shadow-sm transition-all duration-200 focus:border-primary/50 focus:shadow-md">
                          <SelectValue placeholder="Select Employment Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Employment Type</SelectLabel>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Job Location and Salary Range - 2 columns on larger screens */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Job Location field with country dropdown */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                    <FormLabel className="text-sm font-medium">
                      Location
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-input shadow-sm transition-all duration-200 focus:border-primary/50 focus:shadow-md">
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Worldwide/Remote option */}
                        <SelectGroup>
                          <SelectLabel>Worldwide</SelectLabel>
                          <SelectItem
                            value="worldwide"
                            className="flex items-center gap-2"
                          >
                            <Globe className="h-4 w-4" />
                            <span>Worldwide / Remote</span>
                          </SelectItem>
                        </SelectGroup>

                        {/* Country list with flag emojis */}
                        <SelectGroup>
                          <SelectLabel>Location</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem
                              value={country.name}
                              key={country.code}
                              className="flex items-center gap-2"
                            >
                              <span>{country.flagEmoji}</span>
                              <span>{country.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary Range field with custom range component */}
              <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                <FormLabel className="text-sm font-medium">
                  Salary Range
                </FormLabel>
                <FormControl>
                  <SalaryRange
                    currency="USD"
                    step={1000}
                    control={form.control}
                    minSalary={30000}
                    maxSalary={1000000}
                  />
                </FormControl>
                <FormMessage>
                  {/* Display error message from either salary field */}
                  {form.formState.errors.salaryFrom?.message ||
                    form.formState.errors.salaryTo?.message}
                </FormMessage>
              </FormItem>
            </div>

            {/* Job Description field with rich text editor */}
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                  <FormLabel className="text-sm font-medium">
                    Job Description
                  </FormLabel>
                  <FormControl>
                    <div className="rounded-md border border-input shadow-sm transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-md">
                      <JobDescriptionEditor field={field as any} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Benefits selector with custom component */}
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Benefits
                  </FormLabel>
                  <FormControl>
                    <BenefitsSelector field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Company Information Card */}
        <Card className="overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-card border-b px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-5 w-5 text-primary" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            {/* Company Name and Location - 2 columns on larger screens */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Company Name field */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                    <FormLabel className="text-sm font-medium">
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company Name"
                        {...field}
                        className="border-input shadow-sm transition-all duration-200 focus:border-primary/50 focus:shadow-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Location field with country dropdown */}
              <FormField
                control={form.control}
                name="companyLocation"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                    <FormLabel className="text-sm font-medium">
                      Location
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-input shadow-sm transition-all duration-200 focus:border-primary/50 focus:shadow-md">
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Worldwide option */}
                        <SelectGroup>
                          <SelectLabel>Worldwide</SelectLabel>
                          <SelectItem
                            value="worldwide"
                            className="flex items-center gap-2"
                          >
                            <Globe className="h-4 w-4" />
                            <span>Worldwide</span>
                          </SelectItem>
                        </SelectGroup>

                        {/* Country list with flag emojis */}
                        <SelectGroup>
                          <SelectLabel>Location</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem
                              value={country.name}
                              key={country.name}
                              className="flex items-center gap-2"
                            >
                              <span>{country.flagEmoji}</span>
                              <span>{country.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Company Website and X Account - 2 columns on larger screens */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Company Website field with https:// prefix */}
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                    <FormLabel className="text-sm font-medium">
                      Company Website
                    </FormLabel>
                    <FormControl>
                      <div className="flex shadow-sm transition-all duration-200 focus-within:shadow-md">
                        <span className="flex items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                          https://
                        </span>
                        <Input
                          {...field}
                          placeholder="Company Website"
                          className="rounded-l-none border-input transition-all duration-200 focus:border-primary/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company X (Twitter) Account field with X icon prefix */}
              <FormField
                control={form.control}
                name="companyXAccount"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                    <FormLabel className="text-sm font-medium">
                      Company X Account
                    </FormLabel>
                    <FormControl>
                      <div className="flex shadow-sm transition-all duration-200 focus-within:shadow-md">
                        <span className="flex items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                          <Twitter className="mr-1 h-3.5 w-3.5" />
                        </span>
                        <Input
                          {...field}
                          placeholder="Company X Account"
                          className="rounded-l-none border-input transition-all duration-200 focus:border-primary/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Company Description textarea */}
            <FormField
              control={form.control}
              name="companyAbout"
              render={({ field }) => (
                <FormItem className="transition-all duration-200 focus-within:translate-y-[-1px]">
                  <FormLabel className="text-sm font-medium">
                    Company Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Company Description"
                      className="min-h-[120px] border-input shadow-sm transition-all duration-200 focus:border-primary/50 focus:shadow-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Logo upload field */}
            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Company Logo
                  </FormLabel>
                  <FormControl>
                    <div>
                      {field.value ? (
                        // Show uploaded image with delete button if logo exists
                        <div className="relative w-fit overflow-hidden rounded-lg border border-input shadow-sm transition-all duration-200 hover:shadow-md">
                          <Image
                            src={field.value || "/placeholder.svg"}
                            alt="Company Logo"
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 shadow-sm transition-all duration-200 hover:bg-destructive/90 active:translate-y-0.5"
                            onClick={() => field.onChange("")}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        // Show upload dropzone if no logo uploaded yet
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            field.onChange(res[0].url);
                            toast.success("Logo uploaded successfully!");
                          }}
                          onUploadError={() => {
                            toast.error(
                              "Something went wrong. Please try again."
                            );
                          }}
                          className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-button:transition-all ut-button:duration-200 ut-button:shadow-sm ut-button:hover:shadow-md ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-input shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Job Listing Duration Card */}
        <Card className="overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-card border-b px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="h-5 w-5 text-primary" />
              Job Listing Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {/* Listing Duration field with custom duration selector */}
            <FormField
              control={form.control}
              name="listingDuration"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DurationSelector field={field as any} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit button - full width with loading state */}
        <Button
          type="submit"
          className="w-full shadow-sm transition-all duration-200 hover:shadow-md active:translate-y-0.5"
          disabled={pending}
        >
          {pending ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
