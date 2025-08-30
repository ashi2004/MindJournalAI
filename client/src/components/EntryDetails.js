import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchEntry() {
      setLoading(true);
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
  }, [id, token]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        {error}
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
    </Paper>
  );
}

export default EntryDetails;
