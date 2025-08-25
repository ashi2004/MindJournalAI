import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import JournalFeed from "./components/JournalFeed";
import JournalForm from "./components/JournalForm";
import Profile from "./components/Profile";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Dashboard from "./components/Dashboard";
import { getToken, removeToken } from "./auth";
import EntryDetails from "./components/EntryDetails";

// import "./App.css"; 

function HomePage() {
  return (
    <div>
      <h1>Welcome to MindJournalAI!</h1>
      <p>Track your mood, write journals, and see analytics. Use the navigation to explore features.</p>
    </div>
  );
}

function WelcomeGuest() {
  return (
    <div>
      <h2>Welcome!</h2>
      <p>Please login or register to begin using MindJournalAI.</p>
    </div>
  );
}

function AppContent({ token, setToken }) {
  const [refreshFeed, setRefreshFeed] = useState(0);
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
    setToken(null);
    navigate("/login");
  }
  function handleAuthSuccess() {
    setTimeout(() => {
      const t = getToken();
      setToken(t);
      navigate("/"); // Go to home page after login
    }, 50);
  }

  return (
    <>
      <nav style={{
        display: "flex",
        alignItems: "center",
        background: "#a66ca4ff",
        padding: "16px 24px",
        color: "white",
        gap: "20px"
      }}>
        <span style={{ fontWeight: "bold", fontSize: "22px" }}>MindJournalAI</span>
        {!token ? (
          <>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/register"><button>Sign Up</button></Link>
          </>
        ) : (
          <>
            <Link to="/"><button>Home</button></Link>
            <Link to="/dashboard"><button>Dashboard</button></Link>
            <Link to="/journal"><button>New Entry</button></Link>
            <Link to="/history"><button>History</button></Link>
            <Link to="/profile"><button>Profile</button></Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <div style={{ maxWidth: 900, margin: "auto", minHeight: "70vh", padding: "24px" }}>
        <Routes>
          {/* Home/Landing */}
          <Route path="/" element={token ? <HomePage /> : <WelcomeGuest />} />
          {/* Authentication */}
          <Route path="/login" element={
            token ? <Navigate to="/" /> : <Login onLoginSuccess={handleAuthSuccess} />
          } />
          <Route path="/register" element={
            token ? <Navigate to="/" /> : <Register onRegisterSuccess={handleAuthSuccess} />
          } />
          {/* Dashboard (Analytics) */}
          <Route path="/dashboard" element={
            token ? <Dashboard token={token} /> : <Navigate to="/login" />
          } />
          {/* Journal New Entry */}
          <Route path="/journal" element={
            token ? <JournalForm token={token} onEntryCreated={() => setRefreshFeed(r => r + 1)} /> : <Navigate to="/login" />
          } />
          {/* History/Feed (All Entries + Pagination) */}
          <Route path="/history" element={
            token ? <JournalFeed token={token} refreshFeed={refreshFeed} /> : <Navigate to="/login" />
          } />
          {/* Profile */}
          <Route path="/profile" element={
            token ? <Profile token={token} /> : <Navigate to="/login" />
          } />
          {/* EntryDetails */}
          <Route path="/entry/:id" element={
  token ? <EntryDetails token={token} /> : <Navigate to="/login" />
} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  useEffect(() => {
    const t = getToken();
    if (t) setToken(t);
    setLoadingAuthState(false);
  }, []);

  if (loadingAuthState) return <p>Loading...</p>;

  return (
    <Router>
      <AppContent token={token} setToken={setToken} />
    </Router>
  );
}

export default App;
