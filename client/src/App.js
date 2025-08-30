import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


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
      <h2>Welcome to MindJournalAI!</h2>
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
      {/* Material UI AppBar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            MindJournal AI
          </Typography>
          {!token ? (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Sign Up</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={Link} to="/journal">New Entry</Button>
              <Button color="inherit" component={Link} to="/history">History</Button>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Content container */}
      <Box sx={{ maxWidth: 900, mx: "auto", minHeight: "70vh", p: 3 }}>
        <Routes>
          <Route path="/" element={token ? <HomePage /> : <WelcomeGuest />} />
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login onLoginSuccess={handleAuthSuccess} />} />
          <Route path="/register" element={token ? <Navigate to="/" /> : <Register onRegisterSuccess={handleAuthSuccess} />} />
          <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
          <Route path="/journal" element={token ? <JournalForm token={token} onEntryCreated={() => setRefreshFeed(r => r + 1)} /> : <Navigate to="/login" />} />
          <Route path="/history" element={token ? <JournalFeed token={token} refreshFeed={refreshFeed} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <Profile token={token} /> : <Navigate to="/login" />} />
          <Route path="/entry/:id" element={token ? <EntryDetails token={token} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
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
