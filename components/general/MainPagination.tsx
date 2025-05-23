"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Props interface for the MainPagination component
 */
interface Props {
  /** Total number of pages available for navigation */
  totalPages: number;
  /** Current active page number (1-based) */
  currentPage: number;
}

/**
 * Main Pagination Component
 *
 * This component provides navigation controls for multi-page content
 * It intelligently handles large page counts with ellipsis for better UX
 *
 * Features:
 * - Smart pagination with ellipsis for large page counts
 * - URL-based state management for shareable/bookmarkable pages
 * - Previous/Next buttons for sequential navigation
 * - Active page highlighting
 * - Disabled state for boundary conditions (first/last page)
 * - Preserves other URL parameters during navigation
 *
 * Pagination Display Logic:
 * - For 5 or fewer pages: Show all page numbers
 * - For more than 5 pages:
 *   1. When near the start: Show first 3 pages, ellipsis, last page
 *   2. When near the end: Show first page, ellipsis, last 3 pages
 *   3. When in the middle: Show first page, ellipsis, current page and neighbors, ellipsis, last page
 *
 * @param currentPage - The currently active page number
 * @param totalPages - The total number of pages available
 */
const MainPagination = ({ currentPage, totalPages }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  /**
   * Handles page navigation while preserving other URL parameters
   * Updates the URL with the new page number and triggers navigation
   *
   * @param page - The page number to navigate to
   */
  const handlePageChange = (page: number) => {
    // Create a copy of current search parameters
    const params = new URLSearchParams(searchParams.toString());
    // Update or add the page parameter
    params.set("page", page.toString());
    // Navigate to the new URL with updated parameters
    router.push(`?${params.toString()}`);
  };

  /**
   * Generates pagination items based on current page and total pages
   * Implements smart pagination with ellipsis for better UX with many pages
   *
   * @returns Array of page numbers and null values (for ellipsis)
   */
  const generatePaginationItems = () => {
    const items = [];

    // Case 1: 5 or fewer total pages - show all page numbers
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Case 2: More than 5 pages - use smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near the start: Show first 3 pages, ellipsis, last page
        for (let i = 1; i <= 3; i++) {
          items.push(i);
        }
        items.push(null); // Ellipsis
        items.push(totalPages); // Last page
      } else if (currentPage >= totalPages - 2) {
        // Near the end: Show first page, ellipsis, last 3 pages
        items.push(1); // First page
        items.push(null); // Ellipsis
        for (let i = totalPages - 2; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        // In the middle: Show first page, ellipsis, current page and neighbors, ellipsis, last page
        items.push(1); // First page
        items.push(null); // Ellipsis
        items.push(currentPage - 1); // Page before current
        items.push(currentPage); // Current page
        items.push(currentPage + 1); // Page after current
        items.push(null); // Ellipsis
        items.push(totalPages); // Last page
      }
    }

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous page button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
            // Disable when on first page
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* Page number buttons with ellipsis */}
        {generatePaginationItems().map((page, index) =>
          page === null ? (
            // Render ellipsis for null values
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            // Render page number links
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
                isActive={page === currentPage} // Highlight current page
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next page button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
            // Disable when on last page
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default MainPagination;
