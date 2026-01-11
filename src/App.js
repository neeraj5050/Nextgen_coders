
import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const Chatbot = lazy(() => import("./pages/chatbot"));
const Tracker = lazy(() => import("./pages/Tracker"));
const Journal = lazy(() => import("./pages/journal"));
const JournalHistory = lazy(() => import("./pages/Journalhistory"));
const Music = lazy(() => import("./pages/music"));
const Relax = lazy(() => import("./pages/relax"));
const Help = lazy(() => import("./pages/Help"));
const Test = lazy(() => import("./pages/test"));
const DoctorChat = lazy(() => import("./pages/DoctorChat"));
const BookingHistory = lazy(() => import("./pages/BookingHistory"));
const Subscription = lazy(() => import("./pages/Subscription"));
const VoiceChat = lazy(() => import("./pages/voicechat"))


const Loading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: '500'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <p>Loading MindCare...</p>
    </div>
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
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        * {
          transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
        }
        button:hover {
          transform: translateY(-2px);
        }
        button:active {
          transform: translateY(0);
        }
      `}</style>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <Router>
      <Suspense fallback={<Loading />}>
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
        <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
        <Route
          path="/journal-history"
          element={
            <ProtectedRoute>
              <JournalHistory />
            </ProtectedRoute>
          }
        />
        <Route path="/voicechat" element={<ProtectedRoute><VoiceChat /></ProtectedRoute>} />
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
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
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
      </Suspense>
    </Router>
    </>
  );
}

export default App;


