
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Chatbot from "./pages/chatbot";
import Tracker from "./pages/Tracker";
import Journal from "./pages/journal";
import JournalHistory from "./pages/Journalhistory";
import Music from "./pages/music";
import Relax from "./pages/relax";
import Help from "./pages/Help";
import Test from "./pages/test";
import DoctorChat from "./pages/DoctorChat";
// import VoiceChat from "./pages/VoiceChat";
import BookingHistory from "./pages/BookingHistory";


// Loading Component
const Loading = () => (
  <div className="loading-screen">
    <p>Loading MindCare...</p>
  </div>
);

// Protected Route - Only for logged-in users
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loading />;

  return user ? children : <Navigate to="/" replace />;
};

// Public Route - Redirect to home if already logged in
const PublicRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loading />;

  return user ? <Navigate to="/home" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          }
        />
        // In App.js
<Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
        <Route
          path="/journal-history"
          element={
            <ProtectedRoute>
              <JournalHistory />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/voice-chat" element={<ProtectedRoute><VoiceChat /></ProtectedRoute>} /> */}
        <Route
          path="/music"
          element={
            <ProtectedRoute>
              <Music />
            </ProtectedRoute>
          }
        />
        <Route path="/bookinghistory" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
        <Route
          path="/Relax"
          element={
            <ProtectedRoute>
              <Relax />
            </ProtectedRoute>
          }
        />
         <Route
          path="/DoctorChat"
          element={
            <ProtectedRoute>
              <DoctorChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


