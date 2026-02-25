/**
 * App.jsx — Root Application Component & Router
 *
 * The top-level React component that wires together routing, authentication
 * session restoration, and the global toast notification system.
 *
 * Behaviour on mount:
 *  Calls checkAuth() once to hit GET /api/auth/check. If the JWT cookie is
 *  still valid the server returns the user object and authUser is set in the
 *  store. While this request is in flight, a full-screen PageLoader spinner
 *  is shown instead of any page content.
 *
 * Routes:
 *  /        → ChatPage    (authenticated users only; redirects to /login otherwise)
 *  /login   → LoginPage   (unauthenticated only; redirects to / if already logged in)
 *  /signup  → SignUpPage  (unauthenticated only; redirects to / if already logged in)
 *
 * Global UI:
 *  <Toaster /> — renders react-hot-toast notifications anywhere in the app.
 *  Decorative background grid and glow blobs are rendered here so they appear
 *  behind all pages.
 */
import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  // Read the auth state and the checkAuth action from the store
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  // On first render, call checkAuth() to check if the user is still logged in
  // (it reads the JWT cookie and returns the user from the server)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // only runs once on mount (checkAuth is stable)

  // While we're waiting for the auth check response, show a full-screen spinner
  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">

      {/* Background decorations — a grid pattern and two soft glow blobs */}
      {/* These are absolutely positioned so they appear behind all page content */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      {/* React Router — handles which page to show based on the URL */}
      <Routes>
        {/* "/" — show ChatPage if logged in, otherwise redirect to /login */}
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to={"/login"} />}
        />
        {/* "/login" — show LoginPage if NOT logged in, otherwise redirect to / */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        {/* "/signup" — show SignUpPage if NOT logged in, otherwise redirect to / */}
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
      </Routes>

      {/* Toaster renders toast notifications (success/error popups) from anywhere in the app */}
      <Toaster />
    </div>
  );
}
export default App;
