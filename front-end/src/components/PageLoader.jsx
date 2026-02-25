/**
 * PageLoader.jsx — Full-Page Loading Spinner
 *
 * A simple full-viewport centred spinner rendered by App.jsx while the
 * initial authentication check (GET /api/auth/check) is in flight.
 *
 * Shown only when `isCheckingAuth` is true in useAuthStore. Once the
 * check resolves (success or failure), this component is replaced by the
 * appropriate page (ChatPage or LoginPage via router redirect).
 *
 * Uses the Lucide `LoaderIcon` with a Tailwind `animate-spin` class.
 */
import { LoaderIcon } from "lucide-react";
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon className="size-10 animate-spin" />
    </div>
  );
}
export default PageLoader;
