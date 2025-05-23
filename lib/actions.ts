"use server";

// Server actions file containing all main backend functionality for Job Forge
// Handles user onboarding, job management, payment processing, and security
// Uses comprehensive validation, authentication, and rate limiting

import { signOut } from "@/lib/auth";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import arcjet, { detectBot, shield } from "./arcjet";
import { reqUser } from "./auth";
import { prisma } from "./db";
import { inngest } from "./inngest/client";
import { jobListingPricing } from "./jobListingPricing";
import { stripe } from "./stripe";
import { companySchema, jobSchema, jobSeekerSchema } from "./zodSchemas";

/**
 * Configure Arcjet security rules for all server actions
 * Provides comprehensive protection against malicious requests
 */
const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE", // Active protection against common attacks
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [], // Block all bots for server actions
    })
  );

/**
 * Creates a company profile during user onboarding
 * Validates company data and updates user type to COMPANY
 *
 * @param data - Company information validated against companySchema
 * @returns Redirects to homepage after successful creation
 */
export async function createCompany(data: z.infer<typeof companySchema>) {
  // Ensure user is authenticated
  const session = await reqUser();

  // Apply security protection
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Validate input data against schema
  const validateData = companySchema.parse(data);

  // Update user record with company profile and mark onboarding complete
  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      onBoardingCompleted: true,
      userType: "COMPANY", // Set user type for role-based access
      Company: {
        create: {
          ...validateData, // Create associated company record
        },
      },
    },
  });

  return redirect("/");
}

/**
 * Creates a job seeker profile during user onboarding
 * Validates job seeker data and updates user type to JOB_SEEKER
 *
 * @param data - Job seeker information validated against jobSeekerSchema
 * @returns Redirects to homepage after successful creation
 */
export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  // Ensure user is authenticated
  const session = await reqUser();

  // Apply security protection
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Validate input data against schema
  const validateData = jobSeekerSchema.parse(data);

  // Update user record with job seeker profile and mark onboarding complete
  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      onBoardingCompleted: true,
      userType: "JOB_SEEKER", // Set user type for role-based access
      JobSeeker: {
        create: {
          ...validateData, // Create associated job seeker record
        },
      },
    },
  });

  return redirect("/");
}

/**
 * Creates a new job posting with payment processing
 * Handles Stripe customer creation, job creation, and payment session setup
 *
 * @param data - Job posting data validated against jobSchema
 * @returns Redirects to Stripe checkout for payment
 */
export async function createJob(data: z.infer<typeof jobSchema>) {
  // Ensure user is authenticated
  const user = await reqUser();

  // Validate job posting data
  const validatedData = jobSchema.parse(data);

  // Fetch company information and Stripe customer ID
  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  // Ensure user has a company profile
  if (!company?.id) {
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;

  // Create Stripe customer if doesn't exist
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: user.name || undefined,
    });

    stripeCustomerId = customer.id;

    // Update user record with Stripe customer ID for future use
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  // Create job posting in database
  const jobPost = await prisma.jobPost.create({
    data: {
      companyId: company.id,
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
  });

  // Schedule job expiration using background job processing
  await inngest.send({
    name: "job/created",
    data: {
      jobId: jobPost.id,
      expirationDays: validatedData.listingDuration,
    },
  });

  // Find pricing tier based on listing duration
  const pricingTier = jobListingPricing.find(
    (tier) => tier.days === validatedData.listingDuration
  );

  if (!pricingTier) {
    throw new Error("Invalid listing duration selected");
  }

  // Create Stripe checkout session for payment
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://7yzrxbvb5k.ufs.sh/f/GeCjxv6BAYhsFXxJ8OOKbd4YiQBlDjqw0z61IWZaJt8GKvHc",
            ],
          },
          currency: "USD",
          unit_amount: pricingTier.price * 100, // Convert dollars to cents for Stripe
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      jobId: jobPost.id, // Store job ID for webhook processing
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  // Redirect to Stripe checkout
  return redirect(session.url as string);
}

/**
 * Saves a job posting to user's favorites
 * Creates a saved job record for the authenticated user
 *
 * @param jobId - The ID of the job to save
 */
export async function saveJobPost(jobId: string) {
  // Ensure user is authenticated
  const user = await reqUser();

  // Apply security protection
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Create saved job record
  await prisma.savedJobPost.create({
    data: {
      jobPostId: jobId,
      userId: user.id as string,
    },
  });

  // Revalidate the job page to update save button state
  revalidatePath(`/job/${jobId}`);
}

/**
 * Removes a job posting from user's favorites
 * Deletes the saved job record for the authenticated user
 *
 * @param savedJobPostId - The ID of the saved job record to delete
 */
export async function unSaveJobPost(savedJobPostId: string) {
  // Ensure user is authenticated
  const user = await reqUser();

  // Apply security protection
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Delete saved job record and get job ID for revalidation
  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      userId: user.id, // Ensure user owns the saved job
    },
    select: {
      jobPostId: true,
    },
  });

  // Revalidate the job page to update save button state
  revalidatePath(`/job/${data.jobPostId}`);
}

/**
 * Updates an existing job posting
 * Validates data and ensures user owns the job being edited
 *
 * @param data - Updated job data validated against jobSchema
 * @param jobId - The ID of the job to update
 * @returns Redirects to my-jobs page after successful update
 */
export async function editJobPost(
  data: z.infer<typeof jobSchema>,
  jobId: string
) {
  // Apply security protection
  const req = await request();
  const user = await reqUser();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Validate updated job data
  const validateData = jobSchema.parse(data);

  // Update job posting with authorization check
  await prisma.jobPost.update({
    where: {
      id: jobId,
      Company: {
        userId: user.id, // Ensure user owns the job being edited
      },
    },
    data: {
      jobDescription: validateData.jobDescription,
      jobTitle: validateData.jobTitle,
      employmentType: validateData.employmentType,
      location: validateData.location,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      listingDuration: validateData.listingDuration,
      benefits: validateData.benefits,
    },
  });

  return redirect("/my-jobs");
}

/**
 * Deletes a job posting
 * Removes job from database and cancels scheduled expiration
 *
 * @param jobId - The ID of the job to delete
 * @returns Redirects to my-jobs page after successful deletion
 */
export async function deleteJobPost(jobId: string) {
  // Ensure user is authenticated
  const session = await reqUser();

  // Apply security protection
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Delete job posting with authorization check
  await prisma.jobPost.delete({
    where: {
      id: jobId,
      Company: {
        userId: session.id, // Ensure user owns the job being deleted
      },
    },
  });

  // Cancel scheduled job expiration
  await inngest.send({
    name: "job/cancel.expiration",
    data: {
      jobId: jobId,
    },
  });

  return redirect("/my-jobs");
}

/**
 * Handles user sign out
 * Securely logs out the user and redirects to homepage
 *
 * @returns Redirects to homepage after sign out
 */
export async function handleSignOut() {
  // Ensure user is authenticated
  const session = await reqUser();

  // Apply security protection
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Sign out user and redirect
  return signOut({ redirectTo: "/" });
}
