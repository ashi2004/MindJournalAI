import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";

function MoodCalendar({ token }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(new Date()); // Selected date
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/journal?page=1&limit=9999`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data = await res.json();
        setEntries(data.entries || []);
      } catch {
        setEntries([]);
      }
      setLoading(false);
    }
    fetchEntries();
  }, [token]);

  // Aggregate mood emojis per date and find dominant emoji for the day
  const dayEmojiCounts = {}; // { 'dateStr' : { emoji: count, ... } }
  entries.forEach(({ entryDate, emoji }) => {
    const dateStr = new Date(entryDate).toDateString();
    if (!dayEmojiCounts[dateStr]) dayEmojiCounts[dateStr] = {};
    const em = emoji || "🙂";
    dayEmojiCounts[dateStr][em] = (dayEmojiCounts[dateStr][em] || 0) + 1;
  });

  // Find dominant emoji per day
  const dominantEmojiPerDay = {};
  Object.entries(dayEmojiCounts).forEach(([dateStr, emojiCount]) => {
    const sorted = Object.entries(emojiCount).sort((a, b) => b[1] - a[1]);
    dominantEmojiPerDay[dateStr] = sorted[0][0]; // most frequent emoji
  });

  // Details of entries for selected date
  const selectedDateStr = value.toDateString();
  const entriesForSelectedDate = entries.filter(
    (e) => new Date(e.entryDate).toDateString() === selectedDateStr
  );

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Mood Calendar
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ "& .react-calendar": { borderRadius: 2, boxShadow: 3 } }}>
          <Calendar
            onChange={setValue}
            value={value}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const emoji = dominantEmojiPerDay[date.toDateString()];
                if (emoji) {
                  return (
                    <Typography
                      sx={{ fontSize: 18, textAlign: "center", mt: 0.5 }}
                      title={`Mood: ${emoji}`}
                    >
                      {emoji}
                    </Typography>
                  );
                }
              }
              return null;
            }}
          />
        </Box>
      )}

      {entriesForSelectedDate.length > 0 ? (
        <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom>
            Entries on {value.toLocaleDateString()}
          </Typography>
          {entriesForSelectedDate.map((entry) => (
            <Box key={entry._id} sx={{ mb: 3 }}>
              <Typography>
                <strong>Emoji:</strong> {entry.emoji || "🙂"} &nbsp;&nbsp;
                <strong>Mood:</strong> {entry.mood}
              </Typography>
              <Typography>
                <strong>Sentiment:</strong> {entry.sentiment}
              </Typography>
              <Typography>
                <strong>Themes:</strong> {entry.themes.join(", ")}
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>{entry.text}</Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Paper>
      ) : (
        <Typography sx={{ mt: 3, textAlign: "center", fontStyle: "italic" }}>
          Select a date with an entry to see details
        </Typography>
      )}
    </Box>
  );
}

export default MoodCalendar;
