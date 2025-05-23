"use client";

// Onboarding form container component
// Manages the multi-step onboarding process for new users
// Handles user type selection and renders appropriate form components

import Image from "next/image";
import { useState } from "react";
import Logo from "@/public/icon.png";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Card, CardContent } from "@/components/ui/card";
import UserTypeForm from "./UserTypeForm";
import CompanyForm from "./CompanyForm";
import JobSeekerForm from "./JobSeekerForm";

/**
 * User type definition for onboarding flow
 * Users can be either employers (company) or job seekers
 */
type UserSelectionType = "company" | "jobSeeker" | null;

/**
 * Onboarding Form Container Component
 *
 * This component orchestrates the multi-step onboarding process for new users
 * It manages state transitions between different onboarding steps and forms
 *
 * Features:
 * - Multi-step onboarding flow with state management
 * - User type selection (company vs. job seeker)
 * - Conditional rendering of appropriate forms based on user type
 * - Consistent branding and visual design
 * - Centralized onboarding experience
 *
 * Flow:
 * 1. User selects account type (company or job seeker)
 * 2. Based on selection, appropriate profile form is displayed
 * 3. After form submission, user is redirected to main application
 *
 * This component serves as the container/wrapper for the entire onboarding experience
 */
const OnBoardingForm = () => {
  // State to track current onboarding step
  const [step, setStep] = useState(1);

  // State to track selected user type (company or job seeker)
  const [userType, setUserType] = useState<UserSelectionType>(null);

  /**
   * Handler for user type selection
   * Updates user type state and advances to next step
   *
   * @param type - The selected user type (company or jobSeeker)
   */
  const handleUserTypeSelection = (type: UserSelectionType) => {
    setUserType(type);
    setStep(2); // Advance to profile form step
  };

  /**
   * Renders the appropriate component based on current step
   * Step 1: User type selection
   * Step 2: Company or Job Seeker profile form
   */
  const renderStep = () => {
    switch (step) {
      case 1:
        // Step 1: User type selection form
        return <UserTypeForm onSelect={handleUserTypeSelection} />;
      case 2:
        // Step 2: Appropriate profile form based on user type
        return userType === "company" ? <CompanyForm /> : <JobSeekerForm />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Logo and branding header */}
      <div className="flex items-center gap-4 mb-10">
        <Image
          src={Logo || "/placeholder.svg"}
          alt="Logo"
          width={50}
          height={50}
        />
        <h1 className="text-2xl font-bold">
          <SparklesText text="Job Forge" className="text-2xl font-bold" />
        </h1>
      </div>

      {/* Main card container for onboarding forms */}
      <Card className="max-w-lg w-full">
        <CardContent className="p-6">
          {/* Render current step based on state */}
          {renderStep()}
        </CardContent>
      </Card>
    </>
  );
};

export default OnBoardingForm;
