// Empty state component for displaying when no content is available
// Provides a consistent, visually appealing placeholder with call-to-action
// Used across the application for zero-state screens like empty lists or search results

import { SearchX } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

/**
 * Props interface for the EmptyState component
 */
interface Props {
  /** Main heading text explaining the empty state */
  title: string;
  /** Descriptive text providing more context about the empty state */
  description: string;
  /** Call-to-action button text */
  buttontext: string;
  /** URL to navigate to when the button is clicked */
  href: string;
}

/**
 * Empty State Component
 *
 * This component provides a consistent, visually appealing placeholder
 * for situations where no content is available to display. It includes
 * explanatory text and a call-to-action button to guide users.
 *
 * Features:
 * - Visually distinct design with dashed border and subtle background
 * - Animated icon with hover effect for visual interest
 * - Customizable title and description text
 * - Configurable call-to-action button with link
 * - Responsive layout that works in various container sizes
 * - Smooth entrance animation for better perceived performance
 *
 * Common Use Cases:
 * - Empty search results
 * - No items in a list (e.g., no saved jobs, no job postings)
 * - First-time user experiences
 * - Filtered content with no matches
 *
 * @param buttontext - Text for the call-to-action button
 * @param description - Descriptive text explaining the empty state
 * @param href - URL to navigate to when the button is clicked
 * @param title - Main heading text for the empty state
 */
const EmptyState = ({ buttontext, description, href, title }: Props) => {
  return (
    <div className="animate-fadeIn flex h-full flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/5 p-8 text-center">
      {/* Icon container with animation */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-inner transition-transform duration-500 hover:scale-110">
        <SearchX className="h-10 w-10 text-primary" />
      </div>

      {/* Text content with title and description */}
      <div className="mt-6 max-w-sm space-y-2">
        <h2 className="text-xl font-medium">{title}</h2>
        <p className="text-balance text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Call-to-action button */}
      <Link
        href={href}
        className={buttonVariants({
          className:
            "mt-8 gap-2 shadow-sm transition-all duration-200 hover:shadow-md active:translate-y-0.5",
        })}
      >
        {buttontext}
      </Link>
    </div>
  );
};

export default EmptyState;
