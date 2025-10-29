import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

function JournalEntryCard({ entry, token, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(entry.text);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  async function handleSave() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/journal/${entry._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to update entry");
      const updated = await res.json();
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/journal/${entry._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete entry");
      await res.json();
      onDelete(entry._id);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (isEditing) {
    return (
      <Card variant="outlined" sx={{ m: 1, p: 1 }}>
        <CardContent>
          <TextField
            label="Journal Entry"
            multiline
            minRows={4}
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
        <CardActions>
          <Button
            onClick={handleSave}
            disabled={loading}
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#4caf50", color: "#fff", "&:hover": { backgroundColor: "#45a049" } }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={() => setIsEditing(false)}
            disabled={loading}
            size="small"
            sx={{ backgroundColor: "#9e9e9e", color: "#fff", "&:hover": { backgroundColor: "#757575" } }}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ m: 1, p: 1 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {new Date(entry.entryDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          <strong>Text: </strong>
          {entry.text}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Mood:</strong> {entry.mood}
        </Typography>
        <Typography variant="body2">
          <strong>Sentiment:</strong> {entry.sentiment}
        </Typography>
        <Typography variant="body2">
          <strong>Themes:</strong> {entry.themes.join(", ")}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
      <CardActions>
        <Button
          onClick={() => setIsEditing(true)}
          size="small"
          sx={{ backgroundColor: "#2196f3", color: "#fff", "&:hover": { backgroundColor: "#1976d2" } }}
        >
          Edit
        </Button>
        {/* <Button
          onClick={handleDelete}
          disabled={loading}
          size="small"
          sx={{ backgroundColor: "#f44336", color: "#fff", "&:hover": { backgroundColor: "#d32f2f" } }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button> */}
      </CardActions>
    </Card>
  );
}

export default JournalEntryCard;
