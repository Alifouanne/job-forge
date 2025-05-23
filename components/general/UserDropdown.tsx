import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LayersIcon } from "../ui/layers";
import { HandHeartIcon } from "../ui/hand-heart";
import { LogoutIcon } from "../ui/logout";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { ArrowDownIcon } from "../ui/arrow-down";

/**
 * Props interface for the UserDropdown component
 */
interface Props {
  /** User's email address for display in the dropdown */
  email: string;
  /** User's display name for the dropdown and avatar fallback */
  name: string;
  /** URL to the user's profile image for the avatar */
  image: string;
}

/**
 * User Dropdown Component
 *
 * This component provides a dropdown menu for authenticated users
 * with access to profile information and key user actions
 *
 * Features:
 * - User avatar display with image or fallback initial
 * - User information display (name and email)
 * - Navigation to saved favorite jobs
 * - Navigation to user's job listings (for employers)
 * - Secure logout functionality with server action
 * - Consistent styling with the application design system
 * - Dropdown positioning with proper alignment
 *
 * Accessibility:
 * - Keyboard navigable dropdown menu
 * - Proper ARIA attributes through shadcn/ui components
 * - Visual indicators for interactive elements
 * - Focus management for dropdown items
 *
 * @param email - User's email address for display
 * @param image - URL to the user's profile image
 * @param name - User's display name
 */
const UserDropdown = ({ email, image, name }: Props) => {
  return (
    <DropdownMenu>
      {/* Dropdown trigger button with user avatar */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          {/* User avatar with image or fallback initial */}
          <Avatar>
            <AvatarImage
              src={image || "/placeholder.svg"}
              alt="Profile Image"
            />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          {/* Dropdown indicator arrow */}
          <ArrowDownIcon size={16} className="ml-2 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown menu content */}
      <DropdownMenuContent className="w-48 mt-3" align="end">
        {/* User information section */}
        <DropdownMenuLabel className="flex flex-col">
          {/* User name with prominent styling */}
          <span className="text-sm font-medium text-foreground">{name}</span>
          {/* User email with muted styling */}
          <span className="text-xs text-muted-foreground">{email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Navigation options group */}
        <DropdownMenuRadioGroup>
          {/* Favorites link with heart icon */}
          <DropdownMenuItem asChild>
            <Link href="/favorites">
              <HandHeartIcon size={16} className="opacity-60" />
              <span>Favorites Jobs</span>
            </Link>
          </DropdownMenuItem>

          {/* My Job Listings link with layers icon */}
          <DropdownMenuItem asChild>
            <Link href="/my-jobs">
              <LayersIcon size={16} className="opacity-60" />
              <span>My Job Listings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        {/* Logout form with server action */}
        <DropdownMenuItem asChild>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" }); // Secure server-side logout with redirect
            }}
          >
            <button className="flex w-full items-center gap-2">
              <LogoutIcon size={16} className="opacity-60" />
              <span>Logout</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
