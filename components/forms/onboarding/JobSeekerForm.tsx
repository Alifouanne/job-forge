"use client";

// Job seeker profile creation form component
// Used during onboarding for job seekers to set up their profile
// Collects personal information and resume for job applications

import { UploadDropzone } from "@/components/general/UploadThing";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createJobSeeker } from "@/lib/actions";
import { jobSeekerSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "@/components/ui/x";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import PdfImage from "@/public/pdf.png";

/**
 * Job Seeker Profile Form Component
 *
 * This form collects essential information during the job seeker onboarding process
 * It validates all inputs and submits data to create a job seeker profile in the database
 *
 * Features:
 * - Form validation with Zod schema
 * - Personal information collection
 * - PDF resume upload functionality
 * - Loading state handling during submission
 * - Error handling for form submission
 * - Visual feedback for uploaded resume
 *
 * User Experience:
 * - Simple, focused form for quick completion
 * - Clear visual indication of resume upload status
 * - Responsive design for all device sizes
 * - Validation feedback for form errors
 */
const JobSeekerForm = () => {
  // Initialize form with Zod validation schema and default empty values
  const form = useForm<z.infer<typeof jobSeekerSchema>>({
    resolver: zodResolver(jobSeekerSchema),
    defaultValues: {
      about: "",
      name: "",
      resume: "",
    },
  });

  // State to track form submission status
  const [pending, setPending] = useState(false);

  /**
   * Form submission handler
   * Submits validated data to server action and handles loading states
   *
   * @param data - Validated job seeker data from the form
   */
  const onSubmit = async (data: z.infer<typeof jobSeekerSchema>) => {
    try {
      setPending(true);
      await createJobSeeker(data);
    } catch (error) {
      // Ignore Next.js redirect "errors" which are actually navigation events
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.log("something went wrong");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Full name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio/about field for personal description */}
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Resume upload field for PDF documents */}
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    // Show PDF icon with delete button if resume is uploaded
                    <div className="relative w-fit">
                      <Image
                        src={PdfImage || "/placeholder.svg"}
                        alt="pdf image"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <Button
                        className="absolute -top-2 -right-2"
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          field.onChange(""); // Clear the resume value
                        }}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    // Show upload dropzone if no resume uploaded yet
                    <UploadDropzone
                      endpoint="resumeUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl); // Set the resume URL after upload
                      }}
                      onUploadError={(err) => console.log(err.message)}
                      className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button - full width with loading state */}
        <Button disabled={pending} type="submit" className="w-full">
          {pending ? "Submiting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default JobSeekerForm;
