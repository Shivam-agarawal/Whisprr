import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Chatpage from "./pages/Chatpage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

function App() {
  // TODO: replace with real auth state
  const authUser = null;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">

      {/* Routes overlayed in same layout */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Chatpage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
