import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  List,
  ListItem,
  Link as MuiLink,
} from "@mui/material";

function JournalForm({ token, onEntryCreated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (text.trim().length < 10) {
      setError("Entry must be at least 10 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to create entry");
      const data = await res.json();
      setSuccess("Entry saved!");
      setText("");
      setAnalysis({
        mood: data.mood,
        sentiment: data.sentiment,
        themes: data.themes,
        calmingMessage: data.calmingMessage || "Remember to take a moment for yourself.",
      });
      setRecommendations(data.recommendations || []);
      onEntryCreated();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" component="h3">
          Write a new journal entry:
        </Typography>

        <TextField
          multiline
          minRows={5}
          variant="outlined"
          fullWidth
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>

      {analysis && (
        <Paper
          elevation={2}
          sx={{ maxWidth: 600, mx: "auto", mt: 3, p: 3, bgcolor: "#e6f0f8", borderRadius: 2 }}
        >
          <Typography variant="body1" fontStyle="italic" mb={1}>
            {analysis.calmingMessage}
          </Typography>
          <Typography>
            <strong>Mood:</strong> {analysis.mood}
          </Typography>
          <Typography>
            <strong>Sentiment:</strong> {analysis.sentiment}
          </Typography>
          <Typography>
            <strong>Themes:</strong> {analysis.themes.join(", ")}
          </Typography>
        </Paper>
      )}

      {recommendations.length > 0 && (
        <Paper
          elevation={2}
          sx={{ maxWidth: 600, mx: "auto", mt: 3, p: 3, bgcolor: "#f0f4f8", borderRadius: 2 }}
        >
          <Typography variant="h6" mb={2}>
            Recommended Resources
          </Typography>
          <List>
            {recommendations.map((rec, idx) => (
              <ListItem key={idx} sx={{ flexDirection: "column", alignItems: "flex-start", mb: 1 }}>
                <MuiLink href={rec.url} target="_blank" rel="noopener noreferrer" fontWeight="bold">
                  {rec.title}
                </MuiLink>
                <Typography variant="body2" color="text.secondary">
                  {rec.description}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </>
  );
}

export default JournalForm;
