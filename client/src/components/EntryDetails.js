
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

function EntryDetails({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if redirected after deletion
  const entryDeleted = location.state?.entryDeleted || false;

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchEntry() {
      setLoading(true);
      setError(""); // Reset error on new fetch
      try {
        const res = await fetch(`${API_BASE}/api/journal/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load entry");
        const data = await res.json();
        setEntry(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchEntry();
  }, [id, token, API_BASE]);

  useEffect(() => {
    if (error && error.includes("Failed to load entry")) {
      const timer = setTimeout(() => {
        navigate("/history");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const res = await fetch(`${API_BASE}/api/journal/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Delete failed");
        alert("Entry deleted successfully");
        // Redirect to journal feed with deletion info in state
        navigate("/history", { state: { entryDeleted: true } });
      } catch (err) {
        alert("Failed to delete entry: " + err.message);
      }
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="info" sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        {entryDeleted ? "Entry deleted." : error} Redirecting to your journal entries...
      </Alert>
    );

  if (!entry)
    return (
      <Typography
        variant="body1"
        sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}
      >
        Entry not found.
      </Typography>
    );

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 700,
        mx: "auto",
        mt: 4,
        p: 4,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Entry Details
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        <strong>Date:</strong> {new Date(entry.entryDate).toLocaleDateString()}
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Mood:</strong> {entry.mood}
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Sentiment:</strong> {entry.sentiment}
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Themes:</strong> {entry.themes.join(", ")}
      </Typography>

      <Box mt={3} mb={2}>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          <strong>Text:</strong> {entry.text}
        </Typography>
      </Box>

      <Button variant="contained" onClick={() => navigate(-1)}>
        Back
      </Button>

      <Button
        variant="outlined"
        color="error"
        onClick={handleDelete}
        sx={{ ml: 2 }}
      >
        Delete Entry
      </Button>
    </Paper>
  );
}

export default EntryDetails;
