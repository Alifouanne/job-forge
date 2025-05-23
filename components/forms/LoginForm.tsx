// Login form component for social authentication
// Provides GitHub and Google login options with server-side authentication
// Handles session checking and redirection for authenticated users

import Image from "next/image";
import Github from "@/public/Github_dark.svg";
import Google from "@/public/google.svg";
import { auth, signIn } from "@/lib/auth";
import { GeneralSubmitButton } from "../general/SubmitButtons";
import { redirect } from "next/navigation";

/**
 * Login Form Component
 *
 * This server component handles user authentication through social providers
 * It checks for existing sessions and provides GitHub and Google login options
 *
 * Features:
 * - Session verification to prevent authenticated users from seeing login form
 * - GitHub authentication integration with server action
 * - Google authentication integration with server action
 * - Optimized loading of provider logos with Next.js Image component
 * - Terms of service and privacy policy notice
 * - Responsive design with consistent styling
 *
 * Authentication Flow:
 * 1. Check if user is already authenticated
 * 2. If authenticated, redirect to onboarding page
 * 3. If not authenticated, display login options
 * 4. When user selects a provider, trigger server action for authentication
 * 5. After successful authentication, user is redirected by the auth system
 */
const LoginForm = async () => {
  // Check if user is already authenticated
  // This prevents authenticated users from seeing the login form
  const session = await auth();
  if (session?.user) {
    // Redirect authenticated users to onboarding page
    // This ensures users don't get stuck in an authentication loop
    return redirect("/onboarding");
  }

  return (
    <div className="space-y-6">
      {/* Header section with welcome message */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">
          Login with your Google or Github account
        </p>
      </div>

      {/* Authentication provider buttons */}
      <div className="space-y-3">
        {/* GitHub authentication form with server action */}
        <form
          action={async () => {
            "use server";
            await signIn("github"); // Trigger GitHub OAuth flow
          }}
        >
          <GeneralSubmitButton
            text="Login with Github"
            variant="outline"
            className="w-full h-11 hover:bg-secondary transition-colors"
            icon={
              <Image
                src={Github || "/placeholder.svg"}
                alt="Github icon"
                className="size-5"
                priority // Load with high priority as it's above the fold
              />
            }
          />
        </form>

        {/* Google authentication form with server action */}
        <form
          action={async () => {
            "use server";
            await signIn("google"); // Trigger Google OAuth flow
          }}
        >
          <GeneralSubmitButton
            text="Login with Google"
            variant="outline"
            className="w-full h-11 hover:bg-secondary transition-colors"
            icon={
              <Image
                src={Google || "/placeholder.svg"}
                alt="Google icon"
                className="size-5"
                priority // Load with high priority as it's above the fold
              />
            }
          />
        </form>
      </div>

      {/* Terms of service and privacy policy notice */}
      {/* Informs users about legal agreements when using the service */}
      <p className="text-center text-xs text-muted-foreground max-w-xs mx-auto">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy
      </p>
    </div>
  );
};

export default LoginForm;
