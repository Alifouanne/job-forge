"use client";

// Company profile creation form component
// Used during onboarding for employers to set up their company profile
// Collects essential company information for display alongside job listings

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@/lib/zodSchemas";
import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryList } from "@/lib/countriesList";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/general/UploadThing";
import { createCompany } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { XIcon } from "@/components/ui/x";

/**
 * Company Profile Form Component
 *
 * This form collects essential company information during the employer onboarding process
 * It validates all inputs and submits data to create a company profile in the database
 *
 * Features:
 * - Form validation with Zod schema
 * - Country selection dropdown with flags
 * - Rich text area for company description
 * - Image upload for company logo
 * - Loading state handling during submission
 * - Responsive layout for all device sizes
 * - Error handling for form submission
 */
const CompanyForm = () => {
  // Initialize form with Zod validation schema and default empty values
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      about: "",
      location: "",
      logo: "",
      name: "",
      website: "",
      xAccount: "",
    },
  });

  // State to track form submission status
  const [pending, setPending] = useState(false);

  /**
   * Form submission handler
   * Submits validated data to server action and handles loading states
   *
   * @param data - Validated company data from the form
   */
  const onSubmit = async (data: z.infer<typeof companySchema>) => {
    try {
      setPending(true);
      await createCompany(data);
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
        {/* Company name and location - 2 columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company location field with country dropdown */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Worldwide/Remote option */}
                    <SelectGroup>
                      <SelectLabel>Worldwide</SelectLabel>
                      <SelectItem value="worldwide">
                        <span>🌍</span>
                        <span>Worldwide / Remote</span>
                      </SelectItem>
                    </SelectGroup>

                    {/* Country list with flag emojis */}
                    <SelectGroup>
                      <SelectLabel>Location</SelectLabel>
                      {countryList.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          <span>{country.flagEmoji}</span>
                          <span className="pl-2">{country.name}</span>
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

        {/* Website and X account - 2 columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company website field */}
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* X (Twitter) account field */}
          <FormField
            control={form.control}
            name="xAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X (Twitter) Account</FormLabel>
                <FormControl>
                  <Input placeholder="@companyName" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Company description textarea - full width */}
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your company..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company logo upload - full width */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    // Show uploaded image with delete button if logo exists
                    <div className="relative w-fit">
                      <Image
                        src={field.value || "/placeholder.svg"}
                        alt="Logo"
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
                          field.onChange(""); // Clear the logo value
                        }}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    // Show upload dropzone if no logo uploaded yet
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl); // Set the logo URL after upload
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
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Submiting" : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default CompanyForm;
