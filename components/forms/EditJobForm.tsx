"use client";

// Job posting editing form component
// Allows employers to modify existing job listings with pre-populated data
// Handles form validation, rich text editing, and image uploads

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Briefcase, Building2, Globe, Twitter } from "lucide-react";
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
import { countryList } from "@/lib/countriesList";
import SalaryRange from "../general/SalaryRange";
import JobDescriptionEditor from "../TextEditor/JobDescriptionEditor";
import BenefitsSelector from "../general/BenefitsSelector";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Button } from "../ui/button";
import { XIcon } from "../ui/x";
import { UploadDropzone } from "../general/UploadThing";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { jobSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { editJobPost } from "@/lib/actions";

/**
 * Props interface for the EditJobForm component
 * Receives existing job data to pre-populate form fields
 * Note: There's a typo in the prop name "JobPsot" which should be "JobPost"
 */
interface Props {
  /** Existing job data with company information to pre-populate the form */
  JobPsot: {
    /** Job title of the existing posting */
    jobTitle: string;
    /** Employment type of the existing posting (full-time, part-time, etc.) */
    employmentType: string;
    /** Location of the existing job posting */
    location: string;
    /** Minimum salary range of the existing posting */
    salaryFrom: number;
    /** Maximum salary range of the existing posting */
    salaryTo: number;
    /** Rich text job description of the existing posting (stored as JSON string) */
    jobDescription: string;
    /** Duration in days for the job listing */
    listingDuration: number;
    /** Array of benefit IDs offered with the job */
    benefits: string[];
    /** Unique identifier of the job posting */
    id: string;
    /** Company information associated with the job posting */
    Company: {
      /** Company location */
      location: string;
      /** Company X (Twitter) account (optional) */
      xAccount: string | null;
      /** Company website URL */
      website: string;
      /** Company description/about text */
      about: string;
      /** Company name */
      name: string;
      /** Company logo URL */
      logo: string;
    };
  };
}

/**
 * Edit Job Form Component
 *
 * This form allows employers to modify existing job listings
 * It pre-populates all fields with current job data and handles updates
 *
 * Features:
 * - Form validation with Zod schema
 * - Pre-populated fields with existing job data
 * - Rich text editor for job descriptions
 * - Salary range selection with min/max values
 * - Benefits selection with visual indicators
 * - Company information management
 * - Logo upload functionality
 * - Loading state handling during submission
 * - Error notifications via toast messages
 *
 * Form Structure:
 * 1. Job Information section (title, type, location, salary, description, benefits)
 * 2. Company Information section (name, location, website, social, about, logo)
 * 3. Submit button for saving changes
 *
 * @param JobPsot - Existing job data to pre-populate the form (note: typo in prop name)
 */
const EditJobForm = ({ JobPsot }: Props) => {
  // Initialize form with Zod validation schema and pre-populated values from existing job
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      benefits: JobPsot.benefits, // Pre-populate benefits selection
      companyAbout: JobPsot.Company.about, // Pre-populate company description
      companyLocation: JobPsot.Company.location, // Pre-populate company location
      companyName: JobPsot.Company.name, // Pre-populate company name
      companyWebsite: JobPsot.Company.website, // Pre-populate company website
      companyXAccount: JobPsot.Company.xAccount || "", // Pre-populate X account or empty string
      employmentType: JobPsot.employmentType, // Pre-populate employment type
      jobDescription: JobPsot.jobDescription, // Pre-populate job description
      jobTitle: JobPsot.jobTitle, // Pre-populate job title
      location: JobPsot.location, // Pre-populate job location
      salaryFrom: JobPsot.salaryFrom, // Pre-populate minimum salary
      salaryTo: JobPsot.salaryTo, // Pre-populate maximum salary
      companyLogo: JobPsot.Company.logo, // Pre-populate company logo
      listingDuration: JobPsot.listingDuration, // Pre-populate listing duration
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
      await editJobPost(values, JobPsot.id); // Submit data to server action with job ID
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

        {/* Submit button - full width with loading state */}
        <Button
          type="submit"
          className="w-full shadow-sm transition-all duration-200 hover:shadow-md active:translate-y-0.5"
          disabled={pending}
        >
          {pending ? "Submitting..." : "Edit Job Post"}
        </Button>
      </form>
    </Form>
  );
};

export default EditJobForm;
