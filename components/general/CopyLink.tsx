"use client";

// Copy link component for sharing job URLs
// Provides a dropdown menu item that copies job URLs to the clipboard
// Includes user feedback through toast notifications

import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LinkIcon } from "../ui/link";

/**
 * Props interface for the CopyLink component
 */
interface CopyLinkProps {
  /** The complete URL of the job posting to be copied to clipboard */
  jobUrl: string;
}

/**
 * Copy Link Component
 *
 * This component provides a dropdown menu item that allows users to copy job URLs
 * to their clipboard for easy sharing. It's typically used in job management interfaces
 * where employers need to share job postings with others.
 *
 * Features:
 * - One-click URL copying to clipboard using the Clipboard API
 * - Visual feedback through toast notifications (success/error states)
 * - Consistent styling with other dropdown menu items
 * - Accessible keyboard navigation support
 * - Error handling for browsers that don't support clipboard API
 *
 * Usage:
 * - Commonly used in job listing tables or cards
 * - Part of action menus for job management
 * - Enables easy sharing of job postings via copy/paste
 *
 * @param jobUrl - The complete URL of the job posting to copy
 */
const CopyLink = ({ jobUrl }: CopyLinkProps) => {
  /**
   * Handles copying the job URL to the user's clipboard
   * Uses the modern Clipboard API with fallback error handling
   * Provides user feedback through toast notifications
   */
  const handleCopy = async () => {
    try {
      // Use the Clipboard API to write the job URL to clipboard
      // This is the modern, secure way to handle clipboard operations
      await navigator.clipboard.writeText(jobUrl);

      // Show success notification to confirm the action
      toast.success("URL copied to clipboard");
    } catch (err) {
      // Handle cases where clipboard API fails or is not supported
      // This could happen in older browsers or insecure contexts (non-HTTPS)
      toast.error("Failed to copy URL");
    }
  };

  return (
    <DropdownMenuItem
      className="flex cursor-pointer items-center gap-2"
      onSelect={handleCopy} // Trigger copy action when menu item is selected
    >
      {/* Link icon to visually represent the copy URL action */}
      <LinkIcon size={14} />

      {/* Action label for the menu item */}
      <span>Copy Job Url</span>
    </DropdownMenuItem>
  );
};

export default CopyLink;
