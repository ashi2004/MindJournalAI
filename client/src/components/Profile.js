import React, { useState, useEffect } from "react";
import ChangePassword from "./ChangePassword";
import { Box, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";

function Profile({ token }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_BASE}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setUsername(data.username);
        setEmail(data.email);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Box sx={{ textAlign: "center", mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" component="h2" mb={3} textAlign="center">
          Your Profile
        </Typography>

        <TextField
          label="Username"
          type="text"
          fullWidth
          required
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={saving}
          sx={{ mt: 2 }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>

        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </form>

      {/* Pass token prop to ChangePassword */}
      <ChangePassword token={token} />
    </Box>
  );
}

export default Profile;
