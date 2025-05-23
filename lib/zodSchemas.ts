import { z } from "zod";
export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(1, "Location must be defined"),
  about: z
    .string()
    .min(10, "please provide some infprmation about your company"),
  logo: z.string().min(1, "please upload a logo"),
  website: z.string().url("please enter a valid URL"),
  xAccount: z.string().optional(),
});

export const jobSeekerSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters"),
  about: z.string().min(10, "please provide more information about yourself"),
  resume: z.string().min(1, "please upload you resume"),
});

export const jobSchema = z.object({
  jobTitle: z.string().min(2, "job title must be at least to characters long"),
  employmentType: z.string().min(1, "Please select an employment type"),
  location: z.string().min(1, "please select the location"),
  salaryFrom: z.number().min(1, "Salary from is required"),
  salaryTo: z.number().min(1, "Salary to is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  listingDuration: z.number().min(1, "listing duration is required"),
  benefits: z.array(z.string().min(1, "please select at least one benefit")),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyLocation: z.string().min(1, "Company Location must be defined"),
  companyAbout: z
    .string()
    .min(10, "please provide some infprmation about your company"),
  companyLogo: z.string().min(1, "please upload a logo"),
  companyWebsite: z.string().url("please enter a valid URL"),
  companyXAccount: z.string().optional(),
});
